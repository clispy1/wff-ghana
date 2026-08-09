'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { ChevronLeft, Check } from 'lucide-react';

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  tag: string | null;
}

export default function ProductClient({ product }: { product: ProductDetail | null }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (!product) {
    return (
      <main className="pt-32 pb-24 min-h-screen bg-wff-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-bebas text-6xl text-white mb-4">PRODUCT NOT FOUND</h1>
          <Link href="/shop" className="text-wff-gold hover:underline font-sans tracking-widest uppercase text-sm">
            Return to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 min-h-screen bg-wff-dark">
      <div className="container mx-auto px-6">

        <Link href="/shop" className="inline-flex items-center text-white/50 hover:text-wff-gold transition-colors font-sans text-xs uppercase tracking-widest mb-12">
          <ChevronLeft size={16} className="mr-2" /> Back to Armory
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Image */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-[#111] border border-white/10 w-full rounded-xl overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="absolute inset-0 bg-[#161616]" />
              )}
              {product.tag && (
                <div className="absolute top-6 left-6 bg-wff-red text-white font-sans text-sm font-bold uppercase tracking-widest px-4 py-2 z-10 rounded-md">
                  {product.tag}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <p className="font-sans text-wff-red font-bold uppercase tracking-[0.3em] text-sm mb-4">{product.category}</p>
            <h1 className="font-bebas text-5xl md:text-7xl text-white mb-6 leading-none">{product.name}</h1>
            <p className="font-bebas text-4xl text-wff-gold mb-8">₵ {product.price.toFixed(2)}</p>

            <div className="border-y border-white/10 py-8 mb-8">
              <p className="font-sans text-white/70 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="block font-sans text-sm uppercase tracking-widest text-white/50 mb-4">Quantity</span>
              <div className="flex items-center border border-white/20 w-max rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-sans font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full font-bebas text-3xl py-6 transition-all flex items-center justify-center rounded-md ${
                isAdded
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-black hover:bg-wff-red hover:text-white'
              }`}
            >
              {isAdded ? (
                <><Check className="mr-2" /> ADDED TO CART</>
              ) : (
                'ADD TO CART'
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
