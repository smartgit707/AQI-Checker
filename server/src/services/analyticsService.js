import { getAllCities, getCityBySlug } from './cityService.js';
import { getLatestAirQualityForCity } from './airQualityService.js';
import { envCache } from '../utils/cache.js';
import { NAQI_CATEGORIES, getCategoryFromAqi } from '../utils/naqiCalculator.js';

export const STATE_TO_REGION = {
  'National Capital Territory': 'North India',
  'Delhi': 'North India',
  'Delhi NCR': 'North India',
  'Punjab': 'North India',
  'Haryana': 'North India',
  'Punjab & Haryana': 'North India',
  'Himachal Pradesh': 'North India',
  'Rajasthan': 'North India',
  'Uttar Pradesh': 'North India',
  'Uttarakhand': 'North India',
  'Jammu and Kashmir': 'North India',
  'Chandigarh': 'North India',
  'Tamil Nadu': 'South India',
  'Karnataka': 'South India',
  'Telangana': 'South India',
  'Andhra Pradesh': 'South India',
  'Kerala': 'South India',
  'Maharashtra': 'West India',
  'Gujarat': 'West India',
  'Goa': 'West India',
  'West Bengal': 'East India',
  'Bihar': 'East India',
  'Odisha': 'East India',
  'Jharkhand': 'East India',
  'Madhya Pradesh': 'Central India',
  'Chhattisgarh': 'Central India',
  'Assam': 'Northeast India',
  'Meghalaya': 'Northeast India'
};

/**
 * Determine geographic zone for a state
 */
export function getRegionForState(stateName) {
  if (!stateName) return 'Central India';
  for (const [state, region] of Object.entries(STATE_TO_REGION)) {
    if (stateName.toLowerCase().includes(state.toLowerCase()) || state.toLowerCase().includes(stateName.toLowerCase())) {
      return region;
    }
  }
  return 'Central India';
}

/**
 * Generates deterministic, fact-grounded environmental insights
 */
function generateDeterministicInsights(overview, distribution, regional, cleanest, mostPolluted) {
  const insights = [];

  // 1. Dominant Pollutant Insight
  if (overview.dominantNationalPollutant) {
    insights.push({
      id: 'dominant-pollutant',
      type: 'pollutant',
      title: `${overview.dominantNationalPollutant} Dominates Urban Atmospheres`,
      description: `${overview.dominantNationalPollutant} constitutes the primary driving index across ${overview.dominantCount || 0} of ${overview.totalCities} monitored Indian metropolises, primarily driven by vehicular congestion and boundary-layer suspension.`,
      metric: `${overview.dominantNationalPollutant}`,
      significance: 'Critical Focus'
    });
  }

  // 2. Cleanest vs Most Polluted Contrast
  if (cleanest && mostPolluted && cleanest.slug !== mostPolluted.slug) {
    const diff = mostPolluted.aqi - cleanest.aqi;
    insights.push({
      id: 'aqi-span',
      type: 'gradient',
      title: 'Geographic Air Index Gradient',
      description: `A substantial gap of ${diff} AQI points separates India's cleanest monitored station (${cleanest.name}, AQI ${cleanest.aqi}) from the most impacted (${mostPolluted.name}, AQI ${mostPolluted.aqi}).`,
      metric: `Δ ${diff} AQI`,
      significance: 'Dispersion Variance'
    });
  }

  // 3. National Compliance Insight
  const compliantPercentage = Math.round(((overview.goodCitiesCount + overview.moderateCitiesCount) / Math.max(1, overview.totalCities)) * 100);
  insights.push({
    id: 'compliance-rate',
    type: 'compliance',
    title: 'National Standards Compliance Rate',
    description: `${compliantPercentage}% of continuously monitored urban zones currently meet CPCB Good or Moderate environmental thresholds, while ${100 - compliantPercentage}% suffer elevated particulate burdens.`,
    metric: `${compliantPercentage}% Compliant`,
    significance: compliantPercentage >= 50 ? 'Moderate Baseline' : 'Severe Warning'
  });

  // 4. Regional Divergence
  if (regional && regional.length >= 2) {
    const sortedRegions = [...regional].sort((a, b) => a.averageAqi - b.averageAqi);
    const bestReg = sortedRegions[0];
    const worstReg = sortedRegions[sortedRegions.length - 1];

    if (bestReg && worstReg) {
      insights.push({
        id: 'regional-contrast',
        type: 'regional',
        title: 'Inter-Regional Atmospheric Disparity',
        description: `${bestReg.region} currently registers the lowest regional air burden (mean AQI ${bestReg.averageAqi}), whereas ${worstReg.region} experiences elevated stagnation (mean AQI ${worstReg.averageAqi}).`,
        metric: `${bestReg.averageAqi} vs ${worstReg.averageAqi}`,
        significance: 'Macro-Climate'
      });
    }
  }

  return insights;
}

