import Hero from '@/components/Hero';
import Manifesto from '@/components/Manifesto';
import FeaturedAthletes from '@/components/FeaturedAthletes';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative bg-wff-dark min-h-screen">
      <Hero />
      
      <Manifesto />
      
      {/* Quick Access Teasers */}
      <section className="py-24 border-t border-white/10 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <Link href="/championship" className="group relative aspect-square bg-[#111] border border-white/10 overflow-hidden flex flex-col justify-end p-8 hover:border-wff-red transition-colors">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/accra-venue/800/800')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-500 grayscale group-hover:grayscale-0"></div>
              <div className="relative z-10">
                <p className="font-sans text-wff-gold font-bold uppercase tracking-widest text-xs mb-2">Sept 26, 2026</p>
                <h3 className="font-bebas text-4xl mb-4">THE EVENT</h3>
                <span className="font-sans text-sm uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">View Details →</span>
              </div>
            </Link>

            <Link href="/athletes" className="group relative aspect-square bg-[#111] border border-white/10 overflow-hidden flex flex-col justify-end p-8 hover:border-wff-gold transition-colors">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/athlete-training/800/800')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-500 grayscale group-hover:grayscale-0"></div>
              <div className="relative z-10">
                <p className="font-sans text-wff-red font-bold uppercase tracking-widest text-xs mb-2">Join The Roster</p>
                <h3 className="font-bebas text-4xl mb-4">ATHLETES</h3>
                <span className="font-sans text-sm uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">Register Now →</span>
              </div>
            </Link>

            <Link href="/partnerships" className="group relative aspect-square bg-[#111] border border-white/10 overflow-hidden flex flex-col justify-end p-8 hover:border-white transition-colors">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/boardroom/800/800')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-500 grayscale group-hover:grayscale-0"></div>
              <div className="relative z-10">
                <p className="font-sans text-white/80 font-bold uppercase tracking-widest text-xs mb-2">Corporate</p>
                <h3 className="font-bebas text-4xl mb-4">PARTNERSHIPS</h3>
                <span className="font-sans text-sm uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">Sponsor The Event →</span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      <FeaturedAthletes />

      {/* Sponsors Marquee Teaser */}
      <section className="py-12 border-t border-b border-white/10 bg-[#050505] overflow-hidden">
        <div className="container mx-auto px-6 mb-8 text-center">
          <p className="font-sans text-white/50 uppercase tracking-[0.3em] text-sm font-bold">Official Sponsors & Partners</p>
        </div>
        <div className="flex space-x-16 animate-[marquee_20s_linear_infinite] whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity duration-500">
          {/* Simulated Sponsor Logos */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="inline-block font-bebas text-4xl text-white/30">
              BRAND {i}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
