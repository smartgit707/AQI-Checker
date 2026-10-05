import { calculateOverallNAQI, getCategoryFromAqi } from '../utils/naqiCalculator.js';

/**
 * Open-Meteo Air Quality & Atmospheric Provider Adapter
 * Uses ECMWF Copernicus Atmosphere Monitoring Service (CAMS) global models.
 * Completely public, legitimate, no key required, sub-hourly updates.
 */

const BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function fetchAirQualityFromProvider(latitude, longitude) {
  const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm2_5,pm10&forecast_hours=12&timezone=Asia%2FKolkata`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo Air Quality API returned HTTP ${res.status}`);
    }

    const json = await res.json();
    return normalizeAirQualityResponse(json);
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[AirQualityProvider Warning] Failed to fetch live data for (${latitude}, ${longitude}): ${error.message}`);
    throw error;
  }
}

/**
 * Fetches real historical air quality from Copernicus CAMS using past_days parameter
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} pastDays (1, 7, 30, or 90)
 */
export async function fetchHistoricalAirQualityFromProvider(latitude, longitude, pastDays = 7) {
  // Cap at 90 days for CAMS public model availability
  const days = Math.min(Math.max(pastDays, 1), 90);
  const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&past_days=${days}&forecast_days=1&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=Asia%2FKolkata`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo Historical AQ API returned HTTP ${res.status}`);
    }

    const json = await res.json();
    return normalizeHistoricalAirQuality(json, days);
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[AirQualityProvider Warning] Failed to fetch historical data: ${error.message}`);
    throw error;
  }
}

/**
 * Normalizes Open-Meteo CAMS response into AeroSense Standard Air Quality Schema
 */
export function normalizeAirQualityResponse(data) {
  const current = data.current || {};

  const rawCO = current.carbon_monoxide;
  const coInMg = rawCO !== undefined && rawCO !== null ? Number((rawCO / 1000).toFixed(2)) : null;

  const pollutantRawValues = {
    'PM2.5': current.pm2_5 !== undefined ? Number(current.pm2_5.toFixed(1)) : null,
    'PM10': current.pm10 !== undefined ? Number(current.pm10.toFixed(1)) : null,
    'NO2': current.nitrogen_dioxide !== undefined ? Number(current.nitrogen_dioxide.toFixed(1)) : null,
    'SO2': current.sulphur_dioxide !== undefined ? Number(current.sulphur_dioxide.toFixed(1)) : null,
    'CO': coInMg,
    'O3': current.ozone !== undefined ? Number(current.ozone.toFixed(1)) : null
  };

  const naqiResult = calculateOverallNAQI(pollutantRawValues);

  const pollutantsList = [
    {
      code: 'PM2.5',
      name: 'Fine Particulate Matter',
      value: pollutantRawValues['PM2.5'] ?? null,
      unit: 'µg/m³',
      limit: 60,
      status: naqiResult.subIndices['PM2.5'] ? getCategoryFromAqi(naqiResult.subIndices['PM2.5']).category : 'Good',
      trend: 'stable',
      desc: 'Fine inhalable combustion particles, vehicle exhaust, and regional aerosols.'
    },
    {
      code: 'PM10',
      name: 'Coarse Particulates',
      value: pollutantRawValues['PM10'] ?? null,
      unit: 'µg/m³',
      limit: 100,
      status: naqiResult.subIndices['PM10'] ? getCategoryFromAqi(naqiResult.subIndices['PM10']).category : 'Good',
      trend: 'stable',
      desc: 'Surface dust, mechanical wear, construction activity, and resuspension.'
    },
    {
      code: 'NO2',
      name: 'Nitrogen Dioxide',
      value: pollutantRawValues['NO2'] ?? null,
      unit: 'µg/m³',
      limit: 80,
      status: naqiResult.subIndices['NO2'] ? getCategoryFromAqi(naqiResult.subIndices['NO2']).category : 'Good',
      trend: 'stable',
      desc: 'High-temperature fossil fuel combustion and traffic emissions.'
    },
    {
      code: 'SO2',
      name: 'Sulfur Dioxide',
      value: pollutantRawValues['SO2'] ?? null,
      unit: 'µg/m³',
      limit: 80,
      status: naqiResult.subIndices['SO2'] ? getCategoryFromAqi(naqiResult.subIndices['SO2']).category : 'Good',
      trend: 'stable',
      desc: 'Heavy fuel combustion from thermal power installations and refineries.'
    },
    {
      code: 'CO',
      name: 'Carbon Monoxide',
      value: pollutantRawValues['CO'] ?? null,
      unit: 'mg/m³',
      limit: 4.0,
      status: naqiResult.subIndices['CO'] ? getCategoryFromAqi(naqiResult.subIndices['CO']).category : 'Good',
      trend: 'stable',
      desc: 'Incomplete combustion in dense automotive transit corridors.'
    },
    {
      code: 'O3',
      name: 'Ground-level Ozone',
      value: pollutantRawValues['O3'] ?? null,
      unit: 'µg/m³',
      limit: 100,
      status: naqiResult.subIndices['O3'] ? getCategoryFromAqi(naqiResult.subIndices['O3']).category : 'Good',
      trend: 'stable',
      desc: 'Photochemical reaction of ambient VOCs and nitrogen oxides under sunlight.'
    }
  ];

  const hourly = [];
  if (data.hourly && Array.isArray(data.hourly.time)) {
    const times = data.hourly.time.slice(0, 7);
    const pm25Values = data.hourly.pm2_5 || [];
    times.forEach((t, idx) => {
      const dateObj = new Date(t);
      const hourStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
      const pmVal = pm25Values[idx] || pollutantRawValues['PM2.5'] || 40;
      const hourAqi = calculateOverallNAQI({ 'PM2.5': pmVal }).aqi;
      hourly.push({
        time: hourStr,
        aqi: hourAqi
      });
    });
  }

  return {
    aqi: naqiResult.aqi,
    category: naqiResult.category,
    dominantPollutant: naqiResult.dominantPollutant,
    timestamp: current.time ? new Date(current.time).toISOString() : new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    pollutants: pollutantsList,
    hourlyForecast: hourly.length > 0 ? hourly : null,
    source: {
      name: 'Copernicus Atmospheric Monitoring Service (CAMS) / Open-Meteo',
      standard: 'India NAQI (CPCB Calculated)',
      provider: 'European Centre for Medium-Range Weather Forecasts (ECMWF)',
      type: 'Atmospheric Sensor & Satellite Assimilation'
    },
    isLive: true
  };
}