/**
 * Aggregates complete national environmental analytics across all monitored cities
 */
export async function getAnalyticsDashboard() {
  const cacheKey = 'analytics_dashboard_v1';
  const cached = envCache.get(cacheKey);
  if (cached) return cached;

  const { cities } = await getAllCities({ limit: 50 });
  if (!cities || cities.length === 0) {
    throw new Error('No monitored cities found in active registry');
  }

  // Parallel fetch latest telemetry for each city safely
  const cityTelemetryList = await Promise.all(
    cities.map(async (c) => {
      try {
        const env = await getLatestAirQualityForCity(c.slug);
        return {
          id: c.slug,
          slug: c.slug,
          name: c.name,
          state: c.state,
          country: c.country || 'India',
          region: getRegionForState(c.state),
          coordinates: c.coordinates,
          station: c.station,
          image: c.image?.url || '',
          aqi: env.aqi,
          category: env.category,
          dominantPollutant: env.dominantPollutant,
          trend24h: env.trend24h || '0%',
          weather: env.weather || null,
          pollutants: env.pollutants || [],
          timestamp: env.timestamp || env.retrievedAt || new Date().toISOString(),
          retrievedAt: env.retrievedAt || env.timestamp || new Date().toISOString()
        };
      } catch (err) {
        return null;
      }
    })
  );

  const validCities = cityTelemetryList.filter(Boolean);
  if (validCities.length === 0) {
    throw new Error('Unable to retrieve environmental telemetry for analytics');
  }

  // 1. Overview Calculations
  const aqiValues = validCities.map(c => c.aqi);
  const totalAqi = aqiValues.reduce((sum, v) => sum + v, 0);
  const averageAqi = Math.round(totalAqi / validCities.length);

  // Sorted ascending for rankings
  const sortedByAqi = [...validCities].sort((a, b) => a.aqi - b.aqi);
  const cleanest = sortedByAqi[0];
  const mostPolluted = sortedByAqi[sortedByAqi.length - 1];

  // Category counts
  let goodCount = 0;
  let moderateCount = 0;
  let poorCount = 0;
  let unhealthyCount = 0;
  let severeCount = 0;
  let hazardousCount = 0;

  // Pollutant tallies
  const dominantCounts = {};

  validCities.forEach(c => {
    if (c.aqi <= 50) goodCount++;
    else if (c.aqi <= 100) moderateCount++;
    else if (c.aqi <= 200) poorCount++;
    else if (c.aqi <= 300) unhealthyCount++;
    else if (c.aqi <= 400) severeCount++;
    else hazardousCount++;

    const dom = c.dominantPollutant || 'PM2.5';
    dominantCounts[dom] = (dominantCounts[dom] || 0) + 1;
  });

  let maxDomCount = 0;
  let dominantNational = 'PM2.5';
  for (const [dom, cnt] of Object.entries(dominantCounts)) {
    if (cnt > maxDomCount) {
      maxDomCount = cnt;
      dominantNational = dom;
    }
  }

  const overview = {
    averageAqi,
    nationalCategory: getCategoryFromAqi(averageAqi).category,
    totalCities: validCities.length,
    bestCity: {
      name: cleanest.name,
      slug: cleanest.slug,
      state: cleanest.state,
      aqi: cleanest.aqi,
      category: cleanest.category,
      dominantPollutant: cleanest.dominantPollutant,
      image: cleanest.image
    },
    worstCity: {
      name: mostPolluted.name,
      slug: mostPolluted.slug,
      state: mostPolluted.state,
      aqi: mostPolluted.aqi,
      category: mostPolluted.category,
      dominantPollutant: mostPolluted.dominantPollutant,
      image: mostPolluted.image
    },
    goodCitiesCount: goodCount,
    moderateCitiesCount: moderateCount,
    poorOrWorseCount: poorCount + unhealthyCount + severeCount + hazardousCount,
    unhealthyCount,
    severeCount,
    hazardousCount,
    dominantNationalPollutant: dominantNational,
    dominantCount: maxDomCount,
    lastUpdated: validCities[0]?.timestamp || new Date().toISOString()
  };

  // 2. AQI Distribution
  const distribution = [
    {
      category: 'Good',
      min: 0,
      max: 50,
      color: '#10b981',
      count: goodCount,
      percentage: Math.round((goodCount / validCities.length) * 100),
      description: 'Minimal health impact, clean air'
    },
    {
      category: 'Moderate',
      min: 51,
      max: 100,
      color: '#f59e0b',
      count: moderateCount,
      percentage: Math.round((moderateCount / validCities.length) * 100),
      description: 'Minor breathing discomfort for sensitive groups'
    },
    {
      category: 'Poor',
      min: 101,
      max: 200,
      color: '#f97316',
      count: poorCount,
      percentage: Math.round((poorCount / validCities.length) * 100),
      description: 'Breathing discomfort to people with respiratory disease'
    },
    {
      category: 'Unhealthy',
      min: 201,
      max: 300,
      color: '#ef4444',
      count: unhealthyCount,
      percentage: Math.round((unhealthyCount / validCities.length) * 100),
      description: 'Breathing discomfort to most people on prolonged exposure'
    },
    {
      category: 'Severe',
      min: 301,
      max: 400,
      color: '#8b5cf6',
      count: severeCount,
      percentage: Math.round((severeCount / validCities.length) * 100),
      description: 'Respiratory effects in healthy population; acute impacts'
    },
    {
      category: 'Hazardous',
      min: 401,
      max: 500,
      color: '#7f1d1d',
      count: hazardousCount,
      percentage: Math.round((hazardousCount / validCities.length) * 100),
      description: 'Emergency warnings; entire population at acute risk'
    }
  ];

  // 3. Regional Breakdown
  const regionMap = {};
  validCities.forEach(city => {
    const reg = city.region;
    if (!regionMap[reg]) {
      regionMap[reg] = {
        region: reg,
        cities: [],
        totalAqi: 0
      };
    }
    regionMap[reg].cities.push(city);
    regionMap[reg].totalAqi += city.aqi;
  });

  const regional = Object.values(regionMap).map(r => {
    const sorted = [...r.cities].sort((a, b) => a.aqi - b.aqi);
    const avg = Math.round(r.totalAqi / r.cities.length);
    return {
      region: r.region,
      cityCount: r.cities.length,
      averageAqi: avg,
      category: getCategoryFromAqi(avg).category,
      color: getCategoryFromAqi(avg).color,
      cleanestCity: { name: sorted[0].name, slug: sorted[0].slug, aqi: sorted[0].aqi },
      mostPollutedCity: { name: sorted[sorted.length - 1].name, slug: sorted[sorted.length - 1].slug, aqi: sorted[sorted.length - 1].aqi },
      cities: r.cities.map(c => ({
        name: c.name,
        slug: c.slug,
        aqi: c.aqi,
        category: c.category,
        state: c.state
      }))
    };
  }).sort((a, b) => a.averageAqi - b.averageAqi);

  // 4. Multi-Pollutant National Concentrations
  const pollutantCodes = ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'];
  const pollutantStandards = {
    'PM2.5': { name: 'Fine Particulates (PM2.5)', unit: 'µg/m³', limit: 60 },
    'PM10': { name: 'Coarse Particulates (PM10)', unit: 'µg/m³', limit: 100 },
    'NO2': { name: 'Nitrogen Dioxide (NO2)', unit: 'ppb', limit: 80 },
    'SO2': { name: 'Sulfur Dioxide (SO2)', unit: 'ppb', limit: 80 },
    'CO': { name: 'Carbon Monoxide (CO)', unit: 'mg/m³', limit: 4.0 },
    'O3': { name: 'Ground-level Ozone (O3)', unit: 'ppb', limit: 100 }
  };

  const pollutants = pollutantCodes.map(code => {
    const std = pollutantStandards[code];
    let sumVal = 0;
    let countVal = 0;
    let maxVal = -1;
    let maxCity = null;

    validCities.forEach(city => {
      const p = city.pollutants?.find(item => item.code === code || item.code?.replace('.', '') === code);
      if (p && typeof p.value === 'number' && !isNaN(p.value)) {
        sumVal += p.value;
        countVal++;
        if (p.value > maxVal) {
          maxVal = p.value;
          maxCity = { name: city.name, slug: city.slug, value: p.value };
        }
      }
    });

    const avgVal = countVal > 0 ? Number((sumVal / countVal).toFixed(1)) : null;
    const pctOfLimit = avgVal !== null ? Math.round((avgVal / std.limit) * 100) : null;

    return {
      code,
      name: std.name,
      unit: std.unit,
      limit: std.limit,
      averageValue: avgVal,
      percentageOfLimit: pctOfLimit,
      highestCity: maxCity,
      monitoredStationsCount: countVal
    };
  });

  // 5. Cleanest & Most Polluted Rankings Lists
  const rankings = {
    cleanest: sortedByAqi.map((c, idx) => ({
      rank: idx + 1,
      name: c.name,
      slug: c.slug,
      state: c.state,
      region: c.region,
      aqi: c.aqi,
      category: c.category,
      dominantPollutant: c.dominantPollutant,
      temperature: c.weather?.temperature || '28°C',
      image: c.image
    })),
    mostPolluted: [...sortedByAqi].reverse().map((c, idx) => ({
      rank: idx + 1,
      name: c.name,
      slug: c.slug,
      state: c.state,
      region: c.region,
      aqi: c.aqi,
      category: c.category,
      dominantPollutant: c.dominantPollutant,
      temperature: c.weather?.temperature || '28°C',
      image: c.image
    }))
  };

  // 6. Deterministic Insights
  const insights = generateDeterministicInsights(overview, distribution, regional, cleanest, mostPolluted);

  const result = {
    overview,
    distribution,
    rankings,
    regional,
    pollutants,
    insights,
    citiesList: validCities.map(c => ({
      name: c.name,
      slug: c.slug,
      state: c.state,
      region: c.region,
      aqi: c.aqi,
      category: c.category,
      coordinates: c.coordinates,
      station: c.station
    })),
    dataSources: [
      {
        name: 'Copernicus Atmosphere Monitoring Service (CAMS)',
        provider: 'European Centre for Medium-Range Weather Forecasts (ECMWF)',
        role: 'Chemical transport & tropospheric aerosol assimilation'
      },
      {
        name: 'Open-Meteo High-Resolution NWP',
        provider: 'National Meteorological Services & WMO',
        role: 'Synoptic boundary layer meteorology & dispersion physics'
      },
      {
        name: 'Central Pollution Control Board (CPCB)',
        provider: 'Ministry of Environment, Forest & Climate Change, Govt. of India',
        role: 'National Ambient Air Quality Index (NAQI) Breakpoint Formulations'
      }
    ],
    generatedAt: new Date().toISOString()
  };

  envCache.set(cacheKey, result, 600); // 10 minutes cache
  return result;
}

/**
 * Filtered rankings endpoint helper
 */
export async function getFilteredRankings(filters = {}) {
  const { region, sortBy = 'cleanest', limit = 20 } = filters;
  const dashboard = await getAnalyticsDashboard();

  let list = sortBy === 'mostPolluted' ? [...dashboard.rankings.mostPolluted] : [...dashboard.rankings.cleanest];

  if (region && region !== 'all' && region !== 'All India') {
    list = list.filter(c => c.region?.toLowerCase() === region.toLowerCase());
  }

  // Re-rank after filter
  const reRanked = list.slice(0, Number(limit)).map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));

  return {
    rankings: reRanked,
    total: list.length,
    appliedRegion: region || 'All India',
    sortBy
  };
}
