'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/components/Hero';
import Link from 'next/link';
import Image from 'next/image';
import WorldChampionships from '@/components/WorldChampionships';
import { formatEventRange, type WffEvent } from '@/lib/activeEvent';
import type { HomeContent } from '@/lib/homeContent';
import type { GalleryPhoto } from '@/lib/galleryMedia';
import { Skeleton } from '@/components/ui/skeleton';

gsap.registerPlugin(ScrollTrigger);

export interface HomeClientProps {
  sponsors: { name: string; role: string }[];
  news: { id: string; date: string; title: string; summary: string }[];
  products: {
    id: string;
    name: string;
    price: number;
    img: string;
    category: string;
    description: string;
  }[];
  eventData: WffEvent | null;
  content: Partial<HomeContent>;
  galleryPhotos: GalleryPhoto[];
  vendors: { id: string; name: string; category: string }[];
}

/**
 * Shown in place of a homepage section the admin hasn't populated yet —
 * never default/fallback marketing copy.
 */
function SectionSkeleton() {
  return (
    <section className="py-24 relative bg-wff-dark border-b border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center gap-5 py-10">
          <Skeleton className="h-3 w-36 bg-white/10" />
          <Skeleton className="h-12 w-72 md:w-96 bg-white/10" />
          <Skeleton className="h-4 w-96 max-w-full bg-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
            <Skeleton className="h-64 w-full bg-white/10" />
            <Skeleton className="h-64 w-full bg-white/10" />
            <Skeleton className="h-64 w-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeClient({
  sponsors,
  news,
  products,
  eventData,
  content,
  galleryPhotos,
  vendors,
}: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    president,
    journey,
    championship,
    ambassadors,
    wellness,
    armory,
    gallery,
    news: newsSection,
    partnerships,
    contactCta,
  } = content;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Universal Reveal Animation - Simplified and standardized for consistency
      gsap.utils.toArray('.reveal-target').forEach((el: any) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              // Play once when scrolling down, reverse when scrolling all the way back up
              toggleActions: 'play none none reverse',
            }
          }
        );
      });

      // Refresh ScrollTrigger after a short delay to account for any layout shifts
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative bg-wff-dark min-h-screen overflow-hidden">

      {/* 1. Hero Module */}
      <Hero event={eventData} />

      {/* 2. Authentic Partners / Sponsors Strip (Moving Marquee) */}
      {sponsors.length > 0 && (
        <section className="py-6 border-y border-white/5 bg-[#050505] overflow-hidden relative z-10">
          <div className="flex space-x-12 animate-[marquee_25s_linear_infinite] whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-500">
            {[...sponsors, ...sponsors, ...sponsors].map((sponsor, i) => (
              <div key={i} className="inline-flex items-center space-x-3 text-white font-sans text-xs select-none">
                <span className="font-bebas text-lg tracking-widest text-wff-gold">{sponsor.name}</span>
                <span className="text-[10px] text-white/30 font-bold uppercase font-mono">[{sponsor.role}]</span>
                <span className="text-wff-red font-bold text-xs">•</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Federation About Section */}
      {president ? (
        <section className="py-24 relative bg-[#070707] border-b border-white/5">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
          <div className="container mx-auto px-6 relative z-10 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* President Card Design */}
              <div className="lg:col-span-5 reveal-target relative">
                <div className="relative aspect-[4/5] bg-[#111] border border-white/10 overflow-hidden group rounded-2xl shadow-2xl">
                  {president.president.image ? (
                    <Image
                      src={president.president.image}
                      alt={president.president.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-103"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#161616]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 pr-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-bebas text-4xl mb-1 text-white leading-none tracking-wide">
                      {president.president.name}
                    </h3>
                    <p className="font-sans text-wff-gold font-bold uppercase tracking-widest text-xs">
                      {president.president.role}
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-wff-gold/35 rounded-br-2xl pointer-events-none"></div>
              </div>

              {/* Federation Text Content */}
              <div className="lg:col-span-7 reveal-target lg:pl-8">
                <h2 className="font-bebas text-5xl md:text-7xl text-wff-gold mb-6 tracking-wide select-none">
                  {president.title}
                </h2>
                <div className="space-y-6 font-sans text-base text-white/70 leading-relaxed mb-8">
                  <p className="text-lg text-white italic border-l-2 border-wff-red pl-5 py-1">
                    &ldquo;{president.quote}&rdquo;
                  </p>
                  <p>{president.body1}</p>
                  <p>{president.body2}</p>
                </div>
                <Link
                  href="/federation"
                  className="inline-flex border border-wff-gold text-wff-gold hover:bg-wff-gold hover:text-black font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300"
                >
                  {president.cta.text}
                </Link>
              </div>

            </div>
          </div>
        </section>
      ) : (
        <SectionSkeleton />
      )}

      {/* 4. Journey Panel (Grid layout instead of horizontal scroll) */}
      {journey ? (
        <section className="py-24 bg-black border-b border-white/5">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16 reveal-target">
              <h2 className="font-bebas text-5xl md:text-7xl text-white">THE JOURNEY</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {journey.items.map((panel, idx) => {
                // Custom span logic for bento grid feeling
                let colSpan = "col-span-1 md:col-span-1 lg:col-span-2";
                if (idx === 2) colSpan = "col-span-1 md:col-span-2 lg:col-span-2";
                if (idx === 3 || idx === 4) colSpan = "col-span-1 md:col-span-1 lg:col-span-3";

                return (
                  <div key={idx} className={`reveal-target flex flex-col justify-end h-[50vh] border border-white/10 bg-[#090909] relative overflow-hidden group cursor-pointer rounded-2xl shadow-xl ${colSpan}`}>

                    {/* Media Background */}
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

                    {/* Overlapping dark scrims */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                    {/* Content Panel */}
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
      ) : (
        <SectionSkeleton />
      )}

      {/* 5. Natural Championship Details Panel */}
      {championship ? (
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

              {/* Division categories Card */}
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

              {/* Medal Focus Card (Honest Representation) */}
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

              {/* Stage Location Card */}
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
      ) : (
        <SectionSkeleton />
      )}

      {/* 5.5 Continental Rulebook (World Championships Component) */}
      <WorldChampionships />

      {/* 6. Honest Division Registry (Exchanged the fake Athletes list with Division Registry Blocks) */}
      {ambassadors ? (
        <section className="py-24 relative bg-[#070707] border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(252,209,22,0.06)_0%,transparent_75%)]"></div>
          <div className="container mx-auto px-6 relative z-10 max-w-7xl">
            <div className="text-center mb-16 reveal-target">
              <h2 className="font-bebas text-5xl md:text-7xl text-white">
                {ambassadors.title}
              </h2>
              <p className="font-sans text-white/55 uppercase tracking-widest text-xs mt-3">
                {ambassadors.subtitle}
              </p>
              <p className="font-sans text-white/40 text-xs max-w-md mx-auto mt-2">
                {ambassadors.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ambassadors.items.map((division, idx) => (
                <div
                  key={division.id}
                  className="reveal-target aspect-[4/5] bg-[#111] border border-white/15 relative group overflow-hidden rounded-2xl shadow-xl"
                >
                  {/* Media Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10"></div>
                  <Image
                    src={division.image}
                    alt={division.title}
                    fill
                    className="object-cover grayscale transition-transform duration-700 group-hover:scale-103 opacity-40 group-hover:opacity-75"
                  />

                  <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                    <span className="font-sans text-wff-gold font-bold uppercase tracking-widest text-[9px] border border-wff-gold/20 px-2.5 py-0.5 bg-wff-gold/5 rounded-full inline-block mb-3">
                      {division.badge}
                    </span>
                    <h3 className="font-bebas text-3xl text-white tracking-wide">
                      {division.title}
                    </h3>
                    <p className="font-sans text-xs text-white/50">
                      {division.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 reveal-target">
              <Link
                href="/register"
                className="inline-block border border-white/10 hover:border-white hover:bg-white hover:text-black text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300"
              >
                {ambassadors.cta.text}
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <SectionSkeleton />
      )}

      {/* 7. Athletic Rest & Wellness Physiology */}
      {wellness ? (
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
      ) : (
        <SectionSkeleton />
      )}

      {/* 8. The Official Merchandise Shop (Armory) */}
      {armory ? (
        <section className="py-24 bg-wff-dark relative overflow-hidden border-b border-white/5">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal-target">
              <div>
                <p className="font-sans text-wff-red font-bold uppercase tracking-[0.4em] text-xs mb-3">
                  {armory.supertitle}
                </p>
                <h2 className="font-bebas text-5xl md:text-7xl text-white select-none">
                  {armory.title}
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-flex border border-white/10 hover:border-white text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 mb-2"
              >
                View Full Gallery
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <p className="text-white/40 text-sm col-span-full text-center py-8">
                  Merchandise will be listed here soon.
                </p>
              ) : (
                products.map((product) => (
                  <Link
                    href={`/shop/${product.id}`}
                    key={product.id}
                    className="reveal-target group cursor-pointer block"
                  >
                    <div className="relative aspect-[4/5] bg-[#111] border border-white/10 overflow-hidden mb-5 rounded-2xl">
                      <div className="absolute inset-0 bg-wff-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <Image
                        src={product.img}
                        alt={product.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 group-hover:scale-103"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 left-0 w-full p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 bg-black/90 backdrop-blur-xs">
                        <span className="block w-full text-center font-bebas text-lg text-wff-gold tracking-widest">
                          VIEW IN SHOP
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bebas text-2xl text-white mb-0.5 group-hover:text-wff-red transition-colors tracking-wide truncate">
                      {product.name}
                    </h3>
                    <p className="font-sans text-xs text-white/50">
                      {typeof product.price === 'number' ? `₵ ${product.price.toFixed(2)}` : `₵ ${product.price}`}
                    </p>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-8 text-center md:hidden reveal-target">
              <Link
                href="/shop"
                className="inline-block border border-white/15 text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 w-full"
              >
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <SectionSkeleton />
      )}

      {/* 9. Media & Gallery Overview */}
      {gallery ? (
        <section className="py-24 bg-[#050505] border-b border-white/5">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex justify-between items-end mb-12 reveal-target">
              <div>
                <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.4em] text-xs mb-3">{gallery.supertitle}</p>
                <h2 className="font-bebas text-5xl md:text-7xl text-white select-none">{gallery.title}</h2>
              </div>
              <Link
                href="/media"
                className="hidden md:inline-flex font-sans text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
              >
                View Media & Gallery →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryPhotos.length === 0 ? (
                <p className="text-white/40 text-sm col-span-full text-center py-8">
                  Photos will be posted here soon.
                </p>
              ) : (
                galleryPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="reveal-target aspect-square bg-[#111] border border-white/10 hover:border-wff-red transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl relative group"
                  >
                    <Image
                      src={photo.image_url}
                      alt={photo.caption || "Gallery Snip"}
                      role="presentation"
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 opacity-55 group-hover:opacity-85 transition-opacity duration-300"
                    />
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 text-center md:hidden reveal-target">
              <Link
                href="/media"
                className="inline-block border border-white/15 text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 w-full"
              >
                View Media & Gallery →
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <SectionSkeleton />
      )}

      {/* 10. Honest News Section (Official Chronicle Files) */}
      {newsSection ? (
        <section className="py-24 bg-wff-dark border-b border-white/5">
          <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="font-bebas text-5xl md:text-7xl text-white mb-12 text-center reveal-target select-none">
              {newsSection.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.length === 0 ? (
                <p className="text-white/40 text-sm col-span-full text-center py-8">
                  News articles will be posted here soon.
                </p>
              ) : (
                news.map((post) => (
                  <div
                    key={post.id}
                    className="reveal-target bg-[#070707] border border-white/10 p-8 hover:-translate-y-1.5 transition-transform duration-500 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <p className="font-sans text-wff-red text-xs font-bold uppercase tracking-widest mb-4">
                        {post.date}
                      </p>
                      <h3 className="font-bebas text-2xl text-white mb-4 tracking-wide leading-tight">
                        {post.title}
                      </h3>
                      <p className="font-sans text-xs text-white/55 leading-relaxed mb-6">
                        {post.summary}
                      </p>
                    </div>
                    <span className="font-sans text-xs font-black uppercase tracking-widest text-wff-gold block cursor-pointer hover:text-white transition-colors mt-4">
                      RESOURCES →
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      ) : (
        <SectionSkeleton />
      )}

      {/* 11. Affiliation and Sector Partnerships */}
      {partnerships ? (
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
      ) : (
        <SectionSkeleton />
      )}

      {/* 11.5 Event Vendors — approved vendors from the admin dashboard */}
      {vendors.length > 0 && (
        <section className="py-24 bg-[#070707] border-b border-white/5">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal-target">
              <div>
                <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.4em] text-xs mb-3">
                  OFFICIAL EVENT SUPPLIERS
                </p>
                <h2 className="font-bebas text-5xl md:text-7xl text-white select-none">
                  EVENT VENDORS
                </h2>
              </div>
              <Link
                href="/championship/vendors"
                className="hidden md:inline-flex border border-wff-gold text-wff-gold hover:bg-wff-gold hover:text-black font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 mb-2"
              >
                View All Vendors
              </Link>
              <Link
                href="/championship/vendors/apply"
                className="hidden md:inline-flex bg-wff-red text-white hover:bg-white hover:text-wff-red font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 mb-2"
              >
                Become a Vendor
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vendors.slice(0, 8).map((vendor) => (
                <div
                  key={vendor.id}
                  className="reveal-target bg-[#111] border border-white/10 rounded-xl p-6 hover:border-wff-gold/40 transition-colors"
                >
                  <h3 className="font-bebas text-2xl text-white tracking-wide leading-none truncate">
                    {vendor.name}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-wff-gold font-sans mt-1.5">
                    {vendor.category}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden reveal-target">
              <Link
                href="/championship/vendors"
                className="inline-block border border-wff-gold text-wff-gold hover:bg-wff-gold hover:text-black font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 w-full"
              >
                View All Vendors
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 12. Final Athlete Application Call to Action */}
      {contactCta ? (
        <section className="py-32 bg-[#050505] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-wff-red/5"></div>
          <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl reveal-target">
            <h2 className="font-bebas text-6xl md:text-8xl text-white leading-none mb-10 select-none">
              READY FOR <br /><span className="text-wff-red">THE STAGE?</span>
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
      ) : (
        <SectionSkeleton />
      )}

    </main>
  );
}
