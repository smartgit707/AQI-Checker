import { query } from '../../config/db.js';

export function mapDataSourceRow(row) {
  if (!row) return null;
  return {
    _id: String(row.id),
    id: String(row.id),
    name: row.name,
    provider: row.provider,
    type: row.type,
    url: row.url || '',
    standard: row.standard,
    description: row.description,
    active: Boolean(row.active),
    lastUpdated: row.last_updated,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function findAllDataSources() {
  const rows = await query('SELECT * FROM data_sources WHERE active = 1 ORDER BY name ASC');
  return rows.map(mapDataSourceRow);
}

export async function findDataSourceById(id) {
  const rows = await query('SELECT * FROM data_sources WHERE id = ? LIMIT 1', [id]);
  return mapDataSourceRow(rows[0]);
}

export async function insertDataSource(data) {
  const sql = `
    INSERT INTO data_sources (
      name, provider, type, url, standard, description, active
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    data.name.trim(),
    data.provider.trim(),
    data.type.trim(),
    data.url || null,
    data.standard.trim(),
    data.description.trim(),
    data.active !== false ? 1 : 0
  ];

  const result = await query(sql, params);
  return await findDataSourceById(result.insertId);
}
