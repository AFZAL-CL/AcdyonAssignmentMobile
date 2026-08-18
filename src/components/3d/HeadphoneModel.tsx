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
}

export default function HeadphoneModel({ activeVariant, ...props }: HeadphoneModelProps) {
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
  }, [scene]);

  useFrame((state) => {
    if (group.current && innerGroup.current) {
      const p = getScrollProgress();
      
      let targetRotationY = 0;
      let targetRotationX = 0;
      if (p > 0.2 && p <= 0.6) {
        targetRotationY = Math.PI * ((p - 0.2) / 0.4);
      } else if (p > 0.6 && p <= 1.0) {
        targetRotationY = Math.PI;
      } else if (p > 1.0 && p <= 2.0) {
        targetRotationY = Math.PI + (Math.PI / 3) * (Math.min(p - 1.0, 0.5) / 0.5);
      } else if (p > 2.0 && p <= 3.0) {
        targetRotationY = Math.PI + (Math.PI / 3);
        targetRotationX = 0; 
      } else if (p > 3.0 && p <= 4.0) {
        targetRotationY = (Math.PI + Math.PI / 3) + (Math.PI / 1.5) * (Math.min(p - 3.0, 0.8) / 0.8);
        targetRotationX = 0;
      } else if (p > 4.0) {
        targetRotationY = Math.PI * 2 + (Math.PI / 6);
        targetRotationX = 0;
      }
      
      const idleRot = state.clock.elapsedTime * 0.05;
      
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y, 
        targetRotationY + idleRot, 
        0.05
      );
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
      
      innerGroup.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      
      const isRed = primaryColor.toUpperCase() === '#FF4D4D';
      shaderUniforms.current.uMix.value = THREE.MathUtils.lerp(shaderUniforms.current.uMix.value, isRed ? 0.0 : 1.0, 0.1);
      
      shaderUniforms.current.uPrimary.value.lerp(targetPrimary, 0.1);
      shaderUniforms.current.uSecondary.value.lerp(targetSecondary, 0.1);
      shaderUniforms.current.uDetail.value.lerp(targetDetail, 0.1);
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
