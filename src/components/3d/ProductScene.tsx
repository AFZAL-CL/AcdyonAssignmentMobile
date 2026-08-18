'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera } from '@react-three/drei';
import HeadphoneModel from './HeadphoneModel';
import { getScrollProgress } from '@/lib/scrollStore';
import * as THREE from 'three';

function CameraController() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame(() => {
    const p = getScrollProgress();
    if (cameraRef.current) {
      let targetZ = 10;
      let targetY = 0;
      if (p > 0.2 && p <= 0.6) {
        // Zoom from 10 to 9.0 (moderate 1.11x visual scale)
        targetZ = 10 - 1.0 * ((p - 0.2) / 0.4); 
      } else if (p > 0.6) {
        targetZ = 9.0;
        // Pan camera downward further (-2.2) so headphone floats higher into the upper-middle
        targetY = -2.2 * ((Math.min(p, 0.9) - 0.6) / 0.3);
      }
      
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 0.05);
      cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY, 0.05);
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={45} />;
}

export default function ProductScene() {
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
          <HeadphoneModel position={[0, -1.5, 0]} />
          
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
