import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  GitCompare, 
  BarChart3,
  BookOpen
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RankingsTable from '../components/rankings/RankingsTable';
import MethodologySection from '../components/analytics/MethodologySection';
import DataSources from '../components/home/DataSources';
import { getAnalyticsDashboard } from '../services/api';
import { buildFallbackAnalytics } from '../utils/analyticsFallback';

export default function RankingsPage() {
  const [dashboard, setDashboard] = useState(() => buildFallbackAnalytics());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Indian City Air Quality Rankings (AQI) — AeroSense';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let active = true;

    async function loadRankings() {
      try {
        setLoading(true);
        const res = await getAnalyticsDashboard();
        if (active && res.data) {
          setDashboard(res.data);
        }
      } catch (err) {
        console.warn('[RankingsPage] Note on live fetch:', err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRankings();
    return () => { active = false; };
  }, []);

  const formattedTime = dashboard.generatedAt 
    ? new Date(dashboard.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Live';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1">
        
        {/* 2. Hero Section */}
        <div className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800 py-12 sm:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-900 to-slate-950 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6 text-xs font-semibold text-slate-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link>
              <span>/</span>
              <span className="text-amber-400">City Rankings</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>National AQI Benchmarks</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
                  Indian Urban Air Quality Rankings
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
                  Comparative national standings ranked from cleanest to most impacted continuous CAAQMS monitoring stations across India.
                </p>
              </div>

              <div className="text-xs text-slate-400 flex flex-col sm:items-end gap-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Telemetry Updated: <strong className="text-white">{formattedTime} IST</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  CPCB NAQI Standard (Lower is Cleaner)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 3. Granular Filterable Rankings Table */}
          <RankingsTable rankings={dashboard.rankings} />

          {/* 4. Methodology Explanation */}
          <MethodologySection />

          {/* 5. Data Sources */}
          <DataSources />

        </div>
      </main>

      <Footer />
    </div>
  );
}
