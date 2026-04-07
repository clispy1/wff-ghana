'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function FederationClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      if (contentRef.current) {
        gsap.fromTo(contentRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-wff-dark">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-24 opacity-0">
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">THE <span className="text-wff-red">FEDERATION</span></h1>
          <p className="font-sans text-xl text-white/70">
            WFF Ghana is the official national chapter of the World Fitness Federation. We are dedicated to elevating Ghanaian athletes and promoting a culture of health, discipline, and excellence.
          </p>
        </div>

        {/* Content */}
        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[3/4] bg-[#111] border border-white/10 overflow-hidden">
            <Image 
              src="https://picsum.photos/seed/boardroom/800/1200" 
              alt="WFF Ghana Executive"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wff-dark via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <h3 className="font-bebas text-3xl mb-1">KWAME MENSAH</h3>
              <p className="font-sans text-wff-gold font-bold uppercase tracking-widest text-sm">President, WFF Ghana</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="font-bebas text-4xl mb-4 text-wff-red">OUR MISSION</h2>
              <p className="font-sans text-white/70 leading-relaxed">
                To provide a world-class platform for Ghanaian athletes to showcase their hard work, dedication, and aesthetic excellence on the global stage. We believe in fair judging, athlete welfare, and community building.
              </p>
            </div>
            <div>
              <h2 className="font-bebas text-4xl mb-4 text-wff-gold">THE HISTORY</h2>
              <p className="font-sans text-white/70 leading-relaxed">
                The World Fitness Federation (WFF) was founded in 1968 in Germany. Today, WFF Ghana carries that legacy forward, bringing international standards to local competitions and preparing our national team to dominate globally.
              </p>
            </div>
            <div className="pt-8 border-t border-white/10">
              <button className="border border-white text-white font-bebas text-xl px-8 py-3 hover:bg-white hover:text-wff-dark transition-colors">
                DOWNLOAD RULEBOOK
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
