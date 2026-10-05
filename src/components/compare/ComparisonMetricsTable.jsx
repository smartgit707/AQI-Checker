import React from 'react';
import { Table, ShieldCheck, Thermometer, Wind, Droplets, Gauge } from 'lucide-react';
import { getAQILevel } from '../../design-system/aqiTokens';

export default function ComparisonMetricsTable({ cities = [] }) {
  if (!cities || cities.length === 0) return null;

  const rows = [
    {
      category: 'Air Quality Indices',
      items: [
        {
          label: 'NAQI Score',
          desc: 'Overall Indian National Air Quality Index',
          render: (c) => {
            const lvl = getAQILevel(c.airQuality.aqi);
            return (
              <span 
                className="px-3 py-1 rounded-full text-xs font-black text-white inline-block shadow-xs"
                style={{ backgroundColor: lvl.color }}
              >
                {c.airQuality.aqi} • {lvl.category}
              </span>
            );
          }
        },
        {
          label: 'Dominant Pollutant',
          desc: 'Primary driver determining NAQI rating',
          render: (c) => <span className="font-bold text-slate-900 font-mono">{c.airQuality.dominantPollutant}</span>
        },
        {
          label: '24h Variance',
          desc: 'Directional shift over preceding 24 hours',
          render: (c) => {
            const trend = c.airQuality.trend24h || '0%';
            const isRising = trend.startsWith('+');
            return (
              <span className={`font-bold ${isRising ? 'text-rose-600' : 'text-emerald-600'}`}>
                {trend}
              </span>
            );
          }
        }
      ]
    },
    {
      category: 'Particulate & Chemical Concentrations',
      items: [
        {
          label: 'PM2.5 (Fine)',
          desc: 'Limit: 60 µg/m³ (CPCB 24h)',
          render: (c) => {
            const p = c.airQuality.pollutants?.find(item => item.code.includes('2.5') || item.code.includes('25'));
            return p ? <strong>{p.value} <span className="text-slate-400 font-normal">µg/m³</span></strong> : 'N/A';
          }
        },
        {
          label: 'PM10 (Coarse)',
          desc: 'Limit: 100 µg/m³ (CPCB 24h)',
          render: (c) => {
            const p = c.airQuality.pollutants?.find(item => item.code === 'PM10' || item.code.includes('10'));
            return p ? <strong>{p.value} <span className="text-slate-400 font-normal">µg/m³</span></strong> : 'N/A';
          }
        },
        {
          label: 'Nitrogen Dioxide (NO2)',
          desc: 'Limit: 80 ppb (CPCB 24h)',
          render: (c) => {
            const p = c.airQuality.pollutants?.find(item => item.code === 'NO2' || item.code === 'NO₂');
            return p ? <span>{p.value} <span className="text-slate-400 font-normal">{p.unit}</span></span> : 'N/A';
          }
        },
        {
          label: 'Sulfur Dioxide (SO2)',
          desc: 'Limit: 80 ppb (CPCB 24h)',
          render: (c) => {
            const p = c.airQuality.pollutants?.find(item => item.code === 'SO2' || item.code === 'SO₂');
            return p ? <span>{p.value} <span className="text-slate-400 font-normal">{p.unit}</span></span> : 'N/A';
          }
        },
        {
          label: 'Carbon Monoxide (CO)',
          desc: 'Limit: 4.0 mg/m³ (CPCB 24h)',
          render: (c) => {
            const p = c.airQuality.pollutants?.find(item => item.code === 'CO');
            return p ? <span>{p.value} <span className="text-slate-400 font-normal">{p.unit}</span></span> : 'N/A';
          }
        },
        {
          label: 'Ozone (O3)',
          desc: 'Limit: 100 ppb (CPCB 8h)',
          render: (c) => {
            const p = c.airQuality.pollutants?.find(item => item.code === 'O3' || item.code === 'O₃');
            return p ? <span>{p.value} <span className="text-slate-400 font-normal">{p.unit}</span></span> : 'N/A';
          }
        }
      ]
    },
    {
      category: 'Meteorological & Surface Dispersion',
      items: [
        {
          label: 'Surface Air Temp',
          desc: 'Synoptic dry-bulb ambient temperature',
          render: (c) => <span className="font-semibold text-slate-800">{c.weather.temperature}</span>
        },
        {
          label: 'Relative Humidity',
          desc: 'Aerosol hygroscopic swelling factor',
          render: (c) => <span className="font-semibold text-slate-800">{c.weather.humidity}</span>
        },
        {
          label: 'Wind Velocity',
          desc: 'Horizontal planetary boundary dispersion',
          render: (c) => <span className="font-semibold text-slate-800">{c.weather.wind}</span>
        },
        {
          label: 'Barometric Pressure',
          desc: 'Sea-level atmospheric pressure',
          render: (c) => <span className="font-semibold text-slate-800">{c.weather.pressure}</span>
        },
        {
          label: 'Monitoring Station',
          desc: 'CPCB Regulatory Point Hardware',
          render: (c) => <span className="text-xs text-slate-600 line-clamp-1">{c.city.station?.split('&')[0]}</span>
        }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
      
      <div className="pb-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
            Comprehensive Metric Matrix
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Side-by-side breakdown of criteria pollutants, chemical species, and surface meteorology.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 sm:mx-0 mt-6">
        <div className="inline-block min-w-full align-middle px-6 sm:px-0">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                <th scope="col" className="py-3.5 pl-4 pr-3 text-xs font-bold uppercase tracking-wider text-slate-500 rounded-l-2xl w-1/3">
                  Environmental Parameter
                </th>
                {cities.map((c, i) => (
                  <th 
                    key={c.city.slug} 
                    scope="col" 
                    className={`py-3.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-900 text-center ${
                      i === cities.length - 1 ? 'rounded-r-2xl' : ''
                    }`}
                  >
                    <span className="block text-sm font-extrabold">{c.city.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{c.city.state}</span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((section) => (
                <React.Fragment key={section.category}>
                  <tr className="bg-slate-100/50">
                    <td 
                      colSpan={cities.length + 1} 
                      className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50/50"
                    >
                      {section.category}
                    </td>
                  </tr>

                  {section.items.map((item) => (
                    <tr key={item.label} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pl-4 pr-3 text-xs text-slate-900">
                        <span className="font-bold block">{item.label}</span>
                        <span className="text-[11px] text-slate-400 block">{item.desc}</span>
                      </td>

                      {cities.map((c) => (
                        <td key={c.city.slug} className="py-3.5 px-3 text-center whitespace-nowrap text-xs">
                          {item.render(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
