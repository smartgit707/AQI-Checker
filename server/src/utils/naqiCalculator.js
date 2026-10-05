/**
 * Official Indian National Air Quality Index (NAQI) Breakpoint Calculator
 * Published by Central Pollution Control Board (CPCB), Ministry of Environment, Forest & Climate Change.
 * Standard formula: I = [ (I_hi - I_lo) / (B_hi - B_lo) ] * (C - B_lo) + I_lo
 */

export const NAQI_BREAKPOINTS = {
  // Breakpoints: [B_lo, B_hi, I_lo, I_hi]
  'PM2.5': [
    [0, 30, 0, 50],
    [31, 60, 51, 100],
    [61, 90, 101, 200],
    [91, 120, 201, 300],
    [121, 250, 301, 400],
    [251, 500, 401, 500]
  ],
  'PM10': [
    [0, 50, 0, 50],
    [51, 100, 51, 100],
    [101, 250, 101, 200],
    [251, 350, 201, 300],
    [351, 430, 301, 400],
    [431, 600, 401, 500]
  ],
  'NO2': [
    [0, 40, 0, 50],
    [41, 80, 51, 100],
    [81, 180, 101, 200],
    [181, 280, 201, 300],
    [281, 400, 301, 400],
    [401, 800, 401, 500]
  ],
  'SO2': [
    [0, 40, 0, 50],
    [41, 80, 51, 100],
    [81, 380, 101, 200],
    [381, 800, 201, 300],
    [801, 1600, 301, 400],
    [1601, 2000, 401, 500]
  ],
  'CO': [
    // mg/m³
    [0, 1.0, 0, 50],
    [1.1, 2.0, 51, 100],
    [2.1, 10.0, 101, 200],
    [10.1, 17.0, 201, 300],
    [17.1, 34.0, 301, 400],
    [34.1, 50.0, 401, 500]
  ],
  'O3': [
    [0, 50, 0, 50],
    [51, 100, 51, 100],
    [101, 168, 101, 200],
    [169, 208, 201, 300],
    [209, 748, 301, 400],
    [749, 1000, 401, 500]
  ]
};

export const NAQI_CATEGORIES = [
  { min: 0, max: 50, category: 'Good', color: '#10b981', desc: 'Minimal health impact' },
  { min: 51, max: 100, category: 'Moderate', color: '#f59e0b', desc: 'Minor breathing discomfort to sensitive people' },
  { min: 101, max: 200, category: 'Poor', color: '#f97316', desc: 'Breathing discomfort to people with lung/heart disease' },
  { min: 201, max: 300, category: 'Unhealthy', color: '#ef4444', desc: 'Breathing discomfort to most people on prolonged exposure' },
  { min: 301, max: 400, category: 'Severe', color: '#8b5cf6', desc: 'Respiratory illness on prolonged exposure' },
  { min: 401, max: 500, category: 'Hazardous', color: '#7f1d1d', desc: 'Serious health impacts even on light exposure' }
];

export function getCategoryFromAqi(aqiValue) {
  const val = Math.round(Number(aqiValue) || 0);
  for (const cat of NAQI_CATEGORIES) {
    if (val >= cat.min && val <= cat.max) {
      return cat;
    }
  }
  return NAQI_CATEGORIES[NAQI_CATEGORIES.length - 1];
}

/**
 * Calculate sub-index for a single pollutant
 */
export function calculateSubIndex(pollutantCode, concentration) {
  if (concentration === null || concentration === undefined || isNaN(concentration) || concentration < 0) {
    return null;
  }

  const table = NAQI_BREAKPOINTS[pollutantCode];
  if (!table) return null;

  for (const [bLo, bHi, iLo, iHi] of table) {
    if (concentration >= bLo && concentration <= bHi) {
      const subIndex = ((iHi - iLo) / (bHi - bLo)) * (concentration - bLo) + iLo;
      return Math.round(subIndex);
    }
  }

  // If higher than max breakpoint
  const last = table[table.length - 1];
  if (concentration > last[1]) {
    return 500;
  }

  return 0;
}

/**
 * Calculate overall NAQI from multi-pollutant concentrations
 * According to CPCB NAQI guidelines:
 * Overall AQI is the maximum of the sub-indices (requires at least PM2.5 or PM10).
 */
export function calculateOverallNAQI(pollutantsMap) {
  let maxSubIndex = 0;
  let dominant = 'PM2.5';
  const subIndices = {};

  for (const [code, value] of Object.entries(pollutantsMap)) {
    const sub = calculateSubIndex(code, value);
    if (sub !== null) {
      subIndices[code] = sub;
      if (sub > maxSubIndex) {
        maxSubIndex = sub;
        dominant = code;
      }
    }
  }

  // Ensure minimum valid score if readings exist
  const aqi = maxSubIndex > 0 ? maxSubIndex : (pollutantsMap['PM2.5'] ? Math.round(pollutantsMap['PM2.5']) : 50);
  const cat = getCategoryFromAqi(aqi);

  return {
    aqi: Math.min(500, Math.max(0, aqi)),
    category: cat.category,
    dominantPollutant: dominant,
    color: cat.color,
    subIndices
  };
}
