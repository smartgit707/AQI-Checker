import { getAirQualityHistoryForCity, getLatestAirQualityForCity } from '../airQualityService.js';
import { getCityBySlug } from '../cityService.js';
import { extractTimeSeriesFeatures } from './featureEngineering.js';
import { DampedHoltModel } from './forecastModels.js';
import { evaluateModelPerformance } from './validation.js';
import { envCache } from '../../utils/cache.js';

const VALID_HORIZONS = [6, 12, 24, 48];

export async function getCityForecast(citySlug, options = {}) {
  const requestedHours = Number(options.hours) || 24;
  const hoursAhead = VALID_HORIZONS.includes(requestedHours) ? requestedHours : 24;

  const cleanSlug = citySlug.toLowerCase();
  const cacheKey = `forecast_${cleanSlug}_${hoursAhead}h`;
  const cached = envCache.get(cacheKey);
  if (cached) {
    return { ...cached, isCached: true };
  }

  const [city, latestTelemetry, historyData] = await Promise.all([
    getCityBySlug(cleanSlug),
    getLatestAirQualityForCity(cleanSlug),
    getAirQualityHistoryForCity(cleanSlug, '7d')
  ]);

  const historyPoints = historyData?.points || historyData || [];
  const { validSeries, diurnalAdjustments, stats } = extractTimeSeriesFeatures(historyPoints);

  // Check data sufficiency threshold
  if (validSeries.length < 6) {
    return {
      available: false,
      reason: 'INSUFFICIENT_DATA',
      message: 'There is not enough sequential historical data to generate a statistically reliable forecast.',
      city: {
        slug: cleanSlug,
        name: city?.name || cleanSlug.toUpperCase(),
        state: city?.state || 'India'
      },
      currentAQI: latestTelemetry?.aqi ?? null,
      generatedAt: new Date().toISOString()
    };
  }

  // Model Validation (MAE & RMSE calculation)
  const validation = evaluateModelPerformance(validSeries, diurnalAdjustments);

  // Fit Production Model on Complete In-Sample Series
  const model = new DampedHoltModel();
  const fitSummary = model.fit(validSeries, diurnalAdjustments);

  // Start forecast from latest observation or current time
  const lastObservationTime = validSeries[validSeries.length - 1].timestamp;
  const forecastPoints = model.predict(lastObservationTime, hoursAhead, diurnalAdjustments);

  // Determine Forecast Trend Outlook
  const currentAqi = latestTelemetry?.aqi || validSeries[validSeries.length - 1].aqi;
  const avgForecast = forecastPoints.reduce((acc, p) => acc + p.predictedAQI, 0) / forecastPoints.length;
  const delta = avgForecast - currentAqi;

  let outlook = 'Stable';
  let outlookDescription = 'AQI is expected to remain relatively stable over the forecast period.';
  if (delta >= 6) {
    outlook = 'Worsening';
    outlookDescription = `The statistical model projects a rise in particulate concentrations (approx. +${Math.round(delta)} AQI points) over the next ${hoursAhead} hours.`;
  } else if (delta <= -6) {
    outlook = 'Improving';
    outlookDescription = `The statistical model projects an atmospheric clearing trend (approx. ${Math.round(delta)} AQI points) over the next ${hoursAhead} hours.`;
  }

  const payload = {
    available: true,
    city: {
      slug: cleanSlug,
      name: city?.name || cleanSlug.toUpperCase(),
      state: city?.state || 'India',
      coordinates: city?.coordinates || null
    },
    horizonHours: hoursAhead,
    current: {
      aqi: currentAqi,
      category: latestTelemetry?.category || 'Moderate',
      timestamp: lastObservationTime.toISOString()
    },
    outlook: {
      status: outlook,
      delta: Math.round(delta),
      description: outlookDescription
    },
    forecast: forecastPoints,
    model: {
      name: model.name,
      version: model.version,
      type: 'Damped Holt-Winters Linear Exponential Smoothing with Diurnal Weighting',
      parameters: {
        alpha: model.alpha,
        beta: model.beta,
        phi: model.phi
      },
      validation: {
        mae: validation.mae,
        rmse: validation.rmse,
        testObservations: validation.testObservations,
        metricExplanation: 'Mean Absolute Error (MAE) and Root Mean Square Error (RMSE) calculated via walk-forward split against known historical observations.'
      },
      fitSummary
    },
    dataCoverage: {
      observationsCount: stats?.count || validSeries.length,
      historicalSpanDays: 7,
      seriesMeanAQI: stats?.mean,
      stdDev: stats?.stdDev
    },
    disclaimer: 'Forecasts are empirical estimates calculated using sequential historical observations and regional diurnal atmospheric cycles. Actual conditions may vary with local industrial surges or sudden wind shifts.',
    generatedAt: new Date().toISOString()
  };

  // Cache for 15 minutes (900 seconds)
  envCache.set(cacheKey, payload, 900);
  return payload;
}
