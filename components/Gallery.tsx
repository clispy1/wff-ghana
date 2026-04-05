'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const images = [
  { id: 1, src: 'https://picsum.photos/seed/gallery1/800/600', aspect: 'aspect-[4/3]' },
  { id: 2, src: 'https://picsum.photos/seed/gallery2/600/800', aspect: 'aspect-[3/4]' },
  { id: 3, src: 'https://picsum.photos/seed/gallery3/800/800', aspect: 'aspect-square' },
  { id: 4, src: 'https://picsum.photos/seed/gallery4/800/1200', aspect: 'aspect-[2/3]' },
  { id: 5, src: 'https://picsum.photos/seed/gallery5/1200/800', aspect: 'aspect-[3/2]' },
  { id: 6, src: 'https://picsum.photos/seed/gallery6/600/600', aspect: 'aspect-square' },
  { id: 7, src: 'https://picsum.photos/seed/gallery7/800/1000', aspect: 'aspect-[4/5]' },
  { id: 8, src: 'https://picsum.photos/seed/gallery8/1000/600', aspect: 'aspect-[5/3]' },
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll('.gallery-item');
        gsap.fromTo(items,
          { opacity: 0, scale: 0.8, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') setSelectedIndex((selectedIndex + 1) % images.length);
      if (e.key === 'ArrowLeft') setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
      if (e.key === 'Escape') setSelectedIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return (
    <section id="gallery" ref={sectionRef} className="py-24 bg-wff-dark relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-bebas text-5xl md:text-6xl mb-4">STAGE <span className="text-wff-red">MOMENTS</span></h2>
          <p className="font-sans text-white/60 max-w-2xl mx-auto">Highlights from past qualifiers and international appearances.</p>
        </div>

        {/* Masonry-ish Grid using CSS columns */}
        <div ref={gridRef} className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, index) => (
            <div 
              key={img.id} 
              className="gallery-item relative w-full overflow-hidden group cursor-pointer break-inside-avoid"
              onClick={() => setSelectedIndex(index)}
            >
              <div className={`relative w-full ${img.aspect}`}>
                <Image 
                  src={img.src} 
                  alt={`Gallery image ${img.id}`}
                  fill
                  className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-wff-red/0 group-hover:bg-wff-red/20 transition-colors duration-500 mix-blend-multiply"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Maximize2 className="text-white drop-shadow-lg" size={32} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50"
            onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
          >
            <X size={32} />
          </button>

          <button 
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-4"
            onClick={handlePrev}
          >
            <ChevronLeft size={48} />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] px-16" onClick={(e) => e.stopPropagation()}>
            <Image 
              src={images[selectedIndex].src} 
              alt={`Gallery image ${images[selectedIndex].id}`}
              fill
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <button 
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-4"
            onClick={handleNext}
          >
            <ChevronRight size={48} />
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans text-white/50 tracking-widest text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}
