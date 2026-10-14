import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Wind, 
  Satellite, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  Info, 
  Calendar, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import StubbleFireMap from './StubbleFireMap';
import { 
  SATELLITE_TELEMETRY_META, 
  THERMAL_HOTSPOTS, 
  CORRELATION_TIMELINE, 
  IMPACTED_DOWNWIND_CITIES 
} from '../../data/stubbleFireData';
import { useLanguage } from '../../context/LanguageContext';

export default function StubbleTrackerView() {
  const { currentLang, t } = useLanguage();
  
  const [selectedHotspot, setSelectedHotspot] = useState(THERMAL_HOTSPOTS[0]);
  const [selectedMetric, setSelectedMetric] = useState('both'); // 'both', 'fires', 'aqi'

  // Calculate highest recorded fire day
  const peakFireDay = useMemo(() => {
    return [...CORRELATION_TIMELINE].sort((a, b) => b.fireCount - a.fireCount)[0];
  }, []);

  return (
    <div className="space-y-8">
      
      {/* 1. Header Overview & Live Satellite Stats Bar */}
      <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800/90 text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-500/30 mb-2">
              <Satellite className="w-3.5 h-3.5 text-rose-400" />
              <span>{currentLang === 'hi' ? 'नासा व इसरो उपग्रह टेलीमेट्री' : 'NASA VIIRS & ISRO Satellite Telemetry'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white font-display">
              {currentLang === 'hi' ? 'पराली दहन एवं वायु प्रवाह उपग्रह ट्रैकर' : 'Stubble Burning & Farm Fire Satellite Telemetry'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              {currentLang === 'hi'
                ? 'पंजाब, हरियाणा और पश्चिमी उत्तर प्रदेश में सक्रिय खेत की आग के थर्मल हॉटस्पॉट और भारत-गंगा के मैदान में धुएं के फैलाव की वास्तविक समय मैपिंग।'
                : 'Real-time thermal anomaly clusters across Punjab, Haryana, and Western UP with seasonal north-westerly wind vector streamlines.'}
            </p>
          </div>

          {/* Sync Time Pill */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{currentLang === 'hi' ? 'अंतिम उपग्रह पास:' : 'Last Pass:'} {SATELLITE_TELEMETRY_META.lastPass}</span>
          </div>
        </div>

        {/* 4 Key Sensor Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          
          {/* Card 1: Total 24h Fires */}
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                {currentLang === 'hi' ? '24 घंटे में सक्रिय आग' : 'Active Fires (24h)'}
              </span>
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-display text-rose-300">
              {SATELLITE_TELEMETRY_META.totalActiveFires24h.toLocaleString()}
            </div>
            <div className="text-[11px] text-rose-400/80 mt-1">
              {currentLang === 'hi' ? 'FIRMS थर्मल डिटेक्शन' : 'VIIRS 375m Detection'}
            </div>
          </div>

          {/* Card 2: Punjab Share */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {currentLang === 'hi' ? 'पंजाब हॉटस्पॉट' : 'Punjab Hotspots'}
              </span>
              <span className="text-xs font-bold text-amber-300">68.6%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-display text-amber-300">
              {SATELLITE_TELEMETRY_META.punjabFires.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-400/80 mt-1">
              Sangrur & Firozpur clusters
            </div>
          </div>

          {/* Card 3: Haryana & UP */}
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {currentLang === 'hi' ? 'हरियाणा व प. उप्र' : 'Haryana & West UP'}
              </span>
              <span className="text-xs font-bold text-blue-300">31.4%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-display text-blue-300">
              {(SATELLITE_TELEMETRY_META.haryanaFires + SATELLITE_TELEMETRY_META.upFires).toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-400/80 mt-1">
              Karnal, Kaithal & Meerut
            </div>
          </div>

          {/* Card 4: Stubble Share in NCR PM2.5 */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                {currentLang === 'hi' ? 'दिल्ली PM2.5 में हिस्सा' : 'Delhi PM2.5 Share'}
              </span>
              <Wind className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-display text-purple-300">
              {SATELLITE_TELEMETRY_META.stubbleShareInDelhiPM25}
            </div>
            <div className="text-[11px] text-purple-400/80 mt-1">
              SAFAR / IITM Model Source Split
            </div>
          </div>

        </div>
      </div>

      {/* 2. Interactive Map & Selected District Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Map (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800/90 space-y-4 text-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {currentLang === 'hi' ? 'थर्मल विसंगति और धुआं प्रवाह मानचित्र' : 'Thermal Hotspots & Wind Vector Drift Map'}
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              North-Westerly Jet Corridor (~18 km/h)
            </span>
          </div>

          <StubbleFireMap
            selectedHotspot={selectedHotspot}
            onSelectHotspot={setSelectedHotspot}
          />

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                {currentLang === 'hi'
                  ? 'मानचित्र पर किसी भी आग के केंद्र (लाल वृत्त) पर क्लिक करके विस्तृत उपग्रह डेटा देखें।'
                  : 'Click any burning cluster marker (red pulsating circle) to inspect district-level satellite telemetry.'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Hotspot Inspector & Downwind Cities (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Selected District Telemetry Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                {currentLang === 'hi' ? 'चयनित हॉटस्पॉट' : 'Hotspot Telemetry'}
              </span>
              <span className="text-2xs font-extrabold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                {selectedHotspot.confidence} Confidence
              </span>
            </div>

            <div>
              <h4 className="text-2xl font-black text-white font-display">
                {selectedHotspot.district}
              </h4>
              <p className="text-xs text-slate-400">
                {selectedHotspot.state} • Detected at {selectedHotspot.time}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {currentLang === 'hi' ? 'सक्रिय खेत आग' : 'Active Farm Fires'}
                </span>
                <div className="text-2xl font-black text-rose-400 font-display">
                  {selectedHotspot.fireCount}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {currentLang === 'hi' ? 'विकिरण ऊर्जा' : 'Radiative Power'}
                </span>
                <div className="text-2xl font-black text-amber-400 font-display">
                  {selectedHotspot.frpMW} <span className="text-xs font-normal text-slate-400">MW</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-700/80 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Biomass Residue:</span>
                <span className="font-semibold text-slate-200">{selectedHotspot.crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sensor Sensor:</span>
                <span className="font-semibold text-slate-200">{selectedHotspot.satellite}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coordinates:</span>
                <span className="font-mono text-slate-200">{selectedHotspot.coords[0].toFixed(2)}°N, {selectedHotspot.coords[1].toFixed(2)}°E</span>
              </div>
            </div>
          </div>

          {/* Downwind Smog Inflow Status */}
          <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/90 space-y-4 text-slate-100">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>{currentLang === 'hi' ? 'हवा के रुख में प्रभावित शहर' : 'Downwind Plume Impact'}</span>
            </h4>
            <div className="space-y-2.5">
              {IMPACTED_DOWNWIND_CITIES.slice(0, 4).map((city) => (
                <div key={city.name} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{city.name}</div>
                    <div className="text-[11px] text-slate-400">{city.dominantAerosol}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-extrabold text-rose-400">
                      {city.currentAqi} AQI
                    </span>
                    <span className="block text-[10px] font-bold text-purple-400">
                      +{city.stubbleSharePct}% Stubble
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 3. Daily Farm Fire vs Downwind AQI Correlation Graph */}
      <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800/90 space-y-6 text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-600/30 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLang === 'hi' ? 'कारण-और-प्रभाव विश्लेषण' : 'Cause & Effect Correlation Telemetry'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display">
              {currentLang === 'hi' ? 'खेत की आग बनाम दिल्ली-कानपुर AQI का सहसंबंध' : 'Daily Farm Fires vs. Downwind Delhi & Kanpur AQI Spikes'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {currentLang === 'hi'
                ? 'अक्टूबर के मध्य में जब फसल कटाई के बाद पराली जलाने की घटनाएं 2,000/दिन तक पहुंचती हैं, दिल्ली का AQI 380+ तक उछल जाता है।'
                : 'Notice how Delhi and Kanpur air quality spikes in direct lockstep as daily farm fires surge across northern agricultural belts.'}
            </p>
          </div>

          {/* Metric Selector Pills */}
          <div className="inline-flex p-1 bg-slate-950 rounded-xl text-xs font-bold border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedMetric('both')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedMetric === 'both' ? 'bg-slate-800 text-white shadow-xs font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Both Fires & AQI
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetric('fires')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedMetric === 'fires' ? 'bg-rose-600 text-white shadow-xs font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fires Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetric('aqi')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedMetric === 'aqi' ? 'bg-purple-600 text-white shadow-xs font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AQI Only
            </button>
          </div>
        </div>

        {/* Custom Responsive SVG Chart */}
        <div className="pt-4">
          <div className="relative w-full overflow-x-auto">
            <div className="min-w-[680px] h-64 sm:h-72 flex items-end justify-between gap-3 px-2 pb-8 pt-4 border-b border-slate-800">
              
              {CORRELATION_TIMELINE.map((item, idx) => {
                const maxFires = 2200;
                const fireHeightPct = (item.fireCount / maxFires) * 100;
                const aqiHeightPct = (item.delhiAqi / 450) * 100;
                const isPeak = item.date === peakFireDay.date;

                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    
                    {/* Hover Floating Data Card */}
                    <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/90 backdrop-blur-md border border-slate-700 text-white p-2 rounded-xl text-[10px] z-30 shadow-xl whitespace-nowrap">
                      <div className="font-bold">{item.date}</div>
                      <div className="text-rose-400">🔥 Fires: {item.fireCount}</div>
                      <div className="text-purple-300">🌫️ Delhi AQI: {item.delhiAqi}</div>
                      <div className="text-emerald-400">Share: {item.stubbleContribution}%</div>
                    </div>

                    {/* Dual Column Bars */}
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      
                      {/* Fire Count Bar (Rose) */}
                      {(selectedMetric === 'both' || selectedMetric === 'fires') && (
                        <div
                          style={{ height: `${fireHeightPct}%` }}
                          className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                            isPeak
                              ? 'bg-rose-500 ring-2 ring-rose-400/50 shadow-lg shadow-rose-950/60'
                              : 'bg-rose-600/80 hover:bg-rose-500'
                          }`}
                        />
                      )}

                      {/* Delhi AQI Bar (Purple) */}
                      {(selectedMetric === 'both' || selectedMetric === 'aqi') && (
                        <div
                          style={{ height: `${aqiHeightPct}%` }}
                          className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                            isPeak
                              ? 'bg-purple-600 ring-2 ring-purple-400/50 shadow-lg shadow-purple-950/60'
                              : 'bg-purple-700/80 hover:bg-purple-500'
                          }`}
                        />
                      )}

                    </div>

                    {/* Date Label on Axis */}
                    <span className="text-[10px] font-bold text-slate-400 mt-2 block whitespace-nowrap">
                      {item.date}
                    </span>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
              <span className="text-slate-300">Active Farm Fires Count (VIIRS / MODIS)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-purple-600"></span>
              <span className="text-slate-300">Downwind Delhi NCR Ambient AQI</span>
            </div>
            <div className="text-slate-500">
              *Peak harvest surge: Oct 16 (~2,150 fires & AQI 382)
            </div>
          </div>
        </div>

      </div>

      {/* 4. Indo-Gangetic Trough Topography Explanation */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-700/80">
        <h4 className="text-xl font-extrabold text-white font-display mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{currentLang === 'hi' ? 'भौगोलिक धुंध कटोरा: धुआं क्यों फंसता है?' : 'The Indo-Gangetic Air Basin: Why Does the Smoke Trap?'}</span>
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 max-w-4xl">
          {currentLang === 'hi'
            ? 'उत्तरी भारत का भूगोल एक प्राकृतिक बेसिन जैसा है। उत्तर में ऊँचे हिमालय पर्वत हवा को आगे नहीं जाने देते। अक्टूबर और नवंबर में सर्दी आने पर हवा ठंडी होकर जमीन के करीब जम जाती है (तापमान व्युत्क्रमण)। जब पंजाब और हरियाणा में पराली जलाई जाती है, तो उत्तर-पश्चिमी हवाएं इस धुएं को दिल्ली और उत्तर प्रदेश के इस कटोरे में धकेल देती हैं, जिससे हवा हफ्तों तक जहरीली बनी रहती है।'
            : 'The Indo-Gangetic Plain forms a landlocked atmospheric basin bounded by the Himalayan wall to the north and the Central Indian plateau to the south. During autumn, the Planetary Boundary Layer compresses from ~2,000 meters in summer to under 300 meters, trapping toxic biomass aerosols in a dense ground-level inversion bowl.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">1. Himalayan Wall</span>
            <p className="text-xs text-slate-300">
              Giant northern mountain barriers block smoke from dispersing northward into Central Asia.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">2. Temperature Inversion</span>
            <p className="text-xs text-slate-300">
              Cool autumn nights trap a blanket of cold stagnant air beneath a warmer layer, locking in particulate soot.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">3. North-Westerly Drift</span>
            <p className="text-xs text-slate-300">
              Dominant surface winds channel smoke precisely from Malwa/Majha farming belts straight into Delhi NCR.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
