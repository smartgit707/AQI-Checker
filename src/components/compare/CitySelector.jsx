import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X, AlertCircle, Sparkles, MapPin } from 'lucide-react';
import { CITIES_DATA } from '../../data/mockData';
import { getAQILevel } from '../../design-system/aqiTokens';

const PRESETS = [
  { label: 'Major Metros', slugs: ['delhi', 'mumbai', 'bengaluru', 'chennai'] },
  { label: 'North vs South', slugs: ['delhi', 'chennai', 'bengaluru'] },
  { label: 'Coastal Corridors', slugs: ['mumbai', 'chennai', 'kochi'] },
  { label: 'Tech Capitals', slugs: ['bengaluru', 'hyderabad', 'pune'] }
];

export default function CitySelector({
  selectedSlugs = [],
  onAddCity,
  onRemoveCity,
  onApplyPreset,
  availableCities = []
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter cities excluding already selected ones
  const filtered = (availableCities.length > 0 ? availableCities : CITIES_DATA)
    .filter(c => {
      const slug = c.slug || c.id;
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) ||
                           c.state?.toLowerCase().includes(query.toLowerCase());
      const notSelected = !selectedSlugs.includes(slug);
      return matchesQuery && notSelected;
    })
    .slice(0, 8);

  const handleSelect = (city) => {
    const slug = city.slug || city.id;
    onAddCity(slug);
    setQuery('');
    setIsOpen(false);
  };

  const isAtMax = selectedSlugs.length >= 4;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
            Select Cities to Compare
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select between 2 and 4 Indian metropolises for multi-variable comparative environmental analysis.
          </p>
        </div>

        {/* Selected count pill */}
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start md:self-auto">
          {selectedSlugs.length} of 4 Cities Selected
        </span>
      </div>

      {/* Selected City Chips */}
      <div className="my-6 flex flex-wrap items-center gap-3">
        {selectedSlugs.map((slug) => {
          const matched = (availableCities.length > 0 ? availableCities : CITIES_DATA)
            .find(c => (c.slug || c.id) === slug) || { name: slug, state: '' };

          return (
            <div
              key={slug}
              className="inline-flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 font-bold text-sm shadow-xs animate-in fade-in-50 duration-150"
            >
              <span>{matched.name}</span>
              {matched.state && (
                <span className="text-[11px] font-normal text-emerald-700 hidden sm:inline">
                  ({matched.state})
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemoveCity(slug)}
                disabled={selectedSlugs.length <= 2}
                title={selectedSlugs.length <= 2 ? 'Comparison requires at least 2 cities' : `Remove ${matched.name}`}
                className={`p-1 rounded-full transition-colors ${
                  selectedSlugs.length <= 2
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-emerald-700 hover:bg-emerald-200/60 hover:text-emerald-950 cursor-pointer'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {/* Add City Search Bar or Disabled pill */}
        {!isAtMax ? (
          <div className="relative" ref={containerRef}>
            <div className="flex items-center bg-slate-100/90 rounded-2xl border border-slate-200/80 px-3 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="+ Add city (e.g. Pune)..."
                className="bg-transparent outline-none text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 w-44 sm:w-56"
              />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 max-h-60 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Available Monitored Cities
                </div>
                {filtered.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-slate-500">
                    No matching unselected cities.
                  </div>
                ) : (
                  filtered.map((city) => (
                    <button
                      key={city.slug || city.id}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-900 block">
                          {city.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {city.state}
                        </span>
                      </div>
                      <Plus className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-medium px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100">
            Maximum 4 cities selected
          </span>
        )}
      </div>

      {/* Quick Comparison Presets */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Quick Presets:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onApplyPreset(preset.slugs)}
            className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-semibold text-slate-700 transition-colors border border-slate-200/60"
          >
            {preset.label}
          </button>
        ))}
      </div>

    </div>
  );
}
