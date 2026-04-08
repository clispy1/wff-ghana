'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FireTunnel() {
  const groupRef = useRef<THREE.Group>(null);

  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < 1000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      const z = Math.random() * -50;
      temp.push({
        position: new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, z),
        speed: 0.5 + Math.random() * 1.5,
        color: Math.random() > 0.5 ? '#CE1126' : '#FCD116'
      });
    }
    return temp;
  });

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.z += particles[i].speed;
        if (child.position.z > 5) {
          child.position.z = -50;
        }
      });
      groupRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
