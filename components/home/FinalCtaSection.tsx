'use client';

import Link from 'next/link';
import type { HomeContent } from '@/lib/homeContent';
import { SectionSkeleton } from './SectionSkeleton';

/** Final athlete application call to action. */
export function FinalCtaSection({ contactCta }: { contactCta?: HomeContent['contactCta'] }) {
  if (!contactCta) return <SectionSkeleton />;

  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-wff-red/5"></div>
      <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl reveal-target">
        <h2 className="font-bebas text-6xl md:text-8xl text-white leading-none mb-10 select-none">
          READY FOR <br />
          <span className="text-wff-red">THE STAGE?</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/contact"
            className="bg-wff-red text-white font-bebas text-2xl py-4.5 px-10 rounded-xl hover:bg-white hover:text-black transition-colors w-full tracking-widest font-bold uppercase"
          >
            {contactCta.passesBtn.text}
          </Link>
          <Link
            href="/contact"
            className="border border-white/10 hover:border-white hover:bg-white hover:text-black text-white font-bebas text-2xl py-4.5 px-10 rounded-xl transition-colors w-full tracking-widest font-bold uppercase"
          >
            {contactCta.contactBtn.text}
          </Link>
        </div>
      </div>
    </section>
  );
}
