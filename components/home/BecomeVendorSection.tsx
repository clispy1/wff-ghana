'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import type { HomeContent } from '@/lib/homeContent';
import { SectionSkeleton } from './SectionSkeleton';

/** Become a Vendor pitch — benefits list + apply CTA. */
export function BecomeVendorSection({
  becomeVendor,
}: {
  becomeVendor?: HomeContent['becomeVendor'];
}) {
  if (!becomeVendor) return <SectionSkeleton />;

  return (
    <section className="py-24 bg-[#0a0a0a] border-b border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(252,209,22,0.05)_0%,transparent_70%)]"></div>
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-14 reveal-target">
          <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.4em] text-xs mb-4">
            {becomeVendor.supertitle}
          </p>
          <h2 className="font-bebas text-5xl md:text-7xl text-white mb-6 leading-none select-none">
            {becomeVendor.title}
          </h2>
          <p className="font-sans text-base text-white/65 max-w-2xl mx-auto leading-relaxed">
            {becomeVendor.body}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
          {becomeVendor.benefits.map((benefit, i) => (
            <div
              key={i}
              className="reveal-target flex items-center gap-3 border border-white/10 bg-[#111] rounded-xl px-5 py-4"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-wff-red/15 text-wff-red">
                <Check className="h-3.5 w-3.5" />
              </span>
              <p className="font-sans text-sm text-white/80 leading-snug">{benefit}</p>
            </div>
          ))}
        </div>

        <div className="text-center reveal-target">
          <Link
            href="/championship/vendors/apply"
            className="inline-block bg-wff-red text-white py-4 px-10 rounded-xl font-bebas text-xl tracking-widest hover:bg-white hover:text-black transition-colors font-bold uppercase"
          >
            {becomeVendor.cta.text}
          </Link>
        </div>
      </div>
    </section>
  );
}
