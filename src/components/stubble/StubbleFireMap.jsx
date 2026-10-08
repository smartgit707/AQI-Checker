import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  CircleMarker, 
  Polyline, 
  Tooltip, 
  Popup,
  useMap 
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  THERMAL_HOTSPOTS, 
  WIND_PLUME_STREAMLINES, 
  IMPACTED_DOWNWIND_CITIES 
} from '../../data/stubbleFireData';
import { Flame, Wind, Eye, Info, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Controller to ensure map tiles immediately calculate full size
 */
function MapController() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function StubbleFireMap({ onSelectHotspot, selectedHotspot }) {
  const { currentLang, t } = useLanguage();

  const [showHotspots, setShowHotspots] = useState(true);
  const [showPlumes, setShowPlumes] = useState(true);
  const [showCities, setShowCities] = useState(true);

  // Center on Indo-Gangetic Plain (North India)
  const mapCenter = [29.35, 76.85];

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] rounded-3xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100">
      
      <MapContainer
        center={mapCenter}
        zoom={6.8}
        minZoom={5.5}
        maxZoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        style={{ height: '100%', width: '100%' }}
      >
        <MapController />

        {/* Free, Open OpenStreetMap Standard Base Map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* 1. Atmospheric Wind Streamlines (Smoke Funnel Corridors) */}
        {showPlumes && WIND_PLUME_STREAMLINES.map((plume) => (
          <React.Fragment key={plume.id}>
            {/* Outer Haze Halo */}
            <Polyline
              positions={plume.path}
              pathOptions={{
                color: '#f97316',
                weight: 12,
                opacity: 0.18,
                lineCap: 'round'
              }}
            />
            {/* Main Directional Vector */}
            <Polyline
              positions={plume.path}
              pathOptions={{
                color: '#ea580c',
                weight: 4,
                opacity: 0.85,
                dashArray: '10, 12'
              }}
            >
              <Tooltip sticky>
                <div className="text-xs p-1">
                  <div className="font-bold text-amber-700 flex items-center gap-1">
                    <Wind className="w-3 h-3" />
                    <span>{plume.name}</span>
                  </div>
                  <div className="text-slate-600">
                    Speed: <strong>{plume.speedKmh} km/h NW➔SE</strong>
                  </div>
                  <div className="text-[10px] text-amber-600 font-semibold">
                    {plume.density}
                  </div>
                </div>
              </Tooltip>
            </Polyline>
          </React.Fragment>
        ))}

        {/* 2. Thermal Anomaly Farm Fire Hotspots (NASA FIRMS Telemetry) */}
        {showHotspots && THERMAL_HOTSPOTS.map((hotspot) => {
          const isSelected = selectedHotspot?.id === hotspot.id;
          const radius = Math.max(7, Math.min(18, Math.sqrt(hotspot.fireCount) * 1.2));

          return (
            <React.Fragment key={hotspot.id}>
              {/* Outer Radiant Heat Glow */}
              <CircleMarker
                center={hotspot.coords}
                radius={radius + 4}
                pathOptions={{
                  fillColor: '#ef4444',
                  fillOpacity: 0.25,
                  stroke: false
                }}
              />
              
              {/* Primary Fire Core */}
              <CircleMarker
                center={hotspot.coords}
                radius={radius}
                pathOptions={{
                  fillColor: isSelected ? '#fbbf24' : '#dc2626',
                  fillOpacity: 0.9,
                  color: '#ffffff',
                  weight: isSelected ? 3 : 1.5
                }}
                eventHandlers={{
                  click: () => onSelectHotspot && onSelectHotspot(hotspot)
                }}
              >
                <Tooltip direction="top" offset={[0, -5]}>
                  <div className="text-xs p-1 min-w-[140px]">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1 mb-1">
                      <strong className="text-rose-700 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                        {hotspot.district}, {hotspot.state}
                      </strong>
                    </div>
                    <div className="text-slate-700 font-medium">
                      Active Fires: <strong className="text-rose-600">{hotspot.fireCount}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Radiative Power: <strong>{hotspot.frpMW} MW</strong>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      Satellite Conf: {hotspot.confidence} ({hotspot.satellite})
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* 3. Downwind Impacted Megacities (AQI Receivers) */}
        {showCities && IMPACTED_DOWNWIND_CITIES.map((city) => (
          <CircleMarker
            key={city.name}
            center={city.coords}
            radius={9}
            pathOptions={{
              fillColor: '#7c3aed',
              fillOpacity: 0.95,
              color: '#ffffff',
              weight: 2.5
            }}
          >
            <Tooltip permanent direction="bottom" offset={[0, 10]}>
              <div className="text-center font-sans">
                <span className="block text-[11px] font-black text-slate-900 leading-tight">
                  {city.name}
                </span>
                <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                  AQI {city.currentAqi} • +{city.stubbleSharePct}% Stubble
                </span>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

      </MapContainer>

      {/* Floating Map Layer Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-200/90 text-xs pointer-events-auto space-y-2 max-w-[220px]">
        <div className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-1.5">
          <span>Satellite Layers</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
        </div>

        <button
          type="button"
          onClick={() => setShowHotspots(!showHotspots)}
          className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-all text-left ${
            showHotspots ? 'bg-rose-50 text-rose-800 font-bold' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Thermal Fires</span>
          </div>
          <span className="font-mono text-2xs">{THERMAL_HOTSPOTS.length} hubs</span>
        </button>

        <button
          type="button"
          onClick={() => setShowPlumes(!showPlumes)}
          className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-all text-left ${
            showPlumes ? 'bg-amber-50 text-amber-800 font-bold' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-amber-600" />
            <span>NW Wind Plumes</span>
          </div>
          <span className="font-mono text-2xs">3 vectors</span>
        </button>

        <button
          type="button"
          onClick={() => setShowCities(!showCities)}
          className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-all text-left ${
            showCities ? 'bg-purple-50 text-purple-800 font-bold' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
            <span>Downwind AQI</span>
          </div>
          <span className="font-mono text-2xs">{IMPACTED_DOWNWIND_CITIES.length} cities</span>
        </button>
      </div>

      {/* Floating Bottom Telemetry Status Pill */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-slate-700/80 text-[11px] flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>NASA VIIRS 375m & MODIS Active Stream</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">Indo-Gangetic Basin</span>
        </div>
      </div>

    </div>
  );
}
