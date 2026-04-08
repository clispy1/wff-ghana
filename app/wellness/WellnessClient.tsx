'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Activity, Brain, Users, Play } from 'lucide-react';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import WaterRipple from '@/components/WaterRipple';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: <Activity size={32} />,
    title: 'Physical Conditioning',
    desc: 'Expert-led training programs designed for all levels, from beginners to elite athletes.'
  },
  {
    icon: <Heart size={32} />,
    title: 'Nutrition & Health',
    desc: 'Holistic dietary guidance focusing on sustainable wellness and peak performance.'
  },
  {
    icon: <Brain size={32} />,
    title: 'Mental Resilience',
    desc: 'Building the mindset required to conquer challenges both in the gym and in life.'
  },
  {
    icon: <Users size={32} />,
    title: 'Community Support',
    desc: 'Join a nationwide network of fitness enthusiasts dedicated to uplifting one another.'
  }
];

export default function WellnessClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Color Shift (Act 2 - Relaxed/Teal)
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => gsap.to(document.documentElement, { '--bg-color': '#001414', duration: 1.5 }), // Deep teal
        onLeaveBack: () => gsap.to(document.documentElement, { '--bg-color': '#050505', duration: 1.5 }),
        onLeave: () => gsap.to(document.documentElement, { '--bg-color': '#050505', duration: 1.5 }),
        onEnterBack: () => gsap.to(document.documentElement, { '--bg-color': '#001414', duration: 1.5 }),
      });

      // Slow, soft header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 2, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%'
          }
        }
      );

      // Slow cards animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.wellness-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            stagger: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // Slow video teaser reveal
      if (videoRef.current) {
        gsap.fromTo(videoRef.current,
          { opacity: 0, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: videoRef.current,
              start: 'top 70%',
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="pt-32 pb-24 min-h-screen relative overflow-hidden">
      
      {/* 3D Water Ripple Background */}
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <WaterRipple />
        </Canvas>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20 max-w-3xl mx-auto opacity-0">
          <p className="font-sans text-[#00A86B] font-bold uppercase tracking-[0.3em] mb-4">Holistic Health</p>
          <h1 className="font-bebas text-6xl md:text-8xl mb-6 text-white">BREATHE. <span className="text-[#00A86B]">RECOVER.</span></h1>
          <p className="font-sans text-white/70 text-lg leading-relaxed">
            True strength is found in balance. WFF Ghana is committed to elevating the overall health and wellness of the nation through mindful recovery and sustainable nutrition.
          </p>
        </div>

        {/* Video Vault Teaser */}
        <div ref={videoRef} className="relative aspect-video max-w-5xl mx-auto bg-[#001A1A] border border-[#00A86B]/20 mb-24 group cursor-pointer overflow-hidden opacity-0 rounded-sm">
          <Image 
            src="https://picsum.photos/seed/training-video/1200/600" 
            alt="Training Video"
            fill
            className="object-cover opacity-40 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001414] via-transparent to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-[#00A86B]/50 flex items-center justify-center text-[#00A86B] group-hover:bg-[#00A86B] group-hover:text-[#001414] transition-colors duration-700">
              <Play size={32} className="ml-2" />
            </div>
          </div>
          <div className="absolute bottom-8 left-8">
            <h3 className="font-bebas text-3xl text-white">MASTERCLASS: ACTIVE RECOVERY</h3>
            <p className="font-sans text-sm text-[#00A86B]">Featuring Head Coach Kwame Mensah</p>
          </div>
        </div>

        {/* Pillars */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              className="wellness-card bg-[#001A1A]/50 backdrop-blur-sm border border-[#00A86B]/10 p-8 hover:border-[#00A86B]/40 transition-colors duration-700 group text-center flex flex-col items-center rounded-sm"
            >
              <div className="w-16 h-16 rounded-full bg-[#00A86B]/10 flex items-center justify-center text-[#00A86B] mb-6 group-hover:scale-105 transition-transform duration-700">
                {pillar.icon}
              </div>
              <h3 className="font-bebas text-2xl mb-4 text-white group-hover:text-[#00A86B] transition-colors duration-700">{pillar.title}</h3>
              <p className="font-sans text-sm text-white/50 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="border border-[#00A86B]/50 text-[#00A86B] font-bebas text-xl px-10 py-4 hover:bg-[#00A86B] hover:text-[#001414] transition-colors duration-700">
            JOIN OUR COMMUNITY
          </button>
        </div>
      </div>
    </main>
  );
}
