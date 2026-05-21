'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

interface SubLink {
  name: string;
  href: string;
  desc: string;
}

interface NavItem {
  title: string;
  isDropdown: boolean;
  href?: string;
  items?: SubLink[];
}

const navItems: NavItem[] = [
  {
    title: 'Federation',
    isDropdown: true,
    items: [
      { name: 'Board & Mission', href: '/federation', desc: 'World Fitness Federation Ghana chapter and executive board.' },
      { name: 'Holistic Wellness', href: '/federation#wellness', desc: 'Commitment to sustainable health, recovery, and nutrition.' },
      { name: 'Corporate Sponsorship', href: '/federation#partnerships', desc: 'Corporate sponsorship packages and requester deck.' }
    ]
  },
  {
    title: 'Championship',
    isDropdown: true,
    items: [
      { name: 'Main Event Overview', href: '/championship', desc: 'Overview of the grandest continent-wide showdown.' },
      { name: 'Championship Tickets', href: '/championship#tickets', desc: 'General admission seats and VIP backstage passes.' },
      { name: 'Hourly Timetable', href: '/championship#schedule', desc: 'Official schedule, weighing slots & division sessions.' },
      { name: 'Host Hotels & Visas', href: '/championship#logistics', desc: 'Airport transfers, health rules & host hotels.' },
      { name: 'Ghana Roster', href: '/championship#roster', desc: 'The national squad profiles and elite achievements.' },
      { name: 'Athlete Portal', href: '/championship#portal', desc: 'Athletes registration & music tracks uploader.' }
    ]
  },
  {
    title: 'Official Shop',
    isDropdown: false,
    href: '/shop'
  },
  {
    title: 'Contact',
    isDropdown: false,
    href: '/contact'
  }
];

export default function ScrubberNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [activeMobileAccordion, setActiveMobileAccordion] = useState<number | null>(null);
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setActiveMobileAccordion(null);
  }, [pathname]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'py-3' 
            : 'py-6'
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div 
            className={`mx-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 border ${
              isScrolled 
                ? 'bg-black/92 backdrop-blur-md border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.85)]' 
                : 'bg-black/45 backdrop-blur-sm border-white/5'
            }`}
          >
            {/* Brand Logo */}
            <Link href="/" className="relative flex items-center gap-3 group">
              <div className="relative w-9 h-9 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-105">
                <Image 
                  src="/wff-ghana-logo.svg" 
                  alt="WFF Ghana" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bebas text-2xl tracking-widest text-white group-hover:text-wff-gold transition-colors">
                WFF <span className="text-wff-red">GHANA</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item, itemIdx) => {
                if (!item.isDropdown) {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.title}
                      href={item.href || '/'}
                      className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-colors ${
                        isActive 
                          ? 'text-wff-gold' 
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {item.title}
                    </Link>
                  );
                }

                const isGroupActive = item.items?.some(sub => pathname === sub.href) || false;
                return (
                  <div 
                    key={item.title}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(itemIdx)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button 
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-bold transition-colors ${
                        isGroupActive 
                          ? 'text-wff-gold' 
                          : 'text-white/70 hover:text-white'
                      }`}
                      aria-expanded={activeDropdown === itemIdx}
                    >
                      {item.title}
                      <ChevronDown 
                        size={12} 
                        className={`transition-transform duration-300 ${
                          activeDropdown === itemIdx ? 'rotate-180 text-wff-red' : 'text-white/40'
                        }`} 
                      />
                    </button>

                    {/* Desktop Dropdown Content */}
                    <div 
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl transition-all duration-300 origin-top ${
                        activeDropdown === itemIdx 
                          ? 'opacity-100 scale-100 pointer-events-auto visible' 
                          : 'opacity-0 scale-95 pointer-events-none invisible'
                      }`}
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 rotate-45 bg-[#050505] border-t border-l border-white/10"></div>
                      <div className="relative z-10 space-y-1">
                        {item.items?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`group/item block p-3 rounded-xl transition-all duration-200 ${
                                isSubActive 
                                  ? 'bg-wff-red/10 border border-wff-red/20' 
                                  : 'hover:bg-white/5 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                                  isSubActive ? 'text-wff-red' : 'text-white group-hover/item:text-wff-gold'
                                }`}>
                                  {sub.name}
                                </span>
                                <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-wff-gold" />
                              </div>
                              <p className="text-white/50 text-[11px] leading-normal font-sans antialiased">
                                {sub.desc}
                              </p>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Registration CTA button on desktop */}
              <Link 
                href="/championship#portal"
                className="hidden sm:inline-flex items-center justify-center bg-wff-red text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-all shadow-md hover:scale-105 active:scale-95 duration-200"
              >
                Register Athlete
              </Link>

              {/* Shopping Bag Icon Button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-white/80 hover:text-white transition-colors bg-white/5 hover:bg-white/10 border border-white/5 rounded-full"
                aria-label="Open cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-wff-red text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-black">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Drawer Trigger */}
              <button 
                className="lg:hidden p-2.5 text-white/80 hover:text-white transition-colors bg-white/5 hover:bg-white/10 border border-white/5 rounded-full"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Accordion Drawer */}
      <div 
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-full flex flex-col pt-28 pb-10 px-6 overflow-y-auto">
          {/* Menu Sections (Accordions) */}
          <div className="flex-grow space-y-4">
            {navItems.map((item, itemIdx) => {
              if (!item.isDropdown) {
                const isActive = pathname === item.href;
                return (
                  <div key={item.title} className="border-b border-white/10 pb-4">
                    <Link
                      href={item.href || '/'}
                      className={`block py-1 font-bebas text-3xl tracking-widest uppercase ${
                        isActive ? 'text-wff-gold' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </Link>
                  </div>
                );
              }

              const worksInGroup = activeMobileAccordion === itemIdx;
              const isGroupActive = item.items?.some(sub => pathname === sub.href) || false;
              return (
                <div key={item.title} className="border-b border-white/10 pb-4">
                  <button
                    onClick={() => setActiveMobileAccordion(worksInGroup ? null : itemIdx)}
                    className="w-full flex items-center justify-between py-1 text-left"
                  >
                    <span className={`font-bebas text-3xl tracking-widest uppercase ${
                      isGroupActive ? 'text-wff-gold' : 'text-white'
                    }`}>
                      {item.title}
                    </span>
                    <ChevronDown 
                      size={20} 
                      className={`text-white/40 transition-transform duration-300 ${
                        worksInGroup ? 'rotate-180 text-wff-red' : ''
                      }`} 
                    />
                  </button>

                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      worksInGroup ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 overflow-hidden'
                    }`}
                  >
                    <div className="overflow-hidden space-y-3 pl-2">
                      {item.items?.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`block p-2 rounded-lg transition-colors ${
                              isSubActive ? 'text-wff-red font-semibold' : 'text-white/70 hover:text-white'
                            }`}
                          >
                            <span className="text-sm font-bold uppercase tracking-wider block">
                              {sub.name}
                            </span>
                            <span className="text-white/40 text-[11px] font-sans block mt-0.5">
                              {sub.desc}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Contact & Register Options */}
          <div className="mt-8 space-y-4">
            <Link 
              href="/championship#portal"
              className="flex items-center justify-center w-full bg-wff-red hover:bg-white text-white hover:text-black py-4 rounded-xl font-bebas text-2xl tracking-widest transition-colors shadow-lg"
            >
              REGISTER ATHLETE NOW
            </Link>
            <div className="text-center font-sans text-xs text-white/40">
              World Fitness Federation Ghana © 2026
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
