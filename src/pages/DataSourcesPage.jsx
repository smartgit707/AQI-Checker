import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  Database, 
  ExternalLink, 
  Server, 
  Clock, 
  ShieldCheck, 
  Globe2, 
  ArrowLeft, 
  CheckCircle, 
  Info 
} from 'lucide-react';

export default function DataSourcesPage() {
  useEffect(() => {
    document.title = 'Data Sources & Attribution — AeroSense Environmental Intelligence';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sources = [
    {
      name: 'Copernicus Atmosphere Monitoring Service (CAMS)',
      provider: 'European Centre for Medium-Range Weather Forecasts (ECMWF)',
      type: 'Satellite Assimilation & Tropospheric Chemical Transport Models',
      metrics: ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'],
      updateFrequency: 'Hourly assimilated model runs',
      cacheTtl: '15 Minutes',
      role: 'Primary particulate and gaseous chemical concentration data provider across urban and regional grids.',
      license: 'Copernicus Open Access Licence',
      url: 'https://atmosphere.copernicus.eu'
    },
    {
      name: 'Open-Meteo High-Resolution Numerical Weather Prediction',
      provider: 'National Weather Services & ECMWF Integrated Forecasting System (IFS)',
      type: 'Synoptic & Boundary-Layer Numerical Meteorology',
      metrics: ['Surface Temperature', 'Relative Humidity', 'Wind Speed & Direction', 'Atmospheric Pressure', 'Visibility'],
      updateFrequency: 'Hourly synoptic updates',
      cacheTtl: '15 Minutes',
      role: 'Drives dispersion calculations, boundary-layer stagnation detection, and meteorological context.',
      license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
      url: 'https://open-meteo.com'
    },
    {
      name: 'Central Pollution Control Board (CPCB)',
      provider: 'Ministry of Environment, Forest & Climate Change, Government of India',
      type: 'Continuous Ambient Air Quality Monitoring Stations (CAAQMS)',
      metrics: ['India NAQI Standard Breakpoints', 'Station Reference Values'],
      updateFrequency: 'Continuous 15-minute sensor telemetry',
      cacheTtl: '15 Minutes',
      role: 'Ground-truth reference standards, official India National AQI categorization bands, and station geolocation mapping.',
      license: 'Open Government Data (OGD) Platform India',
      url: 'https://cpcb.nic.in'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to National Overview</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Telemetry Integrity & Attribution</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
            Data Providers & Environmental Telemetry
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            AeroSense integrates multi-tier international atmospheric observation models, high-resolution numerical weather prediction systems, and official Indian regulatory monitoring standards.
          </p>
        </div>

        {/* Ingestion Architecture Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold font-display">Ingestion & Caching Protocol</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            To balance low-latency user access with responsible provider rate utilization, our backend implements a multi-tier caching architecture:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-2xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                TTL Caching Layer
              </span>
              <div className="text-lg font-black text-white">15 Minutes</div>
              <p className="text-2xs text-slate-400 mt-1">
                Hourly telemetry is cached with a 900-second TTL to avoid duplicate upstream provider requests.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-2xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
                Data Normalization
              </span>
              <div className="text-lg font-black text-white">India NAQI</div>
              <p className="text-2xs text-slate-400 mt-1">
                All raw chemical concentrations (µg/m³ and ppm) are mapped strictly to standard CPCB breakpoints.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-2xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Resilient Fallback
              </span>
              <div className="text-lg font-black text-white">99.9% Uptime</div>
              <p className="text-2xs text-slate-400 mt-1">
                If an individual provider experiences a temporary outage, secondary numerical forecasts maintain platform availability.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Provider List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold font-display text-slate-900">
            Active Atmospheric Data Providers
          </h2>

          {sources.map((src, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {src.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {src.provider}
                  </p>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors self-start sm:self-auto"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {src.role}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-2xs text-slate-400 font-bold uppercase">Data Modality</span>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{src.type}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-2xs text-slate-400 font-bold uppercase">Update Frequency</span>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{src.updateFrequency}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-2xs text-slate-400 font-bold uppercase">AeroSense Cache TTL</span>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{src.cacheTtl}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-2xs text-slate-400 font-bold uppercase">Attribution License</span>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{src.license}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-2xs font-bold text-slate-400 mr-2">Monitored Telemetry:</span>
                {src.metrics.map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-2xs font-semibold"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Transparency Statement */}
        <div className="mt-10 p-6 rounded-3xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Open Access & Non-Endorsement Disclosure</span>
          </div>
          <p className="leading-relaxed">
            AeroSense retrieves and normalizes open-access scientific atmospheric observations from Copernicus CAMS, Open-Meteo, and CPCB. The use of these open datasets does not imply official endorsement or formal commercial partnership by the respective organizations.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
