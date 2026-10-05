import React from 'react';
import { Compass, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAQILevel } from '../../design-system/aqiTokens';

export default function RegionalAnalysisSection({ regional = [] }) {
  if (!regional || regional.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>Macro-Regional Air Quality Comparison</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Geographic atmospheric disparities across India's bioclimatic and meteorological zones.
          </p>
        </div>
        <span className="text-xs text-slate-400 italic">
          *Averages calculated across actively monitored urban centers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {regional.map((r) => {
          const lvl = getAQILevel(r.averageAqi);

          return (
            <div
              key={r.region}
              className="p-5 rounded-3xl border border-slate-200/80 bg-white hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900 font-display">
                    {r.region}
                  </span>
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-xs font-black text-white"
                    style={{ backgroundColor: lvl.color }}
                  >
                    AQI {r.averageAqi} • {r.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cleanest in Zone</span>
                    <Link
                      to={`/city/${r.cleanestCity.slug}`}
                      className="font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1 mt-0.5"
                    >
                      {r.cleanestCity.name}
                    </Link>
                    <span className="text-[11px] font-mono text-emerald-600 font-bold">
                      AQI {r.cleanestCity.aqi}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Highest Burden</span>
                    <Link
                      to={`/city/${r.mostPollutedCity.slug}`}
                      className="font-bold text-slate-900 hover:text-rose-700 transition-colors line-clamp-1 mt-0.5"
                    >
                      {r.mostPollutedCity.name}
                    </Link>
                    <span className="text-[11px] font-mono text-rose-600 font-bold">
                      AQI {r.mostPollutedCity.aqi}
                    </span>
                  </div>
                </div>

                {/* Cities in Region Pill List */}
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                    Included Metropolises ({r.cityCount}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.cities?.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/city/${c.slug}`}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-medium text-slate-700 transition-colors border border-slate-200/60"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Coverage: {r.cityCount} Monitored Cities</span>
                <span className="font-semibold text-emerald-700">NAQI Standard</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
