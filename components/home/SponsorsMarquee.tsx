'use client';

/** Animated partner marquee directly below the hero. Renders nothing when no sponsors are approved. */
export function SponsorsMarquee({ sponsors }: { sponsors: { name: string; role: string }[] }) {
  if (sponsors.length === 0) return null;

  return (
    <section className="py-6 border-y border-white/5 bg-[#050505] overflow-hidden relative z-10">
      <div className="flex space-x-12 animate-[marquee_25s_linear_infinite] whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-500">
        {[...sponsors, ...sponsors, ...sponsors].map((sponsor, i) => (
          <div
            key={i}
            className="inline-flex items-center space-x-3 text-white font-sans text-xs select-none"
          >
            <span className="font-bebas text-lg tracking-widest text-wff-gold">{sponsor.name}</span>
            <span className="text-[10px] text-white/30 font-bold uppercase font-mono">
              [{sponsor.role}]
            </span>
            <span className="text-wff-red font-bold text-xs">•</span>
          </div>
        ))}
      </div>
    </section>
  );
}
