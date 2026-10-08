import React, { useState, useEffect } from 'react';
import { Database, Radio, Cpu, ShieldCheck, RefreshCw } from 'lucide-react';
import { getDataSources } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function DataSources() {
  const { t, currentLang } = useLanguage();
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchSources() {
      try {
        setLoading(true);
        const res = await getDataSources();
        if (isMounted && res.data) {
          setSources(res.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Backend telemetry registry is currently unreachable.');
          // Graceful fallback to static standard definitions
          setSources([
            {
              name: 'Central Pollution Control Board (CPCB)',
              type: 'National Regulatory Network',
              description: 'Government reference continuous ambient air quality monitoring network stations distributed across Tier-1 and Tier-2 urban hubs.',
              standard: 'India NAQI (2015/2026 Revision)'
            },
            {
              name: 'State Pollution Control Boards (SPCBs)',
              type: 'State Regulatory Observatory',
              description: 'State-level continuous telemetry monitors and industrial buffer emissions logging points across all 28 states & union territories.',
              standard: 'Continuous PM2.5, PM10, NOx, SO2'
            },
            {
              name: 'IMD & Satellite Radiometry',
              type: 'Synoptic Meteorological Ingestion',
              description: 'India Meteorological Department Doppler radar, surface automatic weather stations, and ESA Copernicus Sentinel-5P aerosol optical depth.',
              standard: 'Synoptic Boundary Layer Modeling'
            },
            {
              name: 'Calibrated Micro-Sensor Matrix',
              type: 'Hyperlocal Ambient Mesh Network',
              description: 'Dual-laser optical particle counters (OPC) cross-calibrated against gravimetric beta-attenuation monitors for micro-cluster resolution.',
              standard: 'Dual-Optical Laser Scattering'
            }
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSources();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-14 bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>{t('sources.badge', 'Open Telemetry Pipeline')}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {t('sources.title', 'Data Sources & Measurement Architecture')}
            </h3>
          </div>
          <div className="mt-3 md:mt-0 text-slate-400 text-xs sm:text-sm max-w-md">
            <span>
              {t('sources.subtitle', 'Continuous automated telemetry stream aggregated from official government stations, calibrated IoT arrays, and orbital atmospheric sounders.')}
            </span>
            {error && (
              <span className="block text-amber-400 text-xs mt-1">
                {currentLang === 'hi' ? '(ऑफ़लाइन कैश बैकअप सक्रिय)' : '(Offline cache fallback active)'}
              </span>
            )}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-5 rounded-2xl bg-slate-850 border border-slate-800 animate-pulse space-y-3">
                <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                <div className="h-5 bg-slate-800 rounded w-3/4"></div>
                <div className="h-12 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-1/3 pt-3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sources.map((src, i) => (
              <div key={src._id || i} className="p-5 rounded-2xl bg-slate-850 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    {src.type}
                  </span>
                  <h4 className="text-base font-bold text-white font-display mb-2">
                    {src.name || src.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {src.description || src.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Standard</span>
                  <span className="text-white font-semibold">{src.standard}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
