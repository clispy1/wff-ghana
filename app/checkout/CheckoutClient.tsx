'use client';

import { useCart } from '@/lib/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function CheckoutClient() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for checkout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <main className="pt-32 pb-24 min-h-screen bg-wff-dark flex items-center justify-center">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <CheckCircle className="w-24 h-24 text-wff-gold mx-auto mb-8" />
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">ORDER <span className="text-wff-red">CONFIRMED</span></h1>
          <p className="font-sans text-white/60 text-lg mb-12">
            Thank you for your purchase. Your gear is being prepared for battle. We'll send a confirmation email with tracking details shortly.
          </p>
          <Link 
            href="/shop"
            className="inline-block border border-wff-gold text-wff-gold font-bebas text-2xl px-12 py-4 hover:bg-wff-gold hover:text-black transition-colors"
          >
            RETURN TO ARMORY
          </Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="pt-32 pb-24 min-h-screen bg-wff-dark flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-bebas text-6xl md:text-8xl mb-6">YOUR CART IS <span className="text-wff-red">EMPTY</span></h1>
          <Link 
            href="/shop"
            className="inline-block border border-wff-gold text-wff-gold font-bebas text-2xl px-12 py-4 hover:bg-wff-gold hover:text-black transition-colors"
          >
            RETURN TO ARMORY
          </Link>
        </div>
      </main>
    );
  }

  const tax = cartTotal * 0.15; // 15% tax
  const shipping = 50.00; // Flat shipping
  const finalTotal = cartTotal + tax + shipping;

  return (
    <main className="pt-32 pb-24 min-h-screen bg-wff-dark">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="font-bebas text-6xl md:text-8xl mb-12 border-b border-white/10 pb-6">SECURE <span className="text-wff-red">CHECKOUT</span></h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Contact Info */}
              <section>
                <h2 className="font-bebas text-3xl mb-6 text-wff-gold">1. CONTACT INFORMATION</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Email Address</label>
                    <input required type="email" className="w-full bg-[#111] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors rounded-md" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Phone Number</label>
                    <input required type="tel" className="w-full bg-[#111] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors rounded-md" />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="font-bebas text-3xl mb-6 text-wff-gold">2. SHIPPING ADDRESS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">First Name</label>
                    <input required type="text" className="w-full bg-[#111] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors rounded-md" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Last Name</label>
                    <input required type="text" className="w-full bg-[#111] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors rounded-md" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Street Address</label>
                    <input required type="text" className="w-full bg-[#111] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">City</label>
                    <input required type="text" className="w-full bg-[#111] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Region / State</label>
                    <input required type="text" className="w-full bg-[#111] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors" />
                  </div>
                </div>
              </section>

              {/* Payment Info */}
              <section>
                <h2 className="font-bebas text-3xl mb-6 text-wff-gold">3. PAYMENT DETAILS</h2>
                <div className="bg-[#111] border border-white/10 p-6 space-y-4 rounded-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-full h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white/50 font-sans text-sm rounded-md">Credit Card</div>
                    <div className="w-full h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white/50 font-sans text-sm rounded-md">Mobile Money</div>
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Card Number</label>
                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors rounded-md" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Expiry Date</label>
                      <input required type="text" placeholder="MM/YY" className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors rounded-md" />
                    </div>
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">CVC</label>
                      <input required type="text" placeholder="123" className="w-full bg-[#0A0A0A] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors rounded-md" />
                    </div>
                  </div>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-wff-red text-white font-bebas text-3xl py-6 rounded-md hover:bg-white hover:text-wff-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'PROCESSING...' : `PAY ₵ ${finalTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-[#111] border border-white/10 p-8 sticky top-32 rounded-xl">
              <h2 className="font-bebas text-3xl mb-8 border-b border-white/10 pb-4">ORDER SUMMARY</h2>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-black border border-white/10 flex-shrink-0 rounded-md overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -top-2 -right-2 bg-wff-red text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bebas text-lg text-white leading-tight mb-1">{item.name}</h3>
                      <p className="font-sans text-xs text-white/50 mb-2">{item.size ? `Size: ${item.size}` : item.category}</p>
                      <p className="font-sans font-bold text-wff-gold">₵ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between font-sans text-sm text-white/70">
                  <span>Subtotal</span>
                  <span>₵ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm text-white/70">
                  <span>Shipping</span>
                  <span>₵ {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm text-white/70">
                  <span>Estimated Tax (15%)</span>
                  <span>₵ {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bebas text-3xl text-white pt-4 border-t border-white/10">
                  <span>TOTAL</span>
                  <span className="text-wff-red">₵ {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
