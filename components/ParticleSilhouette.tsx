'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleSilhouette() {
  const groupRef = useRef<THREE.Group>(null);

  // Generate points roughly in the shape of a V-taper torso
  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < 2000; i++) {
      // Very rough approximation of a torso
      const y = (Math.random() - 0.5) * 4; // Height
      const widthAtY = 1.5 + (y * 0.5); // Wider at top (shoulders), narrow at bottom (waist)
      const x = (Math.random() - 0.5) * widthAtY;
      const z = (Math.random() - 0.5) * 0.5; // Depth
      
      // Only keep points inside a rough V shape
      if (Math.abs(x) < widthAtY / 2) {
        temp.push({
          target: new THREE.Vector3(x, y, z),
          current: new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10 + 5,
            (Math.random() - 0.5) * 10
          ),
          speed: 0.02 + Math.random() * 0.05
        });
      }
    }
    return temp;
  });

  useFrame((state) => {
    if (groupRef.current) {
      // Assemble particles
      groupRef.current.children.forEach((child, i) => {
        const p = particles[i];
        child.position.lerp(p.target, p.speed);
        
        // Add slight breathing/hover animation
        if (child.position.distanceTo(p.target) < 0.1) {
           child.position.x += Math.sin(state.clock.elapsedTime * 2 + p.target.y) * 0.005;
           child.position.y += Math.cos(state.clock.elapsedTime * 2 + p.target.x) * 0.005;
        }
      });
      
      // Slowly rotate the whole group
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.current}>
          <sphereGeometry args={[0.03, 4, 4]} />
          <meshBasicMaterial color="#CE1126" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
