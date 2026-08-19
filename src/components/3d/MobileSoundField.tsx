'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getScrollProgress } from '@/lib/scrollStore';

export default function MobileSoundField({ modelCenter }: { modelCenter: React.RefObject<THREE.Vector3> }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points>(null);
  const text1Ref = useRef<HTMLParagraphElement>(null);
  const text2Ref = useRef<HTMLParagraphElement>(null);
  const text3Ref = useRef<HTMLParagraphElement>(null);
  const text4Ref = useRef<HTMLParagraphElement>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 768;
  
  // Create 5 concentric rings representing sound waves
  const ringGeometries = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => {
      // RingGeometry(innerRadius, outerRadius, thetaSegments)
      return new THREE.RingGeometry(1.0 + i * 0.3, 1.02 + i * 0.3, 64);
    });
  }, []);

  // Create sparse particles (BufferGeometry)
  const particlePositions = useMemo(() => {
    const count = 30; // Very sparse, lightweight
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const r = 1.0 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!isMobile) return;
    const p = getScrollProgress();
    
    // Determine if we are in Section 3
    // Changed bounds to 2.05 - 2.95 so it doesn't appear while Section 2 is still on screen
    const isVisible = p >= 2.05 && p <= 2.95;

    // Immediately hide DOM text elements if outside Section 3
    if (text1Ref.current && text2Ref.current && text3Ref.current && text4Ref.current) {
      if (!isVisible) {
        text1Ref.current.style.opacity = '0';
        text2Ref.current.style.opacity = '0';
        text3Ref.current.style.opacity = '0';
        text4Ref.current.style.opacity = '0';
      } else {
        text1Ref.current.style.opacity = '0.6';
        text2Ref.current.style.opacity = '0.6';
        text3Ref.current.style.opacity = '0.6';
        text4Ref.current.style.opacity = '0.6';
      }
    }

    if (!isVisible) {
      if (groupRef.current) groupRef.current.visible = false;
      return;
    }
    
    if (groupRef.current) {
      groupRef.current.visible = true;
      // Position the entire sound field perfectly at the center of the headphone model
      if (modelCenter.current) {
        // Offset slightly in Z to appear around/behind the earcups
        groupRef.current.position.set(modelCenter.current.x, modelCenter.current.y, modelCenter.current.z - 0.5);
      }
    }

    // Local progress inside Section 3 (0.0 to 1.0)
    // Map p from 2.1 -> 2.9 to localP 0.0 -> 1.0
    const localP = Math.max(0, Math.min(1, (p - 2.1) / 0.8));
    
    // Animate Rings
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      
      const delay = i * 0.12;
      const ringP = Math.max(0, Math.min(1, (localP - delay) / (1 - delay)));
      
      const ease = 1 - Math.pow(1 - ringP, 3);
      const scale = 0.5 + ease * 3.0;
      
      ring.scale.set(scale * 1.2, scale, scale);
      
      let opacity = 0;
      if (ringP > 0 && ringP < 1) {
        opacity = Math.sin(ringP * Math.PI) * 0.35; 
      }
      const fadeOutP = Math.max(0, Math.min(1, (1.0 - localP) / 0.2));
      opacity *= fadeOutP;
      
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = opacity;
    });

    // Animate Particles
    if (particlesRef.current) {
      const material = particlesRef.current.material as THREE.PointsMaterial;
      const particleP = Math.max(0, Math.min(1, (localP - 0.3) / 0.5));
      const fadeOutP = Math.max(0, Math.min(1, (1.0 - localP) / 0.2));
      
      material.opacity = Math.sin(particleP * Math.PI) * 0.6 * fadeOutP;
      
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.04;
    }
  });

  if (!isMobile) return null;

  return (
    <group ref={groupRef} visible={false}>
      {/* Expanding Rings */}
      {ringGeometries.map((geo, i) => (
        <mesh 
          key={i} 
          ref={(el) => {
            if (el) ringsRef.current[i] = el;
          }}
          geometry={geo}
        >
          <meshBasicMaterial 
            color="#FF4D4D" // Coral accent
            transparent 
            opacity={0} 
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Sparse Floating Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#5F5A52" // Muted gray/brown
          transparent
          opacity={0}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>
      
      {/* Minimal Technical Indicators (Thin horizontal lines) */}
      <group position={[-2.75, 0, 0]}>
         <mesh position={[0.5, 0, 0]}>
           <planeGeometry args={[1, 0.015]} />
           <meshBasicMaterial color="#5F5A52" transparent opacity={0.2} />
         </mesh>
         <Html position={[0.5, 0.4, 0]} center className="pointer-events-none w-max">
            <p ref={text1Ref} className="text-[9px] font-black tracking-widest text-foreground uppercase opacity-0 transition-opacity duration-300 text-center leading-tight">ERGONOMIC<br />FIT</p>
         </Html>
         <Html position={[0.5, -0.4, 0]} center className="pointer-events-none w-max">
            <p ref={text2Ref} className="text-[9px] font-black tracking-widest text-foreground uppercase opacity-0 transition-opacity duration-300 text-center leading-tight">ACTIVE NOISE<br />CONTROL</p>
         </Html>
      </group>
      <group position={[2.75, 0, 0]}>
         <mesh position={[-0.5, 0, 0]}>
           <planeGeometry args={[1, 0.015]} />
           <meshBasicMaterial color="#5F5A52" transparent opacity={0.2} />
         </mesh>
         <Html position={[-0.5, 0.4, 0]} center className="pointer-events-none w-max">
            <p ref={text3Ref} className="text-[9px] font-black tracking-widest text-foreground uppercase opacity-0 transition-opacity duration-300 text-center leading-tight">PRECISION<br />DRIVER</p>
         </Html>
         <Html position={[-0.5, -0.4, 0]} center className="pointer-events-none w-max">
            <p ref={text4Ref} className="text-[9px] font-black tracking-widest text-foreground uppercase opacity-0 transition-opacity duration-300 text-center leading-tight">IMMERSIVE<br />AUDIO</p>
         </Html>
      </group>
    </group>
  );
}
