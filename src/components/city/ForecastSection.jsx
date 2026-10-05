import React, { useState, useEffect } from 'react';
import { getCityForecastApi } from '../../services/api';
import { getAQILevel } from '../../design-system/aqiTokens';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Info,
  Clock,
  ShieldAlert,
  Activity,
  Layers,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export default function ForecastSection({ citySlug, cityName = 'City' }) {
  const [horizon, setHorizon] = useState(24);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function fetchForecast() {
      if (!citySlug) return;
      try {
        setIsLoading(true);
        setError(null);
        const res = await getCityForecastApi(citySlug, horizon);
        if (isCurrent && res.success && res.data) {
          setForecastData(res.data);
        }
      } catch (err) {
        if (isCurrent) {
          console.warn('[Forecast Error]', err.message);
          setError(err.message || 'Forecast calculation temporarily unavailable');
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    fetchForecast();
    return () => {
      isCurrent = false;
    };
  }, [citySlug, horizon]);

  if (error && !forecastData) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <Activity className="w-5 h-5 text-emerald-600" />
          <span>AQI Atmospheric Forecast</span>
        </div>
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          <p className="font-semibold">Forecast temporarily unavailable</p>
          <p className="text-xs text-amber-700 mt-1">
            There is insufficient sequential telemetry to generate a statistical time-series model for this location.
          </p>
        </div>
      </div>
    );
  }

  const isAvailable = forecastData?.available !== false;
  const outlook = forecastData?.outlook || { status: 'Stable', delta: 0, description: '' };
  const points = forecastData?.forecast || [];
  const model = forecastData?.model || {};

  // Compute SVG chart coordinates
  const svgWidth = 800;
  const svgHeight = 260;
  const padLeft = 45;
  const padRight = 35;
  const padTop = 25;
  const padBottom = 40;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  // Find min and max for scaling
  const allValues = [
    forecastData?.current?.aqi || 100,
    ...points.map((p) => p.predictedAQI),
    ...points.map((p) => p.lowerBound),
    ...points.map((p) => p.upperBound)
  ].filter((v) => !isNaN(v));

  const minVal = Math.max(0, Math.min(...allValues) - 20);
  const maxVal = Math.max(100, Math.max(...allValues) + 20);
  const valRange = maxVal - minVal || 1;

  const getY = (val) => padTop + chartH - ((val - minVal) / valRange) * chartH;
  const getX = (index, total) => padLeft + (index / Math.max(1, total - 1)) * chartW;

  // Build forecast SVG paths
  const currentAQI = forecastData?.current?.aqi || points[0]?.predictedAQI || 100;
  const chartPoints = [{ predictedAQI: currentAQI, lowerBound: currentAQI, upperBound: currentAQI, isCurrent: true }, ...points];

  const forecastPath = chartPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i, chartPoints.length).toFixed(1)} ${getY(p.predictedAQI).toFixed(1)}`)
    .join(' ');

  // Shaded 95% Confidence Interval polygon path
  const upperPath = chartPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i, chartPoints.length).toFixed(1)} ${getY(p.upperBound).toFixed(1)}`)
    .join(' ');

  const lowerPathReversed = chartPoints
    .slice()
    .reverse()
    .map((p, i) => `L ${getX(chartPoints.length - 1 - i, chartPoints.length).toFixed(1)} ${getY(p.lowerBound).toFixed(1)}`)
    .join(' ');

  const confidenceBandPath = `${upperPath} ${lowerPathReversed} Z`;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Section Header with Horizon Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Statistical Time-Series Intelligence
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            AQI Forecast & Atmospheric Horizon
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Mathematical projection generated from sequential CAMS observations and diurnal boundary-layer cycles.
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
          {[6, 12, 24, 48].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                horizon === h
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {h}H
            </button>
          ))}
        </div>
      </div>

      {!isAvailable ? (
        <div className="py-12 text-center max-w-md mx-auto space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Forecast Unavailable</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {forecastData?.message || 'There is not enough sequential historical telemetry to calculate a model for this location.'}
          </p>
        </div>
      ) : (
        <>
          {/* Outlook Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  outlook.status === 'Improving'
                    ? 'bg-emerald-100 text-emerald-700'
                    : outlook.status === 'Worsening'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {outlook.status === 'Improving' ? (
                  <TrendingDown className="w-6 h-6 stroke-[2.5]" />
                ) : outlook.status === 'Worsening' ? (
                  <TrendingUp className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <Minus className="w-6 h-6 stroke-[2.5]" />
                )}
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Forecast Outlook
                </span>
                <div className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>{outlook.status}</span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      outlook.delta > 0
                        ? 'bg-rose-50 text-rose-700'
                        : outlook.delta < 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {outlook.delta > 0 ? `+${outlook.delta}` : outlook.delta} AQI
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-center">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Trajectory Analysis
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                {outlook.description}
              </p>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="relative bg-slate-950 rounded-2xl p-4 sm:p-6 overflow-hidden">
            {/* Chart Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3 text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-slate-300 font-semibold">Current Observed</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-teal-400 inline-block" />
                  <span className="text-slate-300 font-semibold">Projected AQI</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-teal-500/20 border border-teal-500/40 rounded-xs inline-block" />
                  <span className="text-slate-300 font-semibold">95% Uncertainty Band</span>
                </span>
              </div>

              <span className="text-2xs text-slate-500">
                Model: {model.name || 'AeroCast-DES'}
              </span>
            </div>

            {/* SVG Visualizer */}
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[500px]">
                <defs>
                  <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                {[50, 100, 200, 300].map((refAqi) => {
                  if (refAqi < minVal || refAqi > maxVal) return null;
                  const y = getY(refAqi);
                  return (
                    <g key={refAqi}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={svgWidth - padRight}
                        y2={y}
                        stroke="#334155"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={padLeft - 8}
                        y={y + 4}
                        fill="#64748b"
                        fontSize="10"
                        textAnchor="end"
                        fontFamily="monospace"
                      >
                        {refAqi}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded 95% Confidence Interval */}
                <path d={confidenceBandPath} fill="url(#confidenceGrad)" />

                {/* Projected Trend Line */}
                <path
                  d={forecastPath}
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                />

                {/* Current Observation Node */}
                <circle
                  cx={getX(0, chartPoints.length)}
                  cy={getY(currentAQI)}
                  r="6"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Forecast nodes */}
                {chartPoints.map((pt, i) => {
                  if (i === 0) return null;
                  // Only render selected interval dots to prevent clutter
                  if (chartPoints.length > 15 && i % 3 !== 0 && i !== chartPoints.length - 1) return null;
                  return (
                    <circle
                      key={i}
                      cx={getX(i, chartPoints.length)}
                      cy={getY(pt.predictedAQI)}
                      r="3.5"
                      fill="#2dd4bf"
                    />
                  );
                })}

                {/* X-Axis Time Labels */}
                <text x={padLeft} y={svgHeight - 10} fill="#94a3b8" fontSize="10">
                  Now (Observed)
                </text>
                <text x={svgWidth - padRight} y={svgHeight - 10} fill="#94a3b8" fontSize="10" textAnchor="end">
                  +{horizon}h Projected
                </text>
              </svg>
            </div>
          </div>

          {/* Model Transparency & Scientific Disclaimer Accordion */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {forecastData?.disclaimer ||
                  'Forecasts are statistical projections based on sequential observations and regional diurnal cycles.'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowMethodology(!showMethodology)}
              className="text-emerald-600 hover:text-emerald-700 font-semibold self-start sm:self-auto shrink-0 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showMethodology ? 'Hide Details' : 'Model Details'}</span>
            </button>
          </div>

          {showMethodology && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700 animate-fadeIn">
              <div className="font-bold text-slate-900 text-sm">
                AeroCast Statistical Methodology (Double Exponential Smoothing)
              </div>
              <p className="leading-relaxed">
                AeroCast computes two-parameter Holt-Winters linear exponential smoothing with a trend damping factor (φ = 0.92) to prevent unrealistic long-range overshoot. The model incorporates historical 24-hour diurnal atmospheric cycles to account for boundary-layer compression during evening rush hours and nocturnal ground-level inversions.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400 uppercase text-2xs font-bold">Model Version</div>
                  <div className="font-bold text-slate-800 mt-0.5">{model.version || '1.4.0'}</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400 uppercase text-2xs font-bold">Historical Span</div>
                  <div className="font-bold text-slate-800 mt-0.5">7 Days Sequential</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400 uppercase text-2xs font-bold">Confidence Interval</div>
                  <div className="font-bold text-slate-800 mt-0.5">95% Standard Error</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400 uppercase text-2xs font-bold">AI Claim Policy</div>
                  <div className="font-bold text-emerald-700 mt-0.5">100% Explainable Math</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
