/**
 * Centralized API Client Service
 * Connects React frontend components to the Express backend API.
 * Provides resilient fallback handling if the backend is temporarily offline.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

let authToken = localStorage.getItem('aerosense_token') || null;

export function getAuthToken() {
  return authToken;
}

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('aerosense_token', token);
  } else {
    localStorage.removeItem('aerosense_token');
  }
}

export function clearAuthToken() {
  authToken = null;
  localStorage.removeItem('aerosense_token');
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers,
      ...options
    });

    let result = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        result = await response.json();
      } catch (parseError) {
        result = { message: 'Failed to parse JSON response from server' };
      }
    } else {
      const text = await response.text();
      result = { message: text.length > 100 ? `Server returned status ${response.status}` : text || `Server returned status ${response.status}` };
    }

    if (!response.ok) {
      throw new Error(result?.message || `API error (${response.status})`);
    }

    return result;
  } catch (error) {
    console.warn(`[AeroSense API Warning] Request failed for ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Fetch all monitored cities with optional search or pagination
 */
export async function getCities(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.state) query.append('state', params.state);
  if (params.limit) query.append('limit', params.limit);
  if (params.page) query.append('page', params.page);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return await request(`/cities${qs}`);
}

/**
 * Fetch city details by slug
 */
export async function getCityBySlug(slug) {
  return await request(`/cities/${slug}`);
}

/**
 * Fetch aggregated city environmental intelligence dashboard
 */
export async function getCityDashboard(slug) {
  return await request(`/cities/${slug}/dashboard`);
}

/**
 * Fetch latest live air quality and weather telemetry for a specific city
 */
export async function getLatestAirQuality(cityIdOrSlug) {
  return await request(`/air-quality/${cityIdOrSlug}/latest`);
}

/**
 * Fetch air quality historical trend points (24h, 7d, 30d, 90d)
 */
export async function getAirQualityHistory(cityIdOrSlug, period = '7d') {
  return await request(`/air-quality/${cityIdOrSlug}/history?period=${period}`);
}

/**
 * Fetch map nodes across India with live AQI scores
 */
export async function getMapAirQuality() {
  return await request('/air-quality/map');
}

/**
 * Fetch active environmental monitoring data sources and standards
 */
export async function getDataSources() {
  return await request('/data-sources');
}

/**
 * Fetch national analytics dashboard payload
 */
export async function getAnalyticsDashboard() {
  return await request('/analytics/dashboard');
}

/**
 * Fetch city rankings with optional region filter and sort criteria
 */
export async function getRankings(params = {}) {
  const query = new URLSearchParams();
  if (params.region) query.append('region', params.region);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.limit) query.append('limit', params.limit);
  const qs = query.toString() ? `?${query.toString()}` : '';
  return await request(`/analytics/rankings${qs}`);
}

/**
 * Fetch multi-city side-by-side comparison payload
 */
export async function compareCitiesApi(cities = [], period = '7d') {
  const cityParam = Array.isArray(cities) ? cities.join(',') : cities;
  return await request(`/compare?cities=${encodeURIComponent(cityParam)}&period=${period}`);
}

/**
 * Check backend health status
 */
export async function checkApiHealth() {
  const root = API_BASE_URL.replace('/v1', '');
  const res = await fetch(`${root}/health`);
  return await res.json();
}

/**
 * Auth API methods
 */
export async function loginApi({ email, password }) {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (result.token) {
    setAuthToken(result.token);
  }
  return result;
}

export async function registerApi({ name, email, password }) {
  const result = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
  if (result.token) {
    setAuthToken(result.token);
  }
  return result;
}

export async function logoutApi() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } finally {
    clearAuthToken();
  }
}

export async function getMeApi() {
  return await request('/auth/me');
}

/**
 * User & Personalized Dashboard API methods
 */
export async function getUserDashboardApi() {
  return await request('/users/dashboard');
}

export async function getUserProfileApi() {
  return await request('/users/profile');
}

