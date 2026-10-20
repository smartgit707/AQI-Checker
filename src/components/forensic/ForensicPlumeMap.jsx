import React, { useEffect, useMemo, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  CircleMarker, 
  Polyline, 
  Tooltip, 
  Popup, 
  Marker,
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Flame, 
  Factory, 
  Truck, 
  Layers, 
  Wind, 
  Navigation, 
  Radio, 
  AlertTriangle, 
  ShieldCheck, 
  Compass,
  Map as MapIcon,
  Globe
} from 'lucide-react';

// Fix Leaflet's default marker icon paths in bundled environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Controller to ensure map tiles immediately calculate full size on mount & city change
 */
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    // Invalidate size on mount after layout finishes rendering
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, zoom || 7, { duration: 1.2 });
    }
  }, [map, center, zoom]);

  return null;
}

/**
 * Helper to construct custom HTML glowing icons for culprits
 */
function createCustomIcon(type, share) {
  let bgClass = '#f43f5e'; // rose-500
  let emoji = '🔥';
  if (type === 'industrial') {
    bgClass = '#9333ea'; // purple-600
    emoji = '🏭';
  } else if (type === 'vehicular') {
    bgClass = '#2563eb'; // blue-600
    emoji = '🚛';
  } else if (type === 'brick_kiln') {
    bgClass = '#d97706'; // amber-600
    emoji = '🧱';
  } else if (type === 'dust') {
    bgClass = '#ca8a04'; // yellow-600
    emoji = '💨';
  }

  const html = `
    <div style="display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;">
      <div style="width:34px;height:34px;border-radius:9999px;background-color:${bgClass};color:#ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.6);border:2px solid #ffffff;">
        <span style="font-size:16px;">${emoji}</span>
      </div>
      <span style="position:absolute;bottom:-18px;background:#0f172a;color:#ffffff;font-size:10px;font-weight:800;padding:1px 6px;border-radius:4px;border:1px solid #334155;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.5);">
        ${share}
      </span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'bg-transparent border-0',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20]
  });
}

/**
 * Active Air Parcel Drone Icon
 */
function createAirParcelIcon(altitudeM, aqi) {
  const html = `
    <div style="display:flex;align-items:center;justify-content:center;position:relative;">
      <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg, #06b6d4, #0284c7);color:#ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px rgba(6,182,212,0.9);border:2px solid #ffffff;">
        <span style="font-size:18px;">🛰️</span>
      </div>
      <div style="position:absolute;top:-24px;background:#030712;color:#38bdf8;font-size:10px;font-family:monospace;font-weight:800;padding:2px 8px;border-radius:9999px;border:1px solid #0284c7;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.8);">
        ${altitudeM}m | AQI ${aqi}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'bg-transparent border-0',
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
}

