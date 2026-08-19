'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera } from '@react-three/drei';
import HeadphoneModel from './HeadphoneModel';
import MobileSoundField from './MobileSoundField';
import { getScrollProgress } from '@/lib/scrollStore';
import * as THREE from 'three';

interface ProductSceneProps {
  activeVariant?: {
    primary: string;
    secondary: string;
    detail: string;
  };
}

function CameraController({ actualVisualCenter }: { actualVisualCenter: React.RefObject<THREE.Vector3> }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const p = getScrollProgress();
    if (!cameraRef.current) return;

    const isMobile = state.size.width < 768;
    const isSmallMobile = state.size.width <= 390;

    let targetX = 0;
    let targetY = -0.7; // Start camera lower so model appears higher
    let targetZ = 8.5;
    let targetLookX = 0;
    let targetLookY = -0.7;

    const easeInOutCubic = (x: number): number => {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    // Sync camera movement exactly with headphone movement phase (0 to 0.7)
    const getMoveP = (localP: number) => {
      const m = Math.min(localP / 0.7, 1.0);
      return easeInOutCubic(m);
    };

    // SECTION_FRAMING defines the target composition (x, y, zoom) for each section.
    // X convention: 0.0 = left, 1.0 = right
    // Y convention: 0.0 = top, 1.0 = bottom (Top-Down)
    // Zoom is a scalar where 1.0 represents the baseline reference distance (Z=7.0)
    const SECTION_FRAMING = {
      desktop: [
        { x: 0.50, y: 0.38, zoom: 0.82 }, // p=0 (Start)
        { x: 0.50, y: 0.22, zoom: 1.00 }, // p=1 (Section 1)
        { x: 0.74, y: 0.29, zoom: 1.00 }, // p=2 (Section 2)
        { x: 0.50, y: 0.16, zoom: 0.65 }, // p=3 (Section 3 - formerly Section 4)
        { x: 0.75, y: 0.29, zoom: 1.00 }  // p=4 (Section 4 - formerly Section 5, moved up)
      ],
      mobile: [
        { x: 0.50, y: 0.40, zoom: 0.58 }, // p=0
        { x: 0.50, y: 0.34, zoom: 0.67 }, // p=1
        { x: 0.50, y: 0.32, zoom: 0.55 }, // p=2 (Adjusted to leave space for top spec)
        { x: 0.50, y: 0.43, zoom: 0.50 }, // p=3 (Moved up slightly for Sound Field)
        { x: 0.50, y: 0.26, zoom: 0.67 }  // p=4
      ],
      smallMobile: [
        { x: 0.50, y: 0.40, zoom: 0.54 }, // p=0
        { x: 0.50, y: 0.34, zoom: 0.62 }, // p=1
        { x: 0.50, y: 0.32, zoom: 0.45 }, // p=2 (Adjusted down slightly to fit 40MM top spec)
        { x: 0.50, y: 0.43, zoom: 0.45 }, // p=3 (Moved up slightly for Sound Field)
        { x: 0.50, y: 0.26, zoom: 0.62 }  // p=4
      ]
    };

    const layout = isSmallMobile ? SECTION_FRAMING.smallMobile : (isMobile ? SECTION_FRAMING.mobile : SECTION_FRAMING.desktop);

    let viewportX = layout[0].x;
    let viewportY = layout[0].y;
    let currentZoom = layout[0].zoom;

    const startIndex = Math.floor(p);
    
    if (startIndex >= 0 && startIndex < layout.length - 1) {
      const endIndex = startIndex + 1;
      const localP = p - startIndex;
      const m = getMoveP(Math.min(Math.max(localP, 0), 1.0));
      
      const start = layout[startIndex];
      const end = layout[endIndex];
      
      viewportX = start.x + (end.x - start.x) * m;
      viewportY = start.y + (end.y - start.y) * m;
      currentZoom = start.zoom + (end.zoom - start.zoom) * m;
    } else if (startIndex >= layout.length - 1) {
      const end = layout[layout.length - 1];
      viewportX = end.x;
      viewportY = end.y;
      currentZoom = end.zoom;
    }

    // Calculate camera distance/FOV from the desired visual zoom
    const BASE_DISTANCE = 7.0;
    targetZ = BASE_DISTANCE / currentZoom;

    // Convert Screen-Space Targets to World Coordinates (45 degrees FOV)
    const vFov = (45 * Math.PI) / 180;
    
    // Mathematically exact height and width of the visible world at distance targetZ
    const visibleHeight = 2 * Math.tan(vFov / 2) * targetZ;
    const currentAspect = state.size.width / state.size.height;
    const visibleWidth = visibleHeight * currentAspect;

    if (!actualVisualCenter.current) return;
    const MODEL_WORLD_Y = actualVisualCenter.current.y;
    const MODEL_WORLD_X = actualVisualCenter.current.x;

    // --- SECTION 6 CINEMATIC ZOOM OVERRIDE ---
    // The user explicitly requested strict phase separation:
    // 4.00 -> 4.25: Rotate only (done in HeadphoneModel). Camera stays perfectly still at p=4 standard framing.
    // 4.25 -> 4.40: Center / Stabilize.
    // 4.40 -> 4.60: Initial Scale (scale the front-facing headphone up).
    // 4.60 -> 4.80: Text Reveal (headphones remain stable).
    // 4.80 -> 5.30: Continuous Zoom.
    if (p >= 4.00) {
      const end = layout[layout.length - 1]; // p=4 standard framing
      const zoomStart = end.zoom;
      const targetZStart = BASE_DISTANCE / zoomStart;
      const visibleHeightStart = 2 * Math.tan(vFov / 2) * targetZStart;
      const visibleWidthStart = visibleHeightStart * currentAspect;
      
      const targetYStart = MODEL_WORLD_Y + (end.y - 0.5) * visibleHeightStart;
      const targetXStart = MODEL_WORLD_X - (end.x - 0.5) * visibleWidthStart;
      
      const standardPos = new THREE.Vector3(targetXStart, targetYStart, targetZStart);
      const centeredPos = new THREE.Vector3(MODEL_WORLD_X, MODEL_WORLD_Y, targetZStart); // Centered, no zoom yet
      
      // Phase 2: Center/Stabilize (4.30 -> 4.40)
      const centerP = Math.min(Math.max((p - 4.30) / 0.10, 0), 1.0);
      const smoothCenter = easeInOutCubic(centerP);
      
      targetX = THREE.MathUtils.lerp(standardPos.x, centeredPos.x, smoothCenter);
      targetY = THREE.MathUtils.lerp(standardPos.y, centeredPos.y, smoothCenter);
      
      // Scaling is now handled entirely by the headphone model scaling, not the camera.
      // Camera Z remains locked at the baseline distance.
      targetZ = targetZStart;
      targetLookX = targetX;
      targetLookY = targetY;
      
      const dampSpeedCinematic = 25;
      const smoothCinematic = 1 - Math.exp(-dampSpeedCinematic * delta);
  
      cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, targetX, smoothCinematic);
      cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY, smoothCinematic);
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, smoothCinematic);
  
      lookAtTarget.current.x = THREE.MathUtils.lerp(lookAtTarget.current.x, targetLookX, smoothCinematic);
      lookAtTarget.current.y = THREE.MathUtils.lerp(lookAtTarget.current.y, targetLookY, smoothCinematic);
      lookAtTarget.current.z = 0;
      
      cameraRef.current.lookAt(lookAtTarget.current);
      return;
    }
    // --- END CINEMATIC OVERRIDE ---

    // Y convention: 0 = top, 1 = bottom. 
    // To move the object down (larger viewportY), we must move the camera UP (positive shift).
    targetY = MODEL_WORLD_Y + (viewportY - 0.5) * visibleHeight;

    // X convention: 0 = left, 1 = right. 
    // To move the object right (larger viewportX), we must move the camera LEFT (negative shift).
    targetX = MODEL_WORLD_X - (viewportX - 0.5) * visibleWidth;
    targetLookX = targetX;
    targetLookY = targetY;

    const dampSpeed = 25;
    const smooth = 1 - Math.exp(-dampSpeed * delta);

    cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, targetX, smooth);
    cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY, smooth);
    cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, smooth);

    lookAtTarget.current.x = THREE.MathUtils.lerp(lookAtTarget.current.x, targetLookX, smooth);
    lookAtTarget.current.y = THREE.MathUtils.lerp(lookAtTarget.current.y, targetLookY, smooth);
    lookAtTarget.current.z = 0;

    cameraRef.current.lookAt(lookAtTarget.current);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={45} />;
}

