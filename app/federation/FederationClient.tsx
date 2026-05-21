'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Heart, Activity, Brain, Users, BarChart3, Globe2, Trophy, Mail, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FederationClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const mapTextRef = useRef<SVGTextElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const [stats, setStats] = useState({
    founded: 0,
    countries: 0,
    athletes: 0
  });

  const statsObj = useRef({ founded: 0, countries: 0, athletes: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Color Shift (Act 1 - Earthy)
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => gsap.to(document.documentElement, { '--bg-color': '#1A0F00', duration: 1 }), // Deep brown
        onLeaveBack: () => gsap.to(document.documentElement, { '--bg-color': '#050505', duration: 1 }),
        onLeave: () => gsap.to(document.documentElement, { '--bg-color': '#050505', duration: 1 }),
        onEnterBack: () => gsap.to(document.documentElement, { '--bg-color': '#1A0F00', duration: 1 }),
      });

      // Ghost Text Parallax
      gsap.to('.ghost-text', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Header Animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%'
          }
        }
      );

      // SVG Map Animation
      if (mapRef.current && pulseRef.current && mapTextRef.current) {
        const length = mapRef.current.getTotalLength();
        gsap.set(mapRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(pulseRef.current, { scale: 0, opacity: 0, transformOrigin: 'center' });
        gsap.set(mapTextRef.current, { opacity: 0, y: 10 });

        const mapTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.map-container',
            start: 'top 60%',
          }
        });

        mapTl.to(mapRef.current, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' })
             .to(pulseRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' })
             .to(pulseRef.current, { scale: 2, opacity: 0, duration: 1, repeat: -1 }, '+=0.2')
             .to(mapTextRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=1');
      }

      // Stats Counter
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(statsObj.current, {
              founded: 1968,
              countries: 42,
              athletes: 5000,
              duration: 2,
              ease: 'power2.out',
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

      // Content Animation
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-wff-dark">
      
      {/* Ghosted Background Text */}
      <div className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-between overflow-hidden opacity-[0.03]">
        <h2 className="ghost-text font-bebas text-[20vw] leading-none text-white whitespace-nowrap -ml-20">GHANA</h2>
        <h2 className="ghost-text font-bebas text-[20vw] leading-none text-white whitespace-nowrap ml-20">ROOTS</h2>
        <h2 className="ghost-text font-bebas text-[20vw] leading-none text-white whitespace-nowrap -ml-10">STRONG</h2>
      </div>

      {/* Ambient Gold Glow Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(252,209,22,0.12) 0%, transparent 70%)' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-24 opacity-0">
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">THE <span className="text-wff-gold">FEDERATION</span></h1>
          <p className="font-sans text-xl text-white/70">
            Grounded in culture. Forged in discipline. WFF Ghana is the official national chapter of the World Fitness Federation.
          </p>
        </div>

        {/* Map & Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          
          {/* Animated SVG Map */}
          <div className="map-container relative aspect-square flex items-center justify-center bg-[#111]/50 border border-white/5 p-8 rounded-full backdrop-blur-sm shadow-2xl">
            <svg width="100%" height="100%" viewBox="0 0 200 250" className="overflow-visible">
              {/* Simplified Ghana Map Path */}
              <path 
                ref={mapRef}
                d="M50,200 C30,150 20,100 50,50 C80,20 150,30 180,80 C200,120 180,180 150,220 C100,250 70,230 50,200 Z" 
                fill="transparent" 
                stroke="#FCD116" 
                strokeWidth="2"
              />
              {/* Accra Pulse */}
              <circle ref={pulseRef} cx="120" cy="200" r="8" fill="#CE1126" />
              {/* Text */}
              <text ref={mapTextRef} x="120" y="230" fill="white" fontSize="12" fontFamily="sans-serif" textAnchor="middle" className="uppercase tracking-widest opacity-70">
                This is where champions are made
              </text>
            </svg>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="space-y-12">
            <div className="border-l-2 border-wff-gold pl-6">
              <h3 className="font-bebas text-6xl text-wff-gold mb-2">{stats.founded}</h3>
              <p className="font-sans text-sm uppercase tracking-widest text-white/50">Year Founded (Global)</p>
            </div>
            <div className="border-l-2 border-wff-red pl-6">
              <h3 className="font-bebas text-6xl text-wff-red mb-2">{stats.countries}+</h3>
              <p className="font-sans text-sm uppercase tracking-widest text-white/50">Participating African Nations</p>
            </div>
            <div className="border-l-2 border-white pl-6">
              <h3 className="font-bebas text-6xl text-white mb-2">{stats.athletes.toLocaleString()}+</h3>
              <p className="font-sans text-sm uppercase tracking-widest text-white/50">Registered Athletes</p>
            </div>
          </div>

        </div>

        {/* Content */}
        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="relative aspect-[3/4] bg-[#111] border border-white/10 overflow-hidden group rounded-xl">
            <Image 
              src="https://picsum.photos/seed/boardroom/800/1200" 
              alt="WFF Ghana Executive"
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-bebas text-4xl mb-1 text-white">KWAME MENSAH</h3>
              <p className="font-sans text-wff-gold font-bold uppercase tracking-widest text-sm">President, WFF Ghana</p>
            </div>
          </div>

          <div className="space-y-12 bg-[#0A0A0A]/80 backdrop-blur-md p-8 md:p-12 border border-white/5 rounded-xl">
            <div>
              <h2 className="font-bebas text-4xl mb-4 text-wff-red">OUR MISSION</h2>
              <p className="font-sans text-white/70 leading-relaxed text-lg">
                To provide a world-class platform for Ghanaian athletes to showcase their hard work, dedication, and aesthetic excellence on the global stage. We believe in fair judging, athlete welfare, and community building.
              </p>
            </div>
            <div>
              <h2 className="font-bebas text-4xl mb-4 text-wff-gold">THE LEGACY</h2>
              <p className="font-sans text-white/70 leading-relaxed text-lg">
                The World Fitness Federation (WFF) was founded in 1968 in Germany. Today, WFF Ghana carries that legacy forward, bringing international standards to local competitions and preparing our national team to dominate globally.
              </p>
            </div>
            <div className="pt-8 border-t border-white/10">
              <button className="border border-wff-gold text-wff-gold font-bebas text-xl px-8 py-4 hover:bg-wff-gold hover:text-black transition-colors w-full md:w-auto">
                DOWNLOAD RULEBOOK
              </button>
            </div>
          </div>
        </div>

        {/* Holistic Wellness Division Section */}
        <div id="wellness" className="mt-32 pt-16 border-t border-white/10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="font-sans text-[#00A86B] font-bold uppercase tracking-[0.3em] mb-4">Holistic Health</p>
            <h2 className="font-bebas text-5xl md:text-7xl mb-6">WELLNESS <span className="text-[#00A86B]">DIVISION</span></h2>
            <p className="font-sans text-white/70 text-lg leading-relaxed">
              True strength is balanced. WFF Ghana is committed to elevating the overall health and wellness of the nation through recovery, sustainable nutrition, and athletic poise.
            </p>
          </div>

          {/* Masterclass Video Card */}
          <div className="relative aspect-video max-w-5xl mx-auto bg-[#001A1A] border border-[#00A86B]/20 mb-16 group cursor-pointer overflow-hidden rounded-xl">
            <Image 
              src="https://picsum.photos/seed/training-video/1200/600" 
              alt="Training Video"
              fill
              className="object-cover opacity-40 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001414] via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-[#00A86B]/50 flex items-center justify-center text-[#00A86B] group-hover:bg-[#00A86B] group-hover:text-[#001414] transition-colors duration-700">
                <Play size={24} className="ml-1" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="font-bebas text-2xl md:text-4xl text-white">MASTERCLASS: ACTIVE RECOVERY & PREPARATION</h3>
              <p className="font-sans text-xs md:text-sm text-[#00A86B]">Featuring Head Coach Kwame Mensah</p>
            </div>
          </div>

          {/* Wellness Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Activity size={28} />,
                title: 'Physical Conditioning',
                desc: 'Expert-led training programs designed for all levels, from beginners to elite athletes.'
              },
              {
                icon: <Heart size={28} />,
                title: 'Nutrition & Health',
                desc: 'Holistic dietary guidance focusing on sustainable wellness and peak performance.'
              },
              {
                icon: <Brain size={28} />,
                title: 'Mental Resilience',
                desc: 'Building the mindset required to conquer challenges both in the gym and in life.'
              },
              {
                icon: <Users size={28} />,
                title: 'Community Support',
                desc: 'Join a nationwide network of fitness enthusiasts dedicated to uplifting one another.'
              }
            ].map((pillar, index) => (
              <div 
                key={index} 
                className="bg-[#001A1A]/30 backdrop-blur-sm border border-[#00A86B]/10 p-8 hover:border-[#00A86B]/40 transition-colors duration-500 group rounded-xl"
              >
                <div className="w-14 h-14 rounded-full bg-[#00A86B]/10 flex items-center justify-center text-[#00A86B] mb-6 group-hover:scale-105 transition-transform duration-500">
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
            <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.3em] mb-4">Corporate Partnerships</p>
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
              <div key={idx} className="bg-[#111] border border-white/5 p-6 text-center flex flex-col items-center justify-center rounded-xl">
                <div className="text-wff-red mb-3">{stat.icon}</div>
                <div className="font-bebas text-4xl text-white mb-1">{stat.value}</div>
                <div className="font-sans text-[10px] uppercase tracking-widest text-white/40">{stat.label}</div>
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
                      'Prime logo placement on all main stages and media',
                      'VIP Boardroom access during the event',
                      'Dedicated continuous digital marketing campaigns'
                    ]
                  },
                  {
                    name: 'Gold Partner',
                    price: '₵ 250,000',
                    color: 'border-white text-white',
                    bg: 'bg-white/5',
                    benefits: [
                      'Secondary logo placement on main stage',
                      '10 VIP Tickets for executives',
                      'Social media mentions (10x)',
                      'Premium exhibition booth space'
                    ]
                  },
                  {
                    name: 'Silver Partner',
                    price: '₵ 100,000',
                    color: 'border-white/50 text-white/80',
                    bg: 'bg-white/2',
                    benefits: [
                      'Logo printed on central sponsor wall',
                      '5 VIP Tickets for team members',
                      'Social media thank you mentions (5x)',
                      'Shared exhibition hall space'
                    ]
                  }
                ].map((tier, idx) => (
                  <div key={idx} className={`border ${tier.color} ${tier.bg} p-8 rounded-xl flex flex-col relative overflow-hidden group`}>
                    <h4 className="font-bebas text-2xl mb-1">{tier.name}</h4>
                    <div className="font-sans font-bold text-lg mb-6">{tier.price}</div>
                    <ul className="space-y-3 flex-grow mb-6">
                      {tier.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="font-sans text-xs text-white/70 flex items-start">
                          <span className="text-wff-gold mr-2 mt-0.5">▹</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Contact/Request Form */}
            <div className="bg-[#111] border border-white/10 p-8 rounded-xl">
              <h3 className="font-bebas text-3xl mb-2 text-wff-gold">REQUEST A DECK</h3>
              <p className="font-sans text-xs text-white/50 mb-6">Align your brand with sports excellence. Fill the request below:</p>
              
              <PartnershipForm />
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

// Inner helper component for handling form inputs cleanly
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
          className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-md" 
        />
      </div>
      <div>
        <label className="block text-white/50 uppercase tracking-widest font-bold mb-1.5">Company Name</label>
        <input 
          type="text" 
          required
          placeholder="e.g. Zenith Brands"
          className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-md" 
        />
      </div>
      <div>
        <label className="block text-white/50 uppercase tracking-widest font-bold mb-1.5">Business Email</label>
        <input 
          type="email" 
          required
          placeholder="e.g. partner@zenith.com"
          className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-md" 
        />
      </div>
      <div>
        <label className="block text-white/50 uppercase tracking-widest font-bold mb-1.5">Tier Interest</label>
        <select 
          required
          className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-md appearance-none"
        >
          <option>Title Sponsor Package</option>
          <option>Gold Partner Package</option>
          <option>Silver Partner Package</option>
          <option>Custom Activation</option>
        </select>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-wff-gold text-black font-bebas text-lg py-3 rounded-md hover:bg-white hover:text-black transition-colors duration-200 uppercase tracking-wider shadow-lg font-bold"
      >
        {loading ? 'Processing...' : 'SEND REQUEST'}
      </button>
    </form>
  );
}
