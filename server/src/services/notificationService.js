import * as notificationRepository from '../db/repositories/notificationRepository.js';
import { isDBConnected } from '../config/db.js';

/**
 * Resilient In-Memory Notification Store
 */
const IN_MEMORY_NOTIFICATIONS = [
  {
    _id: 'notif_seed_001',
    userId: 'user_demo_101',
    alertId: null,
    citySlug: 'delhi',
    type: 'alert_triggered',
    title: 'Delhi NCR Ambient Advisory',
    message: 'Continuous CAAQMS stations report AQI has reached 284 (Unhealthy category). Limit prolonged outdoor exertion.',
    read: false,
    metadata: { aqi: 284, threshold: 200 },
    createdAt: new Date(Date.now() - 1000 * 60 * 35)
  }
];

export function getInMemoryNotifications() {
  return IN_MEMORY_NOTIFICATIONS;
}

export async function createNotification(data = {}) {
  const { userId, alertId = null, citySlug, type = 'alert_triggered', title, message, metadata = {} } = data;

  if (!userId || !title || !message) {
    throw new Error('UserId, title, and message are required to create notification');
  }

  if (isDBConnected()) {
    return await notificationRepository.insertNotification({
      userId,
      alertId,
      citySlug,
      type,
      title,
      message,
      read: false,
      metadata
    });
  }

  const newNotif = {
    _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    alertId,
    citySlug: citySlug ? citySlug.toLowerCase() : 'national',
    type,
    title,
    message,
    read: false,
    metadata,
    createdAt: new Date()
  };

  IN_MEMORY_NOTIFICATIONS.unshift(newNotif);
  return newNotif;
}

export async function getUserNotifications(userId, options = {}) {
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 20));

  if (isDBConnected()) {
    return await notificationRepository.findUserNotifications(userId, options);
  }

  return IN_MEMORY_NOTIFICATIONS
    .filter((n) => n.userId === userId && (!options.unreadOnly || !n.read))
    .slice(0, limit);
}

export async function getUnreadNotificationCount(userId) {
  if (isDBConnected()) {
    return await notificationRepository.countUnreadNotifications(userId);
  }

  return IN_MEMORY_NOTIFICATIONS.filter((n) => n.userId === userId && !n.read).length;
}

export async function markNotificationRead(userId, notificationId) {
  if (isDBConnected()) {
    const notif = await notificationRepository.markNotificationRead(notificationId, userId);
    if (!notif) throw new Error('Notification not found');
    return notif;
  }

  const notif = IN_MEMORY_NOTIFICATIONS.find((n) => n._id === notificationId && n.userId === userId);
  if (!notif) throw new Error('Notification not found');
  notif.read = true;
  return notif;
}

export async function markAllNotificationsRead(userId) {
  if (isDBConnected()) {
    await notificationRepository.markAllNotificationsRead(userId);
    return true;
  }

  IN_MEMORY_NOTIFICATIONS.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
  return true;
}

export async function deleteNotification(userId, notificationId) {
  if (isDBConnected()) {
    const res = await notificationRepository.deleteNotificationById(notificationId, userId);
    if (!res) throw new Error('Notification not found');
    return true;
  }

  const idx = IN_MEMORY_NOTIFICATIONS.findIndex((n) => n._id === notificationId && n.userId === userId);
  if (idx === -1) throw new Error('Notification not found');
  IN_MEMORY_NOTIFICATIONS.splice(idx, 1);
  return true;
}
