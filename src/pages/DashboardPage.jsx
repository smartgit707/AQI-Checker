import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserDashboardApi } from '../services/api';
import { getAQILevel } from '../design-system/aqiTokens';
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
  Compass
} from 'lucide-react';

export default function DashboardPage() {
  const { user, toggleFavorite } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getUserDashboardApi();
      if (res.success && res.dashboard) {
        setDashboardData(res.dashboard);
      }
    } catch (err) {
      console.error('[Dashboard Error]', err);
      setError(err.message || 'Unable to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRemoveFavorite = async (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(slug);
    // Refresh dashboard list
    fetchDashboard();
  };

  const handleAddSuggested = async (slug) => {
    await toggleFavorite(slug);
    fetchDashboard();
  };

  const favorites = dashboardData?.favorites || [];
  const recent = dashboardData?.recent || [];
  const metrics = dashboardData?.metrics || {
    totalFavorites: 0,
    averageAqi: 0,
    cleanestCity: null,
    highestRiskCity: null
  };

  const avgLevel = getAQILevel(metrics.averageAqi || 0);

  // Query string to compare all favorite cities
  const compareUrl = favorites.length >= 2
    ? `/compare?cities=${favorites.map((c) => c.slug).join(',')}`
    : '/compare';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Personal Environmental Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Explorer'}
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl">
              Track real-time atmospheric conditions, view personal AQI averages, and manage your monitored cities across India.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/favorites"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-sm transition-colors shadow-2xs"
            >
              Manage Favorites
            </Link>
            {favorites.length >= 2 && (
              <Link
                to={compareUrl}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-xs"
              >
                <Layers className="w-4 h-4" />
                <span>Compare Favorites</span>
              </Link>
            )}
          </div>
        </div>

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

        {/* Favorite Cities Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                Monitored Favorite Cities
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Live telemetric environmental status for your pinned cities
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
                return (
                  <div
                    key={city.slug}
                    className="group relative bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Top Image Banner */}
                    <div className="h-32 w-full relative overflow-hidden bg-slate-100">
                      {city.image?.url ? (
                        <img
                          src={city.image.url}
                          alt={city.image.alt || city.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-center text-white/50">
                          <Wind className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* City Name in Banner */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white leading-tight drop-shadow-xs">
                            {city.name}
                          </h3>
                          <p className="text-xs text-white/80">{city.state}</p>
                        </div>

                        {/* Remove Button */}
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
                      <Link
                        to={`/city/${city.slug}`}
                        className="mt-2 w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Full City Intelligence</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
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
                to="/analytics"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
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
      <Footer />
    </div>
  );
}
