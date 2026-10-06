import { query, transaction } from '../../config/db.js';

export function mapUserRow(row, favorites = [], recent = []) {
  if (!row) return null;
  let parsedSettings = { temperatureUnit: 'C', defaultDashboardView: 'detailed' };
  if (row.settings) {
    try {
      parsedSettings = typeof row.settings === 'string' ? JSON.parse(row.settings) : row.settings;
    } catch (e) {
      // keep fallback
    }
  }

  return {
    _id: String(row.id),
    id: String(row.id),
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    avatar: row.avatar || '',
    role: row.role || 'user',
    isActive: Boolean(row.is_active),
    settings: parsedSettings,
    favoriteCities: favorites,
    recentCities: recent,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getUserFavorites(userId) {
  const rows = await query(
    'SELECT city_slug FROM user_favorites WHERE user_id = ? ORDER BY created_at ASC',
    [userId]
  );
  return rows.map((r) => r.city_slug);
}

export async function getUserRecentCities(userId) {
  const rows = await query(
    'SELECT city_slug, visited_at FROM user_recent_cities WHERE user_id = ? ORDER BY visited_at DESC LIMIT 10',
    [userId]
  );
  return rows.map((r) => ({ slug: r.city_slug, visitedAt: r.visited_at }));
}

export async function findUserByEmail(email) {
  if (!email) return null;
  const rows = await query(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email.toLowerCase().trim()]
  );
  if (rows.length === 0) return null;

  const userRow = rows[0];
  const [favorites, recent] = await Promise.all([
    getUserFavorites(userRow.id),
    getUserRecentCities(userRow.id)
  ]);

  return mapUserRow(userRow, favorites, recent);
}

export async function findUserById(id) {
  if (!id) return null;
  const rows = await query(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  if (rows.length === 0) return null;

  const userRow = rows[0];
  const [favorites, recent] = await Promise.all([
    getUserFavorites(userRow.id),
    getUserRecentCities(userRow.id)
  ]);

  return mapUserRow(userRow, favorites, recent);
}

export async function insertUser({ name, email, passwordHash, role = 'user', avatar = '', settings = null }) {
  const cleanEmail = email.toLowerCase().trim();
  const settingsJson = settings ? JSON.stringify(settings) : JSON.stringify({ temperatureUnit: 'C', defaultDashboardView: 'detailed' });

  const sql = `
    INSERT INTO users (name, email, password_hash, avatar, role, is_active, settings)
    VALUES (?, ?, ?, ?, ?, 1, ?)
  `;

  const result = await query(sql, [name.trim(), cleanEmail, passwordHash, avatar, role, settingsJson]);
  return await findUserById(result.insertId);
}

export async function updateUser(id, { name, avatar, settings }) {
  const fields = [];
  const params = [];

  if (name !== undefined) {
    fields.push('name = ?');
    params.push(name.trim());
  }
  if (avatar !== undefined) {
    fields.push('avatar = ?');
    params.push(avatar);
  }
  if (settings !== undefined) {
    fields.push('settings = ?');
    params.push(JSON.stringify(settings));
  }

  if (fields.length === 0) {
    return await findUserById(id);
  }

  params.push(id);
  await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
  return await findUserById(id);
}

export async function updatePassword(id, passwordHash) {
  await query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
  return true;
}

export async function updateLastLogin(id) {
  await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [id]);
}

export async function deleteUser(id) {
  const result = await query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function addUserFavorite(userId, citySlug) {
  const cleanSlug = citySlug.toLowerCase().trim();
  await query(
    'INSERT IGNORE INTO user_favorites (user_id, city_slug) VALUES (?, ?)',
    [userId, cleanSlug]
  );
  return await getUserFavorites(userId);
}

export async function removeUserFavorite(userId, citySlug) {
  const cleanSlug = citySlug.toLowerCase().trim();
  await query(
    'DELETE FROM user_favorites WHERE user_id = ? AND city_slug = ?',
    [userId, cleanSlug]
  );
  return await getUserFavorites(userId);
}

export async function addUserRecentCity(userId, citySlug) {
  const cleanSlug = citySlug.toLowerCase().trim();
  await query(
    `INSERT INTO user_recent_cities (user_id, city_slug, visited_at)
     VALUES (?, ?, NOW())
     ON DUPLICATE KEY UPDATE visited_at = NOW()`,
    [userId, cleanSlug]
  );
  return await getUserRecentCities(userId);
}

export async function countUsers(conditions = {}) {
  let sql = 'SELECT COUNT(*) AS total FROM users';
  const params = [];

  if (conditions.isActive !== undefined) {
    sql += ' WHERE is_active = ?';
    params.push(conditions.isActive ? 1 : 0);
  }

  const rows = await query(sql, params);
  return rows[0]?.total || 0;
}

export async function findAllUsers({ search = '', limit = 20, offset = 0 } = {}) {
  let where = '';
  const params = [];

  if (search) {
    where = 'WHERE name LIKE ? OR email LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }

  const countSql = `SELECT COUNT(*) AS total FROM users ${where}`;
  const countRows = await query(countSql, params);
  const total = countRows[0]?.total || 0;

  const dataSql = `SELECT * FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  const rows = await query(dataSql, [...params, Number(limit), Number(offset)]);

  const users = await Promise.all(
    rows.map(async (row) => {
      const [favs, rec] = await Promise.all([
        getUserFavorites(row.id),
        getUserRecentCities(row.id)
      ]);
      return mapUserRow(row, favs, rec);
    })
  );

  return { users, total };
}
