'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        document.body.style.overflow = '';
      }
    });

    // Progress bar animation
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 2,
      ease: 'power3.inOut',
    });

    // Text reveal
    tl.fromTo(textRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=1'
    );

    // Loader slide up
    tl.to(loaderRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
      delay: 0.2
    });

    return () => {
      document.body.style.overflow = '';
      tl.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 z-[10000] bg-wff-dark flex flex-col items-center justify-center"
    >
      <div className="relative w-full max-w-md px-8 flex flex-col items-center">
        <div ref={textRef} className="font-bebas text-4xl md:text-6xl tracking-wider mb-8 text-white opacity-0">
          WFF <span className="text-wff-red">GHANA</span>
        </div>
        
        <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
          <div 
            ref={progressRef}
            className="absolute top-0 left-0 h-full w-full bg-wff-red origin-left scale-x-0"
          />
        </div>
      </div>
    </div>
  );
}
