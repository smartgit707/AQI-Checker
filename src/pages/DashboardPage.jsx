import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getUserDashboardApi, 
  getAlertsApi, 
  updateAlertApi, 
  deleteAlertApi, 
  evaluateAlertsApi 
} from '../services/api';
import { getAQILevel } from '../design-system/aqiTokens';
import { CITIES_DATA } from '../data/mockData';
import AlertModal from '../components/city/AlertModal';
import AiAssistantWidget from '../components/common/AiAssistantWidget';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  Heart,
  Activity,
  Wind,
  TrendingUp,
  History,
  ArrowRight,
  ExternalLink,
  Trash2,
  Plus,
  Sparkles,
  BarChart3,
  Layers,
  ShieldCheck,
  Thermometer,
  Droplets,
  CloudSun,
  AlertTriangle,
  Compass,
  Bell,
  ShieldAlert,
  Clock,
  Play,
  CheckCircle2,
  Sliders,
  Loader2,
  Home,
  ToggleLeft,
  ToggleRight,
  Navigation
} from 'lucide-react';

export default function DashboardPage() {
  const { user, toggleFavorite } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Alert Rules State
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedCityForAlert, setSelectedCityForAlert] = useState({ slug: 'delhi', name: 'Delhi NCR', aqi: 284 });
  const [evaluatingAlerts, setEvaluatingAlerts] = useState(false);
  const [alertNotice, setAlertNotice] = useState(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getUserDashboardApi();
      if (res && res.success && res.dashboard) {
        setDashboardData(res.dashboard);
      }
    } catch (err) {
      console.warn('[Dashboard Warning] Remote dashboard fetch:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      setAlertsLoading(true);
      const res = await getAlertsApi();
      if (res && res.success) {
        setAlerts(res.alerts || []);
      }
    } catch (err) {
      console.warn('[Dashboard Alerts Warning]', err.message);
    } finally {
      setAlertsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchAlerts();
  }, [user?.email]);

  const handleRemoveFavorite = async (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(slug);
    fetchDashboard();
  };

  const handleAddSuggested = async (slug) => {
    await toggleFavorite(slug);
    fetchDashboard();
  };

  // Dynamic resilient resolution for favorites:
  // Uses remote dashboard favorites if populated, else maps user.favoriteCities against CITIES_DATA
  const favorites = useMemo(() => {
    if (dashboardData?.favorites && Array.isArray(dashboardData.favorites) && dashboardData.favorites.length > 0) {
      return dashboardData.favorites;
    }
    const slugs = user?.favoriteCities || [];
    return slugs.map((slug) => {
      const clean = slug.toLowerCase();
      const match = CITIES_DATA.find(
        (c) => (c.id || '').toLowerCase() === clean || (c.name || '').toLowerCase() === clean
      );
      if (match) {
        return {
          slug: match.id,
          name: match.name,
          state: match.state,
          aqi: match.aqi,
          category: match.status,
          primaryPollutant: match.dominantPollutant,
          temperature: match.temperature,
          weatherCondition: 'Clear',
          image: typeof match.image === 'string' ? { url: match.image, alt: match.imageAlt || match.name } : match.image
        };
      }
      return {
        slug: clean,
        name: clean.charAt(0).toUpperCase() + clean.slice(1),
        state: 'India',
        aqi: 95,
        category: 'Moderate',
        primaryPollutant: 'PM2.5',
        temperature: '28°C',
        weatherCondition: 'Clear',
        image: null
      };
    });
  }, [dashboardData?.favorites, user?.favoriteCities]);

  const recent = dashboardData?.recent || [];

  // Metrics derived from actual resolved favorites
  const metrics = useMemo(() => {
    if (dashboardData?.metrics && dashboardData.metrics.totalFavorites > 0) {
      return dashboardData.metrics;
    }
    if (favorites.length === 0) {
      return {
        totalFavorites: 0,
        averageAqi: 0,
        cleanestCity: null,
        highestRiskCity: null
      };
    }
    const totalFavorites = favorites.length;
    const sumAqi = favorites.reduce((acc, curr) => acc + (curr.aqi || 0), 0);
    const averageAqi = Math.round(sumAqi / totalFavorites);
    const sorted = [...favorites].sort((a, b) => (a.aqi || 0) - (b.aqi || 0));
    const cleanestCity = sorted[0];
    const highestRiskCity = sorted[sorted.length - 1];
    return {
      totalFavorites,
      averageAqi,
      cleanestCity,
      highestRiskCity
    };
  }, [dashboardData?.metrics, favorites]);

  const avgLevel = getAQILevel(metrics.averageAqi || 0);

  // Query string to compare all favorite cities
  const compareUrl = favorites.length >= 2
    ? `/compare?cities=${favorites.map((c) => c.slug).join(',')}`
    : '/compare';

  // Alerts Actions
  const handleToggleAlert = async (alert) => {
    try {
      const res = await updateAlertApi(alert._id, { enabled: !alert.enabled });
      if (res.success) {
        setAlerts((prev) =>
          prev.map((a) => (a._id === alert._id ? { ...a, enabled: !alert.enabled } : a))
        );
        setAlertNotice(`Alert rule for ${alert.cityName} ${!alert.enabled ? 'activated' : 'paused'}.`);
        setTimeout(() => setAlertNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAlert = async (id, cityName) => {
    try {
      const res = await deleteAlertApi(id);
      if (res.success) {
        setAlerts((prev) => prev.filter((a) => a._id !== id));
        setAlertNotice(`Alert rule for ${cityName} deleted.`);
        setTimeout(() => setAlertNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEvaluateAlerts = async () => {
    try {
      setEvaluatingAlerts(true);
      const res = await evaluateAlertsApi();
      if (res.success) {
        setAlertNotice(
          `Evaluated ${res.evaluatedCount || alerts.length} alert rules against live sensors. ${
            res.triggeredCount || 0
          } threshold events monitored.`
        );
        fetchAlerts();
        setTimeout(() => setAlertNotice(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluatingAlerts(false);
    }
  };

  const openAlertModalForCity = (city) => {
    setSelectedCityForAlert({
      slug: city.slug || city.id,
      name: city.name,
      aqi: city.aqi || 120
    });
    setAlertModalOpen(true);
  };

  const openNewAlertModal = () => {
    if (favorites.length > 0) {
      openAlertModalForCity(favorites[0]);
    } else {
      setSelectedCityForAlert({
        slug: 'delhi',
        name: 'Delhi NCR',
        aqi: 284
      });
      setAlertModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Persona Switcher Bar */}
          <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
              >
                <Activity className="w-4 h-4 text-emerald-200" />
                <span>Scientific Sensor Overview</span>
              </Link>

              <Link
                to="/citizen-dashboard"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4 text-emerald-600" />
                <span>Citizen & Family Lifestyle</span>
              </Link>

              <Link
                to="/alerts"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Alert Rules ({alerts.length})</span>
              </Link>

              <Link
                to="/favorites"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Favorites ({favorites.length})</span>
              </Link>
            </div>

            <Link
              to="/citizen-dashboard"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <span>Explore Family Lifestyle Advisory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Welcome Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {user?.role === 'environmentalist' ? '🔬 Scientific Environmentalist Telemetry Suite' : 'Personal Environmental Dashboard'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user?.name || 'Explorer'}
              </h1>
              <p className="text-slate-600 text-sm max-w-2xl">
                Track real-time atmospheric conditions, view personal AQI averages, manage custom alert rules, and monitor your pinned cities across India.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={openNewAlertModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Set Alert Rule</span>
              </button>
              <Link
                to="/alerts"
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Alerts Hub ({alerts.length})</span>
              </Link>
              <Link
                to="/favorites"
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors shadow-2xs"
              >
                Manage Favorites
              </Link>
              {favorites.length >= 2 && (
                <Link
                  to={compareUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
                >
                  <Layers className="w-4 h-4" />
                  <span>Compare</span>
                </Link>
              )}
            </div>
          </div>

          {/* Admin Console Shortcut Banner for Admin Users */}
          {user?.role === 'admin' && (
            <div className="bg-purple-900 text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 border border-purple-800 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-800 text-purple-200 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">AeroSense Administrative Control Plane Active</h4>
                  <p className="text-2xs sm:text-xs text-purple-200">
                    You are logged in with system administrator privileges. Access telemetry operations, user management, and forecast engine benchmarks.
                  </p>
                </div>
              </div>
              <Link
                to="/admin"
                className="px-4 py-2 rounded-xl bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs whitespace-nowrap transition-colors shadow-xs"
              >
                Open Console →
              </Link>
            </div>
          )}

          {/* Top Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Saved Cities */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tracked Cities
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-emerald-600" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {metrics.totalFavorites} <span className="text-xs text-slate-400 font-normal">/ 10 max</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Active monitoring list
              </div>
            </div>

            {/* Card 2: Average AQI */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Average Monitored AQI
                </span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${avgLevel.color}20`, color: avgLevel.color }}
                >
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {metrics.totalFavorites > 0 ? metrics.averageAqi : '—'}
                </span>
                {metrics.totalFavorites > 0 && (
                  <span
                    className="px-2 py-0.5 text-xs font-bold rounded-md"
                    style={{ backgroundColor: avgLevel.bgColor, color: avgLevel.textColor }}
                  >
                    {avgLevel.category}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Across your saved locations
              </div>
            </div>

            {/* Card 3: Cleanest Location */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Cleanest Monitored
                </span>
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              {metrics.cleanestCity ? (
                <div>
                  <Link
                    to={`/city/${metrics.cleanestCity.slug}`}
                    className="text-lg font-bold text-slate-900 hover:text-emerald-600 truncate block transition-colors"
                  >
                    {metrics.cleanestCity.name}
                  </Link>
                  <div className="text-xs text-emerald-600 font-semibold mt-1">
                    AQI {metrics.cleanestCity.aqi} • Low Exposure
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-400 font-medium">None tracked yet</div>
              )}
            </div>

            {/* Card 4: Highest Risk Location */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Peak AQI Alert
                </span>
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              {metrics.highestRiskCity ? (
                <div>
                  <Link
                    to={`/city/${metrics.highestRiskCity.slug}`}
                    className="text-lg font-bold text-slate-900 hover:text-rose-600 truncate block transition-colors"
                  >
                    {metrics.highestRiskCity.name}
                  </Link>
                  <div className="text-xs text-rose-600 font-semibold mt-1">
                    AQI {metrics.highestRiskCity.aqi} • Air Advisory
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-400 font-medium">None tracked yet</div>
              )}
            </div>
          </div>

          {/* Clean Commute & Eco-Routing Feature Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-emerald-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Navigation className="w-3.5 h-3.5" />
                <span>New: Eco-Routing Telemetry</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                Clean Route & Commute Planner
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Compare high-emission highway canyons vs. green parkway corridors in Delhi, Mumbai, Bengaluru & more. Reduce inhaled PM2.5 by up to 50% on your daily commute.
              </p>
            </div>

            <Link
              to="/clean-commute"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0"
            >
              <span>Launch Route Navigator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Favorite Cities Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  Monitored Favorite Cities ({favorites.length})
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Live atmospheric conditions for your pinned cities across India
                </p>
              </div>

              {favorites.length > 0 && (
                <Link
                  to="/favorites"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View Full Management Table</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {isLoading ? (
              <div className="py-16 text-center">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500">Loading your saved atmospheric feeds...</p>
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((city) => {
                  const aqiInfo = getAQILevel(city.aqi);
                  const imageUrl = city.image?.url || (typeof city.image === 'string' ? city.image : null);

                  return (
                    <div
                      key={city.slug}
                      className="group relative bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      {/* Top Image Banner */}
                      <div className="h-32 w-full relative overflow-hidden bg-slate-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={city.image?.alt || city.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-center text-white/50">
                            <Wind className="w-10 h-10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        {/* City Name in Banner & Action Controls */}
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white leading-tight drop-shadow-xs">
                              {city.name}
                            </h3>
                            <p className="text-xs text-white/80">{city.state}</p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openAlertModalForCity(city);
                              }}
                              title="Set AQI Alert Threshold"
                              className="p-1.5 rounded-lg bg-black/40 hover:bg-amber-600 text-white/90 hover:text-white backdrop-blur-xs transition-colors"
                            >
                              <Bell className="w-4 h-4 text-amber-300" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleRemoveFavorite(e, city.slug)}
                              title="Remove from favorites"
                              className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-600/90 text-white/80 hover:text-white backdrop-blur-xs transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Telemetry Card Body */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                              Real-time AQI
                            </div>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-3xl font-extrabold text-slate-900">
                                {city.aqi}
                              </span>
                              <span
                                className="px-2.5 py-0.5 text-xs font-bold rounded-md"
                                style={{
                                  backgroundColor: aqiInfo.bgColor,
                                  color: aqiInfo.textColor,
                                  border: `1px solid ${aqiInfo.borderColor}`
                                }}
                              >
                                {city.category}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                              Main Pollutant
                            </div>
                            <div className="text-sm font-bold text-slate-800 mt-0.5">
                              {city.primaryPollutant || 'PM2.5'}
                            </div>
                          </div>
                        </div>

                        {/* Weather Snapshot */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Thermometer className="w-4 h-4 text-slate-400" />
                            <span>{city.temperature || '26°C'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CloudSun className="w-4 h-4 text-slate-400" />
                            <span className="truncate">{city.weatherCondition || 'Clear'}</span>
                          </div>
                        </div>

                        {/* Footer Action */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => openAlertModalForCity(city)}
                            className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-amber-200/80"
                          >
                            <Bell className="w-3.5 h-3.5 text-amber-600" />
                            <span>Set Alert</span>
                          </button>
                          <Link
                            to={`/city/${city.slug}`}
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <span>City Intelligence</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="p-10 rounded-2xl border-2 border-dashed border-slate-200 text-center max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  You haven't tracked any cities yet
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Save your hometown, travel destinations, or business locations to monitor real-time air quality indices on your personal dashboard.
                </p>

                {/* Recommended Quick Add */}
                <div className="pt-2">
                  <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
                    Quick Track Recommendations
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { name: 'Delhi NCR', slug: 'delhi' },
                      { name: 'Mumbai', slug: 'mumbai' },
                      { name: 'Bengaluru', slug: 'bengaluru' },
                      { name: 'Varanasi', slug: 'varanasi' }
                    ].map((item) => (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => handleAddSuggested(item.slug)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 text-xs font-semibold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active AQI Alert Rules Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Bell className="w-4 h-4 fill-amber-500 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Active AQI Alert Rules & Thresholds
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {alerts.filter((a) => a.enabled).length} Active
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Automated background notifications triggered when atmospheric readings breach your defined limits.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleEvaluateAlerts}
                  disabled={evaluatingAlerts}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors border border-slate-200"
                >
                  {evaluatingAlerts ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  ) : (
                    <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  )}
                  <span>Evaluate Sensors</span>
                </button>

                <button
                  type="button"
                  onClick={openNewAlertModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Set New Alert</span>
                </button>
              </div>
            </div>

            {/* Alert Status Banner Notice */}
            {alertNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{alertNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAlertNotice(null)}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {alertsLoading ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
                <p className="text-sm">Fetching atmospheric alert rules...</p>
              </div>
            ) : alerts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {alerts.map((alert) => {
                  const aqiInfo = getAQILevel(alert.threshold);
                  const isEnabled = alert.enabled !== false;

                  return (
                    <div
                      key={alert._id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isEnabled
                          ? 'bg-white border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs'
                          : 'bg-slate-50 border-slate-200/60 opacity-60'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top City & Switch */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              to={`/city/${alert.citySlug}`}
                              className="font-bold text-slate-900 hover:text-emerald-600 transition-colors text-base"
                            >
                              {alert.cityName}
                            </Link>
                            <div className="text-xs text-slate-400 capitalize">
                              Target location: {alert.citySlug}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleAlert(alert)}
                            title={isEnabled ? 'Pause alert rule' : 'Enable alert rule'}
                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                              isEnabled
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            <span>{isEnabled ? 'Active' : 'Paused'}</span>
                          </button>
                        </div>

                        {/* Trigger Condition Badge */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                              Threshold Condition
                            </span>
                            <span
                              className="px-2 py-0.5 text-2xs font-bold rounded-md"
                              style={{ backgroundColor: aqiInfo.bgColor, color: aqiInfo.textColor }}
                            >
                              {aqiInfo.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold text-slate-900">
                              AQI {alert.operator === 'below' ? '<' : '>'} {alert.threshold}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              ({alert.operator === 'below' ? 'Drop below target' : 'Pollution spike'})
                            </span>
                          </div>
                        </div>

                        {/* Cooldown and Channels Details */}
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{alert.cooldownHours || 6}h Cooldown</span>
                          </div>
                          <span className="text-2xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                            In-App Notification
                          </span>
                        </div>
                      </div>

                      {/* Rule Action Buttons */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCityForAlert({
                              slug: alert.citySlug,
                              name: alert.cityName,
                              aqi: alert.threshold
                            });
                            setAlertModalOpen(true);
                          }}
                          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Modify Rule</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAlert(alert._id, alert.cityName)}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No Alert Rules Configured */
              <div className="p-8 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/30 text-center max-w-xl mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No AQI Alert Rules Configured Yet
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                  Set up threshold rules for your monitored cities. AeroSense checks sensor networks continuously and notifies you when pollution crosses health-hazard limits.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={openNewAlertModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Alert Rule</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section: Recently Visited + Quick Launchpad */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recently Visited Cities */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-500" />
                  Recently Inspected Cities
                </h2>
                <span className="text-xs text-slate-400">Tracked in this session</span>
              </div>

              {recent.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recent.slice(0, 5).map((item) => (
                    <div
                      key={item.slug}
                      className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <Link
                            to={`/city/${item.slug}`}
                            className="font-semibold text-sm text-slate-900 hover:text-emerald-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-slate-400">{item.state}</p>
                        </div>
                      </div>

                      <Link
                        to={`/city/${item.slug}`}
                        className="text-xs font-semibold text-slate-500 hover:text-emerald-600 flex items-center gap-1"
                      >
                        <span>Revisit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 py-6 text-center">
                  No recent cities viewed. Explore individual city pages to track history.
                </p>
              )}
            </div>

            {/* Quick Launchpad & Analytics shortcuts */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Environmental Tools
              </h2>
              <p className="text-xs text-slate-500">
                Instant access to deep analytics and comparison tools.
              </p>

              <div className="space-y-2.5 pt-2">
                <Link
                  to="/compare"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">City Comparison</div>
                      <div className="text-2xs text-slate-400">Multi-city side-by-side matrices</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/rankings"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">National Rankings</div>
                      <div className="text-2xs text-slate-400">Rankings across all 36 states/UTs</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/alerts"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">Alert Rules Hub</div>
                      <div className="text-2xs text-slate-400">Manage thresholds & push triggers</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/analytics"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">Analytics Engine</div>
                      <div className="text-2xs text-slate-400">Historical telemetry & trends</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Embedded Alert Configuration Modal */}
      <AlertModal
        isOpen={alertModalOpen}
        onClose={() => {
          setAlertModalOpen(false);
          fetchAlerts();
        }}
        citySlug={selectedCityForAlert.slug}
        cityName={selectedCityForAlert.name}
        currentAqi={selectedCityForAlert.aqi}
      />

      <Footer />

      {/* Floating AI Assistant */}
      <AiAssistantWidget currentCity={favorites[0] || CITIES_DATA[0]} />
    </div>
  );
}
