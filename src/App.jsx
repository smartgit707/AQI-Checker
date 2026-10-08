import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import CurrentAirQuality from './components/home/CurrentAirQuality';
import PollutantBreakdown from './components/home/PollutantBreakdown';
import IndiaMapSection from './components/home/IndiaMapSection';
import VisualCityExplorer from './components/home/VisualCityExplorer';
import EnvironmentalStory from './components/home/EnvironmentalStory';
import HealthSection from './components/home/HealthSection';
import WeatherEnvironment from './components/home/WeatherEnvironment';
import PollutionInsights from './components/home/PollutionInsights';
import DataSources from './components/home/DataSources';
import ErrorBoundary from './components/common/ErrorBoundary';
import { getLatestAirQuality } from './services/api';
import { CITIES_DATA } from './data/mockData';

/**
 * Bulletproof normalizer for telemetry data
 * Guarantees zero runtime errors regardless of whether live APIs return
 * strings, numbers, objects, undefined, or unexpected structures.
 */
function sanitizeActiveCityView(selectedCity, liveEnvData) {
  const baseCity = selectedCity || CITIES_DATA[0] || {};
  const rawWeather = liveEnvData?.weather || {};

  // Temperature
  const temp = rawWeather.temperature ?? baseCity.temperature;
  const safeTemp = typeof temp === 'object' && temp !== null
    ? `${temp?.value ?? 28}°C`
    : String(temp || '28°C');

  // Humidity
  const hum = rawWeather.humidity ?? baseCity.humidity;
  const safeHum = typeof hum === 'object' && hum !== null
    ? `${hum?.value ?? 60}%`
    : String(hum || '60%');

  // Wind
  const wind = rawWeather.wind ?? baseCity.wind;
  let safeWind = '12 km/h NW';
  if (typeof wind === 'string' && wind.trim()) {
    safeWind = wind;
  } else if (typeof wind === 'object' && wind !== null) {
    const spd = wind.speed ?? wind.value ?? 12;
    const dir = wind.direction ?? 'NW';
    safeWind = `${spd} km/h ${dir}`.trim();
  }

  // Trend
  const rawTrend = liveEnvData?.trend24h ?? liveEnvData?.trend ?? baseCity.trend;
  let safeTrend = '-2%';
  if (typeof rawTrend === 'string') {
    safeTrend = rawTrend;
  } else if (typeof rawTrend === 'object' && rawTrend !== null) {
    safeTrend = String(rawTrend?.changePercent || rawTrend?.direction || '-2%');
  }

  // Barometric Pressure & Visibility
  const press = rawWeather.pressure ?? baseCity.pressure;
  const safePress = typeof press === 'object' && press !== null
    ? `${press?.value ?? 1013} hPa`
    : String(press || '1013 hPa');

  const vis = rawWeather.visibility ?? baseCity.visibility;
  const safeVis = typeof vis === 'object' && vis !== null
    ? `${vis?.value ?? 7.5} km`
    : String(vis || '7.5 km');

  // AQI
  const rawAqi = liveEnvData?.aqi ?? baseCity.aqi ?? 50;
  const safeAqi = typeof rawAqi === 'number' && !isNaN(rawAqi)
    ? rawAqi
    : (Number(rawAqi) || 50);

  // Hourly Forecast
  const rawHourly = liveEnvData?.hourlyForecast ?? baseCity.hourlyForecast;
  const safeHourly = Array.isArray(rawHourly) && rawHourly.length > 0
    ? rawHourly
    : (baseCity.hourlyForecast || []);

  // Pollutants Array
  const rawPollutants = liveEnvData?.pollutants ?? baseCity.pollutants;
  const safePollutants = Array.isArray(rawPollutants) && rawPollutants.length > 0
    ? rawPollutants
    : (baseCity.pollutants || []);

  return {
    ...baseCity,
    id: baseCity.slug || baseCity.id || 'chennai',
    slug: baseCity.slug || baseCity.id || 'chennai',
    name: baseCity.name || 'Chennai',
    state: baseCity.state || 'Tamil Nadu',
    aqi: safeAqi,
    status: liveEnvData?.category || liveEnvData?.status || baseCity.status || 'Moderate',
    dominantPollutant: liveEnvData?.dominantPollutant || baseCity.dominantPollutant || 'PM2.5',
    trend: safeTrend,
    temperature: safeTemp,
    humidity: safeHum,
    wind: safeWind,
    pressure: safePress,
    visibility: safeVis,
    station: liveEnvData?.station || baseCity.station || 'CPCB Telemetry Station',
    updatedAt: liveEnvData?.timestamp
      ? `${new Date(liveEnvData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Live Assimilation)`
      : (baseCity.updatedAt || 'Live Telemetry'),
    hourlyForecast: safeHourly,
    pollutants: safePollutants,
    isLive: !!liveEnvData?.isLive,
    source: liveEnvData?.source
  };
}

