import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-page pt-20 pb-10 border-t border-fg/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="font-bebas text-4xl tracking-wider">
                WFF <span className="text-wff-red">GHANA</span>
              </div>
            </Link>
            <p className="font-sans text-fg/50 text-sm max-w-sm leading-relaxed">
              The official national chapter of the World Fitness Federation. Dedicated to promoting classic, aesthetic bodybuilding and fitness in Ghana and elevating our athletes to the world stage.
            </p>
          </div>

          <div>
            <h4 className="font-bebas text-2xl mb-6">Quick Links</h4>
            <ul className="space-y-3 font-sans text-sm text-fg/60">
              <li><Link href="/federation" className="hover:text-wff-red transition-colors">The Federation</Link></li>
              <li><Link href="/championship" className="hover:text-wff-red transition-colors">All Africa Championship</Link></li>
              <li><Link href="/media" className="hover:text-wff-red transition-colors">Gallery</Link></li>
              <li><Link href="/shop" className="hover:text-wff-red transition-colors">Official Shop</Link></li>
              <li><Link href="/contact" className="hover:text-wff-red transition-colors">Contact</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-fg/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-sans text-xs text-fg/40 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} World Fitness Federation Ghana. All rights reserved.
          </p>
          <div className="font-bebas text-xl text-fg/20">
            STRONGER. BOLDER. READY.
          </div>
        </div>
      </div>
    </footer>
  );
}
