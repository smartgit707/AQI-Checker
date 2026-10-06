import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { INITIAL_CITIES, INITIAL_AIR_QUALITY, INITIAL_DATA_SOURCES } from '../src/utils/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sqlEscape(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
  }
  return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

async function generateCompleteSql() {
  console.log('[SQL Generator] Generating complete MySQL standalone dump...');

  const schemaPath = path.resolve(__dirname, '../src/db/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Pre-hash default passwords
  const demoPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('AdminPass2026!', 10);

  let out = [];
  out.push('-- =============================================================================');
  out.push('-- AeroSense Environmental Intelligence Platform');
  out.push('-- Self-Contained Complete Standalone SQL Dump (MySQL 8.0+)');
  out.push(`-- Generated: ${new Date().toISOString()}`);
  out.push('-- Contains Full Schema DDL + Complete Pre-Populated Seed Datasets');
  out.push('-- =============================================================================\n');

  out.push(schemaSql.trim());
  out.push('\n\n-- =============================================================================');
  out.push('-- DATASET POPULATION (PRE-CONFIGURED SEED DATA)');
  out.push('-- =============================================================================\n');
  out.push('SET FOREIGN_KEY_CHECKS = 0;\n');

  // 1. Data Sources
  out.push('-- 1. Environmental Regulatory Data Sources');
  out.push('INSERT INTO data_sources (id, name, provider, type, url, standard, description, active) VALUES');
  const dsRows = INITIAL_DATA_SOURCES.map((ds, idx) => {
    return `  (${idx + 1}, ${sqlEscape(ds.name)}, ${sqlEscape(ds.provider)}, ${sqlEscape(ds.type)}, ${sqlEscape(ds.url)}, ${sqlEscape(ds.standard)}, ${sqlEscape(ds.description)}, ${ds.active ? 1 : 0})`;
  });
  out.push(dsRows.join(',\n') + ';\n');

  // 2. Cities
  out.push('-- 2. Curated Indian Metropolitan & Tier-2 Monitoring Cities');
  out.push('INSERT INTO cities (id, name, state, country, slug, latitude, longitude, station, image_url, image_alt, description, population, is_active) VALUES');
  const cityRows = INITIAL_CITIES.map((c, idx) => {
    const id = idx + 1;
    return `  (${id}, ${sqlEscape(c.name)}, ${sqlEscape(c.state)}, ${sqlEscape(c.country)}, ${sqlEscape(c.slug)}, ${c.coordinates.latitude}, ${c.coordinates.longitude}, ${sqlEscape(c.station)}, ${sqlEscape(c.image.url)}, ${sqlEscape(c.image.alt)}, ${sqlEscape(c.description)}, ${c.population || 'NULL'}, ${c.isActive ? 1 : 0})`;
  });
  out.push(cityRows.join(',\n') + ';\n');

  // Map city slug to id
  const citySlugToId = {};
  INITIAL_CITIES.forEach((c, idx) => {
    citySlugToId[c.slug] = idx + 1;
  });

  // 3. Air Quality Readings
  out.push('-- 3. CPCB Continuous Ambient Telemetry Readings & Particulate Diagnostics');
  out.push('INSERT INTO air_quality_readings (id, city_id, city_slug, aqi, category, dominant_pollutant, trend_24h, pollutants, weather, hourly_forecast, source, is_demo_data) VALUES');
  const aqRows = INITIAL_AIR_QUALITY.map((aq, idx) => {
    const id = idx + 1;
    const cityId = citySlugToId[aq.citySlug] || 'NULL';
    const source = 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)';
    return `  (${id}, ${cityId}, ${sqlEscape(aq.citySlug)}, ${aq.aqi}, ${sqlEscape(aq.category)}, ${sqlEscape(aq.dominantPollutant)}, ${sqlEscape(aq.trend24h)}, ${sqlEscape(aq.pollutants)}, ${sqlEscape(aq.weather)}, ${sqlEscape(aq.hourlyForecast)}, ${sqlEscape(source)}, 1)`;
  });
  out.push(aqRows.join(',\n') + ';\n');

  // 4. Default Authenticated Users
  out.push('-- 4. Authenticated System Users (Demo User & Environmental Operations Admin)');
  out.push('-- Credentials:');
  out.push('-- User:  demo@aerosense.air  / password123');
  out.push('-- Admin: admin@aerosense.air / AdminPass2026!');
  out.push('INSERT INTO users (id, name, email, password_hash, avatar, role, is_active, settings) VALUES');
  const userRows = [
    `  (1, 'Dr. Aarav Sharma', 'demo@aerosense.air', '${demoPasswordHash}', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'user', 1, '{\"temperatureUnit\":\"C\",\"defaultDashboardView\":\"detailed\"}')`,
    `  (2, 'Director Environmental Operations', 'admin@aerosense.air', '${adminPasswordHash}', '', 'admin', 1, '{\"temperatureUnit\":\"C\",\"defaultDashboardView\":\"detailed\"}')`
  ];
  out.push(userRows.join(',\n') + ';\n');

  // 5. User Favorites
  out.push('-- 5. User Favorite Cities');
  out.push('INSERT INTO user_favorites (id, user_id, city_slug) VALUES');
  const favRows = [
    `  (1, 1, 'delhi')`,
    `  (2, 1, 'mumbai')`,
    `  (3, 1, 'bengaluru')`,
    `  (4, 2, 'delhi')`,
    `  (5, 2, 'mumbai')`,
    `  (6, 2, 'kolkata')`,
    `  (7, 2, 'chennai')`,
    `  (8, 2, 'bengaluru')`
  ];
  out.push(favRows.join(',\n') + ';\n');

  // 6. User Recent Cities
  out.push('-- 6. User Recent Visited Cities');
  out.push('INSERT INTO user_recent_cities (id, user_id, city_slug) VALUES');
  const recentRows = [
    `  (1, 1, 'delhi')`,
    `  (2, 1, 'mumbai')`
  ];
  out.push(recentRows.join(',\n') + ';\n');

  // 7. Threshold Alerts
  out.push('-- 7. Active AQI Threshold Alerts');
  out.push('INSERT INTO alerts (id, user_id, city_slug, city_name, type, threshold, operator, enabled, cooldown_hours) VALUES');
  const alertRows = [
    `  (1, 1, 'delhi', 'Delhi NCR', 'threshold', 200, 'above', 1, 6)`,
    `  (2, 1, 'mumbai', 'Mumbai', 'threshold', 150, 'above', 1, 6)`
  ];
  out.push(alertRows.join(',\n') + ';\n');

  // 8. Notifications
  out.push('-- 8. User Environmental Advisory Notifications');
  out.push('INSERT INTO notifications (id, user_id, alert_id, city_slug, type, title, message, is_read, metadata) VALUES');
  const notifRows = [
    `  (1, 1, 1, 'delhi', 'alert_triggered', 'AQI Advisory - Delhi NCR', 'AQI in Delhi NCR reached 284 (Unhealthy). Sensitive groups and outdoor runners should reduce exposure.', 0, '{\"aqi\":284,\"category\":\"Unhealthy\"}')`,
    `  (2, 1, NULL, 'system', 'system', 'Welcome to AeroSense Intelligence', 'Your environmental telemetry dashboard has been activated. Configure favorite city alerts anytime.', 1, '{\"welcome\":true}')`
  ];
  out.push(notifRows.join(',\n') + ';\n');

  // 9. Admin Audit Logs
  out.push('-- 9. Administrative Audit Trail');
  out.push('INSERT INTO audit_logs (id, actor_user_id, actor_email, action, resource_type, resource_id, details, ip_address) VALUES');
  const auditRows = [
    `  (1, '2', 'admin@aerosense.air', 'SYSTEM_INITIALIZE', 'DATABASE', 'aerosense', '{\"platform\":\"AeroSense 2026\",\"schema\":\"MySQL 8.0 Relational\"}', '127.0.0.1')`
  ];
  out.push(auditRows.join(',\n') + ';\n');

  out.push('SET FOREIGN_KEY_CHECKS = 1;\n');
  out.push('-- =============================================================================');
  out.push('-- END OF SQL DUMP');
  out.push('-- =============================================================================\n');

  const completeSql = out.join('\n');

  // Write to server/src/db/aerosense_complete.sql
  const targetServerPath = path.resolve(__dirname, '../src/db/aerosense_complete.sql');
  fs.writeFileSync(targetServerPath, completeSql, 'utf8');
  console.log(`[SQL Generator] Generated: ${targetServerPath}`);

  // Write to root aerosense_complete.sql
  const targetRootPath = path.resolve(__dirname, '../../aerosense_complete.sql');
  fs.writeFileSync(targetRootPath, completeSql, 'utf8');
  console.log(`[SQL Generator] Generated: ${targetRootPath}`);

  console.log('[SQL Generator] Complete standalone SQL dump successfully generated!');
}

generateCompleteSql().catch(err => {
  console.error('[SQL Generator Error]:', err);
  process.exit(1);
});
