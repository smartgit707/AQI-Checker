import React from 'react';
import { Layers, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PollutantAnalysisSection({ pollutants = [] }) {
  if (!pollutants || pollutants.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>National Multi-Pollutant Chemical Matrix</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Mean ambient concentrations computed against 24-hour CPCB National Ambient Air Quality Standards (NAAQS).
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
          6 Evaluated Species
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {pollutants.map((spec) => {
          const isExceeding = spec.percentageOfLimit > 100;

          return (
            <div
              key={spec.code}
              className="p-5 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black font-display text-slate-900">
                    {spec.code}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    isExceeding 
                      ? 'bg-rose-50 text-rose-700 border-rose-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {isExceeding ? 'Above NAAQS Limit' : 'Compliant with Limit'}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-slate-600 mb-4">
                  {spec.name}
                </h4>

                <div className="my-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">National Mean</span>
                    <span className="text-3xl font-black font-display text-slate-900">
                      {spec.averageValue ?? 'N/A'}
                    </span>
                    <span className="text-xs font-bold text-slate-500 ml-1">{spec.unit}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Standard Limit</span>
                    <span className="text-base font-bold text-slate-700">
                      {spec.limit} {spec.unit}
                    </span>
                  </div>
                </div>

                {/* Progress bar compared to threshold */}
                <div className="my-3">
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-slate-500">Threshold Saturation</span>
                    <span className={isExceeding ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                      {spec.percentageOfLimit}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExceeding ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(spec.percentageOfLimit || 0, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Highest city anchor */}
              {spec.highestCity && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Highest Concentration:</span>
                  <Link
                    to={`/city/${spec.highestCity.slug}`}
                    className="font-bold text-slate-800 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  >
                    <span>{spec.highestCity.name}</span>
                    <span className="font-mono text-slate-500">({spec.highestCity.value} {spec.unit})</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
