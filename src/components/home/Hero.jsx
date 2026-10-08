import React from 'react';
import { Compass, ShieldCheck, Activity, ChevronRight, Wind, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LocationSearch from '../common/LocationSearch';
import OptimizedImage from '../common/OptimizedImage';
import { IMAGES } from '../../data/images';
import { getAQILevel } from '../../design-system/aqiTokens';

export default function Hero({ onSelectCity, currentCity }) {
  const currentLevel = getAQILevel(currentCity.aqi);

  return (
    <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-24 overflow-hidden border-b border-slate-200/60">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50/50 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Editorial Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-medium text-slate-700">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-emerald-800">CPCB & Sensor Network</span>
            <span className="text-slate-300">•</span>
            <span>Real-time Pan-India Ambient Air Monitoring</span>
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.15]">
            Understand the <span className="text-emerald-700 relative inline-block">
              air you breathe
              <svg className="absolute -bottom-2 left-0 w-full h-2 text-emerald-300 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="6" fill="none" />
              </svg>
            </span> with precision.
          </h1>
          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real-time air quality metrics, pollutant breakdown, atmospheric trends, and actionable health guidance for cities across India.
          </p>
        </div>

        {/* Location Search Box */}
        <div className="mb-10 sm:mb-12">
          <LocationSearch onSelectCity={onSelectCity} currentCityId={currentCity.id} />
          <div className="flex items-center justify-center gap-3 sm:gap-6 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Calibrated NAQI Standards
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              Sub-Hour Telemetry Refresh
            </span>
            <span className="text-slate-300">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-blue-600" />
              Multi-Pollutant Particulate Breakdown
            </span>
          </div>
        </div>

        {/* Editorial Hero Feature Card (Images + Data Combined) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Visual Hero Image side (7 cols) */}
            <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[460px]">
              <OptimizedImage
                src={currentCity.image || IMAGES.hero.atmosphericCity}
                alt={`${currentCity.name} skyline atmospheric air overview`}
                priority={true}
                aspectRatio="h-full w-full"
                className="h-full w-full"
                overlay={
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/20" />
                }
              />
              
              {/* Photo Attribution & Location Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {currentCity.name}, {currentCity.state}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs font-medium border border-white/10">
                  {currentCity.station.split('&')[0]}
                </span>
              </div>

              {/* Bottom Image Overlay Description */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white drop-shadow-md">
                <p className="text-xs sm:text-sm text-slate-200 line-clamp-2">
                  {currentCity.imageAlt}
                </p>
              </div>
            </div>

            {/* Live Snapshot & Quick Action Panel (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Air Quality Index</span>
                    <h3 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                      {currentCity.name}
                    </h3>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${currentLevel.badgeClass}`}>
                    {currentLevel.category}
                  </span>
                </div>

                {/* Big AQI Number Display */}
                <div className="my-6 flex items-baseline gap-4">
                  <div 
                    className="text-6xl sm:text-7xl font-extrabold tracking-tight font-display"
                    style={{ color: currentLevel.color }}
                  >
                    {currentCity.aqi}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-500 block">NAQI Value</span>
                    <span className="text-sm font-semibold text-slate-700">
                      Dominant: <strong className="text-slate-900">{currentCity.dominantPollutant}</strong>
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-500">
                      <span>24h Trend:</span>
                      <span className={(currentCity.trend || '').startsWith('+') ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                        {currentCity.trend || '-2%'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Advisory Snippet */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentLevel.color }}></span>
                    Health Advisory Note
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentLevel.advisory}
                  </p>
                </div>

                {/* Quick Weather Parameters */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">Temperature</span>
                    <span className="text-sm font-bold text-slate-900">{currentCity.temperature}</span>
                  </div>
                  <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">Humidity</span>
                    <span className="text-sm font-bold text-slate-900">{currentCity.humidity}</span>
                  </div>
                  <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">Wind Speed</span>
                    <span className="text-sm font-bold text-slate-900">{(currentCity.wind || '12 km/h NW').split(' ')[0]} km/h</span>
                  </div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/city/${currentCity.id || 'delhi'}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors shadow-sm"
                >
                  <span>Full City Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#current-aqi"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <span>Quick Analysis</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="#live-map"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200/80 font-semibold text-sm hover:bg-slate-200 transition-colors"
                >
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>Map</span>
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
