'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Activity, Brain, Users, Play } from 'lucide-react';
import Image from 'next/image';

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
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.wellness-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      if (videoRef.current) {
        gsap.fromTo(videoRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
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
    <main className="pt-32 pb-24 min-h-screen bg-wff-dark">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20 max-w-3xl mx-auto opacity-0">
          <p className="font-sans text-wff-green font-bold uppercase tracking-[0.3em] mb-4">Holistic Health</p>
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">MORE THAN <span className="text-wff-red">MUSCLE</span></h1>
          <p className="font-sans text-white/70 text-lg">
            WFF Ghana is committed to elevating the overall health and wellness of the nation. We believe fitness is a holistic journey that transforms the mind, body, and community.
          </p>
        </div>

        {/* Video Vault Teaser */}
        <div ref={videoRef} className="relative aspect-video max-w-5xl mx-auto bg-[#111] border border-white/10 mb-24 group cursor-pointer overflow-hidden opacity-0">
          <Image 
            src="https://picsum.photos/seed/training-video/1200/600" 
            alt="Training Video"
            fill
            className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-wff-red/90 flex items-center justify-center text-white group-hover:bg-white group-hover:text-wff-red transition-colors duration-300">
              <Play size={32} className="ml-2" />
            </div>
          </div>
          <div className="absolute bottom-6 left-6">
            <h3 className="font-bebas text-3xl">MASTERCLASS: PEAK CONDITIONING</h3>
            <p className="font-sans text-sm text-white/70">Featuring Head Coach Kwame Mensah</p>
          </div>
        </div>

        {/* Pillars */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              className="wellness-card bg-[#111] border border-white/10 p-8 hover:border-wff-green/50 transition-colors duration-300 group text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-wff-green/10 flex items-center justify-center text-wff-green mb-6 group-hover:scale-110 transition-transform duration-300">
                {pillar.icon}
              </div>
              <h3 className="font-bebas text-2xl mb-4 text-white group-hover:text-wff-green transition-colors">{pillar.title}</h3>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="border border-wff-green text-wff-green font-bebas text-xl px-8 py-4 hover:bg-wff-green hover:text-wff-dark transition-colors duration-300">
            JOIN OUR COMMUNITY BOOTCAMPS
          </button>
        </div>
      </div>
    </main>
  );
}
