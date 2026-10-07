import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserFavoritesApi, getCities } from '../services/api';
import { getAQILevel } from '../design-system/aqiTokens';
import { CITIES_DATA } from '../data/mockData';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  Heart,
  Search,
  ArrowRight,
  Trash2,
  Layers,
  ArrowUpDown,
  Plus,
  Thermometer,
  CloudSun,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function FavoritesPage() {
  const { user, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCities, setSelectedCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'aqi-asc', 'aqi-desc'
  const [allCities, setAllCities] = useState([]);
  const [citySearchOpen, setCitySearchOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const formatFavoriteCity = (item) => {
    if (typeof item === 'string') {
      const slug = item.toLowerCase();
      const match = CITIES_DATA.find((c) => (c.id || '').toLowerCase() === slug || (c.name || '').toLowerCase() === slug);
      if (match) {
        return {
          slug: match.id,
          name: match.name,
          state: match.state,
          aqi: match.aqi,
          category: match.status,
          primaryPollutant: match.dominantPollutant,
          temperature: match.temperature,
          humidity: match.humidity,
          image: match.image
        };
      }
      return {
        slug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        state: 'India',
        aqi: 95,
        category: 'Moderate',
        primaryPollutant: 'PM2.5',
        temperature: '28°C',
        humidity: '50%',
        image: null
      };
    }
    return {
      slug: item.slug || item.id,
      name: item.name,
      state: item.state,
      aqi: item.aqi,
      category: item.category || item.status,
      primaryPollutant: item.primaryPollutant || item.dominantPollutant || 'PM2.5',
      temperature: item.temperature,
      humidity: item.humidity,
      image: item.image
    };
  };

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const res = await getUserFavoritesApi();
      if (res.success && Array.isArray(res.favorites) && res.favorites.length > 0) {
        setFavorites(res.favorites.map(formatFavoriteCity));
        return;
      }
    } catch (err) {
      console.error('[Favorites Error]', err);
    } finally {
      setIsLoading(false);
    }

    // Client fallback to user.favoriteCities
    const fallbackSlugs = user?.favoriteCities || [];
    setFavorites(fallbackSlugs.map(formatFavoriteCity));
  };

  useEffect(() => {
    loadFavorites();
    // Load city catalog for search selector
    getCities({ limit: 100 }).then((res) => {
      if (res.data?.cities) setAllCities(res.data.cities);
    }).catch(() => {});
  }, []);

  const handleRemove = async (slug) => {
    const res = await toggleFavorite(slug);
    if (res.success) {
      setFavorites((prev) => prev.filter((c) => c.slug !== slug));
      setSelectedCities((prev) => prev.filter((s) => s !== slug));
      showNotice(`Removed ${slug} from favorites`);
    }
  };

  const handleAddCity = async (slug) => {
    const res = await toggleFavorite(slug);
    if (res.success) {
      showNotice(`Added ${slug} to favorites`);
      setCitySearchOpen(false);
      setCitySearchQuery('');
      loadFavorites();
    } else if (res.error) {
      showNotice(res.error, true);
    }
  };

  const showNotice = (msg, isErr = false) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const toggleSelectCity = (slug) => {
    if (selectedCities.includes(slug)) {
      setSelectedCities((prev) => prev.filter((s) => s !== slug));
    } else {
      if (selectedCities.length >= 4) {
        showNotice('You can compare up to 4 cities simultaneously.');
        return;
      }
      setSelectedCities((prev) => [...prev, slug]);
    }
  };

  const handleCompareSelected = () => {
    if (selectedCities.length < 2) {
      showNotice('Select at least 2 cities to launch comparison.');
      return;
    }
    navigate(`/compare?cities=${selectedCities.join(',')}`);
  };

  // Filter & sort
  let displayed = favorites.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q);
  });

  if (sortBy === 'name') {
    displayed.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'aqi-asc') {
    displayed.sort((a, b) => a.aqi - b.aqi);
  } else if (sortBy === 'aqi-desc') {
    displayed.sort((a, b) => b.aqi - a.aqi);
  }

  // Filter candidates for add search
  const favoriteSlugs = favorites.map((f) => f.slug);
  const searchCandidates = allCities.filter((c) => {
    if (favoriteSlugs.includes(c.slug)) return false;
    if (!citySearchQuery) return true;
    const q = citySearchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q);
  }).slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              Favorite Cities Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Monitored Locations ({favorites.length}/10)
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl">
              Pin your key cities for instant atmospheric updates and multi-location environmental comparisons.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setCitySearchOpen(!citySearchOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add City</span>
            </button>

            {selectedCities.length >= 2 && (
              <button
                type="button"
                onClick={handleCompareSelected}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-xs"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Compare Selected ({selectedCities.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Notice toast */}
        {actionNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice('')}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Modal/Dropdown for Searching and Adding Cities */}
        {citySearchOpen && (
          <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" />
                Search and Add City to Favorites
              </h3>
              <button
                onClick={() => setCitySearchOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Close
              </button>
            </div>

            <input
              type="text"
              value={citySearchQuery}
              onChange={(e) => setCitySearchQuery(e.target.value)}
              placeholder="Search by city or state name (e.g. Pune, Jaipur, Chennai)..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              autoFocus
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {searchCandidates.map((c) => (
                <div
                  key={c.slug}
                  className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.state}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddCity(c.slug)}
                    className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {searchCandidates.length === 0 && (
                <div className="col-span-full py-4 text-center text-xs text-slate-400">
                  No matching cities found in catalog.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toolbar: Search & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter your saved cities..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="name">City Name (A-Z)</option>
                <option value="aqi-asc">Cleanest First (AQI ↑)</option>
                <option value="aqi-desc">Most Polluted First (AQI ↓)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Favorites Table / List */}
        {isLoading ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading your favorite cities...</p>
          </div>
        ) : displayed.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-2xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 w-12 text-center">Compare</th>
                    <th className="py-3.5 px-4">City / Region</th>
                    <th className="py-3.5 px-4">Current AQI</th>
                    <th className="py-3.5 px-4">Main Pollutant</th>
                    <th className="py-3.5 px-4">Weather</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {displayed.map((city) => {
                    const aqiInfo = getAQILevel(city.aqi);
                    const isSelected = selectedCities.includes(city.slug);

                    return (
                      <tr
                        key={city.slug}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        {/* Select for Compare */}
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectCity(city.slug)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                          />
                        </td>

                        {/* City Details */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {(city.image?.url || (typeof city.image === 'string' && city.image)) ? (
                              <img
                                src={city.image?.url || city.image}
                                alt={city.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                                <Heart className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <Link
                                to={`/city/${city.slug}`}
                                className="font-bold text-slate-900 hover:text-emerald-600 transition-colors block"
                              >
                                {city.name}
                              </Link>
                              <div className="text-xs text-slate-500">{city.state}</div>
                            </div>
                          </div>
                        </td>

                        {/* AQI Badge */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-extrabold text-slate-900">
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
                        </td>

                        {/* Primary Pollutant */}
                        <td className="py-4 px-4 text-slate-700 font-semibold">
                          {city.primaryPollutant || 'PM2.5'}
                        </td>

                        {/* Weather */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <span>{city.temperature || '26°C'}</span>
                            <span>•</span>
                            <span>{city.weatherCondition || 'Clear'}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/city/${city.slug}`}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                            >
                              Details
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleRemove(city.slug)}
                              title="Remove from favorites"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No favorite cities found</h3>
            <p className="text-sm text-slate-500">
              {searchQuery
                ? 'No saved cities matched your search term.'
                : 'Click "Add City" above to add cities to your personal environmental watch list.'}
            </p>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
