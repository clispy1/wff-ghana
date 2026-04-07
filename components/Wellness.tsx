'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Activity, Brain, Users } from 'lucide-react';

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

export default function Wellness() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="wellness" ref={sectionRef} className="py-24 bg-wff-dark relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-bebas text-5xl md:text-6xl mb-4">MORE THAN <span className="text-wff-red">MUSCLE</span></h2>
          <p className="font-sans text-white/70 text-lg">
            WFF Ghana is committed to elevating the overall health and wellness of the nation. We believe fitness is a holistic journey that transforms the mind, body, and community.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              className="wellness-card bg-[#111] border border-white/10 p-8 hover:border-wff-red/50 transition-colors duration-300 group text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-wff-red/10 flex items-center justify-center text-wff-red mb-6 group-hover:scale-110 transition-transform duration-300">
                {pillar.icon}
              </div>
              <h3 className="font-bebas text-2xl mb-4 text-white group-hover:text-wff-red transition-colors">{pillar.title}</h3>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="border border-wff-red text-wff-red font-bebas text-xl px-8 py-3 hover:bg-wff-red hover:text-white transition-colors duration-300">
            JOIN OUR COMMUNITY BOOTCAMPS
          </button>
        </div>
      </div>
    </section>
  );
}
