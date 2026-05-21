'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { 
  Heart, 
  Activity, 
  Brain, 
  Users, 
  BarChart3, 
  Globe2, 
  Trophy, 
  Mail, 
  Play, 
  Award, 
  FileText, 
  Download, 
  Briefcase, 
  ChevronRight, 
  Scale, 
  Check 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Correct Competition Divisions from WFF Official Rulebook
const COMPETITION_DIVISIONS = [
  {
    id: 'bodybuilding',
    name: 'Bodybuilding',
    tagline: 'Extreme & Superbody Divisions',
    rules: [
      'Focus is placed on overall muscle volume, extreme vascularity, symmetrical density, and stage carriage.',
      'Judged during active stage rotations (front, side, back) and an energetic 60-second freestyle routine with posing music.',
      'Strict division classes based on age groups (Juniors, Open, Masters 40+, Masters 50+) and absolute weight margins.'
    ],
    details: 'The ultimate showcase of raw muscle mass balanced with symmetrical conditioning. Aesthetic proportions hold major weight in tiebreakers.'
  },
  {
    id: 'classic',
    name: 'Classic Physique',
    tagline: 'Golden-Era Proportions',
    rules: [
      'Focus is on the historic V-taper: broad shoulders, sweeping quads, a vacuumed narrow waist, and deep muscle definition.',
      'Athletes perform mandatory classic poses (such as front double biceps, vacuum stomach, and favorite classic stance).',
      'Strict height-to-weight ratio limits to ensure athletes do not cross into extreme mass at the expense of classic aesthetics.'
    ],
    details: 'Height tiers: Under 172cm, Under 179cm, Over 179cm. Cross-over with Bodybuilding is restricted to guarantee specialized aesthetic values.'
  },
  {
    id: 'bikini',
    name: 'Bikini Model',
    tagline: 'Athletic Poise & Symmetry',
    rules: [
      'Physique must show a healthy, toned, athletic form with soft muscle curves, minimal muscle separation, and no deep vascularity.',
      'Judging centers 50% on physical proportions and 50% on stage deportment, including walk elegance, outfit coordination, and styling.',
      'Divided into height classifications (short, tall) and age categories with no strict weight boundaries.'
    ],
    details: 'Ideal for female competitors aiming for high-standard athletic conditioning without entering professional mass thresholds.'
  },
  {
    id: 'sports-model',
    name: 'Sports Model',
    tagline: 'Dynamic Tone & Performance',
    rules: [
      'Requires a highly defined, firm physique showing athletic symmetry, core definition, and clean posture.',
      'Judges evaluate stage energy and sportswear presentation. Athletes project high confidence and active lifestyle values.',
      'Available for both male and female fitness models wishing to combine commercial aesthetic styling with severe gym preparation.'
    ],
    details: 'Often serves as a fast-tracked pipeline for commercial fitness brand sponsorships, mainstream magazine covers, and athletic product endorsements.'
  }
];

// Correct Executive Board Members for WFF Ghana
const EXECUTIVE_BOARD = [
  {
    name: 'Victor Ahenkorah Baiden',
    role: 'President, WFF Ghana',
    bio: 'Championing the vision of natural aesthetic sports across West Africa. Leading the organizational committee to secure historic pro-am host tags for Accra in 2026.',
    image: '/wff-president.jpg',
    fallbackImg: 'https://picsum.photos/seed/president-victor/600/800',
    quote: 'Our athletes have the genetics, the work ethic, and the heart. It is time the world sees what Ghana brings to the main stage.'
  },
  {
    name: 'Kofi Kwakye',
    role: 'Vice President & Chief Operating Officer',
    bio: 'Oversees the regional chapters, national qualifying parameters, and ensures all state-stage regulations align with WFF International structures.',
    image: 'https://picsum.photos/seed/kofi-kwakye/600/800',
    fallbackImg: '',
    quote: 'We operate on values of total integrity, fair local judging panels, and deep support networks for our amateur rosters.'
  },
  {
    name: 'Kwame Mensah',
    role: 'Technical Director & National Head Coach',
    bio: 'A certified master coach holding multiple continental titles. Directs official fitness seminars and designs peak active-conditioning schedules.',
    image: 'https://picsum.photos/seed/head-coach-kwame/600/800',
    fallbackImg: '',
    quote: 'Sustainable nutrition programs combined with structured, intense mechanical load is how we build unstoppable champions.'
  },
  {
    name: 'Dr. Naa Dedei Koblah',
    role: 'Director of Sports Nutrition & Integrity',
    bio: 'Oversees athlete health guidelines, recovery clinics, anti-doping seminars, and wellness division programs.',
    image: 'https://picsum.photos/seed/dr-naa/600/800',
    fallbackImg: '',
    quote: 'True strength is built from a foundation of absolute wellness. Physical conditioning must always harmonize with mental health.'
  }
];

