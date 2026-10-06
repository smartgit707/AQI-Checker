import { query } from '../../config/db.js';

export function mapAuditRow(row) {
  if (!row) return null;
  let details = {};
  if (row.details) {
    try {
      details = typeof row.details === 'string' ? JSON.parse(row.details) : row.details;
    } catch (e) {
      details = {};
    }
  }

  return {
    _id: String(row.id),
    id: String(row.id),
    actorUserId: row.actor_user_id,
    actorEmail: row.actor_email,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id || '',
    details,
    ipAddress: row.ip_address || '',
    createdAt: row.created_at
  };
}

export async function insertAuditLog(entry) {
  const sql = `
    INSERT INTO audit_logs (
      actor_user_id, actor_email, action, resource_type,
      resource_id, details, ip_address
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const detailsJson = entry.details ? JSON.stringify(entry.details) : JSON.stringify({});

  const params = [
    entry.actorUserId,
    entry.actorEmail,
    entry.action,
    entry.resourceType,
    entry.resourceId || '',
    detailsJson,
    entry.ipAddress || ''
  ];

  const result = await query(sql, params);
  const rows = await query('SELECT * FROM audit_logs WHERE id = ?', [result.insertId]);
  return mapAuditRow(rows[0]);
}

export async function findAuditLogs(options = {}) {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 20));
  const offset = (page - 1) * limit;

  const conditions = [];
  const params = [];

  if (options.action) {
    conditions.push('action = ?');
    params.push(options.action);
  }
  if (options.resourceType) {
    conditions.push('resource_type = ?');
    params.push(options.resourceType);
  }
  if (options.actorUserId) {
    conditions.push('actor_user_id = ?');
    params.push(options.actorUserId);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const countSql = `SELECT COUNT(*) AS total FROM audit_logs ${whereClause}`;
  const countRows = await query(countSql, params);
  const total = countRows[0]?.total || 0;

  const dataSql = `SELECT * FROM audit_logs ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  const rows = await query(dataSql, [...params, limit, offset]);

  return {
    logs: rows.map(mapAuditRow),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}
