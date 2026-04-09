'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Music, FileText } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import ParticleSilhouette from '@/components/ParticleSilhouette';

gsap.registerPlugin(ScrollTrigger);

const athletes = [
  {
    id: 1,
    name: 'Kofi Mensah',
    category: 'Men\'s Bodybuilding',
    weightClass: 'Over 90kg',
    image: '/award-1.jpg',
    bio: 'A veteran of the Ghanaian bodybuilding scene, Kofi brings unmatched mass and conditioning. He is a 3-time national champion aiming for his pro card.',
    achievements: ['2025 WFF Ghana Overall Champion', '2024 West African Classic Winner']
  },
  {
    id: 2,
    name: 'Ama Osei',
    category: 'Bikini',
    weightClass: 'Open',
    image: '/culture-1.jpg',
    bio: 'Ama\'s perfect symmetry and stage presence make her a standout in the Bikini division. She has been training for 4 years and is ready for the world stage.',
    achievements: ['2025 WFF Ghana Bikini Champion', '2025 Arnold Classic Africa Top 5']
  },
  {
    id: 3,
    name: 'Kwesi Appiah',
    category: 'Classic Physique',
    weightClass: 'Under 85kg',
    image: '/award-4.jpg',
    bio: 'Embodying the golden era of bodybuilding, Kwesi focuses on aesthetics, tiny waist, and wide shoulders. His posing routines are legendary.',
    achievements: ['2025 WFF Ghana Classic Physique Winner']
  },
  {
    id: 4,
    name: 'Abena Yeboah',
    category: 'Sports Modelling',
    weightClass: 'Open',
    image: '/culture-2.jpg',
    bio: 'Abena combines athletic performance with fitness modeling. Her dynamic routines and athletic build make her a top contender.',
    achievements: ['2024 WFF Universe Top 10', '2025 WFF Ghana Sports Model Winner']
  }
];