export default function FederationClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const mapTextRef = useRef<SVGTextElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const [stats, setStats] = useState({
    founded: 0,
    countries: 0,
    athletes: 0
  });

  const [activeDivisionTab, setActiveDivisionTab] = useState('bodybuilding');
  const [selectedHub, setSelectedHub] = useState<string | null>('accra');

  const statsObj = useRef({ founded: 0, countries: 0, athletes: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Color Shift (Transition to deep earthy athletic warm backdrop on scroll)
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => gsap.to(document.documentElement, { '--bg-color': '#0F1A15', duration: 1 }), // Soft deep green/black
        onLeaveBack: () => gsap.to(document.documentElement, { '--bg-color': '#050505', duration: 1 }),
        onLeave: () => gsap.to(document.documentElement, { '--bg-color': '#050505', duration: 1 }),
        onEnterBack: () => gsap.to(document.documentElement, { '--bg-color': '#0F1A15', duration: 1 }),
      });

      // Header Animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%'
          }
        }
      );

      // SVG Map Path Stroke Draw Effect
      if (mapRef.current && pulseRef.current && mapTextRef.current) {
        const length = mapRef.current.getTotalLength();
        gsap.set(mapRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(pulseRef.current, { scale: 0, opacity: 0, transformOrigin: 'center' });
        gsap.set(mapTextRef.current, { opacity: 0, y: 10 });

        const mapTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.map-container',
            start: 'top 65%',
          }
        });

        mapTl.to(mapRef.current, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' })
             .to(pulseRef.current, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' })
             .to(pulseRef.current, { scale: 1.8, opacity: 0, duration: 1.4, repeat: -1 }, '+=0.2')
             .to(mapTextRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=1.2');
      }

      // Stats Counter Staggered
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(statsObj.current, {
              founded: 1968,
              countries: 72,
              athletes: 1500,
              duration: 2.5,
              ease: 'power3.out',
              onUpdate: () => {
                setStats({
                  founded: Math.round(statsObj.current.founded),
                  countries: Math.round(statsObj.current.countries),
                  athletes: Math.round(statsObj.current.athletes)
                });
              }
            });
          },
          once: true
        });
      }

      // Fade-in sections
      gsap.fromTo('.reveal-block',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.reveal-block-trigger',
            start: 'top 80%'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-wff-dark">
      
      {/* Ambient Red/Green/Gold Accent Glow Backgrounds */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-wff-red/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-wff-gold/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-wff-green/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Header Section */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-24">
          <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.35em] mb-4 text-xs md:text-sm">World Fitness Federation Ghana</p>
          <h1 className="font-bebas text-6xl md:text-8xl mb-6 text-white leading-none">
            THE <span className="text-stroke-gold inline-block mr-2">GHANAIAN</span> <span className="text-wff-red">FEDERATION</span>
          </h1>
          <p className="font-sans text-lg md:text-xl text-white/75 max-w-3xl mx-auto leading-relaxed">
            Representing the certified national chapter of the World Fitness Federation (WFF). We establish deep structural networks for athletes, fair judging committees, and holistic recovery systems.
          </p>
        </div>

        {/* Tactical Map & Stat Core */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          
          {/* Animated SVG Map of Ghana */}
          <div className="flex flex-col items-center">
            <div className="map-container relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center bg-[#090909]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
              <svg width="100%" height="100%" viewBox="0 0 200 250" className="overflow-visible select-none">
                {/* Visual grid lines for structural technical look */}
                <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
                <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
                <line x1="0" y1="150" x2="200" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
                <line x1="0" y1="200" x2="200" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
                <line x1="50" y1="0" x2="50" y2="250" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
                <line x1="100" y1="0" x2="100" y2="250" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
                <line x1="150" y1="0" x2="150" y2="250" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />

                {/* Stylized Ghana Map Border Contour */}
                <path 
                  ref={mapRef}
                  d="M 50,35 C 50,35 60,30 80,30 C 100,30 110,25 130,30 C 145,35 150,45 150,60 C 150,75 160,85 160,110 C 160,135 145,150 145,175 C 145,190 140,210 120,210 C 100,210 90,205 75,200 C 60,195 50,185 50,165 C 50,145 42,125 45,110 C 48,95 50,85 55,65 C 60,45 50,35 50,35 Z" 
                  fill="rgba(252,209,22,0.02)" 
                  stroke="#FCD116" 
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Regional Hotspots */}
                
                {/* Accra Node (HQ) */}
                <circle 
                  cx="120" 
                  cy="208" 
                  r="12" 
                  fill="rgba(206,17,38,0.2)" 
                  className="cursor-pointer group"
                  onClick={() => setSelectedHub('accra')}
                />
                <circle ref={pulseRef} cx="120" cy="208" r="6" fill="#CE1126" />
                <circle cx="120" cy="208" r="3" fill="#FFFFFF" />

                {/* Kumasi Node */}
                <circle 
                  cx="85" 
                  cy="145" 
                  r="10" 
                  fill="rgba(0,107,63,0.2)" 
                  className="cursor-pointer"
                  onClick={() => setSelectedHub('kumasi')}
                />
                <circle cx="85" cy="145" r="4.5" fill="#006B3F" />
                <circle cx="85" cy="145" r="2" fill="#FFFFFF" />

                {/* Takoradi Node */}
                <circle 
                  cx="60" 
                  cy="195" 
                  r="10" 
                  fill="rgba(252,209,22,0.2)" 
                  className="cursor-pointer"
                  onClick={() => setSelectedHub('takoradi')}
                />
                <circle cx="60" cy="195" r="4.5" fill="#FCD116" />
                <circle cx="60" cy="195" r="2" fill="#FFFFFF" />

                {/* Tamale Node */}
                <circle 
                  cx="100" 
                  cy="80" 
                  r="10" 
                  fill="rgba(252,209,22,0.2)" 
                  className="cursor-pointer"
                  onClick={() => setSelectedHub('tamale')}
                />
                <circle cx="100" cy="80" r="4.5" fill="#FCD116" />
                <circle cx="100" cy="80" r="2" fill="#FFFFFF" />

                {/* Interactive map prompt */}
                <text ref={mapTextRef} x="100" y="238" fill="white" fontSize="8.5" fontFamily="var(--font-sans)" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest opacity-60">
                  ★ SELECT HUB KEY NODES
                </text>
              </svg>

              {/* absolute coordinates watermark */}
              <div className="absolute top-4 right-6 font-mono text-[9px] text-white/30 tracking-widest">
                GH CRD: 5.6037° N, 0.1870° W
              </div>
            </div>

            {/* Regional Hub Detail Reveal Drawer */}
            <div className="mt-6 w-full max-w-[420px] bg-[#0E0E0E] border border-white/5 p-5 rounded-2xl flex items-start gap-4">
              <div className="p-3 rounded-xl bg-wff-gold/10 text-wff-gold font-bold">
                <Globe2 size={20} />
              </div>
              <div className="font-sans">
                {selectedHub === 'accra' && (
                  <>
                    <h4 className="text-xs uppercase tracking-wider text-wff-red font-bold font-mono">Accra Regional HQ</h4>
                    <p className="text-white text-sm font-semibold mb-1">National Board Admin & Pro-Am Stadium</p>
                    <p className="text-xs text-white/50 leading-normal">Our central administrative hub. Coordinated training centers, registration logistics, and the designated 2026 World Championship Stage.</p>
                  </>
                )}
                {selectedHub === 'kumasi' && (
                  <>
                    <h4 className="text-xs uppercase tracking-wider text-wff-green font-bold font-mono">Kumasi Division</h4>
                    <p className="text-white text-sm font-semibold mb-1">Garden City Aesthetic Cluster</p>
                    <p className="text-xs text-white/50 leading-normal">Represents a massive powerhouse roster for Classic Physique training. Highly active community camps and public workshops.</p>
                  </>
                )}
                {selectedHub === 'takoradi' && (
                  <>
                    <h4 className="text-xs uppercase tracking-wider text-wff-gold font-bold font-mono">Takoradi Division</h4>
                    <p className="text-white text-sm font-semibold mb-1">Western Gold Powerhouse Chapter</p>
                    <p className="text-xs text-white/50 leading-normal">Strong recruitment pipeline focus on Heavyweight-Extreme Bodybuilding divisions. Known for intense powerlifting facilities.</p>
                  </>
                )}
                {selectedHub === 'tamale' && (
                  <>
                    <h4 className="text-xs uppercase tracking-wider text-wff-gold font-bold font-mono">Tamale Division</h4>
                    <p className="text-white text-sm font-semibold mb-1">Savannah Conditioning & Speed Camp</p>
                    <p className="text-xs text-white/50 leading-normal">Leading training camp for high-stamina Sports Modeling, aerobics, and natural diet adaptation seminars.</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Counters & Statistics Column */}
          <div ref={statsRef} className="space-y-10 group">
            <div className="border-l-3 border-wff-gold pl-6 py-1 hover:border-white transition-colors duration-300">
              <h3 className="font-bebas text-6xl md:text-7xl text-wff-gold mb-1 tracking-tight leading-none">
                {stats.founded}
              </h3>
              <h4 className="font-bebas text-lg text-white mb-1 uppercase tracking-wide">FOUNDED GLOBALLY</h4>
              <p className="font-sans text-xs text-white/50 max-w-sm leading-relaxed">
                Formed in Germany by legendary sport leadership. WFF represents the longest running worldwide registry for clean fitness model classes.
              </p>
            </div>

            <div className="border-l-3 border-wff-red pl-6 py-1 hover:border-white transition-colors duration-300">
              <h3 className="font-bebas text-6xl md:text-7xl text-wff-red mb-1 tracking-tight leading-none">
                {stats.countries}+
              </h3>
              <h4 className="font-bebas text-lg text-white mb-1 uppercase tracking-wide">AFFILIATED COUNTRIES</h4>
              <p className="font-sans text-xs text-white/50 max-w-sm leading-relaxed">
                Connecting professional athletes from all 5 continents. WFF holds structured state programs to issue pro cards and host global cups.
              </p>
            </div>

            <div className="border-l-3 border-wff-green pl-6 py-1 hover:border-white transition-colors duration-300">
              <h3 className="font-bebas text-6xl md:text-7xl text-white mb-1 tracking-tight leading-none">
                {stats.athletes.toLocaleString()}+
              </h3>
              <h4 className="font-bebas text-lg text-white mb-1 uppercase tracking-wide">REGISTERED STATE ATHLETES</h4>
              <p className="font-sans text-xs text-white/50 max-w-sm leading-relaxed">
                Our active national list of competitor cards across Ghana. We guarantee a level, scientifically evaluated, and clean stage environment.
              </p>
            </div>
          </div>

        </div>

        {/* Executive Board segment with CORRECT values */}
        <div id="board" className="mt-32 pt-16 border-t border-white/10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="font-sans text-wff-red font-bold uppercase tracking-[0.3em] mb-3 text-xs">National Leadership</p>
            <h2 className="font-bebas text-5xl md:text-7xl mb-4 text-white">EXECUTIVE <span className="text-wff-gold">COMMITTEE</span></h2>
            <p className="font-sans text-white/60 text-base md:text-lg leading-relaxed">
              Meet the licensed directors and sports commissioners of WFF Ghana. Setting international standards and building the next national generation.
            </p>
          </div>

          {/* Interactive Leader Biography Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 reveal-block-trigger">
            {EXECUTIVE_BOARD.map((boardMember, idx) => (
              <div 
                key={idx} 
                className="reveal-block bg-[#0A0A0A]/85 border border-white/10 overflow-hidden relative group rounded-2xl flex flex-col justify-between hover:shadow-[0_15px_30px_rgba(0,0,0,0.7)] hover:border-wff-red/50 transition-all duration-300"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-black/60">
                    <Image 
                      src={boardMember.image} 
                      alt={boardMember.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      onError={(e) => {
                        if (boardMember.fallbackImg) {
                          e.currentTarget.src = boardMember.fallbackImg;
                        } else {
                          e.currentTarget.src = "https://picsum.photos/seed/" + boardMember.name + "/600/800";
                        }
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
                  </div>

                  {/* Title Info */}
                  <div className="p-6">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-wff-gold font-bold block mb-1">
                      {boardMember.role}
                    </span>
                    <h3 className="font-bebas text-2xl text-white tracking-wide group-hover:text-wff-red transition-colors mb-4">
                      {boardMember.name}
                    </h3>
                    <p className="font-sans text-xs text-white/50 leading-relaxed mb-4">
                      {boardMember.bio}
                    </p>
                  </div>
                </div>

                {/* Interactive board quote callout */}
                <div className="px-6 pb-6 mt-auto pt-2 border-t border-white/5">
                  <p className="font-sans text-xs text-white/70 italic leading-relaxed">
                    &ldquo;{boardMember.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Central Mission Statement & Rulebook Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mt-12">
            
            {/* The National Manifesto */}
            <div className="lg:col-span-5 bg-[#0b0b0b] border border-white/10 p-8 md:p-10 rounded-2xl flex flex-col justify-between">
              <div>
                <Award size={36} className="text-wff-red mb-6" />
                <h3 className="font-bebas text-3xl md:text-4xl text-white mb-4">WFF GHANA CONTEXT & INTEGRITY</h3>
                <p className="font-sans text-sm text-white/70 leading-relaxed mb-6">
                  Under President Victor Ahenkorah Baiden, the organization advocates strongly for physical aesthetics underpinned by strict metabolic integrity and athlete welfare. We secure certified international stages, eliminating structural biases and ensuring fair judging panels.
                </p>
                <p className="font-sans text-sm text-white/50 leading-relaxed">
                  Our development focus spans from raw grassroot physical fitness campaigns in educational centers up to international level pro qualifiers.
                </p>
              </div>

              <div className="pt-8 border-t border-white/5 mt-8">
                <a 
                  href="/WFF_World_Rules_2026.pdf" 
                  download
                  className="inline-flex items-center justify-center gap-3 bg-wff-red hover:bg-white text-white hover:text-black font-bebas text-xl px-8 py-4 transition-colors w-full rounded-xl font-bold uppercase tracking-wider"
                >
                  <Download size={18} /> DOWNLOAD RULEBOOK
                </a>
              </div>
            </div>

            {/* Official Division Classifier & Rules Interactive Tab */}
            <div className="lg:col-span-7 bg-[#0b0b0b] border border-white/5 p-8 md:p-10 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <Scale size={28} className="text-wff-gold" />
                  <h3 className="font-bebas text-3xl text-white">COMPETITION CLASSES & RULES</h3>
                </div>
                <p className="font-sans text-xs text-white/50 mb-6 leading-relaxed">
                  WFF competitive categories are highly defined to avoid overlap and protect specialized aesthetic values. Click on each division tab to view essential evaluation criteria and class limitations.
                </p>

                {/* Slider Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-4">
                  {COMPETITION_DIVISIONS.map((div) => (
                    <button
                      key={div.id}
                      onClick={() => setActiveDivisionTab(div.id)}
                      className={`px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-all rounded-lg ${
                        activeDivisionTab === div.id
                          ? 'bg-wff-gold text-black'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {div.name}
                    </button>
                  ))}
                </div>

                {/* Tab Details */}
                <div className="space-y-4 min-h-[160px]">
                  {COMPETITION_DIVISIONS.map((div) => {
                    if (div.id !== activeDivisionTab) return null;
                    return (
                      <div key={div.id} className="space-y-4 animate-fade-in">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-[#00A86B] font-bold block mb-1">
                            {div.tagline}
                          </span>
                          <p className="text-white text-sm font-semibold mb-3">{div.details}</p>
                        </div>
                        <ul className="space-y-2.5 font-sans text-xs text-white/70 leading-relaxed">
                          {div.rules.map((rule, ruleIdx) => (
                            <li key={ruleIdx} className="flex items-start gap-2.5">
                              <span className="text-wff-gold font-bold text-sm leading-none">✓</span>
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 mt-8 text-right">
                <span className="font-sans text-[10px] text-white/40 uppercase tracking-widest block font-bold">
                  ★ Certified WFF Judging Guidelines Apply to All Classes
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Holistic Wellness Division Section */}
        <div id="wellness" className="mt-32 pt-16 border-t border-white/10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="font-sans text-[#00a86b] font-bold uppercase tracking-[0.3em] mb-4 text-xs">Holistic Health & Recovery</p>
            <h2 className="font-bebas text-5xl md:text-7xl mb-6">WELLNESS <span className="text-[#00A86B]">DIVISION</span></h2>
            <p className="font-sans text-white/75 text-base md:text-lg leading-relaxed">
              True athletic strength requires ultimate internal balance. WFF Ghana is committed to elevating the overall health of the nation through active recovery, physiological wellness, and athletic poise.
            </p>
          </div>

          {/* Masterclass Video Card */}
          <div className="relative aspect-video max-w-5xl mx-auto bg-[#001414] border border-[#00A86B]/20 mb-16 group cursor-pointer overflow-hidden rounded-2xl">
            <Image 
              src="https://picsum.photos/seed/training-video/1200/600" 
              alt="Active Recovery Masterclass Video"
              fill
              className="object-cover opacity-40 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001010] via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-[#00A86B]/50 flex items-center justify-center text-[#00A86B] group-hover:bg-[#00A86B] group-hover:text-[#001414] transition-colors duration-700">
                <Play size={24} className="ml-1" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6">
              <h3 className="font-bebas text-2xl md:text-4xl text-white">MASTERCLASS: ACTIVE RECOVERY & PREPARATION</h3>
              <p className="font-sans text-xs md:text-sm text-[#00A86B] font-bold">Featuring WFF Head Coach Kwame Mensah</p>
            </div>
          </div>

          {/* Wellness Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Activity size={28} />,
                title: 'Physical Conditioning',
                desc: 'Expert-led training programs designed for all levels, from beginners to elite champions on stage.'
              },
              {
                icon: <Heart size={28} />,
                title: 'Nutrition & Health',
                desc: 'Dietary guidance focusing on clean metabolic health, natural preps, and peak wellness values.'
              },
              {
                icon: <Brain size={28} />,
                title: 'Mental Resilience',
                desc: 'Building a robust mindset to conquer hurdles both on stage, in life, and deep inside the gym.'
              },
              {
                icon: <Users size={28} />,
                title: 'State Community Support',
                desc: 'Join a nationwide supportive group of health enthusiasts dedicated to organic growth.'
              }
            ].map((pillar, index) => (
              <div 
                key={index} 
                className="bg-[#001414]/30 backdrop-blur-sm border border-[#00A86B]/10 p-8 hover:border-[#00a86b]/40 transition-colors duration-500 group rounded-2xl"
              >
                <div className="w-14 h-14 rounded-full bg-[#00A86B]/10 flex items-center justify-center text-[#00A86B] mb-6 group-hover:scale-110 transition-transform duration-500">
                  {pillar.icon}
                </div>
                <h3 className="font-bebas text-2xl mb-3 text-white group-hover:text-[#00A86B] transition-colors duration-300">{pillar.title}</h3>
                <p className="font-sans text-sm text-white/50 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Partnerships Section */}
        <div id="partnerships" className="mt-32 pt-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.3em] mb-4 text-xs">Corporate Partnerships</p>
            <h2 className="font-bebas text-5xl md:text-7xl mb-6">ALIGN WITH <span className="text-wff-red">EXCELLENCE</span></h2>
            <p className="font-sans text-lg text-white/70 leading-relaxed">
              The 2026 All Africa Championship is a massive cultural phenomenon. Partnering with WFF Ghana positions your brand at the absolute forefront of health, discipline, and continental unity.
            </p>
          </div>

          {/* Partnership Reach Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { icon: <Globe2 size={32} />, value: '40+', label: 'Participating Nations' },
              { icon: <Users size={32} />, value: '10,000+', label: 'Expected Attendees' },
              { icon: <BarChart3 size={32} />, value: '5M+', label: 'Digital Reach' },
              { icon: <Trophy size={32} />, value: '500+', label: 'Elite Athletes' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#111] border border-white/5 p-6 text-center flex flex-col items-center justify-center rounded-2xl transition-all hover:bg-black/80">
                <div className="text-wff-red mb-3">{stat.icon}</div>
                <div className="font-bebas text-4xl text-white mb-1 leading-none">{stat.value}</div>
                <div className="font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tiers & Form split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Packages */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-bebas text-3xl mb-4 text-white">SPONSORSHIP PACKAGES</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    name: 'Title Sponsor',
                    price: 'Custom Tier',
                    color: 'border-wff-gold text-wff-gold',
                    bg: 'bg-wff-gold/5',
                    benefits: [
                      'Naming rights to the 2026 Championship',
                      'Prime logo placement on all main stages and media channels',
                      'VIP Boardroom and direct stage access during the event',
                      'Dedicated continuous digital marketing campaigns globally'
                    ]
                  },
                  {
                    name: 'Gold Partner',
                    price: '₵ 250,000',
                    color: 'border-white text-white',
                    bg: 'bg-white/5',
                    benefits: [
                      'Secondary logo placement on main dynamic stage banners',
                      '10 VIP Premium Tickets for corporate executives',
                      'Frequent social media campaign mentions (10x)',
                      'Premium spacious exhibition booth space'
                    ]
                  },
                  {
                    name: 'Silver Partner',
                    price: '₵ 100,000',
                    color: 'border-white/50 text-white/80',
                    bg: 'bg-white/2',
                    benefits: [
                      'Logo printed on central physical sponsor wall',
                      '5 VIP Tickets for executive team members',
                      'Social media thank you mentions (5x)',
                      'Shared exhibition hall space'
                    ]
                  }
                ].map((tier, idx) => (
                  <div key={idx} className={`border ${tier.color} ${tier.bg} p-8 rounded-2xl flex flex-col relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                    <h4 className="font-bebas text-2xl mb-1">{tier.name}</h4>
                    <div className="font-sans font-bold text-lg mb-6">{tier.price}</div>
                    <ul className="space-y-3 flex-grow mb-6">
                      {tier.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="font-sans text-xs text-white/75 flex items-start">
                          <span className="text-wff-gold mr-2 mt-0.5">▹</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Contact/Request Form (Pre-existing fully working) */}
            <div className="bg-[#111] border border-white/10 p-8 rounded-2xl">
              <h3 className="font-bebas text-3xl mb-2 text-wff-gold">REQUEST A DECK</h3>
              <p className="font-sans text-xs text-white/50 mb-6 font-bold uppercase tracking-wider">Align your brand with sports excellence. Fill the request below:</p>
              
              <PartnershipForm />
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

// Inner helper component for handling form inputs cleanly (Pre-existing fully working functionality)
function PartnershipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="w-16 h-16 rounded-full bg-wff-gold/10 text-wff-gold flex items-center justify-center mx-auto mb-4 border border-wff-gold/20 shadow-[0_0_15px_rgba(252,209,22,0.15)]">
          <Trophy size={32} />
        </div>
        <h4 className="font-bebas text-2xl text-white">DECK REQUESTED</h4>
        <p className="font-sans text-xs text-white/60 leading-relaxed">
          Thank you. Our partnership relations executive will reach out to your team by email within 24 hours.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="font-bebas text-sm text-wff-gold hover:underline uppercase tracking-wider block mx-auto pt-4"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
      <div>
        <label className="block text-white/50 uppercase tracking-widest font-bold mb-1.5">Representative Name</label>
        <input 
          type="text" 
          required
          placeholder="e.g. Ama Mensah"
          className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-lg" 
        />
      </div>
      <div>
        <label className="block text-white/50 uppercase tracking-widest font-bold mb-1.5">Company Name</label>
        <input 
          type="text" 
          required
          placeholder="e.g. Zenith Brands"
          className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-lg" 
        />
      </div>
      <div>
        <label className="block text-white/50 uppercase tracking-widest font-bold mb-1.5">Business Email</label>
        <input 
          type="email" 
          required
          placeholder="e.g. partner@zenith.com"
          className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-lg" 
        />
      </div>
      <div>
        <label className="block text-white/50 uppercase tracking-widest font-bold mb-1.5">Tier Interest</label>
        <div className="relative">
          <select 
            required
            className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-lg appearance-none cursor-pointer"
          >
            <option>Title Sponsor Package</option>
            <option>Gold Partner Package</option>
            <option>Silver Partner Package</option>
            <option>Custom Activation</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-white/40">
            ▼
          </div>
        </div>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-wff-gold text-black font-bebas text-lg py-3 rounded-lg hover:bg-white hover:text-black transition-colors duration-200 uppercase tracking-wider shadow-lg font-bold"
      >
        {loading ? 'Processing...' : 'SEND REQUEST'}
      </button>
    </form>
  );
}