/**
 * Aggregates hourly CAMS history into clean daily or hourly records
 */
export function normalizeHistoricalAirQuality(data, pastDays) {
  const hourly = data.hourly || {};
  const times = hourly.time || [];
  const pm25 = hourly.pm2_5 || [];
  const pm10 = hourly.pm10 || [];
  const no2 = hourly.nitrogen_dioxide || [];
  const so2 = hourly.sulphur_dioxide || [];
  const o3 = hourly.ozone || [];
  const co = hourly.carbon_monoxide || [];

  if (pastDays === 1) {
    // 24H hourly view
    const points = [];
    const count = Math.min(times.length, 24);
    const startIdx = Math.max(0, times.length - count);

    for (let i = startIdx; i < times.length; i++) {
      const polMap = {
        'PM2.5': pm25[i],
        'PM10': pm10[i],
        'NO2': no2[i],
        'SO2': so2[i],
        'CO': co[i] ? co[i] / 1000 : null,
        'O3': o3[i]
      };
      const computed = calculateOverallNAQI(polMap);
      const d = new Date(times[i]);
      points.push({
        time: d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        timestamp: times[i],
        aqi: computed.aqi,
        category: computed.category,
        dominantPollutant: computed.dominantPollutant,
        pollutants: {
          pm25: pm25[i] ? Number(pm25[i].toFixed(1)) : null,
          pm10: pm10[i] ? Number(pm10[i].toFixed(1)) : null,
          no2: no2[i] ? Number(no2[i].toFixed(1)) : null,
          so2: so2[i] ? Number(so2[i].toFixed(1)) : null,
          o3: o3[i] ? Number(o3[i].toFixed(1)) : null
        }
      });
    }
    return points;
  }

  // Daily aggregated view for 7d, 30d, 90d
  const dailyBuckets = {};

  for (let i = 0; i < times.length; i++) {
    const day = times[i].split('T')[0];
    if (!dailyBuckets[day]) {
      dailyBuckets[day] = {
        pm25: [],
        pm10: [],
        no2: [],
        so2: [],
        o3: [],
        co: []
      };
    }
    if (pm25[i] != null) dailyBuckets[day].pm25.push(pm25[i]);
    if (pm10[i] != null) dailyBuckets[day].pm10.push(pm10[i]);
    if (no2[i] != null) dailyBuckets[day].no2.push(no2[i]);
    if (so2[i] != null) dailyBuckets[day].so2.push(so2[i]);
    if (o3[i] != null) dailyBuckets[day].o3.push(o3[i]);
    if (co[i] != null) dailyBuckets[day].co.push(co[i] / 1000);
  }

  const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

  const points = Object.entries(dailyBuckets).map(([date, b]) => {
    const avgMap = {
      'PM2.5': avg(b.pm25),
      'PM10': avg(b.pm10),
      'NO2': avg(b.no2),
      'SO2': avg(b.so2),
      'CO': avg(b.co),
      'O3': avg(b.o3)
    };
    const computed = calculateOverallNAQI(avgMap);
    return {
      date,
      timestamp: `${date}T12:00:00Z`,
      aqi: computed.aqi,
      category: computed.category,
      dominantPollutant: computed.dominantPollutant,
      pollutants: {
        pm25: avgMap['PM2.5'] ? Number(avgMap['PM2.5'].toFixed(1)) : null,
        pm10: avgMap['PM10'] ? Number(avgMap['PM10'].toFixed(1)) : null,
        no2: avgMap['NO2'] ? Number(avgMap['NO2'].toFixed(1)) : null,
        so2: avgMap['SO2'] ? Number(avgMap['SO2'].toFixed(1)) : null,
        o3: avgMap['O3'] ? Number(avgMap['O3'].toFixed(1)) : null
      }
    };
  });

  return points.sort((a, b) => a.date.localeCompare(b.date));
}
