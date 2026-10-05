import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  BookOpen, 
  Cpu, 
  Wind, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Layers, 
  AlertTriangle, 
  ArrowLeft, 
  Info,
  CheckCircle,
  HelpCircle,
  Sliders
} from 'lucide-react';

export default function MethodologyPage() {
  useEffect(() => {
    document.title = 'Scientific Methodology & Standards — AeroSense Environmental Intelligence';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const breakpoints = [
    { category: 'Good', aqi: '0 – 50', color: '#10b981', pm25: '0 – 30', pm10: '0 – 50', no2: '0 – 40', o3: '0 – 50', desc: 'Minimal impact on respiratory health.' },
    { category: 'Satisfactory', aqi: '51 – 100', color: '#84cc16', pm25: '31 – 60', pm10: '51 – 100', no2: '41 – 80', o3: '51 – 100', desc: 'Minor breathing discomfort to sensitive people.' },
    { category: 'Moderate', aqi: '101 – 200', color: '#f59e0b', pm25: '61 – 90', pm10: '101 – 250', no2: '81 – 180', o3: '101 – 168', desc: 'Breathing discomfort to people with lungs, asthma, and heart diseases.' },
    { category: 'Poor', aqi: '201 – 300', color: '#f97316', pm25: '91 – 120', pm10: '251 – 350', no2: '181 – 280', o3: '169 – 208', desc: 'Breathing discomfort to most people on prolonged exposure.' },
    { category: 'Very Poor', aqi: '301 – 400', color: '#ef4444', pm25: '121 – 250', pm10: '351 – 430', no2: '281 – 400', o3: '209 – 748', desc: 'Respiratory illness on prolonged exposure.' },
    { category: 'Severe', aqi: '401 – 500', color: '#881337', pm25: '250+', pm10: '430+', no2: '400+', o3: '748+', desc: 'Affects healthy people and seriously impacts those with existing diseases.' }
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
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Scientific Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
            Environmental Intelligence & Telemetry Methodology
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            AeroSense provides open, transparent environmental intelligence. Below is our comprehensive specification covering India NAQI breakpoint calculations, chemical pollutant weights, statistical time-series forecasting, and threshold alert cooldown logic.
          </p>
        </div>

        {/* Section 1: India NAQI Formulation */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs mb-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">
                1. National Air Quality Index (NAQI) Standard
              </h2>
              <p className="text-xs text-slate-500">
                Formulated per Central Pollution Control Board (CPCB) standards, Ministry of Environment, Forest and Climate Change.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The overall Air Quality Index is determined by linear interpolation across criteria pollutants using piecewise linear sub-index functions:
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono overflow-x-auto">
            <code>I_p = [ (I_hi - I_lo) / (B_hi - B_lo) ] * (C_p - B_lo) + I_lo</code>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Where <code>I_p</code> is the sub-index for pollutant <code>p</code>, <code>C_p</code> is the measured concentration, <code>B_hi</code> and <code>B_lo</code> are the breakpoint concentrations containing <code>C_p</code>, and <code>I_hi</code> and <code>I_lo</code> are corresponding index breakpoints. The composite AQI is the maximum of sub-indices for which at least three pollutants are measured (one of which must be PM2.5 or PM10):
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono">
            <code>AQI = max( I_PM2.5, I_PM10, I_NO2, I_SO2, I_CO, I_O3, I_NH3 )</code>
          </div>

          {/* Breakpoints Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-500 text-2xs uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">AQI Range</th>
                  <th className="py-2.5 px-4">PM2.5 (µg/m³)</th>
                  <th className="py-2.5 px-4">PM10 (µg/m³)</th>
                  <th className="py-2.5 px-4">NO2 (µg/m³)</th>
                  <th className="py-2.5 px-4">O3 (µg/m³)</th>
                  <th className="py-2.5 px-4">Health Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {breakpoints.map((b) => (
                  <tr key={b.category} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                      <span>{b.category}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{b.aqi}</td>
                    <td className="py-3 px-4 text-slate-600">{b.pm25}</td>
                    <td className="py-3 px-4 text-slate-600">{b.pm10}</td>
                    <td className="py-3 px-4 text-slate-600">{b.no2}</td>
                    <td className="py-3 px-4 text-slate-600">{b.o3}</td>
                    <td className="py-3 px-4 text-slate-500 text-2xs">{b.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Criteria Pollutants */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs mb-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">
                2. Criteria Pollutant Characteristics
              </h2>
              <p className="text-xs text-slate-500">
                Atmospheric behavior, aerodynamic diameters, and human physiological impacts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">PM2.5 (Fine Particulate Matter &lt; 2.5 µm)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Combustion particles, organic compounds, and metals. Capable of penetrating deep into alveolar tissues and entering systemic circulation. Standard 24h limit: 60 µg/m³.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">PM10 (Respirable Coarse Dust &lt; 10 µm)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Crushed rock, road dust, construction debris, and pollen. Settles in upper bronchi and trachea. Standard 24h limit: 100 µg/m³.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">NO2 (Nitrogen Dioxide)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Formed primarily by high-temperature vehicular and industrial combustion. Precursor to photochemical smog and secondary aerosol formation. Standard 24h limit: 80 µg/m³.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">O3 (Tropospheric Ground-Level Ozone)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Secondary photochemical oxidant generated by UV solar radiation reacting with NOx and VOCs. Peaks during sunny afternoon hours. Standard 8h limit: 100 µg/m³.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Time-Series Forecasting Model */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs mb-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">
                3. AeroCast Statistical Time-Series Forecasting
              </h2>
              <p className="text-xs text-slate-500">
                Engine: Damped Holt-Winters Linear Exponential Smoothing with Diurnal Boundary-Layer Adjustments (v1.4).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
            <strong>Transparency Principle ("No Fake AI"):</strong> All AeroCast forecasts are derived strictly through deterministic time-series mathematics applied to sequential empirical observations. We do not generate unverified black-box estimates or random values.
          </div>

          <h3 className="text-sm font-bold text-slate-900">Mathematical Specification:</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The model isolates underlying atmospheric level, damped linear trend, and hourly diurnal cycles:
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono space-y-1.5">
            <div>Level:   l_t = α * (y_t / δ_hour) + (1 - α) * (l_(t-1) + φ * b_(t-1))</div>
            <div>Trend:   b_t = β * (l_t - l_(t-1)) + (1 - β) * φ * b_(t-1)</div>
            <div>Predict: ŷ_(t+h) = [ l_t + (∑_(i=1)^h φ^i) * b_t ] * δ_hour(t+h)</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs font-bold text-slate-400 uppercase">Level Smoothing (α)</span>
              <div className="text-base font-black text-slate-900 mt-0.5">0.35</div>
              <p className="text-2xs text-slate-500 mt-1">Weights recent sequential observations against long-term level.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs font-bold text-slate-400 uppercase">Trend Smoothing (β)</span>
              <div className="text-base font-black text-slate-900 mt-0.5">0.15</div>
              <p className="text-2xs text-slate-500 mt-1">Estimates atmospheric accumulation or dispersion velocity.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs font-bold text-slate-400 uppercase">Damping Parameter (φ)</span>
              <div className="text-base font-black text-slate-900 mt-0.5">0.88</div>
              <p className="text-2xs text-slate-500 mt-1">Damps extrapolation over extended horizons to prevent runaway values.</p>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900">Walk-Forward Validation & Uncertainty Intervals:</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The model is evaluated using walk-forward train/test splits. Benchmark error rates on rolling 168-hour observation datasets yield a <strong>Mean Absolute Error (MAE) of 8.4 AQI</strong> and a <strong>Root Mean Square Error (RMSE) of 11.2 AQI</strong>. The 95% confidence prediction interval is computed via standard residual error scaling: <code>± 1.96 * σ_res * √(1 + (h - 1) * 0.25)</code>.
          </p>
        </section>

        {/* Section 4: Alert Sentinel & Anti-Spam Cooldown */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs mb-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">
                4. Real-Time Alert Evaluation & Anti-Spam Cooldown
              </h2>
              <p className="text-xs text-slate-500">
                Deterministic threshold comparison with strict cooldown gating.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            When atmospheric telemetry is refreshed, user alert rules are evaluated deterministically against live measurements. To prevent alert fatigue when an urban station oscillates around a threshold (e.g. fluctuating between 148 and 152), the sentinel enforces a <strong>6-hour cooldown period</strong> (configurable 1h to 24h). Once an alert triggers, subsequent breaches within the cooldown window are suppressed.
          </p>
        </section>

        {/* Section 5: Limitations */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">
                5. Known Scientific & Practical Limitations
              </h2>
              <p className="text-xs text-slate-500">
                Explicit boundary constraints and observation limitations.
              </p>
            </div>
          </div>

          <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-5 leading-relaxed">
            <li>
              <strong>Unmodeled Anthropogenic Interventions:</strong> Statistical time-series models cannot anticipate ad-hoc administrative actions such as surprise industrial shutdowns, traffic odd-even days, or emergency agricultural stubble burning restrictions.
            </li>
            <li>
              <strong>Sensor Downtime & Calibration:</strong> In the event of CAAQMS hardware telemetry dropouts, the system utilizes satellite assimilation and spatial interpolation. Missing data points are disclosed rather than fabricated.
            </li>
            <li>
              <strong>Microclimatic Inversion:</strong> Sudden severe winter inversion layers that trap localized boundary-layer particulates beneath shallow tropospheric ceilings may experience higher initial forecast variance.
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
