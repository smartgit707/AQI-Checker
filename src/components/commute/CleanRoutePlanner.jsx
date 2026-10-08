import React, { useState, useMemo } from 'react';
import { 
  Navigation, 
  Leaf, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Footprints, 
  Bike, 
  Car, 
  Train, 
  Compass, 
  Share2, 
  CheckCircle2, 
  Sun, 
  Wind,
  Info,
  Check,
  Zap,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import CleanRouteMap from './CleanRouteMap';
import { 
  COMMUTE_CORRIDORS, 
  TRANSPORT_MODES, 
  DEPARTURE_WINDOWS, 
  calculateInhaledPM25 
} from '../../data/commuteData';
import { useLanguage } from '../../context/LanguageContext';

export default function CleanRoutePlanner({ defaultCorridorId }) {
  const { t, currentLang } = useLanguage();
  
  const [selectedCorridorId, setSelectedCorridorId] = useState(
    defaultCorridorId || COMMUTE_CORRIDORS[0].id
  );
  const [selectedTransportModeId, setSelectedTransportModeId] = useState('car_ac');
  const [selectedRouteKey, setSelectedRouteKey] = useState('clean'); // 'clean' or 'highway'
  const [copiedLink, setCopiedLink] = useState(false);

  const activeCorridor = useMemo(() => {
    return COMMUTE_CORRIDORS.find(c => c.id === selectedCorridorId) || COMMUTE_CORRIDORS[0];
  }, [selectedCorridorId]);

  const activeTransportMode = useMemo(() => {
    return TRANSPORT_MODES.find(m => m.id === selectedTransportModeId) || TRANSPORT_MODES[4];
  }, [selectedTransportModeId]);

  // Compute inhaled PM2.5 for both routes
  const highwayInhalation = useMemo(() => {
    return calculateInhaledPM25(
      activeCorridor.highwayRoute.pm25,
      activeCorridor.highwayRoute.durationMin,
      activeTransportMode
    );
  }, [activeCorridor, activeTransportMode]);

  const cleanInhalation = useMemo(() => {
    return calculateInhaledPM25(
      activeCorridor.cleanRoute.pm25,
      activeCorridor.cleanRoute.durationMin,
      activeTransportMode
    );
  }, [activeCorridor, activeTransportMode]);

  const microgramSavings = Math.max(0, Math.round((highwayInhalation.micrograms - cleanInhalation.micrograms) * 10) / 10);
  const cigaretteSavings = Math.max(0, Math.round((highwayInhalation.cigarettes - cleanInhalation.cigarettes) * 100) / 100);
  const percentSaved = highwayInhalation.micrograms > 0
    ? Math.round((microgramSavings / highwayInhalation.micrograms) * 100)
    : 0;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Corridor Selector Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-2">
              <Navigation className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'स्वच्छ मार्ग नेविगेटर' : 'Eco-Route Microclimate Intelligence'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              {currentLang === 'hi' ? 'दैनिक आवागमन वायु गुणवत्ता योजनाकार' : 'Daily Clean Commute & Route Planner'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentLang === 'hi' 
                ? 'प्रमुख भारतीय शहरों में कम प्रदूषण वाले मार्गों का चयन करके जहरीले कणों के इनहेलेशन को 40-50% तक कम करें।'
                : 'Select urban commuting corridors across major Indian metros to reduce toxic PM2.5 inhalation by up to 50%.'}
            </p>
          </div>

          {/* Quick Share / Export Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{currentLang === 'hi' ? 'लिंक कॉपी हुआ' : 'Link Copied!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentLang === 'hi' ? 'शेयर करें' : 'Share Route'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metro Corridor Selector Buttons */}
        <div className="pt-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            {currentLang === 'hi' ? 'शहरी कॉरिडोर चुनें:' : 'Select Commuter Corridor:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {COMMUTE_CORRIDORS.map((c) => {
              const isSelected = c.id === selectedCorridorId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCorridorId(c.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      {c.city}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      -{c.cleanRoute.exposureReductionPct}% PM2.5
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">
                    {c.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive Route Map & Dual-Route Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Leaflet Route Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {currentLang === 'hi' ? 'भू-स्थानिक मार्ग टेलीमेट्री' : 'Geospatial Route Telemetry'}
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {activeCorridor.city}
            </span>
          </div>

          <CleanRouteMap
            corridor={activeCorridor}
            selectedRouteKey={selectedRouteKey}
            onSelectRoute={setSelectedRouteKey}
          />

          {/* Quick Route Cards Below Map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Recommended Clean Route Card */}
            <div 
              onClick={() => setSelectedRouteKey('clean')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedRouteKey === 'clean'
                  ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  <Leaf className="w-3 h-3 text-emerald-700" />
                  {currentLang === 'hi' ? 'अनुशंसित स्वच्छ मार्ग' : 'Recommended Clean Route'}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {activeCorridor.cleanRoute.aqi} AQI
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                {activeCorridor.cleanRoute.name}
              </h4>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                {activeCorridor.cleanRoute.description}
              </p>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600 pt-2 border-t border-slate-200/60">
                <span>⏱️ {activeCorridor.cleanRoute.durationMin} mins</span>
                <span>•</span>
                <span>📏 {activeCorridor.cleanRoute.distanceKm} km</span>
              </div>
            </div>

            {/* Direct Highway Corridor Card */}
            <div 
              onClick={() => setSelectedRouteKey('highway')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedRouteKey === 'highway'
                  ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md">
                  <ShieldAlert className="w-3 h-3 text-rose-700" />
                  {currentLang === 'hi' ? 'उच्च-उत्सर्जन राजमार्ग' : 'High-Emission Highway'}
                </span>
                <span className="text-xs font-mono font-bold text-rose-700">
                  {activeCorridor.highwayRoute.aqi} AQI
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                {activeCorridor.highwayRoute.name}
              </h4>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                {activeCorridor.highwayRoute.description}
              </p>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600 pt-2 border-t border-slate-200/60">
                <span>⏱️ {activeCorridor.highwayRoute.durationMin} mins</span>
                <span>•</span>
                <span>📏 {activeCorridor.highwayRoute.distanceKm} km</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Inhaled PM2.5 Inhalation Calculator & Transport Mode (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Transport Mode Selector */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/90">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>{currentLang === 'hi' ? 'परिवहन साधन चुनें' : 'Mode of Transit'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {currentLang === 'hi'
                ? 'विभिन्न परिवहन साधनों में श्वसन दर और केबिन फ़िल्टर दक्षता भिन्न होती है।'
                : 'Inhalation volume and barrier cabin filtration vary significantly by transit type.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TRANSPORT_MODES.map((mode) => {
                const isSelected = mode.id === selectedTransportModeId;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedTransportModeId(mode.id)}
                    className={`p-3 rounded-2xl text-center border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex justify-center mb-1 text-emerald-600">
                      {mode.id === 'walking' && <Footprints className="w-5 h-5" />}
                      {mode.id === 'cycling' && <Bike className="w-5 h-5" />}
                      {mode.id === 'two_wheeler' && <Zap className="w-5 h-5" />}
                      {mode.id === 'metro' && <Train className="w-5 h-5" />}
                      {mode.id === 'car_ac' && <Car className="w-5 h-5" />}
                    </div>
                    <div className="text-xs leading-tight">
                      {mode.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mode Specific Advisory Tip */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                <span>{activeTransportMode.name}: {activeTransportMode.ventilationRateLpm} L/min ventilation</span>
              </div>
              <p className="text-slate-500">
                {activeTransportMode.description}
              </p>
              <div className="pt-1 text-emerald-700 font-semibold text-[11px]">
                🛡️ {activeTransportMode.maskRecommendation}
              </div>
            </div>
          </div>

          {/* Inhaled Toxic Particulate Comparison Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/80 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {currentLang === 'hi' ? 'अनुमानित फेफड़ों का एक्सपोजर' : 'Pulmonary Exposure Telemetry'}
              </span>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                -{percentSaved}% {currentLang === 'hi' ? 'कम कण' : 'Fewer Particulates'}
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-white font-display mb-1">
              {currentLang === 'hi' ? 'स्वच्छ मार्ग से आपकी बचत' : 'Clean Route Health Gain'}
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              {currentLang === 'hi'
                ? 'ग्रीनवे मार्ग अपनाने से फेफड़ों में जाने वाले विषैले पीएम2.5 कणों की मात्रा:'
                : 'Taking the Green Parkway Route shields your lungs from heavy micro-particulates:'}
            </p>

            {/* Two Side-by-Side Inhalation Counters */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              
              {/* Highway Inhalation */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-rose-500/30">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                  {currentLang === 'hi' ? 'राजमार्ग पर इनहेल' : 'Highway Route'}
                </span>
                <div className="text-2xl font-black font-display text-white">
                  {highwayInhalation.micrograms} <span className="text-xs font-normal text-slate-400">µg</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  ≈ {highwayInhalation.cigarettes} {currentLang === 'hi' ? 'सिगरेट के बराबर' : 'cigarettes'}
                </div>
              </div>

              {/* Clean Route Inhalation */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  {currentLang === 'hi' ? 'स्वच्छ मार्ग पर इनहेल' : 'Eco-Route'}
                </span>
                <div className="text-2xl font-black font-display text-emerald-400">
                  {cleanInhalation.micrograms} <span className="text-xs font-normal text-emerald-200">µg</span>
                </div>
                <div className="text-[11px] text-emerald-200/80 mt-1">
                  ≈ {cleanInhalation.cigarettes} {currentLang === 'hi' ? 'सिगरेट के बराबर' : 'cigarettes'}
                </div>
              </div>

            </div>

            {/* Big Microgram Savings Banner */}
            <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-300 block">
                  {currentLang === 'hi' ? 'कुल बचाए गए जहरीले कण' : 'Particulate Mass Avoided'}
                </span>
                <span className="text-xs text-slate-300">
                  {currentLang === 'hi' ? 'इस एकल यात्रा में' : 'Per single commute leg'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-400 font-display">
                  +{microgramSavings} µg
                </span>
                <span className="block text-[11px] text-emerald-300/80">
                  ({cigaretteSavings} cigs avoided)
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Diurnal Atmospheric Dispersion & Departure Time Windows */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/70 mb-2">
              <Sun className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'वायुमंडलीय मिश्रण परत' : 'Planetary Boundary Layer Optimizer'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
              {currentLang === 'hi' ? 'सर्वोत्तम प्रस्थान समय खिड़की' : 'Optimal Departure Windows throughout the Day'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {currentLang === 'hi'
                ? 'सूरज की रोशनी और तापमान के अनुसार हवा का फैलाव बदलता है। जाने से पहले सबसे स्वच्छ समय चुनें।'
                : 'Solar heating lifts the ground smog inversion. Plan departures when atmospheric dispersion is peak.'}
            </p>
          </div>
        </div>

        {/* Departure Window Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DEPARTURE_WINDOWS.map((win) => {
            const isClean = win.rating === 'Cleanest' || win.rating === 'Good';
            return (
              <div
                key={win.time}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isClean
                    ? 'border-emerald-300 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="text-sm font-extrabold text-slate-900 mb-1">
                  {win.time}
                </div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-2 ${
                    isClean
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {win.status}
                </span>
                <div className="text-[11px] text-slate-600 font-medium leading-tight line-clamp-2">
                  {win.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
