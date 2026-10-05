import Alert from '../models/Alert.js';
import { isDBConnected } from '../config/db.js';
import { getCityBySlug } from './cityService.js';

/**
 * Resilient In-Memory Alert Store
 */
const IN_MEMORY_ALERTS = [];

export function getInMemoryAlerts() {
  return IN_MEMORY_ALERTS;
}

export async function getUserAlerts(userId) {
  if (isDBConnected()) {
    return await Alert.find({ userId }).sort({ createdAt: -1 });
  }

  return IN_MEMORY_ALERTS.filter((a) => a.userId === userId);
}

export async function createAlert(userId, data = {}) {
  const { citySlug, threshold, operator = 'gt', cooldownHours = 6 } = data;

  if (!citySlug) {
    throw new Error('City slug is required to create an alert');
  }

  const numericThreshold = Number(threshold);
  if (isNaN(numericThreshold) || numericThreshold < 0 || numericThreshold > 500) {
    throw new Error('Alert threshold must be an AQI number between 0 and 500');
  }

  const cleanSlug = citySlug.toLowerCase().trim();
  const city = await getCityBySlug(cleanSlug);
  const cityName = city?.name || cleanSlug.toUpperCase();

  if (isDBConnected()) {
    // Check if duplicate alert exists
    const existing = await Alert.findOne({
      userId,
      citySlug: cleanSlug,
      threshold: numericThreshold
    });

    if (existing) {
      throw new Error(`An alert for ${cityName} with threshold ${numericThreshold} already exists.`);
    }

    const alert = new Alert({
      userId,
      citySlug: cleanSlug,
      cityName,
      threshold: numericThreshold,
      operator: operator === 'gte' ? 'gte' : 'gt',
      enabled: true,
      cooldownHours: Math.min(48, Math.max(1, Number(cooldownHours) || 6))
    });

    return await alert.save();
  }

  // Fallback in-memory
  const existing = IN_MEMORY_ALERTS.find(
    (a) => a.userId === userId && a.citySlug === cleanSlug && a.threshold === numericThreshold
  );

  if (existing) {
    throw new Error(`An alert for ${cityName} with threshold ${numericThreshold} already exists.`);
  }

  const newAlert = {
    _id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    citySlug: cleanSlug,
    cityName,
    type: 'threshold',
    threshold: numericThreshold,
    operator: operator === 'gte' ? 'gte' : 'gt',
    enabled: true,
    cooldownHours: Math.min(48, Math.max(1, Number(cooldownHours) || 6)),
    lastTriggeredAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  IN_MEMORY_ALERTS.push(newAlert);
  return newAlert;
}

export async function updateAlert(userId, alertId, updates = {}) {
  if (updates.threshold !== undefined) {
    const num = Number(updates.threshold);
    if (isNaN(num) || num < 0 || num > 500) {
      throw new Error('Alert threshold must be an AQI number between 0 and 500');
    }
  }

  if (isDBConnected()) {
    const alert = await Alert.findOne({ _id: alertId, userId });
    if (!alert) throw new Error('Alert not found');

    if (updates.threshold !== undefined) alert.threshold = Number(updates.threshold);
    if (updates.operator !== undefined) alert.operator = updates.operator;
    if (updates.enabled !== undefined) alert.enabled = Boolean(updates.enabled);
    if (updates.cooldownHours !== undefined) alert.cooldownHours = Number(updates.cooldownHours);

    return await alert.save();
  }

  const idx = IN_MEMORY_ALERTS.findIndex((a) => a._id === alertId && a.userId === userId);
  if (idx === -1) throw new Error('Alert not found');

  const alert = IN_MEMORY_ALERTS[idx];
  if (updates.threshold !== undefined) alert.threshold = Number(updates.threshold);
  if (updates.operator !== undefined) alert.operator = updates.operator;
  if (updates.enabled !== undefined) alert.enabled = Boolean(updates.enabled);
  if (updates.cooldownHours !== undefined) alert.cooldownHours = Number(updates.cooldownHours);
  alert.updatedAt = new Date();

  return alert;
}

export async function deleteAlert(userId, alertId) {
  if (isDBConnected()) {
    const result = await Alert.findOneAndDelete({ _id: alertId, userId });
    if (!result) throw new Error('Alert not found');
    return true;
  }

  const idx = IN_MEMORY_ALERTS.findIndex((a) => a._id === alertId && a.userId === userId);
  if (idx === -1) throw new Error('Alert not found');

  IN_MEMORY_ALERTS.splice(idx, 1);
  return true;
}
