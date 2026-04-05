'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Register',
    desc: 'Join WFF Ghana and declare your intent to compete in the national qualifiers.'
  },
  {
    num: '02',
    title: 'Compete Locally',
    desc: 'Place in the top 3 of your category at the WFF Ghana National Championships.'
  },
  {
    num: '03',
    title: 'Team Selection',
    desc: 'The executive committee selects the final roster based on conditioning and stage presence.'
  },
  {
    num: '04',
    title: 'Cameroon 2026',
    desc: 'Travel with Team Ghana to compete against 70+ nations on the world stage.'
  }
];

export default function WorldChampionships() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Banner Parallax
      if (bannerRef.current) {
        gsap.to(bannerRef.current.querySelector('img'), {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: bannerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }

      // Steps Stagger
      if (stepsRef.current) {
        const stepElements = stepsRef.current.querySelectorAll('.qualify-step');
        gsap.fromTo(stepElements,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="cameroon-2026" ref={sectionRef} className="bg-wff-dark relative">
      {/* Dramatic Banner */}
      <div ref={bannerRef} className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <Image 
          src="https://picsum.photos/seed/cameroon/1920/1080" 
          alt="WFF World Championships Cameroon"
          fill
          className="object-cover scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wff-dark via-wff-dark/50 to-transparent"></div>
        <div className="absolute inset-0 bg-wff-red/20 mix-blend-multiply"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-sans text-wff-gold uppercase tracking-[0.3em] font-bold mb-4">The Ultimate Stage</p>
          <h2 className="font-bebas text-6xl md:text-8xl lg:text-9xl tracking-tight mb-4 text-stroke">
            WORLD CHAMPIONSHIPS
          </h2>
          <h3 className="font-bebas text-4xl md:text-6xl text-white">CAMEROON • SEP 2026</h3>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h3 className="font-bebas text-4xl md:text-5xl mb-6">ROAD TO CAMEROON</h3>
          <p className="font-sans text-lg text-white/70">
            This is the moment. WFF Ghana is assembling an elite squad of bodybuilders, fitness models, and physique athletes to represent the nation. Earning your spot on Team Ghana means competing for professional status and global recognition.
          </p>
        </div>

        {/* How to Qualify */}
        <div className="mt-16">
          <h4 className="font-bebas text-3xl mb-12 text-center text-wff-red">HOW TO QUALIFY</h4>
          
          <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="qualify-step relative p-8 border border-white/10 bg-[#111] hover:border-wff-red transition-colors duration-300 group">
                <div className="font-bebas text-6xl text-white/10 absolute top-4 right-4 group-hover:text-wff-red/20 transition-colors duration-300">
                  {step.num}
                </div>
                <h5 className="font-bebas text-2xl mb-4 mt-8 relative z-10">{step.title}</h5>
                <p className="font-sans text-sm text-white/60 relative z-10">{step.desc}</p>
                
                {/* Connector Line (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[1px] bg-white/20 z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
