import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ForensicPlumeMap from '../components/forensic/ForensicPlumeMap';
import ForensicTimelineScrubber from '../components/forensic/ForensicTimelineScrubber';
import ForensicDossierCard from '../components/forensic/ForensicDossierCard';
import { FORENSIC_CITIES } from '../data/forensicPlumeData';
import { useLanguage } from '../context/LanguageContext';
import { 
  Radio, 
  Wind, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  Satellite, 
  Cpu, 
  FileText,
  Search,
  Sparkles,
  Info
} from 'lucide-react';

export default function ForensicTracerPage() {
  const { t, currentLang } = useLanguage();
  const [selectedCity, setSelectedCity] = useState(FORENSIC_CITIES[0]); // Default to Delhi-NCR
  const [activeStepIndex, setActiveStepIndex] = useState(0); // 0 = T-0h (Now)
  const [selectedCulprit, setSelectedCulprit] = useState(null);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setActiveStepIndex(0);
    setSelectedCulprit(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      
      {/* Dynamic Ambient Atmospheric Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 right-1/4 w-[750px] h-[750px] bg-cyan-600/10 rounded-full blur-[180px]" />
        <div className="absolute top-1/2 -left-40 w-[650px] h-[650px] bg-rose-600/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* 1. Global Navigation (Dark Variant) */}
      <Navbar variant="dark" />

      <main className="flex-1 py-10 sm:py-14 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Page Hero Header */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/50">
              <Satellite className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>FORENSIC SATELLITE & KINEMATIC EMISSION ATTRIBUTION</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-display">
              Who Polluted My Air Today?
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Reversing wind vectors across India to answer the ultimate question: 
              <strong className="text-white"> where did the toxic air mass in your lungs come from over the past 48 hours</strong>, which factories and farm fires did it intercept, and who is legally responsible?
            </p>

            {/* City Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {FORENSIC_CITIES.map((city) => {
                const isActive = selectedCity.id === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => handleCityChange(city)}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-cyan-400/80 shadow-lg shadow-cyan-600/30 scale-105'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{city.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${city.currentAqi > 300 ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'}`}>
                      AQI {city.currentAqi}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Main Interactive Forensic Map Section */}
          <div className="space-y-4">
            <ForensicPlumeMap
              city={selectedCity}
              activeStepIndex={activeStepIndex}
              onSelectCulprit={(culprit) => setSelectedCulprit(culprit)}
              selectedCulprit={selectedCulprit}
            />
          </div>

          {/* 3. 48-Hour Kinematic Timeline Scrubber & Altitude Profile */}
          <ForensicTimelineScrubber
            city={selectedCity}
            activeStepIndex={activeStepIndex}
            setActiveStepIndex={setActiveStepIndex}
          />

          {/* 4. Official Forensic Emission Attribution Dossier & Chemical Fingerprint */}
          <ForensicDossierCard
            city={selectedCity}
            selectedCulprit={selectedCulprit}
            onSelectCulprit={(culprit) => setSelectedCulprit(culprit)}
          />

          {/* 5. Scientific Methodology & Mathematical Foundation */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 text-slate-100">
            <h3 className="text-xl font-extrabold text-white font-display mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              <span>How Backward Atmospheric Trajectory Modeling Works</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="text-sm font-bold text-white">Kinematic Wind Reversal (NOAA HYSPLIT)</h4>
                <p>
                  Instead of forecasting forward where smoke will blow, the model performs a 4D kinematic integration backwards in time using ERA5 3-dimensional horizontal and vertical wind field vectors.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-950 text-purple-300 border border-purple-800 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="text-sm font-bold text-white">Planetary Boundary Layer (PBL) Entrainment</h4>
                <p>
                  Calculates whether the air parcel stayed above the inversion ceiling or descended into the boundary layer where surface emissions (stubble fires, power plants, truck corridors) were actively trapped.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-950 text-rose-300 border border-rose-800 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="text-sm font-bold text-white">Source Fingerprint Mass Spectrometry</h4>
                <p>
                  Correlates satellite-detected thermal fires (VIIRS 375m) and industrial stack locations along the air ribbon with specific chemical markers: Levoglucosan (biomass), Sulfates (coal), and Black Carbon (diesel).
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Global Product Footer */}
      <Footer />

    </div>
  );
}
