import React, { useState, useEffect } from 'react';
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
import { getLatestAirQuality, getCityBySlug } from './services/api';
import { CITIES_DATA } from './data/mockData';

export default function App() {
  // Default active monitored city is Chennai
  const [selectedCity, setSelectedCity] = useState(CITIES_DATA[0]);
  const [liveEnvData, setLiveEnvData] = useState(null);
  const [loadingLive, setLoadingLive] = useState(false);

  // Fetch real atmospheric & weather telemetry whenever selected city changes
  useEffect(() => {
    let isCurrent = true;
    async function loadTelemetry() {
      const citySlug = selectedCity.slug || selectedCity.id;
      if (!citySlug) return;

      try {
        setLoadingLive(true);
        const res = await getLatestAirQuality(citySlug);
        if (isCurrent && res.data) {
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
  }, [selectedCity.id, selectedCity.slug]);

  const handleSelectCity = (city) => {
    // If selecting from map or search, ensure proper structure
    const localMatch = CITIES_DATA.find(c => c.id === (city.slug || city.id) || c.name === city.name);
    setSelectedCity(localMatch || {
      id: city.slug || city.id,
      slug: city.slug || city.id,
      name: city.name,
      state: city.state,
      station: city.station || 'CPCB Telemetry Station',
      coordinates: city.coordinates || { lat: 28.61, lng: 77.20 },
      image: city.image || (localMatch ? localMatch.image : null),
      imageAlt: `${city.name} urban environmental vista`
    });
  };

  // Merge selected city with live telemetry if available
  const activeCityView = {
    ...selectedCity,
    aqi: liveEnvData ? liveEnvData.aqi : selectedCity.aqi,
    status: liveEnvData ? liveEnvData.category : selectedCity.status,
    dominantPollutant: liveEnvData ? liveEnvData.dominantPollutant : selectedCity.dominantPollutant,
    temperature: liveEnvData?.weather?.temperature || selectedCity.temperature,
    humidity: liveEnvData?.weather?.humidity || selectedCity.humidity,
    wind: liveEnvData?.weather?.wind || selectedCity.wind,
    pressure: liveEnvData?.weather?.pressure || selectedCity.pressure,
    visibility: liveEnvData?.weather?.visibility || selectedCity.visibility,
    station: liveEnvData?.station || selectedCity.station,
    updatedAt: liveEnvData?.timestamp ? `${new Date(liveEnvData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Live Assimilation)` : selectedCity.updatedAt,
    hourlyForecast: liveEnvData?.hourlyForecast || selectedCity.hourlyForecast,
    pollutants: liveEnvData?.pollutants || selectedCity.pollutants,
    isLive: !!liveEnvData?.isLive,
    source: liveEnvData?.source
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* 1. Global Navigation */}
      <Navbar onSelectCity={handleSelectCity} selectedCity={activeCityView} />

      <main className="flex-1">
        {/* 2. Hero Section with Real Telemetry Snapshot & Search */}
        <div id="overview">
          <Hero onSelectCity={handleSelectCity} currentCity={activeCityView} />
        </div>

        {/* 3. Current Air Quality with SVG Gauge, Hourly Diurnal Forecast & Local Station Details */}
        <CurrentAirQuality city={activeCityView} />

        {/* 4. Chemical & Particulate Pollutant Breakdown (PM2.5, PM10, NO2, SO2, CO, O3) */}
        <PollutantBreakdown pollutants={activeCityView.pollutants} cityName={activeCityView.name} />

        {/* 5. Real Interactive India Leaflet Map with Live Station Pins & Dynamic Rankings */}
        <IndiaMapSection onSelectCity={handleSelectCity} selectedCity={activeCityView} />

        {/* 6. Visual City Explorer with High-Resolution Curated City Photography */}
        <VisualCityExplorer onSelectCity={handleSelectCity} activeCityId={activeCityView.id} />

        {/* 7. Environmental Story (Atmosphere, Aerosols, PM Science & Nature Photo) */}
        <EnvironmentalStory />

        {/* 8. Health & Air Quality (Lifestyle, Exercise, Vulnerable Groups, Home Filtration) */}
        <HealthSection />

        {/* 9. Weather + Atmospheric Dispersion Dynamics */}
        <WeatherEnvironment city={activeCityView} />

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
