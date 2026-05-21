'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Ticket, 
  Check, 
  X, 
  Upload, 
  Music, 
  FileText, 
  Trophy, 
  Hotel, 
  Plane, 
  Award, 
  ShieldAlert 
} from 'lucide-react';
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

const ATHLETES = [
  {
    id: 1,
    name: 'Kofi Mensah',
    category: 'Men\'s Bodybuilding',
    weightClass: 'Over 90kg',
    image: 'https://picsum.photos/seed/kofimensah/600/800',
    bio: 'A veteran of the Ghanaian bodybuilding scene, Kofi brings unmatched mass and conditioning. He is a 3-time national champion aiming for his pro card.',
    achievements: ['2025 WFF Ghana Overall Champion', '2024 West African Classic Winner']
  },
  {
    id: 2,
    name: 'Ama Osei',
    category: 'Bikini',
    weightClass: 'Open',
    image: 'https://picsum.photos/seed/amaosei/600/800',
    bio: 'Ama\'s perfect symmetry and stage presence make her a standout in the Bikini division. She has been training for 4 years and is ready for the world stage.',
    achievements: ['2025 WFF Ghana Bikini Champion', '2025 Arnold Classic Africa Top 5']
  },
  {
    id: 3,
    name: 'Kwesi Appiah',
    category: 'Classic Physique',
    weightClass: 'Under 85kg',
    image: 'https://picsum.photos/seed/kwesiappiah/600/800',
    bio: 'Embodying the golden era of bodybuilding, Kwesi focuses on aesthetics, tiny waist, and wide shoulders. His posing routines are legendary.',
    achievements: ['2025 WFF Ghana Classic Physique Winner']
  },
  {
    id: 4,
    name: 'Abena Yeboah',
    category: 'Sports Modelling',
    weightClass: 'Open',
    image: 'https://picsum.photos/seed/abenayeboah/600/800',
    bio: 'Abena combines athletic performance with fitness modeling. Her dynamic routines and athletic build make her a top contender.',
    achievements: ['2024 WFF Universe Top 10', '2025 WFF Ghana Sports Model Winner']
  }
];

const HOTELS = [
  {
    type: 'Official VIP Host',
    name: 'Accra Marriott Hotel',
    location: 'Airport City (2 mins from ACC)',
    desc: 'The absolute pinnacle of comfort. Host to our pro-division athletes and federation VIPs. Extensive gym and premium culinary options.',
    labelColor: 'bg-wff-red/20 text-wff-red'
  },
  {
    type: 'Premium Partner',
    name: 'Holiday Inn Accra',
    location: 'Airport City (3 mins from ACC)',
    desc: 'Exceptional comfort seamlessly located near the airport with wide access to restaurants and prep groceries. A major hub for national teams.',
    labelColor: 'bg-wff-gold/20 text-wff-gold'
  },
  {
    type: 'Standard & Economy',
    name: 'Ibis Styles Accra',
    location: 'Airport City (5 mins from ACC)',
    desc: 'Convenient and cost-effective for large national teams while remaining inside the security and comfort of Airport City.',
    labelColor: 'bg-white/10 text-white/80'
  }
];

