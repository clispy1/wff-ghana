'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function InfoClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-item',
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-wff-dark pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <div ref={containerRef} className="container mx-auto px-6 relative z-10 max-w-5xl">
        <div className="reveal-item text-center mb-16">
          <h1 className="font-bebas text-6xl md:text-8xl mb-4">Event <span className="text-wff-red">Information</span></h1>
          <p className="font-sans text-xl text-white/70">Everything you need to know for the All Africa Championships.</p>
        </div>

        <div className="space-y-12">
          
          <div className="reveal-item bg-[#111] border border-white/10 rounded-xl p-8 md:p-12">
            <h2 className="font-bebas text-4xl mb-6 text-wff-gold">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              <div>
                <p className="text-white/50 text-sm uppercase tracking-widest mb-1">Venue</p>
                <p className="text-lg">UPSA Auditorium</p>
                <p className="text-white/70">Accra, Ghana</p>
              </div>
              <div>
                <p className="text-white/50 text-sm uppercase tracking-widest mb-1">Dates</p>
                <p className="text-lg">September 20-25, 2026</p>
              </div>
            </div>
          </div>

          <div className="reveal-item bg-[#111] border border-white/10 rounded-xl p-8 md:p-12">
            <h2 className="font-bebas text-4xl mb-6 text-wff-gold">Schedule & Running Order</h2>
            <div className="space-y-6">
              <div className="border-l-2 border-wff-red pl-4">
                <h3 className="text-xl font-bold mb-1">Day 1: Arrival & Registration</h3>
                <p className="text-white/70 text-sm">Official athlete weigh-in, registration, and press conference.</p>
              </div>
              <div className="border-l-2 border-wff-red pl-4">
                <h3 className="text-xl font-bold mb-1">Day 2: Pre-Judging</h3>
                <p className="text-white/70 text-sm">All Amateur Categories & Pro Qualifiers.</p>
              </div>
              <div className="border-l-2 border-wff-red pl-4">
                <h3 className="text-xl font-bold mb-1">Day 3: Main Event & Finals</h3>
                <p className="text-white/70 text-sm">Amateur Finals, Pro Divisions, and Awards Ceremony.</p>
              </div>
            </div>
          </div>

          <div className="reveal-item bg-[#111] border border-white/10 rounded-xl p-8 md:p-12">
            <h2 className="font-bebas text-4xl mb-6 text-wff-gold">Accommodation & Travel</h2>
            <div className="space-y-4">
              <p className="font-sans text-white/70">
                WFF Ghana has partnered with several top-tier hotels near the venue to provide discounted rates for athletes and officials. 
                Shuttle services will be available from Kotoka International Airport (ACC) to the official host hotels.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button className="bg-wff-red text-white font-bebas text-xl px-8 py-3 rounded hover:bg-white hover:text-black transition-colors">
                  Host Hotels List
                </button>
                <button className="border border-white/20 text-white font-bebas text-xl px-8 py-3 rounded hover:bg-white/10 transition-colors">
                  Download Info PDF
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
