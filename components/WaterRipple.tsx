'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Simple wave distortion
    float noiseFreq = 2.0;
    float noiseAmp = 0.1;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
    pos.z += sin(noisePos.x) * noiseAmp * sin(noisePos.y);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  
  void main() {
    // Water-like gradient
    float mixValue = (sin(vUv.x * 10.0 + uTime) + cos(vUv.y * 10.0 + uTime)) * 0.5 + 0.5;
    vec3 color = mix(uColor1, uColor2, mixValue);
    
    // Soft reflections
    float reflection = pow(mixValue, 3.0) * 0.3;
    color += vec3(reflection);
    
    gl_FragColor = vec4(color, 0.4); // Transparent
  }
`;

export default function WaterRipple() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#002B1F') }, // Deep forest green
      uColor2: { value: new THREE.Color('#001A1A') }, // Deep teal
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2.5, 0, 0]} position={[0, 0, -2]}>
      <planeGeometry args={[20, 20, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        wireframe={false}
      />
    </mesh>
  );
}
