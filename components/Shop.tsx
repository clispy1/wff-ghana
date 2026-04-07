'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart } from 'lucide-react';

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
    name: '2026 World Champs Cap',
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
  }
];

export default function Shop() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="shop" ref={sectionRef} className="py-24 bg-[#050505] relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="font-bebas text-5xl md:text-6xl mb-4">OFFICIAL <span className="text-wff-red">MERCH</span></h2>
            <p className="font-sans text-white/60 max-w-xl">Support Team Ghana. Wear the pride. Get your official WFF gear and 2026 World Championship apparel.</p>
          </div>
          <button className="mt-6 md:mt-0 flex items-center font-bebas text-xl text-white hover:text-wff-red transition-colors">
            VIEW ALL PRODUCTS <ShoppingCart className="ml-2" size={20} />
          </button>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="product-card group cursor-pointer">
              <div className="relative aspect-square bg-[#111] border border-white/10 mb-4 overflow-hidden">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Tag */}
                <div className="absolute top-4 left-4 bg-wff-red text-white font-sans text-xs font-bold uppercase tracking-widest px-3 py-1 z-10">
                  {product.tag}
                </div>

                {/* Add to Cart Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                  <button className="bg-white text-wff-dark font-bebas text-xl px-6 py-2 hover:bg-wff-red hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                    ADD TO CART
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <h3 className="font-bebas text-2xl text-white group-hover:text-wff-red transition-colors max-w-[70%]">{product.name}</h3>
                <span className="font-sans font-bold text-wff-gold">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
