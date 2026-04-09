'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import DistortedImage from '@/components/DistortedImage';

gsap.registerPlugin(ScrollTrigger);

const news = [
  {
    id: 1,
    category: 'Announcements',
    date: 'April 2, 2026',
    title: 'Ghana 2026: Bringing the World Home',
    excerpt: 'WFF International has officially announced Accra, Ghana as the host city for the 2026 All Africa Championship. Here is what it means for Team Ghana.',
    image: 'https://picsum.photos/seed/news1/800/600',
  },
  {
    id: 2,
    category: 'Athlete Spotlight',
    date: 'March 28, 2026',
    title: 'Kofi Mensah Begins Prep for 2026',
    excerpt: 'The 3-time national champion shares his intense 24-week prep protocol as he aims to secure his pro card on home soil.',
    image: 'https://picsum.photos/seed/news2/800/600',
  },
  {
    id: 3,
    category: 'Federation',
    date: 'March 15, 2026',
    title: 'New Judging Criteria Released',
    excerpt: 'WFF International has updated the scoring metrics for the Sports Model division. All athletes must review the changes before the national qualifiers.',
    image: 'https://picsum.photos/seed/news3/800/600',
  }
];

export default function MediaClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      // Video Scrubbing
      if (videoContainerRef.current && videoRef.current) {
        // Ensure video is loaded before getting duration
        videoRef.current.addEventListener('loadedmetadata', () => {
          ScrollTrigger.create({
            trigger: videoContainerRef.current,
            start: 'top top',
            end: '+=200%', // Pin for 2 viewport heights
            pin: true,
            scrub: 0.5, // Smooth scrubbing
            onUpdate: (self) => {
              if (videoRef.current && videoRef.current.duration) {
                // Scrub video based on scroll progress
                videoRef.current.currentTime = videoRef.current.duration * self.progress;
              }
            }
          });
        });
      }

      // News Grid Animation
      if (newsRef.current) {
        const articles = newsRef.current.querySelectorAll('.news-article');
        gsap.fromTo(articles,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: newsRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-wff-dark">
      
      {/* Scroll-Scrub Video Section */}
      <div ref={videoContainerRef} className="w-full h-screen relative overflow-hidden bg-black mb-24">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none bg-black/40">
          <h2 className="font-bebas text-6xl md:text-9xl text-white tracking-widest mix-blend-overlay">THE JOURNEY</h2>
          <p className="font-sans text-wff-gold tracking-[0.5em] uppercase text-sm md:text-lg mt-4">Scroll to explore</p>
        </div>
        {/* Using a placeholder video that allows seeking */}
        <video 
          ref={videoRef}
          className="w-full h-full object-cover opacity-80"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          muted
          playsInline
          preload="auto"
        />
      </div>

      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-20 opacity-0">
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">THE <span className="text-wff-red">GALLERY</span></h1>
          <p className="font-sans text-xl text-white/70">
            Relive the glory. Exclusive moments from the WFF Ghana Championships, Fitness Ghana Awards, and behind-the-scenes action.
          </p>
        </div>

        {/* Gallery Grid */}
        <div ref={newsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-32">
          {[
            { id: 1, src: '/award-1.jpg', alt: 'WFF Ghana Awards 2025', aspect: 'aspect-square' },
            { id: 2, src: '/award-2.jpg', alt: 'President Victor Baiden Citation', aspect: 'aspect-[3/4]' },
            { id: 3, src: '/award-3.jpg', alt: 'Fitness Ghana Awards', aspect: 'aspect-[4/3]' },
            { id: 4, src: '/award-4.jpg', alt: 'Athlete Medal Presentation', aspect: 'aspect-square' },
            { id: 5, src: '/award-5.jpg', alt: 'President Victor Baiden Award', aspect: 'aspect-[3/4]' },
            { id: 6, src: '/award-6.jpg', alt: 'WFF Ghana Leadership', aspect: 'aspect-[4/3]' },
            { id: 7, src: '/culture-1.jpg', alt: 'Ghanaian Culture & Heritage', aspect: 'aspect-square' },
            { id: 8, src: '/culture-2.jpg', alt: 'Traditional Attire', aspect: 'aspect-[3/4]' },
          ].map((item) => (
            <div 
              key={item.id} 
              className={`news-article relative w-full ${item.aspect} bg-[#111] border border-white/10 group overflow-hidden cursor-pointer`}
            >
              <div className="absolute inset-0 bg-wff-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
              <Image 
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/wff${item.id}/800/800`;
                }}
              />
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                <p className="font-bebas text-2xl text-white">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
