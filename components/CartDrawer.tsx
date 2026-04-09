'use client';

import { useCart } from '@/lib/CartContext';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.3, ease: 'power2.out' });
      gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: 'power3.out' });
    } else {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.in' });
      gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
    }
  }, [isCartOpen]);

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] opacity-0 pointer-events-none"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div 
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0A0A0A] border-l border-white/10 z-[101] translate-x-full flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-bebas text-3xl text-white flex items-center gap-3">
            <ShoppingBag className="text-wff-red" /> 
            YOUR ARMORY
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <ShoppingBag size={64} className="mb-4 text-wff-gold" />
              <p className="font-bebas text-2xl text-white mb-2">YOUR CART IS EMPTY</p>
              <p className="font-sans text-sm">Gear up for the championship.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-8 border border-white/20 px-8 py-3 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-[#111] p-4 border border-white/5">
                <div className="relative w-24 h-24 bg-black border border-white/10 flex-shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bebas text-xl text-white leading-none">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-white/40 hover:text-wff-red transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="font-sans text-xs text-wff-gold uppercase tracking-widest mt-1">
                      {item.size ? `Size: ${item.size}` : item.category}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-white/20 bg-black">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                        className="p-2 text-white/60 hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-sans text-sm w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                        className="p-2 text-white/60 hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bebas text-xl text-white">₵ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#050505]">
            <div className="flex justify-between items-center mb-6">
              <span className="font-sans text-sm text-white/60 uppercase tracking-widest">Subtotal</span>
              <span className="font-bebas text-3xl text-wff-gold">₵ {cartTotal.toFixed(2)}</span>
            </div>
            <p className="font-sans text-xs text-white/40 mb-6 text-center">Shipping and taxes calculated at checkout.</p>
            <Link 
              href="/checkout" 
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-wff-red text-white text-center font-bebas text-2xl py-4 hover:bg-white hover:text-wff-red transition-colors"
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
