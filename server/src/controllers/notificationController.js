import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '../services/notificationService.js';

export async function getNotifications(req, res, next) {
  try {
    const { unreadOnly, limit } = req.query;
    const notifications = await getUserNotifications(req.user.id, {
      unreadOnly: unreadOnly === 'true',
      limit
    });
    const unreadCount = await getUnreadNotificationCount(req.user.id);

    return res.status(200).json({
      success: true,
      unreadCount,
      data: notifications,
      notifications
    });
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCount(req, res, next) {
  try {
    const unreadCount = await getUnreadNotificationCount(req.user.id);
    return res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const notif = await markNotificationRead(req.user.id, id);
    return res.status(200).json({
      success: true,
      data: notif
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllRead(req, res, next) {
  try {
    await markAllNotificationsRead(req.user.id);
    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
}

export async function removeNotification(req, res, next) {
  try {
    const { id } = req.params;
    await deleteNotification(req.user.id, id);
    return res.status(200).json({
      success: true,
      message: 'Notification removed'
    });
  } catch (error) {
    next(error);
  }
}
