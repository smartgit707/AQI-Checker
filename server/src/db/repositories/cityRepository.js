import { query } from '../../config/db.js';

export function mapCityRow(row) {
  if (!row) return null;
  return {
    _id: String(row.id),
    id: String(row.id),
    name: row.name,
    state: row.state,
    country: row.country || 'India',
    slug: row.slug,
    coordinates: {
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude)
    },
    station: row.station,
    image: {
      url: row.image_url,
      alt: row.image_alt
    },
    description: row.description,
    population: row.population != null ? Number(row.population) : null,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function findAllCities({ search = '', state = '', limit = 20, page = 1 } = {}) {
  const conditions = ['is_active = 1'];
  const params = [];

  if (search) {
    conditions.push('(name LIKE ? OR state LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (state) {
    conditions.push('state LIKE ?');
    params.push(`%${state}%`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const countSql = `SELECT COUNT(*) AS total FROM cities ${whereClause}`;
  const countRows = await query(countSql, params);
  const total = countRows[0]?.total || 0;

  const numLimit = Math.max(1, Number(limit) || 20);
  const numPage = Math.max(1, Number(page) || 1);
  const offset = (numPage - 1) * numLimit;

  const dataSql = `SELECT * FROM cities ${whereClause} ORDER BY name ASC LIMIT ? OFFSET ?`;
  const rows = await query(dataSql, [...params, numLimit, offset]);

  return {
    cities: rows.map(mapCityRow),
    total,
    page: numPage,
    limit: numLimit,
    totalPages: Math.ceil(total / numLimit)
  };
}

export async function findCityBySlug(slug) {
  if (!slug) return null;
  const rows = await query(
    'SELECT * FROM cities WHERE slug = ? AND is_active = 1 LIMIT 1',
    [slug.toLowerCase().trim()]
  );
  return mapCityRow(rows[0]);
}

export async function findCityById(id) {
  if (!id) return null;
  const rows = await query(
    'SELECT * FROM cities WHERE (id = ? OR slug = ?) LIMIT 1',
    [id, id]
  );
  return mapCityRow(rows[0]);
}

export async function insertCity(data) {
  const slug = (data.slug || data.name.toLowerCase().replace(/\s+/g, '-')).toLowerCase().trim();
  const lat = data.coordinates?.latitude || data.latitude || 0;
  const lng = data.coordinates?.longitude || data.longitude || 0;
  const imageUrl = data.image?.url || data.imageUrl || '';
  const imageAlt = data.image?.alt || data.imageAlt || `${data.name} landscape`;

  const sql = `
    INSERT INTO cities (
      name, state, country, slug, latitude, longitude,
      station, image_url, image_alt, description, population, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    data.name.trim(),
    data.state.trim(),
    data.country || 'India',
    slug,
    lat,
    lng,
    data.station || 'Continuous Ambient Air Quality Monitoring Station (CAAQMS)',
    imageUrl,
    imageAlt,
    data.description || '',
    data.population || null,
    data.isActive !== false ? 1 : 0
  ];

  const result = await query(sql, params);
  return await findCityById(result.insertId);
}

export async function updateCityById(id, data) {
  const existing = await findCityById(id);
  if (!existing) return null;

  const fields = [];
  const params = [];

  if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name.trim()); }
  if (data.state !== undefined) { fields.push('state = ?'); params.push(data.state.trim()); }
  if (data.country !== undefined) { fields.push('country = ?'); params.push(data.country.trim()); }
  if (data.slug !== undefined) { fields.push('slug = ?'); params.push(data.slug.toLowerCase().trim()); }
  if (data.coordinates?.latitude !== undefined) { fields.push('latitude = ?'); params.push(data.coordinates.latitude); }
  if (data.coordinates?.longitude !== undefined) { fields.push('longitude = ?'); params.push(data.coordinates.longitude); }
  if (data.station !== undefined) { fields.push('station = ?'); params.push(data.station); }
  if (data.image?.url !== undefined) { fields.push('image_url = ?'); params.push(data.image.url); }
  if (data.image?.alt !== undefined) { fields.push('image_alt = ?'); params.push(data.image.alt); }
  if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
  if (data.population !== undefined) { fields.push('population = ?'); params.push(data.population); }
  if (data.isActive !== undefined) { fields.push('is_active = ?'); params.push(data.isActive ? 1 : 0); }

  if (fields.length === 0) return existing;

  params.push(existing._id);
  await query(`UPDATE cities SET ${fields.join(', ')} WHERE id = ?`, params);
  return await findCityById(existing._id);
}

export async function deleteCityById(id) {
  const result = await query('DELETE FROM cities WHERE id = ? OR slug = ?', [id, id]);
  return result.affectedRows > 0;
}
