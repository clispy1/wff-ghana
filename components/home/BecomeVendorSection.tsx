'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import type { HomeContent } from '@/lib/homeContent';
import { SectionSkeleton } from './SectionSkeleton';

/** Become a Vendor pitch — image, benefits list + apply CTA. */
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Vendor Image */}
          <div className="lg:col-span-5 reveal-target relative">
            <div className="relative aspect-[4/5] bg-[#111] border border-white/10 overflow-hidden group rounded-2xl shadow-2xl">
              {becomeVendor.image ? (
                <Image
                  src={becomeVendor.image}
                  alt={becomeVendor.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-103"
                />
              ) : (
                <div className="absolute inset-0 bg-[#161616]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>
              <div className="absolute bottom-8 left-8 pr-6">
                <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.4em] text-xs">
                  {becomeVendor.supertitle}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-wff-gold/35 rounded-br-2xl pointer-events-none"></div>
          </div>

          {/* Copy */}
          <div className="lg:col-span-7 reveal-target lg:pl-8">
            <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.4em] text-xs mb-4 md:hidden">
              {becomeVendor.supertitle}
            </p>
            <h2 className="font-bebas text-5xl md:text-7xl text-white mb-6 leading-none tracking-wide select-none">
              {becomeVendor.title}
            </h2>
            <p className="font-sans text-base text-white/65 max-w-xl leading-relaxed mb-8">
              {becomeVendor.body}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {becomeVendor.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border border-white/10 bg-[#111] rounded-xl px-5 py-4"
                >
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-wff-red/15 text-wff-red">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <p className="font-sans text-sm text-white/80 leading-snug">{benefit}</p>
                </div>
              ))}
            </div>

            <Link
              href="/championship/vendors/apply"
              className="inline-block bg-wff-red text-white py-4 px-10 rounded-xl font-bebas text-xl tracking-widest hover:bg-white hover:text-black transition-colors font-bold uppercase"
            >
              {becomeVendor.cta.text}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
