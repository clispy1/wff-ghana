'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

const vertexShader = `
  varying vec2 vUv;
  uniform float uHoverState;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Simple wave distortion based on hover state
    pos.z += sin(pos.x * 10.0 + uHoverState * 5.0) * 0.1 * uHoverState;
    pos.z += sin(pos.y * 10.0 + uHoverState * 5.0) * 0.1 * uHoverState;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uHoverState;
  
  void main() {
    // RGB shift effect
    float shift = uHoverState * 0.05;
    vec4 texColorR = texture2D(uTexture, vUv + vec2(shift, 0.0));
    vec4 texColorG = texture2D(uTexture, vUv);
    vec4 texColorB = texture2D(uTexture, vUv - vec2(shift, 0.0));
    
    vec3 color = vec3(texColorR.r, texColorG.g, texColorB.b);
    
    // Grayscale to color transition
    vec3 gray = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
    vec3 finalColor = mix(gray, color, uHoverState);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function ShaderPlane({ src, isHovered }: { src: string, isHovered: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useTexture(src);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uHoverState: { value: 0 },
    }),
    [texture]
  );

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Smoothly interpolate hover state
      const target = isHovered ? 1 : 0;
      materialRef.current.uniforms.uHoverState.value += (target - materialRef.current.uniforms.uHoverState.value) * delta * 5;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 1.125, 32, 32]} /> {/* 16:9 aspect ratio roughly */}
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function DistortedImage({ src, isHovered }: { src: string, isHovered: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 1.5] }} className="w-full h-full">
      <Suspense fallback={null}>
        <ShaderPlane src={src} isHovered={isHovered} />
      </Suspense>
    </Canvas>
  );
}
