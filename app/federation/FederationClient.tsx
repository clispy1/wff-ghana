'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import KenteMesh from '@/components/KenteMesh';

gsap.registerPlugin(ScrollTrigger);

export default function FederationClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const mapTextRef = useRef<SVGTextElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const [stats, setStats] = useState({
    founded: 0,
    countries: 0,
    athletes: 0
  });

  const statsObj = useRef({ founded: 0, countries: 0, athletes: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Color Shift (Act 1 - Earthy)
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => gsap.to(document.documentElement, { '--bg-color': '#1A0F00', duration: 1 }), // Deep brown
        onLeaveBack: () => gsap.to(document.documentElement, { '--bg-color': '#050505', duration: 1 }),
        onLeave: () => gsap.to(document.documentElement, { '--bg-color': '#050505', duration: 1 }),
        onEnterBack: () => gsap.to(document.documentElement, { '--bg-color': '#1A0F00', duration: 1 }),
      });

      // Ghost Text Parallax
      gsap.to('.ghost-text', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Header Animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%'
          }
        }
      );

      // SVG Map Animation
      if (mapRef.current && pulseRef.current && mapTextRef.current) {
        const length = mapRef.current.getTotalLength();
        gsap.set(mapRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(pulseRef.current, { scale: 0, opacity: 0, transformOrigin: 'center' });
        gsap.set(mapTextRef.current, { opacity: 0, y: 10 });

        const mapTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.map-container',
            start: 'top 60%',
          }
        });

        mapTl.to(mapRef.current, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' })
             .to(pulseRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' })
             .to(pulseRef.current, { scale: 2, opacity: 0, duration: 1, repeat: -1 }, '+=0.2')
             .to(mapTextRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=1');
      }

      // Stats Counter
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(statsObj.current, {
              founded: 1968,
              countries: 42,
              athletes: 5000,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                setStats({
                  founded: Math.round(statsObj.current.founded),
                  countries: Math.round(statsObj.current.countries),
                  athletes: Math.round(statsObj.current.athletes)
                });
              }
            });
          },
          once: true
        });
      }

      // Content Animation
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.children,
          { opacity: 0, y: 40 },
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-wff-dark">
      
      {/* Ghosted Background Text */}
      <div className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-between overflow-hidden opacity-[0.03]">
        <h2 className="ghost-text font-bebas text-[20vw] leading-none text-white whitespace-nowrap -ml-20">GHANA</h2>
        <h2 className="ghost-text font-bebas text-[20vw] leading-none text-white whitespace-nowrap ml-20">ROOTS</h2>
        <h2 className="ghost-text font-bebas text-[20vw] leading-none text-white whitespace-nowrap -ml-10">STRONG</h2>
      </div>

      {/* 3D Kente Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <KenteMesh />
        </Canvas>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-24 opacity-0">
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">THE <span className="text-wff-gold">FEDERATION</span></h1>
          <p className="font-sans text-xl text-white/70">
            Grounded in culture. Forged in discipline. WFF Ghana is the official national chapter of the World Fitness Federation.
          </p>
        </div>

        {/* Map & Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          
          {/* Animated SVG Map */}
          <div className="map-container relative aspect-square flex items-center justify-center bg-[#111]/50 border border-white/5 p-8 rounded-full backdrop-blur-sm shadow-2xl">
            <svg width="100%" height="100%" viewBox="0 0 200 250" className="overflow-visible">
              {/* Simplified Ghana Map Path */}
              <path 
                ref={mapRef}
                d="M50,200 C30,150 20,100 50,50 C80,20 150,30 180,80 C200,120 180,180 150,220 C100,250 70,230 50,200 Z" 
                fill="transparent" 
                stroke="#FCD116" 
                strokeWidth="2"
              />
              {/* Accra Pulse */}
              <circle ref={pulseRef} cx="120" cy="200" r="8" fill="#CE1126" />
              {/* Text */}
              <text ref={mapTextRef} x="120" y="230" fill="white" fontSize="12" fontFamily="sans-serif" textAnchor="middle" className="uppercase tracking-widest opacity-70">
                This is where champions are made
              </text>
            </svg>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="space-y-12">
            <div className="border-l-2 border-wff-gold pl-6">
              <h3 className="font-bebas text-6xl text-wff-gold mb-2">{stats.founded}</h3>
              <p className="font-sans text-sm uppercase tracking-widest text-white/50">Year Founded (Global)</p>
            </div>
            <div className="border-l-2 border-wff-red pl-6">
              <h3 className="font-bebas text-6xl text-wff-red mb-2">{stats.countries}+</h3>
              <p className="font-sans text-sm uppercase tracking-widest text-white/50">Participating African Nations</p>
            </div>
            <div className="border-l-2 border-white pl-6">
              <h3 className="font-bebas text-6xl text-white mb-2">{stats.athletes.toLocaleString()}+</h3>
              <p className="font-sans text-sm uppercase tracking-widest text-white/50">Registered Athletes</p>
            </div>
          </div>

        </div>

        {/* Content */}
        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="relative aspect-[3/4] bg-[#111] border border-white/10 overflow-hidden group rounded-xl">
            <Image 
              src="https://picsum.photos/seed/boardroom/800/1200" 
              alt="WFF Ghana Executive"
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-bebas text-4xl mb-1 text-white">KWAME MENSAH</h3>
              <p className="font-sans text-wff-gold font-bold uppercase tracking-widest text-sm">President, WFF Ghana</p>
            </div>
          </div>

          <div className="space-y-12 bg-[#0A0A0A]/80 backdrop-blur-md p-8 md:p-12 border border-white/5 rounded-xl">
            <div>
              <h2 className="font-bebas text-4xl mb-4 text-wff-red">OUR MISSION</h2>
              <p className="font-sans text-white/70 leading-relaxed text-lg">
                To provide a world-class platform for Ghanaian athletes to showcase their hard work, dedication, and aesthetic excellence on the global stage. We believe in fair judging, athlete welfare, and community building.
              </p>
            </div>
            <div>
              <h2 className="font-bebas text-4xl mb-4 text-wff-gold">THE LEGACY</h2>
              <p className="font-sans text-white/70 leading-relaxed text-lg">
                The World Fitness Federation (WFF) was founded in 1968 in Germany. Today, WFF Ghana carries that legacy forward, bringing international standards to local competitions and preparing our national team to dominate globally.
              </p>
            </div>
            <div className="pt-8 border-t border-white/10">
              <button className="border border-wff-gold text-wff-gold font-bebas text-xl px-8 py-4 hover:bg-wff-gold hover:text-black transition-colors w-full md:w-auto">
                DOWNLOAD RULEBOOK
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
