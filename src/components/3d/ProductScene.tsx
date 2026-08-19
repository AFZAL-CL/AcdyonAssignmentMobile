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

  useFrame((state, delta) => {
    const p = getScrollProgress();
    if (!cameraRef.current) return;

    const isMobile = state.size.width < 768;

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

    // Responsive Desktop Camera Framing
    let responsiveOffsetY = 0;

    if (!isMobile) {
      const REFERENCE_VIEWPORT_HEIGHT = 900;
      const REFERENCE_ASPECT = 16 / 9;
      const MIN_VIEWPORT_FACTOR = 0.85;
      const MAX_VIEWPORT_FACTOR = 1.15;

      const currentAspect = state.size.width / state.size.height;
      
      const heightFactor = THREE.MathUtils.clamp(
        state.size.height / REFERENCE_VIEWPORT_HEIGHT, 
        MIN_VIEWPORT_FACTOR, 
        MAX_VIEWPORT_FACTOR
      );
      
      const aspectFactor = THREE.MathUtils.clamp(
        currentAspect / REFERENCE_ASPECT, 
        MIN_VIEWPORT_FACTOR, 
        MAX_VIEWPORT_FACTOR
      );

      // If screen is shorter than 900px (heightFactor < 1.0), responsiveOffsetY becomes negative.
      // A negative offset lowers the camera, pushing the headphone HIGHER on screen to avoid UI overlap.
      // If screen is taller than 900px, responsiveOffsetY becomes positive, pushing headphone LOWER.
      const heightAdjustment = (heightFactor - 1.0) * 1.5;
      
      // If screen is narrower than 16:9 (aspectFactor < 1.0), we also apply a slight negative offset
      // because narrower screens make the model appear wider relative to viewport.
      const aspectAdjustment = (aspectFactor - 1.0) * 0.5;

      responsiveOffsetY = heightAdjustment + aspectAdjustment;
    }

    // Define vertical framing offsets to balance the composition.
    // Lower camera Y pushes the headphone higher on the screen.
    const SEC1_CAM_Y_START = -0.8;
    const SEC1_CAM_Y_END = -1.9;
    const SEC2_CAM_Y_END = -1.3;
    const SEC3_CAM_Y_END = -1.6; // Preserves existing section 3 composition
    const SEC4_CAM_Y_END = -2.8; // Preserves section 4 gap
    const SEC5_CAM_Y_END = -1.5;

    // Phase 1 (0 to 1.0)
    let p1 = Math.min(Math.max(p, 0), 1.0);
    let m1 = getMoveP(p1);
    targetZ = 8.5 - 1.5 * m1;
    targetY = SEC1_CAM_Y_START + (SEC1_CAM_Y_END - SEC1_CAM_Y_START) * m1;
    if (!isMobile) targetY += responsiveOffsetY;
    targetLookY = targetY;

    // Phase 2 (1.0 to 2.0)
    if (p > 1.0) {
      let p2 = Math.min(Math.max(p - 1.0, 0), 1.0);
      let m2 = getMoveP(p2);
      targetX = isMobile ? 0 : -2.2 * m2;
      targetLookX = isMobile ? 0 : -2.2 * m2;
      targetY = SEC1_CAM_Y_END + (SEC2_CAM_Y_END - SEC1_CAM_Y_END) * m2;
      if (!isMobile) targetY += responsiveOffsetY;
      targetLookY = targetY;
    }

    // Phase 3 (2.0 to 3.0)
    if (p > 2.0) {
      let p3 = Math.min(Math.max(p - 2.0, 0), 1.0);
      let m3 = getMoveP(p3);
      targetX = isMobile ? 0 : -2.2 + 3.4 * m3;
      targetLookX = isMobile ? 0 : -2.2 + 3.4 * m3;
      targetY = SEC2_CAM_Y_END + (SEC3_CAM_Y_END - SEC2_CAM_Y_END) * m3;
      if (!isMobile) targetY += responsiveOffsetY;
      targetLookY = targetY;
      targetZ = 7.0 + 1.0 * m3;
    }

    // Phase 4 (3.0 to 4.0)
    if (p > 3.0) {
      let p4 = Math.min(Math.max(p - 3.0, 0), 1.0);
      let m4 = getMoveP(p4);
      targetX = isMobile ? 0 : 1.2 - 1.2 * m4;
      targetLookX = isMobile ? 0 : 1.2 - 1.2 * m4;
      targetY = SEC3_CAM_Y_END + (SEC4_CAM_Y_END - SEC3_CAM_Y_END) * m4;
      if (!isMobile) targetY += responsiveOffsetY;
      targetLookY = targetY;
      targetZ = 8.0 + 0.5 * m4;
    }

    // Phase 5 (4.0 to 5.0)
    if (p > 4.0) {
      let p5 = Math.min(Math.max(p - 4.0, 0), 1.0);
      let m5 = getMoveP(p5);
      targetX = isMobile ? 0 : -2.0 * m5;
      targetLookX = isMobile ? 0 : -2.0 * m5;
      targetY = SEC4_CAM_Y_END + (SEC5_CAM_Y_END - SEC4_CAM_Y_END) * m5;
      if (!isMobile) targetY += responsiveOffsetY;
      targetLookY = targetY;
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
  return (
    <div className="w-full h-full absolute inset-0 z-20 pointer-events-none">
      <Canvas shadows={{ type: THREE.PCFShadowMap }} dpr={[1, 2]}>
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
