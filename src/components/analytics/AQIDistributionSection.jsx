import React from 'react';
import { PieChart, ShieldAlert } from 'lucide-react';

export default function AQIDistributionSection({ distribution = [], totalCities = 16 }) {
  if (!distribution || distribution.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600" />
            <span>National AQI Distribution Spectrum</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Breakdown of Indian metropolises across the 6 standard Central Pollution Control Board (CPCB) NAQI categories.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
          Sample Size: {totalCities} Active Hubs
        </span>
      </div>

      {/* Stacked Proportional Distribution Bar */}
      <div className="my-6">
        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Proportional Category Share</span>
          <span>100% of Monitored Grid</span>
        </div>

        <div className="w-full h-8 rounded-2xl overflow-hidden flex bg-slate-100 p-1 shadow-inner gap-1">
          {distribution.map((item) => {
            if (item.count === 0) return null;
            return (
              <div
                key={item.category}
                style={{
                  width: `${Math.max(item.percentage, 4)}%`,
                  backgroundColor: item.color
                }}
                className="h-full rounded-xl transition-all duration-500 relative group flex items-center justify-center text-white font-bold text-xs shadow-xs"
                title={`${item.category}: ${item.count} cities (${item.percentage}%)`}
              >
                {item.percentage >= 10 && (
                  <span className="text-[11px] drop-shadow-xs">{item.percentage}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Granular Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        {distribution.map((item) => (
          <div
            key={item.category}
            className="p-4 rounded-2xl border transition-all duration-200 bg-slate-50/50 hover:bg-white hover:shadow-card"
            style={{ borderColor: `${item.color}40` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {item.min}-{item.max}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              {item.category}
            </h4>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-display text-slate-900">
                {item.count}
              </span>
              <span className="text-xs text-slate-500">
                ({item.percentage}%)
              </span>
            </div>

            <p className="mt-2 text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
