import React from 'react';
import { TrendingUp, TrendingDown, MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import OptimizedImage from '../common/OptimizedImage';
import { CITIES_DATA } from '../../data/mockData';
import { getAQILevel } from '../../design-system/aqiTokens';

export default function VisualCityExplorer({ onSelectCity, activeCityId }) {
  return (
    <section id="city-explorer" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="Urban Landscape Telemetry"
          title="Explore India’s Cities"
          subtitle="Real-time air indices contextualized with iconic architectural landscapes and regional microclimates."
        />

        {/* Responsive Grid with Image Storytelling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CITIES_DATA.map((city) => {
            const level = getAQILevel(city.aqi);
            const isSelected = city.id === activeCityId;

            return (
              <div
                key={city.id}
                onClick={() => {
                  onSelectCity(city);
                  const el = document.getElementById('current-aqi');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group cursor-pointer rounded-3xl overflow-hidden bg-white border transition-all duration-300 flex flex-col justify-between ${
                  isSelected 
                    ? 'ring-2 ring-emerald-600 shadow-xl border-emerald-500 scale-[1.02]' 
                    : 'border-slate-200/80 hover:border-slate-300 hover:shadow-card hover:-translate-y-1'
                }`}
              >
                {/* City Photographic Header with subtle zoom on hover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <OptimizedImage
                    src={city.image}
                    alt={city.imageAlt}
                    className="group-hover:scale-105 transition-transform duration-500"
                    overlay={
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
                    }
                  />

                  {/* AQI Pill Floating on Top Right */}
                  <div className="absolute top-3 right-3">
                    <span 
                      className="px-2.5 py-1 rounded-full text-xs font-black shadow-md border border-white/20 text-white"
                      style={{ backgroundColor: level.color }}
                    >
                      AQI {city.aqi}
                    </span>
                  </div>

                  {/* City Name overlay on bottom left of image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-semibold text-slate-200 uppercase tracking-wider block">
                      {city.state}
                    </span>
                    <h3 className="text-xl font-bold font-display leading-tight flex items-center justify-between">
                      <span>{city.name}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-300" />
                    </h3>
                  </div>
                </div>

                {/* City Card Metrics Body */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                  <div>
                    {/* Status & Dominant Pollutant */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-semibold text-slate-600">
                        Status: <strong style={{ color: level.color }}>{level.category}</strong>
                      </span>
                      <span className="text-slate-500 font-medium">
                        Primary: <strong>{city.dominantPollutant}</strong>
                      </span>
                    </div>

                    {/* Meteorological mini chips */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-500 pt-2 border-t border-slate-100">
                      <div className="bg-slate-50 rounded-xl p-2 text-center">
                        <span className="block text-slate-400 text-[10px]">Temperature</span>
                        <span className="font-bold text-slate-800">{city.temperature}</span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2 text-center">
                        <span className="block text-slate-400 text-[10px]">24h Shift</span>
                        <span className={`font-bold ${(city.trend || '').startsWith('+') ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {city.trend || '-2%'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Details Prompt */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Telemetry Station</span>
                    <Link
                      to={`/city/${city.id || city.slug}`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200/80 transition-colors shadow-xs"
                    >
                      <span>Full Profile</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
