import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  Globe, 
  RotateCw, 
  Layers, 
  Eye, 
  Sparkles, 
  ShieldAlert, 
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { CITIES_DATA } from '../../data/mockData';
import { getAQILevel } from '../../design-system/aqiTokens';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Convert Latitude & Longitude to 3D Cartesian coordinates on a Sphere
 * @param {number} lat - Latitude in degrees
 * @param {number} lng - Longitude in degrees
 * @param {number} radius - Sphere radius
 */
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Procedural Earth Canvas Texture generator
 * Renders continent outlines and highlighted India peninsula on equirectangular projection
 */
function createEarthCanvasTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Deep ocean backdrop
  ctx.fillStyle = '#0a1120';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const toXY = (lat, lng) => {
    const x = ((lng + 180) / 360) * canvas.width;
    const y = ((90 - lat) / 180) * canvas.height;
    return [x, y];
  };

  // 2. Graticule Lat/Long subtle grid lines
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
  ctx.lineWidth = 1;
  for (let lat = -80; lat <= 80; lat += 20) {
    const [, y] = toXY(lat, 0);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    const [x] = toXY(0, lng);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // 3. World Continents Polygons
  const continents = [
    // India Subcontinent (High detail & glowing focus)
    {
      isIndia: true,
      coords: [
        [35.5, 74.0], [35.0, 78.5], [32.0, 79.0], [30.5, 81.0], [27.5, 88.5],
        [28.0, 97.0], [24.0, 94.0], [22.0, 91.5], [21.5, 87.0], [17.5, 83.0],
        [13.0, 80.2], [10.0, 79.8], [8.0, 77.5], [10.0, 76.0], [15.5, 73.8],
        [19.0, 72.8], [21.5, 69.5], [23.5, 68.5], [27.0, 70.5], [31.5, 74.5],
        [35.5, 74.0]
      ]
    },
    // Eurasia / Northern Asia
    {
      isIndia: false,
      coords: [
        [70, 30], [72, 110], [68, 170], [55, 140], [42, 130], [35, 120],
        [22, 115], [12, 108], [5, 102], [15, 100], [22, 92], [35, 75],
        [40, 52], [36, 36], [42, 28], [58, 25], [70, 30]
      ]
    },
    // Africa
    {
      isIndia: false,
      coords: [
        [37, 10], [32, 32], [12, 44], [0, 42], [-15, 40], [-28, 32],
        [-34, 18], [-30, 16], [-15, 12], [5, 2], [15, -17], [32, -10], [37, 10]
      ]
    },
    // Europe
    {
      isIndia: false,
      coords: [
        [71, 28], [60, 30], [45, 30], [38, 24], [36, -6], [44, -9],
        [50, -5], [58, 6], [65, 15], [71, 28]
      ]
    },
    // Australia
    {
      isIndia: false,
      coords: [
        [-12, 131], [-16, 146], [-28, 153], [-38, 145], [-35, 115], [-20, 114], [-12, 131]
      ]
    },
    // North America
    {
      isIndia: false,
      coords: [
        [70, -165], [70, -70], [55, -55], [30, -82], [18, -88], [15, -95],
        [24, -108], [33, -118], [52, -128], [62, -145], [70, -165]
      ]
    },
    // South America
    {
      isIndia: false,
      coords: [
        [12, -72], [-2, -35], [-22, -40], [-42, -64], [-55, -67], [-50, -75],
        [-20, -70], [0, -80], [12, -72]
      ]
    }
  ];

  continents.forEach(({ isIndia, coords }) => {
    ctx.beginPath();
    coords.forEach(([lat, lng], idx) => {
      const [x, y] = toXY(lat, lng);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    if (isIndia) {
      // Vibrant Indian territory styling
      ctx.fillStyle = '#064e3b';
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.stroke();
    } else {
      // Surrounding continental landmasses
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export default function AtmosphericGlobe3D({ stations = [], onSelectCity, selectedCity }) {
  const { currentLang, t } = useLanguage();
  const mountRef = useRef(null);
  
  // Interactive UI state
  const [showHazeLayer, setShowHazeLayer] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [activeCity, setActiveCity] = useState(selectedCity || CITIES_DATA[0]);

  // Keep ref of mutable objects for animation loop
  const sceneRef = useRef(null);
  const globeGroupRef = useRef(null);
  const hazeMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Focus on India (Center of India is ~21°N, 78°E)
  const INDIA_CENTER = { lat: 21.0, lng: 78.0 };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 240);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0); // Soft cyan sunlight
    dirLight1.position.set(150, 100, 150);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.0); // Emerald rim light
    dirLight2.position.set(-150, -100, -100);
    scene.add(dirLight2);

    // 5. Main Globe Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const GLOBE_RADIUS = 75;

    // 6. Base Terrestrial Earth Sphere with Geographic Continents
    const earthTexture = createEarthCanvasTexture();
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      map: earthTexture || undefined,
      color: 0xffffff,
      roughness: 0.75,
      metalness: 0.15
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // 7. Atmospheric Wireframe Lat-Long Grid (Gives NASA / ISRO satellite look)
    const gridGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.3, 36, 18);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(gridMesh);

    // 8. Glowing Atmospheric Smog / Aerosol Shell
    const hazeGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 2.5, 64, 64);
    const hazeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber/Orange inversion smog layer
      transparent: true,
      opacity: 0.22,
      roughness: 0.3,
      blending: THREE.AdditiveBlending
    });
    const hazeMesh = new THREE.Mesh(hazeGeo, hazeMat);
    hazeMeshRef.current = hazeMesh;
    globeGroup.add(hazeMesh);

    // 9. Outer Stratospheric Cyan Halo
    const haloGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 5.0, 48, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // 10. City AQI Laser Beacons & Pulsing Nodes
    const raycastTargets = [];
    const stationList = stations && stations.length > 0 ? stations : CITIES_DATA;

    stationList.forEach((city) => {
      const lat = city.coordinates?.lat ?? city.coordinates?.latitude ?? 28.6;
      const lng = city.coordinates?.lng ?? city.coordinates?.longitude ?? 77.2;
      const pos = latLngToVector3(lat, lng, GLOBE_RADIUS);
      const level = getAQILevel(city.aqi);

      // Height of laser beam scaled proportional to AQI (Max 35 units)
      const laserHeight = Math.max(6, Math.min(35, (city.aqi / 400) * 35));

      // Laser Cylinder Geometry
      const beamGeo = new THREE.CylinderGeometry(0.5, 1.2, laserHeight, 16);
      beamGeo.translate(0, laserHeight / 2, 0); // Anchor cylinder at bottom
      beamGeo.rotateX(Math.PI / 2); // Orient along normal

      const beamMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(level.color),
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.copy(pos);
      beamMesh.lookAt(new THREE.Vector3(0, 0, 0));
      beamMesh.rotateY(Math.PI); // Point outwards
      globeGroup.add(beamMesh);

      // Floating Pulsing Ring at the Tip of the Beacon
      const tipPos = pos.clone().add(pos.clone().normalize().multiplyScalar(laserHeight));
      const ringGeo = new THREE.RingGeometry(1.2, 2.4, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(level.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(tipPos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);

      // Invisible Click/Hover Hitbox Sphere
      const hitGeo = new THREE.SphereGeometry(4.5, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(tipPos);
      hitMesh.userData = { city };
      globeGroup.add(hitMesh);
      raycastTargets.push(hitMesh);
    });

    // 11. Initial Rotation to Center on India
    // Formula to center lat/lng:
    // rotation.y = - (lng + 90) * (PI/180)
    // rotation.x = lat * (PI/180)
    const targetRotY = - (INDIA_CENTER.lng - 90) * (Math.PI / 180);
    const targetRotX = (INDIA_CENTER.lat) * (Math.PI / 180);
    globeGroup.rotation.y = targetRotY;
    globeGroup.rotation.x = targetRotX;

    // 12. Mouse Drag & Orbit Interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycast check for hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        setHoveredCity(intersects[0].object.userData.city);
      } else {
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
        setHoveredCity(null);
      }

      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      // Clamp vertical rotation so globe doesn't flip upside down
      globeGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroup.rotation.x));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e) => {
      if (isDragging) {
        // If minimal drag, check if user clicked a city
        const dist = Math.hypot(e.clientX - prevMousePos.x, e.clientY - prevMousePos.y);
        if (dist < 5) {
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(raycastTargets);
          if (intersects.length > 0) {
            const hitCity = intersects[0].object.userData.city;
            setActiveCity(hitCity);
            if (onSelectCity) onSelectCity(hitCity);
          }
        }
      }
      isDragging = false;
      container.style.cursor = 'grab';
    };

    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.15;
      camera.position.z = Math.max(160, Math.min(320, camera.position.z));
    };

    // Touch events for mobile
    let touchStartPos = { x: 0, y: 0 };
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartPos.x;
      const deltaY = e.touches[0].clientY - touchStartPos.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      globeGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroup.rotation.x));

      touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 13. Responsive Resize Handler
    const onResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 14. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation when user isn't actively dragging
      if (globeGroupRef.current && isAutoRotating && !isDragging) {
        globeGroupRef.current.rotation.y += 0.0012;
      }

      // Atmospheric Smog Haze subtle breathing pulse
      if (hazeMeshRef.current) {
        const pulse = 1 + Math.sin(elapsedTime * 1.5) * 0.015;
        hazeMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', onResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (earthTexture) earthTexture.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isAutoRotating]);

  // Update haze visibility when toggle state changes
  useEffect(() => {
    if (hazeMeshRef.current) {
      hazeMeshRef.current.visible = showHazeLayer;
    }
  }, [showHazeLayer]);

  // Reset View to India Center
  const handleResetView = () => {
    if (globeGroupRef.current) {
      const targetRotY = - (INDIA_CENTER.lng - 90) * (Math.PI / 180);
      const targetRotX = (INDIA_CENTER.lat) * (Math.PI / 180);
      globeGroupRef.current.rotation.y = targetRotY;
      globeGroupRef.current.rotation.x = targetRotX;
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 240);
    }
  };

  const handleZoom = (delta) => {
    if (cameraRef.current) {
      cameraRef.current.position.z += delta;
      cameraRef.current.position.z = Math.max(160, Math.min(320, cameraRef.current.position.z));
    }
  };

  const currentDisplayCity = hoveredCity || activeCity;
  const cityLevel = getAQILevel(currentDisplayCity?.aqi || 50);

  return (
    <div className="relative w-full h-[540px] sm:h-[600px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between">
      
      {/* Top Floating Glass Header Bar */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Title Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 text-white shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Globe className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-white font-display">
                {currentLang === 'hi' ? '3D वायुमंडलीय भारत ग्लोब' : '3D Atmospheric India Globe'}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WebGL
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {currentLang === 'hi' ? 'माउस से घुमाएं • शहरों पर क्लिक करें' : 'Drag to rotate • Click beacons to inspect'}
            </p>
          </div>
        </div>

        {/* 3D Controls Toolset */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 shadow-xl">
          <button
            type="button"
            onClick={() => setShowHazeLayer(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showHazeLayer 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle 3D Atmospheric Smog Layer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentLang === 'hi' ? 'स्मॉग लेयर' : 'Smog Canopy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoRotating(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isAutoRotating 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentLang === 'hi' ? 'ऑटो-रोटेशन' : 'Auto Rotate'}</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-0.5" />

          <button
            type="button"
            onClick={() => handleZoom(-25)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleZoom(25)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset View to India"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Bottom City Inspection HUD Card */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 pointer-events-none flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
        
        {/* Selected City Telemetry Tele-Card */}
        <div className="pointer-events-auto p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 text-white shadow-2xl max-w-sm w-full flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cityLevel.color }}></span>
              {currentLang === 'hi' ? 'चयनित स्टेशन टेलीमेट्री' : 'Live Beacon Telemetry'}
            </span>
            <h4 className="text-lg font-extrabold text-white font-display">
              {currentDisplayCity?.name}, {currentDisplayCity?.state}
            </h4>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{t('hero.dominant', 'Dominant')}: <strong className="text-slate-200">{currentDisplayCity?.dominantPollutant}</strong></span>
              <span>•</span>
              <span>{currentDisplayCity?.temperature}</span>
            </div>
          </div>

          <div 
            className="px-4 py-2.5 rounded-xl text-center border shadow-lg shrink-0"
            style={{ 
              backgroundColor: `${cityLevel.color}20`,
              borderColor: `${cityLevel.color}60`,
              color: cityLevel.color 
            }}
          >
            <span className="text-2xl font-black block leading-none">{currentDisplayCity?.aqi}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider block mt-1">
              {t(`aqi.${cityLevel.category.toLowerCase()}`, cityLevel.category)}
            </span>
          </div>
        </div>

        {/* 3D Visual Legend Card */}
        <div className="pointer-events-auto px-3.5 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-3 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {currentLang === 'hi' ? 'बीकन पैमाना:' : 'Laser Height:'}
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] text-slate-300">Clean</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-[11px] text-slate-300">Moderate</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-[11px] text-slate-300">Critical</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
