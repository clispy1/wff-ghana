'use client';

import Image from 'next/image';

export interface Sponsor {
  name: string;
  role: string;
  logoUrl: string | null;
  linkUrl: string | null;
}

/**
 * Sponsor band directly below the hero, styled after the event flyer: a
 * white strip with a SPONSORS label and the logos in a row. Logos and
 * order come from Admin → Sponsors; a sponsor without a logo shows its
 * name instead. Renders nothing when there are no sponsors.
 */
export function SponsorsMarquee({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null;

  return (
    <section aria-label="Sponsors" className="bg-white text-[#16130F] relative z-10 border-b border-black/5">
      <div className="container mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center gap-5 md:gap-10">
        <p className="font-sans font-black uppercase tracking-[0.2em] text-sm text-wff-red shrink-0">
          Sponsors
        </p>
        <ul className="flex flex-wrap items-center justify-center md:justify-start gap-x-10 gap-y-5 flex-1">
          {sponsors.map((s) => {
            const mark = s.logoUrl ? (
              <Image
                src={s.logoUrl}
                alt={s.name}
                width={160}
                height={56}
                className="h-10 md:h-12 w-auto max-w-[140px] object-contain"
              />
            ) : (
              <span className="font-sans font-black uppercase tracking-wide text-sm md:text-base">
                {s.name}
              </span>
            );
            return (
              <li key={s.name} title={s.role || s.name}>
                {s.linkUrl ? (
                  <a
                    href={s.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block opacity-90 hover:opacity-100 transition-opacity"
                  >
                    {mark}
                  </a>
                ) : (
                  mark
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
