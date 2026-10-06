-- =============================================================================
-- AeroSense Environmental Intelligence Platform
-- Self-Contained Complete Standalone SQL Dump (MySQL 8.0+)
-- Generated: 2026-10-06T13:27:50.600Z
-- Contains Full Schema DDL + Complete Pre-Populated Seed Datasets
-- =============================================================================

-- =============================================================================
-- AeroSense Environmental Intelligence Platform
-- Relational MySQL Schema (MySQL 8.0+)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS aerosense
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aerosense;

-- 1. Cities Table
CREATE TABLE IF NOT EXISTS cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(60) NOT NULL DEFAULT 'India',
  slug VARCHAR(100) NOT NULL UNIQUE,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  station VARCHAR(255) NOT NULL DEFAULT 'Continuous Ambient Air Quality Monitoring Station (CAAQMS)',
  image_url VARCHAR(500) NOT NULL,
  image_alt VARCHAR(255) NOT NULL,
  description TEXT,
  population BIGINT DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cities_slug (slug),
  INDEX idx_cities_state (state),
  INDEX idx_cities_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Air Quality Telemetry & Historical Readings Table
CREATE TABLE IF NOT EXISTS air_quality_readings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city_id INT DEFAULT NULL,
  city_slug VARCHAR(100) NOT NULL,
  aqi INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  dominant_pollutant VARCHAR(20) NOT NULL,
  trend_24h VARCHAR(20) DEFAULT '0%',
  pollutants JSON DEFAULT NULL,
  weather JSON DEFAULT NULL,
  hourly_forecast JSON DEFAULT NULL,
  source VARCHAR(255) DEFAULT 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)',
  is_demo_data BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL,
  INDEX idx_aq_city_slug_time (city_slug, timestamp DESC),
  INDEX idx_aq_city_id (city_id),
  INDEX idx_aq_timestamp (timestamp DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Data Sources & Regulatory Standard Metadata
CREATE TABLE IF NOT EXISTS data_sources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  provider VARCHAR(150) NOT NULL,
  type VARCHAR(100) NOT NULL,
  url VARCHAR(500) DEFAULT NULL,
  standard VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) DEFAULT '',
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  settings JSON DEFAULT NULL,
  last_login_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. User Favorite Cities (Relational Join Table)
CREATE TABLE IF NOT EXISTS user_favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  city_slug VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_favorite (user_id, city_slug),
  INDEX idx_fav_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. User Recent Visited Cities
