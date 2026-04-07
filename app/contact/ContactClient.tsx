'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

export default function ContactClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      gsap.fromTo(formRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.7 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-wff-dark">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-20 opacity-0">
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">GET IN <span className="text-wff-red">TOUCH</span></h1>
          <p className="font-sans text-xl text-white/70">
            Have questions about the 2026 All Africa Championship, athlete registration, or sponsorships? We are here to help.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h3 className="font-bebas text-3xl mb-6 text-wff-gold">HEADQUARTERS</h3>
              <div className="space-y-4 font-sans text-white/70">
                <p className="flex items-center"><MapPin className="mr-4 text-wff-red" /> 12 Independence Ave, Ridge, Accra, Ghana</p>
                <p className="flex items-center"><Phone className="mr-4 text-wff-red" /> +233 24 123 4567</p>
                <p className="flex items-center"><Mail className="mr-4 text-wff-red" /> info@wffghana.com</p>
              </div>
            </div>

            <div>
              <h3 className="font-bebas text-3xl mb-6 text-wff-gold">SOCIAL MEDIA</h3>
              <div className="flex space-x-6">
                <a href="#" className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center hover:bg-wff-red hover:border-wff-red transition-colors group">
                  <Instagram className="text-white/70 group-hover:text-white" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center hover:bg-wff-red hover:border-wff-red transition-colors group">
                  <Facebook className="text-white/70 group-hover:text-white" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center hover:bg-wff-red hover:border-wff-red transition-colors group">
                  <Twitter className="text-white/70 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef} className="bg-[#111] border border-white/10 p-8 md:p-12 opacity-0">
            <h3 className="font-bebas text-4xl mb-8">SEND A MESSAGE</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Name</label>
                  <input type="text" className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors" />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Email</label>
                  <input type="email" className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Subject</label>
                <select className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors appearance-none">
                  <option>General Inquiry</option>
                  <option>Athlete Registration</option>
                  <option>Sponsorships</option>
                  <option>Press & Media</option>
                </select>
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Message</label>
                <textarea rows={5} className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors resize-none"></textarea>
              </div>
              <button type="button" className="w-full bg-wff-red text-white font-bebas text-2xl py-4 hover:bg-white hover:text-wff-dark transition-colors">
                SEND MESSAGE
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
