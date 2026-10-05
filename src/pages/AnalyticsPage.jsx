import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, 
  MapPin, 
  Trophy, 
  ArrowRight, 
  Compass, 
  AlertTriangle,
  RefreshCw,
  GitCompare,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AnalyticsHero from '../components/analytics/AnalyticsHero';
import NationalOverviewCards from '../components/analytics/NationalOverviewCards';
import AQIDistributionSection from '../components/analytics/AQIDistributionSection';
import PollutantAnalysisSection from '../components/analytics/PollutantAnalysisSection';
import RegionalAnalysisSection from '../components/analytics/RegionalAnalysisSection';
import EnvironmentalInsightsSection from '../components/analytics/EnvironmentalInsightsSection';
import MethodologySection from '../components/analytics/MethodologySection';
import InteractiveIndiaLeafletMap from '../components/home/InteractiveIndiaLeafletMap';
import DataSources from '../components/home/DataSources';
import { getAnalyticsDashboard, getMapAirQuality } from '../services/api';
import { buildFallbackAnalytics } from '../utils/analyticsFallback';
import { getAQILevel } from '../design-system/aqiTokens';

export default function AnalyticsPage() {
  const navigate = useNavigate();

  // Instant fallback initialization so user never sees a blank screen
  const [dashboard, setDashboard] = useState(() => buildFallbackAnalytics());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapStations, setMapStations] = useState([]);
  const [selectedMapStation, setSelectedMapStation] = useState(null);

  useEffect(() => {
    document.title = 'Pan-India Air Quality Analytics & Pollution Trends — AeroSense';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        const [dashRes, mapRes] = await Promise.all([
          getAnalyticsDashboard(),
          getMapAirQuality()
        ]);

        if (active) {
          if (dashRes.data) setDashboard(dashRes.data);
          if (mapRes.data) setMapStations(mapRes.data);
        }
      } catch (err) {
        if (active) {
          console.warn('[AnalyticsPage] Backend refresh note:', err.message);
          // Resilient: keep fallback dashboard if available
          if (!dashboard) setError('Analytics data temporarily unavailable.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1">
        
        {/* 2. Analytics Hero Header */}
        <AnalyticsHero 
          overview={dashboard.overview} 
          generatedAt={dashboard.generatedAt} 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 3. National Overview Metric Cards */}
          <NationalOverviewCards overview={dashboard.overview} />

          {/* 4. AQI Distribution Categories Spectrum */}
          <AQIDistributionSection 
            distribution={dashboard.distribution} 
            totalCities={dashboard.overview?.totalCities || 16} 
          />

          {/* 5. City Rankings Dual Spotlight Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 my-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>National City Rankings Preview</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Spotlight comparison between India's cleanest urban centers and peak atmospheric burden zones.
                </p>
              </div>

              <Link
                to="/rankings"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors self-start sm:self-auto shadow-xs"
              >
                <span>View Full National Rankings Table</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-6">
              
              {/* Cleanest 5 Spotlight */}
              <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    Cleanest Monitored Urban Centers
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Ascending AQI
                  </span>
                </div>

                <div className="space-y-2.5">
                  {(dashboard.rankings?.cleanest || []).slice(0, 5).map((city, idx) => {
                    const lvl = getAQILevel(city.aqi);
                    return (
                      <div
                        key={city.slug}
                        className="p-3 rounded-xl bg-white border border-emerald-100/80 shadow-xs flex items-center justify-between hover:border-emerald-300 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center font-mono">
                            #{idx + 1}
                          </span>
                          <div>
                            <Link to={`/city/${city.slug}`} className="font-bold text-slate-900 hover:text-emerald-700 text-sm block">
                              {city.name}
                            </Link>
                            <span className="text-[11px] text-slate-400">{city.state}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-base font-black font-display" style={{ color: lvl.color }}>
                              AQI {city.aqi}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {lvl.category}
                            </span>
                          </div>
                          <Link
                            to={`/compare?cities=${city.slug},delhi`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition-colors"
                            title="Compare this city"
                          >
                            <GitCompare className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Peak 5 Spotlight */}
              <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-rose-600" />
                    Highest Atmospheric Burden Centers
                  </span>
                  <span className="text-[11px] font-semibold text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-200">
                    Descending AQI
                  </span>
                </div>

                <div className="space-y-2.5">
                  {(dashboard.rankings?.mostPolluted || []).slice(0, 5).map((city, idx) => {
                    const lvl = getAQILevel(city.aqi);
                    return (
                      <div
                        key={city.slug}
                        className="p-3 rounded-xl bg-white border border-rose-100/80 shadow-xs flex items-center justify-between hover:border-rose-300 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-900 font-black text-xs flex items-center justify-center font-mono">
                            #{idx + 1}
                          </span>
                          <div>
                            <Link to={`/city/${city.slug}`} className="font-bold text-slate-900 hover:text-rose-700 text-sm block">
                              {city.name}
                            </Link>
                            <span className="text-[11px] text-slate-400">{city.state}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-base font-black font-display" style={{ color: lvl.color }}>
                              AQI {city.aqi}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {lvl.category}
                            </span>
                          </div>
                          <Link
                            to={`/compare?cities=${city.slug},bengaluru`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-800 transition-colors"
                            title="Compare this city"
                          >
                            <GitCompare className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* 6. Multi-Pollutant National Concentrations */}
          <PollutantAnalysisSection pollutants={dashboard.pollutants} />

          {/* 7. Macro-Regional Disparities Breakdown */}
          <RegionalAnalysisSection regional={dashboard.regional} />

          {/* 8. Geospatial Pan-India Interactive Map */}
          <div className="my-8 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-600" />
                  <span>Geospatial National Telemetry Map</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Click on any telemetry pin across India to inspect real-time values or add to comparison.
                </p>
              </div>

              {selectedMapStation && (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/city/${selectedMapStation.id || selectedMapStation.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    View {selectedMapStation.name} Profile →
                  </Link>
                  <Link
                    to={`/compare?cities=${selectedMapStation.id || selectedMapStation.slug},delhi`}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
                  >
                    Compare Station
                  </Link>
                </div>
              )}
            </div>

            <InteractiveIndiaLeafletMap
              stations={mapStations}
              onSelectStation={(st) => setSelectedMapStation(st)}
            />
          </div>

          {/* 9. Deterministic Environmental Insights */}
          <EnvironmentalInsightsSection insights={dashboard.insights} />

          {/* 10. Methodology & Mathematical Formulations */}
          <MethodologySection />

          {/* 11. Data Source Transparency */}
          <DataSources />

        </div>
      </main>

      <Footer />
    </div>
  );
}
