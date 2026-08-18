'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera } from '@react-three/drei';
import HeadphoneModel from './HeadphoneModel';
import { getScrollProgress } from '@/lib/scrollStore';
import * as THREE from 'three';

interface ProductSceneProps {
  activeVariant?: {
    primary: string;
    secondary: string;
    detail: string;
  };
}

function CameraController() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const p = getScrollProgress();
    if (!cameraRef.current) return;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 8.5; // Default Z
    let targetLookX = 0;
    let targetLookY = 0;

    // Determine camera targets based on scroll phase
    if (p <= 1.0) {
      // Phase 1 to 4: Hero Idle (Slight zoom and pan)
      targetZ = 8.5 - 1.5 * p; // Zooms in from 8.5 to 7.0
      targetY = -2.1 * p; // Pans camera DOWN, smoothly pushing headphone UP to perfectly clear bottom text
      targetLookY = -2.1 * p;
    } else if (p > 1.0 && p <= 2.0) {
      // Phase 5: Transition to Section 2 (Product Design Reveal)
      let localP = Math.min(p - 1.0, 0.5) / 0.5;
      targetX = -2.2 * localP; // Pans camera LEFT, pushing headphone RIGHT
      targetLookX = -2.2 * localP;
      targetY = -2.1 + 1.6 * localP; // Smoothly transitions from -2.1 to -0.5 for callout alignment
      targetLookY = -2.1 + 1.6 * localP;
      targetZ = 7.0;
    } else if (p > 2.0 && p <= 3.0) {
      // Phase 6: Transition to Section 3 (Engineered for Sound)
      let localP = Math.min(p - 2.0, 0.5) / 0.5;
      targetX = -3.0 + 4.2 * localP;
      targetLookX = -2.2 + 3.9 * localP;
      targetY = -0.5; // Stays perfectly centered for bullseye
      targetLookY = -0.5;
      targetZ = 7.0 + 1.0 * localP;
    } else if (p > 3.0 && p <= 4.0) {
      // Phase 7: Transition to Section 4 (Product Features Showcase)
      let localP = Math.min(p - 3.0, 0.5) / 0.5;
      targetX = 1.2 - 1.2 * localP;
      targetLookX = 1.2 - 1.2 * localP;
      targetY = -0.5 - 2.5 * localP; // Pushes high up to -3.0 for final section
      targetLookY = -0.5 - 2.5 * localP;
      targetZ = 8.0 + 0.5 * localP;
    } else if (p > 4.0) {
      // Phase 8: Transition to Section 5 (Product Configurator)
      let localP = Math.min(p - 4.0, 0.5) / 0.5;
      targetX = -2.0 * localP; // Pans left to push headphone to the right
      targetLookX = -2.0 * localP;
      targetY = -3.0 + 2.5 * localP; // Brings headphone back down to perfectly center it
      targetLookY = -3.0 + 2.5 * localP;
      targetZ = 8.5 - 1.5 * localP; // Zooms in for a prominent product shot
    }

    cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, targetX, 0.05);
    cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY, 0.05);
    cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 0.05);

    lookAtTarget.current.x = THREE.MathUtils.lerp(lookAtTarget.current.x, targetLookX, 0.05);
    lookAtTarget.current.y = THREE.MathUtils.lerp(lookAtTarget.current.y, targetLookY, 0.05);
    lookAtTarget.current.z = 0;

    cameraRef.current.lookAt(lookAtTarget.current);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={45} />;
}

export default function ProductScene({ activeVariant }: ProductSceneProps) {
  return (
    <div className="w-full h-full absolute inset-0 z-20 pointer-events-none">
      <Canvas shadows dpr={[1, 2]}>
        <CameraController />

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
          <HeadphoneModel position={[0, -1.5, 0]} activeVariant={activeVariant} />

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
