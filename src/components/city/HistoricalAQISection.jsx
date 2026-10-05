import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar, 
  BarChart2, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { getAQILevel } from '../../design-system/aqiTokens';

export default function HistoricalAQISection({ history, onPeriodChange, currentPeriod }) {
  const [selectedPollutant, setSelectedPollutant] = useState('aqi'); // 'aqi' | 'pm25' | 'pm10' | 'no2' | 'o3'

  const points = history?.points || [];
  const trend = history?.trend || { direction: 'Stable', changePercent: 0, description: 'Steady ambient trend.' };

  const periods = [
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' }
  ];

  // Compute maximum value for chart scaling
  const getPointValue = (p) => {
    if (selectedPollutant === 'aqi') return p.aqi || 0;
    return p.pollutants?.[selectedPollutant] || 0;
  };

  const maxValue = Math.max(
    ...points.map(getPointValue),
    selectedPollutant === 'aqi' ? 100 : 50
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
              Atmospheric Historical Timeline
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real Copernicus CAMS model observations aggregated across the selected duration.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {periods.map((p) => (
              <button
                key={p.id}
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
      </div>

      {/* Trend Overview & Pollutant Selector Bar */}
      <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100">
        
        {/* Trend Indicator */}
        <div className="flex items-center gap-3">
          <div 
            className="p-2.5 rounded-2xl flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: trend.badgeColor || '#10b981' }}
          >
            {trend.direction === 'Improving' && <TrendingDown className="w-5 h-5" />}
            {trend.direction === 'Worsening' && <TrendingUp className="w-5 h-5" />}
            {trend.direction === 'Relatively Stable' && <Minus className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-slate-400">Trend Assessment:</span>
              <span className="text-sm font-extrabold text-slate-900">{trend.direction}</span>
              {trend.changePercent !== 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {trend.changePercent > 0 ? `+${trend.changePercent}%` : `${trend.changePercent}%`}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {trend.description}
            </p>
          </div>
        </div>

        {/* Pollutant Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Metric:</span>
          <select
            value={selectedPollutant}
            onChange={(e) => setSelectedPollutant(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="aqi">Overall NAQI Score</option>
            <option value="pm25">PM2.5 (Fine Particles)</option>
            <option value="pm10">PM10 (Coarse Dust)</option>
            <option value="no2">NO₂ (Combustion Gas)</option>
            <option value="o3">O₃ (Ground Ozone)</option>
          </select>
        </div>

      </div>

      {/* Interactive Bar Chart Visualization */}
      {points.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <span>Historical telemetry is not yet available for this period.</span>
        </div>
      ) : (
        <div className="pt-6 pb-2">
          <div className="h-64 sm:h-72 flex items-end gap-1 sm:gap-2 overflow-x-auto pb-4 pt-6">
            {points.map((pt, idx) => {
              const val = getPointValue(pt);
              const heightPercent = Math.min(Math.max((val / maxValue) * 100, 10), 100);
              const aqiLvl = getAQILevel(pt.aqi);
              const barColor = selectedPollutant === 'aqi' ? aqiLvl.color : '#059669';

              const label = currentPeriod === '24h' 
                ? pt.time 
                : new Date(pt.date).toLocaleDateString([], { month: 'short', day: 'numeric' });

              return (
                <div 
                  key={idx}
                  className="flex-1 min-w-[20px] sm:min-w-[28px] max-w-[48px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-lg pointer-events-none shadow-xl whitespace-nowrap z-20">
                    <span className="font-bold">{label}</span>: {val} {selectedPollutant === 'aqi' ? 'NAQI' : 'µg/m³'}
                    <span className="block text-[9px] text-slate-300 capitalize">{pt.category || ''}</span>
                  </div>

                  {/* Value label above bar on desktop */}
                  <span className="text-[10px] font-bold text-slate-500 mb-1 opacity-0 group-hover:opacity-100 sm:opacity-80 transition-opacity">
                    {Math.round(val)}
                  </span>

                  {/* Bar */}
                  <div className="w-full bg-slate-100 rounded-t-lg h-full flex items-end p-0.5">
                    <div 
                      className="w-full rounded-t-md transition-all duration-500 group-hover:brightness-110"
                      style={{ 
                        height: `${heightPercent}%`, 
                        backgroundColor: barColor 
                      }}
                    />
                  </div>

                  {/* X Axis Label */}
                  <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 mt-2 truncate w-full text-center">
                    {idx % (currentPeriod === '90d' ? 6 : currentPeriod === '30d' ? 3 : 1) === 0 ? label : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
            <span>Baseline minimum</span>
            <span className="font-semibold text-slate-600">Peak interval: {Math.round(maxValue)} {selectedPollutant === 'aqi' ? 'NAQI' : 'µg/m³'}</span>
          </div>
        </div>
      )}

      {/* Methodology Context Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span>
          <strong>Methodology:</strong> Trends are dynamically evaluated by comparing the recent half-window against prior baseline averages. Continuous assimilations sourced from ECMWF CAMS.
        </span>
      </div>

    </div>
  );
}
