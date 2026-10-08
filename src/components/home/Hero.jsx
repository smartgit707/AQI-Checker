import React from 'react';
import { Compass, ShieldCheck, Activity, ChevronRight, Wind, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LocationSearch from '../common/LocationSearch';
import OptimizedImage from '../common/OptimizedImage';
import { IMAGES } from '../../data/images';
import { getAQILevel } from '../../design-system/aqiTokens';
import { useLanguage } from '../../context/LanguageContext';

export default function Hero({ onSelectCity, currentCity }) {
  const city = currentCity || {};
  const currentLevel = getAQILevel(city.aqi ?? 50) || {};
  const { t } = useLanguage();

  const categoryStr = currentLevel.category || 'Moderate';
  const categoryKey = categoryStr.toLowerCase();
  const trendStr = typeof city.trend === 'string' ? city.trend : String(city.trend || '-2%');
  const isTrendUp = trendStr.startsWith('+');
  const windStr = typeof city.wind === 'string' ? city.wind : (city.wind?.speed ? `${city.wind.speed} km/h` : '12 km/h NW');
  const windSpeedVal = windStr.split(' ')[0] || '12';

  return (
    <section className="relative pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 overflow-hidden border-b border-slate-200/60">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50/50 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Editorial Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs text-xs font-medium text-slate-700">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-emerald-800">{t('hero.badgeNetwork', 'CPCB & Sensor Network')}</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>{t('hero.badgeLive', 'Real-time Pan-India Ambient Air Monitoring')}</span>
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.18]">
            {t('hero.headlinePrefix', 'Understand the')}{' '}
            <span className="text-emerald-700 relative inline-block">
              {t('hero.headlineHighlight', 'air you breathe')}
              <svg className="absolute -bottom-2 left-0 w-full h-2 text-emerald-300 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="6" fill="none" />
              </svg>
            </span>{' '}
            {t('hero.headlineSuffix', 'with precision.')}
          </h1>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle', 'Real-time air quality metrics, pollutant breakdown, atmospheric trends, and actionable health guidance for cities across India.')}
          </p>
        </div>

        {/* Location Search Box */}
        <div className="mb-12 sm:mb-16">
          <LocationSearch onSelectCity={onSelectCity} currentCityId={currentCity.id} />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t('hero.featureStandards', 'Calibrated NAQI Standards')}
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              {t('hero.featureTelemetry', 'Sub-Hour Telemetry Refresh')}
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-blue-600" />
              {t('hero.featureBreakdown', 'Multi-Pollutant Particulate Breakdown')}
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
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('hero.liveAqi', 'Live Air Quality Index')}</span>
                    <h3 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                      {city.name || 'City'}
                    </h3>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${currentLevel.badgeClass || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {t(`aqi.${categoryKey}`, categoryStr)}
                  </span>
                </div>

                {/* Big AQI Number Display */}
                <div className="my-6 flex items-baseline gap-4">
                  <div 
                    className="text-6xl sm:text-7xl font-extrabold tracking-tight font-display"
                    style={{ color: currentLevel.color || '#10b981' }}
                  >
                    {city.aqi ?? 50}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-500 block">{t('hero.naqiScore', 'NAQI Value')}</span>
                    <span className="text-sm font-semibold text-slate-700">
                      {t('hero.dominant', 'Dominant')}: <strong className="text-slate-900">{city.dominantPollutant || 'PM2.5'}</strong>
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-500">
                      <span>{t('hero.trend24h', '24h Trend')}:</span>
                      <span className={isTrendUp ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                        {trendStr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Advisory Snippet */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentLevel.color || '#10b981' }}></span>
                    {t('hero.healthAdvisory', 'Health Advisory Note')}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentLevel.advisory || 'Standard ambient air conditions observed.'}
                  </p>
                </div>

                {/* Quick Weather Parameters */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">{t('hero.temperature', 'Temperature')}</span>
                    <span className="text-sm font-bold text-slate-900">{city.temperature || '28°C'}</span>
                  </div>
                  <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">{t('hero.humidity', 'Humidity')}</span>
                    <span className="text-sm font-bold text-slate-900">{city.humidity || '60%'}</span>
                  </div>
                  <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">{t('hero.windSpeed', 'Wind Speed')}</span>
                    <span className="text-sm font-bold text-slate-900">{windSpeedVal} km/h</span>
                  </div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/city/${currentCity.id || 'delhi'}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-xs"
                >
                  <span>{t('hero.fullProfile', 'Full City Profile')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#current-aqi"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
                >
                  <span>{t('hero.sensorTelemetry', 'Sensor Telemetry')}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
