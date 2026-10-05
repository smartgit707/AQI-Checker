import {
  getAdminOverview,
  getAdminUsers,
  toggleUserStatus,
  getAdminCities,
  toggleCityMonitoring,
  getAdminDataSources,
  getAdminSystemHealth,
  getAdminForecastMonitor
} from '../services/adminService.js';
import { getAuditLogs } from '../services/auditService.js';

export async function getOverview(req, res, next) {
  try {
    const overview = await getAdminOverview();
    return res.status(200).json({ success: true, data: overview });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(req, res, next) {
  try {
    const data = await getAdminUsers(req.query);
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
}

export async function setUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await toggleUserStatus(id, isActive, req.user);
    return res.status(200).json({
      success: true,
      message: `User status updated to ${isActive ? 'active' : 'deactivated'}`,
      data: user
    });
  } catch (error) {
    next(error);
  }
}

export async function getCities(req, res, next) {
  try {
    const cities = await getAdminCities();
    return res.status(200).json({ success: true, count: cities.length, data: cities, cities });
  } catch (error) {
    next(error);
  }
}

export async function setCityMonitoring(req, res, next) {
  try {
    const { slug } = req.params;
    const { isActive } = req.body;
    const updated = await toggleCityMonitoring(slug, isActive, req.user);
    return res.status(200).json({
      success: true,
      message: `City ${slug} monitoring ${isActive ? 'enabled' : 'disabled'}`,
      data: updated,
      city: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function getDataSources(req, res, next) {
  try {
    const sources = await getAdminDataSources();
    return res.status(200).json({ success: true, count: sources.length, data: sources, sources });
  } catch (error) {
    next(error);
  }
}

export async function getSystemHealth(req, res, next) {
  try {
    const health = await getAdminSystemHealth();
    return res.status(200).json({ success: true, data: health, health });
  } catch (error) {
    next(error);
  }
}

export async function getForecasts(req, res, next) {
  try {
    const monitor = await getAdminForecastMonitor();
    return res.status(200).json({ success: true, data: monitor, stats: monitor });
  } catch (error) {
    next(error);
  }
}

export async function getAudit(req, res, next) {
  try {
    const data = await getAuditLogs(req.query);
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
}
