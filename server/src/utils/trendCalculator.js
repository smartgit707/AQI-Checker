/**
 * AQI Trend Calculator
 * Evaluates directional trends by comparing recent historical periods against baseline averages.
 * Methodology:
 * - Divides dataset into recent half (period B) and older half (period A)
 * - Calculates percentage change: ((Avg_B - Avg_A) / Avg_A) * 100
 * - Classifications:
 *   <-5% : "Improving" (Lower AQI is cleaner air)
 *   >+5% : "Worsening" (Higher AQI is more polluted)
 *   -5% to +5% : "Relatively Stable"
 */

export function calculateAqiTrend(historyPoints = []) {
  if (!Array.isArray(historyPoints) || historyPoints.length < 2) {
    return {
      direction: 'Stable',
      changePercent: 0,
      description: 'Insufficient historical telemetry points for dynamic trend computation.',
      isReliable: false
    };
  }

  const validPoints = historyPoints.filter(p => typeof p.aqi === 'number' && !isNaN(p.aqi));
  if (validPoints.length < 2) {
    return {
      direction: 'Stable',
      changePercent: 0,
      description: 'Telemetry baseline stable.',
      isReliable: false
    };
  }

  const mid = Math.floor(validPoints.length / 2);
  const firstHalf = validPoints.slice(0, mid);
  const secondHalf = validPoints.slice(mid);

  const avgFirst = firstHalf.reduce((sum, p) => sum + p.aqi, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, p) => sum + p.aqi, 0) / secondHalf.length;

  if (avgFirst === 0) {
    return { direction: 'Stable', changePercent: 0, description: 'Baseline air index steady.', isReliable: true };
  }

  const diffPercent = ((avgSecond - avgFirst) / avgFirst) * 100;
  const rounded = Number(diffPercent.toFixed(1));

  let direction = 'Relatively Stable';
  let badgeColor = '#64748b'; // slate-500
  let description = `Air quality levels have remained steady (shift of ${rounded > 0 ? '+' : ''}${rounded}%) over the evaluated timeframe.`;

  if (rounded <= -5) {
    direction = 'Improving';
    badgeColor = '#10b981'; // emerald-500
    description = `Air quality has improved by ${Math.abs(rounded)}% compared to the earlier baseline.`;
  } else if (rounded >= 5) {
    direction = 'Worsening';
    badgeColor = '#ef4444'; // red-500
    description = `Air pollution has increased by ${rounded}% compared to the earlier baseline.`;
  }

  return {
    direction,
    changePercent: rounded,
    badgeColor,
    description,
    isReliable: true,
    avgAqi: Math.round(avgSecond)
  };
}
