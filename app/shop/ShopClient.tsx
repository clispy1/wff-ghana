'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    name: 'Official Team Ghana Track Jacket',
    price: '₵ 450.00',
    image: 'https://picsum.photos/seed/jacket/600/600',
    tag: 'New Arrival'
  },
  {
    id: 2,
    name: 'WFF Ghana Performance Tee',
    price: '₵ 150.00',
    image: 'https://picsum.photos/seed/tee/600/600',
    tag: 'Bestseller'
  },
  {
    id: 3,
    name: '2026 All Africa Champs Cap',
    price: '₵ 120.00',
    image: 'https://picsum.photos/seed/cap/600/600',
    tag: 'Limited Edition'
  },
  {
    id: 4,
    name: 'Premium Lifting Belt',
    price: '₵ 350.00',
    image: 'https://picsum.photos/seed/belt/600/600',
    tag: 'Gear'
  },
  {
    id: 5,
    name: 'WFF Stringer Tank',
    price: '₵ 100.00',
    image: 'https://picsum.photos/seed/tank/600/600',
    tag: ''
  },
  {
    id: 6,
    name: 'Ghana Meets Africa Hoodie',
    price: '₵ 300.00',
    image: 'https://picsum.photos/seed/hoodie/600/600',
    tag: 'Exclusive'
  }
];

export default function ShopClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll('.product-card');
        gsap.fromTo(items,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      gsap.to(cartRef.current, { x: '0%', duration: 0.4, ease: 'power3.out' });
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(cartRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
      document.body.style.overflow = '';
    }
  }, [isCartOpen]);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-wff-dark">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-end mb-16 opacity-0">
          <div>
            <h1 className="font-bebas text-6xl md:text-8xl mb-4">OFFICIAL <span className="text-wff-red">MERCH</span></h1>
            <p className="font-sans text-white/60 max-w-xl text-lg">Support Team Ghana. Wear the pride. Get your official WFF gear and 2026 Championship apparel.</p>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="mt-6 md:mt-0 flex items-center font-bebas text-2xl text-white hover:text-wff-gold transition-colors bg-[#111] border border-white/10 px-6 py-3"
          >
            CART (0) <ShoppingCart className="ml-3" size={24} />
          </button>
        </div>

        {/* Product Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => (
            <div key={product.id} className="product-card group cursor-pointer">
              <div className="relative aspect-square bg-[#111] border border-white/10 mb-6 overflow-hidden">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Tag */}
                {product.tag && (
                  <div className="absolute top-4 left-4 bg-wff-red text-white font-sans text-xs font-bold uppercase tracking-widest px-3 py-1 z-10">
                    {product.tag}
                  </div>
                )}

                {/* Add to Cart Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsCartOpen(true); }}
                    className="bg-white text-wff-dark font-bebas text-2xl px-8 py-3 hover:bg-wff-gold transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <h3 className="font-bebas text-3xl text-white group-hover:text-wff-gold transition-colors max-w-[70%]">{product.name}</h3>
                <span className="font-sans font-bold text-wff-gold text-lg">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-out Cart */}
      <div 
        ref={cartRef} 
        className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#0A0A0A] border-l border-white/10 z-[100] translate-x-full flex flex-col"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="font-bebas text-3xl">YOUR CART</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-white/50 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>
        
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <ShoppingCart size={48} className="text-white/20 mb-4" />
          <p className="font-sans text-white/50">Your cart is currently empty.</p>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="mt-8 border border-wff-gold text-wff-gold font-bebas text-xl px-8 py-3 hover:bg-wff-gold hover:text-wff-dark transition-colors"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
      
      {/* Cart Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}
    </main>
  );
}
