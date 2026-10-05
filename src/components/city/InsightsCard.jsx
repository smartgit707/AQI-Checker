import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Wind, 
  Activity, 
  AlertTriangle, 
  Info, 
  ShieldCheck 
} from 'lucide-react';

export default function InsightsCard({ insights = [], cityName = 'City' }) {
  if (!insights || insights.length === 0) return null;

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'high':
        return {
          border: 'border-rose-200',
          bg: 'bg-rose-50/80',
          badge: 'bg-rose-100 text-rose-800',
          iconColor: 'text-rose-600',
          icon: AlertTriangle
        };
      case 'medium':
        return {
          border: 'border-amber-200',
          bg: 'bg-amber-50/80',
          badge: 'bg-amber-100 text-amber-800',
          iconColor: 'text-amber-600',
          icon: Info
        };
      case 'low':
      default:
        return {
          border: 'border-emerald-200',
          bg: 'bg-emerald-50/80',
          badge: 'bg-emerald-100 text-emerald-800',
          iconColor: 'text-emerald-600',
          icon: ShieldCheck
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Factual Atmospheric Telemetry</span>
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900">
            Intelligent Environmental Insights — {cityName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule-based empirical analysis derived directly from real-time and historical sensor telemetry.
          </p>
        </div>
        <span className="text-2xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 self-start sm:self-auto">
          {insights.length} Active Insights
        </span>
      </div>

      {/* Grid of Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {insights.map((item, idx) => {
          const style = getSeverityStyle(item.severity);
          const IconComponent = style.icon;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${style.border} ${style.bg} transition-all hover:shadow-xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-white shadow-2xs ${style.iconColor}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <span className={`text-2xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${style.badge}`}>
                    {item.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-2xs text-slate-400">
                <span className="font-semibold text-slate-500">Metric: {item.metric}</span>
                <span>Source: {item.source}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
