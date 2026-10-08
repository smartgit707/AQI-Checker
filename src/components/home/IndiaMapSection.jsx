import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Layers, 
  Info, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw,
  Radio,
  Map as MapIcon
} from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import InteractiveIndiaLeafletMap from './InteractiveIndiaLeafletMap';
import { getMapAirQuality } from '../../services/api';
import { CITIES_DATA, TOP_POLLUTED, CLEANEST_CITIES } from '../../data/mockData';
import { getAQILevel, AQI_LEVELS } from '../../design-system/aqiTokens';
import { useLanguage } from '../../context/LanguageContext';

export default function IndiaMapSection({ onSelectCity, selectedCity }) {
  const { t, currentLang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all'); // all, unhealthy, good
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiveMap, setIsLiveMap] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadMapData() {
      try {
        setLoading(true);
        const res = await getMapAirQuality();
        if (mounted && res.data && res.data.length > 0) {
          setStations(res.data);
          setIsLiveMap(true);
        }
      } catch (err) {
        if (mounted) {
          // Fallback to local coordinate nodes
          const mapped = CITIES_DATA.map(c => ({
            id: c.id,
            name: c.name,
            state: c.state,
            coordinates: { lat: c.coordinates.lat, lng: c.coordinates.lng },
            aqi: c.aqi,
            category: c.status,
            dominantPollutant: c.dominantPollutant,
            temperature: c.temperature,
            station: c.station,
            isLive: false
          }));
          setStations(mapped);
          setIsLiveMap(false);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMapData();
    return () => { mounted = false; };
  }, []);

  const filteredStations = stations.filter(s => {
    if (activeFilter === 'unhealthy') return s.aqi > 150;
    if (activeFilter === 'good') return s.aqi <= 50;
    return true;
  });

  // Calculate dynamic top polluted and cleanest from current stations list
  const sortedByPollution = [...stations].sort((a, b) => b.aqi - a.aqi);
  const topPollutedList = sortedByPollution.slice(0, 5);
  const cleanestList = [...stations].sort((a, b) => a.aqi - b.aqi).slice(0, 5);

  return (
    <section id="live-map" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge={t('map.badge', 'Geospatial Telemetry')}
          title={t('map.title', 'Air Quality Across India')}
          subtitle={t('map.subtitle', 'Continuous spatial interpolation and telemetry stations monitoring ambient atmospheric pollution across states.')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Interactive Map Canvas (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 relative overflow-hidden">
            
            {/* Map Controls Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('map.filterStations', 'Filter Stations:')}
                </span>
                <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all ${activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {t('map.allMonitored', 'All Monitored')} ({stations.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter('unhealthy')}
                    className={`px-3 py-1 rounded-lg transition-all ${activeFilter === 'unhealthy' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {t('map.critical', 'Critical (>150)')}
                  </button>
                  <button
                    onClick={() => setActiveFilter('good')}
                    className={`px-3 py-1 rounded-lg transition-all ${activeFilter === 'good' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {t('map.cleanAir', 'Clean Air (≤50)')}
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isLiveMap ? t('map.liveModel', 'Live CAMS Model Interpolation') : t('map.demoTelemetry', 'Demonstration Telemetry')}</span>
              </div>
            </div>

            {/* Real Interactive Leaflet Map */}
            <div className="my-4">
              <InteractiveIndiaLeafletMap
                stations={filteredStations}
                selectedCity={selectedCity}
                onSelectStation={(st) => {
                  onSelectCity(st);
                  const el = document.getElementById('current-aqi');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>

            {/* Standard NAQI Legend Scale Bar */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                {t('map.scaleBar', 'CPCB National AQI Index Scale')}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {AQI_LEVELS.map((lvl) => (
                  <div key={lvl.category} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lvl.color }}></span>
                      <span className="text-xs font-bold text-slate-800">
                        {t(`aqi.${lvl.category.toLowerCase()}`, lvl.category)}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {lvl.min} – {lvl.max}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Rankings & Insights (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Top Critical / Polluted Cities */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/90">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-display flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>{currentLang === 'hi' ? 'उच्च जोखिम वाले शहर' : 'Elevated Pollution Zones'}</span>
                </h3>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  {currentLang === 'hi' ? 'गंभीर' : 'Critical'}
                </span>
              </div>

              <div className="space-y-2.5">
                {(topPollutedList.length > 0 ? topPollutedList : TOP_POLLUTED).map((item, idx) => {
                  const lvl = getAQILevel(item.aqi);
                  return (
                    <div 
                      key={item.name || item.city} 
                      onClick={() => onSelectCity(item)}
                      className="p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center text-xs font-black text-slate-400">
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">{item.name || item.city}</span>
                          <span className="text-[11px] text-slate-500">{item.state}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black font-display block" style={{ color: lvl.color }}>
                          {item.aqi}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {lvl.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cleanest Air Enclaves */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/90">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{currentLang === 'hi' ? 'सर्वाधिक स्वच्छ हवा वाले शहर' : 'Cleanest Air Enclaves'}</span>
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {currentLang === 'hi' ? 'उत्तम स्थिति' : 'Optimal'}
                </span>
              </div>

              <div className="space-y-2.5">
                {(cleanestList.length > 0 ? cleanestList : CLEANEST_CITIES).map((item, idx) => {
                  const lvl = getAQILevel(item.aqi);
                  return (
                    <div 
                      key={item.name || item.city} 
                      onClick={() => onSelectCity(item)}
                      className="p-3 rounded-2xl bg-emerald-50/40 hover:bg-emerald-50/80 border border-emerald-100/70 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center text-xs font-black text-emerald-600/70">
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">{item.name || item.city}</span>
                          <span className="text-[11px] text-slate-500">{item.state}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black font-display block" style={{ color: lvl.color }}>
                          {item.aqi}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">
                          {lvl.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
