'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function KenteMesh() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      
      // Animate individual children
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshBasicMaterial;
          // Shift colors slowly
          const hue = (state.clock.elapsedTime * 0.05 + i * 0.1) % 1;
          // Restrict to warm/earthy colors (gold to deep red)
          material.color.setHSL(hue * 0.15, 0.8, 0.4);
          
          child.rotation.z = Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.1;
        }
      });
    }
  });

  // Create a grid of diamond shapes
  const diamonds = [];
  for (let i = -5; i <= 5; i++) {
    for (let j = -5; j <= 5; j++) {
      diamonds.push(
        <mesh key={`${i}-${j}`} position={[i * 1.5, j * 1.5, 0]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#FCD116" transparent opacity={0.15} wireframe />
        </mesh>
      );
    }
  }

  return (
    <group ref={groupRef} rotation={[-Math.PI / 6, 0, 0]}>
      {diamonds}
    </group>
  );
}