CREATE TABLE IF NOT EXISTS user_recent_cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  city_slug VARCHAR(100) NOT NULL,
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_recent (user_id, city_slug),
  INDEX idx_recent_user_visited (user_id, visited_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Environmental AQI Threshold Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  city_slug VARCHAR(100) NOT NULL,
  city_name VARCHAR(100) DEFAULT '',
  type VARCHAR(50) NOT NULL DEFAULT 'threshold',
  threshold INT NOT NULL,
  operator VARCHAR(20) NOT NULL DEFAULT 'above',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  cooldown_hours INT NOT NULL DEFAULT 6,
  last_triggered_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_alert_user_city_thresh (user_id, city_slug, threshold),
  INDEX idx_alerts_user (user_id),
  INDEX idx_alerts_eval (city_slug, enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  alert_id INT DEFAULT NULL,
  city_slug VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'alert_triggered',
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE SET NULL,
  INDEX idx_notif_user_read (user_id, is_read, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Administrative Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actor_user_id VARCHAR(100) NOT NULL,
  actor_email VARCHAR(150) NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id VARCHAR(100) DEFAULT '',
  details JSON DEFAULT NULL,
  ip_address VARCHAR(50) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_actor (actor_user_id),
  INDEX idx_audit_action (action),
  INDEX idx_audit_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- DATASET POPULATION (PRE-CONFIGURED SEED DATA)
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Environmental Regulatory Data Sources
INSERT INTO data_sources (id, name, provider, type, url, standard, description, active) VALUES
  (1, 'Central Pollution Control Board (CPCB)', 'Ministry of Environment, Forest and Climate Change', 'National Regulatory Network', 'https://cpcb.nic.in', 'India NAQI (2015/2026 Revision)', 'Government reference continuous ambient air quality monitoring network stations distributed across Tier-1 and Tier-2 urban hubs.', 1),
  (2, 'State Pollution Control Boards (SPCBs)', 'State Environmental Protection Directorates', 'State Regulatory Observatory', 'https://tnpcb.gov.in', 'Continuous PM2.5, PM10, NOx, SO2', 'State-level continuous telemetry monitors and industrial buffer emissions logging points across all 28 states & union territories.', 1),
  (3, 'IMD & Satellite Radiometry', 'India Meteorological Department & Copernicus', 'Synoptic Meteorological Ingestion', 'https://mausam.imd.gov.in', 'Synoptic Boundary Layer Modeling', 'India Meteorological Department Doppler radar, surface automatic weather stations, and ESA Copernicus Sentinel-5P aerosol optical depth.', 1),
  (4, 'Calibrated Micro-Sensor Matrix', 'AeroSense IoT Research Consortium', 'Hyperlocal Ambient Mesh Network', 'https://aerosense.internal', 'Dual-Optical Laser Scattering', 'Dual-laser optical particle counters (OPC) cross-calibrated against gravimetric beta-attenuation monitors for micro-cluster resolution.', 1);

-- 2. Curated Indian Metropolitan & Tier-2 Monitoring Cities
INSERT INTO cities (id, name, state, country, slug, latitude, longitude, station, image_url, image_alt, description, population, is_active) VALUES
  (1, 'Chennai', 'Tamil Nadu', 'India', 'chennai', 13.0827, 80.2707, 'Alandur & Marina Coastline CPCB Monitoring Station', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', 'Scenic coastal architecture and Marina beach promenade in Chennai under open skies', 'Capital of Tamil Nadu, coastal metropolitan hub influenced by Bay of Bengal maritime ventilation.', 11000000, 1),
  (2, 'Delhi NCR', 'National Capital Territory', 'India', 'delhi', 28.6139, 77.209, 'Anand Vihar & RK Puram Continuous Station', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', 'Historic India Gate and surrounding Delhi Rajpath under winter atmospheric haze', 'National capital region situated in the landlocked Indo-Gangetic plain subject to seasonal inversion layers.', 32000000, 1),
  (3, 'Mumbai', 'Maharashtra', 'India', 'mumbai', 19.076, 72.8777, 'Bandra Kurla Complex Ambient Air Station', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80', 'Iconic Bandra-Worli Sea Link crossing the Arabian Sea in Mumbai', 'Financial capital on the Konkan coast with significant Arabian Sea land-sea breeze circulation.', 21000000, 1),
  (4, 'Bengaluru', 'Karnataka', 'India', 'bengaluru', 12.9716, 77.5946, 'BTM Layout & Saneguruvanahalli Station', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80', 'Green tree-lined tech corridor and Lalbagh botanical garden canopy in Bengaluru', 'Deccan plateau elevation with moderate year-round climate and dense urban green buffers.', 13000000, 1),
  (5, 'Hyderabad', 'Telangana', 'India', 'hyderabad', 17.385, 78.4867, 'Zoo Park & Sanathnagar Monitoring Point', 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?auto=format&fit=crop&w=800&q=80', 'Charminar monument and urban heritage vista in central Hyderabad', 'Central Deccan tech hub with undulating topography and seasonal dry winds.', 10500000, 1),
  (6, 'Kolkata', 'West Bengal', 'India', 'kolkata', 22.5726, 88.3639, 'Victoria Memorial & Rabindra Bharati Station', 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80', 'Majestic Howrah Bridge spanning the Hooghly river in Kolkata', 'Lower Gangetic delta riverine port with high ambient relative humidity and slow winter dispersion.', 15000000, 1),
  (7, 'Pune', 'Maharashtra', 'India', 'pune', 18.5204, 73.8567, 'Shivajinagar & Katraj Environmental Point', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', 'Verdant Western Ghats foothills bordering Pune city skyline', 'Western Ghats rain-shadow plateau known for educational and manufacturing corridors.', 7500000, 1),
  (8, 'Shimla', 'Himachal Pradesh', 'India', 'shimla', 31.1048, 77.1734, 'The Mall & Ridge Clean Mountain Station', 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80', 'Crisp, pine-clad Himalayan ridgeline with pristine mountain air in Shimla', 'High-altitude Himalayan hill retreat maintaining baseline pristine atmospheric clarity.', 250000, 1),
  (9, 'Chandigarh', 'Punjab & Haryana', 'India', 'chandigarh', 30.7333, 76.7794, 'Sector 22 CAAQMS Station', 'https://images.unsplash.com/photo-1590053343058-204128f804ce?auto=format&fit=crop&w=800&q=80', 'Planned urban greenery and avenues in Chandigarh', 'Modern planned capital city nestled against the Shivalik foothills.', 1200000, 1),
  (10, 'Jaipur', 'Rajasthan', 'India', 'jaipur', 26.9124, 75.7873, 'Police Commissionerate CAAQMS Station', 'https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=800&q=80', 'Historic Hawa Mahal and desert heritage skyline in Jaipur', 'Semi-arid climate with seasonal desert sand drift and urban commercial flow.', 4000000, 1),
  (11, 'Lucknow', 'Uttar Pradesh', 'India', 'lucknow', 26.8467, 80.9462, 'Talkatora Industrial Area Station', 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80', 'Heritage architectural vista of central Lucknow', 'Central Gangetic plains cultural capital with dense winter boundary stagnation.', 3800000, 1),
  (12, 'Ahmedabad', 'Gujarat', 'India', 'ahmedabad', 23.0225, 72.5714, 'Maninagar Continuous Telemetry Point', 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80', 'Sabarmati riverfront promenade in Ahmedabad', 'Commercial and industrial metropolis in western India with dry continental air currents.', 8200000, 1),
  (13, 'Kochi', 'Kerala', 'India', 'kochi', 9.9312, 76.2673, 'Eloor Industrial Corridor & Marine Drive Station', 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80', 'Tropical backwaters and coastal harbour in Kochi', 'Coastal seaport benefiting from heavy maritime ventilation and coastal monsoon cleansing.', 2100000, 1),
  (14, 'Patna', 'Bihar', 'India', 'patna', 25.5941, 85.1376, 'DRM Office Danapur & IGSC Planetarium Station', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', 'Ganges river basin and urban core in Patna', 'Low-lying river valley prone to winter temperature inversions and alluvial dust entrapment.', 2500000, 1),
  (15, 'Bhopal', 'Madhya Pradesh', 'India', 'bhopal', 23.2599, 77.4126, 'T.T. Nagar CAAQMS Station', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 'Upper Lake and verdant hills surrounding Bhopal', 'Central Indian plateau city with balanced vegetation buffers and natural lake reservoirs.', 2400000, 1),
  (16, 'Guwahati', 'Assam', 'India', 'guwahati', 26.1445, 91.7362, 'Railway Colony Panbazar Station', 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80', 'Brahmaputra river valley landscape in Guwahati', 'Northeastern gateway city framed by the Brahmaputra river and lush hill slopes.', 1200000, 1);

-- 3. CPCB Continuous Ambient Telemetry Readings & Particulate Diagnostics
INSERT INTO air_quality_readings (id, city_id, city_slug, aqi, category, dominant_pollutant, trend_24h, pollutants, weather, hourly_forecast, source, is_demo_data) VALUES
  (1, 1, 'chennai', 54, 'Moderate', 'PM2.5', '-4%', '[{"code":"PM2.5","name":"Fine Particulate Matter","value":32.4,"unit":"µg/m³","limit":60,"status":"Moderate","trend":"down","desc":"Combustion particles, vehicle emissions, coastal aerosols"},{"code":"PM10","name":"Coarse Particulates","value":68.2,"unit":"µg/m³","limit":100,"status":"Moderate","trend":"stable","desc":"Road dust, construction debris, mechanical wear"},{"code":"NO2","name":"Nitrogen Dioxide","value":24.1,"unit":"ppb","limit":80,"status":"Good","trend":"down","desc":"Vehicular exhaust and thermal power station emissions"},{"code":"SO2","name":"Sulfur Dioxide","value":11.5,"unit":"ppb","limit":80,"status":"Good","trend":"stable","desc":"Industrial refinery emissions and fuel oil burning"},{"code":"CO","name":"Carbon Monoxide","value":0.7,"unit":"mg/m³","limit":4,"status":"Good","trend":"stable","desc":"Incomplete fossil fuel combustion in heavy transit"},{"code":"O3","name":"Ground-level Ozone","value":38,"unit":"ppb","limit":100,"status":"Good","trend":"up","desc":"Photochemical reaction of VOCs and sunlight"}]', '{"temperature":"31°C","humidity":"74%","wind":"16 km/h ENE","pressure":"1011 hPa","visibility":"7.5 km"}', '[{"time":"12 PM","aqi":52},{"time":"2 PM","aqi":54},{"time":"4 PM","aqi":58},{"time":"6 PM","aqi":62},{"time":"8 PM","aqi":65},{"time":"10 PM","aqi":59},{"time":"12 AM","aqi":51}]', 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)', 1),
  (2, 2, 'delhi', 284, 'Unhealthy', 'PM2.5', '+12%', '[{"code":"PM2.5","name":"Fine Particulate Matter","value":182,"unit":"µg/m³","limit":60,"status":"Unhealthy","trend":"up","desc":"Seasonal biomass burning, heavy traffic, thermal stagnation"},{"code":"PM10","name":"Coarse Particulates","value":295.4,"unit":"µg/m³","limit":100,"status":"Unhealthy","trend":"up","desc":"Unpaved road dust, building activity, windblown soil"},{"code":"NO2","name":"Nitrogen Dioxide","value":68.3,"unit":"ppb","limit":80,"status":"Moderate","trend":"up","desc":"High density vehicular congestion"},{"code":"SO2","name":"Sulfur Dioxide","value":28.2,"unit":"ppb","limit":80,"status":"Good","trend":"stable","desc":"Peripheral industrial cluster discharges"},{"code":"CO","name":"Carbon Monoxide","value":2.8,"unit":"mg/m³","limit":4,"status":"Moderate","trend":"up","desc":"Idling traffic queues across arterial ring roads"},{"code":"O3","name":"Ground-level Ozone","value":42.1,"unit":"ppb","limit":100,"status":"Good","trend":"down","desc":"Diminished solar irradiance due to haze layer"}]', '{"temperature":"26°C","humidity":"58%","wind":"5 km/h NW","pressure":"1014 hPa","visibility":"2.1 km"}', '[{"time":"12 PM","aqi":260},{"time":"2 PM","aqi":275},{"time":"4 PM","aqi":284},{"time":"6 PM","aqi":310},{"time":"8 PM","aqi":335},{"time":"10 PM","aqi":320},{"time":"12 AM","aqi":295}]', 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)', 1),
  (3, 3, 'mumbai', 112, 'Poor', 'PM10', '+3%', '[{"code":"PM2.5","name":"Fine Particulate Matter","value":58.7,"unit":"µg/m³","limit":60,"status":"Moderate","trend":"stable","desc":"Urban congestion, port shipping activity"},{"code":"PM10","name":"Coarse Particulates","value":124,"unit":"µg/m³","limit":100,"status":"Poor","trend":"up","desc":"Massive infrastructure & metro construction works"},{"code":"NO2","name":"Nitrogen Dioxide","value":34.2,"unit":"ppb","limit":80,"status":"Good","trend":"stable","desc":"Western Express Highway vehicular flow"},{"code":"SO2","name":"Sulfur Dioxide","value":14.8,"unit":"ppb","limit":80,"status":"Good","trend":"stable","desc":"Harbour thermal and industrial zones"},{"code":"CO","name":"Carbon Monoxide","value":1.1,"unit":"mg/m³","limit":4,"status":"Good","trend":"stable","desc":"Dense commercial transport fleet"},{"code":"O3","name":"Ground-level Ozone","value":29.5,"unit":"ppb","limit":100,"status":"Good","trend":"down","desc":"Maritime cloud cover shielding photochemical action"}]', '{"temperature":"32°C","humidity":"72%","wind":"14 km/h W","pressure":"1012 hPa","visibility":"5.0 km"}', '[{"time":"12 PM","aqi":105},{"time":"2 PM","aqi":112},{"time":"4 PM","aqi":120},{"time":"6 PM","aqi":118},{"time":"8 PM","aqi":108},{"time":"10 PM","aqi":102},{"time":"12 AM","aqi":95}]', 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)', 1),
  (4, 4, 'bengaluru', 42, 'Good', 'PM2.5', '-8%', '[{"code":"PM2.5","name":"Fine Particulate Matter","value":18.2,"unit":"µg/m³","limit":60,"status":"Good","trend":"down","desc":"Favorable elevation and suburban vegetative buffering"},{"code":"PM10","name":"Coarse Particulates","value":44.5,"unit":"µg/m³","limit":100,"status":"Good","trend":"stable","desc":"Moderate urban dust, low wind resuspension"},{"code":"NO2","name":"Nitrogen Dioxide","value":19.8,"unit":"ppb","limit":80,"status":"Good","trend":"down","desc":"Tech corridor commuter movement"},{"code":"SO2","name":"Sulfur Dioxide","value":7.2,"unit":"ppb","limit":80,"status":"Good","trend":"stable","desc":"Low heavy industry in municipal boundary"},{"code":"CO","name":"Carbon Monoxide","value":0.5,"unit":"mg/m³","limit":4,"status":"Good","trend":"stable","desc":"Efficient light commercial traffic"},{"code":"O3","name":"Ground-level Ozone","value":25.1,"unit":"ppb","limit":100,"status":"Good","trend":"stable","desc":"Stable atmospheric equilibrium"}]', '{"temperature":"25°C","humidity":"61%","wind":"11 km/h ESE","pressure":"1015 hPa","visibility":"10.0 km"}', '[{"time":"12 PM","aqi":38},{"time":"2 PM","aqi":42},{"time":"4 PM","aqi":45},{"time":"6 PM","aqi":48},{"time":"8 PM","aqi":46},{"time":"10 PM","aqi":40},{"time":"12 AM","aqi":35}]', 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)', 1),
  (5, 5, 'hyderabad', 78, 'Moderate', 'PM2.5', '+1%', '[{"code":"PM2.5","name":"Fine Particulate Matter","value":44.1,"unit":"µg/m³","limit":60,"status":"Moderate","trend":"stable","desc":"Plateau dry air and secondary particle condensation"},{"code":"PM10","name":"Coarse Particulates","value":89.2,"unit":"µg/m³","limit":100,"status":"Moderate","trend":"stable","desc":"Outer ring road dust and commercial activity"},{"code":"NO2","name":"Nitrogen Dioxide","value":28.7,"unit":"ppb","limit":80,"status":"Good","trend":"up","desc":"Commuter density along Hitec City axis"},{"code":"SO2","name":"Sulfur Dioxide","value":12.3,"unit":"ppb","limit":80,"status":"Good","trend":"stable","desc":"Industrial estate peripheral operations"},{"code":"CO","name":"Carbon Monoxide","value":0.9,"unit":"mg/m³","limit":4,"status":"Good","trend":"stable","desc":"Moderate vehicular emissions"},{"code":"O3","name":"Ground-level Ozone","value":33.4,"unit":"ppb","limit":100,"status":"Good","trend":"up","desc":"Clear sky photochemical generation"}]', '{"temperature":"29°C","humidity":"55%","wind":"9 km/h NE","pressure":"1013 hPa","visibility":"8.0 km"}', '[{"time":"12 PM","aqi":72},{"time":"2 PM","aqi":78},{"time":"4 PM","aqi":82},{"time":"6 PM","aqi":88},{"time":"8 PM","aqi":84},{"time":"10 PM","aqi":79},{"time":"12 AM","aqi":70}]', 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)', 1),
  (6, 6, 'kolkata', 165, 'Poor', 'PM2.5', '+7%', '[{"code":"PM2.5","name":"Fine Particulate Matter","value":92.5,"unit":"µg/m³","limit":60,"status":"Poor","trend":"up","desc":"High humidity trapping Gangetic delta particulate drift"},{"code":"PM10","name":"Coarse Particulates","value":178.4,"unit":"µg/m³","limit":100,"status":"Poor","trend":"up","desc":"Dense commercial transport and municipal dust"},{"code":"NO2","name":"Nitrogen Dioxide","value":46.2,"unit":"ppb","limit":80,"status":"Moderate","trend":"up","desc":"Heavy bus and diesel taxi fleets"},{"code":"SO2","name":"Sulfur Dioxide","value":18,"unit":"ppb","limit":80,"status":"Good","trend":"stable","desc":"Howrah industrial belt processes"},{"code":"CO","name":"Carbon Monoxide","value":1.6,"unit":"mg/m³","limit":4,"status":"Good","trend":"up","desc":"Narrow street canyons slowing exhaust dispersion"},{"code":"O3","name":"Ground-level Ozone","value":22.8,"unit":"ppb","limit":100,"status":"Good","trend":"down","desc":"Moist air dampening ozone concentration"}]', '{"temperature":"28°C","humidity":"79%","wind":"7 km/h N","pressure":"1013 hPa","visibility":"4.0 km"}', '[{"time":"12 PM","aqi":155},{"time":"2 PM","aqi":165},{"time":"4 PM","aqi":172},{"time":"6 PM","aqi":185},{"time":"8 PM","aqi":190},{"time":"10 PM","aqi":178},{"time":"12 AM","aqi":162}]', 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)', 1),
  (7, 7, 'pune', 68, 'Moderate', 'PM10', '-2%', '[{"code":"PM2.5","name":"Fine Particulate Matter","value":39.8,"unit":"µg/m³","limit":60,"status":"Moderate","trend":"down","desc":"Automobile belt emissions and suburban dispersion"},{"code":"PM10","name":"Coarse Particulates","value":76.5,"unit":"µg/m³","limit":100,"status":"Moderate","trend":"stable","desc":"Infrastructure expansion and hill slope dust"},{"code":"NO2","name":"Nitrogen Dioxide","value":26.4,"unit":"ppb","limit":80,"status":"Good","trend":"stable","desc":"Pimpri-Chinchwad arterial road traffic"},{"code":"SO2","name":"Sulfur Dioxide","value":9.8,"unit":"ppb","limit":80,"status":"Good","trend":"stable","desc":"Controlled industrial manufacturing zones"},{"code":"CO","name":"Carbon Monoxide","value":0.8,"unit":"mg/m³","limit":4,"status":"Good","trend":"stable","desc":"Smooth highway bypass distribution"},{"code":"O3","name":"Ground-level Ozone","value":31,"unit":"ppb","limit":100,"status":"Good","trend":"up","desc":"Moderate solar radiance conditions"}]', '{"temperature":"27°C","humidity":"64%","wind":"10 km/h WNW","pressure":"1013 hPa","visibility":"9.0 km"}', '[{"time":"12 PM","aqi":62},{"time":"2 PM","aqi":68},{"time":"4 PM","aqi":73},{"time":"6 PM","aqi":76},{"time":"8 PM","aqi":71},{"time":"10 PM","aqi":66},{"time":"12 AM","aqi":58}]', 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)', 1),
  (8, 8, 'shimla', 22, 'Good', 'PM2.5', '-5%', '[{"code":"PM2.5","name":"Fine Particulate Matter","value":8.4,"unit":"µg/m³","limit":60,"status":"Good","trend":"stable","desc":"Pure Himalayan mountain airs and cedar canopy"},{"code":"PM10","name":"Coarse Particulates","value":21,"unit":"µg/m³","limit":100,"status":"Good","trend":"down","desc":"Minimal dust due to mountain vegetation"},{"code":"NO2","name":"Nitrogen Dioxide","value":6.5,"unit":"ppb","limit":80,"status":"Good","trend":"stable","desc":"Pedestrianized ridge area with zero vehicular traffic"},{"code":"SO2","name":"Sulfur Dioxide","value":2.1,"unit":"ppb","limit":80,"status":"Good","trend":"stable","desc":"No industrial combustion within 60km"},{"code":"CO","name":"Carbon Monoxide","value":0.2,"unit":"mg/m³","limit":4,"status":"Good","trend":"stable","desc":"Near baseline atmospheric levels"},{"code":"O3","name":"Ground-level Ozone","value":18,"unit":"ppb","limit":100,"status":"Good","trend":"stable","desc":"Pristine mountain troposphere"}]', '{"temperature":"16°C","humidity":"48%","wind":"8 km/h NNW","pressure":"1018 hPa","visibility":"15.0 km"}', '[{"time":"12 PM","aqi":20},{"time":"2 PM","aqi":22},{"time":"4 PM","aqi":24},{"time":"6 PM","aqi":25},{"time":"8 PM","aqi":23},{"time":"10 PM","aqi":21},{"time":"12 AM","aqi":18}]', 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)', 1);

-- 4. Authenticated System Users (Demo User & Environmental Operations Admin)
-- Credentials:
-- User:  demo@aerosense.air  / password123
-- Admin: admin@aerosense.air / AdminPass2026!
INSERT INTO users (id, name, email, password_hash, avatar, role, is_active, settings) VALUES
  (1, 'Dr. Aarav Sharma', 'demo@aerosense.air', '$2b$10$2ynND6a.Z1EjgrsJHeircOJRCygE9VfdGFS93eqI3qyTP4erAUzSq', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'user', 1, '{"temperatureUnit":"C","defaultDashboardView":"detailed"}'),
  (2, 'Director Environmental Operations', 'admin@aerosense.air', '$2b$10$hhJWBqlDhOaLTWTkeXbbdepjOTrRnsaX/c8yNp4T5KrRhnqwBuXNe', '', 'admin', 1, '{"temperatureUnit":"C","defaultDashboardView":"detailed"}');

-- 5. User Favorite Cities
INSERT INTO user_favorites (id, user_id, city_slug) VALUES
  (1, 1, 'delhi'),
  (2, 1, 'mumbai'),
  (3, 1, 'bengaluru'),
  (4, 2, 'delhi'),
  (5, 2, 'mumbai'),
  (6, 2, 'kolkata'),
  (7, 2, 'chennai'),
  (8, 2, 'bengaluru');

-- 6. User Recent Visited Cities
INSERT INTO user_recent_cities (id, user_id, city_slug) VALUES
  (1, 1, 'delhi'),
  (2, 1, 'mumbai');

-- 7. Active AQI Threshold Alerts
INSERT INTO alerts (id, user_id, city_slug, city_name, type, threshold, operator, enabled, cooldown_hours) VALUES
  (1, 1, 'delhi', 'Delhi NCR', 'threshold', 200, 'above', 1, 6),
  (2, 1, 'mumbai', 'Mumbai', 'threshold', 150, 'above', 1, 6);

-- 8. User Environmental Advisory Notifications
INSERT INTO notifications (id, user_id, alert_id, city_slug, type, title, message, is_read, metadata) VALUES
  (1, 1, 1, 'delhi', 'alert_triggered', 'AQI Advisory - Delhi NCR', 'AQI in Delhi NCR reached 284 (Unhealthy). Sensitive groups and outdoor runners should reduce exposure.', 0, '{"aqi":284,"category":"Unhealthy"}'),
  (2, 1, NULL, 'system', 'system', 'Welcome to AeroSense Intelligence', 'Your environmental telemetry dashboard has been activated. Configure favorite city alerts anytime.', 1, '{"welcome":true}');

-- 9. Administrative Audit Trail
INSERT INTO audit_logs (id, actor_user_id, actor_email, action, resource_type, resource_id, details, ip_address) VALUES
  (1, '2', 'admin@aerosense.air', 'SYSTEM_INITIALIZE', 'DATABASE', 'aerosense', '{"platform":"AeroSense 2026","schema":"MySQL 8.0 Relational"}', '127.0.0.1');

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- END OF SQL DUMP
-- =============================================================================
