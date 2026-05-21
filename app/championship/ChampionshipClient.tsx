'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { MapPin, Calendar, Clock, Ticket, Check } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

gsap.registerPlugin(ScrollTrigger);

const TICKETS = [
  {
    id: 'ticket-ga',
    name: 'General Admission Ticket',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1540039155732-6761b54f228a?q=80&w=800&auto=format&fit=crop',
    category: 'Tickets',
    description: 'General admission to the 2026 All Africa Championship.'
  },
  {
    id: 'ticket-vip',
    name: 'VIP Backstage Pass',
    price: 800.00,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    category: 'Tickets',
    description: 'VIP access including backstage pass, premium seating, and meet & greet.'
  }
];

export default function ChampionshipClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const scheduleItemsRef = useRef<HTMLUListElement>(null);
  const ticketItemsRef = useRef<HTMLDivElement>(null);
  
  const { addToCart } = useCart();
  const [addedTicketId, setAddedTicketId] = useState<string | null>(null);

  const handleAddTicket = (ticketId: string) => {
    const ticket = TICKETS.find(t => t.id === ticketId);
    if (ticket) {
      addToCart(ticket, 1);
      setAddedTicketId(ticketId);
      setTimeout(() => setAddedTicketId(null), 2000);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Color Shift (Act 3 - Energized/Near-Black)
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => gsap.to(document.documentElement, { '--bg-color': '#050505', duration: 1 }),
        onLeaveBack: () => gsap.to(document.documentElement, { '--bg-color': '#050505', duration: 1 }),
      });

      // Pinning the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        }
      });

      // Header Animation
      tl.fromTo(headerRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      // Details Reveal
      tl.fromTo(detailsRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.5'
      );

      // Alternating Schedule Items
      if (scheduleItemsRef.current) {
        const items = Array.from(scheduleItemsRef.current.children);
        items.forEach((item, i) => {
          tl.fromTo(item,
            { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
            '-=0.3'
          );
        });
      }

      // Alternating Ticket Items
      if (ticketItemsRef.current) {
        const items = Array.from(ticketItemsRef.current.children);
        items.forEach((item, i) => {
          tl.fromTo(item,
            { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
            '-=0.3'
          );
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="h-screen w-full relative overflow-hidden flex items-center justify-center bg-wff-dark">
      
      {/* Ambient Red Glow Background */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(206,17,38,0.15) 0%, transparent 70%)' }}></div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-wff-dark/80 via-wff-dark/50 to-wff-dark"></div>

      <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-center">
        
        {/* Header */}
        <div ref={headerRef} className="max-w-5xl mx-auto text-center mb-16 opacity-0">
          <h1 className="font-bebas text-6xl md:text-8xl mb-4">THE ULTIMATE <span className="text-wff-red">SHOWDOWN</span></h1>
          <p className="font-sans text-xl text-white/70">
            On September 26th, 2026, the greatest physiques from across the continent will converge in Accra. This is where legends are born.
          </p>
        </div>

        {/* Event Details Grid */}
        <div ref={detailsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 opacity-0">
          <div className="relative aspect-video lg:aspect-square bg-[#111] border border-white/10 overflow-hidden rounded-xl">
            <Image 
              src="https://picsum.photos/seed/accra-venue/1000/1000" 
              alt="Accra Venue"
              fill
              className="object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wff-dark via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="font-bebas text-4xl mb-2 text-white">ACCRA INTERNATIONAL CONFERENCE CENTRE</h3>
              <p className="font-sans text-white/80 flex items-center"><MapPin className="mr-2 text-wff-red" size={18}/> Castle Rd, Accra, Ghana</p>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-12">
            <div>
              <h4 className="font-bebas text-3xl text-wff-gold mb-4 flex items-center"><Calendar className="mr-3" /> SCHEDULE OF EVENTS</h4>
              <ul ref={scheduleItemsRef} className="space-y-4 font-sans text-white/80 overflow-hidden">
                <li className="flex justify-between border-b border-white/10 pb-2 opacity-0">
                  <span>Athlete Registration & Weigh-in</span>
                  <span className="font-bold">Sept 24, 09:00 AM</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2 opacity-0">
                  <span>Pre-Judging (All Categories)</span>
                  <span className="font-bold">Sept 25, 10:00 AM</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2 opacity-0">
                  <span className="text-wff-red font-bold">Main Event & Finals</span>
                  <span className="text-wff-red font-bold">Sept 26, 06:00 PM</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bebas text-3xl text-wff-gold mb-4 flex items-center"><Ticket className="mr-3" /> TICKETING</h4>
              <div ref={ticketItemsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden">
                <div 
                  onClick={() => handleAddTicket('ticket-ga')}
                  className="bg-[#111] border border-white/10 p-6 hover:border-wff-red transition-colors cursor-pointer group opacity-0 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <h5 className="font-bebas text-2xl mb-1 text-white">GENERAL ADMISSION</h5>
                    <p className="font-sans text-wff-gold font-bold mb-4">₵ 150.00</p>
                  </div>
                  <button className="font-sans text-sm uppercase tracking-widest text-white/50 group-hover:text-wff-red transition-colors flex items-center">
                    {addedTicketId === 'ticket-ga' ? <><Check size={16} className="mr-2" /> Added</> : 'Buy Now →'}
                  </button>
                </div>
                <div 
                  onClick={() => handleAddTicket('ticket-vip')}
                  className="bg-wff-red text-white p-6 hover:bg-white hover:text-wff-dark transition-colors cursor-pointer group opacity-0 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <h5 className="font-bebas text-2xl mb-1">VIP BACKSTAGE PASS</h5>
                    <p className="font-sans font-bold mb-4">₵ 800.00</p>
                  </div>
                  <button className="font-sans text-sm uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity flex items-center">
                    {addedTicketId === 'ticket-vip' ? <><Check size={16} className="mr-2" /> Added</> : 'Buy Now →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
