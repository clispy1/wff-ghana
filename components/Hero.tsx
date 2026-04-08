'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import Globe from '@/components/Globe';
import Link from 'next/link';
import { Volume2, VolumeX } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    // Audio Setup
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      // Attempt autoplay muted
      audioRef.current.play().catch(() => console.log("Autoplay blocked"));
    }

    // GSAP Animations
    const tl = gsap.timeline({ delay: 2.5 }); // Wait for loader

    // Cinematic Headline Reveal
    if (headlineRef.current?.children) {
      const words = Array.from(headlineRef.current.children);
      tl.fromTo(words, 
        { y: 150, opacity: 0, scale: 1.5, rotationX: -90 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          rotationX: 0,
          duration: 1, 
          stagger: 0.2, 
          ease: 'power4.out',
          transformOrigin: 'bottom center'
        }
      );
    }

    // Timer Reveal
    tl.fromTo(timerRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    );

    // ScrollTrigger for Globe and Background Reset
    if (globeContainerRef.current && containerRef.current) {
      gsap.to(globeContainerRef.current, {
        scale: 0.5,
        y: '50vh',
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Reset background color when returning to Hero
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => gsap.to('body', { '--bg-color': '#0A0A0A', duration: 1 }),
        onEnterBack: () => gsap.to('body', { '--bg-color': '#0A0A0A', duration: 1 }),
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

  const toggleAudio = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Audio Element (Using a placeholder drumbeat URL) */}
      <audio ref={audioRef} loop muted src="https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3" />

      {/* Audio Toggle */}
      <button 
        onClick={toggleAudio}
        className="absolute bottom-8 right-8 z-50 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-colors"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* 3D Globe Background */}
      <div ref={globeContainerRef} className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw]">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Globe />
          </Canvas>
        </div>
      </div>

      {/* Overlay Gradient for contrast */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-wff-dark/50 to-wff-dark"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center mt-16 pointer-events-none">
        
        <h1 ref={headlineRef} className="font-bebas flex flex-col items-center justify-center leading-[0.8] mb-12" style={{ perspective: '1000px' }}>
          <span className="block text-[4rem] md:text-[6rem] lg:text-[8rem] text-wff-gold tracking-widest">2026</span>
          <span className="block text-[6rem] md:text-[10rem] lg:text-[14rem] text-white">ALL AFRICA</span>
          <span className="block text-[3rem] md:text-[5rem] lg:text-[7rem] text-transparent text-stroke-hover tracking-[0.2em]">CHAMPIONSHIP</span>
        </h1>

        {/* Dramatic Countdown */}
        <div ref={timerRef} className="flex space-x-4 md:space-x-8 opacity-0 bg-black/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-sm pointer-events-auto">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HRS', value: timeLeft.hours },
            { label: 'MIN', value: timeLeft.minutes },
            { label: 'SEC', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={item.label} className="flex flex-col items-center">
              <span className="font-mono text-4xl md:text-7xl text-wff-red font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(206,17,38,0.5)]">
                {item.value.toString().padStart(2, '0')}
              </span>
              <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 mt-2">{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
