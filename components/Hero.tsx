"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { formatEventRange, type WffEvent } from "@/lib/activeEvent";

type Countdown = { days: number; hours: number; minutes: number; seconds: number };
type EventClock =
  | { phase: "unknown" | "live" | "over" }
  | { phase: "upcoming"; left: Countdown };

/**
 * Where the event stands relative to now. `upcoming` carries the time
 * left; `live` covers the whole start–end range (end date inclusive).
 */
function useEventClock(event?: WffEvent | null): EventClock {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!event?.start_date) return;
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [event?.start_date]);

  if (!event?.start_date || now === null) return { phase: "unknown" };

  const start = new Date(`${event.start_date}T00:00:00`).getTime();
  const end = new Date(`${event.end_date || event.start_date}T23:59:59`).getTime();
  if (Number.isNaN(start)) return { phase: "unknown" };

  if (now < start) {
    const d = start - now;
    const left: Countdown = {
      days: Math.floor(d / 86_400_000),
      hours: Math.floor((d % 86_400_000) / 3_600_000),
      minutes: Math.floor((d % 3_600_000) / 60_000),
      seconds: Math.floor((d % 60_000) / 1000),
    };
    return { phase: "upcoming", left };
  }
  return { phase: now <= end ? "live" : "over" };
}

export default function Hero({ event }: { event?: WffEvent | null }) {
  const clock = useEventClock(event);

  // Date and venue come from the active event set in the admin dashboard.
  const dates = formatEventRange(event?.start_date, event?.end_date) ?? "Dates to be announced";
  const place = event?.venue_location || "Venue to be announced";

  return (
    <section
      id="hero-section"
      className="site-dark text-fg relative min-h-[100svh] w-full overflow-hidden flex flex-col bg-page"
    >
      {/* Photo */}
      <Image
        src="/hero-bg.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center] z-0"
      />
      {/* Scrims: dark on the left for the text, and top/bottom for the navbar and countdown. */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/70 via-transparent to-black/85" />

      {/* Ghana ribbon */}
      <div className="absolute top-0 inset-x-0 h-1.5 z-2 flex">
        <div className="flex-1 bg-wff-red" />
        <div className="flex-1 bg-wff-gold" />
        <div className="flex-1 bg-wff-green" />
      </div>

      <div className="relative z-10 flex-1 flex items-center container mx-auto max-w-7xl px-6 pt-28 pb-10">
        <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          <p className="font-sans text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-fg/70 mb-5">
            World Fitness Federation Ghana <span className="text-fg/40">·</span> with WFF International presents
          </p>

          {/* Gold, stacked-shadow lettering after the event flyer. */}
          <h1 className="font-display uppercase text-gold-3d leading-[1.02] text-[9.4vw] sm:text-6xl lg:text-[5.75rem] mb-6">
            All Africa
            <br />
            Bodybuilding
            <br />
            Championship
          </h1>

          <p className="inline-block font-sans font-extrabold uppercase tracking-[0.2em] text-sm md:text-lg text-white bg-[#5a0d0d] border-2 border-wff-gold rounded-md px-5 py-2 mb-7">
            Ghana Meets Africa
          </p>

          <p className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-fg/85 mb-10">
            <span className="flex items-center gap-2">
              <Calendar size={15} className="text-gold-ink shrink-0" /> {dates}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={15} className="text-wff-red shrink-0" />
              {event?.venue_name ? `${event.venue_name}, ${place}` : place}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/championship#tickets"
              className="group inline-flex items-center justify-center gap-2 bg-wff-red text-white font-bebas text-2xl tracking-wider px-9 py-3.5 rounded-xl hover:bg-white hover:text-wff-red transition-colors"
            >
              Get Tickets
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center border border-fg/30 text-fg font-bebas text-2xl tracking-wider px-9 py-3.5 rounded-xl hover:border-wff-gold hover:text-gold-ink transition-colors"
            >
              Register as an Athlete
            </Link>
          </div>
        </div>
      </div>

      {/* Countdown strip */}
      {clock.phase !== "unknown" && clock.phase !== "over" && (
        <div className="relative z-10 border-t border-fg/10 bg-black/40 backdrop-blur-md">
          <div className="container mx-auto max-w-7xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
            {clock.phase !== "upcoming" ? (
              <p className="flex items-center gap-3 font-bebas text-2xl md:text-3xl tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-wff-red animate-pulse" />
                Happening now
              </p>
            ) : (
              <>
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-fg/60">
                  Starts in
                </p>
                <div className="flex gap-6 md:gap-10">
                  {(
                    [
                      ["Days", clock.left.days],
                      ["Hours", clock.left.hours],
                      ["Mins", clock.left.minutes],
                      ["Secs", clock.left.seconds],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="text-center">
                      <div className="font-bebas text-3xl md:text-4xl leading-none tabular-nums">
                        {String(value).padStart(2, "0")}
                      </div>
                      <div className="font-sans text-[10px] uppercase tracking-widest text-fg/50 mt-1">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
