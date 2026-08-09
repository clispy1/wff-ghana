'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatEventRange, type WffEvent } from '@/lib/activeEvent';
import type { HomeContent } from '@/lib/homeContent';
import { SectionSkeleton } from './SectionSkeleton';

/** Championship details — categories, prize and venue cards, driven by the live event when one is active. */
export function ChampionshipSection({
  eventData,
  championship,
}: {
  eventData: WffEvent | null;
  championship?: HomeContent['championship'];
}) {
  if (!championship) return <SectionSkeleton />;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-24 border-b border-white/5">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(206,17,38,0.1)_0%,transparent_75%)]"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center mb-16 reveal-target">
          <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.4em] text-xs mb-4">
            {championship.supertitle}
          </p>
          <h2 className="font-bebas text-6xl md:text-8xl text-white mb-6 leading-none select-none">
            {eventData ? eventData.title : championship.title}
          </h2>
          <p className="font-sans text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            {eventData ? eventData.description : championship.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-16">
          <div className="bg-[#070707]/95 border border-white/10 p-8 reveal-target rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="font-bebas text-2xl text-wff-gold mb-6 tracking-wider border-b border-white/5 pb-2">
                {championship.categoriesTitle}
              </h3>
              <ul className="space-y-4 font-sans text-white/75 text-sm font-semibold">
                {championship.categories.map((cat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-wff-red"></span>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
            <p className="font-sans text-[10px] text-white/40 mt-6 tracking-wide">
              * ACCORDING TO WFF INTERNATIONAL DIVISION RULES
            </p>
          </div>

          <div className="bg-[#070707]/95 border border-white/10 p-8 reveal-target rounded-2xl flex flex-col items-center text-center">
            <h3 className="font-bebas text-2xl text-wff-gold mb-4 tracking-wider">
              {championship.stakesTitle}
            </h3>

            <div className="relative w-40 h-40 my-3 hover:scale-[1.03] transition-transform duration-500">
              <Image
                src="/africa-medal.jpg"
                alt="WFF Medal Profile"
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="font-sans text-white/70 text-xs leading-relaxed max-w-xs mb-4">
              {championship.stakesDescription}
            </p>
            <p className="font-sans text-wff-red font-bold uppercase tracking-widest text-[9px] border border-wff-red/20 px-3 py-1 bg-wff-red/5 rounded-full">
              {championship.stakesBadge}
            </p>
          </div>

          <div className="bg-[#070707]/95 border border-white/10 p-8 reveal-target rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="font-bebas text-2xl text-wff-gold mb-4 tracking-wider">
                VENUE PORTAL
              </h3>
              <p className="font-sans text-white font-extrabold text-sm mb-1 uppercase">
                {eventData ? eventData.venue_name : championship.venueTitle}
              </p>
              <p className="font-sans text-wff-red text-xs font-semibold mb-2">
                {eventData ? eventData.venue_location : championship.venueLocation}
              </p>
              {eventData && (
                <p className="font-sans text-white/50 text-xs font-semibold mb-6 uppercase tracking-wider">
                  {formatEventRange(eventData.start_date, eventData.end_date)}
                </p>
              )}
              <p className="font-sans text-white/70 text-xs leading-relaxed">
                {championship.venueDetails}
              </p>
            </div>
            <p className="font-sans text-[10px] text-white/40 mt-6 tracking-wide">
              ★ FEATURING DEDICATED ATHLETE PUMP-UP ANTECABINS
            </p>
          </div>
        </div>

        <div className="text-center reveal-target flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/championship"
            className="inline-block bg-wff-red text-white py-4 px-10 rounded-xl font-bebas text-xl tracking-widest hover:bg-white hover:text-black transition-colors w-full sm:w-auto font-bold uppercase"
          >
            {championship.ctas.tickets.text}
          </Link>
          <Link
            href="/register"
            className="inline-block border border-wff-gold text-wff-gold py-4 px-10 rounded-xl font-bebas text-xl tracking-widest hover:bg-wff-gold hover:text-black transition-colors w-full sm:w-auto font-bold uppercase"
          >
            {championship.ctas.register.text}
          </Link>
        </div>
      </div>
    </section>
  );
}
