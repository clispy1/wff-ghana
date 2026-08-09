'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { HomeContent } from '@/lib/homeContent';
import { SectionSkeleton } from './SectionSkeleton';

/** Federation About section — president portrait + message. */
export function FederationSection({
  president,
}: {
  president?: HomeContent['president'];
}) {
  if (!president) return <SectionSkeleton />;

  return (
    <section className="py-24 relative bg-[#070707] border-b border-white/5">
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 reveal-target relative">
            <div className="relative aspect-[4/5] bg-[#111] border border-white/10 overflow-hidden group rounded-2xl shadow-2xl">
              {president.president.image ? (
                <Image
                  src={president.president.image}
                  alt={president.president.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-103"
                />
              ) : (
                <div className="absolute inset-0 bg-[#161616]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>
              <div className="absolute bottom-8 left-8 pr-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-bebas text-4xl mb-1 text-white leading-none tracking-wide">
                  {president.president.name}
                </h3>
                <p className="font-sans text-wff-gold font-bold uppercase tracking-widest text-xs">
                  {president.president.role}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-wff-gold/35 rounded-br-2xl pointer-events-none"></div>
          </div>

          <div className="lg:col-span-7 reveal-target lg:pl-8">
            <h2 className="font-bebas text-5xl md:text-7xl text-wff-gold mb-6 tracking-wide select-none">
              {president.title}
            </h2>
            <div className="space-y-6 font-sans text-base text-white/70 leading-relaxed mb-8">
              <p className="text-lg text-white italic border-l-2 border-wff-red pl-5 py-1">
                &ldquo;{president.quote}&rdquo;
              </p>
              <p>{president.body1}</p>
              <p>{president.body2}</p>
            </div>
            <Link
              href="/federation"
              className="inline-flex border border-wff-gold text-wff-gold hover:bg-wff-gold hover:text-black font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300"
            >
              {president.cta.text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
