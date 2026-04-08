'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGPathElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
      }
    });

    // Draw Map
    if (mapRef.current) {
      const length = mapRef.current.getTotalLength();
      gsap.set(mapRef.current, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(mapRef.current, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' });
    }

    // Kente Loading Bar
    if (barRef.current) {
      tl.to(barRef.current, { width: '100%', duration: 2, ease: 'power2.inOut' }, '<');
    }

    // Pulse and Wipe
    if (mapRef.current && containerRef.current) {
      tl.to(mapRef.current, { fill: 'rgba(206, 17, 38, 0.2)', scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, transformOrigin: 'center' });
      tl.to(containerRef.current, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '+=0.2');
    }

  }, []);

  if (!isLoading) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center">
      {/* Simplified Ghana Map SVG */}
      <svg width="200" height="250" viewBox="0 0 200 250" className="mb-12 overflow-visible">
        <path 
          ref={mapRef}
          d="M50,200 C30,150 20,100 50,50 C80,20 150,30 180,80 C200,120 180,180 150,220 C100,250 70,230 50,200 Z" 
          fill="transparent" 
          stroke="#FCD116" 
          strokeWidth="2"
        />
      </svg>

      {/* Kente Loading Bar */}
      <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden relative">
        <div 
          ref={barRef}
          className="absolute top-0 left-0 h-full w-0"
          style={{
            background: 'linear-gradient(90deg, #FCD116 0%, #006B3F 50%, #CE1126 100%)'
          }}
        />
      </div>
    </div>
  );
}
