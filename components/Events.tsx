'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const allEvents = [
  {
    id: 1,
    title: 'WFF Ghana National Qualifiers',
    date: 'May 15, 2026',
    location: 'National Theatre, Accra',
    type: 'Qualifier',
    categories: ['Bodybuilding', 'Bikini', 'Classic Physique'],
    status: 'Upcoming'
  },
  {
    id: 2,
    title: 'Kumasi Open Fitness Classic',
    date: 'July 10, 2026',
    location: 'Golden Tulip, Kumasi',
    type: 'Open',
    categories: ['Sports Modelling', 'Fitness'],
    status: 'Upcoming'
  },
  {
    id: 3,
    title: 'WFF World Championships',
    date: 'September 20-25, 2026',
    location: 'Accra International Conference Centre, Ghana',
    type: 'Championship',
    categories: ['All Categories'],
    status: 'Upcoming'
  },
  {
    id: 4,
    title: 'Accra Muscle Showdown',
    date: 'March 5, 2026',
    location: 'Accra International Conference Centre',
    type: 'Open',
    categories: ['Bodybuilding', 'Classic Physique'],
    status: 'Past'
  }
];

export default function Events() {
  const [filter, setFilter] = useState('All');
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const filteredEvents = filter === 'All' 
    ? allEvents 
    : allEvents.filter(e => e.type === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.event-card');
        
        // Reset opacity for re-animation on filter change
        gsap.set(cards, { opacity: 0, y: 30 });
        
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [filter]);

  return (
    <section id="events" ref={sectionRef} className="py-24 bg-[#050505] relative border-t border-white/5">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="font-bebas text-5xl md:text-6xl mb-4">COMPETITION <span className="text-wff-red">CALENDAR</span></h2>
            <p className="font-sans text-white/60 max-w-xl">Find upcoming qualifiers, open events, and international championships.</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-8 md:mt-0">
            {['All', 'Qualifier', 'Championship', 'Open'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`font-bebas text-xl px-6 py-2 border transition-all duration-300 ${
                  filter === type 
                    ? 'border-wff-red bg-wff-red text-white' 
                    : 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="event-card bg-[#111] border border-white/10 p-8 hover:border-wff-red/50 transition-colors duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 ${
                    event.status === 'Upcoming' ? 'bg-wff-red/20 text-wff-red' : 'bg-white/10 text-white/50'
                  }`}>
                    {event.status}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-wff-gold border border-wff-gold/30 px-3 py-1">
                    {event.type}
                  </span>
                </div>
                
                <h3 className="font-bebas text-3xl md:text-4xl mb-4 group-hover:text-wff-red transition-colors">{event.title}</h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-white/70 font-sans text-sm">
                    <Calendar size={16} className="mr-3 text-wff-red" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-white/70 font-sans text-sm">
                    <MapPin size={16} className="mr-3 text-wff-red" />
                    {event.location}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {event.categories.map((cat, i) => (
                  <span key={i} className="text-xs font-sans bg-white/5 text-white/80 px-3 py-1 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
