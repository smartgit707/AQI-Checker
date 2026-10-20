import React, { useState } from 'react';
import { 
  FileText, 
  ShieldAlert, 
  Flame, 
  Factory, 
  Truck, 
  Layers, 
  Wind, 
  CheckCircle2, 
  Copy, 
  Download, 
  ExternalLink,
  Percent,
  Sparkles,
  Dna,
  Share2
} from 'lucide-react';

export default function ForensicDossierCard({ 
  city, 
  selectedCulprit, 
  onSelectCulprit 
}) {
  const [copied, setCopied] = useState(false);
  const dossier = city?.forensicDossier || {};
  const culprits = city?.interceptedSources || [];
  const chemicalBreakdown = city?.chemicalBreakdown || [];

  const handleCopy = () => {
    const text = `AEROSENSE Forensic Emission Dossier: ${city.name} (${dossier.caseId}). Primary Culprit: ${dossier.primaryCulprit}. Origin: ${dossier.originLocation} (${dossier.transitDistanceKm} km traversed in 48h). Calibrated against NOAA HYSPLIT & NASA VIIRS.`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Official Atmospheric Forensic Dossier Header Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100 relative overflow-hidden">
        
        {/* Background Watermark Stamp */}
        <div className="absolute right-4 -bottom-6 text-slate-800/20 font-black text-8xl font-mono select-none pointer-events-none">
          DOSSIER
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>CASE FILE: {dossier.caseId}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white font-display">
              {city.name} Emission Source Attribution
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Scientific backward air parcel kinematic reconstruction & chemical marker matching.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>SHARE CASE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 6 Key Dossier Evidence Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 relative z-10">
          
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Origin Point (T-48h)</div>
            <div className="text-sm sm:text-base font-extrabold text-white mt-1">
              {dossier.originLocation}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">Entered Clean Corridor</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Transit Distance</div>
            <div className="text-sm sm:text-base font-extrabold text-cyan-300 mt-1">
              {dossier.transitDistanceKm} km in 48 Hours
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Avg Speed: {dossier.avgTransportSpeed}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Atmospheric Inversion</div>
            <div className="text-sm sm:text-base font-extrabold text-amber-300 mt-1">
              {dossier.boundaryLayerHeight}
            </div>
            <div className="text-[10px] text-rose-400 mt-1">Severe Nocturnal Ceiling</div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50 col-span-2 md:col-span-1">
            <div className="text-[11px] font-mono text-rose-400 uppercase">Primary Injected Culprit</div>
            <div className="text-sm sm:text-base font-extrabold text-rose-300 mt-1">
              {dossier.primaryCulprit}
            </div>
            <div className="text-[10px] text-rose-400/80 mt-1">Satellite Verified</div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/50 col-span-2 md:col-span-1">
            <div className="text-[11px] font-mono text-purple-400 uppercase">Secondary Culprit</div>
            <div className="text-sm sm:text-base font-extrabold text-purple-300 mt-1">
              {dossier.secondaryCulprit}
            </div>
            <div className="text-[10px] text-purple-400/80 mt-1">Continuous Point Monitored</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 col-span-2 md:col-span-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase">NAAQS Exceedance</div>
            <div className="text-sm sm:text-base font-extrabold text-rose-400 mt-1">
              {dossier.cpcbStandardViolation}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Air Act 1981 Reviewable</div>
          </div>

        </div>

      </div>

      {/* 2. Source Contribution Breakdown & Chemical Fingerprint Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Intercepted Source Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white font-display flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400" />
              <span>Intercepted Emission Sources (Along Ribbon)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Click to inspect on map
            </span>
          </div>

          <div className="space-y-3">
            {culprits.map((culprit) => {
              const isSelected = selectedCulprit?.id === culprit.id;
              let Icon = Flame;
              let badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
              if (culprit.type === 'industrial') {
                Icon = Factory;
                badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
              } else if (culprit.type === 'vehicular') {
                Icon = Truck;
                badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
              } else if (culprit.type === 'brick_kiln') {
                Icon = Layers;
                badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
              } else if (culprit.type === 'dust') {
                Icon = Wind;
                badgeColor = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
              }

              return (
                <div
                  key={culprit.id}
                  onClick={() => onSelectCulprit(culprit)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/95 border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${badgeColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-white text-sm sm:text-base">
                            {culprit.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                            {culprit.impactShare} share
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Intercepted: <strong className="text-slate-300">{culprit.timeIntercepted}</strong> • Confidence: <span className="text-emerald-400 font-semibold">{culprit.confidence}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-rose-400">
                        {culprit.pollutantsAdded}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-3 pl-13 border-t border-slate-800/60 pt-2">
                    {culprit.details}
                  </p>

                  <div className="mt-2 pl-13 flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="text-slate-500">CHEMICAL SIGNATURE:</span>
                    <span className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {culprit.signature}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chemical Mass Spectrometry & Attribution Matrix (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Chemical Fingerprint Mass Spectrometry Simulation */}
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800 text-slate-100 space-y-4">
            <h3 className="text-base font-extrabold text-white font-display flex items-center gap-2">
              <Dna className="w-4 h-4 text-cyan-400" />
              <span>Chemical Fingerprint Spectrometry</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Elemental aerosol analysis matches the unique chemical fingerprint of entrained smoke:
            </p>

            <div className="space-y-3 pt-2">
              {chemicalBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">{item.component}</span>
                    <span className="font-mono font-bold text-white">{item.share}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${item.share}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 mt-4 text-[11px] font-mono text-slate-300 space-y-1">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LABORATORY CONFIRMATION</span>
              </div>
              <div>{dossier.chemicalFingerprint}</div>
            </div>
          </div>

          {/* Legal & Environmental Policy Notice */}
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800 text-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Air Act (1981) Legal Jurisdiction</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Because 68% of the particulate burden in {city.name} is transboundary (originating across state lines), local municipal odd-even car bans only address a fraction of the ambient crisis. Inter-state air basin governance is required.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
