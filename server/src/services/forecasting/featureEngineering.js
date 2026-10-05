/**
 * Feature Engineering for Time-Series Environmental Telemetry
 * Cleans series, computes diurnal patterns, and prepares sequential observations.
 */

export function extractTimeSeriesFeatures(historyPoints = []) {
  if (!Array.isArray(historyPoints) || historyPoints.length === 0) {
    return { validSeries: [], diurnalAdjustments: new Array(24).fill(0), stats: null };
  }

  // Filter and clean valid numeric AQI records
  const clean = historyPoints
    .map((pt) => {
      const aqi = Number(pt.aqi);
      const date = pt.timestamp ? new Date(pt.timestamp) : null;
      return {
        timestamp: date && !isNaN(date.getTime()) ? date : new Date(),
        aqi: !isNaN(aqi) && aqi >= 0 && aqi <= 500 ? aqi : null,
        pm25: Number(pt.pollutants?.pm25 || pt.pm25) || 0,
        pm10: Number(pt.pollutants?.pm10 || pt.pm10) || 0,
        temperature: Number(pt.temperature) || 25,
        humidity: Number(pt.humidity) || 50
      };
    })
    .filter((pt) => pt.aqi !== null)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  if (clean.length === 0) {
    return { validSeries: [], diurnalAdjustments: new Array(24).fill(0), stats: null };
  }

  // Calculate series overall mean
  const aqiValues = clean.map((c) => c.aqi);
  const overallMean = aqiValues.reduce((sum, v) => sum + v, 0) / aqiValues.length;

  // Compute 24-hour diurnal profile (hourly deviations from mean)
  const hourBuckets = Array.from({ length: 24 }, () => []);
  clean.forEach((pt) => {
    const hour = pt.timestamp.getHours();
    hourBuckets[hour].push(pt.aqi - overallMean);
  });

  const diurnalAdjustments = hourBuckets.map((bucket) => {
    if (bucket.length === 0) return 0;
    const avgDev = bucket.reduce((a, b) => a + b, 0) / bucket.length;
    // Cap diurnal impact to realistic atmospheric boundary layer bounds (-25 to +25)
    return Math.max(-25, Math.min(25, avgDev));
  });

  // Calculate series variance and standard deviation
  const variance = aqiValues.reduce((acc, v) => acc + Math.pow(v - overallMean, 2), 0) / aqiValues.length;
  const stdDev = Math.sqrt(variance);

  return {
    validSeries: clean,
    diurnalAdjustments,
    stats: {
      mean: Math.round(overallMean),
      stdDev: Math.round(stdDev * 10) / 10,
      min: Math.min(...aqiValues),
      max: Math.max(...aqiValues),
      count: clean.length
    }
  };
}