export default function ChampionshipClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const { addToCart } = useCart();
  const [addedTicketId, setAddedTicketId] = useState<string | null>(null);
  const [selectedAthlete, setSelectedAthlete] = useState<typeof ATHLETES[0] | null>(null);

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
      // Clean scrolling animations
      gsap.fromTo('.reveal-card',
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.reveal-trigger-section',
            start: 'top 85%'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="pt-32 pb-24 min-h-screen relative overflow-y-auto bg-wff-dark">
      
      {/* Ambient Red Glow Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(206,17,38,0.12) 0%, transparent 70%)' }}></div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-16">
          <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.3em] mb-4">2026 Continental Summit</p>
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">THE ULTIMATE <span className="text-wff-red">SHOWDOWN</span></h1>
          <p className="font-sans text-lg text-white/70 leading-relaxed md:px-12">
            On September 20-22, 2026, the preeminent physiques from across Africa will converge in Accra, Ghana. Experience state-of-the-art stage layout, fair judging, and unmatched energy.
          </p>
        </div>

        {/* Core Quick Details Widget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: <MapPin className="text-wff-red" size={24} />, title: 'UPSA Auditorium', subtitle: 'Madina, Accra, Ghana' },
            { icon: <Calendar className="text-wff-gold" size={24} />, title: 'September 20-22', subtitle: '2026 Championship' },
            { icon: <Ticket className="text-white" size={24} />, title: 'Pre-Sale Live', subtitle: 'Exquisite Seating Plans' },
            { icon: <Award className="text-wff-gold" size={24} />, title: 'WFF Pro Cards', subtitle: 'Multiple Divisions Offered' }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#111] border border-white/5 p-6 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-lg">{item.icon}</div>
              <div>
                <h4 className="font-bebas text-xl text-white">{item.title}</h4>
                <p className="font-sans text-xs text-white/50">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tickets Section */}
        <div id="tickets" className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-wff-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="font-bebas text-4xl md:text-5xl mb-4 text-white">GET YOUR <span className="text-wff-red">TICKETS</span></h2>
              <p className="font-sans text-sm text-white/60 mb-6 leading-relaxed">
                Be a witness to absolute bodybuilding and wellness history. Choose Tier 1 general admission seating or enjoy the ultimate high-profile VIP experience with fully loaded backstage passes and red-carpet access.
              </p>
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg max-w-sm">
                <p className="font-sans text-xs text-white/70">
                  ⚡ <strong>Note:</strong> Tickets purchased online are instantly compiled inside your local order tray. Check your email inbox for official receipts.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {TICKETS.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className={`p-8 border rounded-xl flex flex-col justify-between h-80 ${
                    ticket.id === 'ticket-vip' 
                      ? 'border-wff-gold bg-wff-gold/5 relative overflow-hidden group' 
                      : 'border-white/10 bg-black/40 group'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-bebas text-2xl tracking-widest text-white group-hover:text-wff-red transition-colors">
                        {ticket.id === 'ticket-vip' ? 'VIP UNLIMITED' : 'GENERAL SEAT'}
                      </span>
                      {ticket.id === 'ticket-vip' && (
                        <span className="text-[9px] uppercase tracking-wider bg-wff-gold text-black font-extrabold px-2 py-0.5 rounded-sm">Hot Seller</span>
                      )}
                    </div>
                    <h5 className="font-bebas text-3xl mb-1 text-white">{ticket.name}</h5>
                    <p className="font-sans text-xs text-white/50 leading-relaxed mb-6">{ticket.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    <div>
                      <span className="text-[10px] font-sans text-white/40 block">Price</span>
                      <span className="font-sans font-bold text-lg text-white">₵ {ticket.price.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => handleAddTicket(ticket.id)}
                      className={`font-bebas text-sm uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-200 ${
                        ticket.id === 'ticket-vip'
                          ? 'bg-wff-gold text-black hover:bg-white hover:text-black font-bold'
                          : 'bg-wff-red text-white hover:bg-white hover:text-black font-bold'
                      }`}
                    >
                      {addedTicketId === ticket.id ? <Check size={16} /> : 'Buy Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Detailed Running Order & Timetable */}
        <div id="schedule" className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="font-bebas text-4xl md:text-5xl text-wff-gold mb-8 pb-4 border-b border-white/10">TIMETABLE & RUNNING ORDER</h2>
          
          <div className="space-y-12 font-sans">
            {[
              {
                day: 'Friday, Sept 20 - Registration',
                dotColor: 'bg-wff-red shadow-[0_0_10px_rgba(206,17,38,0.8)]',
                list: [
                  { time: '10:00 - 18:00', task: 'Athlete Check-in, Weigh-in & Height Measurement' },
                  { time: '15:00 - 16:30', task: 'WFF Africa Certified Judges Seminar' },
                  { time: '19:00 - 20:30', task: 'Official Press Conference & Celebrity Meet-and-Greet' }
                ]
              },
              {
                day: 'Saturday, Sept 21 - Show Day 1 (Amateur & Pro Qualifier)',
                dotColor: 'bg-wff-red',
                sections: [
                  {
                    title: 'Morning Session - 09:00 AM',
                    items: ["Women's Aerobics / Fitness Modeling", "Men's Beach Model (Juniors, Open & Masters)", "Women's Sports Modeling", "Men's Sports Modeling", "Women's Bikini (Short, Tall & Masters Divisions)"]
                  },
                  {
                    title: 'Afternoon Session - 02:00 PM',
                    items: ["Men's Fitness Division", "Women's Figure Championships", "Men's Performance Class", "Women's Physique Line-ups", "Men's Athletic Showdown", "Men's Superbody Grand Prix", "Men's Extreme Bodybuilding Overall"]
                  }
                ]
              },
              {
                day: 'Sunday, Sept 22 - Show Day 2 (Pro Division & Overall Awards)',
                dotColor: 'bg-wff-gold shadow-[0_0_10px_rgba(252,209,22,0.8)]',
                list: [
                  { time: '12:00 PM', task: 'Overall Amateur Line-ups & Pro Card Convocations' },
                  { time: '03:00 PM', task: 'WFF Pro Division Battles (Bikini & Sports Model)' },
                  { time: '05:30 PM', task: 'WFF Pro Division Highlight (Men\'s Bodybuilding Pro Cup)' },
                  { time: '08:00 PM', task: 'Continental Championship Celebration Banquet' }
                ]
              }
            ].map((section, idx) => (
              <div key={idx} className="relative pl-8 border-l border-white/10">
                <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${section.dotColor}`}></div>
                <h3 className="font-bebas text-2xl md:text-3xl text-white mb-4 uppercase tracking-wider">{section.day}</h3>
                
                {section.list && (
                  <div className="bg-black/40 border border-white/5 p-6 rounded-xl space-y-3">
                    {section.list.map((it, iIdx) => (
                      <div key={iIdx} className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-white/80 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                        <strong className="text-wff-gold w-32 font-mono text-xs">{it.time}</strong>
                        <span>{it.task}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.sections && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.sections.map((sect, sIdx) => (
                      <div key={sIdx} className="bg-black/45 border border-white/5 p-6 rounded-xl">
                        <p className="text-wff-gold text-xs uppercase tracking-widest font-bold mb-4 border-b border-white/10 pb-2">{sect.title}</p>
                        <ul className="space-y-2 text-xs text-white/70 leading-relaxed">
                          {sect.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start">
                              <span className="text-wff-red mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Airport Transfers, Visa Guidance, Accommodations */}
        <div id="logistics" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Shuttles & Transports */}
          <div className="bg-[#111]/80 backdrop-blur-md border border-white/5 p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="p-3 bg-wff-red/10 border border-wff-red/20 text-wff-red w-fit rounded-lg mb-6">
                <Plane size={24} />
              </div>
              <h3 className="font-bebas text-3xl mb-4 text-white">AIRPORTS & VISAS</h3>
              <p className="font-sans text-xs text-white/60 leading-relaxed space-y-4">
                <span>Please book flights arriving directly into <strong>Kotoka International Airport (ACC)</strong>. Shuttles run on September 19-20th for registered athletes.</span>
                <br /><br />
                <span>ECOWAS & African Union citizens qualify for automatic Visa-on-Arrival or visa-free entry. WFF Ghana will supply official visa invocation letters to other international candidates upon request. Yellow Fever inoculation booklets are mandatory.</span>
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-white/40">
              <ShieldAlert size={14} className="text-wff-red" /> Mandatory Yellow Card Required
            </div>
          </div>

          {/* Official Host Hotels */}
          <div className="lg:col-span-2 bg-[#111]/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
            <div className="flex items-center gap-4 mb-6 pb-2 border-b border-white/10">
              <div className="p-3 bg-wff-gold/15 text-wff-gold rounded-lg"><Hotel size={24} /></div>
              <h3 className="font-bebas text-3xl text-white">OFFICIAL ACCOMMODATIONS</h3>
            </div>
            <p className="font-sans text-xs text-white/50 mb-6 leading-relaxed">
              We have partnered leading Airport properties offering custom-curated food prep packages and airport shuttle channels. Use discount code <span className="text-wff-gold font-bold">WFF2026</span> when securing rooms.
            </p>
            
            <div className="space-y-4 font-sans text-xs">
              {HOTELS.map((hotel, hIdx) => (
                <div key={hIdx} className="bg-black/55 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-sm text-[9px] font-extrabold uppercase tracking-wider mb-2 ${hotel.labelColor}`}>
                      {hotel.type}
                    </span>
                    <h4 className="text-sm font-bold text-white mb-0.5">{hotel.name}</h4>
                    <p className="text-[10px] text-wff-gold mb-2">{hotel.location}</p>
                    <p className="text-[11px] text-white/60 leading-relaxed">{hotel.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Team Ghana Elite Roster Segment */}
        <div id="roster" className="mt-24 pt-16 border-t border-white/10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-bebas text-5xl md:text-7xl mb-4 text-white">TEAM <span className="text-wff-red">GHANA</span> ROSTER</h2>
            <p className="font-sans text-sm text-white/50">
              Meet the elite national squad defending the home turf against incoming continental challengers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ATHLETES.map((ath) => (
              <div 
                key={ath.id}
                onClick={() => setSelectedAthlete(ath)}
                className="bg-[#111] border border-white/10 cursor-pointer rounded-xl overflow-hidden relative group aspect-[3/4] hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300"
              >
                <div className="relative w-full h-full">
                  <Image 
                    src={ath.image} 
                    alt={ath.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-wff-gold block mb-1">{ath.category}</span>
                    <h3 className="font-bebas text-3xl text-white block mb-0.5">{ath.name}</h3>
                    <p className="font-sans text-[11px] text-white/50">{ath.weightClass}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrated Athlete Portal & Registration Forms */}
        <div id="portal" className="mt-24 pt-16 border-t border-white/10">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 md:p-12">
            
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="font-bebas text-4xl md:text-5xl text-wff-gold mb-4">ATHLETE REGISTRATION PORTAL</h2>
              <p className="font-sans text-sm text-white/50">
                Secure your entry for the amateur line-up, request visa invitations, or upload event logistics data easily.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Registration submission */}
              <div>
                <h3 className="font-bebas text-2xl mb-6 text-white border-b border-white/10 pb-2">ATHLETE SIGNUP Form</h3>
                <AthleteRegistrationForm />
              </div>

              {/* File logistics upload mock/client */}
              <div className="space-y-6">
                <h3 className="font-bebas text-2xl mb-6 text-white border-b border-white/10 pb-2">LOGISTICS FILE UPLOAD</h3>
                
                <div className="border border-dashed border-white/10 hover:border-wff-gold hover:bg-white/[0.02] p-8 text-center cursor-pointer transition-all duration-300 rounded-xl group relative">
                  <Music className="mx-auto mb-4 text-white/40 group-hover:text-wff-gold transition-colors" size={32} />
                  <h4 className="font-bebas text-xl text-white mb-1">POSING AUDIOTRACKS</h4>
                  <p className="font-sans text-xs text-white/50">MP3 format, maximum length 60s</p>
                </div>

                <div className="border border-dashed border-white/10 hover:border-wff-gold hover:bg-white/[0.02] p-8 text-center cursor-pointer transition-all duration-300 rounded-xl group relative">
                  <FileText className="mx-auto mb-4 text-white/40 group-hover:text-wff-gold transition-colors" size={32} />
                  <h4 className="font-bebas text-xl text-white mb-1">PASSPORTS & OFFICIAL ID DOCUMENTS</h4>
                  <p className="font-sans text-xs text-white/50">Clear PDF or JPG copies</p>
                </div>

                <div className="bg-[#0A0A0A] p-5 border border-white/5 rounded-xl">
                  <p className="font-sans text-xs text-white/60 leading-relaxed">
                    🚨 <strong>Required Timeline:</strong> All posing audios and passport scans must be submitted before September 10th, 2026. Lack of uploaded posing audio results in default host tracks played on showday.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Roster Modal */}
      {selectedAthlete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-sm">
          <div 
            className="bg-[#111] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row rounded-xl"
          >
            <button 
              onClick={() => setSelectedAthlete(null)}
              className="absolute top-4 right-4 z-10 bg-black/70 p-2.5 rounded-full text-white hover:text-wff-red transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-full md:w-1/2 relative aspect-[3/4] md:aspect-auto md:h-auto min-h-[300px]">
              <Image 
                src={selectedAthlete.image} 
                alt={selectedAthlete.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
              <span className="font-sans text-[10px] uppercase tracking-widest text-wff-gold bg-wff-gold/15 px-3 py-1 rounded-sm w-fit mb-3">{selectedAthlete.category}</span>
              <h3 className="font-bebas text-4xl text-white mb-1">{selectedAthlete.name}</h3>
              <p className="font-sans text-xs text-white/50 uppercase tracking-widest mb-6 font-bold">Class: {selectedAthlete.weightClass}</p>
              
              <p className="font-sans text-xs text-white/70 leading-relaxed mb-6">{selectedAthlete.bio}</p>

              <div>
                <h4 className="font-bebas text-lg text-wff-gold mb-3 uppercase tracking-wider">Achievements</h4>
                <ul className="space-y-1.5 font-sans text-xs text-white/80">
                  {selectedAthlete.achievements.map((ach, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-wff-red">★</span> {ach}
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

// Interactive registration form helper
function AthleteRegistrationForm() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="bg-black/60 border border-wff-gold/20 p-8 rounded-xl text-center space-y-4 font-sans text-xs">
        <div className="w-12 h-12 rounded-full bg-wff-gold/10 text-wff-gold flex items-center justify-center mx-auto border border-wff-gold/20">
          <Check size={24} />
        </div>
        <h4 className="font-bebas text-xl text-white">REGISTRATION INITIATED</h4>
        <p className="text-white/60 leading-relaxed">
          Logistics submission approved. Check your email or phone for invoice details regarding athlete weight tickets.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="font-bebas text-sm text-wff-gold hover:underline font-bold uppercase tracking-widest block mx-auto pt-4"
        >
          Register Another Athlete
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/40 uppercase tracking-widest mb-1.5 font-bold">First Name</label>
          <input required type="text" className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-md" />
        </div>
        <div>
          <label className="block text-white/40 uppercase tracking-widest mb-1.5 font-bold">Last Name</label>
          <input required type="text" className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-md" />
        </div>
      </div>
      <div>
        <label className="block text-white/40 uppercase tracking-widest mb-1.5 font-bold">Contact Email</label>
        <input required type="email" className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/40 uppercase tracking-widest mb-1.5 font-bold">Country</label>
          <select required className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-md appearance-none">
            <option>Ghana</option>
            <option>Nigeria</option>
            <option>South Africa</option>
            <option>Egypt</option>
            <option>Kenya</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-white/40 uppercase tracking-widest mb-1.5 font-bold">Division Category</label>
          <select required className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-md appearance-none">
            <option>Men&apos;s Bodybuilding</option>
            <option>Classic Physique</option>
            <option>Men&apos;s Physique</option>
            <option>Bikini Model</option>
            <option>Sports Fitness Model</option>
          </select>
        </div>
      </div>
      <button 
        type="submit"
        className="w-full bg-wff-red text-white hover:bg-white hover:text-black font-bebas text-lg py-3 rounded-md transition-colors font-bold uppercase tracking-widest shadow-lg"
      >
        {loading ? 'Registering...' : 'Submitting Entry'}
      </button>
    </form>
  );
}
