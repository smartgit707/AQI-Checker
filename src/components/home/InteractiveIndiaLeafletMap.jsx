import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getAQILevel } from '../../design-system/aqiTokens';

/**
 * Normalizes coordinates whether in {lat, lng} or {latitude, longitude}
 */
function extractCoords(coords) {
  if (!coords) return null;
  const lat = coords.lat ?? coords.latitude;
  const lng = coords.lng ?? coords.longitude;
  if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
    return [Number(lat), Number(lng)];
  }
  return null;
}

/**
 * Controller to smoothly pan the Leaflet view when selected city changes and invalidate map size
 */
function MapController({ targetCoords }) {
  const map = useMap();

  useEffect(() => {
    // Invalidate size immediately so Leaflet renders all tiles cleanly
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 7, { duration: 1.2 });
    }
  }, [targetCoords, map]);

  return null;
}

export default function InteractiveIndiaLeafletMap({
  stations = [],
  selectedCity,
  onSelectStation
}) {
  const defaultCenter = [22.9734, 78.6569]; // Geographic center of India
  const targetCoords = extractCoords(selectedCity?.coordinates);
  const [mapReady, setMapReady] = useState(false);

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100">
      <MapContainer
        center={targetCoords || defaultCenter}
        zoom={4.8}
        minZoom={4}
        maxZoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        style={{ height: '100%', width: '100%', minHeight: '480px' }}
        whenReady={() => setMapReady(true)}
      >
        {/* OpenStreetMap Standard Free Tiles - 100% Free, Zero API Key Required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapController targetCoords={targetCoords} />

        {stations.map((st) => {
          const stCoords = extractCoords(st.coordinates);
          if (!stCoords) return null;

          const level = getAQILevel(st.aqi);
          const isSelected = selectedCity?.id === st.id || selectedCity?.slug === st.id || selectedCity?.name === st.name;

          return (
            <CircleMarker
              key={st.id || st.name}
              center={stCoords}
              radius={isSelected ? 16 : 10}
              pathOptions={{
                fillColor: level.color,
                fillOpacity: isSelected ? 0.95 : 0.85,
                color: '#ffffff',
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => {
                  if (typeof onSelectStation === 'function') {
                    onSelectStation(st);
                  }
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.98} permanent={isSelected}>
                <div className="p-1 text-slate-900 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm">{st.name}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-white text-xs font-black"
                      style={{ backgroundColor: level.color }}
                    >
                      AQI {st.aqi}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {st.state} • {level.category}
                  </div>
                  {st.dominantPollutant && (
                    <div className="text-[10px] text-slate-600 font-semibold mt-1">
                      Primary: {st.dominantPollutant} • {st.temperature || ''}
                    </div>
                  )}
                  {st.isLive && (
                    <span className="inline-block mt-1 text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Live Telemetry
                    </span>
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Accessible Floating AQI Category Legend */}
      <div className="absolute top-3 right-3 hidden md:flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-lg border border-slate-200/90 text-[10px] z-20 pointer-events-auto">
        <span className="font-bold text-slate-700 mr-1">India NAQI:</span>
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Good (0–50)
        </span>
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-lime-50 text-lime-800 font-semibold border border-lime-200">
          <span className="w-2 h-2 rounded-full bg-lime-500" />
          Satisfactory (51–100)
        </span>
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Moderate (101–200)
        </span>
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-50 text-orange-800 font-semibold border border-orange-200">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          Poor (201–300)
        </span>
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 font-semibold border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Very Poor (301–400)
        </span>
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 font-semibold border border-purple-200">
          <span className="w-2 h-2 rounded-full bg-purple-700" />
          Severe (401–500)
        </span>
      </div>

      {/* Floating Selected Station Summary Banner */}
      {selectedCity && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 text-xs z-20 pointer-events-auto">
          <div className="flex items-center justify-between font-bold text-slate-900 pb-1 mb-1 border-b border-slate-100">
            <span>Selected Station: {selectedCity.name}</span>
            <span className="font-extrabold text-sm" style={{ color: getAQILevel(selectedCity.aqi).color }}>
              AQI {selectedCity.aqi} • {getAQILevel(selectedCity.aqi).category}
            </span>
          </div>
          <p className="text-slate-500 mt-1">
            {selectedCity.state} • {getAQILevel(selectedCity.aqi).category} air quality. Click any marker across India to inspect real-time atmospheric measurements.
          </p>
        </div>
      )}
    </div>
  );
}
