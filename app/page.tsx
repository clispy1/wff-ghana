'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/components/Hero';
import Link from 'next/link';
import Image from 'next/image';
import WorldChampionships from '@/components/WorldChampionships';

gsap.registerPlugin(ScrollTrigger);

// Centralized CMS-Ready Home Page Configuration
const HOME_DATA_CONFIG = {
  sponsors: [
    { name: "ACCRA ATHLETIC CLUB", role: "FOUNDING GYM" },
    { name: "PRIME PHYSIQUE GH", role: "ATHLETIC SUPPORT" },
    { name: "IRON FORCE EQUIPMENT", role: "HARDWARE PARTNER" },
    { name: "GOLD STANDARD SPORTS", role: "NUTRITION DIVISION" },
    { name: "WEST AFRICA ACTIVE", role: "OFFICIAL HOST PORTAL" },
    { name: "PRESTIGE WELLNESS INC.", role: "PHYSIOLOGY DIVISION" }
  ],
  presidentSection: {
    title: "THE FEDERATION",
    quote: "Our vision is to provide a world-class platform for Ghanaian athletes to showcase their hard work, dedication, and aesthetic excellence on the global stage.",
    body1: "World Fitness Federation (WFF) Ghana is the premier destination for aesthetic and athletic excellence. We are bringing the global standard of bodybuilding and fitness modeling to the heart of West Africa, ensuring fair judging, athlete welfare, and community building.",
    body2: "Under authorized international rules, the inaugural chapter serves as the key pathway for outstanding local athletes to represent Ghana globally.",
    cta: { text: "Discover Our Alliance", href: "/federation" },
    president: {
      name: "VICTOR AHENKORAH BAIDEN",
      role: "President, WFF Ghana",
      image: "/wff-president.jpg"
    }
  },
  journeyPanels: [
    {
      title: 'FOUNDATION',
      subtitle: 'COMMIT TO THE SANCTUARY OF IRON.',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'INTENSITY',
      subtitle: 'EVERY REP SHAPES YOUR DESTINY.',
      type: 'video',
      src: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-with-heavy-ropes-in-the-gym-23450-large.mp4'
    },
    {
      title: 'DISCIPLINE',
      subtitle: 'SACRIFICE IN SILENCE, SHINE ON STAGE.',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'STAGE',
      subtitle: 'THE ULTIMATE CONTINENTAL STAGE.',
      type: 'video',
      src: 'https://assets.mixkit.co/videos/preview/mixkit-silhouette-of-a-bodybuilder-flexing-his-muscles-41717-large.mp4'
    },
    {
      title: 'ASCENSION',
      subtitle: 'EARN REST, SEIZE GLORY.',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1552674605-171ff3ea36f6?q=80&w=2070&auto=format&fit=crop'
    }
  ],
  championship: {
    supertitle: "UPCOMING INAUGURAL EVENT",
    title: "THE INAUGURAL SHOWDOWN",
    description: "The premier battleground for West African natural aesthetics. Register to compete for official WFF International classifications, global pro-am credentials, and direct invitations to world-tier stages.",
    categoriesTitle: "COMPETITION CLASSES",
    categories: [
      "Men's Bodybuilding (Open Weight)",
      "Men's Physique (Height Classes)",
      "Classic Physique (Symmetry Ratio)",
      "Women's Bikini & Wellness Divisions"
    ],
    stakesTitle: "THE PRIZE",
    stakesDescription: "Overall segment champions receive standard-accredited WFF Pro Status, opening doors to represent Ghana at world-class events in Europe, Asia, and the Americas.",
    stakesBadge: "Certified Medals • Pro Cards • Global Standings",
    venueTitle: "UPSA AUDITORIUM",
    venueLocation: "Madina East, Accra, Ghana",
    venueDetails: "Accra's state-of-the-art national-scale auditorium with premium production, professional athlete staging, and fully designed modern theater feedback.",
    ctas: {
      tickets: { text: "SECURE PASSES", href: "/championship" },
      register: { text: "REGISTER TO COMPETE", href: "/athletes" }
    }
  },
  ambassadorsSection: {
    title: "FOUNDING EMBASSY",
    subtitle: "Authorized Division Categories & Slots",
    description: "We are establishing pristine competition segments. Competitors may request official slot registration for specific athletic divisions below:",
    ambassadors: [
      {
        id: "amb-1",
        title: "AESTHETICS",
        desc: "Symmetry, Proportion & Conditioning",
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
        badge: "Men's Physique Slot"
      },
      {
        id: "amb-2",
        title: "CLASSIC",
        desc: "Mass, Structure & Stage Carriage",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
        badge: "Classic Bodybuilding Slot"
      },
      {
        id: "amb-3",
        title: "WELLNESS",
        desc: "Balance, Muscle Tone & Presentation",
        image: "https://images.unsplash.com/photo-1552674605-171ff3ea36f6?q=80&w=800&auto=format&fit=crop",
        badge: "Women's Wellness Slot"
      }
    ],
    cta: { text: "Apply For Stage Access", href: "/athletes" }
  },
  wellness: {
    supertitle: "SUSTAIN THE BODY",
    title: "WELLNESS & PHYSIOLOGY",
    body: "Peak athleticism requires supreme physical calibration. Our official guidance covers holistic training protocols, strict natural supplement directives, and structured athletic restoration programs.",
    cta: { text: "Explore Wellness Programs", href: "/wellness" }
  },
  armory: {
    supertitle: "OFFICIAL CHAPTER GEAR",
    title: "THE ARMORY",
    products: [
      { id: '1', name: 'WFF Pro Stringer', price: 150.00, img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop', category: 'Tanks', description: 'Classic stringer tank top.' },
      { id: '6', name: 'Championship Hoodie', price: 350.00, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop', category: 'Outerwear', description: 'Heavyweight hoodie.' },
      { id: '4', name: 'Elite Lifting Belt', price: 450.00, img: 'https://images.unsplash.com/photo-1584865288642-42078afe6942?q=80&w=800&auto=format&fit=crop', category: 'Gear', description: 'Genuine leather lifting belt.' },
      { id: '3', name: 'WFF Ghana Cap', price: 120.00, img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop', category: 'Accessories', description: 'Adjustable snapback cap.' }
    ]
  },
  newsSection: {
    title: "OFFICIAL CHRONICLES",
    subtitle: "Authorized News & Notices",
    posts: [
      {
        id: "news-1",
        date: "May 15, 2026",
        title: "WFF CHAPTER SANCTIONED IN ACCRA",
        summary: "The global licensing body has finalized the constitution of the Ghana federation, establishing a state office to manage West African natural tournaments."
      },
      {
        id: "news-2",
        date: "May 10, 2026",
        title: "UPSA STAGE LIGHTING CONTRACT LOCKED",
        summary: "To match WFF's premium presentation guidelines, a professional lighting and live feed team is selected to operate the main theater."
      },
      {
        id: "news-3",
        date: "May 02, 2026",
        title: "ANTI-DOPING COMPLIANCE WORKSHOP SET",
        summary: "WFF Ghana reiterates its commitment to natural physique aesthetics with upcoming public rules workshops explaining natural parameters."
      }
    ]
  },
  partnerships: {
    title: "AFFILIATION & SECTOR PARTNERS",
    body: "Secure direct alignment with peak athletic lifestyles and highly disciplined consumer demographics in Accra, Kumasi, and West Africa.",
    cta: { text: "Discover Sponsorship Tiers", href: "/partnerships" }
  },
  contactCta: {
    title: "READY FOR GLORY?",
    passesBtn: { text: "REGISTER TO COMPETE", href: "/contact" },
    contactBtn: { text: "CONTACT OFFICIALS", href: "/contact" }
  }
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

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

      // Horizontal Scroll Logic
      const horizontalSection = document.querySelector('.horizontal-scroll-container');
      const horizontalContent = document.querySelector('.horizontal-scroll-content');
      
      if (horizontalSection && horizontalContent) {
        const getScrollAmount = () => {
          let horizontalWidth = horizontalContent.scrollWidth;
          return -(horizontalWidth - window.innerWidth);
        };

        const tween = gsap.to(horizontalContent, {
          x: getScrollAmount,
          ease: "none"
        });

        ScrollTrigger.create({
          trigger: horizontalSection,
          start: "top top",
          end: () => `+=${getScrollAmount() * -1}`,
          pin: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true
        });
      }
      
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
      <Hero />

      {/* 2. Authentic Partners / Sponsors Strip (Moving Marquee) */}
      <section className="py-6 border-y border-white/5 bg-[#050505] overflow-hidden relative z-10">
        <div className="flex space-x-12 animate-[marquee_25s_linear_infinite] whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-500">
          {[...HOME_DATA_CONFIG.sponsors, ...HOME_DATA_CONFIG.sponsors].map((sponsor, i) => (
            <div key={i} className="inline-flex items-center space-x-3 text-white font-sans text-xs select-none">
              <span className="font-bebas text-lg tracking-widest text-wff-gold">{sponsor.name}</span>
              <span className="text-[10px] text-white/30 font-bold uppercase font-mono">[{sponsor.role}]</span>
              <span className="text-wff-red font-bold text-xs">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Federation About Section */}
      <section className="py-24 relative bg-[#070707] border-b border-white/5">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* President Card Design */}
            <div className="lg:col-span-5 reveal-target relative">
              <div className="relative aspect-[4/5] bg-[#111] border border-white/10 overflow-hidden group rounded-2xl shadow-2xl">
                <Image 
                  src={HOME_DATA_CONFIG.presidentSection.president.image} 
                  alt={HOME_DATA_CONFIG.presidentSection.president.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-103"
                  onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/seed/boardroom/800/1000";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>
                <div className="absolute bottom-8 left-8 pr-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-bebas text-4xl mb-1 text-white leading-none tracking-wide">
                    {HOME_DATA_CONFIG.presidentSection.president.name}
                  </h3>
                  <p className="font-sans text-wff-gold font-bold uppercase tracking-widest text-xs">
                    {HOME_DATA_CONFIG.presidentSection.president.role}
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-wff-gold/35 rounded-br-2xl pointer-events-none"></div>
            </div>

            {/* Federation Text Content */}
            <div className="lg:col-span-7 reveal-target lg:pl-8">
              <h2 className="font-bebas text-5xl md:text-7xl text-wff-gold mb-6 tracking-wide select-none">
                {HOME_DATA_CONFIG.presidentSection.title}
              </h2>
              <div className="space-y-6 font-sans text-base text-white/70 leading-relaxed mb-8">
                <p className="text-lg text-white italic border-l-2 border-wff-red pl-5 py-1">
                  &ldquo;{HOME_DATA_CONFIG.presidentSection.quote}&rdquo;
                </p>
                <p>{HOME_DATA_CONFIG.presidentSection.body1}</p>
                <p>{HOME_DATA_CONFIG.presidentSection.body2}</p>
              </div>
              <Link 
                href={HOME_DATA_CONFIG.presidentSection.cta.href}
                className="inline-flex border border-wff-gold text-wff-gold hover:bg-wff-gold hover:text-black font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300"
              >
                {HOME_DATA_CONFIG.presidentSection.cta.text}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Horizontal Scroll Journey Panel */}
      <section className="horizontal-scroll-container h-screen bg-black flex items-center overflow-hidden border-b border-white/5">
        <div className="horizontal-scroll-content flex space-x-6 px-[10vw] items-center h-full w-max">
          {HOME_DATA_CONFIG.journeyPanels.map((panel, idx) => (
            <div key={idx} className="flex-shrink-0 flex flex-col justify-end w-[85vw] md:w-[50vw] h-[65vh] border border-white/10 bg-[#090909] relative overflow-hidden group cursor-pointer rounded-2xl shadow-xl">
              
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
          ))}
        </div>
      </section>

      {/* 5. Natural Championship Details Panel */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-24 border-b border-white/5">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(206,17,38,0.1)_0%,transparent_75%)]"></div>
        
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center mb-16 reveal-target">
            <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.4em] text-xs mb-4">
              {HOME_DATA_CONFIG.championship.supertitle}
            </p>
            <h2 className="font-bebas text-6xl md:text-8xl text-white mb-6 leading-none select-none">
              {HOME_DATA_CONFIG.championship.title}
            </h2>
            <p className="font-sans text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
              {HOME_DATA_CONFIG.championship.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-16">
            
            {/* Division categories Card */}
            <div className="bg-[#070707]/95 border border-white/10 p-8 reveal-target rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="font-bebas text-2xl text-wff-gold mb-6 tracking-wider border-b border-white/5 pb-2">
                  {HOME_DATA_CONFIG.championship.categoriesTitle}
                </h3>
                <ul className="space-y-4 font-sans text-white/75 text-sm font-semibold">
                  {HOME_DATA_CONFIG.championship.categories.map((cat, i) => (
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
                {HOME_DATA_CONFIG.championship.stakesTitle}
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
                {HOME_DATA_CONFIG.championship.stakesDescription}
              </p>
              <p className="font-sans text-wff-red font-bold uppercase tracking-widest text-[9px] border border-wff-red/20 px-3 py-1 bg-wff-red/5 rounded-full">
                {HOME_DATA_CONFIG.championship.stakesBadge}
              </p>
            </div>

            {/* Stage Location Card */}
            <div className="bg-[#070707]/95 border border-white/10 p-8 reveal-target rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="font-bebas text-2xl text-wff-gold mb-4 tracking-wider">
                  VENUE PORTAL
                </h3>
                <p className="font-sans text-white font-extrabold text-sm mb-1 uppercase">
                  {HOME_DATA_CONFIG.championship.venueTitle}
                </p>
                <p className="font-sans text-wff-red text-xs font-semibold mb-6">
                  {HOME_DATA_CONFIG.championship.venueLocation}
                </p>
                <p className="font-sans text-white/70 text-xs leading-relaxed">
                  {HOME_DATA_CONFIG.championship.venueDetails}
                </p>
              </div>
              <p className="font-sans text-[10px] text-white/40 mt-6 tracking-wide">
                ★ FEATURING DEDICATED ATHLETE PUMP-UP ANTECABINS
              </p>
            </div>

          </div>

          <div className="text-center reveal-target flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href={HOME_DATA_CONFIG.championship.ctas.tickets.href} 
              className="inline-block bg-wff-red text-white py-4 px-10 rounded-xl font-bebas text-xl tracking-widest hover:bg-white hover:text-black transition-colors w-full sm:w-auto font-bold uppercase"
            >
              {HOME_DATA_CONFIG.championship.ctas.tickets.text}
            </Link>
            <Link 
              href={HOME_DATA_CONFIG.championship.ctas.register.href} 
              className="inline-block border border-wff-gold text-wff-gold py-4 px-10 rounded-xl font-bebas text-xl tracking-widest hover:bg-wff-gold hover:text-black transition-colors w-full sm:w-auto font-bold uppercase"
            >
              {HOME_DATA_CONFIG.championship.ctas.register.text}
            </Link>
          </div>
        </div>
      </section>

      {/* 5.5 Continental Rulebook (World Championships Component) */}
      <WorldChampionships />

      {/* 6. Honest Division Registry (Exchanged the fake Athletes list with Division Registry Blocks) */}
      <section className="py-24 relative bg-[#070707] border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(252,209,22,0.06)_0%,transparent_75%)]"></div>
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="text-center mb-16 reveal-target">
            <h2 className="font-bebas text-5xl md:text-7xl text-white">
              {HOME_DATA_CONFIG.ambassadorsSection.title}
            </h2>
            <p className="font-sans text-white/55 uppercase tracking-widest text-xs mt-3">
              {HOME_DATA_CONFIG.ambassadorsSection.subtitle}
            </p>
            <p className="font-sans text-white/40 text-xs max-w-md mx-auto mt-2">
              {HOME_DATA_CONFIG.ambassadorsSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOME_DATA_CONFIG.ambassadorsSection.ambassadors.map((division, idx) => (
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
              href={HOME_DATA_CONFIG.ambassadorsSection.cta.href} 
              className="inline-block border border-white/10 hover:border-white hover:bg-white hover:text-black text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300"
            >
              {HOME_DATA_CONFIG.ambassadorsSection.cta.text}
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Athletic Rest & Wellness Physiology */}
      <section className="py-32 bg-[#000f0f] relative overflow-hidden border-b border-teal-950/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl reveal-target">
          <p className="font-sans text-teal-400 font-bold uppercase tracking-[0.4em] text-xs mb-4">
            {HOME_DATA_CONFIG.wellness.supertitle}
          </p>
          <h2 className="font-bebas text-5xl md:text-7xl text-white mb-6 tracking-wide select-none">
            {HOME_DATA_CONFIG.wellness.title}
          </h2>
          <p className="font-sans text-sm text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            {HOME_DATA_CONFIG.wellness.body}
          </p>
          <Link 
            href={HOME_DATA_CONFIG.wellness.cta.href}
            className="inline-block border border-teal-500 text-teal-400 font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-teal-500 hover:text-black transition-all duration-300"
          >
            {HOME_DATA_CONFIG.wellness.cta.text}
          </Link>
        </div>
      </section>

      {/* 8. The Official Merchandise Shop (Armory) */}
      <section className="py-24 bg-wff-dark relative overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal-target">
            <div>
              <p className="font-sans text-wff-red font-bold uppercase tracking-[0.4em] text-xs mb-3">
                {HOME_DATA_CONFIG.armory.supertitle}
              </p>
              <h2 className="font-bebas text-5xl md:text-7xl text-white select-none">
                {HOME_DATA_CONFIG.armory.title}
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
            {HOME_DATA_CONFIG.armory.products.map((product) => (
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
                <h3 className="font-bebas text-2xl text-white mb-0.5 group-hover:text-wff-red transition-colors tracking-wide">
                  {product.name}
                </h3>
                <p className="font-sans text-xs text-white/50">
                  ₵ {product.price.toFixed(2)}
                </p>
              </Link>
            ))}
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

      {/* 9. Media & Gallery Overview */}
      <section className="py-24 bg-[#050505] border-b border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex justify-between items-end mb-12 reveal-target">
            <div>
              <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.4em] text-xs mb-3">AUTHORIZED LOGS</p>
              <h2 className="font-bebas text-5xl md:text-7xl text-white select-none">CHAPTER MEDIA</h2>
            </div>
            <Link 
              href="/media" 
              className="hidden md:inline-flex font-sans text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
              View Media Board →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1552674605-171ff3ea36f6?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop"
            ].map((src, i) => (
              <div 
                key={i} 
                className="reveal-target aspect-square bg-[#111] border border-white/10 hover:border-wff-red transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl relative group"
              >
                <Image 
                  src={src} 
                  alt="Gallery Snip" 
                  role="presentation"
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 opacity-55 group-hover:opacity-85 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden reveal-target">
            <Link 
              href="/media" 
              className="inline-block border border-white/15 text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 w-full"
            >
              View Media Board →
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Honest News Section (Official Chronicle Files) */}
      <section className="py-24 bg-wff-dark border-b border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="font-bebas text-5xl md:text-7xl text-white mb-12 text-center reveal-target select-none">
            {HOME_DATA_CONFIG.newsSection.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOME_DATA_CONFIG.newsSection.posts.map((post) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* 11. Affiliation and Sector Partnerships */}
      <section className="py-24 bg-black border-b border-white/5">
        <div className="container mx-auto px-6 text-center max-w-4xl reveal-target">
          <h2 className="font-bebas text-5xl md:text-7xl text-white mb-6 select-none">
            {HOME_DATA_CONFIG.partnerships.title}
          </h2>
          <p className="font-sans text-sm text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            {HOME_DATA_CONFIG.partnerships.body}
          </p>
          <Link 
            href={HOME_DATA_CONFIG.partnerships.cta.href} 
            className="inline-block border border-white/10 hover:border-white text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300"
          >
            {HOME_DATA_CONFIG.partnerships.cta.text}
          </Link>
        </div>
      </section>

      {/* 12. Final Athlete Application Call to Action */}
      <section className="py-32 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-wff-red/5"></div>
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl reveal-target">
          <h2 className="font-bebas text-6xl md:text-8xl text-white leading-none mb-10 select-none">
            READY FOR <br/><span className="text-wff-red">THE STAGE?</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link 
              href={HOME_DATA_CONFIG.contactCta.passesBtn.href} 
              className="bg-wff-red text-white font-bebas text-2xl py-4.5 px-10 rounded-xl hover:bg-white hover:text-black transition-colors w-full tracking-widest font-bold uppercase"
            >
              {HOME_DATA_CONFIG.contactCta.passesBtn.text}
            </Link>
            <Link 
              href={HOME_DATA_CONFIG.contactCta.contactBtn.href} 
              className="border border-white/10 hover:border-white hover:bg-white hover:text-black text-white font-bebas text-2xl py-4.5 px-10 rounded-xl transition-colors w-full tracking-widest font-bold uppercase"
            >
              {HOME_DATA_CONFIG.contactCta.contactBtn.text}
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
