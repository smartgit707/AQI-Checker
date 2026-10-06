import { query } from '../../config/db.js';

export function mapAirQualityRow(row) {
  if (!row) return null;
  const parseJson = (val, fallback) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    try {
      return JSON.parse(val);
    } catch (e) {
      return fallback;
    }
  };

  return {
    _id: String(row.id),
    id: String(row.id),
    cityId: row.city_id ? String(row.city_id) : null,
    citySlug: row.city_slug,
    aqi: row.aqi,
    category: row.category,
    dominantPollutant: row.dominant_pollutant,
    trend24h: row.trend_24h || '0%',
    pollutants: parseJson(row.pollutants, []),
    weather: parseJson(row.weather, {
      temperature: '28°C',
      humidity: '60%',
      wind: '10 km/h NW',
      pressure: '1013 hPa',
      visibility: '6.0 km'
    }),
    hourlyForecast: parseJson(row.hourly_forecast, []),
    source: row.source,
    isDemoData: Boolean(row.is_demo_data),
    timestamp: row.timestamp,
    createdAt: row.created_at
  };
}

export async function findLatestAirQualityForCity(citySlug) {
  if (!citySlug) return null;
  const rows = await query(
    'SELECT * FROM air_quality_readings WHERE city_slug = ? ORDER BY timestamp DESC LIMIT 1',
    [citySlug.toLowerCase().trim()]
  );
  return mapAirQualityRow(rows[0]);
}

export async function findAllAirQuality(limit = 50) {
  const rows = await query(
    'SELECT * FROM air_quality_readings ORDER BY timestamp DESC LIMIT ?',
    [Math.max(1, Number(limit) || 50)]
  );
  return rows.map(mapAirQualityRow);
}

export async function insertAirQuality(data) {
  const sql = `
    INSERT INTO air_quality_readings (
      city_id, city_slug, aqi, category, dominant_pollutant,
      trend_24h, pollutants, weather, hourly_forecast,
      source, is_demo_data, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const cityId = data.cityId ? (isNaN(Number(data.cityId)) ? null : Number(data.cityId)) : null;
  const pollutantsJson = data.pollutants ? JSON.stringify(data.pollutants) : null;
  const weatherJson = data.weather ? JSON.stringify(data.weather) : null;
  const forecastJson = data.hourlyForecast ? JSON.stringify(data.hourlyForecast) : null;
  const ts = data.timestamp ? new Date(data.timestamp) : new Date();

  const params = [
    cityId,
    data.citySlug.toLowerCase().trim(),
    data.aqi,
    data.category,
    data.dominantPollutant,
    data.trend24h || '0%',
    pollutantsJson,
    weatherJson,
    forecastJson,
    data.source || 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)',
    data.isDemoData ? 1 : 0,
    ts
  ];

  const result = await query(sql, params);
  const rows = await query('SELECT * FROM air_quality_readings WHERE id = ?', [result.insertId]);
  return mapAirQualityRow(rows[0]);
}

export async function findHistoryByCityAndDays(citySlug, days = 7) {
  const rows = await query(
    `SELECT * FROM air_quality_readings
     WHERE city_slug = ? AND timestamp >= NOW() - INTERVAL ? DAY
     ORDER BY timestamp ASC`,
    [citySlug.toLowerCase().trim(), Number(days)]
  );
  return rows.map(mapAirQualityRow);
}
