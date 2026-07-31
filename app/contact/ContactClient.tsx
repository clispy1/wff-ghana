'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
    website: '', // honeypot — hidden from real users
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send your message.');

      setStatus('sent');
      setForm({ name: '', email: '', subject: 'General Inquiry', message: '', website: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your message.');
      setStatus('idle');
    }
  };

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
                <p className="flex items-center"><MapPin className="mr-4 text-wff-red" />Accra, Ghana</p>
                <p className="flex items-center"><Phone className="mr-4 text-wff-red" /> +233 55 011 4716</p>
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
          <div ref={formRef} className="bg-[#111] border border-white/10 p-8 md:p-12 opacity-0 rounded-xl">
            <h3 className="font-bebas text-4xl mb-8">SEND A MESSAGE</h3>

            {status === 'sent' ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-wff-gold mx-auto mb-6" />
                <h4 className="font-bebas text-3xl text-white mb-3">MESSAGE RECEIVED</h4>
                <p className="font-sans text-sm text-white/60 leading-relaxed mb-8">
                  Thanks for reaching out. The federation office will get back to you at the
                  address you gave us, usually within two working days.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="font-bebas text-lg text-wff-gold hover:underline uppercase tracking-widest"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Name</label>
                    <input required type="text" value={form.name} onChange={set('name')} className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors rounded-md" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Email</label>
                    <input required type="email" value={form.email} onChange={set('email')} className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Subject</label>
                  <select value={form.subject} onChange={set('subject')} className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors appearance-none rounded-md">
                    <option>General Inquiry</option>
                    <option>Athlete Registration</option>
                    <option>Sponsorships</option>
                    <option>Press &amp; Media</option>
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Message</label>
                  <textarea required rows={5} value={form.message} onChange={set('message')} className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors resize-none rounded-md"></textarea>
                </div>

                {/* Honeypot: hidden from people, tempting to bots. */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={set('website')}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px opacity-0"
                />

                {error && (
                  <div className="flex gap-3 items-start bg-wff-red/10 border border-wff-red/30 p-4 rounded-md">
                    <AlertCircle className="text-wff-red flex-shrink-0 mt-0.5" size={18} />
                    <p className="font-sans text-sm text-wff-red">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-wff-red text-white font-bebas text-2xl py-4 rounded-md hover:bg-white hover:text-wff-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'SENDING…' : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
