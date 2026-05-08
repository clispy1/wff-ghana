'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function InfoClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-item',
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-wff-dark pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <div ref={containerRef} className="container mx-auto px-6 relative z-10 max-w-5xl">
        <div className="reveal-item text-center mb-16">
          <h1 className="font-bebas text-6xl md:text-8xl mb-4">Event <span className="text-wff-red">Information</span></h1>
          <p className="font-sans text-xl text-white/70">Everything you need to know for the All Africa Championships.</p>
        </div>

        <div className="space-y-12">
          
          {/* Event Details */}
          <div className="reveal-item bg-[#111] border border-white/10 rounded-xl p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-wff-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-wff-red/10 transition-colors duration-700"></div>
            <h2 className="font-bebas text-4xl mb-8 text-wff-gold border-b border-white/10 pb-4">Event Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 font-sans">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2 font-bold">Venue</p>
                <p className="text-lg font-medium">UPSA Auditorium</p>
                <p className="text-white/70 text-sm">Accra, Ghana</p>
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2 font-bold">Dates</p>
                <p className="text-lg font-medium">September 20-25, 2026</p>
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2 font-bold">Host Nation</p>
                <p className="text-lg font-medium">WFF Ghana</p>
                <p className="text-white/70 text-sm">World Fitness Federation</p>
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2 font-bold">Registration</p>
                <p className="text-lg font-medium">Open</p>
                <p className="text-white/70 text-sm text-wff-red">Closes Aug 30, 2026</p>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="/info.pdf" download className="inline-flex items-center justify-center border border-white/20 text-white font-bebas text-xl px-8 py-3 rounded hover:bg-white hover:text-black transition-colors w-full sm:w-auto">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Event PDF
              </a>
            </div>
          </div>

          {/* Arrival Information */}
          <div className="reveal-item bg-[#111] border border-white/10 rounded-xl p-8 md:p-12 relative overflow-hidden group">
            <h2 className="font-bebas text-4xl mb-8 text-wff-gold border-b border-white/10 pb-4">Arrival Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-sans">
              <div>
                <h3 className="text-xl font-bold mb-3 text-white">Airport & Pickups</h3>
                <p className="text-white/70 mb-4 text-sm leading-relaxed">
                  All international delegates should fly into <strong className="text-white">Kotoka International Airport (ACC)</strong>, located directly in Accra. Official WFF shuttles will be operating on September 19th and 20th for pre-booked athletes landing between 08:00 and 22:00.
                </p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Uber, Bolt, and Yango operate reliably in Accra for those arriving outside shuttle hours or preferring private transport.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-white">Visas & Health</h3>
                <ul className="space-y-3 text-sm text-white/70">
                  <li className="flex items-start">
                    <span className="text-wff-red mr-2 mt-0.5">•</span>
                    <span><strong>Visas:</strong> Members of the African Union (AU) qualify for Visa on Arrival. Other federations must apply for an e-Visa or consult their local Ghanaian consulate in advance. Invitations will be provided by WFF Ghana upon registration.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-wff-red mr-2 mt-0.5">•</span>
                    <span><strong>Yellow Fever:</strong> Proof of Yellow Fever vaccination is mandatory for entry into Ghana. Carry your yellow booklet with your passport.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Accommodations */}
          <div className="reveal-item bg-[#111] border border-white/10 rounded-xl p-8 md:p-12 relative overflow-hidden group">
            <h2 className="font-bebas text-4xl mb-8 text-wff-gold border-b border-white/10 pb-4">Official Accommodation</h2>
            <p className="font-sans text-white/70 mb-8 max-w-3xl">
              We have partnered with leading highly-rated properties in the immediate vicinity of Kotoka International Airport. These provide the utmost comfort for peak-week prep and have discounted rates when using code <strong>WFF2026</strong>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 font-sans">
              <div className="bg-black/50 border border-white/5 p-6 rounded-lg">
                <span className="inline-block px-3 py-1 bg-wff-red/20 text-wff-red text-xs font-bold uppercase tracking-wider rounded-sm mb-4">Official VIP Host</span>
                <h3 className="text-xl font-bold mb-1 text-white">Accra Marriott Hotel</h3>
                <p className="text-wff-gold text-sm mb-4">Airport City (2 mins from ACC)</p>
                <p className="text-white/60 text-sm">The absolute pinnacle of luxury and comfort. Host to our pro-division athletes and federation VIPs. Extensive gym and premium culinary options.</p>
              </div>
              <div className="bg-black/50 border border-white/5 p-6 rounded-lg">
                <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-wider rounded-sm mb-4">Premium Partner</span>
                <h3 className="text-xl font-bold mb-1 text-white">Holiday Inn Accra</h3>
                <p className="text-wff-gold text-sm mb-4">Airport City (3 mins from ACC)</p>
                <p className="text-white/60 text-sm">Exceptional comfort seamlessly located near the airport with wide access to restaurants and prep groceries. A major hub for national teams.</p>
              </div>
              <div className="bg-black/50 border border-white/5 p-6 rounded-lg">
                <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-wider rounded-sm mb-4">Standard & Economy</span>
                <h3 className="text-xl font-bold mb-1 text-white">Ibis Styles Accra</h3>
                <p className="text-wff-gold text-sm mb-4">Airport City (5 mins from ACC)</p>
                <p className="text-white/60 text-sm">Colorful, convenient, and incredibly cost-effective for large national teams while remaining inside the security and comfort of Airport City.</p>
              </div>
              <div className="bg-black/50 border border-white/5 p-6 rounded-lg md:col-span-2 xl:col-span-3 hover:border-white/10 transition-colors">
                <h3 className="text-xl font-bold mb-1 text-white">Polo Court Apartments</h3>
                <p className="text-wff-gold text-sm mb-2">Airport Bypass Rd (7 mins from ACC)</p>
                <p className="text-white/60 text-sm max-w-2xl">Perfect for athletes who require a strict kitchen setup for their peak-week diet. Features 2 and 3-bedroom fully furnished self-catering apartments.</p>
              </div>
            </div>
          </div>

          {/* Schedule & Running Order */}
          <div className="reveal-item bg-[#111] border border-white/10 rounded-xl p-8 md:p-12 relative overflow-hidden group">
            <h2 className="font-bebas text-4xl mb-8 text-wff-gold border-b border-white/10 pb-4">Schedule & Running Order</h2>
            
            <div className="space-y-12 font-sans">
              
              <div className="relative">
                <div className="absolute left-[7px] top-8 bottom-0 w-px bg-white/10"></div>
                
                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-4 h-4 rounded-full bg-wff-red mt-1.5 shadow-[0_0_10px_rgba(206,17,38,0.8)]"></div>
                  <div>
                    <h3 className="text-2xl font-bebas text-white mb-2">Friday, Sept 20 - Registration</h3>
                    <div className="bg-black/50 border border-white/5 p-5 rounded-lg">
                      <ul className="space-y-3 text-sm text-white/70">
                        <li><strong className="text-wff-gold w-32 inline-block font-mono text-xs">10:00 - 18:00</strong> Athlete Check-in, Weigh-in & Measurement</li>
                        <li><strong className="text-wff-gold w-32 inline-block font-mono text-xs">15:00 - 16:30</strong> WFF Africa Judges Seminar</li>
                        <li><strong className="text-wff-gold w-32 inline-block font-mono text-xs">19:00 - 20:30</strong> Official Press Conference & Meet and Greet</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-[7px] top-8 bottom-0 w-px bg-white/10"></div>
                
                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-4 h-4 rounded-full bg-wff-red mt-1.5"></div>
                  <div className="w-full">
                    <h3 className="text-2xl font-bebas text-white mb-2">Saturday, Sept 21 - Show Day 1 (Amateur & Pro Qualifier)</h3>
                    <div className="bg-black/50 border border-white/5 p-6 rounded-lg w-full">
                      <p className="text-white/50 text-xs uppercase tracking-widest mb-4 font-bold border-b border-white/10 pb-2">Morning Session - 09:00 AM</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm text-white/80 mb-6">
                        <li>Women's Aerobics / Fitness</li>
                        <li>Men's Beach Model (Juniors, Open, Masters)</li>
                        <li>Women's Sports Model</li>
                        <li>Men's Sports Model</li>
                        <li>Women's Bikini (Short, Tall, Masters)</li>
                      </ul>

                      <p className="text-white/50 text-xs uppercase tracking-widest mb-4 font-bold border-b border-white/10 pb-2">Afternoon Session - 02:00 PM</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm text-white/80">
                        <li>Men's Fitness</li>
                        <li>Women's Figure</li>
                        <li>Men's Performance</li>
                        <li>Women's Physique</li>
                        <li>Men's Athletic</li>
                        <li>Men's Superbody</li>
                        <li>Men's Extreme Bodybuilding</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-4 h-4 rounded-full bg-wff-gold mt-1.5 shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
                  <div className="w-full">
                    <h3 className="text-2xl font-bebas text-white mb-2">Sunday, Sept 22 - Show Day 2 (Pro Division & Overall Awards)</h3>
                    <div className="bg-black/50 border border-white/5 p-6 rounded-lg w-full">
                      <ul className="space-y-3 text-sm text-white/80">
                        <li><strong className="text-wff-gold w-32 inline-block font-mono text-xs">12:00 PM</strong> Overall Amateur Line-ups & Pro Card Ceremonies</li>
                        <li><strong className="text-wff-gold w-32 inline-block font-mono text-xs">03:00 PM</strong> WFF Pro Division (Bikini & Sports Model)</li>
                        <li><strong className="text-wff-gold w-32 inline-block font-mono text-xs">05:30 PM</strong> WFF Pro Division (Men's Bodybuilding)</li>
                        <li><strong className="text-wff-gold w-32 inline-block font-mono text-xs">08:00 PM</strong> Championship Banquet</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Awards */}
          <div className="reveal-item bg-[#111] border border-white/10 rounded-xl p-8 md:p-12 relative overflow-hidden group">
            <h2 className="font-bebas text-4xl mb-8 text-wff-gold border-b border-white/10 pb-4">Awards & Prizes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
              <div className="flex flex-col">
                <div className="w-12 h-12 rounded-full bg-wff-red/10 flex items-center justify-center mb-4 border border-wff-red/20 shadow-[0_0_15px_rgba(206,17,38,0.2)]">
                  <svg className="w-6 h-6 text-wff-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Amateur Titles</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  The top 3 athletes in every amateur division will receive the official custom forged 2026 All Africa Championship Medals.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="w-12 h-12 rounded-full bg-wff-gold/10 flex items-center justify-center mb-4 border border-wff-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <svg className="w-6 h-6 text-wff-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Pro Status</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Overall Winners of their respective divisions (e.g. Overall Bikini, Overall Bodybuilding) will be awarded the prestigious WFF Pro Card.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Pro Division</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Competitors in the Pro line-up will battle for substantial cash prizes, the 2026 Championship Belts, and legacy qualification.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
