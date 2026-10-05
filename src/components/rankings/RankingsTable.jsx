import React, { useState } from 'react';
import { 
  Trophy, 
  Search, 
  TrendingDown, 
  TrendingUp, 
  MapPin, 
  ArrowRight, 
  GitCompare, 
  Filter 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAQILevel } from '../../design-system/aqiTokens';

const REGIONS = [
  'All India',
  'North India',
  'South India',
  'West India',
  'East India',
  'Central India'
];

export default function RankingsTable({
  rankings = { cleanest: [], mostPolluted: [] }
}) {
  const [viewType, setViewType] = useState('cleanest'); // 'cleanest' | 'mostPolluted'
  const [selectedRegion, setSelectedRegion] = useState('All India');
  const [searchQuery, setSearchQuery] = useState('');

  const currentList = viewType === 'cleanest' 
    ? (rankings.cleanest || []) 
    : (rankings.mostPolluted || []);

  const filtered = currentList.filter(item => {
    const matchesRegion = selectedRegion === 'All India' || 
                          item.region?.toLowerCase() === selectedRegion.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>National City Air Quality Rankings</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ranked based on latest continuous CAAQMS air quality index (lower AQI indicates superior atmospheric clarity).
          </p>
        </div>

        {/* View Switch: Cleanest vs Most Polluted */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl text-xs font-semibold self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setViewType('cleanest')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              viewType === 'cleanest'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cleanest Metros</span>
          </button>

          <button
            type="button"
            onClick={() => setViewType('mostPolluted')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              viewType === 'mostPolluted'
                ? 'bg-white text-rose-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            <span>Most Impacted</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Regional Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Region:
          </span>
          {REGIONS.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedRegion === reg
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <div className="flex items-center bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-200/80">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in rankings..."
              className="bg-transparent outline-none text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 w-44"
            />
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="overflow-x-auto -mx-6 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-6 sm:px-0">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                <th scope="col" className="py-3.5 pl-4 pr-3 text-xs font-bold uppercase tracking-wider text-slate-500 rounded-l-2xl w-16">
                  Rank
                </th>
                <th scope="col" className="py-3.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  City & Geographic State
                </th>
                <th scope="col" className="py-3.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                  NAQI Rating
                </th>
                <th scope="col" className="py-3.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                  Health Status
                </th>
                <th scope="col" className="py-3.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-center hidden md:table-cell">
                  Primary Chemical Driver
                </th>
                <th scope="col" className="py-3.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right rounded-r-2xl">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    No cities match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const level = getAQILevel(item.aqi);

                  return (
                    <tr key={item.slug} className="hover:bg-slate-50/60 transition-colors">
                      {/* Rank Number with Badge */}
                      <td className="py-4 pl-4 pr-3 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs font-black ${
                          idx === 0 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : idx === 1 
                            ? 'bg-slate-200 text-slate-800' 
                            : idx === 2 
                            ? 'bg-amber-50 text-amber-800'
                            : 'text-slate-500 font-mono'
                        }`}>
                          #{idx + 1}
                        </span>
                      </td>

                      {/* City Name and Location */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-10 h-10 rounded-xl object-cover hidden sm:block bg-slate-100 flex-shrink-0" 
                            />
                          )}
                          <div>
                            <Link
                              to={`/city/${item.slug}`}
                              className="font-bold text-slate-900 hover:text-emerald-700 transition-colors text-sm sm:text-base block"
                            >
                              {item.name}
                            </Link>
                            <span className="text-xs text-slate-500 block">
                              {item.state} • <span className="text-slate-400">{item.region}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* NAQI Score */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span 
                          className="text-xl sm:text-2xl font-black font-display"
                          style={{ color: level.color }}
                        >
                          {item.aqi}
                        </span>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span 
                          className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                          style={{ backgroundColor: level.color }}
                        >
                          {level.category}
                        </span>
                      </td>

                      {/* Dominant Pollutant */}
                      <td className="py-4 px-3 text-center whitespace-nowrap hidden md:table-cell">
                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                          {item.dominantPollutant || 'PM2.5'}
                        </span>
                      </td>

                      {/* Action Links */}
                      <td className="py-4 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/compare?cities=${item.slug},delhi`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors text-xs font-semibold inline-flex items-center gap-1"
                            title={`Compare ${item.name}`}
                          >
                            <GitCompare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Compare</span>
                          </Link>

                          <Link
                            to={`/city/${item.slug}`}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors text-xs font-bold inline-flex items-center gap-1"
                          >
                            <span>Profile</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
