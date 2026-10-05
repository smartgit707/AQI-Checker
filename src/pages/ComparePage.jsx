import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  GitCompare, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  TrendingDown,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CompareHero from '../components/compare/CompareHero';
import CitySelector from '../components/compare/CitySelector';
import ComparisonMetricsTable from '../components/compare/ComparisonMetricsTable';
import PollutantComparisonChart from '../components/compare/PollutantComparisonChart';
import HistoricalComparisonChart from '../components/compare/HistoricalComparisonChart';
import DataSources from '../components/home/DataSources';
import { compareCitiesApi, getCities } from '../services/api';
import { buildFallbackComparison } from '../utils/analyticsFallback';
import { CITIES_DATA } from '../data/mockData';

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get cities from URL query param: ?cities=delhi,mumbai,chennai
  const citiesQuery = searchParams.get('cities');
  const initialSlugs = citiesQuery 
    ? citiesQuery.split(',').map(s => s.trim().toLowerCase()).filter(Boolean).slice(0, 4)
    : ['delhi', 'mumbai', 'bengaluru'];

  const [selectedSlugs, setSelectedSlugs] = useState(
    initialSlugs.length >= 2 ? initialSlugs : ['delhi', 'mumbai']
  );
  const [period, setPeriod] = useState('7d');

  // Instant fallback state to ensure 0s blank screen
  const [comparisonData, setComparisonData] = useState(() => 
    buildFallbackComparison(initialSlugs.length >= 2 ? initialSlugs : ['delhi', 'mumbai'], '7d')
  );
  const [loading, setLoading] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [notice, setNotice] = useState(null);

  // Synchronize URL when selectedSlugs changes
  useEffect(() => {
    setSearchParams({ cities: selectedSlugs.join(',') });
  }, [selectedSlugs, setSearchParams]);

  // Load available city registry for autocomplete
  useEffect(() => {
    getCities({ limit: 50 })
      .then(res => {
        if (res.data) setAvailableCities(res.data);
      })
      .catch(() => {});
  }, []);

  // Fetch live comparison from backend
  useEffect(() => {
    if (selectedSlugs.length < 2) return;

    let active = true;

    async function fetchComparison() {
      try {
        setLoading(true);
        const res = await compareCitiesApi(selectedSlugs, period);
        if (active && res.data) {
          setComparisonData(res.data);
          document.title = `Compare ${res.data.cities.map(c => c.city.name).join(' vs ')} — AeroSense`;
        }
      } catch (err) {
        if (active) {
          console.warn('[ComparePage] Live compare fallback:', err.message);
          // Graceful fallback to local dataset
          setComparisonData(buildFallbackComparison(selectedSlugs, period));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchComparison();
    return () => { active = false; };
  }, [selectedSlugs, period]);

  // Add City Handler
  const handleAddCity = (slug) => {
    if (selectedSlugs.includes(slug)) {
      setNotice(`"${slug}" is already included in the comparison.`);
      setTimeout(() => setNotice(null), 3000);
      return;
    }
    if (selectedSlugs.length >= 4) {
      setNotice('Comparison allows up to 4 cities at a time.');
      setTimeout(() => setNotice(null), 3000);
      return;
    }
    setSelectedSlugs([...selectedSlugs, slug]);
  };

  // Remove City Handler
  const handleRemoveCity = (slug) => {
    if (selectedSlugs.length <= 2) {
      setNotice('A minimum of 2 cities is required for side-by-side comparison.');
      setTimeout(() => setNotice(null), 3000);
      return;
    }
    setSelectedSlugs(selectedSlugs.filter(s => s !== slug));
  };

  // Preset Handler
  const handleApplyPreset = (presetSlugs) => {
    setSelectedSlugs(presetSlugs);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1">
        
        {/* 2. Comparison Hero */}
        <CompareHero 
          cities={comparisonData.cities} 
          generatedAt={comparisonData.generatedAt} 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Polite Notification Toast */}
          {notice && (
            <div className="my-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>{notice}</span>
              </div>
              <button 
                onClick={() => setNotice(null)}
                className="text-amber-700 hover:text-amber-950 font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 3. City Selection & Search Bar */}
          <CitySelector
            selectedSlugs={selectedSlugs}
            onAddCity={handleAddCity}
            onRemoveCity={handleRemoveCity}
            onApplyPreset={handleApplyPreset}
            availableCities={availableCities}
          />

          {/* 4. Comparative Environmental Verdict Highlight */}
          {comparisonData.summary && (
            <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 my-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Comparative Environmental Summary
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <strong>{comparisonData.summary.cleanestCity}</strong> exhibits superior atmospheric quality, recording <strong>{comparisonData.summary.aqiSpread} fewer AQI points</strong> than <strong>{comparisonData.summary.mostPollutedCity}</strong> among the selected set.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-900 shadow-xs">
                  Spread: Δ {comparisonData.summary.aqiSpread} AQI
                </span>
              </div>
            </div>
          )}

          {/* 5. Comprehensive Metric Matrix Side-by-Side Table */}
          <ComparisonMetricsTable cities={comparisonData.cities} />

          {/* 6. Multi-Pollutant Chemical Cross Comparison Bars */}
          <PollutantComparisonChart cities={comparisonData.cities} />

          {/* 7. Historical AQI Timeline Curves */}
          <HistoricalComparisonChart
            cities={comparisonData.cities}
            currentPeriod={period}
            onPeriodChange={(newPeriod) => setPeriod(newPeriod)}
          />

          {/* 8. Data Source Transparency */}
          <DataSources />

        </div>
      </main>

      <Footer />
    </div>
  );
}
