import React from 'react';
import { Wind } from 'lucide-react';

export default function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-fadeIn" role="status" aria-live="polite">
      <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 border border-emerald-200 flex items-center justify-center mb-4">
        <Wind className="w-7 h-7 text-emerald-600 animate-pulse" />
      </div>
      <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3" />
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Loading Atmospheric Telemetry...
      </p>
      <span className="sr-only">Loading page content</span>
    </div>
  );
}