export default function ForensicPlumeMap({ 
  city, 
  activeStepIndex = 0, 
  onSelectCulprit,
  selectedCulprit
}) {
  const [showCulprits, setShowCulprits] = useState(true);
  const [showWaypoints, setShowWaypoints] = useState(true);
  const [showRibbonHalo, setShowRibbonHalo] = useState(true);
  const [mapTileStyle, setMapTileStyle] = useState('osm'); // 'osm' (OpenStreetMap) or 'satellite' (Esri World Imagery)

  const trajectoryCoords = useMemo(() => {
    return (city?.trajectory || []).map(step => step.coords);
  }, [city]);

  const activeWaypoint = city?.trajectory?.[activeStepIndex] || city?.trajectory?.[0];
  const originWaypoint = city?.trajectory?.[(city?.trajectory?.length || 1) - 1];
  const destinationWaypoint = city?.trajectory?.[0];

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
      
      {/* Top Floating Controls HUD */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="px-3.5 py-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 shadow-xl flex items-center gap-2 text-xs font-mono text-slate-200">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider">{city?.name}</span>
          <span className="text-slate-400">|</span>
          <span className="text-cyan-400 font-bold">48H REVERSE TRACER</span>
        </div>

        {/* Quick Layer Filter Toggles */}
        <button
          onClick={() => setShowCulprits(!showCulprits)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border backdrop-blur-md shadow-md flex items-center gap-1.5 cursor-pointer ${
            showCulprits 
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/60 ring-1 ring-rose-500/30' 
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3 h-3 text-rose-400" />
          <span>Intercepted Sources</span>
        </button>

        <button
          onClick={() => setShowWaypoints(!showWaypoints)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border backdrop-blur-md shadow-md flex items-center gap-1.5 cursor-pointer ${
            showWaypoints 
              ? 'bg-sky-950/90 text-sky-300 border-sky-500/60 ring-1 ring-sky-500/30' 
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3 h-3 text-sky-400" />
          <span>Waypoints & Altitude</span>
        </button>

        {/* Satellite vs Street Map Switcher */}
        <button
          onClick={() => setMapTileStyle(mapTileStyle === 'osm' ? 'satellite' : 'osm')}
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border bg-slate-950/90 text-amber-300 border-amber-500/50 hover:bg-slate-900 shadow-md flex items-center gap-1.5 cursor-pointer"
          title="Toggle between Satellite and Street Map"
        >
          {mapTileStyle === 'osm' ? (
            <>
              <Globe className="w-3 h-3 text-amber-400" />
              <span>Satellite Imagery</span>
            </>
          ) : (
            <>
              <MapIcon className="w-3 h-3 text-cyan-400" />
              <span>Street Map</span>
            </>
          )}
        </button>
      </div>

      {/* Trajectory Direction Compass Legend */}
      <div className="absolute top-4 right-4 z-[400] hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 text-xs font-mono text-slate-300 shadow-xl pointer-events-auto">
        <Navigation className="w-3.5 h-3.5 text-rose-400 rotate-180" />
        <span>REVERSE FLOW: <strong className="text-rose-400">NOW (T-0h) ➔ T-48h ORIGIN</strong></span>
      </div>

      {/* Main Leaflet Map View */}
      <MapContainer
        center={city?.centerCoords || [28.6139, 77.2090]}
        zoom={city?.defaultZoom || 7}
        minZoom={5}
        maxZoom={15}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        style={{ height: '100%', width: '100%', minHeight: '520px' }}
        whenReady={(mapInstance) => {
          setTimeout(() => {
            mapInstance.target.invalidateSize();
          }, 150);
        }}
      >
        <MapController center={city?.centerCoords} zoom={city?.defaultZoom} />

        {/* 100% Free, Reliable Base Map (Zero API Key & No 403 blocks) */}
        {mapTileStyle === 'satellite' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/" target="_blank">Esri World Imagery</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* 1. Atmospheric Backward Trajectory Ribbon Outer Haze Glow */}
        {showRibbonHalo && trajectoryCoords.length > 1 && (
          <Polyline
            positions={trajectoryCoords}
            pathOptions={{
              color: '#0284c7',
              weight: 16,
              opacity: 0.35,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        )}

        {/* 2. Main High-Precision Reverse Wind Trajectory Line */}
        {trajectoryCoords.length > 1 && (
          <Polyline
            positions={trajectoryCoords}
            pathOptions={{
              color: '#e11d48',
              weight: 4.5,
              opacity: 0.95,
              dashArray: '10, 10'
            }}
          >
            <Tooltip sticky>
              <div className="text-xs p-1 font-mono">
                <div className="font-bold text-rose-600 flex items-center gap-1">
                  <Wind className="w-3 h-3" />
                  <span>48-Hour Kinematic Backward Air Parcel Stream</span>
                </div>
                <div className="text-slate-800 mt-1">
                  Origin: <strong>{city?.forensicDossier?.originLocation}</strong>
                </div>
                <div className="text-[11px] text-sky-700">
                  Total Travel: {city?.forensicDossier?.transitDistanceKm} km over 48 hours
                </div>
              </div>
            </Tooltip>
          </Polyline>
        )}

        {/* 3. Destination City (Receptor Site / Breathing Zone) Marker */}
        {destinationWaypoint && (
          <CircleMarker
            center={destinationWaypoint.coords}
            radius={14}
            pathOptions={{
              color: '#ffffff',
              fillColor: '#ef4444',
              fillOpacity: 1.0,
              weight: 3.5
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -12]}>
              <div className="text-xs font-bold text-rose-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow">
                <span>RECEPTOR: {city?.name}</span>
                <span className="text-[10px] px-1 rounded bg-rose-100 text-rose-800 font-bold">AQI {city?.currentAqi}</span>
              </div>
            </Tooltip>
            <Popup>
              <div className="text-xs p-2 space-y-1 font-sans">
                <div className="font-bold text-rose-600 text-sm">{city?.name} (Receptor Site)</div>
                <div className="text-slate-600">The contaminated air parcel terminates here at breathing height ({destinationWaypoint.altitudeM}m).</div>
                <div className="font-mono text-[11px] text-slate-800 font-semibold">
                  Dominant: {city?.dominantPollutant}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* 4. Origin Air Mass Marker (T-48h Point) */}
        {originWaypoint && (
          <CircleMarker
            center={originWaypoint.coords}
            radius={12}
            pathOptions={{
              color: '#ffffff',
              fillColor: '#10b981',
              fillOpacity: 1.0,
              weight: 3
            }}
          >
            <Tooltip permanent direction="bottom" offset={[0, 12]}>
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow">
                <span>ORIGIN (T-48h)</span>
                <span className="text-[10px] px-1 rounded bg-emerald-100 text-emerald-800">{originWaypoint.altitudeM}m Alt</span>
              </div>
            </Tooltip>
            <Popup>
              <div className="text-xs p-2 space-y-1 font-sans">
                <div className="font-bold text-emerald-600 text-sm">Air Mass Origin Point (T-48h)</div>
                <div className="text-slate-600">{originWaypoint.locationName}</div>
                <div className="text-[11px] text-slate-500">
                  Air was clean/moderate (AQI {originWaypoint.airParcelAqi}) at high altitude ({originWaypoint.altitudeM}m) before descending into regional pollution.
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* 5. Waypoints along the Trajectory with Altitude & Time Callouts */}
        {showWaypoints && (city?.trajectory || []).map((step, idx) => {
          if (idx === 0 || idx === (city.trajectory.length - 1)) return null;
          return (
            <CircleMarker
              key={step.step}
              center={step.coords}
              radius={6}
              pathOptions={{
                color: '#ffffff',
                fillColor: '#0284c7',
                fillOpacity: 1.0,
                weight: 2
              }}
            >
              <Tooltip direction="right" offset={[8, 0]}>
                <div className="text-[11px] font-mono p-1">
                  <div className="font-bold text-sky-700">{step.timeLabel}</div>
                  <div className="text-slate-800">{step.locationName}</div>
                  <div className="text-slate-600">Altitude: {step.altitudeM}m | Wind: {step.speedKmh} km/h</div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* 6. Intercepted Culprit Emission Hotspots (Fires, Power Plants, Highways) */}
        {showCulprits && (city?.interceptedSources || []).map((culprit) => {
          return (
            <Marker
              key={culprit.id}
              position={culprit.coords}
              icon={createCustomIcon(culprit.type, culprit.impactShare)}
              eventHandlers={{
                click: () => {
                  if (onSelectCulprit) onSelectCulprit(culprit);
                }
              }}
            >
              <Popup>
                <div className="text-xs p-2 space-y-2 font-sans max-w-[240px]">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="font-extrabold text-slate-900 text-sm">{culprit.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                      {culprit.impactShare} share
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] leading-relaxed">
                    {culprit.details}
                  </div>
                  <div className="bg-slate-100 p-1.5 rounded-lg text-[10px] font-mono space-y-0.5">
                    <div><strong>Intercepted:</strong> {culprit.timeIntercepted}</div>
                    <div><strong>Injected Dose:</strong> <span className="text-rose-600 font-bold">{culprit.pollutantsAdded}</span></div>
                    <div><strong>Chemical Marker:</strong> {culprit.signature}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 7. Active Scrubbed Drone Air Parcel Probe Marker */}
        {activeWaypoint && (
          <Marker
            position={activeWaypoint.coords}
            icon={createAirParcelIcon(activeWaypoint.altitudeM, activeWaypoint.airParcelAqi)}
            zIndexOffset={1000}
          >
            <Tooltip permanent direction="top" offset={[0, -22]}>
              <div className="text-[11px] font-mono font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-cyan-500 shadow-md">
                ACTIVE: {activeWaypoint.timeLabel}
              </div>
            </Tooltip>
          </Marker>
        )}

      </MapContainer>

      {/* Bottom Floating Telemetry Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300 shadow-2xl pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <div>
            <span className="text-slate-400">ACTIVE POSITION AT </span>
            <strong className="text-cyan-400">{activeWaypoint?.timeLabel}</strong>:
            <span className="text-slate-200 ml-1">{activeWaypoint?.locationName}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div>
            <span className="text-slate-500">PARCEL ALTITUDE: </span>
            <strong className="text-amber-400">{activeWaypoint?.altitudeM}m AGL</strong>
          </div>
          <span className="text-slate-700">•</span>
          <div>
            <span className="text-slate-500">SPEED: </span>
            <strong className="text-slate-200">{activeWaypoint?.speedKmh} km/h</strong>
          </div>
          <span className="text-slate-700">•</span>
          <div>
            <span className="text-slate-500">PARCEL AQI: </span>
            <strong className={`${activeWaypoint?.airParcelAqi > 250 ? 'text-rose-400' : 'text-amber-400'}`}>
              {activeWaypoint?.airParcelAqi}
            </strong>
          </div>
        </div>
      </div>

    </div>
  );
}
