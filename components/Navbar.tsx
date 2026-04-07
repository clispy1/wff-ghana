'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Ghana 2026', href: '#ghana-2026' },
  { name: 'Events', href: '#events' },
  { name: 'Athletes', href: '#athletes' },
  { name: 'Wellness', href: '#wellness' },
  { name: 'Shop', href: '#shop' },
  { name: 'News', href: '#news' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      
      if (window.scrollY > 50) {
        gsap.to(navRef.current, {
          backgroundColor: 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(10px)',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          duration: 0.3,
        });
      } else {
        gsap.to(navRef.current, {
          backgroundColor: 'transparent',
          backdropFilter: 'blur(0px)',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0)',
          duration: 0.3,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        x: '0%',
        duration: 0.5,
        ease: 'power3.inOut',
      });
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(menuRef.current, {
        x: '100%',
        duration: 0.5,
        ease: 'power3.inOut',
      });
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <>
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 py-6 px-6 md:px-12 transition-all flex justify-between items-center"
      >
        <Link href="/" className="z-50 relative group">
          <div className="font-bebas text-3xl tracking-wider">
            WFF <span className="text-wff-red transition-colors group-hover:text-white">GHANA</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="font-sans text-sm uppercase tracking-widest text-white/80 hover:text-wff-red transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-wff-red transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          <Link 
            href="#register"
            className="bg-wff-red text-white font-bebas text-xl px-6 py-2 tracking-wider hover:bg-white hover:text-wff-red transition-colors duration-300"
          >
            JOIN TEAM GHANA
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden z-50 relative text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div 
        ref={menuRef}
        className="fixed inset-0 bg-wff-dark z-40 translate-x-full flex flex-col justify-center items-center space-y-8 px-6"
      >
        {navLinks.map((link, i) => (
          <Link 
            key={link.name} 
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="font-bebas text-4xl tracking-wider text-white hover:text-wff-red transition-colors"
          >
            {link.name}
          </Link>
        ))}
        <Link 
          href="#register"
          onClick={() => setIsOpen(false)}
          className="bg-wff-red text-white font-bebas text-3xl px-8 py-4 tracking-wider hover:bg-white hover:text-wff-red transition-colors duration-300 mt-8"
        >
          JOIN TEAM GHANA
        </Link>
      </div>
    </>
  );
}
