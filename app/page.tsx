'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/components/Hero';
import Link from 'next/link';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import FireTunnel from '@/components/FireTunnel';
import ParticleSilhouette from '@/components/ParticleSilhouette';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Universal Reveal Animation - Simplified and standardized for consistency
      gsap.utils.toArray('.reveal-target').forEach((el: any) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              // Play once when scrolling down, reverse when scrolling all the way back up
              toggleActions: 'play none none reverse',
            }
          }
        );
      });

      // Horizontal Scroll Logic
      const horizontalSection = document.querySelector('.horizontal-scroll-container');
      const horizontalContent = document.querySelector('.horizontal-scroll-content');
      
      if (horizontalSection && horizontalContent) {
        const getScrollAmount = () => {
          let horizontalWidth = horizontalContent.scrollWidth;
          return -(horizontalWidth - window.innerWidth);
        };

        const tween = gsap.to(horizontalContent, {
          x: getScrollAmount,
          ease: "none"
        });

        ScrollTrigger.create({
          trigger: horizontalSection,
          start: "top top",
          end: () => `+=${getScrollAmount() * -1}`,
          pin: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true
        });
      }
      
      // Refresh ScrollTrigger after a short delay to account for any layout shifts
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative bg-wff-dark min-h-screen overflow-hidden">
      
      {/* 1. Hero */}
      <Hero />

      {/* 2. Sponsors Strip */}
      <section className="py-8 border-y border-white/10 bg-[#050505] overflow-hidden relative z-10">
        <div className="flex space-x-16 animate-[marquee_20s_linear_infinite] whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity duration-500">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="inline-block font-bebas text-3xl text-white/40">
              OFFICIAL SPONSOR {i}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Federation / About */}
      <section className="py-32 relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="reveal-target">
              <h2 className="font-bebas text-6xl md:text-8xl text-wff-gold mb-6">THE FEDERATION</h2>
              <p className="font-sans text-lg text-white/70 leading-relaxed mb-8">
                World Fitness Federation (WFF) Ghana is the premier destination for aesthetic and athletic excellence. We are bringing the global standard of bodybuilding and fitness modeling to the heart of West Africa.
              </p>
              <Link href="/federation" className="inline-block border border-wff-gold text-wff-gold font-sans text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-wff-gold hover:text-black transition-colors">
                Discover Our Legacy
              </Link>
            </div>
            <div className="reveal-target relative aspect-square border border-white/10 flex items-center justify-center bg-[#0A0A0A]">
              <span className="font-bebas text-4xl text-white/20">[Ghana Map Draw Animation Here]</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Horizontal Scroll Strip */}
      <section className="horizontal-scroll-container h-screen bg-[#050505] flex items-center overflow-hidden border-y border-white/10">
        <div className="horizontal-scroll-content flex space-x-32 px-[10vw] items-center h-full w-max">
          {['GHANA', 'TRAINING', 'QUALIFIER', 'CHAMPIONSHIP', 'GLORY'].map((word, idx) => (
            <div key={idx} className="flex-shrink-0 flex items-center justify-center w-[80vw] h-[60vh] border border-white/5 bg-[#0A0A0A] relative overflow-hidden group">
              <div className="absolute inset-0 bg-wff-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <h2 className="font-bebas text-[15vw] leading-none text-white/10 group-hover:text-white transition-colors duration-700">{word}</h2>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Championship Feature */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <FireTunnel />
          </Canvas>
        </div>
        <div className="relative z-10 text-center reveal-target bg-black/40 p-12 backdrop-blur-sm border border-white/10">
          <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.5em] text-sm mb-4">Sept 26, 2026 • Accra</p>
          <h2 className="font-bebas text-7xl md:text-9xl text-white mb-8">THE CHAMPIONSHIP</h2>
          <Link href="/championship" className="inline-block bg-wff-red text-white font-bebas text-2xl px-12 py-4 hover:bg-white hover:text-wff-red transition-colors">
            GET TICKETS
          </Link>
        </div>
      </section>

      {/* 6. Athletes */}
      <section className="py-32 relative bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ParticleSilhouette />
          </Canvas>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 reveal-target">
            <h2 className="font-bebas text-6xl md:text-8xl text-white">TEAM <span className="text-wff-red">GHANA</span></h2>
            <p className="font-sans text-white/50 uppercase tracking-widest mt-4">The Elite Roster</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="reveal-target aspect-[3/4] bg-[#111] border border-white/10 relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 z-10"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="font-sans text-wff-gold font-bold uppercase tracking-widest text-xs mb-2">Pro Division</p>
                  <h3 className="font-bebas text-4xl text-white">ATHLETE {i}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16 reveal-target">
            <Link href="/athletes" className="inline-block border border-white/20 text-white font-sans text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-black transition-colors">
              View Full Roster
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Wellness */}
      <section className="py-40 bg-[#001414] relative overflow-hidden border-y border-teal-900/30">
        <div className="container mx-auto px-6 text-center reveal-target">
          <p className="font-sans text-teal-500 font-bold uppercase tracking-[0.5em] text-sm mb-6">Recovery & Balance</p>
          <h2 className="font-bebas text-6xl md:text-8xl text-white mb-8">WELLNESS</h2>
          <p className="font-sans text-lg text-white/60 max-w-2xl mx-auto mb-12">
            True strength is built in the moments of rest. Explore our wellness programs, recovery techniques, and mindfulness practices designed for elite competitors.
          </p>
          <Link href="/wellness" className="inline-block border border-teal-500 text-teal-500 font-sans text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-teal-500 hover:text-black transition-colors">
            Explore Wellness
          </Link>
        </div>
      </section>

      {/* 8. Gallery / Media */}
      <section className="py-32 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16 reveal-target">
            <h2 className="font-bebas text-6xl md:text-8xl text-white">MEDIA</h2>
            <Link href="/media" className="hidden md:inline-block font-sans text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
              View All Media →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`reveal-target bg-[#111] border border-white/10 ${i === 1 || i === 4 ? 'aspect-square' : 'aspect-[3/4]'} hover:border-wff-red transition-colors cursor-pointer`}></div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. News & Updates */}
      <section className="py-32 bg-wff-dark">
        <div className="container mx-auto px-6">
          <h2 className="font-bebas text-6xl md:text-8xl text-white mb-16 text-center reveal-target">LATEST <span className="text-wff-gold">NEWS</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="reveal-target bg-[#0A0A0A] border border-white/10 p-8 hover:-translate-y-2 transition-transform duration-500">
                <p className="font-sans text-wff-red text-xs font-bold uppercase tracking-widest mb-4">Oct 12, 2025</p>
                <h3 className="font-bebas text-3xl text-white mb-4">ROAD TO THE CHAMPIONSHIP: QUALIFIERS ANNOUNCED</h3>
                <p className="font-sans text-sm text-white/60 mb-6 line-clamp-3">
                  The official dates and locations for the regional qualifiers have been released. Athletes across the continent are gearing up...
                </p>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-wff-gold">Read More →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Partnerships */}
      <section className="py-32 bg-[#050505] border-t border-white/10">
        <div className="container mx-auto px-6 text-center reveal-target">
          <h2 className="font-bebas text-6xl md:text-8xl text-white mb-8">PARTNERSHIPS</h2>
          <p className="font-sans text-lg text-white/60 max-w-2xl mx-auto mb-12">
            Align your brand with the pinnacle of African fitness. Discover our sponsorship tiers and corporate partnership opportunities.
          </p>
          <Link href="/partnerships" className="inline-block border border-white/20 text-white font-sans text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-black transition-colors">
            Partner With Us
          </Link>
        </div>
      </section>

      {/* 11. Contact / Register CTA */}
      <section className="py-40 bg-wff-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-wff-red/10"></div>
        <div className="container mx-auto px-6 text-center relative z-10 reveal-target">
          <h2 className="font-bebas text-7xl md:text-[10rem] text-white leading-none mb-8">READY FOR <br/><span className="text-wff-red">GLORY?</span></h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/contact" className="bg-wff-red text-white font-bebas text-3xl px-16 py-6 hover:bg-white hover:text-wff-red transition-colors w-full md:w-auto">
              REGISTER NOW
            </Link>
            <Link href="/contact" className="border border-white/20 text-white font-bebas text-3xl px-16 py-6 hover:bg-white hover:text-black transition-colors w-full md:w-auto">
              CONTACT US
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
