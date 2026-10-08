import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Controller to smoothly fit map bounds to the active corridor polylines
 */
function FitBoundsController({ corridor }) {
  const map = useMap();

  useEffect(() => {
    if (!corridor) return;
    const allCoords = [
      ...corridor.highwayRoute.polyline,
      ...corridor.cleanRoute.polyline
    ];
    if (allCoords.length > 0) {
      map.fitBounds(allCoords, { padding: [40, 40], maxZoom: 14, animate: true });
    }
  }, [corridor, map]);

  return null;
}

export default function CleanRouteMap({ corridor, selectedRouteKey, onSelectRoute }) {
  if (!corridor) return null;

  const defaultCenter = corridor.origin.coords;

  return (
    <div className="relative w-full h-[440px] sm:h-[500px] rounded-3xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <FitBoundsController corridor={corridor} />

        {/* 1. Highway Corridor Polyline (Red / High Emission) */}
        <Polyline
          positions={corridor.highwayRoute.polyline}
          pathOptions={{
            color: '#e11d48',
            weight: selectedRouteKey === 'highway' ? 7 : 4,
            opacity: selectedRouteKey === 'highway' ? 0.95 : 0.6,
            dashArray: selectedRouteKey === 'highway' ? null : '6, 8',
          }}
          eventHandlers={{
            click: () => onSelectRoute('highway')
          }}
        >
          <Tooltip sticky>
            <div className="text-xs p-1">
              <strong className="text-rose-600 block">{corridor.highwayRoute.name}</strong>
              <span>AQI: {corridor.highwayRoute.aqi} • PM2.5: {corridor.highwayRoute.pm25} µg/m³</span>
            </div>
          </Tooltip>
        </Polyline>

        {/* 2. Eco Clean Corridor Polyline (Emerald / Low Emission) */}
        <Polyline
          positions={corridor.cleanRoute.polyline}
          pathOptions={{
            color: '#059669',
            weight: selectedRouteKey === 'clean' ? 7 : 4,
            opacity: selectedRouteKey === 'clean' ? 0.95 : 0.65,
          }}
          eventHandlers={{
            click: () => onSelectRoute('clean')
          }}
        >
          <Tooltip sticky>
            <div className="text-xs p-1">
              <strong className="text-emerald-700 block">🌿 {corridor.cleanRoute.name}</strong>
              <span>AQI: {corridor.cleanRoute.aqi} • PM2.5: {corridor.cleanRoute.pm25} µg/m³</span>
            </div>
          </Tooltip>
        </Polyline>

        {/* 3. Origin Point Marker (A) */}
        <CircleMarker
          center={corridor.origin.coords}
          radius={9}
          pathOptions={{
            fillColor: '#10b981',
            fillOpacity: 1,
            color: '#ffffff',
            weight: 3
          }}
        >
          <Tooltip permanent direction="top" offset={[0, -10]}>
            <span className="text-[11px] font-bold text-slate-800">
              🟢 Start: {corridor.origin.name}
            </span>
          </Tooltip>
        </CircleMarker>

        {/* 4. Destination Point Marker (B) */}
        <CircleMarker
          center={corridor.destination.coords}
          radius={9}
          pathOptions={{
            fillColor: '#3b82f6',
            fillOpacity: 1,
            color: '#ffffff',
            weight: 3
          }}
        >
          <Tooltip permanent direction="bottom" offset={[0, 10]}>
            <span className="text-[11px] font-bold text-slate-800">
              🏁 End: {corridor.destination.name}
            </span>
          </Tooltip>
        </CircleMarker>

        {/* 5. Highway Checkpoints */}
        {corridor.highwayRoute.checkpoints.map((cp, idx) => (
          <CircleMarker
            key={`hw-cp-${idx}`}
            center={cp.coords}
            radius={5}
            pathOptions={{
              fillColor: '#f43f5e',
              fillOpacity: 0.9,
              color: '#ffffff',
              weight: 1.5
            }}
          >
            <Tooltip>
              <span className="text-[11px]">
                ⚠️ <strong>{cp.name}</strong> (AQI: {cp.aqi})
              </span>
            </Tooltip>
          </CircleMarker>
        ))}

        {/* 6. Clean Route Checkpoints */}
        {corridor.cleanRoute.checkpoints.map((cp, idx) => (
          <CircleMarker
            key={`clean-cp-${idx}`}
            center={cp.coords}
            radius={6}
            pathOptions={{
              fillColor: '#10b981',
              fillOpacity: 0.9,
              color: '#ffffff',
              weight: 1.5
            }}
          >
            <Tooltip>
              <span className="text-[11px]">
                🌿 <strong>{cp.name}</strong> (AQI: {cp.aqi})
              </span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Floating Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-200/90 text-xs pointer-events-auto space-y-1.5 max-w-[210px]">
        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
          Route Telemetry Layer
        </div>
        <button
          type="button"
          onClick={() => onSelectRoute('clean')}
          className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-all text-left ${
            selectedRouteKey === 'clean' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Clean Greenway</span>
          </div>
          <span className="font-mono text-emerald-600 font-bold">{corridor.cleanRoute.aqi} AQI</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectRoute('highway')}
          className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-all text-left ${
            selectedRouteKey === 'highway' ? 'bg-rose-50 text-rose-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-rose-600"></span>
            <span>Highway Corridor</span>
          </div>
          <span className="font-mono text-rose-600 font-bold">{corridor.highwayRoute.aqi} AQI</span>
        </button>
      </div>
    </div>
  );
}
