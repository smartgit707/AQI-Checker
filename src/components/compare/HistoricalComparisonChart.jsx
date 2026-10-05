import React, { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getAQILevel } from '../../design-system/aqiTokens';

const CITY_COLORS = [
  '#059669', // emerald-600
  '#2563eb', // blue-600
  '#d97706', // amber-600
  '#7c3aed'  // purple-600
];

export default function HistoricalComparisonChart({
  cities = [],
  currentPeriod = '7d',
  onPeriodChange
}) {
  if (!cities || cities.length === 0) return null;

  const periods = [
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' }
  ];

  // Derive points labels from first city's history
  const samplePoints = cities[0]?.history?.points || [];
  const labels = samplePoints.map(p => p.label || p.date);

  // Compute global max for scaling
  let maxAqi = 100;
  cities.forEach(c => {
    (c.history?.points || []).forEach(p => {
      if (p.aqi > maxAqi) maxAqi = p.aqi;
    });
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
      
      {/* Header and Period Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Atmospheric Timeline Comparison</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cross-temporal historical trajectory assimilated from Copernicus CAMS model points.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start md:self-auto">
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPeriodChange(p.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentPeriod === p.id
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* City Legend */}
      <div className="flex flex-wrap items-center gap-4 my-6 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
        <span className="text-slate-400 font-semibold uppercase text-[10px]">Comparative Legend:</span>
        {cities.map((item, idx) => (
          <div key={item.city.slug} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full shadow-xs" 
              style={{ backgroundColor: CITY_COLORS[idx % CITY_COLORS.length] }} 
            />
            <span className="font-bold text-slate-800">{item.city.name}</span>
            <span className="text-slate-500 font-mono">
              (Current AQI {item.airQuality.aqi})
            </span>
          </div>
        ))}
      </div>

      {/* Visual Timeline Grouped Bars */}
      <div className="my-6">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end pt-8 pb-2">
          {labels.map((label, pointIdx) => (
            <div key={label} className="flex flex-col items-center">
              
              {/* Grouped bars for this timestamp */}
              <div className="w-full bg-slate-50 rounded-2xl h-44 sm:h-56 p-1.5 flex items-end justify-center gap-1 sm:gap-1.5 border border-slate-100">
                {cities.map((cityItem, cityIdx) => {
                  const pt = cityItem.history?.points?.[pointIdx];
                  const aqi = pt?.aqi ?? cityItem.airQuality.aqi;
                  const heightPercent = Math.min(Math.max((aqi / maxAqi) * 100, 15), 100);
                  const color = CITY_COLORS[cityIdx % CITY_COLORS.length];

                  return (
                    <div
                      key={cityItem.city.slug}
                      className="w-full rounded-md transition-all duration-500 ease-out relative group"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: color
                      }}
                    >
                      {/* Hover Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-30">
                        <strong className="block">{cityItem.city.name}</strong>
                        AQI {aqi}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time Label */}
              <span className="text-[11px] font-semibold text-slate-500 mt-2 text-center line-clamp-1">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
