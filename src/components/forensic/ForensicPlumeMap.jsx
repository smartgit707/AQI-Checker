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
  Eye,
  Sliders,
  Compass,
  Zap
} from 'lucide-react';

/**
 * Controller to ensure map tiles immediately calculate full size on mount & city change
 */
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (center) {
      map.flyTo(center, zoom || 7, { duration: 1.2 });
    }
  }, [map, center, zoom]);
  return null;
}

/**
 * Helper to construct custom HTML glowing icons for culprits
 */
function createCustomIcon(type, share) {
  let bgClass = 'bg-rose-500';
  let emoji = '🔥';
  if (type === 'industrial') {
    bgClass = 'bg-purple-600';
    emoji = '🏭';
  } else if (type === 'vehicular') {
    bgClass = 'bg-blue-600';
    emoji = '🚛';
  } else if (type === 'brick_kiln') {
    bgClass = 'bg-amber-600';
    emoji = '🧱';
  } else if (type === 'dust') {
    bgClass = 'bg-yellow-600';
    emoji = '💨';
  }

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group">
      <span class="absolute w-8 h-8 rounded-full ${bgClass} opacity-40 animate-ping"></span>
      <div class="relative w-8 h-8 rounded-full ${bgClass} text-white font-bold text-xs flex items-center justify-center shadow-lg border-2 border-white/80 transition-transform group-hover:scale-125">
        <span class="text-sm">${emoji}</span>
      </div>
      <span class="absolute -bottom-5 px-1.5 py-0.5 rounded-md bg-slate-900/90 text-[10px] font-bold text-white border border-slate-700 whitespace-nowrap shadow-md">
        ${share}
      </span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-culprit-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
}

/**
 * Active Air Parcel Drone Icon
 */
function createAirParcelIcon(altitudeM, aqi) {
  const html = `
    <div class="relative flex items-center justify-center">
      <span class="absolute w-12 h-12 rounded-full bg-cyan-400 opacity-60 animate-ping"></span>
      <div class="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 text-white flex items-center justify-center shadow-2xl border-2 border-white scale-110">
        <svg class="w-5 h-5 animate-spin" style="animation-duration: 4s;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="16 8"></circle>
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4"></path>
        </svg>
      </div>
      <div class="absolute -top-7 px-2 py-0.5 rounded-full bg-slate-950/95 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/80 shadow-lg whitespace-nowrap flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>${altitudeM}m | AQI ${aqi}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'air-parcel-probe',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
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

  const trajectoryCoords = useMemo(() => {
    return (city?.trajectory || []).map(step => step.coords);
  }, [city]);

  const activeWaypoint = city?.trajectory?.[activeStepIndex] || city?.trajectory?.[0];
  const originWaypoint = city?.trajectory?.[city.trajectory.length - 1];
  const destinationWaypoint = city?.trajectory?.[0];

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-[#070b13]">
      
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
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border backdrop-blur-md shadow-md flex items-center gap-1.5 ${
            showCulprits 
              ? 'bg-rose-950/80 text-rose-300 border-rose-500/50' 
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3 h-3 text-rose-400" />
          <span>Intercepted Sources</span>
        </button>

        <button
          onClick={() => setShowWaypoints(!showWaypoints)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border backdrop-blur-md shadow-md flex items-center gap-1.5 ${
            showWaypoints 
              ? 'bg-sky-950/80 text-sky-300 border-sky-500/50' 
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3 h-3 text-sky-400" />
          <span>Waypoints & Altitude</span>
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
        maxZoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        style={{ height: '100%', width: '100%' }}
      >
        <MapController center={city?.centerCoords} zoom={city?.defaultZoom} />

        {/* High-Contrast Clean CartoDB Dark Base Layer for Forensic Satellite Look */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/" target="_blank">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* 1. Atmospheric Backward Trajectory Ribbon Outer Haze Glow */}
        {showRibbonHalo && trajectoryCoords.length > 1 && (
          <Polyline
            positions={trajectoryCoords}
            pathOptions={{
              color: '#38bdf8',
              weight: 16,
              opacity: 0.22,
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
              color: '#f43f5e',
              weight: 4.5,
              opacity: 0.95,
              dashArray: '10, 10'
            }}
          >
            <Tooltip sticky>
              <div className="text-xs p-1 font-mono">
                <div className="font-bold text-rose-400 flex items-center gap-1">
                  <Wind className="w-3 h-3" />
                  <span>48-Hour Kinematic Backward Air Parcel Stream</span>
                </div>
                <div className="text-slate-300 mt-1">
                  Origin: <strong>{city?.forensicDossier?.originLocation}</strong>
                </div>
                <div className="text-[11px] text-cyan-300">
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
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.9,
              weight: 3
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -12]}>
              <div className="text-xs font-bold text-rose-600 flex items-center gap-1">
                <span>RECEPTOR: {city?.name}</span>
                <span className="text-[10px] px-1 rounded bg-rose-100 text-rose-800">AQI {city?.currentAqi}</span>
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
              color: '#10b981',
              fillColor: '#059669',
              fillOpacity: 0.9,
              weight: 3
            }}
          >
            <Tooltip permanent direction="bottom" offset={[0, 12]}>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
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
          if (idx === 0 || idx === city.trajectory.length - 1) return null; // handled separately
          return (
            <CircleMarker
              key={step.step}
              center={step.coords}
              radius={6}
              pathOptions={{
                color: '#38bdf8',
                fillColor: '#0284c7',
                fillOpacity: 0.9,
                weight: 2
              }}
            >
              <Tooltip direction="right" offset={[8, 0]}>
                <div className="text-[11px] font-mono p-1">
                  <div className="font-bold text-sky-400">{step.timeLabel}</div>
                  <div className="text-slate-200">{step.locationName}</div>
                  <div className="text-slate-400">Altitude: {step.altitudeM}m | Wind: {step.speedKmh} km/h</div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* 6. Intercepted Culprit Emission Hotspots (Fires, Power Plants, Highways) */}
        {showCulprits && (city?.interceptedSources || []).map((culprit) => {
          const isSelected = selectedCulprit?.id === culprit.id;
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
                ACTIVE POSITION: {activeWaypoint.timeLabel}
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
