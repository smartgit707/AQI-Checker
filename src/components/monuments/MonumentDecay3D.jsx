import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Maximize2, 
  Sparkles, 
  Eye, 
  Layers, 
  Droplets, 
  Wind,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function MonumentDecay3D({ 
  monument, 
  activeTimelineIndex, 
  isMudPackActive,
  onMudPackComplete 
}) {
  const mountRef = useRef(null);

  // References for Three.js render loop and tweening
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  // 3D Groups
  const monumentGroupRef = useRef(null);
  const particlesGroupRef = useRef(null);
  const mudPackMeshGroupRef = useRef(null);

  // Mouse orbit interaction state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationTargetRef = useRef({ x: 0.15, y: -0.4 });
  const rotationCurrentRef = useRef({ x: 0.15, y: -0.4 });
  const zoomTargetRef = useRef(42);
  const zoomCurrentRef = useRef(42);

  // Material references for live color & texture updates
  const marbleMaterialsRef = useRef([]);
  const mudPackMaterialsRef = useRef([]);

  const currentTimelineData = monument?.timeline?.[activeTimelineIndex] || monument?.timeline?.[0];

  // 1. Scene Setup & Procedural Model Generation
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene & Atmospheric Smog Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(
      currentTimelineData?.fogColor || 0x87ceeb,
      currentTimelineData?.fogDensity || 0.005
    );
    sceneRef.current = scene;

    // 2. Perspective Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 12, 42);
    cameraRef.current = camera;

    // 3. High-Quality WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Cinematic Atmospheric Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Warm Key Sunlight
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    sunLight.position.set(30, 45, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Soft Cyan Sky Fill Light
    const skyLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    skyLight.position.set(-25, 20, -20);
    scene.add(skyLight);

    // 5. Build Procedural Monument Geometry
    const monumentGroup = new THREE.Group();
    monumentGroupRef.current = monumentGroup;
    scene.add(monumentGroup);

    marbleMaterialsRef.current = [];
    mudPackMaterialsRef.current = [];

    // Helper to create marble standard material
    const createMarbleMat = (roughness = 0.35) => {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(currentTimelineData?.marbleColor || '#ffffff'),
        roughness: roughness,
        metalness: 0.05,
        flatShading: false
      });
      marbleMaterialsRef.current.push(mat);
      return mat;
    };

    // Helper to create mud-pack clay material
    const createMudPackMat = () => {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d4b483'), // earthy Multani Mitti bentonite clay
        roughness: 0.95,
        metalness: 0.0,
        transparent: true,
        opacity: 0.0
      });
      mudPackMaterialsRef.current.push(mat);
      return mat;
    };

    // ========================================================
    // BUILD TAJ MAHAL PROCEDURAL 3D ARCHITECTURE
    // ========================================================
    if (monument?.id === 'taj_mahal') {
      const stoneMat = createMarbleMat(0.35);
      const darkInlayMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.5 });
      const goldFinialMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8, roughness: 0.2 });

      // 1. Raised Marble Plinth Terrace
      const plinthGeo = new THREE.BoxGeometry(22, 1.6, 22);
      const plinthMesh = new THREE.Mesh(plinthGeo, stoneMat);
      plinthMesh.position.y = 0.8;
      plinthMesh.receiveShadow = true;
      monumentGroup.add(plinthMesh);

      // Sub-plinth steps
      const subPlinthGeo = new THREE.BoxGeometry(24, 0.4, 24);
      const subPlinthMesh = new THREE.Mesh(subPlinthGeo, createMarbleMat(0.5));
      subPlinthMesh.position.y = 0.2;
      monumentGroup.add(subPlinthMesh);

      // 2. Main Octagonal Tomb Body
      const tombWidth = 11.5;
      const tombHeight = 9.5;
      const tombGeo = new THREE.BoxGeometry(tombWidth, tombHeight, tombWidth);
      const tombMesh = new THREE.Mesh(tombGeo, stoneMat);
      tombMesh.position.y = 1.6 + tombHeight / 2;
      tombMesh.castShadow = true;
      tombMesh.receiveShadow = true;
      monumentGroup.add(tombMesh);

      // 4 Grand Archways (Pishtaq / Iwans)
      const archFrameGeo = new THREE.BoxGeometry(5.2, 7.5, 0.6);
      const archVoidGeo = new THREE.BoxGeometry(3.6, 6.0, 1.2);
      
      const archPositions = [
        { x: 0, z: tombWidth / 2 + 0.1, rotY: 0 },
        { x: 0, z: -tombWidth / 2 - 0.1, rotY: Math.PI },
        { x: tombWidth / 2 + 0.1, z: 0, rotY: Math.PI / 2 },
        { x: -tombWidth / 2 - 0.1, z: 0, rotY: -Math.PI / 2 }
      ];

      archPositions.forEach((pos) => {
        const archPortal = new THREE.Group();
        archPortal.position.set(pos.x, 1.6 + 4.2, pos.z);
        archPortal.rotation.y = pos.rotY;

        // Arch Frame
        const frame = new THREE.Mesh(archFrameGeo, createMarbleMat(0.3));
        frame.castShadow = true;
        archPortal.add(frame);

        // Recessed Vault Shadow
        const vaultVoid = new THREE.Mesh(archVoidGeo, darkInlayMat);
        vaultVoid.position.z = -0.4;
        archPortal.add(vaultVoid);

        monumentGroup.add(archPortal);
      });

      // 3. High Cylindrical Drum
      const drumGeo = new THREE.CylinderGeometry(4.2, 4.4, 3.2, 32);
      const drumMesh = new THREE.Mesh(drumGeo, stoneMat);
      drumMesh.position.y = 1.6 + tombHeight + 1.6;
      drumMesh.castShadow = true;
      monumentGroup.add(drumMesh);

      // 4. Iconic Bulbous Onion Dome
      const domeGeo = new THREE.SphereGeometry(4.4, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62);
      domeGeo.scale(1.0, 1.35, 1.0);
      const domeMesh = new THREE.Mesh(domeGeo, stoneMat);
      domeMesh.position.y = 1.6 + tombHeight + 3.0;
      domeMesh.castShadow = true;
      monumentGroup.add(domeMesh);

      // Lotus petal crown on top of dome
      const lotusGeo = new THREE.CylinderGeometry(0.8, 1.4, 0.6, 16);
      const lotusMesh = new THREE.Mesh(lotusGeo, stoneMat);
      lotusMesh.position.y = 1.6 + tombHeight + 3.0 + 5.6;
      monumentGroup.add(lotusMesh);

      // Brass/Gold Finial Spire
      const finialGeo = new THREE.CylinderGeometry(0.08, 0.25, 2.8, 8);
      const finialMesh = new THREE.Mesh(finialGeo, goldFinialMat);
      finialMesh.position.y = 1.6 + tombHeight + 3.0 + 7.0;
      monumentGroup.add(finialMesh);

      // 5. 4 Corner Chattris (Domed Kiosks)
      const chattriDist = 4.8;
      const chattriCoords = [
        { x: chattriDist, z: chattriDist },
        { x: -chattriDist, z: chattriDist },
        { x: chattriDist, z: -chattriDist },
        { x: -chattriDist, z: -chattriDist }
      ];

      chattriCoords.forEach((c) => {
        const chattri = new THREE.Group();
        chattri.position.set(c.x, 1.6 + tombHeight, c.z);

        // 4 pillars
        for (let px = -0.6; px <= 0.6; px += 1.2) {
          for (let pz = -0.6; pz <= 0.6; pz += 1.2) {
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 8), stoneMat);
            pillar.position.set(px, 1.1, pz);
            chattri.add(pillar);
          }
        }

        // Small dome
        const smDome = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), stoneMat);
        smDome.position.y = 2.2;
        chattri.add(smDome);

        monumentGroup.add(chattri);
      });

      // 6. 4 Independent Minarets on Plinth Corners
      const minaretDist = 9.2;
      const minaretCoords = [
        { x: minaretDist, z: minaretDist },
        { x: -minaretDist, z: minaretDist },
        { x: minaretDist, z: -minaretDist },
        { x: -minaretDist, z: -minaretDist }
      ];

      minaretCoords.forEach((m) => {
        const minaret = new THREE.Group();
        minaret.position.set(m.x, 1.6, m.z);

        // Minaret Base
        const mBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 1.2, 12), stoneMat);
        mBase.position.y = 0.6;
        minaret.add(mBase);

        // 3 Tiers with Balconies
        let curY = 1.2;
        for (let tier = 0; tier < 3; tier++) {
          const rTop = 0.85 - tier * 0.08;
          const rBot = 0.95 - tier * 0.08;
          const shaft = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, 4.2, 16), stoneMat);
          shaft.position.y = curY + 2.1;
          shaft.castShadow = true;
          minaret.add(shaft);

          // Balcony Ring
          const balcony = new THREE.Mesh(new THREE.CylinderGeometry(rTop + 0.35, rTop + 0.1, 0.35, 16), stoneMat);
          balcony.position.y = curY + 4.2;
          minaret.add(balcony);

          curY += 4.4;
        }

        // Cupola on Minaret Top
        const cupola = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.6), stoneMat);
        cupola.position.y = curY + 0.5;
        minaret.add(cupola);

        monumentGroup.add(minaret);
      });

      // 7. Foreground Water Reflection Pool
      const poolGeo = new THREE.PlaneGeometry(16, 26);
      const poolMat = new THREE.MeshStandardMaterial({
        color: 0x0f293a,
        roughness: 0.15,
        metalness: 0.85
      });
      const poolMesh = new THREE.Mesh(poolGeo, poolMat);
      poolMesh.rotation.x = -Math.PI / 2;
      poolMesh.position.set(0, 0.05, 16);
      scene.add(poolMesh);
    }

    // ========================================================
    // BUILD INDIA GATE PROCEDURAL 3D ARCHITECTURE
    // ========================================================
    else {
      const stoneMat = createMarbleMat(0.6);
      const darkStoneMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.7 });

      // Stepped Base
      const baseGeo = new THREE.BoxGeometry(20, 1.4, 12);
      const baseMesh = new THREE.Mesh(baseGeo, stoneMat);
      baseMesh.position.y = 0.7;
      monumentGroup.add(baseMesh);

      // Left & Right Massive Pylons
      const pylonWidth = 5.2;
      const pylonHeight = 15;
      const pylonDepth = 9.5;

      const pylonGeo = new THREE.BoxGeometry(pylonWidth, pylonHeight, pylonDepth);

      const leftPylon = new THREE.Mesh(pylonGeo, stoneMat);
      leftPylon.position.set(-5.6, 1.4 + pylonHeight / 2, 0);
      leftPylon.castShadow = true;
      monumentGroup.add(leftPylon);

      const rightPylon = new THREE.Mesh(pylonGeo, stoneMat);
      rightPylon.position.set(5.6, 1.4 + pylonHeight / 2, 0);
      rightPylon.castShadow = true;
      monumentGroup.add(rightPylon);

      // Central Spanning Vault
      const vaultGeo = new THREE.BoxGeometry(6.2, 4.5, pylonDepth);
      const vaultMesh = new THREE.Mesh(vaultGeo, stoneMat);
      vaultMesh.position.set(0, 1.4 + pylonHeight - 2.25, 0);
      monumentGroup.add(vaultMesh);

      // Grand Upper Entablature & Attic Frieze
      const atticGeo = new THREE.BoxGeometry(18, 5.0, 9.8);
      const atticMesh = new THREE.Mesh(atticGeo, stoneMat);
      atticMesh.position.set(0, 1.4 + pylonHeight + 2.5, 0);
      atticMesh.castShadow = true;
      monumentGroup.add(atticMesh);

      // Top Stepped Cornice & Shallow Basin
      const corniceGeo = new THREE.BoxGeometry(19.2, 1.2, 10.4);
      const corniceMesh = new THREE.Mesh(corniceGeo, stoneMat);
      corniceMesh.position.set(0, 1.4 + pylonHeight + 5.5, 0);
      monumentGroup.add(corniceMesh);

      const crownBowlGeo = new THREE.CylinderGeometry(2.8, 3.4, 0.9, 24);
      const crownBowl = new THREE.Mesh(crownBowlGeo, darkStoneMat);
      crownBowl.position.set(0, 1.4 + pylonHeight + 6.4, 0);
      monumentGroup.add(crownBowl);

      // Amar Jawan Jyoti Memorial Plinth under the Arch
      const memorialGeo = new THREE.BoxGeometry(2.2, 0.8, 2.2);
      const memorialMesh = new THREE.Mesh(memorialGeo, new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.2 }));
      memorialMesh.position.set(0, 1.4 + 0.4, 0);
      monumentGroup.add(memorialMesh);
    }

    // ========================================================
    // 6. ATMOSPHERIC PARTICULATE SWARM (Acid Rain & Carbon Soot)
    // ========================================================
    const PARTICLE_COUNT = 850;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleSpeeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 45;
      particlePositions[idx + 1] = Math.random() * 30 + 1;
      particlePositions[idx + 2] = (Math.random() - 0.5) * 45;
      particleSpeeds[i] = Math.random() * 0.12 + 0.04;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b, // Amber soot
      size: 0.25,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particlesGroupRef.current = particleSystem;
    scene.add(particleSystem);

    // ========================================================
    // 7. MOUSE & TOUCH DRAGGING CONTROLS
    // ========================================================
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      rotationTargetRef.current.y += deltaX * 0.008;
      rotationTargetRef.current.x = Math.max(
        -0.2, 
        Math.min(0.5, rotationTargetRef.current.x + deltaY * 0.006)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      zoomTargetRef.current = Math.max(24, Math.min(65, zoomTargetRef.current + e.deltaY * 0.04));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ========================================================
    // 8. 60 FPS RENDER LOOP
    // ========================================================
    const clock = clockRef.current;
    clock.start();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Inertia Rotation & Zoom Damping
      rotationCurrentRef.current.y += (rotationTargetRef.current.y - rotationCurrentRef.current.y) * 0.08;
      rotationCurrentRef.current.x += (rotationTargetRef.current.x - rotationCurrentRef.current.x) * 0.08;
      zoomCurrentRef.current += (zoomTargetRef.current - zoomCurrentRef.current) * 0.08;

      monumentGroup.rotation.y = rotationCurrentRef.current.y;
      monumentGroup.rotation.x = rotationCurrentRef.current.x;

      camera.position.z = zoomCurrentRef.current;
      camera.lookAt(0, 7.5, 0);

      // Airborne Particulate Downward Drift
      if (particlesGroupRef.current) {
        const pos = particlesGroupRef.current.geometry.attributes.position.array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const idx = i * 3;
          pos[idx + 1] -= particleSpeeds[i];
          if (pos[idx + 1] < 0.2) {
            pos[idx + 1] = 28 + Math.random() * 4;
          }
        }
        particlesGroupRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [monument?.id]);

  // 2. Dynamic Reaction to Timeline Scrubbing (Color, Roughness, Smog Fog)
  useEffect(() => {
    if (!currentTimelineData || !sceneRef.current) return;

    const targetColor = new THREE.Color(currentTimelineData.marbleColor);
    const targetFogColor = new THREE.Color(currentTimelineData.fogColor);
    const targetFogDensity = currentTimelineData.fogDensity;

    // Update Marble/Stone Materials
    marbleMaterialsRef.current.forEach((mat) => {
      mat.color.copy(targetColor);
      mat.roughness = 0.25 + (currentTimelineData.sootOpacity || 0) * 0.65;
      mat.needsUpdate = true;
    });

    // Update Atmospheric Fog
    if (sceneRef.current.fog) {
      sceneRef.current.fog.color.copy(targetFogColor);
      sceneRef.current.fog.density = targetFogDensity;
    }

    // Update Particle Colors (Black soot in high years, light dust in low years)
    if (particlesGroupRef.current) {
      const isToxic = currentTimelineData.year >= 2024;
      particlesGroupRef.current.material.color.setHex(isToxic ? 0xef4444 : 0xf59e0b);
      particlesGroupRef.current.material.opacity = 0.3 + (currentTimelineData.sootOpacity || 0) * 0.6;
    }
  }, [activeTimelineIndex, currentTimelineData]);

  // 3. Archaeological "Multani Mitti" Mud-Pack Application & Peel Animation
  useEffect(() => {
    if (!isMudPackActive) return;

    // Turn marble into pristine 1970 white after peel effect
    const timer = setTimeout(() => {
      const pristineColor = new THREE.Color(monument?.timeline?.[0]?.marbleColor || '#ffffff');
      marbleMaterialsRef.current.forEach((mat) => {
        mat.color.copy(pristineColor);
        mat.roughness = 0.25;
        mat.needsUpdate = true;
      });

      if (onMudPackComplete) {
        onMudPackComplete();
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [isMudPackActive, monument, onMudPackComplete]);

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-[#070b14] select-none">
      
      {/* Three.js Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating HUD Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-200 shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white uppercase">{monument?.name}</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400 font-bold">{currentTimelineData?.year} DECAY STATE</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-400">
          <Compass className="w-3 h-3 text-slate-400" />
          <span>DRAG TO ORBIT 360° • SCROLL TO ZOOM</span>
        </div>
      </div>

      {/* Top-Right Year & Whiteness Callout */}
      <div className="absolute top-4 right-4 z-20 text-right pointer-events-none">
        <div className="px-4 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-right shadow-xl">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Surface Reflectance (Albedo)</div>
          <div className="text-lg sm:text-xl font-black font-display text-white">
            {currentTimelineData?.whitenessIndex}
          </div>
          <div className="text-[10px] font-mono text-rose-400 mt-0.5">
            Gypsum Crust: {currentTimelineData?.gypsumCrustThicknessUm} µm
          </div>
        </div>
      </div>

      {/* Mud-Pack Cleaning Overlay Alert (Triggered when activated) */}
      {isMudPackActive && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm pointer-events-none animate-in fade-in duration-300">
          <div className="p-6 rounded-3xl bg-slate-900/95 border border-amber-500/60 shadow-2xl text-center max-w-md space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center animate-spin">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black text-white font-display">
              Applying Multani Mitti Clay Treatment...
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Attapulgite clay paste extracts trapped sulfuric acid salts and black carbon soot from porous marble through capillary absorption.
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full animate-[pulse_1s_infinite] w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Telemetry Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300 shadow-2xl pointer-events-none">
        <div className="flex items-center gap-2">
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">ATMOSPHERIC SO₂:</span>
          <strong className="text-white">{currentTimelineData?.so2ppb} ppb</strong>
        </div>

        <div className="flex items-center gap-2">
          <Wind className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">BLACK CARBON:</span>
          <strong className="text-amber-300">{currentTimelineData?.blackCarbonUgm3} µg/m³</strong>
        </div>

        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-slate-400">STONE LOSS:</span>
          <strong className="text-rose-400">{currentTimelineData?.stoneLossRate}</strong>
        </div>
      </div>

    </div>
  );
}
