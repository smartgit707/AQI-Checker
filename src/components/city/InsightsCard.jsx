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

function formatMetric(metric) {
  if (!metric) return null;
  if (typeof metric === 'string' || typeof metric === 'number') {
    return String(metric);
  }
  if (typeof metric === 'object') {
    if (metric.pollutant) {
      const conc = metric.concentration != null ? `${metric.concentration} ${metric.unit || 'µg/m³'}`.trim() : '';
      return conc ? `${metric.pollutant}: ${conc}` : `${metric.pollutant}`;
    }
    if (metric.current !== undefined || metric.direction !== undefined) {
      const dir = metric.direction ? String(metric.direction) : '';
      const chg = metric.change24h !== undefined ? ` (Δ ${metric.change24h})` : '';
      return `${dir}${chg}`.trim() || `AQI ${metric.current}`;
    }
    if (metric.activeSensors !== undefined) {
      return `${metric.activeSensors} criteria sensors active`;
    }
    if (metric.windSpeed !== undefined || metric.humidity !== undefined || metric.temperature !== undefined) {
      const parts = [];
      if (metric.windSpeed !== undefined) parts.push(`${metric.windSpeed} km/h wind`);
      if (metric.humidity !== undefined) parts.push(`${metric.humidity}% humidity`);
      if (metric.temperature !== undefined) parts.push(`${metric.temperature}°C`);
      return parts.join(', ');
    }
    if (metric.outlook !== undefined) {
      return `${metric.outlook}${metric.projectedDelta ? ` (Δ ${metric.projectedDelta} in ${metric.horizonHours || 24}h)` : ''}`;
    }
    if (metric.totalMonitored !== undefined) {
      return `${metric.goodCities || 0}/${metric.totalMonitored} satisfactory`;
    }
    return Object.entries(metric)
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
      .join(' | ');
  }
  return String(metric);
}

function formatSource(source) {
  if (!source) return 'Observed Telemetry';
  if (typeof source === 'object') return 'Sensor Network';
  return String(source).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default function InsightsCard({ insights = [], cityName = 'City' }) {
  if (!insights || insights.length === 0) return null;

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'high':
      case 'warning':
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
      case 'info':
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
          const metricStr = formatMetric(item.metric);
          const sourceStr = formatSource(item.source);

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
                      {typeof item.title === 'string' ? item.title : String(item.title || '')}
                    </h4>
                  </div>
                  <span className={`text-2xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${style.badge}`}>
                    {typeof item.severity === 'string' ? item.severity : 'info'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {typeof item.description === 'string' ? item.description : String(item.description || '')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-2xs text-slate-400">
                <span className="font-semibold text-slate-500">
                  {metricStr ? `Metric: ${metricStr}` : 'Ground Telemetry'}
                </span>
                <span>Source: {sourceStr}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
