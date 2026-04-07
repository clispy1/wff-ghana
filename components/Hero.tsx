'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import MeshGradient from '@/components/MeshGradient';
import Link from 'next/link';

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // GSAP Animations
    const tl = gsap.timeline({ delay: 2.5 }); // Wait for loader

    if (headlineRef.current?.children) {
      tl.fromTo(headlineRef.current.children, 
        { y: 100, opacity: 0, scale: 1.2 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }
      );
    }

    tl.fromTo(subRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo(timerRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo(ctaRef.current?.children || [],
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );

    // Countdown Logic - Sept 26, 2026
    const targetDate = new Date('2026-09-26T00:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) return;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-wff-dark flex items-center justify-center">
      <MeshGradient />

      {/* Overlay Gradient for contrast */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-wff-dark/50 via-wff-dark/20 to-wff-dark"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center mt-16">
        <p ref={subRef} className="font-sans text-wff-gold font-bold text-sm md:text-lg mb-4 uppercase tracking-[0.3em] opacity-0">
          WFF Ghana Presents
        </p>
        
        <h1 ref={headlineRef} className="font-bebas text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] tracking-tight mb-8 overflow-hidden flex flex-col items-center">
          <span className="block text-transparent text-stroke-gold">2026 ALL AFRICA</span>
          <span className="block text-white">CHAMPIONSHIP</span>
        </h1>

        <div className="bg-wff-gold text-wff-black font-bebas text-2xl md:text-4xl px-8 py-2 mb-12 transform -skew-x-12">
          <span className="block transform skew-x-12">GHANA MEETS AFRICA</span>
        </div>

        {/* Countdown */}
        <div ref={timerRef} className="flex space-x-6 md:space-x-12 mb-12 opacity-0">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <span className="font-bebas text-5xl md:text-7xl text-white drop-shadow-lg">{item.value.toString().padStart(2, '0')}</span>
              <span className="font-sans text-xs md:text-sm uppercase tracking-widest text-wff-gold font-bold">{item.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 opacity-0">
          <Link 
            href="/championship"
            className="bg-wff-red text-white font-bebas text-2xl px-10 py-4 tracking-wider hover:bg-white hover:text-wff-red transition-colors duration-300"
          >
            EVENT DETAILS
          </Link>
          <Link 
            href="/athletes"
            className="border border-wff-gold text-wff-gold font-bebas text-2xl px-10 py-4 tracking-wider hover:bg-wff-gold hover:text-wff-black transition-all duration-300"
          >
            REGISTER TO COMPETE
          </Link>
          <button 
            className="border border-white/20 text-white/80 font-bebas text-2xl px-10 py-4 tracking-wider hover:border-white hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-wff-red animate-pulse"></span>
            WATCH LIVE PPV
          </button>
        </div>
      </div>
    </section>
  );
}
