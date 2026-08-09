'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { HomeContent } from '@/lib/homeContent';
import { SectionSkeleton } from './SectionSkeleton';

export interface ArmoryProduct {
  id: string;
  name: string;
  price: number;
  img: string;
  category: string;
  description: string;
}

/** Official Merchandise Shop — product grid from the Armory. */
export function ArmorySection({
  armory,
  products,
}: {
  armory?: HomeContent['armory'];
  products: ArmoryProduct[];
}) {
  if (!armory) return <SectionSkeleton />;

  return (
    <section className="py-24 bg-wff-dark relative overflow-hidden border-b border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal-target">
          <div>
            <p className="font-sans text-wff-red font-bold uppercase tracking-[0.4em] text-xs mb-3">
              {armory.supertitle}
            </p>
            <h2 className="font-bebas text-5xl md:text-7xl text-white select-none">
              {armory.title}
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex border border-white/10 hover:border-white text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 mb-2"
          >
            View Full Gallery
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="text-white/40 text-sm col-span-full text-center py-8">
              Merchandise will be listed here soon.
            </p>
          ) : (
            products.map((product) => (
              <Link
                href={`/shop/${product.id}`}
                key={product.id}
                className="reveal-target group cursor-pointer block"
              >
                <div className="relative aspect-[4/5] bg-[#111] border border-white/10 overflow-hidden mb-5 rounded-2xl">
                  <div className="absolute inset-0 bg-wff-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 bg-black/90 backdrop-blur-xs">
                    <span className="block w-full text-center font-bebas text-lg text-wff-gold tracking-widest">
                      VIEW IN SHOP
                    </span>
                  </div>
                </div>
                <h3 className="font-bebas text-2xl text-white mb-0.5 group-hover:text-wff-red transition-colors tracking-wide truncate">
                  {product.name}
                </h3>
                <p className="font-sans text-xs text-white/50">
                  {typeof product.price === 'number'
                    ? `₵ ${product.price.toFixed(2)}`
                    : `₵ ${product.price}`}
                </p>
              </Link>
            ))
          )}
        </div>

        <div className="mt-8 text-center md:hidden reveal-target">
          <Link
            href="/shop"
            className="inline-block border border-white/15 text-white font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 w-full"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
