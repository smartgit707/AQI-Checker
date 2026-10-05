import React from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  Compass, 
  Eye, 
  Gauge,
  Sunrise,
  Sunset
} from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import OptimizedImage from '../common/OptimizedImage';
import { IMAGES } from '../../data/images';
import { getAQILevel } from '../../design-system/aqiTokens';

export default function WeatherEnvironment({ city }) {
  const level = getAQILevel(city.aqi);

  return (
    <section id="meteorology" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="Synoptic Climatology"
          title={`Weather & Atmospheric Dispersion — ${city.name}`}
          subtitle="How thermal turbulence, planetary boundary layer dynamics, and relative humidity drive local pollution accumulation."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Editorial Weather Atmosphere Photo (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl overflow-hidden relative shadow-card border border-slate-200/90 min-h-[300px]">
            <OptimizedImage
              src={IMAGES.editorial.weatherWindClouds}
              alt={IMAGES.editorial.weatherWindCloudsAlt}
              aspectRatio="h-full w-full"
              className="h-full w-full"
              overlay={
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-black/20" />
              }
            />

            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                Micro-Climate Index
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-3xl font-extrabold font-display block mb-1">
                {city.temperature}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Atmospheric mixing layer estimated at ~1,100m. Gentle surface ventilation allows steady gradual pollutant dispersion across coastal corridors.
              </p>
            </div>
          </div>

          {/* Meteorological Data Cards Grid (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">Surface Air Temp</span>
                <Thermometer className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 font-display block">
                  {city.temperature}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Heat index feels like 33°C</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Warm surface promotes buoyant vertical plume rise.
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">Relative Humidity</span>
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 font-display block">
                  {city.humidity}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Dew Point: 23°C</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                High humidity causes hygroscopic particle swelling.
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">Wind Velocity</span>
                <Wind className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 font-display block">
                  {(city.wind || '12 km/h NW').split(' ')[0]} <span className="text-base font-semibold">km/h</span>
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Direction: {(city.wind || '12 km/h NW').split(' ').slice(1).join(' ') || 'Variable'}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Sufficient airflow preventing stagnation basins.
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">Barometric Pressure</span>
                <Gauge className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 font-display block">
                  {city.pressure}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Mean sea-level altitude</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Normal atmospheric pressure system.
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">Visual Transparency</span>
                <Eye className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 font-display block">
                  {city.visibility}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Optically transparent horizon</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Light aerosol scattering without severe optical fog.
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">Solar Cycle</span>
                <Sunrise className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 font-display block">
                  06:05 AM <span className="text-xs font-normal text-slate-400">/ 06:12 PM</span>
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Peak UV Index: 7 (High)</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Midday sunlight triggers photochemical ozone cycles.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
