'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, Globe2, Users, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: <Globe2 size={40} />, value: '40+', label: 'Participating Nations' },
  { icon: <Users size={40} />, value: '10,000+', label: 'Expected Attendees' },
  { icon: <BarChart3 size={40} />, value: '5M+', label: 'Digital Reach' },
  { icon: <Trophy size={40} />, value: '500+', label: 'Elite Athletes' },
];

const tiers = [
  {
    name: 'Title Sponsor',
    price: 'Custom',
    color: 'border-wff-gold text-wff-gold',
    benefits: [
      'Naming rights to the 2026 Championship',
      'Prime logo placement on all stages and media',
      'VIP Boardroom access during the event',
      'Dedicated digital marketing campaigns',
      'Exhibition booth in premium location'
    ]
  },
  {
    name: 'Gold Partner',
    price: '₵ 250,000',
    color: 'border-white text-white',
    benefits: [
      'Secondary logo placement on main stage',
      '10 VIP Tickets',
      'Social media mentions (10x)',
      'Exhibition booth'
    ]
  },
  {
    name: 'Silver Partner',
    price: '₵ 100,000',
    color: 'border-white/50 text-white/80',
    benefits: [
      'Logo on sponsor wall',
      '5 VIP Tickets',
      'Social media mentions (5x)',
      'Shared exhibition space'
    ]
  }
];

export default function PartnershipsClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tiersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      // Stats animation
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.children,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // Tiers animation
      if (tiersRef.current) {
        gsap.fromTo(tiersRef.current.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: tiersRef.current,
              start: 'top 70%',
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
          <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.3em] mb-4">Corporate Partnerships</p>
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">ALIGN WITH <span className="text-wff-red">EXCELLENCE</span></h1>
          <p className="font-sans text-lg text-white/70 leading-relaxed">
            The 2026 All Africa Championship is more than a sporting event; it is a cultural phenomenon. Partnering with WFF Ghana positions your brand at the forefront of health, discipline, and continental unity.
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#111] border border-white/10 p-8 text-center flex flex-col items-center justify-center">
              <div className="text-wff-red mb-4">{stat.icon}</div>
              <div className="font-bebas text-5xl text-white mb-2">{stat.value}</div>
              <div className="font-sans text-sm uppercase tracking-widest text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tiers */}
        <div className="mb-16 text-center">
          <h2 className="font-bebas text-5xl mb-12">SPONSORSHIP PACKAGES</h2>
          <div ref={tiersRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {tiers.map((tier, idx) => (
              <div key={idx} className={`bg-[#0A0A0A] border ${tier.color} p-10 flex flex-col relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-5 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500"></div>
                <h3 className="font-bebas text-3xl mb-2">{tier.name}</h3>
                <div className="font-sans font-bold text-xl mb-8">{tier.price}</div>
                <ul className="space-y-4 mb-12 flex-grow">
                  {tier.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} className="font-sans text-sm text-white/70 flex items-start">
                      <span className="text-current mr-3 mt-1">▹</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 font-bebas text-xl border ${tier.color} hover:bg-white hover:text-wff-dark transition-colors`}>
                  REQUEST DECK
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
