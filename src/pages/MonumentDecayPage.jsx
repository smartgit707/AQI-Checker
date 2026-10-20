import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MonumentDecay3D from '../components/monuments/MonumentDecay3D';
import MonumentControls from '../components/monuments/MonumentControls';
import { MONUMENTS_DATA } from '../data/monumentDecayData';
import { useLanguage } from '../context/LanguageContext';
import { 
  History, 
  Landmark, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  Droplets, 
  Scale, 
  Info,
  ExternalLink
} from 'lucide-react';

export default function MonumentDecayPage() {
  const { t, currentLang } = useLanguage();
  const [selectedMonument, setSelectedMonument] = useState(MONUMENTS_DATA[0]); // Default to Taj Mahal
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(2); // Default to 2024
  const [isMudPackActive, setIsMudPackActive] = useState(false);
  const [mudPackSuccess, setMudPackSuccess] = useState(false);

  const handleApplyMudPack = () => {
    setIsMudPackActive(true);
    setMudPackSuccess(false);
  };

  const handleMudPackComplete = () => {
    setIsMudPackActive(false);
    setMudPackSuccess(true);
    setActiveTimelineIndex(0); // Reset timeline to 1970 (pristine)
    setTimeout(() => setMudPackSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 relative selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      
      {/* Dynamic Ambient Atmospheric Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 right-1/4 w-[750px] h-[750px] bg-amber-600/10 rounded-full blur-[180px]" />
        <div className="absolute top-1/2 -left-32 w-[650px] h-[650px] bg-rose-600/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[150px]" />
      </div>

      {/* 1. Global Navigation (Dark Variant) */}
      <Navbar variant="dark" />

      <main className="flex-1 py-10 sm:py-14 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Page Hero Header */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-950/50">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>INTERACTIVE 3D ARCHITECTURAL EROSION SIMULATOR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-display">
              The Acid & Soot Sculptor
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Simulating the slow-motion destruction of India's iconic heritage monuments. 
              Watch <strong className="text-white">white Makrana marble yellow and dissolve into gypsum crust</strong> under acid rain ($H_2SO_4$) and diesel soot from 1970 to 2045, and apply virtual archaeological mud-pack restorations.
            </p>
          </div>

          {/* 2. Interactive 3D WebGL Monument Canvas */}
          <MonumentDecay3D
            monument={selectedMonument}
            activeTimelineIndex={activeTimelineIndex}
            isMudPackActive={isMudPackActive}
            onMudPackComplete={handleMudPackComplete}
          />

          {/* 3. Timeline Scrubber & Chemical Reaction Controls */}
          <MonumentControls
            selectedMonument={selectedMonument}
            onSelectMonument={(m) => {
              setSelectedMonument(m);
              setActiveTimelineIndex(2);
            }}
            activeTimelineIndex={activeTimelineIndex}
            setActiveTimelineIndex={setActiveTimelineIndex}
            onApplyMudPack={handleApplyMudPack}
            isMudPackActive={isMudPackActive}
            mudPackSuccess={mudPackSuccess}
          />

          {/* 4. Supreme Court Taj Trapezium Zone (TTZ) Historical Environmental Jurisprudence */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 text-slate-100 space-y-6">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Scale className="w-4 h-4" />
              <span>JUDICIAL HISTORY & POLICY PRECEDENT</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-display">
              The Taj Trapezium Zone (TTZ) & Landmark Environmental Litigation
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In December 1996, the Supreme Court of India delivered a historic ruling in <strong className="text-white">M.C. Mehta v. Union of India (AIR 1997 SC 734)</strong>, recognizing that acid emissions from Mathura Refinery, Firozabad glass units, and 292 coal foundries were actively eating away the marble dome of the Taj Mahal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-950 text-amber-300 border border-amber-800 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="text-sm font-bold text-white">10,400 km² Protected Buffer</h4>
                <p>
                  Established the Taj Trapezium Zone (TTZ), encompassing Agra, Firozabad, Mathura, Hathras, Etah, and Bharatpur, banning coal combustion within the geographical perimeter.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="text-sm font-bold text-white">Mandatory Natural Gas (CNG)</h4>
                <p>
                  Forced 292 industrial units to either switch immediately to clean natural gas or relocate outside the air shed, dramatically curbing direct local sulfur dioxide emissions.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-950 text-rose-300 border border-rose-800 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="text-sm font-bold text-white">The Ongoing Regional Battle</h4>
                <p>
                  Despite the TTZ ban, transboundary agricultural stubble burning and heavy diesel highway emissions across the Indo-Gangetic basin continue to deposit brown carbon tar onto the marble.
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
