'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: '1',
    name: 'Official Team Ghana Track Jacket',
    price: 450.00,
    image: 'https://picsum.photos/seed/jacket/600/600',
    category: 'Outerwear',
    description: 'Premium track jacket with WFF Ghana embroidery.',
    tag: 'New Arrival'
  },
  {
    id: '2',
    name: 'WFF Ghana Performance Tee',
    price: 150.00,
    image: 'https://picsum.photos/seed/tee/600/600',
    category: 'T-Shirts',
    description: 'Moisture-wicking performance tee for intense workouts.',
    tag: 'Bestseller'
  },
  {
    id: '3',
    name: '2026 All Africa Champs Cap',
    price: 120.00,
    image: 'https://picsum.photos/seed/cap/600/600',
    category: 'Accessories',
    description: 'Adjustable snapback cap with 2026 Championship logo.',
    tag: 'Limited Edition'
  },
  {
    id: '4',
    name: 'Premium Lifting Belt',
    price: 350.00,
    image: 'https://picsum.photos/seed/belt/600/600',
    category: 'Gear',
    description: 'Genuine leather lifting belt for heavy compound movements.',
    tag: 'Gear'
  },
  {
    id: '5',
    name: 'WFF Stringer Tank',
    price: 100.00,
    image: 'https://picsum.photos/seed/tank/600/600',
    category: 'Tanks',
    description: 'Classic stringer tank top to show off your physique.',
    tag: ''
  },
  {
    id: '6',
    name: 'Ghana Meets Africa Hoodie',
    price: 300.00,
    image: 'https://picsum.photos/seed/hoodie/600/600',
    category: 'Outerwear',
    description: 'Heavyweight hoodie celebrating the All Africa Championship.',
    tag: 'Exclusive'
  }
];

export default function ShopClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { addToCart, setIsCartOpen } = useCart();

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

  return (
    <main className="pt-32 pb-24 min-h-screen bg-wff-dark">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-end mb-16 opacity-0">
          <div>
            <h1 className="font-bebas text-6xl md:text-8xl mb-4">THE <span className="text-wff-red">ARMORY</span></h1>
            <p className="font-sans text-white/60 max-w-xl text-lg">Support Team Ghana. Wear the pride. Get your official WFF gear and 2026 Championship apparel.</p>
          </div>
        </div>

        {/* Product Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => (
            <Link href={`/shop/${product.id}`} key={product.id} className="product-card group cursor-pointer block">
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
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation(); 
                      addToCart(product, 1, 'L'); // Default size L for now
                    }}
                    className="bg-white text-wff-dark font-bebas text-2xl px-8 py-3 hover:bg-wff-gold transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <h3 className="font-bebas text-3xl text-white group-hover:text-wff-gold transition-colors max-w-[70%]">{product.name}</h3>
                <span className="font-sans font-bold text-wff-gold text-lg">₵ {product.price.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
