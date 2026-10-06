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
