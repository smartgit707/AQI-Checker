import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  generateVoiceBriefingScript,
  playSpeechBulletin,
  pauseSpeechBulletin,
  resumeSpeechBulletin,
  stopSpeechBulletin
} from '../../services/voiceBriefingService';

/**
 * AudioBriefingPlayer
 * Interactive, client-side AI Voice Air Quality Bulletin player.
 * Supports Play / Pause / Stop, animated equalizer soundwave, and collapsible transcript.
 *
 * @param {Object} props
 * @param {Object} props.city - Active city object
 * @param {string} [props.variant='card'] - 'card' (full styled card) | 'compact' (inline button/capsule)
 * @param {string} [props.className=''] - Additional class names
 */
export default function AudioBriefingPlayer({ city, variant = 'card', className = '' }) {
  const { currentLang, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [isSupported, setIsSupported] = useState(true);

  // Keep ref to current city & lang to regenerate script if changed
  const script = generateVoiceBriefingScript(city, currentLang);

  // Check speech synthesis support
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  // Cleanup speech on unmount or city change
  useEffect(() => {
    return () => {
      stopSpeechBulletin();
    };
  }, [city?.name, currentLang]);

  const handlePlayToggle = () => {
    if (!isSupported) return;

    if (isPlaying) {
      if (isPaused) {
        resumeSpeechBulletin();
        setIsPaused(false);
      } else {
        pauseSpeechBulletin();
        setIsPaused(true);
      }
    } else {
      // Start fresh
      setIsPlaying(true);
      setIsPaused(false);
      setActiveWordIndex(0);

      playSpeechBulletin(script, currentLang, {
        onStart: () => {
          setIsPlaying(true);
          setIsPaused(false);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setActiveWordIndex(-1);
        },
        onError: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setActiveWordIndex(-1);
        },
        onBoundary: (e) => {
          if (e.name === 'word') {
            setActiveWordIndex(e.charIndex);
          }
        }
      });
    }
  };

  const handleStop = (e) => {
    e?.stopPropagation();
    stopSpeechBulletin();
    setIsPlaying(false);
    setIsPaused(false);
    setActiveWordIndex(-1);
  };

  if (!isSupported) {
    return null;
  }

  // COMPACT CAPSULE VARIANT (for Hero snapshot or compact headers)
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={handlePlayToggle}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
            isPlaying && !isPaused
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-1 animate-pulse'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80'
          }`}
          title={isPlaying ? (isPaused ? 'Resume briefing' : 'Pause briefing') : 'Listen to AI Voice Briefing'}
        >
          {isPlaying && !isPaused ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          )}
          <span>
            {isPlaying
              ? isPaused
                ? currentLang === 'hi' ? 'फिर से शुरू करें' : 'Resume Briefing'
                : currentLang === 'hi' ? 'चल रहा है...' : 'Playing Briefing...'
              : currentLang === 'hi' ? '🎙️ बुलेटिन सुनें' : '🎙️ Listen to Briefing'}
          </span>
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={handleStop}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors"
            title="Stop playback"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        )}
      </div>
    );
  }

  // FULL CARD VARIANT (for Hero or Dashboards)
  return (
    <div className={`rounded-2xl p-4 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border border-emerald-200/80 shadow-xs relative overflow-hidden ${className}`}>
      {/* Background Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1">
                {currentLang === 'hi' ? 'दैनिक वायु गुणवत्ता बुलेटिन' : 'Daily Atmospheric Audio Briefing'}
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
              </h4>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                {currentLang === 'hi' ? 'हिन्दी Voice' : 'AI Voice'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              {currentLang === 'hi'
                ? `${city?.name || 'शहर'} की हवा और स्वास्थ्य सलाह सुनें`
                : `Instant audio recap for ${city?.name || 'your city'}`}
            </p>
          </div>
        </div>

        {/* Player Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {isPlaying && (
            <button
              type="button"
              onClick={handleStop}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-600 transition-colors shadow-2xs"
              title="Stop playback"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          <button
            type="button"
            onClick={handlePlayToggle}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all ${
              isPlaying && !isPaused
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400 ring-offset-1'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{currentLang === 'hi' ? 'रोकें' : 'Pause'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {isPlaying && isPaused
                    ? currentLang === 'hi' ? 'फिर से शुरू करें' : 'Resume'
                    : currentLang === 'hi' ? 'सुनें' : 'Listen'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Animated Equalizer Soundwave Bars (when playing) */}
      {isPlaying && (
        <div className="mt-3.5 pt-3 border-t border-emerald-200/50 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-1.5 h-4">
            <span className={`w-1 bg-emerald-600 rounded-full transition-all duration-300 ${!isPaused ? 'h-4 animate-bounce' : 'h-1.5'}`} style={{ animationDelay: '0ms' }} />
            <span className={`w-1 bg-emerald-500 rounded-full transition-all duration-300 ${!isPaused ? 'h-3 animate-bounce' : 'h-2'}`} style={{ animationDelay: '150ms' }} />
            <span className={`w-1 bg-teal-500 rounded-full transition-all duration-300 ${!isPaused ? 'h-4 animate-bounce' : 'h-1.5'}`} style={{ animationDelay: '300ms' }} />
            <span className={`w-1 bg-emerald-400 rounded-full transition-all duration-300 ${!isPaused ? 'h-2 animate-bounce' : 'h-2'}`} style={{ animationDelay: '75ms' }} />
            <span className={`w-1 bg-teal-600 rounded-full transition-all duration-300 ${!isPaused ? 'h-3.5 animate-bounce' : 'h-1.5'}`} style={{ animationDelay: '220ms' }} />
            <span className="text-[11px] font-semibold text-emerald-900 ml-1.5">
              {isPaused
                ? currentLang === 'hi' ? 'ऑडियो रुका हुआ है' : 'Audio paused'
                : currentLang === 'hi' ? 'ऑडियो बुलेटिन सक्रिय है...' : 'Narrating live atmospheric bulletin...'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowTranscript((prev) => !prev)}
            className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 transition-colors"
          >
            <span>{showTranscript ? (currentLang === 'hi' ? 'छुपाएं' : 'Hide Script') : (currentLang === 'hi' ? 'स्क्रिप्ट देखें' : 'View Script')}</span>
            {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      )}

      {/* Spoken Script / Transcript Accordion */}
      {showTranscript && (
        <div className="mt-2.5 p-3 rounded-xl bg-white/90 border border-emerald-200/70 text-xs text-slate-700 leading-relaxed font-normal shadow-inner">
          <p className="italic text-slate-800">
            "{script}"
          </p>
        </div>
      )}
    </div>
  );
}
