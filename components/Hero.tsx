'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
// @ts-expect-error - maath does not have types for this specific export path
import * as random from 'maath/random/dist/maath-random.esm';
import gsap from 'gsap';
import Link from 'next/link';

function ParticleField() {
  const ref = useRef<any>(null);
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere as Float32Array} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#CC0000" size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

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

    // Countdown Logic
    const targetDate = new Date('2026-09-01T00:00:00').getTime();

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
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleField />
        </Canvas>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-wff-dark/30 via-wff-dark/50 to-wff-dark"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center mt-16">
        <h1 ref={headlineRef} className="font-bebas text-6xl md:text-8xl lg:text-[10rem] leading-none tracking-tight mb-6 overflow-hidden flex flex-wrap justify-center gap-x-4 md:gap-x-8">
          <span className="block">GHANA.</span>
          <span className="block text-transparent text-stroke">STRONGER.</span>
          <span className="block text-wff-red">BOLDER.</span>
          <span className="block">READY.</span>
        </h1>

        <p ref={subRef} className="font-sans text-lg md:text-2xl text-white/80 max-w-3xl mb-12 uppercase tracking-widest opacity-0">
          WFF Ghana National Team • Road to Cameroon 2026 World Championships
        </p>

        {/* Countdown */}
        <div ref={timerRef} className="flex space-x-4 md:space-x-8 mb-12 opacity-0">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <span className="font-bebas text-4xl md:text-6xl text-wff-gold">{item.value.toString().padStart(2, '0')}</span>
              <span className="font-sans text-xs md:text-sm uppercase tracking-widest text-white/60">{item.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 opacity-0">
          <Link 
            href="#register"
            className="bg-wff-red text-white font-bebas text-2xl px-10 py-4 tracking-wider hover:bg-white hover:text-wff-red transition-colors duration-300"
          >
            COMPETE FOR GHANA
          </Link>
          <Link 
            href="#cameroon-2026"
            className="border border-white/30 text-white font-bebas text-2xl px-10 py-4 tracking-wider hover:border-wff-red hover:bg-wff-red transition-all duration-300"
          >
            2026 WORLD CHAMPIONSHIPS
          </Link>
        </div>
      </div>
    </section>
  );
}
