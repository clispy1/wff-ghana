'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

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
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-20 opacity-0">
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">THE <span className="text-wff-red">HYPE</span> MACHINE</h1>
          <p className="font-sans text-xl text-white/70">
            Latest news, press releases, and media from WFF Ghana and the Road to 2026.
          </p>
        </div>

        {/* News Grid */}
        <div ref={newsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article key={item.id} className="news-article group cursor-pointer bg-[#111] border border-white/10 overflow-hidden hover:border-wff-red transition-colors duration-300">
              <div className="relative aspect-video overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.title}
                  fill
                  className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-wff-red text-white font-sans text-xs font-bold uppercase tracking-widest px-3 py-1">
                  {item.category}
                </div>
              </div>
              
              <div className="p-8">
                <div className="font-sans text-sm text-wff-gold mb-3">{item.date}</div>
                <h3 className="font-bebas text-3xl text-white mb-4 group-hover:text-wff-red transition-colors">{item.title}</h3>
                <p className="font-sans text-white/60 text-sm leading-relaxed mb-6">
                  {item.excerpt}
                </p>
                <span className="font-sans text-sm uppercase tracking-widest text-white/40 group-hover:text-white transition-colors flex items-center">
                  Read Full Article <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}
