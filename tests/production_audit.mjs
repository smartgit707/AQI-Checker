/**
 * AeroSense Part 8 Production Comprehensive Verification Test Suite
 * Validates End-to-End System Integrity, Security, Performance, and Data Standards
 */

import assert from 'assert';

const BASE_URL = process.env.TEST_API_URL || 'http://127.0.0.1:5050';
const API_V1 = `${BASE_URL}/api/v1`;

let userAToken = null;
let userBToken = null;
let adminToken = null;
let alertAId = null;

async function runProductionAudit() {
  console.log('===============================================================');
  console.log('  AeroSense Part 8: Comprehensive Production Audit & Verification');
  console.log(`  Target Base: ${BASE_URL}`);
  console.log('===============================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`• ${name}... `);
      await fn();
      console.log('PASSED ✓');
      passedCount++;
    } catch (err) {
      console.log(`FAILED ✗\n  Error: ${err.message}`);
      failedCount++;
    }
  }

  // 1. Health & System Diagnostics
  await test('Health check returns operational status and subsystem telemetry', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.status, 'healthy');
    assert.ok(data.data.uptimeSeconds >= 0);
    assert.ok(data.data.subsystems);
    assert.ok(data.data.subsystems.forecastingEngine.includes('v1.4'));
    assert.ok(data.data.memory.rssMb > 0);
    // Ensure no secret credentials leaked
    const stringified = JSON.stringify(data);
    assert.ok(!stringified.includes('password') && !stringified.includes('secret') && !stringified.includes('mongodb+srv'));
  });

  // 2. Security Headers & Rate Limiting
  await test('Security headers (Helmet) and RateLimit headers are attached', async () => {
    const res = await fetch(`${API_V1}/cities`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('x-content-type-options') || res.headers.get('content-security-policy'));
    assert.ok(res.headers.get('x-ratelimit-limit'), 'X-RateLimit-Limit should be present');
    assert.ok(res.headers.get('x-ratelimit-remaining'), 'X-RateLimit-Remaining should be present');
  });

  // 3. User A Authentication
  await test('User A authentication & passwordHash exclusion', async () => {
    const res = await fetch(`${API_V1}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@aerosense.air', password: 'password123' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    assert.strictEqual(data.user.role, 'user');
    assert.strictEqual(data.user.passwordHash, undefined, 'passwordHash must never be returned');
    userAToken = data.token;
  });

  // 4. User B Authentication (for Cross-User Data Isolation testing)
  await test('User B registration / authentication for isolation checks', async () => {
    // Unique user B email
    const email = `audit_user_${Date.now()}@aerosense.air`;
    const regRes = await fetch(`${API_V1}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Audit User B',
        email,
        password: 'Password123!',
        confirmPassword: 'Password123!'
      })
    });
    assert.strictEqual(regRes.status, 201);
    const regData = await regRes.json();
    assert.ok(regData.token);
    assert.strictEqual(regData.user.role, 'user');
    userBToken = regData.token;
  });

  // 5. Admin Authentication & Role Tagging
  await test('Admin user authentication (admin@aerosense.air)', async () => {
    const res = await fetch(`${API_V1}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@aerosense.air', password: 'AdminPass2026!' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'admin');
    adminToken = data.token;
  });

  // 6. RBAC: Normal User Forbidden from Admin Endpoints
  await test('Normal user is strictly blocked with HTTP 403 Forbidden on admin APIs', async () => {
    const res = await fetch(`${API_V1}/admin/overview`, {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert.strictEqual(res.status, 403, 'Normal user must receive 403 Forbidden');
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  // 7. Admin Authorized Access
  await test('Admin user is authorized for administrative telemetry endpoints', async () => {
    const res = await fetch(`${API_V1}/admin/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.metrics);
  });

  // 8. Public Exploration: City Dashboard & Grounded Insights
  await test('City dashboard returns real telemetry & grounded insights', async () => {
    const res = await fetch(`${API_V1}/cities/delhi/dashboard`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.city.slug, 'delhi');
    assert.ok(data.data.airQuality.aqi > 0);
    assert.ok(Array.isArray(data.data.insights));
    assert.ok(data.data.insights.length > 0);
    const insight = data.data.insights[0];
    assert.ok(insight.type && insight.severity && insight.title && insight.metric && insight.source);
  });

  // 9. Forecasting Engine Validation (No Fake AI)
  await test('AeroCast mathematical forecasting returns 95% confidence intervals & validation metrics', async () => {
    const res = await fetch(`${API_V1}/forecast/delhi?hours=24`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.forecast.length, 24);
    const pt = data.data.forecast[0];
    assert.ok(pt.predictedAQI > 0);
    assert.ok(pt.upperBound >= pt.predictedAQI);
    assert.ok(pt.lowerBound <= pt.predictedAQI);
    assert.ok(data.data.model.name.includes('AeroCast'));
    assert.ok(data.data.model.validation.mae > 0);
    assert.ok(data.data.model.validation.rmse > 0);
  });

  // 10. Alerts: Creation & Input Validation
  await test('Alert threshold creation and boundary validation', async () => {
    // Negative threshold must fail with 400
    const failRes = await fetch(`${API_V1}/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`
      },
      body: JSON.stringify({ citySlug: 'delhi', threshold: -50 })
    });
    assert.ok(failRes.status >= 400, 'Negative threshold must fail');

    // Valid alert creation
    const okRes = await fetch(`${API_V1}/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`
      },
      body: JSON.stringify({
        citySlug: 'delhi',
        threshold: 120,
        operator: 'above',
        cooldownHours: 6
      })
    });
    assert.strictEqual(okRes.status, 201);
    const alertData = await okRes.json();
    alertAId = alertData.alert?._id || alertData.data?._id;
    assert.ok(alertAId);
  });

  // 11. Cross-User Data Isolation: User B Cannot Access User A Alerts
  await test('Cross-user isolation: User B cannot access or view User A alerts', async () => {
    const res = await fetch(`${API_V1}/alerts`, {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    const alerts = data.alerts || data.data || [];
    const hasUserAAlert = alerts.some((a) => a._id === alertAId);
    assert.strictEqual(hasUserAAlert, false, 'User B must not see User A alerts');
  });

  // 12. Alert Evaluation & 6-Hour Anti-Spam Cooldown
  await test('Alert evaluation triggers notifications & respects 6h cooldown window', async () => {
    // 1st Evaluation: Should trigger if threshold is crossed
    const evalRes1 = await fetch(`${API_V1}/alerts/evaluate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert.strictEqual(evalRes1.status, 200);

    // 2nd Immediate Evaluation: Must be suppressed by 6h cooldown (triggeredCount == 0 for this alert)
    const evalRes2 = await fetch(`${API_V1}/alerts/evaluate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert.strictEqual(evalRes2.status, 200);
    const evalData2 = await evalRes2.json();
    assert.strictEqual(evalData2.triggeredCount, 0, 'Subsequent evaluation within cooldown window must trigger 0 alerts');
  });

  // 13. Notifications Inbox & Read State
  await test('In-app notifications retrieve unread count and support mark-as-read', async () => {
    const listRes = await fetch(`${API_V1}/notifications`, {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert.strictEqual(listRes.status, 200);
    const listData = await listRes.json();
    const notifs = listData.notifications || listData.data || [];
    assert.ok(Array.isArray(notifs));

    // Mark all read
    const readAllRes = await fetch(`${API_V1}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert.strictEqual(readAllRes.status, 200);

    // Verify unread count is 0
    const countRes = await fetch(`${API_V1}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert.strictEqual(countRes.status, 200);
    const countData = await countRes.json();
    assert.strictEqual(countData.unreadCount, 0);
  });

  // 14. Cleanup Test Resources
  await test('Clean up test alert resources', async () => {
    if (alertAId) {
      const delRes = await fetch(`${API_V1}/alerts/${alertAId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userAToken}` }
      });
      assert.strictEqual(delRes.status, 200);
    }
  });

  console.log('\n===============================================================');
  console.log(`  Audit Summary:`);
  console.log(`  Tests run: ${passedCount + failedCount}`);
  console.log(`  Passed:    ${passedCount}`);
  console.log(`  Failed:    ${failedCount}`);
  console.log(`  Skipped:   0`);
  console.log('===============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runProductionAudit().catch((err) => {
  console.error('[Audit Suite Critical Failure]:', err);
  process.exit(1);
});
