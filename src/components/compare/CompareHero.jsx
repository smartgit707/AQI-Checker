import React from 'react';
import { GitCompare, Clock, ShieldCheck, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../common/OptimizedImage';
import { getAQILevel } from '../../design-system/aqiTokens';

export default function CompareHero({ cities = [], generatedAt }) {
  const cityNames = cities.map(c => c.city.name).join(' vs ');

  const formattedTime = generatedAt 
    ? new Date(generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Live';

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800 py-12 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link>
          <span>/</span>
          <span className="text-emerald-400">Side-by-Side Comparison</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider mb-4">
              <GitCompare className="w-3.5 h-3.5 text-teal-400" />
              <span>Multi-Station Comparative Matrix</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
              {cities.length > 0 ? cityNames : 'City Air Quality Comparison'}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              Cross-sectional evaluation of criteria pollutants, synoptic dispersion, and air quality indices side-by-side.
            </p>
          </div>

          <div className="text-xs text-slate-400 flex flex-col sm:items-end gap-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Synchronized: <strong className="text-white">{formattedTime} IST</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              CPCB NAQI Standard Breakpoints
            </span>
          </div>
        </div>

        {/* Visual City Cards Carousel / Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${cities.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 mt-8`}>
          {cities.map((item) => {
            const level = getAQILevel(item.airQuality.aqi);

            return (
              <div
                key={item.city.slug}
                className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm flex flex-col justify-between group hover:border-white/20 transition-all"
              >
                {/* Photographic Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                  {item.city.image ? (
                    <OptimizedImage
                      src={item.city.image}
                      alt={item.city.imageAlt || item.city.name}
                      className="group-hover:scale-105 transition-transform duration-500"
                      overlay={
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                      }
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-sm">
                      {item.city.name}
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span 
                      className="px-2.5 py-1 rounded-full text-xs font-black shadow-md border border-white/20 text-white"
                      style={{ backgroundColor: level.color }}
                    >
                      AQI {item.airQuality.aqi}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                      {item.city.state}
                    </span>
                    <h3 className="text-xl font-bold font-display leading-tight flex items-center justify-between">
                      <span>{item.city.name}</span>
                      <Link 
                        to={`/city/${item.city.slug}`}
                        title="Open full city profile"
                        className="text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </h3>
                  </div>
                </div>

                {/* Score Summary Body */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
                    <span className="text-slate-400 font-medium">Status</span>
                    <span className="font-extrabold" style={{ color: level.color }}>
                      {level.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-3">
                    <div className="bg-white/5 rounded-xl p-2.5 text-center">
                      <span className="text-slate-400 text-[10px] block">Dominant</span>
                      <strong className="text-white font-mono">{item.airQuality.dominantPollutant}</strong>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2.5 text-center">
                      <span className="text-slate-400 text-[10px] block">Temperature</span>
                      <strong className="text-white">{item.weather.temperature}</strong>
                    </div>
                  </div>

                  <Link
                    to={`/city/${item.city.slug}`}
                    className="mt-2 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-center transition-colors block"
                  >
                    View Full City Profile →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
