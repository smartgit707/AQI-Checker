/**
 * AeroCast Damped Exponential Smoothing Model (AeroCast-DES)
 * Mathematical time-series model combining damped Holt-Winters trend projection
 * with diurnal boundary layer cycle adjustments and empirical uncertainty intervals.
 */

export class DampedHoltModel {
  constructor(options = {}) {
    this.alpha = options.alpha || 0.35; // Level smoothing weight
    this.beta = options.beta || 0.15;   // Trend smoothing weight
    this.phi = options.phi || 0.92;     // Damping parameter (prevents linear runaway)
    this.name = 'AeroCast-Damped-Holt-v1.4';
    this.version = '1.4.0';
    this.level = 0;
    this.trend = 0;
    this.residualStd = 12; // Initial baseline residual variance
  }

  fit(series, diurnalAdjustments = []) {
    if (!series || series.length < 2) {
      throw new Error('At least 2 sequential observations required to fit model');
    }

    // Initialize Level and Trend from early window
    let level = series[0].aqi;
    let trend = series.length >= 3 
      ? (series[2].aqi - series[0].aqi) / 2 
      : series[1].aqi - series[0].aqi;

    const residuals = [];

    // Filter through series updating level and damped trend
    for (let i = 1; i < series.length; i++) {
      const actual = series[i].aqi;
      const hour = series[i].timestamp.getHours();
      const diurnal = diurnalAdjustments[hour] || 0;

      // One-step-ahead fitted prediction
      const fitted = level + this.phi * trend + diurnal;
      residuals.push(actual - fitted);

      const prevLevel = level;
      level = this.alpha * actual + (1 - this.alpha) * (level + this.phi * trend);
      trend = this.beta * (level - prevLevel) + (1 - this.beta) * this.phi * trend;
    }

    this.level = level;
    this.trend = trend;

    // Calculate in-sample residual standard deviation
    if (residuals.length > 0) {
      const meanRes = residuals.reduce((a, b) => a + b, 0) / residuals.length;
      const resVar = residuals.reduce((a, b) => a + Math.pow(b - meanRes, 2), 0) / residuals.length;
      this.residualStd = Math.max(6, Math.sqrt(resVar)); // Bound minimum standard error
    }

    return {
      finalLevel: Math.round(level * 10) / 10,
      finalTrend: Math.round(trend * 10) / 10,
      residualStd: Math.round(this.residualStd * 10) / 10
    };
  }

  predict(startDateTime, hoursAhead = 24, diurnalAdjustments = []) {
    const predictions = [];
    const baseTime = new Date(startDateTime).getTime();

    let cumulativeTrend = 0;

    for (let h = 1; h <= hoursAhead; h++) {
      const targetTime = new Date(baseTime + h * 3600 * 1000);
      const targetHour = targetTime.getHours();
      const diurnal = diurnalAdjustments[targetHour] || 0;

      // Apply damped exponential trend: sum(phi^i) * trend
      cumulativeTrend += Math.pow(this.phi, h) * this.trend;

      const rawForecast = this.level + cumulativeTrend + diurnal;
      // Clamp to valid NAQI scale [0, 500]
      const predictedAQI = Math.min(500, Math.max(10, Math.round(rawForecast)));

      // Uncertainty expands over time as standard error sqrt(1 + 0.08 * h)
      const errorMargin = 1.96 * this.residualStd * Math.sqrt(1 + 0.08 * h);
      const lowerBound = Math.max(5, Math.round(predictedAQI - errorMargin));
      const upperBound = Math.min(500, Math.round(predictedAQI + errorMargin));

      predictions.push({
        stepHours: h,
        timestamp: targetTime.toISOString(),
        predictedAQI,
        lowerBound,
        upperBound,
        confidenceLevel: '95%'
      });
    }

    return predictions;
  }
}
