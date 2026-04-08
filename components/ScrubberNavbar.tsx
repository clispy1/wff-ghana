'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Federation', href: '/federation' },
  { name: 'Championship', href: '/championship' },
  { name: 'Athletes', href: '/athletes' },
  { name: 'Wellness', href: '/wellness' },
  { name: 'Shop', href: '/shop' },
  { name: 'Media', href: '/media' },
  { name: 'Partnerships', href: '/partnerships' },
];

export default function ScrubberNavbar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const menuLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) return; // Don't collapse if menu is open

      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0;
      
      setProgress(currentProgress);

      // Collapse when scrolling down past hero, expand when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsExpanded(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsExpanded(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Animate mobile menu links
  useEffect(() => {
    if (isMobileMenuOpen && menuLinksRef.current) {
      gsap.fromTo(menuLinksRef.current.children, 
        { opacity: 0, y: 30, rotateX: -20 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.5, stagger: 0.05, ease: 'back.out(1.5)' }
      );
    }
  }, [isMobileMenuOpen]);

  // Determine timeline color based on scroll progress (Chapter colors)
  let timelineColor = '#D4AF37'; // Gold (Act 1)
  if (progress > 25 && progress <= 50) timelineColor = '#CE1126'; // Red (Act 2)
  if (progress > 50 && progress <= 75) timelineColor = '#008080'; // Teal (Act 3)
  if (progress > 75) timelineColor = '#FFFFFF'; // White (Act 4)

  return (
    <>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <div 
          className="bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 rounded-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center shadow-2xl"
          style={{ 
            width: isExpanded ? 'auto' : '240px', 
            height: '64px',
            borderColor: isExpanded ? 'rgba(255,255,255,0.1)' : `${timelineColor}40`
          }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => { if (window.scrollY > 100 && !isMobileMenuOpen) setIsExpanded(false) }}
        >
          
          {/* Expanded State: Navigation Links */}
          <div 
            className={`flex items-center px-6 md:px-8 space-x-4 md:space-x-6 transition-all duration-300 ${
              isExpanded ? 'opacity-100 w-auto visible' : 'opacity-0 w-0 invisible absolute'
            }`}
          >
            <Link href="/" className="font-bebas text-2xl md:text-3xl text-white md:mr-4 tracking-wider hover:text-wff-red transition-colors">
              WFF
            </Link>
            
            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                      isActive ? 'text-wff-red' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              <Link 
                href="/contact"
                className="ml-4 bg-wff-red text-white font-bebas text-xl px-6 py-2 tracking-wider hover:bg-white hover:text-wff-red transition-colors"
              >
                REGISTER
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button 
              className="md:hidden text-white p-2 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* Collapsed State: Scrubber Timeline */}
          <div 
            className={`absolute inset-0 flex items-center justify-center px-8 transition-all duration-300 ${
              isExpanded ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="w-full flex items-center space-x-4">
              <span className="font-bebas text-xl text-white/50">01</span>
              <div className="flex-1 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full transition-all duration-200 ease-linear"
                  style={{ 
                    width: `${progress}%`, 
                    backgroundColor: timelineColor,
                    boxShadow: `0 0 10px ${timelineColor}`
                  }}
                />
              </div>
              <span className="font-bebas text-xl text-white/50">04</span>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Fullscreen Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-[#050505] flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background accent */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-wff-red/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-wff-gold/10 blur-[100px] rounded-full"></div>
        </div>

        <div ref={menuLinksRef} className="flex flex-col items-center space-y-6 relative z-10 w-full px-6" style={{ perspective: '1000px' }}>
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-bebas text-5xl sm:text-6xl tracking-widest transition-all duration-300 hover:scale-110 ${
                  isActive ? 'text-wff-red' : 'text-white hover:text-wff-gold hover:italic'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="w-16 h-px bg-white/20 my-4"></div>
          <Link 
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-wff-red text-white font-bebas text-3xl px-12 py-4 tracking-wider hover:bg-white hover:text-wff-red transition-colors"
          >
            REGISTER NOW
          </Link>
        </div>
      </div>
    </>
  );
}
