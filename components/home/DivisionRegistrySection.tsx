'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { HomeContent } from '@/lib/homeContent';
import { SectionSkeleton } from './SectionSkeleton';

/** Division Registry — Founding Embassy division slot cards. */
export function DivisionRegistrySection({
  ambassadors,
}: {
  ambassadors?: HomeContent['ambassadors'];
}) {
  if (!ambassadors) return <SectionSkeleton />;

  return (
    <section className="py-24 relative bg-[#070707] border-b border-white/5 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(252,209,22,0.06)_0%,transparent_75%)]"></div>
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center mb-16 reveal-target">
          <h2 className="font-bebas text-5xl md:text-7xl text-white">{ambassadors.title}</h2>
          <p className="font-sans text-white/55 uppercase tracking-widest text-xs mt-3">
            {ambassadors.subtitle}
          </p>
          <p className="font-sans text-white/40 text-xs max-w-md mx-auto mt-2">
            {ambassadors.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ambassadors.items.map((division) => (
            <div
              key={division.id}
              className="reveal-target aspect-[4/5] bg-[#111] border border-white/15 relative group overflow-hidden rounded-2xl shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10"></div>
              <Image
                src={division.image}
                alt={division.title}
                fill
                className="object-cover grayscale transition-transform duration-700 group-hover:scale-103 opacity-40 group-hover:opacity-75"
              />

              <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                <span className="font-sans text-wff-gold font-bold uppercase tracking-widest text-[9px] border border-wff-gold/20 px-2.5 py-0.5 bg-wff-gold/5 rounded-full inline-block mb-3">
                  {division.badge}
                </span>
                <h3 className="font-bebas text-3xl text-white tracking-wide">{division.title}</h3>
                <p className="font-sans text-xs text-white/50">{division.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 reveal-target">
          <Link
            href="/register"
            className="inline-block border border-white/10 hover:border-white hover:bg-white hover:text-black text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300"
          >
            {ambassadors.cta.text}
          </Link>
        </div>
      </div>
    </section>
  );
}
