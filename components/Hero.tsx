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
  const logoRef = useRef<HTMLDivElement>(null);
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
      const parts = Array.from(headlineRef.current.querySelectorAll('.hero-text-part'));
      tl.fromTo(parts, 
        { y: 50, opacity: 0, rotateX: 20 },
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0,
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
    <section ref={containerRef} className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center bg-black pt-20">
      
      {/* Dramatic Background Image */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 bg-[url('/hero-bg.jpeg')] bg-cover bg-center bg-no-repeat opacity-50 mix-blend-luminosity"
      ></div>

      {/* Heavy Vignette/Gradient Overlay for text legibility */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#050505]/90 via-black/50 to-[#050505]"></div>
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-90"></div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center text-center pb-10">
        
        {/* Header Area with Logo */}
        <div ref={logoRef} className="flex flex-col items-center mb-8 perspective-1000">
          <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4 drop-shadow-[0_0_20px_rgba(206,17,38,0.4)]">
            <Image 
              src="/wff-ghana-logo.svg" 
              alt="WFF Ghana Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-wff-gold font-sans font-bold uppercase tracking-[0.6em] text-[10px] md:text-sm">Ghana Meets Africa</span>
        </div>

        <h1 ref={headlineRef} className="font-bebas flex flex-col items-center justify-center leading-[0.8] mb-12 w-full uppercase select-none">
          {/* Main Title Lockup */}
          <div className="flex flex-col items-center w-full max-w-[1400px] mx-auto perspective-1000">
             <span className="hero-text-part block text-[15vw] md:text-[14vw] xl:text-[12rem] text-white tracking-normal drop-shadow-2xl">
              ALL AFRICA
             </span>
             <span 
               className="hero-text-part block text-[18vw] md:text-[16vw] xl:text-[14rem] text-transparent tracking-tight -mt-[2vw] md:-mt-[1.5rem]"
               style={{ WebkitTextStroke: '2px rgba(255,255,255,0.7)' }}
             >
              BODYBUILDING
             </span>
             <div className="flex items-center justify-center gap-4 md:gap-8 w-full -mt-[2vw] md:-mt-[1.5rem]">
                <span className="hero-text-part block text-[13vw] md:text-[12vw] xl:text-[10rem] text-wff-red tracking-wide drop-shadow-[0_0_30px_rgba(206,17,38,0.5)]">
                 CHAMPIONSHIP
                </span>
                <span className="hero-text-part block text-[13vw] md:text-[12vw] xl:text-[10rem] text-white/90 tracking-wide">
                 2026
                </span>
             </div>
          </div>
        </h1>

        {/* Sleek Countdown */}
        <div ref={timerRef} className="flex flex-col items-center mb-12">
          <div className="flex space-x-6 md:space-x-12 border border-white/10 bg-black/30 py-4 px-8 backdrop-blur-md rounded-xl">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HRS', value: timeLeft.hours },
              { label: 'MIN', value: timeLeft.minutes },
              { label: 'SEC', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={item.label} className="flex flex-col items-center min-w-[3rem] md:min-w-[4rem]">
                <span className="font-bebas text-4xl md:text-6xl text-white">
                  {item.value.toString().padStart(2, '0')}
                </span>
                <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-wff-gold mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto">
          <Link href="/championship" className="group relative w-full sm:w-auto bg-wff-red text-white font-bebas text-2xl px-12 py-3 rounded overflow-hidden">
            <span className="relative z-10">BUY TICKETS</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
            <span className="absolute inset-0 flex items-center justify-center text-wff-red font-bebas text-2xl z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">BUY TICKETS</span>
          </Link>
          <Link href="/athletes" className="w-full sm:w-auto border border-white/20 bg-transparent text-white font-bebas text-2xl px-12 py-3 rounded hover:bg-white/10 transition-colors">
            REGISTER
          </Link>
        </div>

      </div>
    </section>
  );
}
