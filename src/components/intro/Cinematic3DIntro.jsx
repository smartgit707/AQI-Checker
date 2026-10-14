import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Wind, Sparkles, Volume2, VolumeX, FastForward, Play, CheckCircle2 } from 'lucide-react';

/**
 * World-Class Cinematic 3D Intro Animation
 * 
 * Timeline Architecture:
 * - 0.0s - 2.0s: Scene 1 — The Awakening (Dark void, particulate dawn, glowing Earth biosphere emerges)
 * - 2.0s - 4.8s: Scene 2 — Dimensional Separation (Concentric layers fracture with parallax depth: Atmosphere, Botanical Biosphere, Urban Future Core, Floating Telemetry HUDs)
 * - 4.8s - 6.8s: Scene 3 — Orbital Convergence (Components follow harmonic spiral orbits and converge into a brilliant unified central composition)
 * - 6.8s - 8.6s: Scene 4 — Brand Reveal (AERIS / EcoSense identity reveal with kinetic typography: "Breathe Smarter. Live Healthier.")
 * - 8.6s - 10.0s: Scene 5 — Atmospheric Dissolve (Camera swoop, particles disperse into background, dissolving seamlessly into live homepage)
 */

const INTRO_DURATION_MS = 9600;

export default function Cinematic3DIntro({ onComplete }) {
  const mountRef = useRef(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [currentScene, setCurrentScene] = useState(1);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const hasCompletedRef = useRef(false);

  // References for Three.js render loop and tweening
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  // 3D Object Groups
  const masterGroupRef = useRef(null);
  const biosphereOuterRef = useRef(null);
  const biosphereInnerRef = useRef(null);
  const atmosphereRingsRef = useRef(null);
  const botanicalGroupRef = useRef(null);
  const cityCoreGroupRef = useRef(null);
  const telemetryHudGroupRef = useRef(null);
  const particleSystemRef = useRef(null);
  const lightRaysRef = useRef(null);

  // Skip Intro Handler
  const handleSkip = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      try {
        sessionStorage.setItem('aeris_intro_seen', 'true');
      } catch (e) {
        // Ignore storage errors in private browsing
      }
      if (onComplete) onComplete();
    }, 450);
  };

  // Accessibility: Skip immediately if user requested reduced motion
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (onComplete) onComplete();
    }
  }, [onComplete]);

  // Main Three.js Scene Setup & Choreography
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Cinematic Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050814, 0.015);
    sceneRef.current = scene;

    // 2. Perspective Camera with dynamic focal length
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 72);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-Performance Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Primary Electric Cyan Sun Key Light
    const sunLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    sunLight.position.set(30, 25, 40);
    scene.add(sunLight);

    // Rim / Backlight in Emerald
    const rimLight = new THREE.DirectionalLight(0x10b981, 4.0);
    rimLight.position.set(-35, -20, -30);
    scene.add(rimLight);

    // Deep Violet Fill Light
    const fillLight = new THREE.PointLight(0xa855f7, 2.5, 120);
    fillLight.position.set(0, -35, 25);
    scene.add(fillLight);

    // 5. Master Scene Anchor Group
    const masterGroup = new THREE.Group();
    masterGroupRef.current = masterGroup;
    scene.add(masterGroup);

    // ========================================================
    // LAYER 1: Translucent Earth Biosphere & Glass Halo
    // ========================================================
    const outerGeo = new THREE.SphereGeometry(13, 64, 64);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.92,
      opacity: 0.85,
      transparent: true,
      roughness: 0.08,
      ior: 1.45,
      reflectivity: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const biosphereOuter = new THREE.Mesh(outerGeo, outerMat);
    biosphereOuterRef.current = biosphereOuter;
    masterGroup.add(biosphereOuter);

    // Inner Glowing Earth Holo Sphere
    const innerGeo = new THREE.SphereGeometry(8.5, 48, 48);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x065f46,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.2,
      wireframe: true
    });
    const biosphereInner = new THREE.Mesh(innerGeo, innerMat);
    biosphereInnerRef.current = biosphereInner;
    masterGroup.add(biosphereInner);

    // ========================================================
    // LAYER 2: Concentric Atmospheric Wind Rings
    // ========================================================
    const atmosphereRings = new THREE.Group();
    atmosphereRingsRef.current = atmosphereRings;

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(17, 0.15, 16, 100), ringMat1);
    ring1.rotation.x = Math.PI / 3;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(19.5, 0.12, 16, 100), ringMat2);
    ring2.rotation.y = Math.PI / 4;
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(22, 0.1, 16, 100), ringMat3);
    ring3.rotation.z = Math.PI / 6;

    atmosphereRings.add(ring1, ring2, ring3);
    masterGroup.add(atmosphereRings);

    // ========================================================
    // LAYER 3: Botanical Biosphere (Floating Curvature Leaves)
    // ========================================================
    const botanicalGroup = new THREE.Group();
    botanicalGroupRef.current = botanicalGroup;

    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(1.2, 2.5, 0, 5.0);
    leafShape.quadraticCurveTo(-1.2, 2.5, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(leafShape);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
      emissive: 0x15803d,
      emissiveIntensity: 0.25
    });

    const LEAF_COUNT = 18;
    const leafMeshes = [];
    for (let i = 0; i < LEAF_COUNT; i++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      const angle = (i / LEAF_COUNT) * Math.PI * 2;
      const radius = 11.5;
      leaf.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 8, Math.sin(angle) * radius);
      leaf.scale.set(0.6, 0.6, 0.6);
      leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      leaf.userData = {
        baseRadius: radius,
        angle: angle,
        orbitSpeed: 0.4 + Math.random() * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.03
      };
      botanicalGroup.add(leaf);
      leafMeshes.push(leaf);
    }
    masterGroup.add(botanicalGroup);

    // ========================================================
    // LAYER 4: Miniature Futuristic Urban Core & Spire Clusters
    // ========================================================
    const cityCoreGroup = new THREE.Group();
    cityCoreGroupRef.current = cityCoreGroup;

    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2
    });
    const spireGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    // Procedural clean city skyline clustered on equator
    for (let i = 0; i < 28; i++) {
      const bHeight = 1.8 + Math.random() * 3.8;
      const bGeo = new THREE.BoxGeometry(0.8, bHeight, 0.8);
      const bMesh = new THREE.Mesh(bGeo, buildingMat);

      const angle = (i / 28) * Math.PI * 2;
      const dist = 8.5;
      bMesh.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      bMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bMesh.position.clone().normalize());

      // Beacon Spire on tall buildings
      if (bHeight > 3.0) {
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), spireGlowMat);
        beacon.position.set(0, bHeight / 2 + 0.3, 0);
        bMesh.add(beacon);
      }
      cityCoreGroup.add(bMesh);
    }
    masterGroup.add(cityCoreGroup);

    // ========================================================
    // LAYER 5: Floating Curved Holographic Telemetry HUD Panels
    // ========================================================
    const telemetryHudGroup = new THREE.Group();
    telemetryHudGroupRef.current = telemetryHudGroup;

    const createHudTexture = (title, value, unit, statusColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Rounded translucent glass card backdrop
      ctx.fillStyle = 'rgba(6, 12, 28, 0.75)';
      ctx.roundRect(10, 10, 492, 236, 24);
      ctx.fill();

      // Glowing border
      ctx.lineWidth = 4;
      ctx.strokeStyle = statusColor;
      ctx.roundRect(10, 10, 492, 236, 24);
      ctx.stroke();

      // Atmospheric Header
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(title.toUpperCase(), 36, 60);

      // Large Value
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 68px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(value, 36, 140);

      // Unit & Verification
      ctx.fillStyle = statusColor;
      ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(unit, 36, 195);

      // Micro Sensor Waveform Bar
      ctx.fillStyle = statusColor;
      for (let bar = 0; bar < 8; bar++) {
        const bH = 20 + Math.sin(bar * 0.8) * 15;
        ctx.fillRect(380 + bar * 12, 180 - bH, 8, bH);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const hudCardsData = [
      { title: 'Particulate PM2.5', value: '12.4', unit: 'µg/m³ • OPTIMAL', color: '#10b981', pos: [-18, 8, 10] },
      { title: 'Clean Air Delivery', value: '480', unit: 'm³/h CADR • ACTIVE', color: '#38bdf8', pos: [18, 9, 8] },
      { title: 'Atmospheric Jet', value: '18', unit: 'km/h NW • VENTILATED', color: '#818cf8', pos: [-16, -9, 12] },
      { title: 'Global Biosphere', value: '99.4%', unit: 'HEPA PURITY INDEX', color: '#34d399', pos: [16, -8, 10] },
    ];

    hudCardsData.forEach((data) => {
      const hudPlaneGeo = new THREE.PlaneGeometry(10, 5);
      const hudPlaneMat = new THREE.MeshBasicMaterial({
        map: createHudTexture(data.title, data.value, data.unit, data.color),
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      const hudMesh = new THREE.Mesh(hudPlaneGeo, hudPlaneMat);
      hudMesh.position.set(...data.pos);
      hudMesh.userData = { initialPos: new THREE.Vector3(...data.pos) };
      telemetryHudGroup.add(hudMesh);
    });
    masterGroup.add(telemetryHudGroup);

    // ========================================================
    // LAYER 6: 2,500 Microscopic Airborne Particulate Cloud
    // ========================================================
    const PARTICLE_COUNT = 2500;
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);
    const particleVelocities = [];

    const palette = [
      new THREE.Color(0x38bdf8), // Cyan
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0xa855f7), // Violet
      new THREE.Color(0xffffff)  // Pure starlight
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 10 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;

      particleVelocities.push({
        radius: radius,
        theta: theta,
        phi: phi,
        speed: 0.003 + Math.random() * 0.007,
        vortexSpeed: 0.01 + Math.random() * 0.02
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystemRef.current = particleSystem;
    scene.add(particleSystem);

    // Resize Handler
    const onResize = () => {
      if (!renderer || !camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ========================================================
    // 7. CINEMATIC 60FPS DIRECTOR LOOP (5 SCENES)
    // ========================================================
    const clock = clockRef.current;
    clock.start();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      setElapsedSec(elapsed);

      // Determine active scene based on timestamp
      if (elapsed < 2.0) {
        setCurrentScene(1); // Awakening
      } else if (elapsed < 4.8) {
        setCurrentScene(2); // Separation
      } else if (elapsed < 6.8) {
        setCurrentScene(3); // Convergence
      } else if (elapsed < 8.6) {
        setCurrentScene(4); // Brand Reveal
      } else {
        setCurrentScene(5); // Transition to Website
      }

      // Smooth Gentle Master Rotation
      masterGroup.rotation.y = elapsed * 0.18;
      masterGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.08;

      // SCENE 1: AWAKENING (0.0s - 2.0s)
      if (elapsed < 2.0) {
        const progress = Math.min(1, elapsed / 2.0);
        camera.position.z = 85 - progress * 13; // Camera glides in from 85 to 72
        masterGroup.scale.setScalar(0.4 + progress * 0.6); // Emerges from void
        biosphereOuter.material.opacity = 0.2 + progress * 0.65;
      }

      // SCENE 2: DIMENSIONAL SEPARATION (2.0s - 4.8s)
      else if (elapsed < 4.8) {
        const segT = (elapsed - 2.0) / 2.8;
        const easeOut = 1 - Math.pow(1 - segT, 3);

        // Biosphere expands outward into floating shell
        biosphereOuter.scale.setScalar(1.0 + easeOut * 0.45);
        biosphereInner.scale.setScalar(1.0 - easeOut * 0.15);

        // Atmosphere rings expand and tilt into planetary gyroscope
        atmosphereRings.scale.setScalar(1.0 + easeOut * 0.5);
        ring1.rotation.x += 0.01;
        ring2.rotation.y += 0.012;
        ring3.rotation.z += 0.008;

        // Botanical leaves drift into equatorial orbit
        leafMeshes.forEach((leaf) => {
          leaf.userData.angle += leaf.userData.orbitSpeed * 0.015;
          const r = leaf.userData.baseRadius + easeOut * 8;
          leaf.position.x = Math.cos(leaf.userData.angle) * r;
          leaf.position.z = Math.sin(leaf.userData.angle) * r;
          leaf.rotation.y += leaf.userData.rotSpeed;
        });

        // Telemetry HUDs push outward into floating inspection orbit
        telemetryHudGroup.children.forEach((hud, idx) => {
          const initP = hud.userData.initialPos;
          const pushDistance = 1.0 + easeOut * 0.4;
          hud.position.set(initP.x * pushDistance, initP.y * pushDistance, initP.z * pushDistance);
          hud.lookAt(camera.position);
        });

        // Camera dramatic cinematic push and angle
        camera.position.y = easeOut * 6;
        camera.position.x = Math.sin(elapsed * 0.8) * 8;
      }

      // SCENE 3: ORBITAL CONVERGENCE (4.8s - 6.8s)
      else if (elapsed < 6.8) {
        const segT = (elapsed - 4.8) / 2.0;
        const easeInOut = segT < 0.5 ? 2 * segT * segT : -1 + (4 - 2 * segT) * segT;

        // Outer layers gracefully converge back inward towards unified core
        const scaleVal = 1.45 - easeInOut * 0.45;
        biosphereOuter.scale.setScalar(scaleVal);
        biosphereInner.scale.setScalar(0.85 + easeInOut * 0.15);
        atmosphereRings.scale.setScalar(1.5 - easeInOut * 0.5);

        // Leaves spiral back into harmonized biosphere
        leafMeshes.forEach((leaf) => {
          leaf.userData.angle += leaf.userData.orbitSpeed * 0.025;
          const r = (leaf.userData.baseRadius + 8) - easeInOut * 7;
          leaf.position.x = Math.cos(leaf.userData.angle) * r;
          leaf.position.z = Math.sin(leaf.userData.angle) * r;
        });

        // Telemetry HUDs converge toward center halo
        telemetryHudGroup.children.forEach((hud) => {
          const initP = hud.userData.initialPos;
          const factor = 1.4 - easeInOut * 0.35;
          hud.position.set(initP.x * factor, initP.y * factor, initP.z * factor);
          hud.lookAt(camera.position);
        });

        // Camera centers smoothly
        camera.position.x += (0 - camera.position.x) * 0.08;
        camera.position.y += (0 - camera.position.y) * 0.08;
        camera.position.z += (58 - camera.position.z) * 0.08;
      }

      // SCENE 4: BRAND REVEAL (6.8s - 8.6s)
      else if (elapsed < 8.6) {
        // Core composition stabilizes in elegant majestic equilibrium
        masterGroup.rotation.y = elapsed * 0.12;
        biosphereOuter.scale.setScalar(1.0 + Math.sin(elapsed * 3) * 0.02);

        // HUD cards gently pulse with live data stream
        telemetryHudGroup.children.forEach((hud) => {
          hud.lookAt(camera.position);
        });
      }

      // SCENE 5: SEAMLESS WEBSITE TRANSITION (8.6s - 10.0s)
      else {
        const segT = Math.min(1, (elapsed - 8.6) / 1.0);

        // Camera zooms in through the glowing biosphere
        camera.position.z = 58 - segT * 42;
        masterGroup.scale.setScalar(1.0 + segT * 2.5);
        biosphereOuter.material.opacity = Math.max(0, 0.85 * (1 - segT));
        if (particleSystemRef.current) {
          particleSystemRef.current.material.opacity = Math.max(0, 0.85 * (1 - segT));
        }

        // Trigger finish when fully faded
        if (segT >= 0.95 && !hasCompletedRef.current) {
          hasCompletedRef.current = true;
          setIsFadingOut(true);
          try {
            sessionStorage.setItem('aeris_intro_seen', 'true');
          } catch (e) {}
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 350);
        }
      }

      // 6. Airborne Particle Swarm Dynamics (Runs continuously)
      if (particleSystemRef.current) {
        const pos = particleSystemRef.current.geometry.attributes.position.array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const idx = i * 3;
          const p = particleVelocities[i];

          // Orbital spiral motion
          p.theta += p.vortexSpeed * (currentScene === 2 ? 1.8 : 1.0);
          p.phi += Math.sin(elapsed * 0.5 + i) * 0.002;

          // Particle breathing radius
          const currentRadius = p.radius + Math.sin(elapsed * 2 + i) * 1.5;
          pos[idx] = currentRadius * Math.sin(p.phi) * Math.cos(p.theta);
          pos[idx + 1] = currentRadius * Math.sin(p.phi) * Math.sin(p.theta);
          pos[idx + 2] = currentRadius * Math.cos(p.phi);
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onComplete]);

  // Calculate skip button countdown percentage
  const progressPct = Math.min(100, Math.round((elapsedSec / (INTRO_DURATION_MS / 1000)) * 100));

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-[#03060f] text-white flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3D WebGL Canvas Layer */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-default" />

      {/* Floating Ambient Vignette & Volumetric Glow */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-radial-gradient from-transparent via-[#03060f]/40 to-[#03060f]/90" />

      {/* Top Left: Cinematic Environmental Status Bar */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <Wind className="w-4.5 h-4.5" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AEROSENSE GLOBAL ATMOSPHERIC SENSOR
          </span>
          <span className="text-[10px] text-slate-400 block font-mono">
            LIVE TELEMETRY STREAM • 2,500 CAAQMS RECEPTORS
          </span>
        </div>
      </div>

      {/* Top Right: Skip Intro Button with Circular Progress */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSkip}
          className="group flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-all shadow-xl cursor-pointer"
        >
          {/* Animated SVG Progress Ring */}
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg className="w-5 h-5 -rotate-90">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-700"
                fill="none"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="50.2"
                strokeDashoffset={50.2 - (50.2 * progressPct) / 100}
                className="text-emerald-400 transition-all duration-100 ease-linear"
                fill="none"
              />
            </svg>
          </div>
          <span className="text-xs font-bold tracking-wide">SKIP INTRO</span>
          <FastForward className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Scene Timeline Telemetry Indicators */}
      <div className="absolute bottom-8 left-8 right-8 z-20 flex items-center justify-between text-xs font-mono text-slate-400 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">SCENE {currentScene}/5:</span>
          <span className="text-slate-200">
            {currentScene === 1 && 'AWAKENING OF THE ATMOSPHERE'}
            {currentScene === 2 && 'DIMENSIONAL STRATA SEPARATION'}
            {currentScene === 3 && 'ORBITAL BIOSPHERIC CONVERGENCE'}
            {currentScene === 4 && 'BRAND IDENTITY CONVERGENCE'}
            {currentScene === 5 && 'TRANSITIONING TO URBAN RECEPTORS'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
          <span>REALTIME 3D FLUID SHADER</span>
          <span>•</span>
          <span>60 FPS WEBGL 2.0</span>
        </div>
      </div>

      {/* Central Brand Typography Overlay (Scenes 4 & 5) */}
      {(currentScene >= 4 || elapsedSec >= 6.5) && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none text-center px-4 animate-in fade-in-50 duration-700">
          <div className="max-w-xl mx-auto space-y-4">
            
            {/* Glowing Brand Monogram Emblem */}
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-sky-400 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/50 scale-100 animate-pulse">
              <Wind className="w-8 h-8" />
            </div>

            {/* Kinetic Letter-spaced Wordmark */}
            <div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-[0.25em] font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-2xl">
                AEROSENSE
              </h1>
              <div className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.4em] text-emerald-400 mt-2">
                ECOSENSE CLIMATE INTELLIGENCE
              </div>
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-slate-300 font-medium tracking-wide italic max-w-md mx-auto drop-shadow-md">
              “Breathe Smarter. Live Healthier.”
            </p>

            {/* Visual Launch Status Pill */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-slate-900/90 text-slate-200 border border-slate-700/80 backdrop-blur-md shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ENTERING LIVE PAN-INDIA MONITORING MATRIX...</span>
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
