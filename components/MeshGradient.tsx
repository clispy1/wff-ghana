'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export default function MeshGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-wff-dark"></div>
      
      {/* Red Orb */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-wff-red/20 blur-[120px] mix-blend-screen"
        animate={{
          x: ['0%', '20%', '0%'],
          y: ['0%', '30%', '0%'],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Gold Orb */}
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-wff-gold/10 blur-[150px] mix-blend-screen"
        animate={{
          x: ['0%', '-20%', '0%'],
          y: ['0%', '-30%', '0%'],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Green Orb */}
      <motion.div 
        className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-wff-green/10 blur-[100px] mix-blend-screen"
        animate={{
          x: ['0%', '30%', '0%'],
          y: ['0%', '-20%', '0%'],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Noise Overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>
    </div>
  );
}
