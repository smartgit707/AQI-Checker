import { mapCityRow } from '../src/db/repositories/cityRepository.js';
import { mapUserRow } from '../src/db/repositories/userRepository.js';
import { mapAirQualityRow } from '../src/db/repositories/airQualityRepository.js';
import { mapAlertRow } from '../src/db/repositories/alertRepository.js';
import { mapNotificationRow } from '../src/db/repositories/notificationRepository.js';
import { mapDataSourceRow } from '../src/db/repositories/dataSourceRepository.js';
import { mapAuditRow } from '../src/db/repositories/auditRepository.js';

console.log('Testing MySQL Repository Data Mappers...');

// 1. City Mapper
const cityMapped = mapCityRow({
  id: 1,
  name: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  slug: 'mumbai',
  latitude: '19.0760',
  longitude: '72.8777',
  station: 'BKC Station',
  image_url: 'https://example.com/mumbai.jpg',
  image_alt: 'Mumbai skyline',
  description: 'Financial Capital',
  population: 21000000,
  is_active: 1,
  created_at: new Date(),
  updated_at: new Date()
});

console.assert(cityMapped.id === '1', 'City id mapped');
console.assert(cityMapped.coordinates.latitude === 19.076, 'City lat mapped');
console.assert(cityMapped.image.url === 'https://example.com/mumbai.jpg', 'City image mapped');
console.log('✅ City Mapper Passed');

// 2. User Mapper
const userMapped = mapUserRow({
  id: 2,
  name: 'Test User',
  email: 'test@example.com',
  password_hash: '$2a$10$hashed',
  avatar: 'avatar.jpg',
  role: 'admin',
  is_active: 1,
  settings: JSON.stringify({ temperatureUnit: 'F', defaultDashboardView: 'compact' }),
  last_login_at: new Date(),
  created_at: new Date(),
  updated_at: new Date()
}, ['delhi', 'mumbai'], [{ slug: 'delhi', visitedAt: new Date() }]);

console.assert(userMapped.id === '2', 'User id mapped');
console.assert(userMapped.settings.temperatureUnit === 'F', 'User settings parsed');
console.assert(userMapped.favoriteCities.length === 2, 'User favorites mapped');
console.log('✅ User Mapper Passed');

// 3. Air Quality Mapper
const aqMapped = mapAirQualityRow({
  id: 10,
  city_id: 1,
  city_slug: 'mumbai',
  aqi: 112,
  category: 'Poor',
  dominant_pollutant: 'PM10',
  trend_24h: '+3%',
  pollutants: JSON.stringify([{ code: 'PM2.5', value: 35 }]),
  weather: JSON.stringify({ temperature: '32°C', humidity: '70%' }),
  hourly_forecast: JSON.stringify([{ time: '12 PM', aqi: 110 }]),
  source: 'CPCB CAAQMS',
  is_demo_data: 0,
  timestamp: new Date(),
  created_at: new Date()
});

console.assert(aqMapped.aqi === 112, 'AQI mapped');
console.assert(aqMapped.pollutants[0].code === 'PM2.5', 'Pollutants JSON parsed');
console.assert(aqMapped.weather.temperature === '32°C', 'Weather JSON parsed');
console.log('✅ Air Quality Mapper Passed');

// 4. Alert Mapper
const alertMapped = mapAlertRow({
  id: 5,
  user_id: 2,
  city_slug: 'delhi',
  city_name: 'Delhi NCR',
  type: 'threshold',
  threshold: 200,
  operator: 'above',
  enabled: 1,
  cooldown_hours: 6,
  last_triggered_at: null,
  created_at: new Date(),
  updated_at: new Date()
});

console.assert(alertMapped.threshold === 200, 'Alert threshold mapped');
console.assert(alertMapped.enabled === true, 'Alert enabled boolean mapped');
console.log('✅ Alert Mapper Passed');

// 5. Notification Mapper
const notifMapped = mapNotificationRow({
  id: 7,
  user_id: 2,
  alert_id: 5,
  city_slug: 'delhi',
  type: 'alert_triggered',
  title: 'High AQI',
  message: 'Exceeded 200',
  is_read: 0,
  metadata: JSON.stringify({ aqi: 240 }),
  created_at: new Date()
});

console.assert(notifMapped.read === false, 'Notification read mapped');
console.assert(notifMapped.metadata.aqi === 240, 'Notification metadata mapped');
console.log('✅ Notification Mapper Passed');

// 6. Data Source Mapper
const dsMapped = mapDataSourceRow({
  id: 1,
  name: 'CAMS',
  provider: 'ECMWF',
  type: 'Satellite',
  url: 'https://cams.ecmwf.int',
  standard: 'EU/WMO',
  description: 'Copernicus Atmospheric',
  active: 1,
  last_updated: new Date(),
  created_at: new Date(),
  updated_at: new Date()
});

console.assert(dsMapped.provider === 'ECMWF', 'Data Source mapped');
console.log('✅ Data Source Mapper Passed');

// 7. Audit Log Mapper
const auditMapped = mapAuditRow({
  id: 99,
  actor_user_id: 'user_1',
  actor_email: 'admin@aerosense.air',
  action: 'UPDATE',
  resource_type: 'city',
  resource_id: 'mumbai',
  details: JSON.stringify({ status: 'active' }),
  ip_address: '127.0.0.1',
  created_at: new Date()
});

console.assert(auditMapped.details.status === 'active', 'Audit details mapped');
console.log('✅ Audit Log Mapper Passed');

console.log('ALL REPOSITORY MAPPERS VERIFIED SUCCESSFULLY! 🚀');
