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
  Clock, 
  Play, 
  Pause, 
  Home, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Leaf,
  Zap,
  Moon,
  Laptop,
  Tv,
  BedDouble,
  Sofa
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getAQILevel } from '../../design-system/aqiTokens';

// Room Presets
const ROOM_PRESETS = [
  { 
    id: 'bedroom', 
    name: 'Master Bedroom', 
    areaSqFt: 180, 
    volumeM3: 45, 
    icon: '🛏️',
    scale: 0.9,
    description: 'Cozy private quarters with king bed, nightstands, warm bedside lamps & wardrobe.'
  },
  { 
    id: 'living', 
    name: 'Living Room', 
    areaSqFt: 360, 
    volumeM3: 90, 
    icon: '🛋️',
    scale: 1.0,
    description: 'Spacious family living room with sectional sofa, coffee table, media unit & large area rug.'
  },
  { 
    id: 'studio', 
    name: 'Studio / Open Office', 
    areaSqFt: 550, 
    volumeM3: 135, 
    icon: '🏢',
    scale: 1.15,
    description: 'High-ceiling creative studio with dual-monitor workstation, ergonomic chair, bookcase & whiteboard.'
  },
];

// Purifier Speeds
const PURIFIER_SPEEDS = [
  { id: 'off', label: 'OFF', cadr: 0, powerWatts: 0, noiseDb: 0, jetSpeed: 0 },
  { id: 'sleep', label: 'Sleep Mode', cadr: 120, powerWatts: 8, noiseDb: 22, jetSpeed: 0.6 },
  { id: 'auto', label: 'Balanced (Auto)', cadr: 280, powerWatts: 25, noiseDb: 38, jetSpeed: 1.4 },
  { id: 'turbo', label: 'Turbo (Max CADR)', cadr: 480, powerWatts: 55, noiseDb: 52, jetSpeed: 2.8 },
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
  const [indoorAqi, setIndoorAqi] = useState(initialOutdoorAqi * 0.72);
  const [autoRotate, setAutoRotate] = useState(true);

  // References for Three.js animation loop and dynamically toggled 3D objects
  const sceneRef = useRef(null);
  const roomGroupRef = useRef(null);
  const windowPaneRef = useRef(null);
  const outdoorBackdropRef = useRef(null);
  const purifierLedRef = useRef(null);
  const purifierAuraRef = useRef(null);
  const exhaustParticlesRef = useRef(null);
  const particleSystemRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Distinct room furniture groups
  const bedroomGroupRef = useRef(null);
  const livingGroupRef = useRef(null);
  const studioGroupRef = useRef(null);
  const plantGroupRef = useRef(null);

  // Physics simulation mutable values for 60fps loop
  const currentIndoorAqiRef = useRef(indoorAqi);
  const windowOpenRef = useRef(windowOpen);
  const purifierSpeedRef = useRef(purifierSpeed);
  const outdoorAqiRef = useRef(outdoorAqi);
  const roomVolumeRef = useRef(selectedRoom.volumeM3);
  const hasPlantsRef = useRef(hasPlants);
  const selectedRoomIdRef = useRef(selectedRoom.id);
  const targetScaleRef = useRef(selectedRoom.scale);

  // Sync refs with React state
  useEffect(() => { currentIndoorAqiRef.current = indoorAqi; }, [indoorAqi]);
  useEffect(() => { windowOpenRef.current = windowOpen; }, [windowOpen]);
  useEffect(() => { purifierSpeedRef.current = purifierSpeed; }, [purifierSpeed]);
  useEffect(() => { outdoorAqiRef.current = outdoorAqi; }, [outdoorAqi]);
  useEffect(() => { 
    roomVolumeRef.current = selectedRoom.volumeM3; 
    selectedRoomIdRef.current = selectedRoom.id;
    targetScaleRef.current = selectedRoom.scale;

    // Immediately toggle 3D furniture groups
    if (bedroomGroupRef.current) bedroomGroupRef.current.visible = (selectedRoom.id === 'bedroom');
    if (livingGroupRef.current) livingGroupRef.current.visible = (selectedRoom.id === 'living');
    if (studioGroupRef.current) studioGroupRef.current.visible = (selectedRoom.id === 'studio');
  }, [selectedRoom]);

  useEffect(() => { 
    hasPlantsRef.current = hasPlants; 
    if (plantGroupRef.current) {
      plantGroupRef.current.visible = hasPlants;
    }
  }, [hasPlants]);

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

  // Quick Scenarios
  const applyScenario = (type) => {
    if (type === 'smog') {
      setOutdoorAqi(420);
      setWindowOpen(true);
      setPurifierSpeed('off');
      setIndoorAqi(340);
    } else if (type === 'turbo') {
      setWindowOpen(false);
      setPurifierSpeed('turbo');
      setHasPlants(true);
    } else if (type === 'night') {
      const bedroom = ROOM_PRESETS[0];
      setSelectedRoom(bedroom);
      setWindowOpen(false);
      setPurifierSpeed('sleep');
      setOutdoorAqi(180);
      setIndoorAqi(45);
    }
  };

  // Simulation Clock Tick (advances simMinutes and updates indoor AQI)
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
      const naturalAch = windowOpenRef.current ? 4.8 : 0.22; // 4.8 ACH when window open, 0.22 when sealed
      const infiltrationRate = (naturalAch * (cOut - cIn)) / 60; // per minute delta
      const purifierCleaningRate = cadr > 0 ? ((cadr / vol) * cIn) / 60 : 0;
      const plantCleaningRate = hasPlantsRef.current ? 0.35 : 0;

      const delta = (infiltrationRate - purifierCleaningRate - plantCleaningRate) * (simSpeed * 0.7);
      const nextAqi = Math.max(10, Math.min(500, cIn + delta));

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
    camera.position.set(48, 40, 48);
    camera.lookAt(0, 4, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Sun / Window directional light
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    sunLight.position.set(-25, 32, -22);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Soft architectural fill light from open front-right
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    fillLight.position.set(32, 22, 32);
    scene.add(fillLight);

    // 5. Main Room Group
    const roomGroup = new THREE.Group();
    roomGroup.scale.set(selectedRoom.scale, selectedRoom.scale, selectedRoom.scale);
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
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.set(0, -1.0, 0);
    roomGroup.add(trimMesh);

    // 7. Back Wall & Left Wall Materials
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

    // Left Wall
    const lWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, ROOM_H, ROOM_D), wallMat);
    lWall.position.set(-ROOM_W / 2, ROOM_H / 2, 0);
    lWall.receiveShadow = true;
    roomGroup.add(lWall);

    // 8. Window Frame & Sliding Glass Pane
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

    // Outdoor View Backdrop Plane behind Window (Color updates dynamically with Outdoor AQI!)
    const outdoorBackdropGeo = new THREE.PlaneGeometry(24, 16);
    const outdoorBackdropMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc, side: THREE.DoubleSide });
    const outdoorBackdrop = new THREE.Mesh(outdoorBackdropGeo, outdoorBackdropMat);
    outdoorBackdrop.position.set(0, 7, -ROOM_D / 2 - 4);
    outdoorBackdropRef.current = outdoorBackdrop;
    roomGroup.add(outdoorBackdrop);

    // ==========================================
    // 9. DISTINCT ROOM 3D FURNITURE SETUPS
    // ==========================================

    // --- SETUP A: MASTER BEDROOM ---
    const bedroomGroup = new THREE.Group();
    bedroomGroupRef.current = bedroomGroup;
    bedroomGroup.visible = (selectedRoom.id === 'bedroom');

    // King Bed Base / Platform
    const bedBaseMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(13, 1.6, 16), bedBaseMat);
    bedBase.position.set(-3, 0.8, 1);
    bedroomGroup.add(bedBase);

    // High Upholstered Headboard
    const headboardMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(13.6, 6.5, 1.4), headboardMat);
    headboard.position.set(-3, 4.0, -6.5);
    bedroomGroup.add(headboard);

    // Crisp White Mattress
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(12.2, 1.6, 15), mattressMat);
    mattress.position.set(-3, 2.3, 1);
    bedroomGroup.add(mattress);

    // Cozy Deep Blue Duvet / Blanket
    const duvetMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.7 });
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(12.3, 0.5, 10.5), duvetMat);
    duvet.position.set(-3, 3.2, 3.2);
    bedroomGroup.add(duvet);

    // Soft Pillows (Left & Right)
    const pillowGeo = new THREE.BoxGeometry(4.2, 1.0, 2.8);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    const pillowL = new THREE.Mesh(pillowGeo, pillowMat);
    pillowL.position.set(-6.5, 3.3, -4.2);
    pillowL.rotation.x = 0.2;
    const pillowR = new THREE.Mesh(pillowGeo, pillowMat);
    pillowR.position.set(0.5, 3.3, -4.2);
    pillowR.rotation.x = 0.2;
    bedroomGroup.add(pillowL, pillowR);

    // Bedside Nightstand
    const standMat = new THREE.MeshStandardMaterial({ color: 0xc8b6a6, roughness: 0.5 });
    const nightstand = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 3.2), standMat);
    nightstand.position.set(-11.5, 1.2, -5.5);
    bedroomGroup.add(nightstand);

    // Bedside Lamp (Base + Glowing Warm Shade)
    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.5, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    lampBase.position.set(-11.5, 3.0, -5.5);
    const lampShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.2, 1.4, 16),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.5 })
    );
    lampShade.position.set(-11.5, 4.3, -5.5);
    bedroomGroup.add(lampBase, lampShade);

    // Bedroom Wardrobe / Armoire along left wall
    const wardrobeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(2.0, 11, 7.5), wardrobeMat);
    wardrobe.position.set(-13.8, 5.5, 5);
    bedroomGroup.add(wardrobe);

    // Bedroom Area Rug
    const bedRug = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 18),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.95 })
    );
    bedRug.rotation.x = -Math.PI / 2;
    bedRug.position.set(-3, 0.02, 2);
    bedroomGroup.add(bedRug);

    roomGroup.add(bedroomGroup);

    // --- SETUP B: LIVING ROOM ---
    const livingGroup = new THREE.Group();
    livingGroupRef.current = livingGroup;
    livingGroup.visible = (selectedRoom.id === 'living');

    // Sectional Sofa Base
    const sofaBaseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const sofaCushionMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });

    const sBase = new THREE.Mesh(new THREE.BoxGeometry(14, 1.6, 6), sofaBaseMat);
    sBase.position.set(-4, 0.8, 3);
    livingGroup.add(sBase);

    // Sofa Backrest
    const sBack = new THREE.Mesh(new THREE.BoxGeometry(14, 4.5, 1.8), sofaCushionMat);
    sBack.position.set(-4, 3.2, 0.8);
    livingGroup.add(sBack);

    // Sofa Armrests
    const sArmL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 6), sofaCushionMat);
    sArmL.position.set(-10.2, 2.0, 3);
    const sArmR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 6), sofaCushionMat);
    sArmR.position.set(2.2, 2.0, 3);
    livingGroup.add(sArmL, sArmR);

    // Decorative Sofa Accent Pillows
    const pillowAccent1 = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.8, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b })
    );
    pillowAccent1.position.set(-8.5, 2.8, 2.0);
    pillowAccent1.rotation.y = 0.2;
    const pillowAccent2 = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.8, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4 })
    );
    pillowAccent2.position.set(0.5, 2.8, 2.0);
    pillowAccent2.rotation.y = -0.2;
    livingGroup.add(pillowAccent1, pillowAccent2);

    // Coffee Table (Oak top with dark steel legs)
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(7, 0.6, 4), new THREE.MeshStandardMaterial({ color: 0xc8b6a6 }));
    tableTop.position.set(-4, 2.0, 8.5);
    livingGroup.add(tableTop);

    // Coffee Table Legs
    const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    [[-6.8, 7], [-1.2, 7], [-6.8, 10], [-1.2, 10]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.9, z);
      livingGroup.add(leg);
    });

    // Wall-Mounted 60" Smart OLED TV on Left Wall
    const tvFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 5.5, 9.5),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 })
    );
    tvFrame.position.set(-14.4, 7.5, 3);
    const tvScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(9.0, 5.0),
      new THREE.MeshBasicMaterial({ color: 0x1e293b })
    );
    tvScreen.rotation.y = Math.PI / 2;
    tvScreen.position.set(-14.2, 7.5, 3);
    livingGroup.add(tvFrame, tvScreen);

    // TV Media Credenza underneath
    const tvStand = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.8, 11),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 })
    );
    tvStand.position.set(-13.8, 0.9, 3);
    livingGroup.add(tvStand);

    // Living Room Area Rug
    const livingRug = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 12),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 })
    );
    livingRug.rotation.x = -Math.PI / 2;
    livingRug.position.set(-4, 0.02, 6);
    livingGroup.add(livingRug);

    roomGroup.add(livingGroup);

    // --- SETUP C: STUDIO / OPEN OFFICE ---
    const studioGroup = new THREE.Group();
    studioGroupRef.current = studioGroup;
    studioGroup.visible = (selectedRoom.id === 'studio');

    // Executive Office Desk Top (Contemporary dark walnut)
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(14, 0.8, 6.5),
      new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.4 })
    );
    deskTop.position.set(-3.5, 3.8, 3);
    studioGroup.add(deskTop);

    // Desk Trestle Legs (Matte black aluminum)
    const deskLegMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const deskLegL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.6, 5.8), deskLegMat);
    deskLegL.position.set(-9.6, 1.8, 3);
    const deskLegR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.6, 5.8), deskLegMat);
    deskLegR.position.set(2.6, 1.8, 3);
    studioGroup.add(deskLegL, deskLegR);

    // Primary Ultrawide Curved Monitor
    const mon1Stand = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.8, 1.6), deskLegMat);
    mon1Stand.position.set(-5.5, 4.8, 1.2);
    const mon1 = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 3.2, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x09090b })
    );
    mon1.position.set(-5.5, 6.0, 1.2);
    const mon1Screen = new THREE.Mesh(
      new THREE.PlaneGeometry(6.0, 3.0),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 }) // Glowing blue IDE screen
    );
    mon1Screen.position.set(-5.5, 6.0, 1.36);
    studioGroup.add(mon1Stand, mon1, mon1Screen);

    // Secondary Portrait Monitor (Right)
    const mon2Stand = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.6, 1.6), deskLegMat);
    mon2Stand.position.set(-1.2, 4.8, 1.2);
    const mon2 = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 4.2, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x09090b })
    );
    mon2.position.set(-1.2, 6.4, 1.2);
    const mon2Screen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 4.0),
      new THREE.MeshBasicMaterial({ color: 0x10b981 }) // Glowing emerald chart screen
    );
    mon2Screen.position.set(-1.2, 6.4, 1.36);
    studioGroup.add(mon2Stand, mon2, mon2Screen);

    // Workstation Keyboard & Mousepad
    const padMat = new THREE.MeshStandardMaterial({ color: 0x18181b });
    const deskPad = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.05, 3.0), padMat);
    deskPad.position.set(-3.5, 4.22, 3.6);
    const keyboard = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.15, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x3f3f46 })
    );
    keyboard.position.set(-4.5, 4.3, 3.6);
    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.2, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x71717a })
    );
    mouse.position.set(-1.0, 4.3, 3.6);
    studioGroup.add(deskPad, keyboard, mouse);

    // Ergonomic High-Back Task Chair
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-3.5, 0, 7.5);
    // Chair 5-Star Caster Base
    const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.4, 8), deskLegMat);
    chairBase.position.y = 0.4;
    chairGroup.add(chairBase);
    // Gas cylinder stem
    const chairStem = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.8), deskLegMat);
    chairStem.position.y = 1.4;
    chairGroup.add(chairStem);
    // Padded seat
    const chairSeat = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.7, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 })
    );
    chairSeat.position.y = 2.4;
    chairGroup.add(chairSeat);
    // Mesh Ergonomic Backrest
    const chairBack = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 4.5, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.7 })
    );
    chairBack.position.set(0, 4.6, 1.3);
    chairGroup.add(chairBack);
    studioGroup.add(chairGroup);

    // Tall Modular Bookcase / Tech Shelving against left wall
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const shelfUnit = new THREE.Mesh(new THREE.BoxGeometry(2.0, 11, 7.5), shelfMat);
    shelfUnit.position.set(-13.8, 5.5, 3.5);
    studioGroup.add(shelfUnit);

    // Colorful Book Rows inside shelf
    const bookColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6];
    for (let i = 0; i < 5; i++) {
      const bookMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.8, 0.5),
        new THREE.MeshStandardMaterial({ color: bookColors[i] })
      );
      bookMesh.position.set(-12.7, 4.2, 1.0 + i * 0.7);
      studioGroup.add(bookMesh);
    }

    // Studio Whiteboard on Back Wall
    const boardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const whiteboard = new THREE.Mesh(new THREE.BoxGeometry(7.5, 4.2, 0.2), boardMat);
    whiteboard.position.set(-8.5, 8.5, -ROOM_D / 2 + 0.5);
    const boardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(7.7, 4.4, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    boardFrame.position.set(-8.5, 8.5, -ROOM_D / 2 + 0.4);
    studioGroup.add(boardFrame, whiteboard);

    roomGroup.add(studioGroup);

    // ==========================================
    // 10. AIR-PURIFYING PLANTS (Toggled via plantGroupRef)
    // ==========================================
    const plantGroup = new THREE.Group();
    plantGroupRef.current = plantGroup;
    plantGroup.visible = hasPlants;

    // Plant A: Minimalist Indoor Snake Plant (Corner 1)
    const potA = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.1, 2.5, 16),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 })
    );
    potA.position.set(-11.5, 1.25, -10.5);
    plantGroup.add(potA);

    const leafGeo = new THREE.BoxGeometry(0.3, 4.5, 0.8);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(-11.5 + Math.sin(i) * 0.4, 3.5, -10.5 + Math.cos(i) * 0.4);
      leaf.rotation.z = (Math.random() - 0.5) * 0.25;
      leaf.rotation.y = (i * Math.PI) / 3.5;
      plantGroup.add(leaf);
    }

    // Plant B: Large Potted Areca Palm (Corner 2)
    const potB = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.2, 2.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 }) // Terracotta pot
    );
    potB.position.set(11.5, 1.4, -10.5);
    plantGroup.add(potB);

    const palmLeafGeo = new THREE.BoxGeometry(0.2, 5.5, 1.2);
    const palmLeafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });
    for (let i = 0; i < 8; i++) {
      const pLeaf = new THREE.Mesh(palmLeafGeo, palmLeafMat);
      pLeaf.position.set(11.5 + Math.sin(i) * 0.5, 4.0, -10.5 + Math.cos(i) * 0.5);
      pLeaf.rotation.z = 0.35 * Math.sin(i);
      pLeaf.rotation.x = 0.35 * Math.cos(i);
      pLeaf.rotation.y = (i * Math.PI) / 4;
      plantGroup.add(pLeaf);
    }

    roomGroup.add(plantGroup);

    // ==========================================
    // 11. HEPA TOWER AIR PURIFIER
    // ==========================================
    const purifierGroup = new THREE.Group();
    purifierGroup.position.set(8.5, 0, 8.5);

    // Intake Grill (Lower Mesh)
    const intakeGeo = new THREE.CylinderGeometry(1.7, 1.7, 3.4, 24);
    const intakeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.2 });
    const intakeMesh = new THREE.Mesh(intakeGeo, intakeMat);
    intakeMesh.position.y = 1.7;
    purifierGroup.add(intakeMesh);

    // Upper Body (Matte White)
    const bodyGeo = new THREE.CylinderGeometry(1.6, 1.7, 3.0, 24);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 4.8;
    purifierGroup.add(bodyMesh);

    // Top Glowing LED Ring (Changes color with Indoor AQI: Green/Amber/Red)
    const ledGeo = new THREE.TorusGeometry(1.4, 0.12, 16, 32);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const ledRing = new THREE.Mesh(ledGeo, ledMat);
    ledRing.rotation.x = Math.PI / 2;
    ledRing.position.y = 6.32;
    purifierLedRef.current = ledRing;
    purifierGroup.add(ledRing);

    // Purified Air Aura Dome (Translucent glowing clean bubble)
    const auraGeo = new THREE.SphereGeometry(6.5, 24, 24);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.12,
      wireframe: true
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.position.y = 4.5;
    purifierAuraRef.current = auraMesh;
    purifierGroup.add(auraMesh);

    // UPWARD AIRFLOW JET (Visual clean exhaust shooting upwards)
    const EXHAUST_COUNT = 90;
    const exhaustPositions = new Float32Array(EXHAUST_COUNT * 3);
    const exhaustVelocities = [];

    for (let i = 0; i < EXHAUST_COUNT; i++) {
      exhaustPositions[i * 3] = (Math.random() - 0.5) * 1.5;
      exhaustPositions[i * 3 + 1] = 6.4 + Math.random() * 6;
      exhaustPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      exhaustVelocities.push({
        y: 0.15 + Math.random() * 0.15,
        drift: (Math.random() - 0.5) * 0.02
      });
    }

    const exhaustGeo = new THREE.BufferGeometry();
    exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exhaustPositions, 3));
    const exhaustMat = new THREE.PointsMaterial({
      color: 0x38bdf8, // Clean cyan/emerald
      size: 0.35,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const exhaustParticles = new THREE.Points(exhaustGeo, exhaustMat);
    exhaustParticlesRef.current = exhaustParticles;
    purifierGroup.add(exhaustParticles);

    roomGroup.add(purifierGroup);

    // ==========================================
    // 12. FLOATING ATMOSPHERIC SMOG PARTICLES (1,200 micro-particles)
    // ==========================================
    const PARTICLE_COUNT = 1200;
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleVelocities = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
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
      size: 0.32,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystemRef.current = particleSystem;
    roomGroup.add(particleSystem);

    // ==========================================
    // 13. ORBIT INTERACTION & RAYCASTING (Mouse & Touch)
    // ==========================================
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
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
      if (dist > 115) camera.position.setLength(115);
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

    // ==========================================
    // 14. ANIMATION LOOP (60 FPS)
    // ==========================================
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth room scaling interpolation
      if (roomGroupRef.current) {
        const currentS = roomGroupRef.current.scale.x;
        const targetS = targetScaleRef.current;
        const nextS = currentS + (targetS - currentS) * 0.08;
        roomGroupRef.current.scale.set(nextS, nextS, nextS);
      }

      // Gentle auto-rotation when user is not dragging
      if (autoRotate && !isDragging) {
        roomGroup.rotation.y += 0.0018;
      }

      // Smooth Window Open / Close animation
      if (windowPaneRef.current) {
        const targetX = windowOpenRef.current ? -5.5 : 0;
        windowPaneRef.current.position.x += (targetX - windowPaneRef.current.position.x) * 0.1;
      }

      // Dynamic Outdoor Backdrop Color (reflects outdoor AQI)
      if (outdoorBackdropRef.current) {
        const outAqi = outdoorAqiRef.current;
        let skyHex = 0x7dd3fc; // Clean blue
        if (outAqi > 250) skyHex = 0x78350f; // Toxic smog sepia
        else if (outAqi > 150) skyHex = 0xd97706; // Hazy amber
        else if (outAqi > 80) skyHex = 0x94a3b8; // Moderate gray-blue
        outdoorBackdropRef.current.material.color.setHex(skyHex);
      }

      // Update Purifier LED Ring & Aura color based on indoor AQI
      const cIn = currentIndoorAqiRef.current;
      const currentLevel = getAQILevel(Math.round(cIn));
      const targetColor = new THREE.Color(currentLevel.color);
      const currentSpeed = purifierSpeedRef.current;
      const isPurifierOn = currentSpeed !== 'off';

      if (purifierLedRef.current) {
        if (!isPurifierOn) {
          purifierLedRef.current.material.color.setHex(0x475569); // Off dark gray
        } else {
          purifierLedRef.current.material.color.copy(targetColor);
        }
      }

      if (purifierAuraRef.current) {
        purifierAuraRef.current.visible = isPurifierOn;
        if (isPurifierOn) {
          purifierAuraRef.current.material.color.copy(targetColor);
          const pulseSpeed = currentSpeed === 'turbo' ? 6 : currentSpeed === 'auto' ? 3 : 1;
          const pulse = 1 + Math.sin(elapsedTime * pulseSpeed) * 0.04;
          purifierAuraRef.current.scale.set(pulse, pulse, pulse);
        }
      }

      // Animate Upward Exhaust Air Jet Particles
      if (exhaustParticlesRef.current) {
        exhaustParticlesRef.current.visible = isPurifierOn;
        if (isPurifierOn) {
          const exPos = exhaustParticlesRef.current.geometry.attributes.position.array;
          const speedMultiplier = currentSpeed === 'turbo' ? 2.5 : currentSpeed === 'auto' ? 1.2 : 0.5;

          for (let i = 0; i < EXHAUST_COUNT; i++) {
            const idx = i * 3;
            exPos[idx + 1] += exhaustVelocities[i].y * speedMultiplier;
            exPos[idx] += exhaustVelocities[i].drift;

            // Reset when reaching top
            if (exPos[idx + 1] > 13.5) {
              exPos[idx] = (Math.random() - 0.5) * 1.5;
              exPos[idx + 1] = 6.4;
              exPos[idx + 2] = (Math.random() - 0.5) * 1.5;
            }
          }
          exhaustParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      // Dynamic Particle Movement & Purifier Suction Physics
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array;
        const purifierPos = new THREE.Vector3(8.5, 2.5, 8.5);

        // Update particle color tone & density based on indoor AQI
        particleSystemRef.current.material.color.copy(targetColor);
        particleSystemRef.current.material.opacity = Math.max(0.25, Math.min(0.92, cIn / 260));

        const suctionMultiplier = currentSpeed === 'turbo' ? 2.2 : currentSpeed === 'auto' ? 1.0 : currentSpeed === 'sleep' ? 0.4 : 0;

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
          if (isPurifierOn && suctionMultiplier > 0) {
            const dx = purifierPos.x - px;
            const dy = purifierPos.y - py;
            const dz = purifierPos.z - pz;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < 130) {
              // Suction vortex force proportional to purifier CADR speed
              const force = (0.1 * suctionMultiplier) / (Math.sqrt(distSq) + 0.4);
              px += dx * force;
              py += dy * force;
              pz += dz * force;

              // Absorbed by filter: respawn in room as clean filtered air
              if (distSq < 2.2) {
                px = (Math.random() - 0.5) * 14;
                py = Math.random() * 8 + 1;
                pz = (Math.random() - 0.5) * 14;
              }
            }
          }

          // If Window is OPEN, actively stream in outdoor smog particles through window opening!
          if (windowOpenRef.current && i % 7 === 0) {
            if (pz > 7 || Math.random() < 0.015) {
              px = (Math.random() - 0.5) * 7;
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
      cameraRef.current.position.set(48, 40, 48);
      cameraRef.current.lookAt(0, 4, 0);
    }
    if (roomGroupRef.current) {
      roomGroupRef.current.rotation.y = 0;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Top Simulator Header & Presets */}
      <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800/90 text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLang === 'hi' ? '3D स्मार्ट होम सिम्युलेटर' : '3D WebGL Multi-Room Fluid Simulator'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white font-display">
              {currentLang === 'hi' ? 'स्मार्ट होम वायु शोधक 3D सिम्युलेटर' : '3D Smart Home & HEPA Air Purifier Simulator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              {currentLang === 'hi'
                ? 'मास्टर बेडरूम, लिविंग रूम या स्टूडियो ऑफिस में स्विच करें और देखें कि एयर प्यूरीफायर विभिन्न परिस्थितियों में हवा को कैसे शुद्ध करता है।'
                : 'Switch between Master Bedroom, Living Room, and Studio Office in real-time. Experience dynamic 3D furniture swaps, window infiltration, and HEPA exhaust airflow physics.'}
            </p>
          </div>

          {/* Quick Realtime Telemetry Stats Pill */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[120px] shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {currentLang === 'hi' ? 'इनडोर AQI' : 'Indoor AQI'}
              </span>
              <span 
                className="text-2xl sm:text-3xl font-black font-display block transition-colors"
                style={{ color: indoorLevel.color }}
              >
                {Math.round(indoorAqi)}
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                {indoorLevel.category}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[120px] shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {currentLang === 'hi' ? 'आउटडोर AQI' : 'Outdoor City AQI'}
              </span>
              <span 
                className="text-2xl sm:text-3xl font-black font-display block transition-colors"
                style={{ color: outdoorLevel.color }}
              >
                {outdoorAqi}
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                {outdoorLevel.category}
              </span>
            </div>
          </div>
        </div>

        {/* Room Presets Tabs (Bedroom / Living / Studio Office) */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-400" />
              <span>{currentLang === 'hi' ? 'कमरा चुनें (3D दृश्य बदलें):' : 'Select Room Preset (3D Layout Swaps Instantly):'}</span>
            </label>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
              Active: {selectedRoom.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {ROOM_PRESETS.map((room) => {
              const isSelected = room.id === selectedRoom.id;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setSelectedRoom(room)}
                  className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/60 shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500/30 text-white'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/70 hover:bg-slate-900/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{room.icon}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${isSelected ? 'bg-emerald-900/80 text-emerald-200' : 'bg-slate-900 text-slate-400'}`}>
                      {room.areaSqFt} sq ft • {room.volumeM3} m³
                    </span>
                  </div>
                  <div className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{room.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1-Click Scenario Simulation Shortcuts */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Scenarios:</span>
          </span>
          <button
            type="button"
            onClick={() => applyScenario('smog')}
            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Delhi Smog Influx (Window Open)</span>
          </button>
          <button
            type="button"
            onClick={() => applyScenario('turbo')}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
            <span>Turbo Purification Cycle</span>
          </button>
          <button
            type="button"
            onClick={() => applyScenario('night')}
            className="px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/60 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quiet Nighttime Sleep</span>
          </button>
        </div>
      </div>

      {/* 2. Main 3D WebGL Canvas & Right Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: 3D Canvas Container (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800/90 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedRoom.icon}</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {selectedRoom.name} 3D Microclimate View
              </h3>
            </div>

            {/* Quick 3D Camera Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  autoRotate
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span>{autoRotate ? 'Auto-Orbit: ON' : 'Orbit: PAUSED'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetCamera}
                className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset Camera View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Reset View</span>
              </button>
            </div>
          </div>

          {/* WebGL Canvas Mount Container */}
          <div className="relative w-full h-[500px] sm:h-[560px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 to-black border border-slate-800 shadow-2xl">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Floating Top In-Canvas HUD */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-2">
              <div className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700 text-white text-xs flex items-center gap-2 shadow-xl">
                <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: indoorLevel.color }}></span>
                <span className="font-bold">{indoorLevel.category} ({Math.round(indoorAqi)} AQI)</span>
              </div>

              {windowOpen ? (
                <div className="pointer-events-auto px-3 py-1.5 rounded-xl bg-rose-950/90 backdrop-blur-md border border-rose-600/80 text-rose-300 text-xs font-bold flex items-center gap-2 animate-pulse shadow-xl">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Window Open: Smog Inflowing</span>
                </div>
              ) : (
                <div className="pointer-events-auto px-3 py-1.5 rounded-xl bg-emerald-950/90 backdrop-blur-md border border-emerald-600/80 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Window Sealed: Air Bubble Protected</span>
                </div>
              )}
            </div>

            {/* Floating Top Right Room Tag */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <div className="pointer-events-auto px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2">
                <span>{selectedRoom.icon} {selectedRoom.name}</span>
              </div>
            </div>

            {/* Floating Bottom Telemetry Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3">
              <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 text-white text-xs flex items-center gap-4 shadow-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Purifier CADR</span>
                  <span className="font-extrabold text-emerald-400">{activePurifier.cadr} m³/h ({ach} ACH)</span>
                </div>
                <div className="border-l border-slate-700 pl-4">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">90% Clearance Time</span>
                  <span className="font-extrabold text-white">{timeToCleanMin}</span>
                </div>
                <div className="border-l border-slate-700 pl-4 hidden sm:block">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Plants Filter</span>
                  <span className="font-bold text-emerald-400">{hasPlants ? 'Active (+5%)' : 'None'}</span>
                </div>
              </div>

              <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-[11px] text-slate-300 font-medium">
                <span>🖱️ Click & Drag to Orbit • Scroll to Zoom</span>
              </div>
            </div>
          </div>

          {/* Room Setup Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="font-bold text-emerald-300 block mb-1">🛡️ True HEPA H13 Air Purifier</span>
              <p className="text-slate-400">
                Active in 3D scene with top LED ring and upward clean air exhaust stream.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="font-bold text-blue-300 block mb-1">🌿 Natural Air-Purifying Plants</span>
              <p className="text-slate-400">
                {hasPlants ? 'Snake plant & Areca Palm visible in room, filtering VOCs.' : 'Plants hidden. Toggle plant switch on the right to add them.'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="font-bold text-amber-300 block mb-1">🪟 Balcony Window Dynamic</span>
              <p className="text-slate-400">
                {windowOpen ? 'Window is OPEN: Outside smog streams in actively!' : 'Window is SEALED: Infiltration is strictly minimized.'}
              </p>
            </div>
          </div>

        </div>

        {/* Right: Simulation Controls & Sliders (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Purifier Fan Speed Selector */}
          <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-400" />
                <span>{currentLang === 'hi' ? 'वायु शोधक पंखा गति' : 'Purifier Fan Speed'}</span>
              </h4>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800">
                {activePurifier.powerWatts} Watts
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {PURIFIER_SPEEDS.map((spd) => {
                const isSelected = spd.id === purifierSpeed;
                return (
                  <button
                    key={spd.id}
                    type="button"
                    onClick={() => setPurifierSpeed(spd.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/70 text-white font-bold shadow-lg ring-2 ring-emerald-500/30'
                        : 'border-slate-800 hover:border-slate-700 text-slate-300 bg-slate-950/70 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{spd.label}</span>
                      {spd.id !== 'off' && <span className="text-2xs text-slate-500">{spd.noiseDb} dB</span>}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {spd.cadr > 0 ? `${spd.cadr} m³/h CADR` : 'Zero CADR'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Environmental Controls (Window & Outdoor AQI) */}
          <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/90 space-y-5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>{currentLang === 'hi' ? 'पर्यावरण नियंत्रण' : 'Environment & Aperture'}</span>
            </h4>

            {/* Window Open / Close Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">
                  {currentLang === 'hi' ? 'खिड़की की स्थिति' : 'Balcony Window Status'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {windowOpen ? 'OPEN (Smog inflowing in 3D)' : 'SEALED (Protected air bubble)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWindowOpen(!windowOpen)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md ${
                  windowOpen
                    ? 'bg-rose-600 hover:bg-rose-500 text-white ring-2 ring-rose-400/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40'
                }`}
              >
                {windowOpen ? 'OPEN' : 'SEALED'}
              </button>
            </div>

            {/* Outdoor AQI Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {currentLang === 'hi' ? 'बाहरी शहर AQI' : 'Outdoor City Pollution'}
                </label>
                <span 
                  className="text-xs font-extrabold px-2.5 py-0.5 rounded-md shadow-md"
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
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-1">
                <span>Clean (20)</span>
                <span>Moderate (100)</span>
                <span>Very Poor (250)</span>
                <span>Severe (480)</span>
              </div>
            </div>

            {/* Indoor Air-Purifying Plants Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {currentLang === 'hi' ? 'संसेविया / अरेका पाम पौधे' : 'Snake & Areca Palm Plants'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {hasPlants ? 'Visible in 3D corners' : 'Hidden from 3D room'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHasPlants(!hasPlants)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  hasPlants 
                    ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                }`}
              >
                {hasPlants ? 'Added (+5%)' : 'None'}
              </button>
            </div>

            {/* Simulation Speed Buttons */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Sim Speed:</span>
              </span>
              <div className="inline-flex p-1 bg-slate-950 rounded-xl text-xs font-bold border border-slate-800">
                {[1, 2, 5].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setSimSpeed(spd)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      simSpeed === spd ? 'bg-emerald-600 text-white shadow-xs font-extrabold' : 'text-slate-400 hover:text-white'
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
