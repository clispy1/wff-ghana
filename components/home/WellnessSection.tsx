'use client';

import type { HomeContent } from '@/lib/homeContent';
import { SectionSkeleton } from './SectionSkeleton';

/** Athletic Rest & Wellness Physiology banner. */
export function WellnessSection({ wellness }: { wellness?: HomeContent['wellness'] }) {
  if (!wellness) return <SectionSkeleton />;

  return (
    <section className="py-32 bg-[#000f0f] relative overflow-hidden border-b border-teal-950/20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl reveal-target">
        <p className="font-sans text-teal-400 font-bold uppercase tracking-[0.4em] text-xs mb-4">
          {wellness.supertitle}
        </p>
        <h2 className="font-bebas text-5xl md:text-7xl text-white mb-6 tracking-wide select-none">
          {wellness.title}
        </h2>
        <p className="font-sans text-sm text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
          {wellness.body}
        </p>
      </div>
    </section>
  );
}