export default function AthletesClient() {
  const [selectedAthlete, setSelectedAthlete] = useState<typeof athletes[0] | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rosterRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      ease: 'power2.out',
      duration: 0.5
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      ease: 'power2.out',
      duration: 0.5
    });
  };

  useEffect(() => {
    if (selectedAthlete && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
      );
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedAthlete]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      if (rosterRef.current) {
        const cards = rosterRef.current.querySelectorAll('.athlete-card');
        gsap.fromTo(cards,
          { opacity: 0, rotationY: 90, z: -200 },
          {
            opacity: 1,
            rotationY: 0,
            z: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: rosterRef.current,
              start: 'top 70%',
            }
          }
        );
      }

      if (portalRef.current) {
        gsap.fromTo(portalRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: portalRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-wff-dark relative overflow-hidden">
      
      {/* 3D Particle Silhouette Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none flex items-center justify-center">
        <div className="w-[100vw] h-[100vh] md:w-[50vw]">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ParticleSilhouette />
          </Canvas>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-24 opacity-0">
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">TEAM <span className="text-wff-red">GHANA</span> ROSTER</h1>
          <p className="font-sans text-xl text-white/70">
            Meet the elite athletes defending the home turf.
          </p>
        </div>

        {/* Roster Grid */}
        <div ref={rosterRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32" style={{ perspective: '2000px' }}>
          {athletes.map((athlete) => (
            <div 
              key={athlete.id}
              className="athlete-card relative aspect-[3/4] cursor-pointer group rounded-sm overflow-hidden border border-white/10 bg-[#111]"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setSelectedAthlete(athlete)}
            >
              <Image 
                src={athlete.image} 
                alt={athlete.name}
                fill
                className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/${athlete.name.replace(/\s+/g, '')}/600/800`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">🇬🇭</span>
                  <span className="font-sans text-xs uppercase tracking-widest text-wff-gold">{athlete.category}</span>
                </div>
                <h3 className="font-bebas text-3xl text-white mb-1">{athlete.name}</h3>
                <p className="font-sans text-sm text-white/60">{athlete.weightClass}</p>
              </div>
              
              {/* Decorative corner accents */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-wff-red opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-wff-red opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Athlete Portal / Registration */}
        <div ref={portalRef} className="max-w-5xl mx-auto bg-[#111] border border-white/10 p-8 md:p-12 opacity-0">
          <div className="text-center mb-12">
            <h2 className="font-bebas text-5xl mb-4">ATHLETE <span className="text-wff-gold">PORTAL</span></h2>
            <p className="font-sans text-white/60">Register for the 2026 All Africa Championship and manage your logistics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Registration Form */}
            <div>
              <h3 className="font-bebas text-3xl mb-6 border-b border-white/10 pb-4">REGISTRATION</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">First Name</label>
                    <input type="text" className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white focus:border-wff-red outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Last Name</label>
                    <input type="text" className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white focus:border-wff-red outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Country</label>
                  <select className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white focus:border-wff-red outline-none transition-colors appearance-none">
                    <option>Ghana</option>
                    <option>Nigeria</option>
                    <option>South Africa</option>
                    <option>Egypt</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Category</label>
                  <select className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white focus:border-wff-red outline-none transition-colors appearance-none">
                    <option>Men&apos;s Bodybuilding</option>
                    <option>Classic Physique</option>
                    <option>Men&apos;s Physique</option>
                    <option>Bikini</option>
                    <option>Sports Model</option>
                  </select>
                </div>
                <button type="button" className="w-full bg-wff-red text-white font-bebas text-xl py-4 hover:bg-white hover:text-wff-dark transition-colors mt-4">
                  PROCEED TO PAYMENT
                </button>
              </form>
            </div>

            {/* Logistics */}
            <div>
              <h3 className="font-bebas text-3xl mb-6 border-b border-white/10 pb-4">LOGISTICS UPLOAD</h3>
              <div className="space-y-6">
                <div className="border border-dashed border-white/20 p-6 text-center hover:border-wff-gold transition-colors cursor-pointer group">
                  <Music className="mx-auto mb-3 text-white/50 group-hover:text-wff-gold transition-colors" size={32} />
                  <h4 className="font-bebas text-xl mb-1">POSING MUSIC</h4>
                  <p className="font-sans text-xs text-white/50">MP3 format, max 60 seconds</p>
                </div>
                <div className="border border-dashed border-white/20 p-6 text-center hover:border-wff-gold transition-colors cursor-pointer group">
                  <FileText className="mx-auto mb-3 text-white/50 group-hover:text-wff-gold transition-colors" size={32} />
                  <h4 className="font-bebas text-xl mb-1">PASSPORT / ID</h4>
                  <p className="font-sans text-xs text-white/50">PDF or JPG format</p>
                </div>
                <div className="bg-[#0A0A0A] p-4 border border-white/5">
                  <p className="font-sans text-xs text-white/60 leading-relaxed">
                    <span className="text-wff-red font-bold">NOTE:</span> All uploads must be completed by September 10th, 2026. Failure to upload posing music will result in default house music being played.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal */}
      {selectedAthlete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-wff-dark/90 backdrop-blur-sm">
          <div 
            ref={modalRef}
            className="bg-[#111] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar relative flex flex-col md:flex-row"
          >
            <button 
              onClick={() => setSelectedAthlete(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:text-wff-red transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-full md:w-1/2 relative aspect-[3/4] md:aspect-auto md:h-auto">
              <Image 
                src={selectedAthlete.image} 
                alt={selectedAthlete.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/${selectedAthlete.name.replace(/\s+/g, '')}/600/800`;
                }}
              />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🇬🇭</span>
                <span className="font-sans text-sm uppercase tracking-widest text-wff-gold border border-wff-gold/30 px-3 py-1">
                  {selectedAthlete.category}
                </span>
              </div>
              
              <h3 className="font-bebas text-5xl md:text-6xl mb-2">{selectedAthlete.name}</h3>
              <p className="font-sans text-wff-red uppercase tracking-widest text-sm font-bold mb-8">
                Weight Class: {selectedAthlete.weightClass}
              </p>
              
              <p className="font-sans text-white/70 leading-relaxed mb-8">
                {selectedAthlete.bio}
              </p>

              <div>
                <h4 className="font-bebas text-2xl mb-4 text-white/50">Key Achievements</h4>
                <ul className="space-y-3">
                  {selectedAthlete.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start font-sans text-sm text-white/80">
                      <span className="text-wff-gold mr-3">★</span>
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
