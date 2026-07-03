'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { supabase } from '@/lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// Default fallback layout, will be overridden by DB state.
const initialProducts: any[] = [];

export default function ShopClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<any[]>(initialProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('ecommerce_products').select('*');
      if (data && !error) {
        setProducts(data.map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          image: p.image_url,
          category: p.category,
          description: p.description,
          tag: p.tag
        })));
      }
    };
    fetchProducts();
  }, []);

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
              <div className="relative aspect-square bg-[#111] border border-white/10 mb-6 overflow-hidden rounded-xl">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Tag */}
                {product.tag && (
                  <div className="absolute top-4 left-4 bg-wff-red text-white font-sans text-xs font-bold uppercase tracking-widest px-3 py-1 z-10 rounded-md">
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
