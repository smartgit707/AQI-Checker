/**
 * AeroSense Design System Constants & AQI Standards
 * Based on the Indian National Air Quality Index (NAQI) standards
 */

export const AQI_LEVELS = [
  {
    min: 0,
    max: 50,
    category: 'Good',
    color: '#10b981',       // emerald-500
    textColor: '#065f46',   // emerald-800
    bgColor: '#ecfdf5',     // emerald-50
    borderColor: '#a7f3d0', // emerald-200
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Minimal impact. Air quality is considered satisfactory, and air pollution poses little or no risk.',
    advisory: 'Ideal for outdoor activities, morning walks, and fresh air ventilation.'
  },
  {
    min: 51,
    max: 100,
    category: 'Moderate',
    color: '#f59e0b',       // amber-500
    textColor: '#92400e',   // amber-800
    bgColor: '#fffbeb',     // amber-50
    borderColor: '#fde68a', // amber-200
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Acceptable air quality. Minor breathing discomfort to sensitive people with lung ailments.',
    advisory: 'Unusually sensitive individuals should consider limiting prolonged outdoor exertion.'
  },
  {
    min: 101,
    max: 200,
    category: 'Poor',
    color: '#f97316',       // orange-500
    textColor: '#9a3412',   // orange-800
    bgColor: '#fff7ed',     // orange-50
    borderColor: '#fed7aa', // orange-200
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'Breathing discomfort to people with lung disease such as asthma, and discomfort to children and adults.',
    advisory: 'Wear an anti-pollution mask when outdoors. Keep windows closed during rush hours.'
  },
  {
    min: 201,
    max: 300,
    category: 'Unhealthy',
    color: '#ef4444',       // red-500
    textColor: '#991b1b',   // red-800
    bgColor: '#fef2f2',     // red-50
    borderColor: '#fecaca', // red-200
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    description: 'Breathing discomfort to most people on prolonged exposure. Chronic health warnings.',
    advisory: 'Limit strenuous outdoor activities. Use HEPA air purifiers indoors. Wear N95 masks.'
  },
  {
    min: 301,
    max: 400,
    category: 'Severe',
    color: '#8b5cf6',       // purple-500
    textColor: '#5b21b6',   // purple-800
    bgColor: '#f5f3ff',     // purple-50
    borderColor: '#ddd6fe', // purple-200
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Causes respiratory effects in healthy people and serious health impacts in those with existing diseases.',
    advisory: 'Avoid all outdoor physical activity. Keep indoor air sealed. Vulnerable groups must stay indoors.'
  },
  {
    min: 401,
    max: 500,
    category: 'Hazardous',
    color: '#7f1d1d',       // red-900 / maroon
    textColor: '#450a0a',   // deep maroon
    bgColor: '#fef2f2',     // red-50
    borderColor: '#fca5a5', // red-300
    badgeClass: 'bg-rose-900/10 text-rose-900 border-rose-300',
    description: 'Emergency health warning. Everyone is significantly more likely to be affected with acute symptoms.',
    advisory: 'Remain strictly indoors with air filtration. Medical consultation advised for respiratory distress.'
  }
];

export function getAQILevel(value) {
  const val = Number(value);
  if (val <= 50) return AQI_LEVELS[0];
  if (val <= 100) return AQI_LEVELS[1];
  if (val <= 200) return AQI_LEVELS[2];
  if (val <= 300) return AQI_LEVELS[3];
  if (val <= 400) return AQI_LEVELS[4];
  return AQI_LEVELS[5];
}
