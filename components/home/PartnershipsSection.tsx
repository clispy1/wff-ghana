'use client';

import Link from 'next/link';
import type { HomeContent } from '@/lib/homeContent';
import { SectionSkeleton } from './SectionSkeleton';

/** Affiliation & sector partnerships CTA. */
export function PartnershipsSection({
  partnerships,
}: {
  partnerships?: HomeContent['partnerships'];
}) {
  if (!partnerships) return <SectionSkeleton />;

  return (
    <section className="py-24 bg-black border-b border-white/5">
      <div className="container mx-auto px-6 text-center max-w-4xl reveal-target">
        <h2 className="font-bebas text-5xl md:text-7xl text-white mb-6 select-none">
          {partnerships.title}
        </h2>
        <p className="font-sans text-sm text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
          {partnerships.body}
        </p>
        <Link
          href="/championship/partnerships"
          className="inline-block border border-white/10 hover:border-white text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300"
        >
          {partnerships.cta.text}
        </Link>
      </div>
    </section>
  );
}
