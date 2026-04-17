'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    // GSAP Animations
    const tl = gsap.timeline({ delay: 2.5 }); // Wait for loader

    // Slow zoom on background
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        scale: 1.1,
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true
      });
    }

    // Logo Reveal
    if (logoRef.current) {
      tl.fromTo(logoRef.current,
        { y: -30, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' }
      );
    }

    // Cinematic Headline Reveal
    if (headlineRef.current?.children) {
      const words = Array.from(headlineRef.current.children);
      tl.fromTo(words, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.15, 
          ease: 'power3.out',
        },
        '-=0.5'
      );
    }

    // Timer Reveal
    tl.fromTo(timerRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.8'
    );

    // CTAs Reveal
    if (ctaRef.current?.children) {
      const ctas = Array.from(ctaRef.current.children);
      tl.fromTo(ctas,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.4'
      );
    }

    // Parallax effect on scroll
    if (containerRef.current && headlineRef.current && logoRef.current) {
      gsap.to([headlineRef.current, logoRef.current], {
        y: '30vh',
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

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
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      
      {/* Dramatic Background Image (Placeholder until real assets arrive) */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-40"
      ></div>

      {/* Heavy Vignette/Gradient Overlay for text legibility */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/80 via-black/40 to-[#050505]"></div>
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center mt-12">
        
        {/* Logo */}
        <div ref={logoRef} className="relative w-32 h-32 md:w-48 md:h-48 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <Image 
            src="/wff-ghana-logo.svg" 
            alt="WFF Ghana Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 ref={headlineRef} className="font-bebas flex flex-col items-center justify-center leading-[0.85] mb-12 w-full">
          <span className="block text-wff-gold font-sans font-bold uppercase tracking-[0.5em] text-sm md:text-base mb-6">WFF Ghana Presents</span>
          
          {/* Massive Outline Text */}
          <span 
            className="block text-[15vw] md:text-[12vw] text-transparent tracking-tighter w-full"
            style={{ WebkitTextStroke: '2px rgba(255,255,255,0.8)' }}
          >
            ALL AFRICA
          </span>
          
          {/* Massive Solid Text */}
          <span className="block text-[15vw] md:text-[12vw] text-white tracking-tighter drop-shadow-2xl w-full">
            CHAMPIONSHIP
          </span>
        </h1>

        {/* Sleek Countdown */}
        <div ref={timerRef} className="flex flex-col items-center mb-10">
          <p className="font-sans text-white/50 uppercase tracking-[0.3em] text-xs mb-4">Countdown to Glory</p>
          <div className="flex space-x-6 md:space-x-12 border-t border-b border-white/10 py-6 px-8 backdrop-blur-sm">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HRS', value: timeLeft.hours },
              { label: 'MIN', value: timeLeft.minutes },
              { label: 'SEC', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={item.label} className="flex flex-col items-center">
                <span className="font-bebas text-5xl md:text-7xl text-wff-red">
                  {item.value.toString().padStart(2, '0')}
                </span>
                <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Link href="/championship" className="w-full sm:w-auto bg-wff-red text-white font-bebas text-2xl px-10 py-4 rounded-md hover:bg-white hover:text-wff-red transition-colors text-center">
            BUY TICKETS
          </Link>
          <Link href="/athletes" className="w-full sm:w-auto border border-white/20 bg-black/40 backdrop-blur-sm text-white font-bebas text-2xl px-10 py-4 rounded-md hover:bg-white hover:text-black transition-colors text-center">
            REGISTER TO COMPETE
          </Link>
        </div>

      </div>
    </section>
  );
}
