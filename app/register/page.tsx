'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, CreditCard, Building, Calendar, Mail, Phone, User, Activity, MapPin, Music } from 'lucide-react';

// Mock accommodation data
const ACCOMMODATIONS = [
  {
    id: 'hotel-1',
    name: 'Labadi Beach Hotel',
    type: 'Luxury Hotel',
    price: '$250/night',
    distance: '3.5 km from UPSA Auditorium',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'apt-1',
    name: 'Gallery Apartments Airside',
    type: 'Serviced Apartment',
    price: '$120/night',
    distance: '5.2 km from UPSA Auditorium',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'airbnb-1',
    name: 'East Legon Minimalist Loft',
    type: 'Airbnb',
    price: '$85/night',
    distance: '2.1 km from UPSA Auditorium',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ff2d3c2ac?q=80&w=1973&auto=format&fit=crop'
  }
];

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<'athlete' | 'spectator'>('athlete');
  const [selectedAccommodation, setSelectedAccommodation] = useState<string | null>(null);
  const [hasCrossover, setHasCrossover] = useState(false);

  return (
    <main className="min-h-screen bg-wff-dark pt-32 pb-24 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(206,17,38,0.05)_0%,transparent_50%)]"></div>
      
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-wff-red font-bold uppercase tracking-[0.4em] text-xs mb-3">
            TICKETING & REGISTRATION
          </p>
          <h1 className="font-bebas text-6xl md:text-7xl text-white mb-4 tracking-wide select-none">
            SECURE YOUR <span className="text-wff-red">ACCESS</span>
          </h1>
          <p className="font-sans text-white/50 text-sm max-w-2xl mx-auto">
            Official registration portal for the WFF Ghana Inaugural Championship. Select your registration type below. Base entry and registration fee is set at $100.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1 bg-[#111] border border-white/10 rounded-xl mb-12 max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('athlete')}
            className={`flex-1 py-3 px-6 font-bebas text-xl tracking-widest uppercase transition-all rounded-lg ${
              activeTab === 'athlete'
                ? 'bg-wff-red text-white shadow-lg'
                : 'text-white/40 hover:text-white'
            }`}
          >
            ATHLETE
          </button>
          <button
            onClick={() => setActiveTab('spectator')}
            className={`flex-1 py-3 px-6 font-bebas text-xl tracking-widest uppercase transition-all rounded-lg ${
              activeTab === 'spectator'
                ? 'bg-[#222] text-white shadow-lg border border-white/10'
                : 'text-white/40 hover:text-white'
            }`}
          >
            SPECTATOR
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-[#070707] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-wff-red/5 blur-3xl rounded-full pointer-events-none"></div>
              
              <h2 className="font-bebas text-3xl text-white mb-8 tracking-wider">
                {activeTab === 'athlete' ? 'ATHLETE OFFICIAL REGISTRATION' : 'SPECTATOR PASS REGISTRATION'}
              </h2>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-sans text-xs font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} className="text-wff-red" />
                      Full Legal Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-wff-red transition-colors font-sans text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-xs font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                      <Mail size={14} className="text-wff-red" />
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-wff-red transition-colors font-sans text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-xs font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                    <Phone size={14} className="text-wff-red" />
                    Phone / WhatsApp Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+233 XX XXX XXXX"
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-wff-red transition-colors font-sans text-sm"
                  />
                </div>

                {/* Athlete Specific Fields */}
                {activeTab === 'athlete' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="font-sans text-xs font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={14} className="text-wff-red" />
                            Primary Division
                          </label>
                          <select className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-wff-red transition-colors font-sans text-sm appearance-none">
                            <option value="">Select Division</option>
                            <optgroup label="Men's Bodybuilding & Figure">
                              <option>Men Juniors</option>
                              <option>Men Bodybuilding Masters over 50</option>
                              <option>Men Bodybuilding Grand Masters over 60</option>
                              <option>Men Bodybuilding Grand Masters over 70</option>
                              <option>Bodybuilding PRO</option>
                            </optgroup>
                            <optgroup label="Men's Physique & Sportmodel">
                              <option>Men Sportmodel Open</option>
                              <option>Men Sportmodel Masters over 40</option>
                              <option>Men Sportmodel PRO</option>
                              <option>Bermuda Juniors</option>
                              <option>Bermuda Open</option>
                              <option>Bermuda Masters over 40</option>
                              <option>Bermuda PRO</option>
                            </optgroup>
                            <optgroup label="Men's Fitness & Athletic">
                              <option>Men Fitness</option>
                              <option>Men Performance</option>
                              <option>Men Athletic</option>
                              <option>Men Superbody</option>
                              <option>Men Extremebody</option>
                              <option>Warrior Open Class</option>
                            </optgroup>
                            <optgroup label="Women's Bikini & Glamour">
                              <option>Bikini Model Juniors</option>
                              <option>Bikini Model Open</option>
                              <option>Bikini Model Masters over 40</option>
                              <option>Bikini Model Masters over 50</option>
                              <option>Bikini Model PRO</option>
                              <option>Glamour Model</option>
                            </optgroup>
                            <optgroup label="Women's Sportmodel & Figure">
                              <option>Women Sportmodel Open</option>
                              <option>Women Sportmodel Masters over 40</option>
                              <option>Women Sportmodel PRO</option>
                              <option>Latino Figure</option>
                              <option>Women Figure Masters over 50</option>
                              <option>Figure PRO</option>
                            </optgroup>
                            <optgroup label="Women's Fitness & Aerobic">
                              <option>Aerobic Juniors 13 to 16 Years</option>
                              <option>Women Aerobic</option>
                              <option>Women Fitness / Performance</option>
                              <option>Women Athletic</option>
                              <option>Women Superbody</option>
                              <option>Women Extrembody</option>
                            </optgroup>
                          </select>
                        </div>
                        
                        <label className="flex items-center gap-3 cursor-pointer group mt-2">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${hasCrossover ? 'bg-wff-red border-wff-red' : 'bg-[#111] border-white/20 group-hover:border-white/50'}`}>
                            {hasCrossover && <Check size={14} className="text-white" strokeWidth={3} />}
                          </div>
                          <input type="checkbox" className="hidden" checked={hasCrossover} onChange={() => setHasCrossover(!hasCrossover)} />
                          <span className="font-sans text-[13px] text-white/70 group-hover:text-white transition-colors">Start in an additional class (+$50)</span>
                        </label>
                        
                        {hasCrossover && (
                          <div className="space-y-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="font-sans text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                              Secondary Division
                            </label>
                            <select className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-wff-red transition-colors font-sans text-sm appearance-none">
                              <option value="">Select Additional Class</option>
                              <optgroup label="Men's Bodybuilding & Figure">
                                <option>Men Juniors</option>
                                <option>Men Bodybuilding Masters over 50</option>
                                <option>Men Bodybuilding Grand Masters over 60</option>
                                <option>Men Bodybuilding Grand Masters over 70</option>
                                <option>Bodybuilding PRO</option>
                              </optgroup>
                              <optgroup label="Men's Physique & Sportmodel">
                                <option>Men Sportmodel Open</option>
                                <option>Men Sportmodel Masters over 40</option>
                                <option>Men Sportmodel PRO</option>
                                <option>Bermuda Juniors</option>
                                <option>Bermuda Open</option>
                                <option>Bermuda Masters over 40</option>
                                <option>Bermuda PRO</option>
                              </optgroup>
                              <optgroup label="Men's Fitness & Athletic">
                                <option>Men Fitness</option>
                                <option>Men Performance</option>
                                <option>Men Athletic</option>
                                <option>Men Superbody</option>
                                <option>Men Extremebody</option>
                                <option>Warrior Open Class</option>
                              </optgroup>
                              <optgroup label="Women's Bikini & Glamour">
                                <option>Bikini Model Juniors</option>
                                <option>Bikini Model Open</option>
                                <option>Bikini Model Masters over 40</option>
                                <option>Bikini Model Masters over 50</option>
                                <option>Bikini Model PRO</option>
                                <option>Glamour Model</option>
                              </optgroup>
                              <optgroup label="Women's Sportmodel & Figure">
                                <option>Women Sportmodel Open</option>
                                <option>Women Sportmodel Masters over 40</option>
                                <option>Women Sportmodel PRO</option>
                                <option>Latino Figure</option>
                                <option>Women Figure Masters over 50</option>
                                <option>Figure PRO</option>
                              </optgroup>
                              <optgroup label="Women's Fitness & Aerobic">
                                <option>Aerobic Juniors 13 to 16 Years</option>
                                <option>Women Aerobic</option>
                                <option>Women Fitness / Performance</option>
                                <option>Women Athletic</option>
                                <option>Women Superbody</option>
                                <option>Women Extrembody</option>
                              </optgroup>
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="font-sans text-xs font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                          <Music size={14} className="text-wff-red" />
                          Posing Music Link (Optional)
                        </label>
                        <input 
                          type="url" 
                          placeholder="Google Drive, Dropbox, etc."
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-wff-red transition-colors font-sans text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Spectator Specific Fields */}
                {activeTab === 'spectator' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <label className="font-sans text-xs font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                        <User size={14} className="text-wff-red" />
                        Ticket Type
                      </label>
                      <select className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-wff-red transition-colors font-sans text-sm appearance-none">
                        <option>General Admission ($100)</option>
                        <option>VIP Ringside ($250)</option>
                        <option>Backstage Pass ($500)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Accommodation Selection */}
                <div className="pt-8 mt-8 border-t border-white/5">
                  <div className="mb-6">
                    <h3 className="font-bebas text-2xl text-white tracking-wider flex items-center gap-3">
                      <Building size={20} className="text-wff-gold" />
                      ACCOMMODATION PARTNERS
                    </h3>
                    <p className="font-sans text-[11px] text-white/50 uppercase tracking-widest mt-1">
                      Select an official host facility for discounted rates and shuttle access.
                    </p>
                  </div>
                  
                  <div className="grid gap-4">
                    {ACCOMMODATIONS.map((acc) => (
                      <div 
                        key={acc.id}
                        onClick={() => setSelectedAccommodation(acc.id)}
                        className={`flex gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedAccommodation === acc.id 
                            ? 'border-wff-gold bg-wff-gold/5' 
                            : 'border-white/10 bg-[#111] hover:border-white/30'
                        }`}
                      >
                        <div className="h-20 w-24 relative rounded-lg overflow-hidden shrink-0">
                          <Image src={acc.image} alt={acc.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 py-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-sans text-sm font-bold text-white">{acc.name}</h4>
                            <span className="font-sans text-sm font-extrabold text-wff-gold">{acc.price}</span>
                          </div>
                          <div className="font-sans text-[11px] text-white/40 uppercase font-semibold mt-1 space-y-0.5">
                            <p>{acc.type}</p>
                            <p className="flex items-center gap-1"><MapPin size={10}/> {acc.distance}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center pr-2">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            selectedAccommodation === acc.id ? 'border-wff-gold bg-wff-gold text-black' : 'border-white/20'
                          }`}>
                            {selectedAccommodation === acc.id && <Check size={12} strokeWidth={4} />}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => setSelectedAccommodation(null)}
                      className="text-left font-sans text-xs text-white/40 hover:text-white transition-colors underline underline-offset-2 mt-2"
                    >
                      I arrange my own accommodation
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary / Payment Column */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sticky top-28">
              <h3 className="font-bebas text-2xl text-white mb-6 tracking-wider border-b border-white/10 pb-4">
                TRANSACTION SUMMARY
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm font-sans">
                  <span className="text-white/60">Base Ticket / Entry</span>
                  <span className="text-white font-bold">$100.00</span>
                </div>
                
                {activeTab === 'athlete' && hasCrossover && (
                  <div className="flex justify-between items-center text-sm font-sans text-wff-red">
                    <span className="flex items-center gap-2">
                      <Activity size={14} /> Additional Class
                    </span>
                    <span className="font-bold">+$50.00</span>
                  </div>
                )}
                
                {selectedAccommodation && (
                  <div className="flex justify-between items-center text-sm font-sans text-wff-gold">
                    <span className="flex items-center gap-2">
                      <Building size={14} /> Accommodation Deposit
                    </span>
                    <span className="font-bold">+$50.00</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm font-sans">
                  <span className="text-white/60">Tax / Handling (2%)</span>
                  <span className="text-white font-bold">
                    ${((100 + (hasCrossover && activeTab === 'athlete' ? 50 : 0) + (selectedAccommodation ? 50 : 0)) * 0.02).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-8">
                <span className="font-sans text-xs uppercase tracking-widest text-white/70">Total Due</span>
                <span className="font-bebas text-4xl text-wff-red">
                  ${(
                    100 + 
                    (hasCrossover && activeTab === 'athlete' ? 50 : 0) + 
                    (selectedAccommodation ? 50 : 0) + 
                    ((100 + (hasCrossover && activeTab === 'athlete' ? 50 : 0) + (selectedAccommodation ? 50 : 0)) * 0.02)
                  ).toFixed(2)}
                </span>
              </div>
              
              <button className="w-full bg-white text-black font-bebas text-2xl tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-wff-gold hover:text-black transition-colors mb-4">
                <CreditCard size={20} />
                PAY VIA PAYSTACK
              </button>
              
              <div className="text-center font-sans text-[10px] text-white/40 leading-snug">
                <p>By proceeding, you agree to WFF Ghana terms and conditions.</p>
                <p className="mt-1">Payments are securely processed via Paystack. Supports GH Mobile Money & Cards.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
