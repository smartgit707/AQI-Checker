import * as alertRepository from '../db/repositories/alertRepository.js';
import { isDBConnected } from '../config/db.js';
import { getInMemoryAlerts } from './alertService.js';
import { createNotification } from './notificationService.js';
import { getLatestAirQualityForCity } from './airQualityService.js';

export async function evaluateAlertsForCity(citySlug, currentAqi) {
  const cleanSlug = citySlug.toLowerCase();
  const aqi = Number(currentAqi);

  let activeAlerts = [];

  if (isDBConnected()) {
    activeAlerts = await alertRepository.findActiveAlertsByCity(cleanSlug);
  } else {
    activeAlerts = getInMemoryAlerts().filter((a) => a.citySlug === cleanSlug && a.enabled);
  }

  let triggeredCount = 0;
  const now = Date.now();

  for (const alert of activeAlerts) {
    const isBelow = ['below', 'lt', 'lte'].includes(alert.operator);
    const isTriggered = isBelow
      ? (alert.operator === 'lte' ? aqi <= alert.threshold : aqi < alert.threshold)
      : (alert.operator === 'gte' ? aqi >= alert.threshold : aqi > alert.threshold);

    if (isTriggered) {
      // Evaluate Cooldown (default 6 hours)
      const lastTriggered = alert.lastTriggeredAt ? new Date(alert.lastTriggeredAt).getTime() : 0;
      const cooldownMs = (alert.cooldownHours || 6) * 3600 * 1000;

      if (now - lastTriggered > cooldownMs) {
        // Cooldown passed, trigger notification!
        alert.lastTriggeredAt = new Date();
        if (isDBConnected()) {
          await alertRepository.updateAlertLastTriggered(alert.id || alert._id);
        }

        await createNotification({
          userId: alert.userId,
          alertId: alert._id,
          citySlug: cleanSlug,
          type: 'alert_triggered',
          title: `${alert.cityName || cleanSlug.toUpperCase()} Threshold Crossed`,
          message: `Real-time AQI in ${alert.cityName || cleanSlug.toUpperCase()} is ${aqi}, exceeding your configured threshold of ${alert.threshold}.`,
          metadata: {
            aqi,
            threshold: alert.threshold,
            operator: alert.operator
          }
        });

        triggeredCount++;
      }
    }
  }

  return {
    citySlug: cleanSlug,
    evaluatedAlertsCount: activeAlerts.length,
    triggeredCount
  };
}

export async function evaluateAllActiveAlerts() {
  let allAlerts = [];

  if (isDBConnected()) {
    allAlerts = await Alert.find({ enabled: true });
  } else {
    allAlerts = getInMemoryAlerts().filter((a) => a.enabled);
  }

  // Group unique cities
  const uniqueCities = [...new Set(allAlerts.map((a) => a.citySlug))];
  const results = [];

  for (const slug of uniqueCities) {
    try {
      const telemetry = await getLatestAirQualityForCity(slug);
      if (telemetry && telemetry.aqi !== undefined) {
        const evalRes = await evaluateAlertsForCity(slug, telemetry.aqi);
        results.push(evalRes);
      }
    } catch (err) {
      console.warn(`[AlertEvaluation Warning] Failed to evaluate city ${slug}:`, err.message);
    }
  }

  return {
    evaluatedCities: uniqueCities.length,
    evaluatedCount: allAlerts.length,
    triggeredCount: results.reduce((acc, r) => acc + (r.triggeredCount || 0), 0),
    summary: results
  };
}
