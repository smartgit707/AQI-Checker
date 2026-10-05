import { CITIES_DATA } from '../data/mockData';
import { getAQILevel } from '../design-system/aqiTokens';

export const STATE_TO_REGION = {
  'National Capital Territory': 'North India',
  'Delhi': 'North India',
  'Punjab': 'North India',
  'Haryana': 'North India',
  'Punjab & Haryana': 'North India',
  'Himachal Pradesh': 'North India',
  'Rajasthan': 'North India',
  'Uttar Pradesh': 'North India',
  'Tamil Nadu': 'South India',
  'Karnataka': 'South India',
  'Telangana': 'South India',
  'Andhra Pradesh': 'South India',
  'Kerala': 'South India',
  'Maharashtra': 'West India',
  'Gujarat': 'West India',
  'West Bengal': 'East India',
  'Bihar': 'East India',
  'Madhya Pradesh': 'Central India',
  'Assam': 'Northeast India'
};

export function getRegionForState(stateName) {
  if (!stateName) return 'Central India';
  for (const [st, reg] of Object.entries(STATE_TO_REGION)) {
    if (stateName.toLowerCase().includes(st.toLowerCase()) || st.toLowerCase().includes(stateName.toLowerCase())) {
      return reg;
    }
  }
  return 'Central India';
}

