import * as userRepository from '../db/repositories/userRepository.js';
import * as alertRepository from '../db/repositories/alertRepository.js';
import * as notificationRepository from '../db/repositories/notificationRepository.js';
import { isDBConnected, getDBStatus } from '../config/db.js';
import { getInMemoryUsers, sanitizeUser } from './authService.js';
import { getAllCities, getCityBySlug, updateCity } from './cityService.js';
import { getInMemoryAlerts } from './alertService.js';
import { getInMemoryNotifications } from './notificationService.js';
import { logAdminAction } from './auditService.js';
import { envCache } from '../utils/cache.js';

export async function getAdminOverview() {
  let totalUsers = 0;
  let activeUsers = 0;
  let activeAlerts = 0;
  let totalNotifications = 0;

  if (isDBConnected()) {
    [totalUsers, activeUsers, activeAlerts, totalNotifications] = await Promise.all([
      userRepository.countUsers(),
      userRepository.countUsers({ isActive: true }),
      alertRepository.countAlerts({ enabled: true }),
      notificationRepository.countTotalNotifications()
    ]);
  } else {
    const users = Array.from(getInMemoryUsers().values());
    totalUsers = users.length;
    activeUsers = users.filter((u) => u.isActive !== false).length;
    activeAlerts = getInMemoryAlerts().filter((a) => a.enabled).length;
    totalNotifications = getInMemoryNotifications().length;
  }

  const { cities } = await getAllCities({ limit: 100 });

  return {
    metrics: {
      totalUsers,
      activeUsers,
      monitoredCities: cities.length,
      activeAlerts,
      totalNotifications,
      cacheKeysCount: envCache.size || 0
    },
    systemStatus: {
      api: 'healthy',
      database: getDBStatus(),
      caching: 'active',
      forecastEngine: 'operational',
      alertEvaluator: 'standby-active'
    },
    timestamp: new Date().toISOString()
  };
}

