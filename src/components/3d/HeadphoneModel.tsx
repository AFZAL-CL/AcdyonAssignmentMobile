import React, { useRef, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getScrollProgress } from '@/lib/scrollStore';

interface HeadphoneModelProps extends React.ComponentProps<'group'> {
  activeVariant?: {
    primary: string;
    secondary: string;
    detail: string;
  };
  onBoundsCalculated?: (center: THREE.Vector3, size: THREE.Vector3) => void;
}

export default function HeadphoneModel({ activeVariant, onBoundsCalculated, ...props }: HeadphoneModelProps) {
  const group = useRef<THREE.Group>(null);
  const innerGroup = useRef<THREE.Group>(null);
  
  const { scene } = useGLTF('/models/headphones/scene.gltf');
  
  const primaryColor = activeVariant?.primary || '#FF4D4D';
  const secondaryColor = activeVariant?.secondary || '#F0F0F0';
  const detailColor = activeVariant?.detail || '#30323B';

  const targetPrimary = useMemo(() => new THREE.Color(primaryColor), [primaryColor]);
  const targetSecondary = useMemo(() => new THREE.Color(secondaryColor), [secondaryColor]);
  const targetDetail = useMemo(() => new THREE.Color(detailColor), [detailColor]);
  
  const shaderUniforms = useRef({
    uPrimary: { value: new THREE.Color(primaryColor) },
    uSecondary: { value: new THREE.Color(secondaryColor) },
    uDetail: { value: new THREE.Color(detailColor) },
    uMix: { value: 0.0 }
  });
  
  const timeRef = useRef(0);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material && (mesh.material as THREE.Material).name === 'color.001') {
          const mat = mesh.material as THREE.Material;
          
          mat.onBeforeCompile = (shader) => {
            shader.uniforms.uPrimary = shaderUniforms.current.uPrimary;
            shader.uniforms.uSecondary = shaderUniforms.current.uSecondary;
            shader.uniforms.uDetail = shaderUniforms.current.uDetail;
            shader.uniforms.uMix = shaderUniforms.current.uMix;
            
            shader.fragmentShader = `
              uniform vec3 uPrimary;
              uniform vec3 uSecondary;
              uniform vec3 uDetail;
              uniform float uMix;
            ` + shader.fragmentShader;
            
            shader.fragmentShader = shader.fragmentShader.replace(
              `#include <map_fragment>`,
              `
              #include <map_fragment>
              
              vec3 orig = diffuseColor.rgb;
              vec3 mapped = orig;
              
              float luma = dot(orig, vec3(0.299, 0.587, 0.114));
              float saturation = max(orig.r, max(orig.g, orig.b)) - min(orig.r, min(orig.g, orig.b));
              
              bool isYellow = orig.r > 0.5 && orig.g > 0.4 && orig.b < 0.4;
              bool isBlack = luma < 0.1;
              bool isRed = orig.r > 0.5 && orig.g < 0.4 && orig.b < 0.4;
              bool isPink = orig.r > 0.6 && orig.g > 0.4 && orig.b > 0.4 && orig.g < 0.8;
              bool isWhite = luma > 0.6 && saturation < 0.2;
              bool isDarkGrey = luma > 0.1 && luma < 0.5 && saturation < 0.2;
              
              if (!isYellow && !isBlack) {
                  if (isRed || isPink) {
                      // Normalize against typical red luminance (~0.3)
                      mapped = uPrimary * (luma * 3.3);
                  } else if (isWhite) {
                      // Normalize against typical white luminance (~0.9)
                      mapped = uSecondary * (luma * 1.1);
                  } else if (isDarkGrey) {
                      // Normalize against typical dark grey luminance (~0.25)
                      mapped = uDetail * (luma * 4.0);
                  } else {
                      // Fallback for edge cases: slightly tint towards primary while keeping luminance
                      mapped = mix(orig, uPrimary * (luma * 3.0), 0.5);
                  }
              }
              
              diffuseColor.rgb = mix(orig, mapped, uMix);
              `
            );
          };
          mat.needsUpdate = true;
        }
      }
    });

    if (onBoundsCalculated && innerGroup.current) {
      innerGroup.current.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(innerGroup.current);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      onBoundsCalculated(center, size);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  useFrame((state, delta) => {
    if (group.current && innerGroup.current) {
      timeRef.current += delta;
      const p = getScrollProgress();
      
      const SECTION_CONFIG = [
        0,                                                  // Start
        Math.PI,                                            // Sec 1
        Math.PI + Math.PI / 3,                              // Sec 2
        Math.PI + Math.PI / 3 + Math.PI / 1.5,              // Sec 3 (formerly Sec 4)
        Math.PI + Math.PI / 3 + Math.PI / 1.5 + Math.PI / 6 // Sec 4 (formerly Sec 5)
      ];

      const easeInOutCubic = (x: number): number => {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      };

      // Clamp section calculation so the model stays in Phase 5 orientation during Phase 6
      const clampedP = Math.min(p, 4.0);
      const sectionIdx = Math.min(Math.floor(clampedP), 3);
      const localP = Math.min(Math.max(clampedP - sectionIdx, 0), 1);

      const prevRot = SECTION_CONFIG[sectionIdx];
      const nextRot = SECTION_CONFIG[sectionIdx + 1];

      // Cinematic phases
      // 0.0 to 0.70: Movement
      // 0.70 to 0.82: Settle
      // 0.82 to 1.00: 360 Spin

      const movementProgress = Math.min(localP / 0.7, 1.0);
      const spinProgress = Math.max(0, localP - 0.82) / 0.18;

      const targetBaseRot = THREE.MathUtils.lerp(prevRot, nextRot, easeInOutCubic(movementProgress));
      const spinRot = easeInOutCubic(spinProgress) * Math.PI * 2;
      const completedSpins = sectionIdx * Math.PI * 2;

      let absoluteTargetRotY = targetBaseRot + spinRot + completedSpins;
      let targetRotationX = 0;

      // --- SECTION 6 CINEMATIC STRAIGHTEN (p: 4.00 -> 4.30) ---
      if (p > 4.0) {
        // Calculate the base target at exactly p=4.0
        const baseRotP4 = SECTION_CONFIG[4] + 3 * Math.PI * 2;
        
        // Since 8.5 PI (270 deg) was an edge-on view, 8.0 PI (0 deg modulo 2PI) is likely the front view.
        // We calculate the precise rotation progress, locking it completely at p >= 4.30
        const frontFacingAngle = 8.0 * Math.PI; 
        
        const transitionP = Math.min((p - 4.0) / 0.30, 1.0);
        const smoothP = easeInOutCubic(transitionP);
        
        absoluteTargetRotY = THREE.MathUtils.lerp(baseRotP4, frontFacingAngle, smoothP);
      }

      // --- SECTION 6 SCALE OVERRIDE ---
      let targetScale = 1.0;
      if (p > 4.40) {
        // Initial Scale (4.40 -> 4.60)
        const initialScaleP = Math.min((p - 4.40) / 0.20, 1.0);
        const smoothInitialScale = easeInOutCubic(initialScaleP);
        targetScale = THREE.MathUtils.lerp(1.0, 2.5, smoothInitialScale);
        
        // Continuous Zoom (4.80 -> 5.30)
        if (p > 4.80) {
          const zoomP = Math.min((p - 4.80) / 0.50, 1.0);
          // Exponential growth so it accelerates as it gets closer
          const smoothZoom = zoomP * zoomP * zoomP;
          targetScale = THREE.MathUtils.lerp(2.5, 40.0, smoothZoom);
        }
      }

      // --- SECTION 6 PERMANENT HIDDEN STATE ---
      const SECTION_6_END = 5.30;
      const section6Finished = p >= SECTION_6_END;
      group.current.visible = !section6Finished;

      // Double smoothing fix (replace fixed 0.05 lerp with exp decay)
      const dampSpeed = 25;
      
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y, 
        absoluteTargetRotY, 
        1 - Math.exp(-dampSpeed * delta)
      );
      
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x, 
        targetRotationX, 
        1 - Math.exp(-dampSpeed * delta)
      );
      
      group.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        1 - Math.exp(-dampSpeed * delta)
      );
      
      // Floating idle animation kept but decoupled from orientation
      // For Section 6, we completely stop the idle floating so the product settles
      const idleAmplitude = p > 4.30 ? 0.0 : 0.05;
      innerGroup.current.position.y = Math.sin(timeRef.current * 1.5) * idleAmplitude;
      
      const colorDampSpeed = 15;
      const isRed = primaryColor.toUpperCase() === '#FF4D4D';
      shaderUniforms.current.uMix.value = THREE.MathUtils.lerp(
        shaderUniforms.current.uMix.value, 
        isRed ? 0.0 : 1.0, 
        1 - Math.exp(-colorDampSpeed * delta)
      );
      
      shaderUniforms.current.uPrimary.value.lerp(targetPrimary, 1 - Math.exp(-colorDampSpeed * delta));
      shaderUniforms.current.uSecondary.value.lerp(targetSecondary, 1 - Math.exp(-colorDampSpeed * delta));
      shaderUniforms.current.uDetail.value.lerp(targetDetail, 1 - Math.exp(-colorDampSpeed * delta));
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group ref={innerGroup}>
        <primitive object={scene} scale={12.55} position={[0, -1.56 * 12.55, 0]} />
      </group>
    </group>
  );
}
