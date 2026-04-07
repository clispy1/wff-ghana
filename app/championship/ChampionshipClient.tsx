'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { MapPin, Calendar, Clock, Ticket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ChampionshipClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      if (detailsRef.current) {
        gsap.fromTo(detailsRef.current.children,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: detailsRef.current,
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
        <div ref={headerRef} className="max-w-5xl mx-auto text-center mb-20 opacity-0">
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">THE ULTIMATE <span className="text-wff-red">SHOWDOWN</span></h1>
          <p className="font-sans text-xl text-white/70">
            On September 26th, 2026, the greatest physiques from across the continent will converge in Accra. This is where legends are born.
          </p>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div className="relative aspect-video lg:aspect-square bg-[#111] border border-white/10 overflow-hidden">
            <Image 
              src="https://picsum.photos/seed/accra-venue/1000/1000" 
              alt="Accra Venue"
              fill
              className="object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wff-dark via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="font-bebas text-4xl mb-2">ACCRA INTERNATIONAL CONFERENCE CENTRE</h3>
              <p className="font-sans text-white/80 flex items-center"><MapPin className="mr-2 text-wff-red" size={18}/> Castle Rd, Accra, Ghana</p>
            </div>
          </div>

          <div ref={detailsRef} className="flex flex-col justify-center space-y-12">
            <div>
              <h4 className="font-bebas text-3xl text-wff-gold mb-4 flex items-center"><Calendar className="mr-3" /> SCHEDULE OF EVENTS</h4>
              <ul className="space-y-4 font-sans text-white/80">
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span>Athlete Registration & Weigh-in</span>
                  <span className="font-bold">Sept 24, 09:00 AM</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span>Pre-Judging (All Categories)</span>
                  <span className="font-bold">Sept 25, 10:00 AM</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-wff-red font-bold">Main Event & Finals</span>
                  <span className="text-wff-red font-bold">Sept 26, 06:00 PM</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bebas text-3xl text-wff-gold mb-4 flex items-center"><Ticket className="mr-3" /> TICKETING</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#111] border border-white/10 p-6 hover:border-wff-red transition-colors cursor-pointer group">
                  <h5 className="font-bebas text-2xl mb-1">GENERAL ADMISSION</h5>
                  <p className="font-sans text-wff-gold font-bold mb-4">₵ 150.00</p>
                  <button className="font-sans text-sm uppercase tracking-widest text-white/50 group-hover:text-wff-red transition-colors">Buy Now →</button>
                </div>
                <div className="bg-wff-red text-white p-6 hover:bg-white hover:text-wff-dark transition-colors cursor-pointer group">
                  <h5 className="font-bebas text-2xl mb-1">VIP BACKSTAGE PASS</h5>
                  <p className="font-sans font-bold mb-4">₵ 800.00</p>
                  <button className="font-sans text-sm uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">Buy Now →</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
