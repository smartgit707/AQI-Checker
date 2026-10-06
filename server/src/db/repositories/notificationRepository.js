import { query } from '../../config/db.js';

export function mapNotificationRow(row) {
  if (!row) return null;
  let metadata = {};
  if (row.metadata) {
    try {
      metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
    } catch (e) {
      metadata = {};
    }
  }

  return {
    _id: String(row.id),
    id: String(row.id),
    userId: String(row.user_id),
    alertId: row.alert_id ? String(row.alert_id) : null,
    citySlug: row.city_slug,
    type: row.type || 'alert_triggered',
    title: row.title,
    message: row.message,
    read: Boolean(row.is_read),
    metadata,
    createdAt: row.created_at
  };
}

export async function findUserNotifications(userId, options = {}) {
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 20));
  let sql = 'SELECT * FROM notifications WHERE user_id = ?';
  const params = [userId];

  if (options.unreadOnly) {
    sql += ' AND is_read = 0';
  }

  sql += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  const rows = await query(sql, params);
  return rows.map(mapNotificationRow);
}

export async function countUnreadNotifications(userId) {
  const rows = await query(
    'SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = 0',
    [userId]
  );
  return rows[0]?.total || 0;
}

export async function countTotalNotifications() {
  const rows = await query('SELECT COUNT(*) AS total FROM notifications');
  return rows[0]?.total || 0;
}

export async function insertNotification(data) {
  const sql = `
    INSERT INTO notifications (
      user_id, alert_id, city_slug, type, title, message, is_read, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const metaJson = data.metadata ? JSON.stringify(data.metadata) : JSON.stringify({});
  const alertId = data.alertId && !isNaN(Number(data.alertId)) ? Number(data.alertId) : null;

  const params = [
    data.userId,
    alertId,
    (data.citySlug || 'national').toLowerCase().trim(),
    data.type || 'alert_triggered',
    data.title.trim(),
    data.message.trim(),
    data.read ? 1 : 0,
    metaJson
  ];

  const result = await query(sql, params);
  const rows = await query('SELECT * FROM notifications WHERE id = ?', [result.insertId]);
  return mapNotificationRow(rows[0]);
}

export async function markNotificationRead(id, userId) {
  await query(
    'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  const rows = await query('SELECT * FROM notifications WHERE id = ? AND user_id = ?', [id, userId]);
  return mapNotificationRow(rows[0]);
}

export async function markAllNotificationsRead(userId) {
  const result = await query(
    'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
    [userId]
  );
  return result.affectedRows;
}

export async function deleteNotificationById(id, userId) {
  const result = await query(
    'DELETE FROM notifications WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
}

export async function deleteAllNotifications(userId) {
  const result = await query(
    'DELETE FROM notifications WHERE user_id = ?',
    [userId]
  );
  return result.affectedRows;
}