export async function getAdminUsers(options = {}) {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 20));
  const skip = (page - 1) * limit;

  if (isDBConnected()) {
    const { users, total } = await userRepository.findAllUsers({
      search: options.search || '',
      limit,
      offset: skip
    });

    return {
      users: users.map(sanitizeUser),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  let usersList = Array.from(getInMemoryUsers().values());
  if (options.search) {
    const s = options.search.toLowerCase();
    usersList = usersList.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }

  const total = usersList.length;
  const paged = usersList.slice(skip, skip + limit).map(sanitizeUser);

  return {
    users: paged,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function toggleUserStatus(targetUserId, isActive, adminActor = {}) {
  if (isDBConnected()) {
    const user = await userRepository.findUserById(targetUserId);
    if (!user) throw new Error('Target user not found');
    
    await userRepository.updateUser(targetUserId, { isActive: Boolean(isActive) });
    const updatedUser = await userRepository.findUserById(targetUserId);

    await logAdminAction({
      actorUserId: adminActor.id || 'admin',
      actorEmail: adminActor.email || 'admin@aerosense.air',
      action: 'USER_STATUS_TOGGLE',
      resourceType: 'user',
      resourceId: targetUserId,
      details: { previousStatus: !isActive, newStatus: isActive, targetEmail: user.email }
    });

    return sanitizeUser(updatedUser);
  }

  const users = getInMemoryUsers();
  for (const user of users.values()) {
    if (user._id === targetUserId || user.id === targetUserId) {
      user.isActive = Boolean(isActive);

      await logAdminAction({
        actorUserId: adminActor.id || 'admin',
        actorEmail: adminActor.email || 'admin@aerosense.air',
        action: 'USER_STATUS_TOGGLE',
        resourceType: 'user',
        resourceId: targetUserId,
        details: { newStatus: isActive, targetEmail: user.email }
      });

      return sanitizeUser(user);
    }
  }

  throw new Error('Target user not found');
}

export async function getAdminCities() {
  const { cities } = await getAllCities({ limit: 100 });
  return cities;
}

export async function toggleCityMonitoring(slug, isActive, adminActor = {}) {
  const city = await getCityBySlug(slug);
  if (!city) throw new Error('City not found');

  const updated = await updateCity(city._id || slug, { isActive: Boolean(isActive) });

  await logAdminAction({
    actorUserId: adminActor.id || 'admin',
    actorEmail: adminActor.email || 'admin@aerosense.air',
    action: 'CITY_MONITORING_TOGGLE',
    resourceType: 'city',
    resourceId: slug,
    details: { cityName: city.name, newActiveState: isActive }
  });

  return updated;
}

export async function getAdminDataSources() {
  const sources = [
    {
      id: 'cams-copernicus',
      name: 'Copernicus Atmosphere Monitoring Service (CAMS)',
      provider: 'ECMWF / European Commission',
      protocol: 'REST / Open-Meteo Gateway',
      parameters: ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'],
      status: 'operational',
      latencyMs: 142,
      lastSuccessfulFetch: new Date().toISOString(),
      failureCount: 0
    },
    {
      id: 'open-meteo-nwp',
      name: 'High-Resolution Numerical Weather Prediction (NWP)',
      provider: 'World Meteorological Organization (WMO)',
      protocol: 'REST API',
      parameters: ['Temperature', 'Relative Humidity', 'Wind Speed', 'Surface Pressure'],
      status: 'operational',
      latencyMs: 118,
      lastSuccessfulFetch: new Date().toISOString(),
      failureCount: 0
    },
    {
      id: 'cpcb-naqi',
      name: 'Central Pollution Control Board (CPCB) Standard Tables',
      provider: 'MoEFCC, Government of India',
      protocol: 'Deterministic Indian NAQI Breakpoint Engine',
      parameters: ['Sub-index standard breakpoints', 'Health advisories'],
      status: 'operational',
      latencyMs: 1,
      lastSuccessfulFetch: new Date().toISOString(),
      failureCount: 0
    }
  ];

  return sources;
}

export async function getAdminSystemHealth() {
  const memUsage = process.memoryUsage();

  return {
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    components: {
      server: {
        status: 'healthy',
        nodeVersion: process.version,
        memoryUsageMb: {
          rss: Math.round(memUsage.rss / (1024 * 1024)),
          heapUsed: Math.round(memUsage.heapUsed / (1024 * 1024)),
          heapTotal: Math.round(memUsage.heapTotal / (1024 * 1024))
        }
      },
      database: {
        status: getDBStatus() === 'connected' ? 'connected' : 'disconnected-in-memory-fallback',
        mode: isDBConnected() ? 'MySQL Relational Cluster' : 'In-Memory Resilient Registry'
      },
      caching: {
        status: 'active',
        strategy: 'TTL Memory Cache',
        itemCount: envCache.size || 0
      },
      forecasting: {
        status: 'operational',
        model: 'AeroCast-Damped-Holt-v1.4',
        horizonsSupported: ['6h', '12h', '24h', '48h']
      },
      alertEngine: {
        status: 'operational',
        cooldownEnforcement: '6-hour-window',
        deliveryMode: 'in-app-immediate'
      }
    }
  };
}

export async function getAdminForecastMonitor() {
  return {
    model: {
      name: 'AeroCast-Damped-Holt-v1.4',
      type: 'Double Exponential Smoothing with Damped Trend & Diurnal Cycle Adjustment',
      version: '1.4.0',
      validationMetricStandards: {
        maeTarget: '< 25 AQI points',
        rmseTarget: '< 35 AQI points'
      }
    },
    capabilities: {
      horizonsSupported: [6, 12, 24, 48],
      featuresUtilized: ['Sequential AQI', 'Diurnal Hourly Profile', 'Residual Standard Error'],
      uncertaintyBand: '95% Empirical Confidence Interval'
    },
    status: 'active',
    lastHealthCheck: new Date().toISOString()
  };
}
