'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { ChevronLeft, Check } from 'lucide-react';

// Mock data - in a real app this would come from an API/DB
const products = [
  {
    id: '1',
    name: 'Official Team Ghana Track Jacket',
    price: 450.00,
    image: 'https://picsum.photos/seed/jacket/800/800',
    category: 'Outerwear',
    description: 'Premium track jacket with WFF Ghana embroidery. Designed for athletes to stay warm before hitting the stage or the gym. Features moisture-wicking fabric and a tailored athletic fit.',
    tag: 'New Arrival',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    details: ['100% Polyester', 'Embroidered Logo', 'Zip Pockets', 'Athletic Fit']
  },
  {
    id: '2',
    name: 'WFF Ghana Performance Tee',
    price: 150.00,
    image: 'https://picsum.photos/seed/tee/800/800',
    category: 'T-Shirts',
    description: 'Moisture-wicking performance tee for intense workouts. Built to withstand the toughest training sessions while keeping you cool and dry.',
    tag: 'Bestseller',
    sizes: ['S', 'M', 'L', 'XL'],
    details: ['90% Polyester, 10% Spandex', '4-Way Stretch', 'Anti-Odor Technology']
  },
  {
    id: '3',
    name: '2026 All Africa Champs Cap',
    price: 120.00,
    image: 'https://picsum.photos/seed/cap/800/800',
    category: 'Accessories',
    description: 'Adjustable snapback cap with 2026 Championship logo. A must-have commemorative item for the historic event in Accra.',
    tag: 'Limited Edition',
    sizes: ['One Size'],
    details: ['Cotton Twill', 'Embroidered Front & Side', 'Adjustable Snap Closure']
  },
  {
    id: '4',
    name: 'Premium Lifting Belt',
    price: 350.00,
    image: 'https://picsum.photos/seed/belt/800/800',
    category: 'Gear',
    description: 'Genuine leather lifting belt for heavy compound movements. Provides essential core support for squats and deadlifts.',
    tag: 'Gear',
    sizes: ['S', 'M', 'L'],
    details: ['10mm Thickness', 'Genuine Leather', 'Heavy Duty Steel Buckle']
  },
  {
    id: '5',
    name: 'WFF Stringer Tank',
    price: 100.00,
    image: 'https://picsum.photos/seed/tank/800/800',
    category: 'Tanks',
    description: 'Classic stringer tank top to show off your physique. The quintessential bodybuilding staple.',
    tag: '',
    sizes: ['M', 'L', 'XL'],
    details: ['100% Cotton', 'Y-Back Design', 'Deep Armholes']
  },
  {
    id: '6',
    name: 'Ghana Meets Africa Hoodie',
    price: 300.00,
    image: 'https://picsum.photos/seed/hoodie/800/800',
    category: 'Outerwear',
    description: 'Heavyweight hoodie celebrating the All Africa Championship. Perfect for pump covers or casual wear.',
    tag: 'Exclusive',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    details: ['80% Cotton, 20% Polyester', 'Fleece Lined', 'Kangaroo Pocket']
  }
];

export default function ProductClient({ id }: { id: string }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
      if (found.sizes.length > 0) {
        setSelectedSize(found.sizes[0]);
      }
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedSize);
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
          
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-[#111] border border-white/10 w-full rounded-xl overflow-hidden">
              <Image 
                src={product.image} 
                alt={product.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              {product.tag && (
                <div className="absolute top-6 left-6 bg-wff-red text-white font-sans text-sm font-bold uppercase tracking-widest px-4 py-2 z-10 rounded-md">
                  {product.tag}
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative aspect-square bg-[#111] border border-white/10 cursor-pointer hover:border-wff-gold transition-colors rounded-lg overflow-hidden">
                  <Image 
                    src={`${product.image}?random=${i}`} 
                    alt={`${product.name} view ${i}`}
                    fill
                    className="object-cover opacity-50 hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <p className="font-sans text-wff-red font-bold uppercase tracking-[0.3em] text-sm mb-4">{product.category}</p>
            <h1 className="font-bebas text-5xl md:text-7xl text-white mb-6 leading-none">{product.name}</h1>
            <p className="font-bebas text-4xl text-wff-gold mb-8">₵ {product.price.toFixed(2)}</p>
            
            <div className="border-y border-white/10 py-8 mb-8 space-y-8">
              <p className="font-sans text-white/70 text-lg leading-relaxed">
                {product.description}
              </p>
              
              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-sans text-sm uppercase tracking-widest text-white/50">Select Size</span>
                    <span className="font-sans text-xs uppercase tracking-widest text-wff-gold cursor-pointer hover:underline">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 font-sans font-bold text-sm flex items-center justify-center border transition-all rounded-md ${
                          selectedSize === size 
                            ? 'border-wff-red bg-wff-red text-white' 
                            : 'border-white/20 text-white hover:border-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
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

            {/* Details List */}
            <div className="mt-12">
              <h3 className="font-bebas text-2xl text-white mb-6">PRODUCT DETAILS</h3>
              <ul className="space-y-3">
                {product.details.map((detail: string, idx: number) => (
                  <li key={idx} className="flex items-center font-sans text-white/60 text-sm">
                    <div className="w-1.5 h-1.5 bg-wff-red rounded-full mr-3"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
