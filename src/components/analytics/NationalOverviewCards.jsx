import React from 'react';
import { 
  Activity, 
  MapPin, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle,
  Wind,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAQILevel } from '../../design-system/aqiTokens';

export default function NationalOverviewCards({ overview }) {
  if (!overview) return null;

  const avgLevel = getAQILevel(overview.averageAqi || 50);
  const bestLevel = getAQILevel(overview.bestCity?.aqi || 30);
  const worstLevel = getAQILevel(overview.worstCity?.aqi || 200);

  const complianceRate = Math.round(
    (((overview.goodCitiesCount || 0) + (overview.moderateCitiesCount || 0)) / Math.max(1, overview.totalCities || 1)) * 100
  );

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span>National Environmental Overview</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Key statistical aggregate indicators derived from active continuous CAAQMS telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* 1. National Mean AQI */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">National Mean AQI</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-display" style={{ color: avgLevel.color }}>
                {overview.averageAqi ?? 'N/A'}
              </span>
              <span className="text-xs font-bold text-slate-400">NAQI</span>
            </div>
            <span 
              className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black text-white"
              style={{ backgroundColor: avgLevel.color }}
            >
              {overview.nationalCategory || avgLevel.category}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
            Averaged across all monitored stations
          </div>
        </div>

        {/* 2. Total Monitored Cities */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Stations Online</span>
            <MapPin className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-display text-slate-900">
                {overview.totalCities ?? 0}
              </span>
              <span className="text-xs font-semibold text-slate-500">Nodes</span>
            </div>
            <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
              6 Macro Regions
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
            Real-time continuous coverage
          </div>
        </div>

        {/* 3. Cleanest Urban Node */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Cleanest Node</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <Link 
              to={`/city/${overview.bestCity?.slug}`}
              className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1 block"
            >
              {overview.bestCity?.name || 'Data unavailable'}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-black font-display text-emerald-600">
                AQI {overview.bestCity?.aqi ?? 'N/A'}
              </span>
              <span className="text-[11px] text-slate-500">{overview.bestCity?.state}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
            Dominant: <strong>{overview.bestCity?.dominantPollutant || 'PM2.5'}</strong>
          </div>
        </div>

        {/* 4. Peak Burden Node */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Peak Burden Node</span>
            <TrendingUp className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <Link 
              to={`/city/${overview.worstCity?.slug}`}
              className="text-lg font-bold text-slate-900 hover:text-rose-700 transition-colors line-clamp-1 block"
            >
              {overview.worstCity?.name || 'Data unavailable'}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-black font-display text-rose-600">
                AQI {overview.worstCity?.aqi ?? 'N/A'}
              </span>
              <span className="text-[11px] text-slate-500">{overview.worstCity?.state}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
            Dominant: <strong>{overview.worstCity?.dominantPollutant || 'PM2.5'}</strong>
          </div>
        </div>

        {/* 5. Standards Compliance */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Health Compliance</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-display text-slate-900">
                {complianceRate}%
              </span>
              <span className="text-xs text-slate-500">Pass</span>
            </div>
            <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {(overview.goodCitiesCount || 0) + (overview.moderateCitiesCount || 0)} of {overview.totalCities} Cities
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
            Good or Moderate NAQI rating
          </div>
        </div>

        {/* 6. Dominant National Pollutant */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Primary Driver</span>
            <Wind className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-display text-indigo-700">
                {overview.dominantNationalPollutant || 'PM2.5'}
              </span>
            </div>
            <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
              {overview.dominantCount || 0} Urban Centers
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
            Most frequent dominant chemical factor
          </div>
        </div>

      </div>
    </div>
  );
}