export async function updateUserProfileApi(data) {
  return await request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function changeUserPasswordApi({ currentPassword, newPassword }) {
  return await request('/users/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

export async function deleteUserAccountApi() {
  const res = await request('/users/account', {
    method: 'DELETE'
  });
  clearAuthToken();
  return res;
}

export async function getUserFavoritesApi() {
  return await request('/users/favorites');
}

export async function addUserFavoriteApi(slug) {
  return await request(`/users/favorites/${encodeURIComponent(slug)}`, {
    method: 'POST'
  });
}

export async function removeUserFavoriteApi(slug) {
  return await request(`/users/favorites/${encodeURIComponent(slug)}`, {
    method: 'DELETE'
  });
}

export async function getUserRecentApi() {
  return await request('/users/recent');
}

export async function recordUserRecentApi(slug) {
  return await request('/users/recent', {
    method: 'POST',
    body: JSON.stringify({ slug })
  });
}

/**
 * Part 7: AQI Forecasting API
 */
export async function getCityForecastApi(citySlug, hours = 24) {
  return await request(`/forecast/${encodeURIComponent(citySlug)}?hours=${hours}`);
}

/**
 * Part 7: User Alert Thresholds API
 */
export async function getUserAlertsApi() {
  return await request('/alerts');
}

export const getAlertsApi = getUserAlertsApi;

export async function evaluateAlertsApi() {
  return await request('/alerts/evaluate', {
    method: 'POST'
  });
}

export async function createAlertApi(data) {
  return await request('/alerts', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateAlertApi(id, data) {
  return await request(`/alerts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteAlertApi(id) {
  return await request(`/alerts/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Part 7: In-App Notifications API
 */
export async function getUserNotificationsApi(params = {}) {
  const query = new URLSearchParams();
  if (params.unreadOnly) query.append('unreadOnly', 'true');
  if (params.limit) query.append('limit', params.limit);
  const qs = query.toString() ? `?${query.toString()}` : '';
  return await request(`/notifications${qs}`);
}

export const getNotificationsApi = getUserNotificationsApi;

export async function getUnreadNotificationCountApi() {
  return await request('/notifications/unread-count');
}

export async function markNotificationReadApi(id) {
  return await request(`/notifications/${id}/read`, {
    method: 'PUT'
  });
}

export async function markAllNotificationsReadApi() {
  return await request('/notifications/read-all', {
    method: 'PUT'
  });
}

export async function deleteNotificationApi(id) {
  return await request(`/notifications/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Part 7: Protected Admin Platform API
 */
export async function getAdminOverviewApi() {
  return await request('/admin/overview');
}

export async function getAdminUsersApi(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.search) query.append('search', params.search);
  const qs = query.toString() ? `?${query.toString()}` : '';
  return await request(`/admin/users${qs}`);
}

export async function setUserStatusApi(id, isActive) {
  return await request(`/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ isActive })
  });
}

export async function toggleUserStatusApi(id) {
  return await request(`/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({})
  });
}

export async function getAdminCitiesApi() {
  return await request('/admin/cities');
}

export async function setCityMonitoringApi(slug, isActive) {
  return await request(`/admin/cities/${encodeURIComponent(slug)}/status`, {
    method: 'PUT',
    body: JSON.stringify({ isActive })
  });
}

export async function toggleCityMonitoringApi(slug) {
  return await request(`/admin/cities/${encodeURIComponent(slug)}/status`, {
    method: 'PUT',
    body: JSON.stringify({})
  });
}

export async function getAdminDataSourcesApi() {
  return await request('/admin/data-sources');
}

export async function getAdminSystemHealthApi() {
  return await request('/admin/system-health');
}

export async function getAdminForecastMonitorApi() {
  return await request('/admin/forecasts');
}

export const getAdminForecastStatsApi = getAdminForecastMonitorApi;

export async function getAdminAuditLogsApi(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.action) query.append('action', params.action);
  const qs = query.toString() ? `?${query.toString()}` : '';
  return await request(`/admin/audit${qs}`);
}