export default function ProductScene({ activeVariant }: ProductSceneProps) {
  const actualVisualCenter = useRef(new THREE.Vector3(0, -1.5, 0));

  return (
    <div className="w-full h-full absolute inset-0 z-20 pointer-events-none">
      <Canvas 
        shadows={{ type: THREE.PCFShadowMap }} 
        dpr={[1, 2]}
        className="pointer-events-none"
      >
        <CameraController actualVisualCenter={actualVisualCenter} />

        {/* Soft studio-lighting setup for premium illustration feel */}
        <ambientLight intensity={0.6} color="#F5F1E8" />

        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          color="#FFFFFF"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <directionalLight
          position={[-5, 3, -5]}
          intensity={0.4}
          color="#3867FF"
        />

        <pointLight position={[0, -2, 3]} intensity={0.2} color="#FF4D4D" />

        <Suspense fallback={null}>
          {/* Normalization is now handled mathematically inside HeadphoneModel */}
          {/* Model moved downward slightly to sit below SONA ONE typography */}
          <HeadphoneModel 
            position={[0, -1.3, 0]} 
            activeVariant={activeVariant}
            onBoundsCalculated={(center) => {
              if (actualVisualCenter.current) {
                actualVisualCenter.current.copy(center);
              }
            }}
          />
          
          <MobileSoundField modelCenter={actualVisualCenter} />

          <ContactShadows
            position={[0, -3.5, 0]}
            opacity={0.4}
            scale={12}
            blur={2.0}
            far={4.0}
            color="#111111"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
