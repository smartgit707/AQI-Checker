import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  Wind, 
  Power, 
  Sparkles, 
  RotateCw, 
  Layers, 
  Sun, 
  ShieldCheck, 
  Info, 
  Sliders, 
  Maximize2, 
  ZoomIn, 
  ZoomOut,
  Clock,
  Play,
  Pause,
  Home,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Leaf
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getAQILevel } from '../../design-system/aqiTokens';

// Room Presets
const ROOM_PRESETS = [
  { id: 'bedroom', name: 'Master Bedroom', areaSqFt: 180, volumeM3: 45, icon: '🛏️' },
  { id: 'living', name: 'Living Room', areaSqFt: 360, volumeM3: 90, icon: '🛋️' },
  { id: 'studio', name: 'Studio / Open Office', areaSqFt: 550, volumeM3: 135, icon: '🏢' },
];

// Purifier Speeds
const PURIFIER_SPEEDS = [
  { id: 'off', label: 'OFF', cadr: 0, powerWatts: 0, noiseDb: 0 },
  { id: 'sleep', label: 'Sleep Mode', cadr: 120, powerWatts: 8, noiseDb: 22 },
  { id: 'auto', label: 'Balanced (Auto)', cadr: 280, powerWatts: 25, noiseDb: 38 },
  { id: 'turbo', label: 'Turbo (Max CADR)', cadr: 480, powerWatts: 55, noiseDb: 52 },
];

