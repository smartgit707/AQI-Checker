import http from 'http';
import app from '../src/app.js';
import { getMySQLConfig, isDBConnected } from '../src/config/db.js';

async function runTests() {
  console.log('===============================================================');
  console.log(' AeroSense MySQL Migration Verification Test Suite');
  console.log('===============================================================');

  const server = app.listen(5088);
  const baseUrl = 'http://127.0.0.1:5088';

  const results = [];

  async function request(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const req = http.request(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          let json = null;
          try { json = JSON.parse(body); } catch (e) { json = body; }
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        });
      });

      req.on('error', reject);
      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
      req.end();
    });
  }

  function assert(testName, passed, details = '') {
    results.push({ testName, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} | ${testName}${details ? ` (${details})` : ''}`);
  }

  try {
    // 1. Database Configuration Test
    const config = getMySQLConfig();
    assert(
      'MySQL Configuration Module',
      Boolean(config.host && config.port && config.database),
      `Host: ${config.host}:${config.port}, DB: ${config.database}`
    );

    // 2. Health Check Endpoint
    const healthRes = await request('/api/health');
    assert(
      'GET /api/health',
      healthRes.status === 200 && healthRes.body?.success === true,
      `Status: ${healthRes.status}, DB Subsystem: ${healthRes.body?.data?.subsystems?.database}`
    );

    // 3. City Catalog Endpoint
    const citiesRes = await request('/api/v1/cities?limit=5');
    assert(
      'GET /api/v1/cities (Pagination & List)',
      citiesRes.status === 200 && Array.isArray(citiesRes.body?.data) && citiesRes.body.data.length > 0,
      `Returned ${citiesRes.body?.data?.length} cities`
    );

    // 4. Single City Endpoint
    const cityRes = await request('/api/v1/cities/mumbai');
    assert(
      'GET /api/v1/cities/mumbai',
      cityRes.status === 200 && cityRes.body?.data?.slug === 'mumbai',
      `City: ${cityRes.body?.data?.name}`
    );

    // 5. City Aggregated Intelligence Dashboard
    const dashRes = await request('/api/v1/cities/mumbai/dashboard');
    assert(
      'GET /api/v1/cities/mumbai/dashboard (Aggregated Intelligence)',
      dashRes.status === 200 && Boolean(dashRes.body?.data?.airQuality && dashRes.body?.data?.history),
      `AQI: ${dashRes.body?.data?.airQuality?.aqi}, Category: ${dashRes.body?.data?.airQuality?.category}`
    );

    // 6. Latest Air Quality Endpoint
    const aqRes = await request('/api/v1/air-quality/delhi/latest');
    assert(
      'GET /api/v1/air-quality/delhi/latest',
      aqRes.status === 200 && Boolean(aqRes.body?.data?.aqi),
      `Delhi AQI: ${aqRes.body?.data?.aqi}`
    );

    // 7. Historical Air Quality Timeline
    const histRes = await request('/api/v1/air-quality/delhi/history?period=7d');
    assert(
      'GET /api/v1/air-quality/delhi/history?period=7d',
      histRes.status === 200 && Array.isArray(histRes.body?.data?.points),
      `Points: ${histRes.body?.data?.points?.length}`
    );

    // 8. Geospatial Map Telemetry
    const mapRes = await request('/api/v1/air-quality/map');
    assert(
      'GET /api/v1/air-quality/map',
      mapRes.status === 200 && Array.isArray(mapRes.body?.data),
      `Map Stations: ${mapRes.body?.data?.length}`
    );

    // 9. AeroCast Forecasting Endpoint
    const forecastRes = await request('/api/v1/forecast/mumbai?horizon=24');
    assert(
      'GET /api/v1/forecast/mumbai?horizon=24',
      forecastRes.status === 200 && Boolean(forecastRes.body?.data?.outlook),
      `Horizon: ${forecastRes.body?.data?.horizonHours}h, Model: ${forecastRes.body?.data?.model?.name}`
    );

    // 10. Data Sources Endpoint
    const dsRes = await request('/api/v1/data-sources');
    assert(
      'GET /api/v1/data-sources',
      dsRes.status === 200 && Array.isArray(dsRes.body?.data),
      `Sources: ${dsRes.body?.data?.length}`
    );

    // 11. National Environmental Analytics
    const analyticsRes = await request('/api/v1/analytics/dashboard');
    assert(
      'GET /api/v1/analytics/dashboard',
      analyticsRes.status === 200 && Boolean(analyticsRes.body?.data?.overview),
      `Monitored Cities: ${analyticsRes.body?.data?.overview?.totalCitiesMonitored}`
    );

    // 12. Cross-City Comparison
    const compareRes = await request('/api/v1/compare?cities=delhi,mumbai');
    assert(
      'GET /api/v1/compare?cities=delhi,mumbai',
      compareRes.status === 200 && Array.isArray(compareRes.body?.data?.cities),
      `Compared: ${compareRes.body?.data?.cities?.length} cities`
    );

    // 13. Authentication: User Registration
    const testEmail = `test_${Date.now()}@aerosense.air`;
    const regRes = await request('/api/v1/auth/register', {
      method: 'POST',
      body: {
        name: 'Test Environmental Analyst',
        email: testEmail,
        password: 'password123'
      }
    });
    const regToken = regRes.body?.token || regRes.body?.data?.token;
    assert(
      'POST /api/v1/auth/register',
      regRes.status === 201 && Boolean(regToken),
      `Created user: ${testEmail}`
    );

    // 14. Authentication: User Login
    const loginRes = await request('/api/v1/auth/login', {
      method: 'POST',
      body: {
        email: 'demo@aerosense.air',
        password: 'password123'
      }
    });
    const userToken = loginRes.body?.token || loginRes.body?.data?.token;
    const loggedUser = loginRes.body?.user || loginRes.body?.data?.user;
    assert(
      'POST /api/v1/auth/login (Demo User)',
      loginRes.status === 200 && Boolean(userToken),
      `Logged in: ${loggedUser?.email}`
    );

    // 15. User Profile Endpoint (Protected)
    const profileRes = await request('/api/v1/users/profile', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const profileUser = profileRes.body?.user || profileRes.body?.data?.user;
    assert(
      'GET /api/v1/users/profile (Bearer Auth)',
      profileRes.status === 200 && profileUser?.email === 'demo@aerosense.air',
      `Profile: ${profileUser?.name}`
    );

    // 16. User Favorites Management
    const favsRes = await request('/api/v1/users/favorites', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const favoritesList = favsRes.body?.favorites || favsRes.body?.data;
    assert(
      'GET /api/v1/users/favorites',
      favsRes.status === 200 && Array.isArray(favoritesList),
      `Favorites: ${favoritesList?.length}`
    );

    // 17. Alert Creation & Retrieval
    const createAlertRes = await request('/api/v1/alerts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: {
        citySlug: 'pune',
        threshold: 120,
        operator: 'above'
      }
    });
    assert(
      'POST /api/v1/alerts (Create Threshold Alert)',
      (createAlertRes.status === 201 || createAlertRes.status === 200) && Boolean(createAlertRes.body?.data),
      `Alert created for ${createAlertRes.body?.data?.citySlug} at AQI ${createAlertRes.body?.data?.threshold}`
    );

    const alertsListRes = await request('/api/v1/alerts', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(
      'GET /api/v1/alerts (User Alerts)',
      alertsListRes.status === 200 && Array.isArray(alertsListRes.body?.data),
      `Total alerts: ${alertsListRes.body?.data?.length}`
    );

    // 18. User In-App Notifications
    const notifsRes = await request('/api/v1/notifications', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(
      'GET /api/v1/notifications',
      notifsRes.status === 200 && Array.isArray(notifsRes.body?.data),
      `Notifications: ${notifsRes.body?.data?.length}`
    );

    // 19. Admin Authentication & Role Authorization
    const adminLoginRes = await request('/api/v1/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@aerosense.air',
        password: 'AdminPass2026!'
      }
    });
    const adminToken = adminLoginRes.body?.token || adminLoginRes.body?.data?.token;
    const adminUser = adminLoginRes.body?.user || adminLoginRes.body?.data?.user;
    assert(
      'POST /api/v1/auth/login (Admin Account)',
      adminLoginRes.status === 200 && Boolean(adminToken),
      `Admin role: ${adminUser?.role}`
    );

    const adminOverviewRes = await request('/api/v1/admin/overview', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(
      'GET /api/v1/admin/overview (Admin Authorization)',
      adminOverviewRes.status === 200 && Boolean(adminOverviewRes.body?.data?.metrics),
      `Total users: ${adminOverviewRes.body?.data?.metrics?.totalUsers}, Cities: ${adminOverviewRes.body?.data?.metrics?.monitoredCities}`
    );

    const adminHealthRes = await request('/api/v1/admin/system-health', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(
      'GET /api/v1/admin/system-health',
      adminHealthRes.status === 200 && Boolean(adminHealthRes.body?.data?.components?.database),
      `Database Component: ${adminHealthRes.body?.data?.components?.database?.status}`
    );

  } catch (err) {
    console.error('Test Suite encountered an unexpected error:', err);
  } finally {
    server.close();
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    console.log('===============================================================');
    console.log(` Test Summary: ${passedCount}/${totalCount} tests passed (${Math.round((passedCount/totalCount)*100)}%)`);
    console.log('===============================================================');
    process.exit(passedCount === totalCount ? 0 : 1);
  }
}

runTests();
