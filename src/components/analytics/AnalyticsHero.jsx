import React from 'react';
import { BarChart3, Clock, Globe2, ShieldCheck, ArrowRight, GitCompare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnalyticsHero({ overview, generatedAt }) {
  const formattedTime = generatedAt 
    ? new Date(generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Live';

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800 py-12 sm:py-16">
      {/* Background Subtle Gradient & Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/25 via-slate-900 to-slate-950 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-emerald-400">National Environmental Analytics</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pan-India Atmospheric Observatory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
              National Air Quality Analytics
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Macro-level atmospheric indices, particulate distributions, and multi-regional environmental telemetry aggregated across continuously monitored Indian urban stations.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Telemetry Synchronized: <strong className="text-white">{formattedTime} IST</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                CPCB NAQI 2026 Standards
              </span>
              <span>•</span>
              <span className="text-slate-300">
                Active Stations: <strong className="text-white">{overview?.totalCities || 16} Urban Hubs</strong>
              </span>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              to="/compare?cities=delhi,mumbai,chennai"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-emerald-900/30 group"
            >
              <GitCompare className="w-4 h-4" />
              <span>Launch City Comparison</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/rankings"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-semibold text-sm transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Explore City Rankings</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
