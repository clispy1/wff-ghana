'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.1;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Base Globe */}
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#0A0A0A" 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </Sphere>

      {/* Pulsing Core (representing Ghana/Energy) */}
      <Sphere ref={glowRef} args={[1.9, 32, 32]}>
        <MeshDistortMaterial 
          color="#CE1126" 
          emissive="#FCD116"
          emissiveIntensity={2}
          distort={0.4} 
          speed={2} 
          transparent 
          opacity={0.8}
        />
      </Sphere>

      {/* Orbiting Particles */}
      <OrbitingParticles />
    </group>
  );
}

function OrbitingParticles() {
  const groupRef = useRef<THREE.Group>(null);

  const [particles] = useState(() => {
    return Array.from({ length: 50 }).map(() => {
      const radius = 2.5 + Math.random() * 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return {
        position: [x, y, z] as [number, number, number],
        color: Math.random() > 0.5 ? "#CE1126" : "#FCD116"
      };
    });
  });

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.2;
      groupRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  );
}
