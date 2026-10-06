import { query } from '../../config/db.js';

export function mapAlertRow(row) {
  if (!row) return null;
  return {
    _id: String(row.id),
    id: String(row.id),
    userId: String(row.user_id),
    citySlug: row.city_slug,
    cityName: row.city_name,
    type: row.type || 'threshold',
    threshold: row.threshold,
    operator: row.operator,
    enabled: Boolean(row.enabled),
    cooldownHours: row.cooldown_hours,
    lastTriggeredAt: row.last_triggered_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function findAlertsByUserId(userId) {
  const rows = await query(
    'SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows.map(mapAlertRow);
}

export async function findAlertByUserCityThreshold(userId, citySlug, threshold) {
  const rows = await query(
    'SELECT * FROM alerts WHERE user_id = ? AND city_slug = ? AND threshold = ? LIMIT 1',
    [userId, citySlug.toLowerCase().trim(), Number(threshold)]
  );
  return mapAlertRow(rows[0]);
}

export async function findAlertById(id, userId = null) {
  const sql = userId
    ? 'SELECT * FROM alerts WHERE id = ? AND user_id = ? LIMIT 1'
    : 'SELECT * FROM alerts WHERE id = ? LIMIT 1';
  const params = userId ? [id, userId] : [id];
  const rows = await query(sql, params);
  return mapAlertRow(rows[0]);
}

export async function findActiveAlertsByCity(citySlug) {
  const rows = await query(
    'SELECT * FROM alerts WHERE city_slug = ? AND enabled = 1',
    [citySlug.toLowerCase().trim()]
  );
  return rows.map(mapAlertRow);
}

export async function insertAlert(data) {
  const sql = `
    INSERT INTO alerts (
      user_id, city_slug, city_name, type, threshold,
      operator, enabled, cooldown_hours, last_triggered_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)
  `;

  const params = [
    data.userId,
    data.citySlug.toLowerCase().trim(),
    data.cityName || '',
    data.type || 'threshold',
    data.threshold,
    data.operator || 'above',
    data.enabled !== false ? 1 : 0,
    data.cooldownHours || 6
  ];

  const result = await query(sql, params);
  return await findAlertById(result.insertId);
}

export async function updateAlertById(id, userId, updates = {}) {
  const existing = await findAlertById(id, userId);
  if (!existing) return null;

  const fields = [];
  const params = [];

  if (updates.threshold !== undefined) {
    fields.push('threshold = ?');
    params.push(Number(updates.threshold));
  }
  if (updates.operator !== undefined) {
    fields.push('operator = ?');
    params.push(updates.operator);
  }
  if (updates.enabled !== undefined) {
    fields.push('enabled = ?');
    params.push(updates.enabled ? 1 : 0);
  }
  if (updates.cooldownHours !== undefined) {
    fields.push('cooldown_hours = ?');
    params.push(Number(updates.cooldownHours));
  }
  if (updates.cityName !== undefined) {
    fields.push('city_name = ?');
    params.push(updates.cityName);
  }

  if (fields.length === 0) return existing;

  params.push(id);
  if (userId) params.push(userId);

  const sql = `UPDATE alerts SET ${fields.join(', ')} WHERE id = ? ${userId ? 'AND user_id = ?' : ''}`;
  await query(sql, params);
  return await findAlertById(id);
}

export async function updateAlertLastTriggered(id) {
  await query('UPDATE alerts SET last_triggered_at = NOW() WHERE id = ?', [id]);
}

export async function deleteAlertById(id, userId) {
  const sql = userId
    ? 'DELETE FROM alerts WHERE id = ? AND user_id = ?'
    : 'DELETE FROM alerts WHERE id = ?';
  const params = userId ? [id, userId] : [id];
  const result = await query(sql, params);
  return result.affectedRows > 0;
}

export async function countAlerts(conditions = {}) {
  let sql = 'SELECT COUNT(*) AS total FROM alerts';
  const params = [];

  if (conditions.enabled !== undefined) {
    sql += ' WHERE enabled = ?';
    params.push(conditions.enabled ? 1 : 0);
  }

  const rows = await query(sql, params);
  return rows[0]?.total || 0;
}
