import React from 'react';
import { getAQILevel } from '../../design-system/aqiTokens';

/**
 * Semi-circular radial gauge with animated needle/arc indicating AQI value
 */
export default function AQIGauge({ value = 0, size = 240 }) {
  const numericValue = Math.min(Math.max(Number(value) || 0, 0), 500);
  const currentLevel = getAQILevel(numericValue);

  // 180 degrees arc: from -180 to 0 or polar coordinates
  // Normalized 0 to 500 mapped to angle -90 to +90 (or 180 deg semi circle)
  const percentage = Math.min(numericValue / 500, 1);
  const rotationAngle = -180 + percentage * 180;

  // Arc path constants
  const strokeWidth = 14;
  const radius = 90;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg 
          viewBox="0 0 220 130" 
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="aqiGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />    {/* Good */}
              <stop offset="20%" stopColor="#f59e0b" />   {/* Moderate */}
              <stop offset="40%" stopColor="#f97316" />   {/* Poor */}
              <stop offset="65%" stopColor="#ef4444" />   {/* Unhealthy */}
              <stop offset="85%" stopColor="#8b5cf6" />   {/* Severe */}
              <stop offset="100%" stopColor="#7f1d1d" />  {/* Hazardous */}
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 115 A 90 90 0 0 1 200 115"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <path
            d="M 20 115 A 90 90 0 0 1 200 115"
            fill="none"
            stroke="url(#aqiGaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Ticks & scale labels */}
          <text x="18" y="132" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="middle">0</text>
          <text x="56" y="48" fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle">50</text>
          <text x="110" y="20" fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle">150</text>
          <text x="165" y="48" fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle">300</text>
          <text x="202" y="132" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="middle">500</text>
        </svg>

        {/* Center Value Badge */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center text-center">
          <span 
            className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display transition-colors duration-500"
            style={{ color: currentLevel.color }}
          >
            {numericValue}
          </span>
          <span className="text-xs uppercase tracking-widest font-bold text-slate-400 mt-0.5">
            NAQI Score
          </span>
        </div>
      </div>

      {/* Category Indicator Tag */}
      <div 
        className="mt-3 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-xs"
        style={{ 
          backgroundColor: currentLevel.bgColor, 
          color: currentLevel.textColor,
          borderColor: currentLevel.borderColor,
          borderWidth: 1
        }}
      >
        {currentLevel.category} Air Quality
      </div>
    </div>
  );
}
