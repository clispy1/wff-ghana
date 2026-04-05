'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import gsap from 'gsap';

const athletes = [
  {
    id: 1,
    name: 'Kofi Mensah',
    category: 'Men\'s Bodybuilding',
    weightClass: 'Over 90kg',
    image: 'https://picsum.photos/seed/kofi/600/800',
    bio: 'A veteran of the Ghanaian bodybuilding scene, Kofi brings unmatched mass and conditioning. He is a 3-time national champion aiming for his pro card in Cameroon.',
    achievements: ['2025 WFF Ghana Overall Champion', '2024 West African Classic Winner']
  },
  {
    id: 2,
    name: 'Ama Osei',
    category: 'Bikini',
    weightClass: 'Open',
    image: 'https://picsum.photos/seed/ama/600/800',
    bio: 'Ama\'s perfect symmetry and stage presence make her a standout in the Bikini division. She has been training for 4 years and is ready for the world stage.',
    achievements: ['2025 WFF Ghana Bikini Champion', '2025 Arnold Classic Africa Top 5']
  },
  {
    id: 3,
    name: 'Kwesi Appiah',
    category: 'Classic Physique',
    weightClass: 'Under 85kg',
    image: 'https://picsum.photos/seed/kwesi/600/800',
    bio: 'Embodying the golden era of bodybuilding, Kwesi focuses on aesthetics, tiny waist, and wide shoulders. His posing routines are legendary.',
    achievements: ['2025 WFF Ghana Classic Physique Winner']
  },
  {
    id: 4,
    name: 'Abena Yeboah',
    category: 'Sports Modelling',
    weightClass: 'Open',
    image: 'https://picsum.photos/seed/abena/600/800',
    bio: 'Abena combines athletic performance with fitness modeling. Her dynamic routines and athletic build make her a top contender.',
    achievements: ['2024 WFF Universe Top 10', '2025 WFF Ghana Sports Model Winner']
  }
];

export default function Athletes() {
  const [selectedAthlete, setSelectedAthlete] = useState<typeof athletes[0] | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="athletes" className="py-24 bg-[#050505] relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-bebas text-5xl md:text-6xl mb-4">TEAM <span className="text-wff-red">GHANA</span> ROSTER</h2>
          <p className="font-sans text-white/60 max-w-2xl mx-auto">Meet the elite athletes representing Ghana on the international stage.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {athletes.map((athlete) => (
            <div 
              key={athlete.id}
              className="relative aspect-[3/4] cursor-pointer group"
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
            </div>
          ))}
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
    </section>
  );
}
