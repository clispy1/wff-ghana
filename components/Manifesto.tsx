'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        // Split text into lines or words for animation (simplified here with opacity reveal)
        gsap.fromTo(textRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 70%',
              end: 'bottom 80%',
              scrub: 1,
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-wff-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-wff-red to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <h2 className="font-sans text-wff-red font-bold uppercase tracking-[0.5em] text-sm mb-8">The Mission</h2>
        
        <p ref={textRef} className="font-bebas text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white mix-blend-difference">
          WE ARE NOT JUST HOSTING A CHAMPIONSHIP. <br/>
          <span className="text-white/40">WE ARE REDEFINING AFRICAN FITNESS.</span> <br/>
          THE WORLD IS COMING TO <span className="text-wff-gold">ACCRA</span>.
        </p>
      </div>
    </section>
  );
}
