import React, { useState } from 'react';
import { 
  Clock, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  Droplets, 
  Flame, 
  AlertTriangle, 
  FileText,
  Dna,
  History,
  RotateCcw,
  CheckCircle2,
  Info
} from 'lucide-react';
import { MONUMENTS_DATA } from '../../data/monumentDecayData';

export default function MonumentControls({ 
  selectedMonument, 
  onSelectMonument, 
  activeTimelineIndex, 
  setActiveTimelineIndex,
  onApplyMudPack,
  isMudPackActive,
  mudPackSuccess 
}) {
  const currentTimelineData = selectedMonument?.timeline?.[activeTimelineIndex] || selectedMonument?.timeline?.[0];
  const maxSteps = (selectedMonument?.timeline || []).length - 1;

  return (
    <div className="space-y-8">
      
      {/* 1. Monument Selector & Year Timeline Scrubber */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100 space-y-6">
        
        {/* Monument Switcher Tabs & Mud-Pack Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {MONUMENTS_DATA.map((monument) => {
              const isActive = selectedMonument.id === monument.id;
              return (
                <button
                  key={monument.id}
                  onClick={() => {
                    onSelectMonument(monument);
                    setActiveTimelineIndex(0);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-400/80 shadow-lg shadow-amber-600/30 scale-105'
                      : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {monument.name}
                </button>
              );
            })}
          </div>

          {/* Interactive Archaeological Mud-Pack Application Button */}
          <button
            onClick={onApplyMudPack}
            disabled={isMudPackActive}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xl transition-all border ${
              isMudPackActive 
                ? 'bg-amber-950/80 text-amber-400 border-amber-500/40 cursor-wait'
                : mudPackSuccess
                  ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/40'
                  : 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 border-amber-300 hover:scale-105 active:scale-95'
            }`}
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>
              {isMudPackActive 
                ? 'Applying Clay Mud-Pack...' 
                : mudPackSuccess 
                  ? 'Marble Restored to Pristine White!' 
                  : 'Apply Multani Mitti Mud-Pack'
              }
            </span>
          </button>
        </div>

        {/* Timeline Slider Across Decades (1970 to 2045) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              1970: Pristine White
            </span>
            <span className="text-amber-400 font-bold text-sm bg-slate-950 px-4 py-1.5 rounded-2xl border border-amber-500/40 shadow-inner">
              {currentTimelineData?.label}
            </span>
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              2045: Extreme Acid Decay
            </span>
          </div>

          <input
            type="range"
            min="0"
            max={maxSteps}
            step="1"
            value={activeTimelineIndex}
            onChange={(e) => setActiveTimelineIndex(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
          />

          {/* 4 Decade Clickable Step Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-mono">
            {(selectedMonument?.timeline || []).map((step, idx) => (
              <button
                key={step.year}
                onClick={() => setActiveTimelineIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeTimelineIndex === idx
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 ring-2 ring-amber-400/20 font-bold scale-[1.02]'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="text-sm font-black text-white">{step.year}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{step.status}</div>
                <div className="text-[10px] text-amber-400/80 mt-1">AQI {step.aqiAvg} avg</div>
              </button>
            ))}
          </div>

          {/* Active Era Narrative Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-amber-400">
                SCIENTIFIC ARCHAEOLOGICAL RECORD ({currentTimelineData?.year}):
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {currentTimelineData?.notes}
              </p>
            </div>

            <div className="shrink-0 text-right font-mono bg-slate-900 p-2.5 px-3.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Gypsum Crust Depth</div>
              <div className="text-sm font-extrabold text-rose-400">
                {currentTimelineData?.gypsumCrustThicknessUm} µm
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Chemical Reaction & Gypsum Volume Expansion Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Chemical Degradation Equation (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Dna className="w-4 h-4" />
            <span>CHEMICAL DECAY STOICHIOMETRY</span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white font-display">
            Acid Rain & Sulfur Dioxide Chemical Reaction
          </h3>

          {/* Chemical Formula Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 space-y-2">
            <div className="font-bold text-white">REACTION EQUATION:</div>
            <div className="text-amber-400 font-black text-sm sm:text-base leading-relaxed overflow-x-auto">
              {selectedMonument?.chemicalReaction?.reactants}
            </div>
            <div className="text-slate-500 text-xs">➔ Forms:</div>
            <div className="text-rose-400 font-black text-sm sm:text-base leading-relaxed overflow-x-auto">
              {selectedMonument?.chemicalReaction?.products}
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedMonument?.chemicalReaction?.consequence}
          </p>

          {/* Threat List */}
          <div className="pt-2">
            <div className="text-xs font-mono font-bold text-slate-400 mb-2">PRIMARY EMISSION SOURCES IN AIR BASIN:</div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(selectedMonument?.primaryThreats || []).map((threat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{threat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Archaeological Mud-Pack Conservation Science (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>CONSERVATION SCIENCE</span>
          </div>

          <h3 className="text-lg font-black text-white font-display">
            {selectedMonument?.restorationTechnique?.name}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedMonument?.restorationTechnique?.scientificBasis}
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-slate-400 border-b border-slate-800/80 pb-1.5">
              <span>Cleaning Area:</span>
              <strong className="text-white">{selectedMonument?.restorationTechnique?.annualApplicationArea}</strong>
            </div>
            <div className="flex justify-between items-center text-slate-400 pt-0.5">
              <span>Treatment Lifespan:</span>
              <strong className="text-amber-400">{selectedMonument?.restorationTechnique?.durability}</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/50 text-[11px] text-rose-300 leading-relaxed">
            <strong>Limitation:</strong> Mud-packs only clean the surface; they do not replace the dissolved calcium carbonate lost to atmospheric acid rain.
          </div>
        </div>

      </div>

    </div>
  );
}