export function buildFallbackAnalytics() {
  const cities = CITIES_DATA;
  const aqiValues = cities.map(c => c.aqi);
  const totalAqi = aqiValues.reduce((sum, v) => sum + v, 0);
  const averageAqi = Math.round(totalAqi / cities.length);

  const sorted = [...cities].sort((a, b) => a.aqi - b.aqi);
  const cleanest = sorted[0];
  const mostPolluted = sorted[sorted.length - 1];

  let goodCount = 0;
  let moderateCount = 0;
  let poorCount = 0;
  let unhealthyCount = 0;
  let severeCount = 0;
  let hazardousCount = 0;

  cities.forEach(c => {
    if (c.aqi <= 50) goodCount++;
    else if (c.aqi <= 100) moderateCount++;
    else if (c.aqi <= 200) poorCount++;
    else if (c.aqi <= 300) unhealthyCount++;
    else if (c.aqi <= 400) severeCount++;
    else hazardousCount++;
  });

  const overview = {
    averageAqi,
    nationalCategory: getAQILevel(averageAqi).category,
    totalCities: cities.length,
    bestCity: {
      name: cleanest.name,
      slug: cleanest.id,
      state: cleanest.state,
      aqi: cleanest.aqi,
      category: cleanest.status,
      dominantPollutant: cleanest.dominantPollutant,
      image: cleanest.image
    },
    worstCity: {
      name: mostPolluted.name,
      slug: mostPolluted.id,
      state: mostPolluted.state,
      aqi: mostPolluted.aqi,
      category: mostPolluted.status,
      dominantPollutant: mostPolluted.dominantPollutant,
      image: mostPolluted.image
    },
    goodCitiesCount: goodCount,
    moderateCitiesCount: moderateCount,
    poorOrWorseCount: poorCount + unhealthyCount + severeCount + hazardousCount,
    unhealthyCount,
    severeCount,
    hazardousCount,
    dominantNationalPollutant: 'PM2.5',
    dominantCount: cities.filter(c => c.dominantPollutant === 'PM2.5').length,
    lastUpdated: new Date().toISOString()
  };

  const distribution = [
    { category: 'Good', min: 0, max: 50, color: '#10b981', count: goodCount, percentage: Math.round((goodCount / cities.length) * 100), description: 'Minimal health impact, clean air' },
    { category: 'Moderate', min: 51, max: 100, color: '#f59e0b', count: moderateCount, percentage: Math.round((moderateCount / cities.length) * 100), description: 'Minor breathing discomfort for sensitive groups' },
    { category: 'Poor', min: 101, max: 200, color: '#f97316', count: poorCount, percentage: Math.round((poorCount / cities.length) * 100), description: 'Breathing discomfort to people with respiratory disease' },
    { category: 'Unhealthy', min: 201, max: 300, color: '#ef4444', count: unhealthyCount, percentage: Math.round((unhealthyCount / cities.length) * 100), description: 'Breathing discomfort to most people on prolonged exposure' },
    { category: 'Severe', min: 301, max: 400, color: '#8b5cf6', count: severeCount, percentage: Math.round((severeCount / cities.length) * 100), description: 'Respiratory effects in healthy population; acute impacts' },
    { category: 'Hazardous', min: 401, max: 500, color: '#7f1d1d', count: hazardousCount, percentage: Math.round((hazardousCount / cities.length) * 100), description: 'Emergency warnings; entire population at acute risk' }
  ];

  const regionMap = {};
  cities.forEach(city => {
    const reg = getRegionForState(city.state);
    if (!regionMap[reg]) {
      regionMap[reg] = { region: reg, cities: [], totalAqi: 0 };
    }
    regionMap[reg].cities.push(city);
    regionMap[reg].totalAqi += city.aqi;
  });

  const regional = Object.values(regionMap).map(r => {
    const sortedR = [...r.cities].sort((a, b) => a.aqi - b.aqi);
    const avg = Math.round(r.totalAqi / r.cities.length);
    const lvl = getAQILevel(avg);
    return {
      region: r.region,
      cityCount: r.cities.length,
      averageAqi: avg,
      category: lvl.category,
      color: lvl.color,
      cleanestCity: { name: sortedR[0].name, slug: sortedR[0].id, aqi: sortedR[0].aqi },
      mostPollutedCity: { name: sortedR[sortedR.length - 1].name, slug: sortedR[sortedR.length - 1].id, aqi: sortedR[sortedR.length - 1].aqi },
      cities: r.cities.map(c => ({ name: c.name, slug: c.id, aqi: c.aqi, category: c.status, state: c.state }))
    };
  }).sort((a, b) => a.averageAqi - b.averageAqi);

  const pollutantCodes = [
    { code: 'PM2.5', name: 'Fine Particulates (PM2.5)', unit: 'µg/m³', limit: 60 },
    { code: 'PM10', name: 'Coarse Particulates (PM10)', unit: 'µg/m³', limit: 100 },
    { code: 'NO2', name: 'Nitrogen Dioxide (NO2)', unit: 'ppb', limit: 80 },
    { code: 'SO2', name: 'Sulfur Dioxide (SO2)', unit: 'ppb', limit: 80 },
    { code: 'CO', name: 'Carbon Monoxide (CO)', unit: 'mg/m³', limit: 4.0 },
    { code: 'O3', name: 'Ground-level Ozone (O3)', unit: 'ppb', limit: 100 }
  ];

  const pollutants = pollutantCodes.map(std => {
    let sum = 0;
    let cnt = 0;
    let max = -1;
    let maxCity = null;

    cities.forEach(c => {
      const p = c.pollutants?.find(item => item.code.replace(/[₂₃]/g, '') === std.code.replace(/[.0-9]/g, '') || item.code === std.code);
      if (p && typeof p.value === 'number') {
        sum += p.value;
        cnt++;
        if (p.value > max) {
          max = p.value;
          maxCity = { name: c.name, slug: c.id, value: p.value };
        }
      }
    });

    const avg = cnt > 0 ? Number((sum / cnt).toFixed(1)) : 25;
    return {
      code: std.code,
      name: std.name,
      unit: std.unit,
      limit: std.limit,
      averageValue: avg,
      percentageOfLimit: Math.round((avg / std.limit) * 100),
      highestCity: maxCity || { name: 'Delhi', slug: 'delhi', value: 180 },
      monitoredStationsCount: cnt
    };
  });

  const rankings = {
    cleanest: sorted.map((c, idx) => ({
      rank: idx + 1,
      name: c.name,
      slug: c.id,
      state: c.state,
      region: getRegionForState(c.state),
      aqi: c.aqi,
      category: c.status,
      dominantPollutant: c.dominantPollutant,
      temperature: c.temperature,
      image: c.image
    })),
    mostPolluted: [...sorted].reverse().map((c, idx) => ({
      rank: idx + 1,
      name: c.name,
      slug: c.id,
      state: c.state,
      region: getRegionForState(c.state),
      aqi: c.aqi,
      category: c.status,
      dominantPollutant: c.dominantPollutant,
      temperature: c.temperature,
      image: c.image
    }))
  };

  const insights = [
    {
      id: 'dominant-pollutant',
      type: 'pollutant',
      title: 'PM2.5 Dominates Urban Atmospheres',
      description: `Fine particulate matter (PM2.5) represents the dominant primary pollutant across ${overview.dominantCount} of ${overview.totalCities} monitored Indian metropolises.`,
      metric: 'PM2.5',
      significance: 'Critical Focus'
    },
    {
      id: 'aqi-span',
      type: 'gradient',
      title: 'Geographic Air Index Gradient',
      description: `A significant difference of ${mostPolluted.aqi - cleanest.aqi} AQI points separates India's cleanest monitored station (${cleanest.name}, AQI ${cleanest.aqi}) from the most impacted (${mostPolluted.name}, AQI ${mostPolluted.aqi}).`,
      metric: `Δ ${mostPolluted.aqi - cleanest.aqi} AQI`,
      significance: 'Dispersion Variance'
    },
    {
      id: 'compliance-rate',
      type: 'compliance',
      title: 'National Standards Compliance Rate',
      description: `${Math.round(((goodCount + moderateCount) / cities.length) * 100)}% of continuously monitored urban zones currently meet CPCB Good or Moderate environmental thresholds.`,
      metric: `${Math.round(((goodCount + moderateCount) / cities.length) * 100)}% Compliant`,
      significance: 'Moderate Baseline'
    }
  ];

  return {
    overview,
    distribution,
    rankings,
    regional,
    pollutants,
    insights,
    citiesList: cities.map(c => ({
      name: c.name,
      slug: c.id,
      state: c.state,
      region: getRegionForState(c.state),
      aqi: c.aqi,
      category: c.status,
      coordinates: c.coordinates,
      station: c.station
    })),
    dataSources: [
      { name: 'Copernicus Atmosphere Monitoring Service (CAMS)', provider: 'ECMWF', role: 'Chemical transport & tropospheric aerosol assimilation' },
      { name: 'Open-Meteo High-Resolution NWP', provider: 'WMO & National Meteorological Services', role: 'Boundary layer meteorology & dispersion physics' },
      { name: 'Central Pollution Control Board (CPCB)', provider: 'MoEFCC, Government of India', role: 'National Ambient Air Quality Index (NAQI) Standards' }
    ],
    generatedAt: new Date().toISOString()
  };
}

