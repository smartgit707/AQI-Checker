import React, { useState } from 'react';
import { BarChart3, Info } from 'lucide-react';
import { getAQILevel } from '../../design-system/aqiTokens';

const SPECIES = [
  { code: 'PM2.5', label: 'PM2.5 (Fine Particulates)', limit: 60, unit: 'µg/m³', desc: 'Combustion particles & secondary aerosols' },
  { code: 'PM10', label: 'PM10 (Coarse Dust)', limit: 100, unit: 'µg/m³', desc: 'Mechanical dust, road resuspension' },
  { code: 'NO2', label: 'NO2 (Nitrogen Dioxide)', limit: 80, unit: 'ppb', desc: 'Vehicular emissions & thermal combustion' },
  { code: 'SO2', label: 'SO2 (Sulfur Dioxide)', limit: 80, unit: 'ppb', desc: 'Industrial discharges & fuel burning' },
  { code: 'CO', label: 'CO (Carbon Monoxide)', limit: 4.0, unit: 'mg/m³', desc: 'Incomplete combustion in transit queues' },
  { code: 'O3', label: 'O3 (Ground Ozone)', limit: 100, unit: 'ppb', desc: 'Photochemical smog secondary product' }
];

export default function PollutantComparisonChart({ cities = [] }) {
  const [selectedSpecies, setSelectedSpecies] = useState('PM2.5');

  if (!cities || cities.length === 0) return null;

  const activeSpec = SPECIES.find(s => s.code === selectedSpecies) || SPECIES[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Multi-Pollutant Cross Comparison</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluate individual chemical species concentrations side-by-side against CPCB 24-hour thresholds.
          </p>
        </div>

        {/* Species selector pills */}
        <div className="flex flex-wrap gap-1.5">
          {SPECIES.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => setSelectedSpecies(s.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSpecies === s.code
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {s.code}
            </button>
          ))}
        </div>
      </div>

      <div className="my-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div>
            <span className="font-bold text-slate-800">{activeSpec.label}</span>
            <span className="text-slate-400 ml-1.5 hidden sm:inline">({activeSpec.desc})</span>
          </div>
          <span className="font-semibold text-emerald-800">
            CPCB NAAQS Limit: <strong>{activeSpec.limit} {activeSpec.unit}</strong>
          </span>
        </div>

        {/* Comparative Horizontal Bars */}
        <div className="space-y-5">
          {cities.map((item) => {
            const p = item.airQuality.pollutants?.find(spec => 
              spec.code === activeSpec.code || 
              spec.code?.replace(/[₂₃.]/g, '') === activeSpec.code.replace(/[.0-9]/g, '')
            );
            const val = p?.value ?? 0;
            const percentage = Math.round((val / activeSpec.limit) * 100);
            const isOver = percentage > 100;

            return (
              <div key={item.city.slug} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.city.name}</span>
                    <span className="text-[11px] text-slate-400">({item.city.state})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">
                      {val} {activeSpec.unit}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isOver ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {percentage}% of standard
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-100 h-4 rounded-xl overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-lg transition-all duration-700 ${
                      isOver ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
