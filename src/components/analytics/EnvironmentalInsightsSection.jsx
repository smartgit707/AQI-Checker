import React from 'react';
import { Lightbulb, Info, CheckCircle2, TrendingUp, Compass, ShieldAlert } from 'lucide-react';

export default function EnvironmentalInsightsSection({ insights = [] }) {
  if (!insights || insights.length === 0) return null;

  const getInsightIcon = (type) => {
    switch (type) {
      case 'pollutant': return <TrendingUp className="w-5 h-5 text-indigo-600" />;
      case 'gradient': return <Compass className="w-5 h-5 text-amber-600" />;
      case 'compliance': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'regional': return <Info className="w-5 h-5 text-teal-600" />;
      default: return <Lightbulb className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>Empirical Environmental Insights</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Deterministic observations derived from aggregated Indian sensor networks and synoptic telemetry.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          Rule-Based Synthesis
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-200/60">
                    {getInsightIcon(item.type)}
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {item.significance || 'Insight'}
                  </span>
                </div>
                <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs">
                  {item.metric}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Source: National Sensor Matrix</span>
              <span className="font-semibold text-slate-500">CPCB Formulation</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
