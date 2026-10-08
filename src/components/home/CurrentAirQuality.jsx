import React from 'react';
import { 
  Clock, 
  MapPin, 
  Wind, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Eye, 
  TrendingDown, 
  TrendingUp, 
  Info,
  Radio
} from 'lucide-react';
import AQIGauge from './AQIGauge';
import { getAQILevel } from '../../design-system/aqiTokens';

export default function CurrentAirQuality({ city = {} }) {
  const safeAqi = typeof city.aqi === 'number' && !isNaN(city.aqi) ? city.aqi : (Number(city.aqi) || 50);
  const level = getAQILevel(safeAqi) || {};
  const trendStr = typeof city.trend === 'string' ? city.trend : (typeof city.trend === 'object' && city.trend !== null ? String(city.trend?.changePercent || '-2%') : '-2%');
  const isTrendUp = trendStr.startsWith('+');

  return (
    <section id="current-aqi" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title with Live Signal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Ambient Monitoring Station Telemetry</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display flex items-center gap-3">
              {city.name}, {city.state}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {city.station}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Updated {city.updatedAt}
              </span>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Standard:</span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700">
              India NAQI (CPCB 2026)
            </span>
          </div>
        </div>

        {/* Main Conditions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left: AQI Gauge & Dominant Pollutant Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Real-time Air Score
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                  Continuous Feed
                </span>
              </div>

              {/* Gauge */}
              <div className="py-2">
                <AQIGauge value={city.aqi} />
              </div>

              {/* Advisory note */}
              <p className="text-xs sm:text-sm text-slate-600 text-center mt-6 max-w-sm mx-auto leading-relaxed">
                {level.description}
              </p>
            </div>

            {/* Dominant Pollutant & 24h Trend footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-0.5">
                  Dominant Pollutant
                </span>
                <span className="text-lg font-extrabold text-slate-900 font-display">
                  {city.dominantPollutant}
                </span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-0.5">
                  24h Variation
                </span>
                <span className={`text-lg font-extrabold font-display flex items-center justify-center gap-1 ${
                  isTrendUp ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  {isTrendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {trendStr}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Analytical & Meteorological Parameters (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* 24-Hour Predictive Hourly Forecast Bar */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-card border border-slate-200/90">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 font-display flex items-center gap-2">
                  <span>Hourly AQI Progression</span>
                  <span className="text-[10px] lowercase text-slate-400 font-normal">(diurnal model)</span>
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
                  Today's Trajectory
                </span>
              </div>

              {/* Hourly Chart Bar Visualization */}
              <div className="grid grid-cols-7 gap-2 sm:gap-3 pt-3 pb-1">
                {city.hourlyForecast?.map((item, idx) => {
                  const hourLevel = getAQILevel(item.aqi);
                  const heightPercent = Math.min(Math.max((item.aqi / 350) * 100, 20), 100);

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-700 mb-1.5">{item.aqi}</span>
                      <div className="w-full bg-slate-100 rounded-lg h-24 sm:h-28 flex items-end p-1 relative group">
                        <div 
                          className="w-full rounded-md transition-all duration-500 ease-out group-hover:opacity-90"
                          style={{ 
                            height: `${heightPercent}%`, 
                            backgroundColor: hourLevel.color 
                          }}
                        />
                        {/* Hover Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                          {hourLevel.category}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 mt-2">{item.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Micro-Meteorological Parameters Matrix */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-card border border-slate-200/90">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 font-display mb-4">
                Local Atmospheric Conditions
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-100/80 text-orange-600">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Temperature</span>
                    <span className="text-lg font-bold text-slate-900">{city.temperature}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Sensible ambient</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100/80 text-blue-600">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Humidity</span>
                    <span className="text-lg font-bold text-slate-900">{city.humidity}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Relative moisture</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-100/80 text-teal-600">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Surface Wind</span>
                    <span className="text-lg font-bold text-slate-900">{city.wind}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Dispersion vector</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100/80 text-indigo-600">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Visibility</span>
                    <span className="text-lg font-bold text-slate-900">{city.visibility}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Optical horizon</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
