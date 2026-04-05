import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#050505] pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="font-bebas text-4xl tracking-wider">
                WFF <span className="text-wff-red">GHANA</span>
              </div>
            </Link>
            <p className="font-sans text-white/50 text-sm max-w-sm leading-relaxed">
              The official national chapter of the World Fitness Federation. Dedicated to promoting classic, aesthetic bodybuilding and fitness in Ghana and elevating our athletes to the world stage.
            </p>
          </div>

          <div>
            <h4 className="font-bebas text-2xl mb-6">Quick Links</h4>
            <ul className="space-y-3 font-sans text-sm text-white/60">
              <li><Link href="#about" className="hover:text-wff-red transition-colors">About Us</Link></li>
              <li><Link href="#cameroon-2026" className="hover:text-wff-red transition-colors">Cameroon 2026</Link></li>
              <li><Link href="#events" className="hover:text-wff-red transition-colors">Events Calendar</Link></li>
              <li><Link href="#athletes" className="hover:text-wff-red transition-colors">Team Roster</Link></li>
              <li><Link href="#news" className="hover:text-wff-red transition-colors">Latest News</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bebas text-2xl mb-6">Legal</h4>
            <ul className="space-y-3 font-sans text-sm text-white/60">
              <li><a href="#" className="hover:text-wff-red transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-wff-red transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-wff-red transition-colors">Competition Rules</a></li>
              <li><a href="#" className="hover:text-wff-red transition-colors">Anti-Doping Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-sans text-xs text-white/40 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} World Fitness Federation Ghana. All rights reserved.
          </p>
          <div className="font-bebas text-xl text-white/20">
            STRONGER. BOLDER. READY.
          </div>
        </div>
      </div>
    </footer>
  );
}
