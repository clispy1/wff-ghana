'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Loader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Lock scroll while loading
    document.body.style.overflow = 'hidden';
    
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        if (containerRef.current) containerRef.current.style.display = 'none';
      }
    });

    if (pathRef.current && fillRef.current && containerRef.current) {
      const length = pathRef.current.getTotalLength();
      
      // Initial state
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set(fillRef.current, { opacity: 0 });

      // Animation sequence
      tl.to(pathRef.current, { 
          strokeDashoffset: 0, 
          duration: 2, 
          ease: 'power2.inOut' 
        })
        .to(fillRef.current, { 
          opacity: 1, 
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.5')
        .to(containerRef.current, { 
          scale: 15, 
          opacity: 0, 
          duration: 1.2, 
          ease: 'power4.inOut' 
        }, '+=0.3');
    }

    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center pointer-events-none origin-center">
      <svg 
        width="120" 
        height="150" 
        viewBox="0 0 100 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transform scale-150"
      >
        {/* Simplified outline of Ghana */}
        <path 
          ref={fillRef}
          d="M20,60 L30,30 L60,20 L80,40 L90,70 L70,100 L40,110 L10,80 Z" 
          fill="#D4AF37" 
        />
        <path 
          ref={pathRef}
          d="M20,60 L30,30 L60,20 L80,40 L90,70 L70,100 L40,110 L10,80 Z" 
          stroke="#D4AF37" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