export function buildFallbackComparison(slugs = ['delhi', 'mumbai'], period = '7d') {
  const cityProfiles = slugs.map(slug => {
    const found = CITIES_DATA.find(c => c.id === slug || c.name.toLowerCase().includes(slug.toLowerCase())) || CITIES_DATA[0];
    return {
      city: {
        id: found.id,
        slug: found.id,
        name: found.name,
        state: found.state,
        country: 'India',
        coordinates: found.coordinates,
        station: found.station,
        image: found.image,
        imageAlt: found.imageAlt
      },
      airQuality: {
        aqi: found.aqi,
        category: found.status,
        dominantPollutant: found.dominantPollutant,
        trend24h: found.trend,
        timestamp: new Date().toISOString(),
        retrievedAt: new Date().toISOString(),
        pollutants: found.pollutants
      },
      weather: {
        temperature: found.temperature,
        humidity: found.humidity,
        wind: found.wind,
        pressure: found.pressure,
        visibility: found.visibility
      },
      history: {
        period,
        points: [
          { date: 'Day 1', label: '6d ago', aqi: Math.max(20, found.aqi - 10) },
          { date: 'Day 2', label: '5d ago', aqi: Math.max(20, found.aqi - 6) },
          { date: 'Day 3', label: '4d ago', aqi: Math.max(20, found.aqi - 2) },
          { date: 'Day 4', label: '3d ago', aqi: Math.max(20, found.aqi + 5) },
          { date: 'Day 5', label: '2d ago', aqi: Math.max(20, found.aqi + 3) },
          { date: 'Day 6', label: 'Yesterday', aqi: Math.max(20, found.aqi - 4) },
          { date: 'Day 7', label: 'Today', aqi: found.aqi }
        ]
      }
    };
  });

  const pollutantCodes = [
    { code: 'PM2.5', name: 'Fine Particulates (PM2.5)', unit: 'µg/m³', limit: 60 },
    { code: 'PM10', name: 'Coarse Particulates (PM10)', unit: 'µg/m³', limit: 100 },
    { code: 'NO2', name: 'Nitrogen Dioxide (NO2)', unit: 'ppb', limit: 80 },
    { code: 'SO2', name: 'Sulfur Dioxide (SO2)', unit: 'ppb', limit: 80 },
    { code: 'CO', name: 'Carbon Monoxide (CO)', unit: 'mg/m³', limit: 4.0 },
    { code: 'O3', name: 'Ground-level Ozone (O3)', unit: 'ppb', limit: 100 }
  ];

  const pollutantMatrix = pollutantCodes.map(spec => {
    const values = {};
    cityProfiles.forEach(cp => {
      const p = cp.airQuality.pollutants?.find(item => item.code.replace(/[₂₃]/g, '') === spec.code.replace(/[.0-9]/g, '') || item.code === spec.code);
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

  const timelineMatrix = [
    { label: '6d ago', date: 'Day 1', cities: {} },
    { label: '5d ago', date: 'Day 2', cities: {} },
    { label: '4d ago', date: 'Day 3', cities: {} },
    { label: '3d ago', date: 'Day 4', cities: {} },
    { label: '2d ago', date: 'Day 5', cities: {} },
    { label: 'Yesterday', date: 'Day 6', cities: {} },
    { label: 'Today', date: 'Day 7', cities: {} }
  ];

  timelineMatrix.forEach((tm, idx) => {
    cityProfiles.forEach(cp => {
      tm.cities[cp.city.slug] = cp.history.points[idx]?.aqi || cp.airQuality.aqi;
    });
  });

  const sorted = [...cityProfiles].sort((a, b) => a.airQuality.aqi - b.airQuality.aqi);

  return {
    cities: cityProfiles,
    pollutantMatrix,
    timelineMatrix,
    period,
    summary: {
      cleanestCity: sorted[0].city.name,
      mostPollutedCity: sorted[sorted.length - 1].city.name,
      aqiSpread: sorted[sorted.length - 1].airQuality.aqi - sorted[0].airQuality.aqi,
      cityCount: cityProfiles.length
    },
    dataSources: [
      { name: 'Copernicus Atmosphere Monitoring Service (CAMS)', provider: 'ECMWF', role: 'Tropospheric aerosol models' },
      { name: 'Open-Meteo High-Resolution NWP', provider: 'WMO & National Meteorological Services', role: 'Boundary layer kinematics' },
      { name: 'Central Pollution Control Board (CPCB)', provider: 'MoEFCC, Govt. of India', role: 'National Air Quality Index (NAQI) Scale' }
    ],
    generatedAt: new Date().toISOString()
  };
}
