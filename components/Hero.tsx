'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Activity, 
  Users, 
  ShieldCheck, 
  Award, 
  Clock 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Correct Competition Divisions & Benefits for WFF Official Rulebook
export interface FeatureHighlight {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  accentColor: string;
}

export const HERO_CONTENT = {
  ticker: {
    title: "WORLD FITNESS FEDERATION GHANA OFFICIAL LAUNCH",
    venue: "UPSA AUDITORIUM, ACCRA",
    badge: "INAUGURAL PRO-AM CUP"
  },
  tagline: "BUILDING THE FUTURE OF NATURAL AESTHETICS",
  title: {
    line1: "ALL AFRICA",
    line2: "BODYBUILDING",
    line3: "CHAMPIONSHIP",
    year: "2026"
  },
  details: [
    {
      id: "host",
      label: "HOST CHAPTER",
      value: "Accra, Ghana",
      icon: MapPin,
      iconColor: "text-wff-gold"
    },
    {
      id: "date",
      label: "UPCOMING CUP",
      value: "Sept 26, 2026",
      icon: Calendar,
      iconColor: "text-wff-red"
    },
    {
      id: "status",
      label: "ACCREDITATION",
      value: "WFF Authorized",
      icon: Award,
      iconColor: "text-wff-green"
    }
  ],
  highlights: [
    {
      id: 'pro-status',
      title: 'Global Pro Status',
      subtitle: 'PRO CARDS TO BE WON',
      detail: 'Overall class champions in the upcoming championship secure a certified global WFF Pro Card, unlocking prestigious international stages.',
      accentColor: 'border-wff-gold text-wff-gold bg-wff-gold/5'
    },
    {
      id: 'prizes',
      title: 'Aesthetic Platform',
      subtitle: 'CHAPTER SUPPORT & DEALS',
      detail: 'Founding class winners secure national sponsorships, brand ambassadorships, and official support for continental representations.',
      accentColor: 'border-wff-red text-wff-red bg-wff-red/5'
    },
    {
      id: 'judging',
      title: 'Uncompromised Integrity',
      subtitle: 'OFFICIAL WFF SCORING',
      detail: 'Scored by an accredited panel using correct WFF International rules, focusing strictly on muscle symmetry, density, and stage carriage.',
      accentColor: 'border-white text-white bg-white/5'
    }
  ] as FeatureHighlight[],
  stats: {
    athleteLabel: "LAUNCH RESERVATIONS",
    athleteValue: "Open for Entries",
    classLabel: "COMPETITION CLASSES",
    classValue: "4 Major Categories",
    weighInLabel: "WEIGH-IN SELECTION",
    weighInValue: "Sept 25, 2026"
  },
  ctas: {
    passes: { text: "SECURE PASSES", href: "/championship#tickets" },
    portal: { text: "ATHLETE PORTAL", href: "/championship#portal" }
  },
  disclaimer: "★ DECLARED UNDER THE WORLD FITNESS FEDERATION INTERNATIONAL CHARTER"
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titlePart1Ref = useRef<HTMLSpanElement>(null);
  const titlePart2Ref = useRef<HTMLSpanElement>(null);
  const titlePart3Ref = useRef<HTMLSpanElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const [activeHighlight, setActiveHighlight] = useState<string>('pro-status');
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    // GSAP Timeline Entry Animation
    const tl = gsap.timeline({ delay: 1.2 }); // Wait for standard loader if present

    // Slowly scale background over infinity
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        scale: 1.15,
        duration: 25,
        ease: 'none',
        repeat: -1,
        yoyo: true
      });
    }

    // Top banner entry
    if (bannerRef.current) {
      tl.fromTo(bannerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }

    // Left Column reveals (kinetic typography)
    if (leftColRef.current) {
      const items = leftColRef.current.querySelectorAll('.animate-entrance');
      tl.fromTo(items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' },
        '-=0.4'
      );
    }

    // Right glassmorphic card entrance
    if (rightColRef.current) {
      tl.fromTo(rightColRef.current,
        { scale: 0.95, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.8'
      );
    }

    // Gentle parallax scrolling for left side elements
    if (containerRef.current && leftColRef.current) {
      gsap.to(leftColRef.current, {
        y: '15vh',
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    // Countdown Logic - September 26, 2026
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
    <section 
      ref={containerRef} 
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center bg-black pt-28 pb-16 lg:pb-8"
      id="hero-section"
    >
      
      {/* 1. Dramatic Textured Backdrop */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 bg-[url('/hero-bg.jpeg')] bg-cover bg-center bg-no-repeat opacity-[0.45] mix-blend-luminosity"
      ></div>

      {/* 2. Layered Premium Gradient Vignettes (Ghana Colors glow subtly in the dark) */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#050505]/95 via-black/45 to-[#050505]"></div>
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_65%_45%,rgba(206,17,38,0.12)_0%,rgba(252,209,22,0.06)_40%,rgba(0,107,63,0.04)_70%,transparent_100%)]"></div>
      
      {/* Fine technical background grid lines */}
      <div className="absolute inset-0 z-1 opacity-10 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* 3. Outer Frame Ghana-Colored Ribbons (Subtle elegant border) */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-2 flex">
        <div className="h-full flex-grow bg-wff-red"></div>
        <div className="h-full flex-grow bg-wff-gold"></div>
        <div className="h-full flex-grow bg-wff-green"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10 w-full h-full flex flex-col justify-between">
        
        {/* Top Mini-Banner Ticker (Technical Metadata) */}
        <div 
          ref={bannerRef} 
          className="w-full flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6 opacity-0"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-wff-green animate-pulse"></span>
            <span className="font-sans font-extrabold text-[9px] md:text-xs uppercase tracking-[0.25em] text-white/50">
              {HERO_CONTENT.ticker.title}
            </span>
          </div>
          <div className="flex items-center gap-6 font-sans text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-mono">
            <span>{HERO_CONTENT.ticker.venue}</span>
            <span>•</span>
            <span className="text-wff-gold font-bold">{HERO_CONTENT.ticker.badge}</span>
          </div>
        </div>

        {/* Main Bento Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full mt-4">
          
          {/* LEFT COLUMN: Large Kinetic Typography and Interactive Highlight Switcher */}
          <div ref={leftColRef} className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8">
            
            {/* Superhead Tagline */}
            <div className="animate-entrance inline-flex items-center gap-2 px-3 py-1 bg-wff-red/10 border border-wff-red/20 rounded-full w-max">
              <Trophy size={14} className="text-wff-red" />
              <span className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-white">
                {HERO_CONTENT.tagline}
              </span>
            </div>

            {/* Huge Display Title */}
            <h1 className="font-bebas flex flex-col leading-[0.80] uppercase select-none">
              <span ref={titlePart1Ref} className="animate-entrance block text-[13vw] md:text-[8vw] xl:text-[7.5rem] text-white tracking-tight">
                {HERO_CONTENT.title.line1}
              </span>
              <span 
                ref={titlePart2Ref} 
                className="animate-entrance block text-[15vw] md:text-[9.5vw] xl:text-[9rem] text-transparent tracking-tighter"
                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.7)' }}
              >
                {HERO_CONTENT.title.line2}
              </span>
              <div className="animate-entrance flex items-center flex-wrap gap-x-4 md:gap-x-6">
                <span ref={titlePart3Ref} className="block text-[11vw] md:text-[7.5vw] xl:text-[7rem] text-wff-red tracking-wide drop-shadow-[0_0_25px_rgba(206,17,38,0.4)]">
                  {HERO_CONTENT.title.line3}
                </span>
                <span className="block text-[11vw] md:text-[7.5vw] xl:text-[7rem] text-white/80 font-outline">
                  {HERO_CONTENT.title.year}
                </span>
              </div>
            </h1>

            {/* Core Location/Date Information Pills */}
            <div className="animate-entrance grid grid-cols-1 sm:grid-cols-3 gap-3 border-y border-white/5 py-4 w-full">
              {HERO_CONTENT.details.map((detail) => {
                const IconComponent = detail.icon;
                return (
                  <div key={detail.id} className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white/5 ${detail.iconColor}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="font-sans">
                      <span className="block text-[9px] uppercase tracking-widest text-white/40 font-bold">{detail.label}</span>
                      <span className="text-white text-xs font-extrabold uppercase">{detail.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Highlights Bento Panel */}
            <div className="animate-entrance bg-[#070707]/90 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <span className="font-sans text-[10px] font-black uppercase tracking-widest text-wff-gold flex items-center gap-2">
                  <Activity size={14} className="animate-pulse" /> INAUGURAL PLATFORM VALUES
                </span>
                <span className="font-sans text-[9px] text-white/30 uppercase tracking-wider font-mono">
                  SELECT ACCENT TO VIEW DETAILS
                </span>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {HERO_CONTENT.highlights.map((hl) => (
                  <button
                    key={hl.id}
                    onClick={() => setActiveHighlight(hl.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                      activeHighlight === hl.id
                        ? hl.accentColor + ' shadow-[0_5px_15px_rgba(0,0,0,0.4)] scale-[1.03]'
                        : 'border-white/5 hover:border-white/20 bg-black/40 text-white/40 hover:text-white/80'
                    }`}
                  >
                    <span className="font-bebas text-sm md:text-base leading-none block mb-0.5">{hl.title}</span>
                    <span className="font-sans text-[8px] tracking-wider font-bold block opacity-70">{hl.subtitle}</span>
                  </button>
                ))}
              </div>

              {/* Display Content info */}
              <div className="min-h-[50px] transition-all duration-300">
                {HERO_CONTENT.highlights.map((hl) => {
                  if (activeHighlight !== hl.id) return null;
                  return (
                    <p key={hl.id} className="font-sans text-xs text-white/60 leading-relaxed animate-fade-in">
                      {hl.detail}
                    </p>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Glassmorphic Core Desk & Digital Countdown */}
          <div ref={rightColRef} className="lg:col-span-5 flex flex-col justify-center opacity-0">
            
            <div className="relative w-full bg-black/55 hover:bg-black/70 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-colors duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-wff-red/10 rounded-full blur-[40px] pointer-events-none"></div>
              
              {/* Event Officiating Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 relative flex-shrink-0">
                    <Image 
                      src="/wff-ghana-logo.svg" 
                      alt="WFF" 
                      fill 
                      className="object-contain" 
                      priority
                    />
                  </div>
                  <div>
                    <h3 className="font-bebas text-lg text-white leading-none tracking-wide">OFFICIAL COUNTDOWN</h3>
                    <span className="font-sans text-[9px] uppercase tracking-widest text-wff-gold font-bold">STATE ATHLETE ENTRY</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg">
                  <span className="font-mono text-[9px] tracking-widest text-[#00A86B] font-bold uppercase animate-pulse">
                    ● BOOKINGS ACTIVE
                  </span>
                </div>
              </div>

              {/* Sports-Tech Countdown Ticker */}
              <div className="mb-8">
                <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-white/40 block mb-3 font-semibold">
                  INAUGURAL SHOWDOWN TIMER
                </span>
                
                <div className="grid grid-cols-4 gap-3 bg-black/60 p-4 rounded-2xl border border-white/5">
                  {[
                    { label: 'DAYS REMAINING', value: timeLeft.days, color: 'text-white' },
                    { label: 'HOURS ACTIVE', value: timeLeft.hours, color: 'text-wff-gold' },
                    { label: 'MINUTES RUNNING', value: timeLeft.minutes, color: 'text-white' },
                    { label: 'SECONDS TOTAL', value: timeLeft.seconds, color: 'text-wff-red' },
                  ].map((unit, idx) => (
                    <div key={unit.label} className="text-center">
                      <div className={`font-bebas text-3xl md:text-5xl ${unit.color} leading-none tracking-tight mb-2 font-mono`}>
                        {unit.value.toString().padStart(2, '0')}
                      </div>
                      <div className="font-sans text-[8px] uppercase tracking-widest text-white/30 font-bold leading-normal">
                        {unit.label.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Event Ticker Metrics - Authentic Launch Info */}
              <div className="space-y-3.5 mb-8">
                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5 font-sans">
                  <span className="text-white/50 flex items-center gap-2 font-semibold">
                    <Users size={12} className="text-wff-red" /> {HERO_CONTENT.stats.athleteLabel}
                  </span>
                  <span className="text-white font-extrabold font-mono text-xs uppercase">
                    {HERO_CONTENT.stats.athleteValue}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5 font-sans">
                  <span className="text-white/50 flex items-center gap-2 font-semibold">
                    <ShieldCheck size={12} className="text-wff-gold" /> {HERO_CONTENT.stats.classLabel}
                  </span>
                  <span className="text-white font-extrabold font-mono text-xs uppercase">
                    {HERO_CONTENT.stats.classValue}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5 font-sans">
                  <span className="text-white/50 flex items-center gap-2 font-semibold">
                    <Clock size={12} className="text-wff-green" /> {HERO_CONTENT.stats.weighInLabel}
                  </span>
                  <span className="text-white font-extrabold font-mono text-xs uppercase">
                    {HERO_CONTENT.stats.weighInValue}
                  </span>
                </div>
              </div>

              {/* ACTION CALLOUT HUBS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  href={HERO_CONTENT.ctas.passes.href} 
                  className="group relative flex items-center justify-center gap-1.5 bg-wff-red text-white py-3 px-4 rounded-xl font-bebas text-xl tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_10px_20px_rgba(206,17,38,0.25)] hover:scale-103 duration-300 font-bold uppercase"
                >
                  {HERO_CONTENT.ctas.passes.text}
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link 
                  href={HERO_CONTENT.ctas.portal.href} 
                  className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:border-wff-gold text-white hover:text-wff-gold py-3 px-4 rounded-xl font-bebas text-xl tracking-widest transition-all hover:bg-white/10 duration-300 font-bold uppercase"
                >
                  {HERO_CONTENT.ctas.portal.text}
                </Link>
              </div>

            </div>

            {/* Tiny disclaimer note */}
            <div className="text-center mt-4 font-sans text-[10px] text-white/30 tracking-widest font-semibold">
              {HERO_CONTENT.disclaimer}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
