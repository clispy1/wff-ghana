'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const featuredAthletes = [
  { name: 'KOFI MENSAH', category: 'Bodybuilding', image: 'https://picsum.photos/seed/kofi/600/800' },
  { name: 'AMA SERWAA', category: 'Bikini', image: 'https://picsum.photos/seed/ama/600/800' },
  { name: 'YAW BOAKYE', category: 'Men\'s Physique', image: 'https://picsum.photos/seed/yaw/600/800' },
  { name: 'ABENA OSEI', category: 'Figure', image: 'https://picsum.photos/seed/abena/600/800' },
  { name: 'KWAME NKRUMAH', category: 'Classic Physique', image: 'https://picsum.photos/seed/kwame/600/800' },
];

export default function FeaturedAthletes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (scrollRef.current && containerRef.current) {
        // Calculate the total width to scroll
        const scrollWidth = scrollRef.current.scrollWidth - window.innerWidth;
        
        gsap.to(scrollRef.current, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            pin: true,
            scrub: 1,
          }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-[#0A0A0A] py-24 overflow-hidden relative min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-bebas text-6xl md:text-8xl text-white leading-none">THE <span className="text-wff-red">ELITE</span></h2>
          <p className="font-sans text-white/50 uppercase tracking-widest text-sm mt-4">Team Ghana Prospects</p>
        </div>
        <Link href="/athletes" className="hidden md:inline-block border border-white/20 text-white font-sans text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-white hover:text-black transition-colors">
          View Full Roster
        </Link>
      </div>

      <div className="w-full overflow-hidden">
        <div ref={scrollRef} className="flex space-x-8 px-6 w-max">
          {featuredAthletes.map((athlete, idx) => (
            <div key={idx} className="w-[300px] md:w-[400px] aspect-[3/4] relative group cursor-pointer bg-[#111] border border-white/10 overflow-hidden flex-shrink-0">
              <Image 
                src={athlete.image} 
                alt={athlete.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="font-sans text-wff-gold font-bold uppercase tracking-widest text-xs mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{athlete.category}</p>
                <h3 className="font-bebas text-4xl text-white">{athlete.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-6 mt-12 md:hidden">
        <Link href="/athletes" className="block text-center border border-white/20 text-white font-sans text-xs font-bold uppercase tracking-widest px-6 py-4 hover:bg-white hover:text-black transition-colors">
          View Full Roster
        </Link>
      </div>
    </section>
  );
}
