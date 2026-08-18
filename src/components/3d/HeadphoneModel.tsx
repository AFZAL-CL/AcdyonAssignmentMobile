'use client';

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getScrollProgress } from '@/lib/scrollStore';

export default function HeadphoneModel(props: React.ComponentProps<'group'>) {
  const group = useRef<THREE.Group>(null);
  const innerGroup = useRef<THREE.Group>(null);
  
  // Load the raw scene. We MUST NOT clone it, because Three.js Object3D.clone() 
  // breaks SkinnedMesh bone bindings, which was the actual cause of the "tiny dot" bug!
  const { scene } = useGLTF('/models/headphones/scene.gltf');
  
  // Handle subtle idle animation and GSAP scroll rotation
  useFrame((state) => {
    if (group.current && innerGroup.current) {
      const p = getScrollProgress();
      
      // 1. Rotation based on scroll (0.2 to 0.6 maps to 180 degrees)
      let targetRotationY = 0;
      if (p > 0.2 && p <= 0.6) {
        targetRotationY = Math.PI * ((p - 0.2) / 0.4);
      } else if (p > 0.6) {
        targetRotationY = Math.PI; // Full 180 degrees
      }
      
      // Add very subtle idle rotation on top
      const idleRot = state.clock.elapsedTime * 0.05;
      
      // Smooth interpolation for cinematic feel
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y, 
        targetRotationY + idleRot, 
        0.05
      );
      
      // 2. Floating motion
      innerGroup.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group ref={innerGroup}>
        {/* The normalized model: scaled to precisely ~3.1 width (scale=12.55) and 
            shifted down by exactly -1.56 * 12.55 to perfectly anchor its geometry at [0,0,0] */}
        <primitive object={scene} scale={12.55} position={[0, -1.56 * 12.55, 0]} />
      </group>
    </group>
  );
}
