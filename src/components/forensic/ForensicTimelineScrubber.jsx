import React, { useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Clock, 
  Navigation, 
  ArrowDown, 
  AlertCircle,
  Wind,
  Layers
} from 'lucide-react';

export default function ForensicTimelineScrubber({ 
  city, 
  activeStepIndex, 
  setActiveStepIndex 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1500); // ms per step

  const trajectory = city?.trajectory || [];
  const maxSteps = trajectory.length - 1;
  const currentStep = trajectory[activeStepIndex] || trajectory[0];

  // Auto-play interval loop
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= maxSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, maxSteps, playbackSpeed, setActiveStepIndex]);

  const handleTogglePlay = () => {
    if (activeStepIndex >= maxSteps) {
      setActiveStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStepIndex(0);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100 space-y-6">
      
      {/* 1. Header with Controls & Time Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 mb-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>48-HOUR KINEMATIC TIMELINE SCRUBBER</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white font-display">
            Rewind Air Mass Journey Back in Time
          </h3>
        </div>

        {/* Playback Controls & Speed Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleTogglePlay}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
              isPlaying 
                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>PAUSE REWIND</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{activeStepIndex >= maxSteps ? 'REPLAY JOURNEY' : 'PLAY 48H REWIND'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Reset to Present (T-0h)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Switcher */}
          <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1 text-[11px] font-mono">
            <button
              onClick={() => setPlaybackSpeed(2000)}
              className={`px-2 py-1 rounded-lg transition-colors ${playbackSpeed === 2000 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              1x
            </button>
            <button
              onClick={() => setPlaybackSpeed(1200)}
              className={`px-2 py-1 rounded-lg transition-colors ${playbackSpeed === 1200 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              2x
            </button>
            <button
              onClick={() => setPlaybackSpeed(600)}
              className={`px-2 py-1 rounded-lg transition-colors ${playbackSpeed === 600 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              4x
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Range Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-rose-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            T-0h: Receptor (Now)
          </span>
          <span className="text-cyan-400 font-bold text-sm bg-slate-950 px-3 py-1 rounded-xl border border-cyan-800/80 shadow-inner">
            ACTIVE: {currentStep?.timeLabel} ({currentStep?.locationName})
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            T-48h: Clean Origin
          </span>
        </div>

        <input
          type="range"
          min="0"
          max={maxSteps}
          step="1"
          value={activeStepIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setActiveStepIndex(Number(e.target.value));
          }}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />

        {/* Step Ticks & Labels */}
        <div className="grid grid-cols-5 sm:grid-cols-9 gap-1 pt-1 text-[10px] font-mono text-center">
          {trajectory.map((step, idx) => (
            <button
              key={step.step}
              onClick={() => {
                setIsPlaying(false);
                setActiveStepIndex(idx);
              }}
              className={`py-1.5 px-1 rounded-lg transition-all ${
                activeStepIndex === idx
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div>{step.timeLabel}</div>
              <div className="text-[9px] text-slate-400 font-normal">{step.altitudeM}m</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Narrative Event Card for Active Step */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400">
              LOCATION AT {currentStep?.timeLabel}:
            </span>
            <span className="text-sm font-extrabold text-white">
              {currentStep?.locationName}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {currentStep?.notes}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right font-mono">
            <div className="text-[10px] text-slate-500 uppercase">Parcel Elevation</div>
            <div className="text-base font-extrabold text-amber-400">{currentStep?.altitudeM} meters</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. Altitude Profile Descent Graphic (Visualizing Thermal Inversion Descent) */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>VERTICAL TROPOSPHERIC DESCENT PROFILE (METERS AGL)</span>
          </span>
          <span className="text-rose-400 text-[11px]">
            Inversion Lid: {city?.forensicDossier?.boundaryLayerHeight}
          </span>
        </div>

        {/* Scaled Bar Visualizer */}
        <div className="h-16 bg-slate-950 rounded-2xl border border-slate-800/80 p-2 flex items-end justify-between gap-1 sm:gap-2 relative overflow-hidden">
          {/* Boundary Layer Line */}
          <div 
            className="absolute left-0 right-0 border-b border-dashed border-rose-500/60 z-10 flex items-center justify-end pr-2 text-[9px] font-mono text-rose-400 pointer-events-none"
            style={{ bottom: '28%' }}
          >
            <span>SMOG INVERSION CEILING (350M)</span>
          </div>

          {trajectory.map((step, idx) => {
            const heightPct = Math.max(12, Math.min(100, (step.altitudeM / 1250) * 100));
            const isCurrent = activeStepIndex === idx;
            return (
              <div 
                key={step.step}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStepIndex(idx);
                }}
              >
                <div 
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-gradient-to-t from-cyan-600 to-cyan-300 ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/50' 
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
                <span className={`text-[9px] font-mono mt-1 ${isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>
                  {step.altitudeM}m
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
