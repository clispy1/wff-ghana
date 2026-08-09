'use client';

import type { HomeContent } from '@/lib/homeContent';
import { SectionSkeleton } from './SectionSkeleton';

/** The Journey bento-grid story panels. */
export function JourneySection({ journey }: { journey?: HomeContent['journey'] }) {
  if (!journey) return <SectionSkeleton />;

  return (
    <section className="py-24 bg-black border-b border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16 reveal-target">
          <h2 className="font-bebas text-5xl md:text-7xl text-white">THE JOURNEY</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {journey.items.map((panel, idx) => {
            let colSpan = 'col-span-1 md:col-span-1 lg:col-span-2';
            if (idx === 2) colSpan = 'col-span-1 md:col-span-2 lg:col-span-2';
            if (idx === 3 || idx === 4) colSpan = 'col-span-1 md:col-span-1 lg:col-span-3';

            return (
              <div
                key={idx}
                className={`reveal-target flex flex-col justify-end h-[50vh] border border-white/10 bg-[#090909] relative overflow-hidden group cursor-pointer rounded-2xl shadow-xl ${colSpan}`}
              >
                {panel.type === 'video' ? (
                  <video
                    src={panel.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-50 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                  />
                ) : (
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-25 group-hover:opacity-50 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                    style={{ backgroundImage: `url(${panel.src})` }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="relative z-15 p-8 md:p-10 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="font-sans text-wff-red font-bold uppercase tracking-[0.2em] text-xs mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {panel.subtitle}
                  </p>
                  <h2 className="font-bebas text-5xl md:text-7xl leading-none text-white/70 group-hover:text-white transition-colors duration-700 tracking-wide select-none">
                    {panel.title}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