export default function SmartHomeSimulator3D({ initialOutdoorAqi = 240 }) {
  const { currentLang, t } = useLanguage();
  const mountRef = useRef(null);

  // Simulation State
  const [selectedRoom, setSelectedRoom] = useState(ROOM_PRESETS[1]); // Living Room default
  const [outdoorAqi, setOutdoorAqi] = useState(initialOutdoorAqi);
  const [purifierSpeed, setPurifierSpeed] = useState('auto'); // 'off', 'sleep', 'auto', 'turbo'
  const [windowOpen, setWindowOpen] = useState(false);
  const [hasPlants, setHasPlants] = useState(true);
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState(2); // 1x, 2x, 5x
  const [simMinutes, setSimMinutes] = useState(0);
  const [indoorAqi, setIndoorAqi] = useState(initialOutdoorAqi * 0.75);
  const [autoRotate, setAutoRotate] = useState(true);

  // References for Three.js animation loop
  const sceneRef = useRef(null);
  const roomGroupRef = useRef(null);
  const windowPaneRef = useRef(null);
  const purifierLedRef = useRef(null);
  const purifierAuraRef = useRef(null);
  const particleSystemRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Physics simulation mutable values for 60fps loop
  const currentIndoorAqiRef = useRef(indoorAqi);
  const windowOpenRef = useRef(windowOpen);
  const purifierSpeedRef = useRef(purifierSpeed);
  const outdoorAqiRef = useRef(outdoorAqi);
  const roomVolumeRef = useRef(selectedRoom.volumeM3);
  const hasPlantsRef = useRef(hasPlants);

  useEffect(() => { currentIndoorAqiRef.current = indoorAqi; }, [indoorAqi]);
  useEffect(() => { windowOpenRef.current = windowOpen; }, [windowOpen]);
  useEffect(() => { purifierSpeedRef.current = purifierSpeed; }, [purifierSpeed]);
  useEffect(() => { outdoorAqiRef.current = outdoorAqi; }, [outdoorAqi]);
  useEffect(() => { roomVolumeRef.current = selectedRoom.volumeM3; }, [selectedRoom]);
  useEffect(() => { hasPlantsRef.current = hasPlants; }, [hasPlants]);

  // Active Purifier Spec
  const activePurifier = useMemo(() => {
    return PURIFIER_SPEEDS.find(s => s.id === purifierSpeed) || PURIFIER_SPEEDS[2];
  }, [purifierSpeed]);

  // Air Changes per Hour (ACH) & Time to Clean
  const ach = useMemo(() => {
    if (activePurifier.cadr === 0) return 0;
    return Math.round((activePurifier.cadr / selectedRoom.volumeM3) * 10) / 10;
  }, [activePurifier, selectedRoom]);

  const timeToCleanMin = useMemo(() => {
    if (ach === 0) return '∞';
    if (windowOpen) return 'Ineffective (Window Open)';
    // Typical exponential decay time for 90% particle removal: ~2.3 / ACH * 60 mins
    const mins = Math.max(5, Math.round((2.3 / ach) * 60));
    return `${mins} mins`;
  }, [ach, windowOpen]);

  // Current AQI Level visual tokens
  const indoorLevel = getAQILevel(Math.round(indoorAqi));
  const outdoorLevel = getAQILevel(outdoorAqi);

  // Simulation Clock Tick (runs every second, advancing simMinutes and updating indoor AQI)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimMinutes(prev => prev + 1);

      // Differential air balance equation:
      // dC/dt = (Infiltration Rate * C_out) - (Purifier Removal Rate * C_in) - (Plant absorption)
      const cadr = activePurifier.cadr; // m3/hr
      const vol = selectedRoom.volumeM3; // m3
      const cOut = outdoorAqiRef.current;
      const cIn = currentIndoorAqiRef.current;

      // Air exchange from leaks/windows (ACH)
      const naturalAch = windowOpenRef.current ? 4.2 : 0.25; // 4.2 ACH when window open, 0.25 when sealed
      const infiltrationRate = (naturalAch * (cOut - cIn)) / 60; // per minute delta
      const purifierCleaningRate = cadr > 0 ? ((cadr / vol) * cIn) / 60 : 0;
      const plantCleaningRate = hasPlantsRef.current ? 0.4 : 0;

      const delta = (infiltrationRate - purifierCleaningRate - plantCleaningRate) * simSpeed;
      const nextAqi = Math.max(12, Math.min(500, cIn + delta));

      setIndoorAqi(nextAqi);
    }, 1000 / simSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeed, activePurifier, selectedRoom]);

  // Three.js 3D WebGL Canvas Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Isometric Perspective Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(46, 38, 46);
    camera.lookAt(0, 5, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Sun / Window directional light
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    sunLight.position.set(-25, 30, -20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Soft architectural fill light from open side
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    fillLight.position.set(30, 20, 30);
    scene.add(fillLight);

    // 5. Main Room Group
    const roomGroup = new THREE.Group();
    roomGroupRef.current = roomGroup;
    scene.add(roomGroup);

    // ROOM DIMENSIONS: 30 x 30 x 14
    const ROOM_W = 30;
    const ROOM_D = 30;
    const ROOM_H = 14;

    // 6. Floor (Light Scandinavian Oak Wood Finish)
    const floorGeo = new THREE.BoxGeometry(ROOM_W, 1.2, ROOM_D);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xdfd3c3,
      roughness: 0.5,
      metalness: 0.05
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -0.6, 0);
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);

    // Floor Perimeter Trim
    const trimGeo = new THREE.BoxGeometry(ROOM_W + 0.6, 0.4, ROOM_D + 0.6);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.set(0, -1.0, 0);
    roomGroup.add(trimMesh);

    // 7. Back Wall (With Window Opening)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.85,
      metalness: 0.02
    });

    // Back Wall Left Section
    const bWallLeft = new THREE.Mesh(new THREE.BoxGeometry(10, ROOM_H, 0.8), wallMat);
    bWallLeft.position.set(-10, ROOM_H / 2, -ROOM_D / 2);
    bWallLeft.receiveShadow = true;
    roomGroup.add(bWallLeft);

    // Back Wall Right Section
    const bWallRight = new THREE.Mesh(new THREE.BoxGeometry(10, ROOM_H, 0.8), wallMat);
    bWallRight.position.set(10, ROOM_H / 2, -ROOM_D / 2);
    bWallRight.receiveShadow = true;
    roomGroup.add(bWallRight);

    // Back Wall Top Lintel (above window)
    const bWallTop = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 0.8), wallMat);
    bWallTop.position.set(0, ROOM_H - 1.5, -ROOM_D / 2);
    roomGroup.add(bWallTop);

    // Back Wall Bottom Sill (below window)
    const bWallBottom = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 0.8), wallMat);
    bWallBottom.position.set(0, 1.5, -ROOM_D / 2);
    roomGroup.add(bWallBottom);

    // 8. Left Wall
    const lWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, ROOM_H, ROOM_D), wallMat);
    lWall.position.set(-ROOM_W / 2, ROOM_H / 2, 0);
    lWall.receiveShadow = true;
    roomGroup.add(lWall);

    // 9. Window Frame & Sliding Glass Pane
    const windowFrameGeo = new THREE.BoxGeometry(9.8, 7.8, 1.2);
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
    const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    windowFrame.position.set(0, 7, -ROOM_D / 2);
    roomGroup.add(windowFrame);

    // Window Glass Pane (Slidable)
    const glassGeo = new THREE.BoxGeometry(9.2, 7.2, 0.2);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transmission: 0.9,
      opacity: 0.45,
      transparent: true,
      roughness: 0.1,
      ior: 1.5
    });
    const glassPane = new THREE.Mesh(glassGeo, glassMat);
    glassPane.position.set(0, 7, -ROOM_D / 2 + 0.1);
    windowPaneRef.current = glassPane;
    roomGroup.add(glassPane);

    // Outdoor View Backdrop Plane behind Window
    const outdoorBackdropGeo = new THREE.PlaneGeometry(16, 12);
    const outdoorBackdropMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc, side: THREE.DoubleSide });
    const outdoorBackdrop = new THREE.Mesh(outdoorBackdropGeo, outdoorBackdropMat);
    outdoorBackdrop.position.set(0, 7, -ROOM_D / 2 - 4);
    roomGroup.add(outdoorBackdrop);

    // 10. Modern 3D Furniture (Isometric Aesthetic)
    // Cozy Modern Sofa
    const sofaGroup = new THREE.Group();
    const sofaBaseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const sofaCushionMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });

    // Sofa Base
    const sBase = new THREE.Mesh(new THREE.BoxGeometry(14, 1.6, 6), sofaBaseMat);
    sBase.position.set(-4, 0.8, 3);
    sofaGroup.add(sBase);

    // Sofa Backrest
    const sBack = new THREE.Mesh(new THREE.BoxGeometry(14, 4.5, 1.8), sofaCushionMat);
    sBack.position.set(-4, 3.2, 0.8);
    sofaGroup.add(sBack);

    // Sofa Armrests
    const sArmL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 6), sofaCushionMat);
    sArmL.position.set(-10.2, 2.0, 3);
    const sArmR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 6), sofaCushionMat);
    sArmR.position.set(2.2, 2.0, 3);
    sofaGroup.add(sArmL, sArmR);
    roomGroup.add(sofaGroup);

    // Coffee Table (Oak wood with dark steel legs)
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(7, 0.6, 4), new THREE.MeshStandardMaterial({ color: 0xc8b6a6 }));
    tableTop.position.set(-4, 2.0, 8.5);
    roomGroup.add(tableTop);

    // Table Legs
    const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    [[-6.8, 7], [-1.2, 7], [-6.8, 10], [-1.2, 10]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.9, z);
      roomGroup.add(leg);
    });

    // Area Rug under furniture
    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 12),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(-4, 0.02, 6);
    roomGroup.add(rug);

    // 11. Minimalist Indoor Snake Plant (Air-Purifying Plant)
    const plantGroup = new THREE.Group();
    // Ceramic Pot
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.1, 2.5, 16),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 })
    );
    pot.position.set(-11.5, 1.25, -9);
    plantGroup.add(pot);

    // Plant Leaves (Sansevieria Trifasciata)
    const leafGeo = new THREE.BoxGeometry(0.3, 4.5, 0.8);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(-11.5 + Math.sin(i) * 0.4, 3.5, -9 + Math.cos(i) * 0.4);
      leaf.rotation.z = (Math.random() - 0.5) * 0.25;
      leaf.rotation.y = (i * Math.PI) / 3.5;
      plantGroup.add(leaf);
    }
    roomGroup.add(plantGroup);

    // 12. Modern HEPA Tower Air Purifier (Active Unit)
    const purifierGroup = new THREE.Group();
    purifierGroup.position.set(7.5, 0, 7.5);

    // Purifier Cylindrical Lower Mesh (Intake Grill)
    const intakeGeo = new THREE.CylinderGeometry(1.6, 1.6, 3.2, 24);
    const intakeMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.2
    });
    const intakeMesh = new THREE.Mesh(intakeGeo, intakeMat);
    intakeMesh.position.y = 1.6;
    purifierGroup.add(intakeMesh);

    // Purifier Upper Body (Sleek Matte White)
    const bodyGeo = new THREE.CylinderGeometry(1.5, 1.6, 3.0, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 4.6;
    purifierGroup.add(bodyMesh);

    // Glowing Top LED Ring (Changes color with Indoor AQI: Green/Amber/Red)
    const ledGeo = new THREE.TorusGeometry(1.3, 0.12, 16, 32);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const ledRing = new THREE.Mesh(ledGeo, ledMat);
    ledRing.rotation.x = Math.PI / 2;
    ledRing.position.y = 6.12;
    purifierLedRef.current = ledRing;
    purifierGroup.add(ledRing);

    // Purified Air Aura Dome (Translucent glowing clean bubble)
    const auraGeo = new THREE.SphereGeometry(6, 24, 24);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.12,
      wireframe: true
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.position.y = 4;
    purifierAuraRef.current = auraMesh;
    purifierGroup.add(auraMesh);

    roomGroup.add(purifierGroup);

    // 13. Floating Atmospheric Particulate Cloud (1,400 micro-particles)
    const PARTICLE_COUNT = 1400;
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleVelocities = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spawn inside room boundaries
      particlePositions[i * 3] = (Math.random() - 0.5) * (ROOM_W - 4);
      particlePositions[i * 3 + 1] = Math.random() * (ROOM_H - 2) + 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * (ROOM_D - 4);

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.04
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b, // Amber-Orange default
      size: 0.35,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystemRef.current = particleSystem;
    roomGroup.add(particleSystem);

    // 14. Orbit Interaction (Mouse drag & Touch)
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;

      roomGroup.rotation.y += dx * 0.006;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e) => {
      e.preventDefault();
      camera.position.x += e.deltaY * 0.05;
      camera.position.z += e.deltaY * 0.05;
      camera.position.y += e.deltaY * 0.04;
      // Clamp zoom
      const dist = camera.position.length();
      if (dist < 35) camera.position.setLength(35);
      if (dist > 110) camera.position.setLength(110);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // Touch events
    let touchStart = { x: 0, y: 0 };
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - touchStart.x;
      roomGroup.rotation.y += dx * 0.006;
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize Handler
    const onResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 15. Animation Loop (60 FPS)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation when user is not dragging
      if (autoRotate && !isDragging) {
        roomGroup.rotation.y += 0.0015;
      }

      // Smooth Window Open / Close animation
      if (windowPaneRef.current) {
        const targetX = windowOpenRef.current ? -5.5 : 0;
        windowPaneRef.current.position.x += (targetX - windowPaneRef.current.position.x) * 0.1;
      }

      // Update Purifier LED Ring & Aura color based on indoor AQI
      const cIn = currentIndoorAqiRef.current;
      const currentLevel = getAQILevel(Math.round(cIn));
      const targetColor = new THREE.Color(currentLevel.color);

      if (purifierLedRef.current) {
        purifierLedRef.current.material.color.copy(targetColor);
      }

      if (purifierAuraRef.current) {
        const isPurifierOn = purifierSpeedRef.current !== 'off';
        purifierAuraRef.current.visible = isPurifierOn;
        if (isPurifierOn) {
          purifierAuraRef.current.material.color.copy(targetColor);
          const pulse = 1 + Math.sin(elapsedTime * 3) * 0.04;
          purifierAuraRef.current.scale.set(pulse, pulse, pulse);
        }
      }

      // Dynamic Particle Movement & Purifier Suction Physics
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array;
        const isPurifierOn = purifierSpeedRef.current !== 'off';
        const purifierPos = new THREE.Vector3(7.5, 2.5, 7.5);

        // Update particle color tone based on indoor AQI
        particleSystemRef.current.material.color.copy(targetColor);
        particleSystemRef.current.material.opacity = Math.max(0.2, Math.min(0.9, cIn / 300));

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const idx = i * 3;
          let px = positions[idx];
          let py = positions[idx + 1];
          let pz = positions[idx + 2];
          const vel = particleVelocities[i];

          // Brownian drift
          px += vel.x;
          py += vel.y;
          pz += vel.z;

          // If Purifier is ON, pull particles near purifier towards its intake
          if (isPurifierOn) {
            const dx = purifierPos.x - px;
            const dy = purifierPos.y - py;
            const dz = purifierPos.z - pz;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < 100) {
              // Suction vortex force
              const force = 0.08 / (Math.sqrt(distSq) + 0.5);
              px += dx * force;
              py += dy * force;
              pz += dz * force;

              // Absorbed: respawn on the other side as clean filtered air
              if (distSq < 2) {
                px = (Math.random() - 0.5) * 12;
                py = Math.random() * 8 + 1;
                pz = (Math.random() - 0.5) * 12;
              }
            }
          }

          // If Window is OPEN, stream in smog particles from the window aperture
          if (windowOpenRef.current && i % 8 === 0) {
            if (pz > 8 || Math.random() < 0.01) {
              px = (Math.random() - 0.5) * 6;
              py = Math.random() * 5 + 4;
              pz = -ROOM_D / 2 + 1;
            }
          }

          // Bounce off room walls
          if (px < -ROOM_W / 2 + 2 || px > ROOM_W / 2 - 2) vel.x *= -1;
          if (py < 0.5 || py > ROOM_H - 1.5) vel.y *= -1;
          if (pz < -ROOM_D / 2 + 2 || pz > ROOM_D / 2 - 2) vel.z *= -1;

          positions[idx] = px;
          positions[idx + 1] = py;
          positions[idx + 2] = pz;
        }

        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
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
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate]);

  const handleResetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(46, 38, 46);
      cameraRef.current.lookAt(0, 5, 0);
    }
    if (roomGroupRef.current) {
      roomGroupRef.current.rotation.y = 0;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Header Overview & Live Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentLang === 'hi' ? '3D स्मार्ट होम सिम्युलेटर' : '3D WebGL Fluid Purifier Simulator'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 font-display">
              {currentLang === 'hi' ? 'स्मार्ट होम वायु शोधक 3D सिम्युलेटर' : '3D Smart Home & HEPA Air Purifier Simulator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {currentLang === 'hi'
                ? 'कमरे का आकार, खिड़की की स्थिति और वायु शोधक की गति बदलकर देखें कि इनडोर वायु गुणवत्ता कितनी तेजी से शुद्ध होती है।'
                : 'Interact with an isometric 3D apartment to simulate real-time HEPA air cleaning, window infiltration, and particulate clearance times.'}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[110px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {currentLang === 'hi' ? 'इनडोर AQI' : 'Indoor AQI'}
              </span>
              <span 
                className="text-2xl font-black font-display block"
                style={{ color: indoorLevel.color }}
              >
                {Math.round(indoorAqi)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[110px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {currentLang === 'hi' ? 'आउटडोर AQI' : 'Outdoor AQI'}
              </span>
              <span 
                className="text-2xl font-black font-display block"
                style={{ color: outdoorLevel.color }}
              >
                {outdoorAqi}
              </span>
            </div>
          </div>
        </div>

        {/* Room Presets Tabs */}
        <div className="pt-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            {currentLang === 'hi' ? 'कमरे का प्रकार चुनें:' : 'Select Room Footprint:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ROOM_PRESETS.map((room) => {
              const isSelected = room.id === selectedRoom.id;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setSelectedRoom(room)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{room.icon}</span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {room.areaSqFt} sq ft • {room.volumeM3} m³
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {room.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main 3D WebGL Canvas & Right Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: 3D Canvas Container (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/90 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {currentLang === 'hi' ? '3D इनडोर माइक्रोक्लाइमेट व्यू' : '3D Indoor Air Dynamics'}
              </h3>
            </div>

            {/* Quick 3D Camera Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  autoRotate
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{autoRotate ? 'Auto-Orbiting' : 'Paused'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetCamera}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Reset Camera View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* WebGL Canvas Mount Container */}
          <div className="relative w-full h-[480px] sm:h-[540px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-inner">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Floating Top In-Canvas HUD */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-2">
              <div className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white text-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: indoorLevel.color }}></span>
                <span className="font-bold">{indoorLevel.category} ({Math.round(indoorAqi)} AQI)</span>
              </div>

              {windowOpen && (
                <div className="pointer-events-auto px-3 py-1 rounded-xl bg-rose-950/80 backdrop-blur-md border border-rose-700/80 text-rose-300 text-[11px] font-bold flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Window Open: Smog Inflowing</span>
                </div>
              )}
            </div>

            {/* Floating Bottom Telemetry Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3">
              <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700 text-white text-xs flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Clean Air Delivery</span>
                  <span className="font-bold text-emerald-400">{activePurifier.cadr} m³/h ({ach} ACH)</span>
                </div>
                <div className="border-l border-slate-700 pl-4">
                  <span className="text-[10px] text-slate-400 block uppercase">Time to Clean Air</span>
                  <span className="font-bold text-white">{timeToCleanMin}</span>
                </div>
              </div>

              <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-300">
                <span>🖱️ Click & Drag to Orbit • Scroll to Zoom</span>
              </div>
            </div>
          </div>

          {/* Mask & Filter Efficacy Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">🛡️ True HEPA (H13) Filter</span>
              <p className="text-emerald-700">Captures 99.97% of PM2.5, pollen, and ultrafine smoke soot down to 0.1 microns.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-xs">
              <span className="font-bold text-blue-900 block mb-1">🌿 Indoor Snake Plants</span>
              <p className="text-blue-700">{hasPlants ? 'Active: Releases night oxygen & absorbs benzene/VOC gases.' : 'Disabled in room.'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80 text-xs">
              <span className="font-bold text-purple-900 block mb-1">🪟 Infiltration Warning</span>
              <p className="text-purple-700">{windowOpen ? 'Window open cancels out air purifier efficacy.' : 'Sealed windows preserve clean indoor air bubble.'}</p>
            </div>
          </div>

        </div>

        {/* Right: Simulation Controls & Sliders (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Purifier Fan Speed Selector */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-600" />
                <span>{currentLang === 'hi' ? 'शोधक पंखे की गति' : 'Air Purifier Power'}</span>
              </h4>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {activePurifier.powerWatts} Watts
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PURIFIER_SPEEDS.map((spd) => {
                const isSelected = spd.id === purifierSpeed;
                return (
                  <button
                    key={spd.id}
                    type="button"
                    onClick={() => setPurifierSpeed(spd.id)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-2xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{spd.label}</span>
                      {spd.id !== 'off' && <span className="text-2xs text-slate-400">{spd.noiseDb} dB</span>}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {spd.cadr > 0 ? `${spd.cadr} m³/h CADR` : 'Powered Off'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Environmental Controls (Window & Outdoor AQI) */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/90 space-y-5">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>{currentLang === 'hi' ? 'पर्यावरण नियंत्रण' : 'Environment & Aperture'}</span>
            </h4>

            {/* Window Open / Close Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {currentLang === 'hi' ? 'खिड़की की स्थिति' : 'Balcony Window Status'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {windowOpen ? 'Open: Influx of outdoor smog' : 'Sealed: Air bubble locked'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWindowOpen(!windowOpen)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  windowOpen
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-emerald-600 text-white shadow-xs'
                }`}
              >
                {windowOpen ? 'OPEN' : 'SEALED'}
              </button>
            </div>

            {/* Outdoor AQI Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {currentLang === 'hi' ? 'बाहरी शहर AQI' : 'Outdoor City Pollution'}
                </label>
                <span 
                  className="text-xs font-extrabold px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: outdoorLevel.bgColor, color: outdoorLevel.textColor }}
                >
                  {outdoorAqi} AQI
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={480}
                step={10}
                value={outdoorAqi}
                onChange={(e) => setOutdoorAqi(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1">
                <span>Clean (20)</span>
                <span>Moderate (100)</span>
                <span>Very Poor (250)</span>
                <span>Severe (480)</span>
              </div>
            </div>

            {/* Indoor Air-Purifying Plants Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  {currentLang === 'hi' ? 'संसेविया / स्नेक प्लांट' : 'Snake & Palm Plants'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHasPlants(!hasPlants)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  hasPlants ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {hasPlants ? 'Added (+5%)' : 'None'}
              </button>
            </div>

            {/* Simulation Speed Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Sim Speed:</span>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
                {[1, 2, 5].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setSimSpeed(spd)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      simSpeed === spd ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
