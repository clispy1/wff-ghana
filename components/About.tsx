'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text Reveal
      if (textRef.current) {
        const lines = textRef.current.querySelectorAll('.reveal-text');
        gsap.fromTo(lines,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // Stats Counters
      if (statsRef.current) {
        const counters = statsRef.current.querySelectorAll('.stat-counter');
        counters.forEach((counter) => {
          const target = parseFloat(counter.getAttribute('data-target') || '0');
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          
          gsap.to(counter, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
            },
            onUpdate: function() {
              counter.innerHTML = `${prefix}${Math.round(Number(this.targets()[0].innerHTML))}${suffix}`;
            }
          });
        });
      }

      // Card Reveal
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 bg-wff-dark relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7" ref={textRef}>
            <h2 className="font-bebas text-5xl md:text-7xl mb-8 reveal-text">
              AESTHETICS. <span className="text-wff-red">SYMMETRY.</span> PRESENCE.
            </h2>
            <div className="font-sans text-lg md:text-xl text-white/70 space-y-6 max-w-3xl">
              <p className="reveal-text">
                The World Fitness Federation (WFF) is an international bodybuilding and fitness organisation founded in 1968 in Germany. We promote classic, aesthetic bodybuilding — not just size, but symmetry, conditioning, and stage presence.
              </p>
              <p className="reveal-text">
                WFF Ghana is the official national chapter. Our mission is to elevate Ghanaian athletes to the world stage. In September 2026, we are proud to host the WFF World Championships right here in Accra, welcoming over 70 nations to our home soil.
              </p>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-8 mt-16 border-t border-white/10 pt-12">
              <div>
                <div className="font-bebas text-5xl md:text-6xl text-wff-gold mb-2 stat-counter" data-target="70" data-suffix="+">0</div>
                <div className="font-sans text-sm uppercase tracking-widest text-white/50">Countries</div>
              </div>
              <div>
                <div className="font-bebas text-5xl md:text-6xl text-wff-gold mb-2 stat-counter" data-target="1968">0</div>
                <div className="font-sans text-sm uppercase tracking-widest text-white/50">Founded</div>
              </div>
              <div>
                <div className="font-bebas text-5xl md:text-6xl text-wff-gold mb-2 stat-counter" data-target="2026">0</div>
                <div className="font-sans text-sm uppercase tracking-widest text-white/50">World Champs</div>
              </div>
            </div>
          </div>

          {/* President Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div 
              ref={cardRef}
              className="relative group w-full max-w-md bg-[#111] border border-white/10 p-6 transition-all duration-500 hover:border-wff-red/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-wff-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-wff-dark">
                <Image 
                  src="https://picsum.photos/seed/president/600/800" 
                  alt="WFF Ghana President"
                  fill
                  className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-bebas text-3xl mb-1">Victor Ahenkorah Baiden</h3>
                <p className="font-sans text-wff-red uppercase tracking-widest text-sm font-bold mb-4">President, WFF Ghana</p>
                <p className="font-sans text-sm text-white/60 italic">
                  &quot;Our athletes have the genetics, the work ethic, and the heart. It&apos;s time the world sees what Ghana brings to the stage.&quot;
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
