'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    const renderTrail = () => {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      
      gsap.set(trail, {
        x: trailX,
        y: trailY
      });
      
      requestAnimationFrame(renderTrail);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(renderTrail);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <div 
        ref={trailRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-wff-red/30 blur-md pointer-events-none z-[10000] transform -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
      />
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-wff-red shadow-[0_0_10px_#CE1126] pointer-events-none z-[10001] transform -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}
