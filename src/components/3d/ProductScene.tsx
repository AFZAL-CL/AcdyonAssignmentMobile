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

    const isMobile = window.innerWidth < 768;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 8.5;
    let targetLookX = 0;
    let targetLookY = 0;

    const getMoveP = (localP: number) => Math.min(localP / 0.75, 1.0);

    // Phase 1 (0 to 1.0)
    let p1 = Math.min(Math.max(p, 0), 1.0);
    let m1 = getMoveP(p1);
    targetZ = 8.5 - 1.5 * m1;
    targetY = -2.1 * m1;
    targetLookY = -2.1 * m1;

    // Phase 2 (1.0 to 2.0)
    if (p > 1.0) {
      let p2 = Math.min(Math.max(p - 1.0, 0), 1.0);
      let m2 = getMoveP(p2);
      targetX = isMobile ? 0 : -2.2 * m2;
      targetLookX = isMobile ? 0 : -2.2 * m2;
      targetY = -2.1 + 1.6 * m2;
      targetLookY = -2.1 + 1.6 * m2;
    }

    // Phase 3 (2.0 to 3.0)
    if (p > 2.0) {
      let p3 = Math.min(Math.max(p - 2.0, 0), 1.0);
      let m3 = getMoveP(p3);
      targetX = isMobile ? 0 : -2.2 + 3.4 * m3;
      targetLookX = isMobile ? 0 : -2.2 + 3.4 * m3;
      targetY = -0.5;
      targetLookY = -0.5;
      targetZ = 7.0 + 1.0 * m3;
    }

    // Phase 4 (3.0 to 4.0)
    if (p > 3.0) {
      let p4 = Math.min(Math.max(p - 3.0, 0), 1.0);
      let m4 = getMoveP(p4);
      targetX = isMobile ? 0 : 1.2 - 1.2 * m4;
      targetLookX = isMobile ? 0 : 1.2 - 1.2 * m4;
      targetY = -0.5 - 2.5 * m4;
      targetLookY = -0.5 - 2.5 * m4;
      targetZ = 8.0 + 0.5 * m4;
    }

    // Phase 5 (4.0 to 5.0)
    if (p > 4.0) {
      let p5 = Math.min(Math.max(p - 4.0, 0), 1.0);
      let m5 = getMoveP(p5);
      targetX = isMobile ? 0 : -2.0 * m5;
      targetLookX = isMobile ? 0 : -2.0 * m5;
      targetY = -3.0 + 2.5 * m5;
      targetLookY = -3.0 + 2.5 * m5;
      targetZ = 8.5 - 1.5 * m5;
    }

    if (isMobile) {
      targetX = 0;
      targetLookX = 0;
      targetZ += 3.5; // Pull camera back significantly on mobile to prevent clipping
      
      // Specifically adjust vertical positioning for mobile where layouts stack
      if (p > 3.0 && p <= 4.0) {
         let p4 = Math.min(Math.max(p - 3.0, 0), 1.0);
         let m4 = getMoveP(p4);
         targetY += 1.0 * m4; 
         targetLookY += 1.0 * m4;
      }
      if (p > 4.0) {
         let p5 = Math.min(Math.max(p - 4.0, 0), 1.0);
         let m5 = getMoveP(p5);
         targetY -= 1.0 * m5;
         targetLookY -= 1.0 * m5;
      }
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