export default function App() {
  // Default active monitored city is Chennai
  const [selectedCity, setSelectedCity] = useState(CITIES_DATA[0]);
  const [liveEnvData, setLiveEnvData] = useState(null);
  const [loadingLive, setLoadingLive] = useState(false);

  // Fetch real atmospheric & weather telemetry whenever selected city changes
  useEffect(() => {
    let isCurrent = true;
    async function loadTelemetry() {
      const citySlug = selectedCity?.slug || selectedCity?.id;
      if (!citySlug) return;

      try {
        setLoadingLive(true);
        const res = await getLatestAirQuality(citySlug);
        if (isCurrent && res && res.data) {
          setLiveEnvData(res.data);
        }
      } catch (err) {
        console.warn(`[App] Falling back to local data for ${citySlug}`);
        if (isCurrent) setLiveEnvData(null);
      } finally {
        if (isCurrent) setLoadingLive(false);
      }
    }

    loadTelemetry();
    return () => { isCurrent = false; };
  }, [selectedCity?.id, selectedCity?.slug]);

  const handleSelectCity = (city) => {
    if (!city) return;
    const localMatch = CITIES_DATA.find(c => c.id === (city.slug || city.id) || c.name === city.name);
    setSelectedCity(localMatch || {
      id: city.slug || city.id,
      slug: city.slug || city.id,
      name: city.name || 'City',
      state: city.state || 'India',
      station: city.station || 'CPCB Telemetry Station',
      coordinates: city.coordinates || { lat: 28.61, lng: 77.20 },
      image: city.image || (localMatch ? localMatch.image : null),
      imageAlt: `${city.name || 'City'} urban environmental vista`
    });
  };

  // Safely merged and formatted telemetry view
  const activeCityView = useMemo(() => {
    return sanitizeActiveCityView(selectedCity, liveEnvData);
  }, [selectedCity, liveEnvData]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* 1. Global Navigation */}
      <Navbar onSelectCity={handleSelectCity} selectedCity={activeCityView} />

      <main className="flex-1">
        {/* 2. Hero Section with Real Telemetry Snapshot & Search */}
        <div id="overview">
          <ErrorBoundary inline sectionName="Hero Overview">
            <Hero onSelectCity={handleSelectCity} currentCity={activeCityView} />
          </ErrorBoundary>
        </div>

        {/* 3. Current Air Quality with SVG Gauge, Hourly Diurnal Forecast & Local Station Details */}
        <ErrorBoundary inline sectionName="Live Air Quality">
          <CurrentAirQuality city={activeCityView} />
        </ErrorBoundary>

        {/* 4. Chemical & Particulate Pollutant Breakdown (PM2.5, PM10, NO2, SO2, CO, O3) */}
        <ErrorBoundary inline sectionName="Pollutant Breakdown">
          <PollutantBreakdown pollutants={activeCityView.pollutants} cityName={activeCityView.name} />
        </ErrorBoundary>

        {/* 5. Real Interactive India Leaflet Map with Live Station Pins & Dynamic Rankings */}
        <ErrorBoundary inline sectionName="Interactive India Map">
          <IndiaMapSection onSelectCity={handleSelectCity} selectedCity={activeCityView} />
        </ErrorBoundary>

        {/* 6. Visual City Explorer with High-Resolution Curated City Photography */}
        <ErrorBoundary inline sectionName="City Explorer">
          <VisualCityExplorer onSelectCity={handleSelectCity} activeCityId={activeCityView.id} />
        </ErrorBoundary>

        {/* 7. Environmental Story (Atmosphere, Aerosols, PM Science & Nature Photo) */}
        <EnvironmentalStory />

        {/* 8. Health & Air Quality (Lifestyle, Exercise, Vulnerable Groups, Home Filtration) */}
        <HealthSection />

        {/* 9. Weather + Atmospheric Dispersion Dynamics */}
        <ErrorBoundary inline sectionName="Weather Dispersion">
          <WeatherEnvironment city={activeCityView} />
        </ErrorBoundary>

        {/* 10. Pollution Insights & Science Journalism Articles */}
        <PollutionInsights />

        {/* 11. Data Sources & Continuous Ingestion Architecture */}
        <DataSources />
      </main>

      {/* 12. Complete Product Footer */}
      <Footer />

    </div>
  );
}
