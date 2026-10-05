import React from 'react';
import { 
  Building2, 
  Users, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  GitCompare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CityProfileSection({ city, relatedCities = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
      
      {/* City Geographic & Monitoring Profile (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Geographic & Regulatory Profile</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              Station ID: {city.slug}
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {city.description || `${city.name} is a key urban center located in ${city.state}, monitored via continuous CAAQMS regulatory hardware.`}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                Latitude / Longitude
              </span>
              <span className="text-sm font-bold text-slate-800 font-mono">
                {city.coordinates?.latitude || city.coordinates?.lat}° N
              </span>
              <span className="text-[11px] text-slate-500 block">
                {city.coordinates?.longitude || city.coordinates?.lng}° E
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                Metropolitan State
              </span>
              <span className="text-sm font-bold text-slate-800">
                {city.state}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {city.country || 'India'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                Population Tier
              </span>
              <span className="text-sm font-bold text-slate-800">
                {city.population ? `${(city.population / 1000000).toFixed(1)} Million` : 'Tier-1 Metropole'}
              </span>
              <span className="text-[11px] text-slate-500 block">
                Census Registry
              </span>
            </div>

          </div>

          <div className="mt-6 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 leading-relaxed">
              <strong>Station Specifications:</strong> Monitored under continuous telemetry guidelines with dual beta-attenuation instrumentation. Station anchor: <em>{city.station}</em>.
            </div>
          </div>
        </div>

        {/* Part 5 Comparison Entry Point */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Need comparative analytics against other cities?</span>
          <button
            onClick={() => alert(`Comparison Mode: Comparative analytics with ${city.name} will be available in Part 5.`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare {city.name}</span>
          </button>
        </div>
      </div>

      {/* Related Cities Directory (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90">
        <div className="pb-4 border-b border-slate-100 mb-6">
          <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>Explore Regional Stations</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Nearby and related urban corridors within the monitoring network.
          </p>
        </div>

        <div className="space-y-3">
          {relatedCities.map((rc) => (
            <div
              key={rc.slug}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/60 transition-all"
            >
              <Link to={`/city/${rc.slug}`} className="flex items-center gap-3 group flex-1">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                  {rc.image ? (
                    <img src={rc.image} alt={rc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                      {rc.name.slice(0, 2)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {rc.name}
                  </h4>
                  <span className="text-xs text-slate-500">{rc.state}</span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  to={`/compare?cities=${city.slug || city.id},${rc.slug}`}
                  className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors inline-flex items-center gap-1"
                  title={`Compare ${city.name} with ${rc.name}`}
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </Link>

                <Link
                  to={`/city/${rc.slug}`}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 text-xs font-bold transition-colors"
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
