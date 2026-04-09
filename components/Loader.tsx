'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

export default function Loader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock scroll while loading
    document.body.style.overflow = 'hidden';
    
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        if (containerRef.current) containerRef.current.style.display = 'none';
      }
    });

    if (logoRef.current && containerRef.current && progressRef.current) {
      // Initial state
      gsap.set(logoRef.current, { scale: 0.8, opacity: 0, filter: 'blur(10px)' });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });

      // Animation sequence
      tl.to(logoRef.current, {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power3.out'
        })
        .to(progressRef.current, {
          scaleX: 1,
          duration: 1.5,
          ease: 'power2.inOut'
        }, '<') // Run at the same time
        .to(logoRef.current, {
          scale: 1.1,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut'
        }, '+=0.2') // Heartbeat pulse
        .to(containerRef.current, { 
          opacity: 0, 
          duration: 0.8, 
          ease: 'power2.inOut' 
        }, '+=0.2');
    }

    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center pointer-events-none">
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
        <Image 
          ref={logoRef}
          src="/wff-ghana-logo.svg" 
          alt="WFF Ghana Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {/* Loading Progress Bar */}
      <div className="w-48 md:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div ref={progressRef} className="h-full bg-wff-gold w-full"></div>
      </div>
    </div>
  );
}
