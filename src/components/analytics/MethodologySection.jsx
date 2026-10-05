import React from 'react';
import { BookOpen, ShieldCheck, Scale, Cpu, Calendar } from 'lucide-react';

export default function MethodologySection() {
  return (
    <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/90 my-8 text-slate-700">
      
      <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-6">
        <BookOpen className="w-5 h-5 text-emerald-700" />
        <h3 className="text-xl font-bold font-display text-slate-900">
          Scientific Methodology & Regulatory Formulations
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>NAQI Mathematical Standard</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Calculated adhering to Central Pollution Control Board (CPCB 2026) piecewise linear sub-index interpolation. The overall index represents the maximum sub-index across 6 criteria pollutants (PM2.5, PM10, NO2, SO2, CO, O3), where at least one particulate species is mandatory.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Ranking & Sorting Criteria</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Cleanest rankings order cities ascendingly by current NAQI score (lowest score indicates cleanest air). Ties are resolved by secondary particulate concentration (PM2.5). Unmonitored nodes are flagged as "Data Unavailable" and excluded from ranking tallies.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Directional Trend Dynamics</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Historical trends compare the mean of recent telemetry points with an identical preceding baseline period. Variations exceeding +5% are classified as "Worsening", below -5% as "Improving", and within ±5% as "Relatively Stable".
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Data Freshness & Caching</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Data is retrieved from Copernicus Atmosphere Monitoring Service (CAMS) assimilation cycles and Open-Meteo High-Resolution NWP models. In-memory caching limits excessive upstream requests, maintaining 10–15 minute freshness for atmospheric data.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
            <BookOpen className="w-4 h-4 text-rose-600" />
            <span>Missing Data Protocol</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Missing pollutant readings are explicitly marked as "N/A" and never treated as zero. Regional averages strictly compute metrics across verified active reporting stations, without imputing unmonitored rural background regions.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Academic & Demo Scope</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            This platform is engineered as an environmental intelligence demonstration. While utilizing official CPCB breakpoints and European ECMWF models, data serves informational and educational comparative purposes.
          </p>
        </div>

      </div>

    </div>
  );
}
