import { getCityBySlug } from './cityService.js';
import { getLatestAirQualityForCity, getAirQualityHistoryForCity } from './airQualityService.js';
import { envCache } from '../utils/cache.js';

/**
 * Compare between 2 and 4 cities side-by-side
 */
export async function compareCities(rawSlugs = [], period = '7d') {
  // Normalize and deduplicate slugs
  let slugs = [];
  if (Array.isArray(rawSlugs)) {
    slugs = rawSlugs.map(s => String(s).trim().toLowerCase()).filter(Boolean);
  } else if (typeof rawSlugs === 'string') {
    slugs = rawSlugs.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  }

  // Deduplicate
  slugs = [...new Set(slugs)];

  if (slugs.length < 2) {
    throw new Error('City comparison requires at least 2 cities. Please select 2 to 4 cities.');
  }

  if (slugs.length > 4) {
    slugs = slugs.slice(0, 4); // Enforce maximum 4 cities
  }

  const sanitizedPeriod = ['24h', '7d', '30d', '90d'].includes(period) ? period : '7d';
  const cacheKey = `compare_${slugs.sort().join('_')}_${sanitizedPeriod}`;
  const cached = envCache.get(cacheKey);
  if (cached) return cached;

  // Retrieve data for all cities in parallel
  const cityProfiles = await Promise.all(
    slugs.map(async (slug) => {
      const city = await getCityBySlug(slug);
      if (!city) {
        throw new Error(`Monitored city with slug '${slug}' not found in active registry.`);
      }

      const [airQuality, history] = await Promise.all([
        getLatestAirQualityForCity(slug),
        getAirQualityHistoryForCity(slug, sanitizedPeriod)
      ]);

      return {
        city: {
          id: city.slug,
          slug: city.slug,
          name: city.name,
          state: city.state,
          country: city.country || 'India',
          coordinates: city.coordinates,
          station: city.station,
          image: city.image?.url || '',
          imageAlt: city.image?.alt || `${city.name} skyline`,
          description: city.description,
          population: city.population
        },
        airQuality: {
          aqi: airQuality.aqi,
          category: airQuality.category,
          dominantPollutant: airQuality.dominantPollutant,
          trend24h: airQuality.trend24h || airQuality.trend || '0%',
          timestamp: airQuality.timestamp || new Date().toISOString(),
          retrievedAt: airQuality.retrievedAt || new Date().toISOString(),
          pollutants: airQuality.pollutants || []
        },
        weather: {
          temperature: airQuality.weather?.temperature || '28°C',
          humidity: airQuality.weather?.humidity || '60%',
          wind: airQuality.weather?.wind || '10 km/h NW',
          pressure: airQuality.weather?.pressure || '1013 hPa',
          visibility: airQuality.weather?.visibility || '7.5 km'
        },
        history
      };
    })
  );

  // Pollutants comparison rows
  const pollutantCodes = [
    { code: 'PM2.5', name: 'Fine Particulate Matter', unit: 'µg/m³', limit: 60 },
    { code: 'PM10', name: 'Coarse Particulates', unit: 'µg/m³', limit: 100 },
    { code: 'NO2', name: 'Nitrogen Dioxide', unit: 'ppb', limit: 80 },
    { code: 'SO2', name: 'Sulfur Dioxide', unit: 'ppb', limit: 80 },
    { code: 'CO', name: 'Carbon Monoxide', unit: 'mg/m³', limit: 4.0 },
    { code: 'O3', name: 'Ground-level Ozone', unit: 'ppb', limit: 100 }
  ];

  const pollutantMatrix = pollutantCodes.map(spec => {
    const values = {};
    cityProfiles.forEach(cp => {
      const p = cp.airQuality.pollutants?.find(item => item.code === spec.code || item.code?.replace('.', '') === spec.code);
      values[cp.city.slug] = p ? {
        value: p.value,
        status: p.status,
        trend: p.trend,
        percentageOfLimit: Math.round((p.value / spec.limit) * 100)
      } : null;
    });

    return {
      code: spec.code,
      name: spec.name,
      unit: spec.unit,
      limit: spec.limit,
      values
    };
  });

  // Aligned Timeline Comparison
  // Find common or union dates
  const timelineDates = [];
  const dateSet = new Set();

  cityProfiles.forEach(cp => {
    (cp.history?.points || []).forEach(pt => {
      const key = pt.label || pt.date;
      if (!dateSet.has(key)) {
        dateSet.add(key);
        timelineDates.push({ date: pt.date, label: key });
      }
    });
  });

  const timelineMatrix = timelineDates.map(td => {
    const row = { label: td.label, date: td.date, cities: {} };
    cityProfiles.forEach(cp => {
      const match = (cp.history?.points || []).find(p => (p.label || p.date) === td.label);
      row.cities[cp.city.slug] = match ? match.aqi : null;
    });
    return row;
  });

  // Best vs Worst among compared
  const sorted = [...cityProfiles].sort((a, b) => a.airQuality.aqi - b.airQuality.aqi);
  const cleanestCity = sorted[0].city.name;
  const mostPollutedCity = sorted[sorted.length - 1].city.name;
  const aqiSpread = sorted[sorted.length - 1].airQuality.aqi - sorted[0].airQuality.aqi;

  const result = {
    cities: cityProfiles,
    pollutantMatrix,
    timelineMatrix,
    period: sanitizedPeriod,
    summary: {
      cleanestCity,
      mostPollutedCity,
      aqiSpread,
      cityCount: cityProfiles.length
    },
    dataSources: [
      {
        name: 'Copernicus Atmosphere Monitoring Service (CAMS)',
        provider: 'ECMWF',
        role: 'Chemical species & optical depth models'
      },
      {
        name: 'Open-Meteo High-Resolution NWP',
        provider: 'National Meteorological Services & WMO',
        role: 'Surface meteorology & boundary layer kinetics'
      },
      {
        name: 'Central Pollution Control Board (CPCB)',
        provider: 'MoEFCC, Govt. of India',
        role: 'India NAQI Breakpoint Calibration'
      }
    ],
    generatedAt: new Date().toISOString()
  };

  envCache.set(cacheKey, result, 600); // 10 minutes cache
  return result;
}
