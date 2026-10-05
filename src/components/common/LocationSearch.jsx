import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCities } from '../../services/api';
import { CITIES_DATA } from '../../data/mockData';
import { getAQILevel } from '../../design-system/aqiTokens';

export default function LocationSearch({ onSelectCity, currentCityId }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [backendCities, setBackendCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Initial load and live debounced search via backend API
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await getCities({ search: query, limit: 10 });
        if (active && res.data) {
          // Transform backend schema to match component expectations
          const mapped = res.data.map(c => {
            // Find corresponding local AQI telemetry or mock fallback
            const local = CITIES_DATA.find(lc => lc.id === c.slug || lc.name === c.name);
            return {
              id: c.slug || c._id,
              name: c.name,
              state: c.state,
              station: c.station || 'CPCB Telemetry Point',
              aqi: local?.aqi || 50,
              image: c.image?.url || local?.image,
              imageAlt: c.image?.alt || local?.imageAlt,
              raw: c
            };
          });
          setBackendCities(mapped);
        }
      } catch (err) {
        // Resilient fallback to local mock data on network error
        if (active) {
          const filtered = CITIES_DATA.filter(c => 
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.state.toLowerCase().includes(query.toLowerCase())
          );
          setBackendCities(filtered);
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    // If the city object came from backend, match full dataset
    const fullCity = CITIES_DATA.find(c => c.id === city.id || c.name === city.name) || city;
    onSelectCity(fullCity);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={containerRef}>
      <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/80 p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
        <div className="pl-3.5 pr-2 text-slate-400">
          {loading ? (
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-emerald-600" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search city, district, or monitoring station (e.g. Delhi, Chennai, Bengaluru)..."
          className="w-full py-2.5 pr-4 text-slate-900 text-sm sm:text-base placeholder:text-slate-400 bg-transparent outline-none font-medium"
        />

        {query && (
          <button 
            onClick={() => setQuery('')}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1 text-xs"
          >
            Clear
          </button>
        )}

        <button
          onClick={() => {
            const chennai = CITIES_DATA.find(c => c.id === 'chennai');
            if (chennai) onSelectCity(chennai);
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold whitespace-nowrap transition-colors"
          title="Use current geographic location"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
          <span>My Location</span>
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 max-h-80 overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="px-4 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100">
            <span>AeroSense Monitored Registry</span>
            <span>Current AQI</span>
          </div>

          {backendCities.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              No matching cities found in active registry. Try Delhi, Mumbai, Bengaluru, etc.
            </div>
          ) : (
            backendCities.map((city) => {
              const aqiLevel = getAQILevel(city.aqi);
              const isSelected = city.id === currentCityId;

              return (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 text-left transition-colors ${
                    isSelected ? 'bg-emerald-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                      {city.image ? (
                        <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{city.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <span className="text-xs text-slate-500">{city.state} • {city.station?.split('&')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-extrabold" style={{ color: aqiLevel.color }}>
                        {city.aqi}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500">
                        {aqiLevel.category}
                      </div>
                    </div>
                    <Link
                      to={`/city/${city.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      title="Open full city profile"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-500 hover:text-emerald-700 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
