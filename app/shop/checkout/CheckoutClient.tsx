'use client';

import { useCart } from '@/lib/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

const SHIPPING_FEE = Number(process.env.NEXT_PUBLIC_SHOP_SHIPPING_FEE || 0);

export default function CheckoutClient() {
  const { cart, cartTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const finalTotal = cartTotal + SHIPPING_FEE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_name: `${form.firstName} ${form.lastName}`.trim(),
          buyer_email: form.email,
          buyer_phone: form.phone,
          shipping_address: form.address,
          shipping_city: form.city,
          shipping_country: form.region,
          // Only ids and quantities — the server prices the order.
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            size: item.size ?? null,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed. Please try again.');
      }

      // Hand off to Paystack. The cart is cleared only after the
      // payment is confirmed, on /payment/status.
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
      setIsSubmitting(false);
    }
  };

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

  const inputClass =
    'w-full bg-[#111] border border-white/10 p-4 text-white focus:border-wff-red outline-none transition-colors rounded-md';
  const labelClass =
    'block font-sans text-xs uppercase tracking-widest text-white/50 mb-2';

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
                    <label className={labelClass}>Email Address</label>
                    <input required type="email" value={form.email} onChange={set('email')} className={inputClass} />
                    <p className="font-sans text-[11px] text-white/30 mt-2">
                      Your receipt and tracking details go here.
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input required type="tel" value={form.phone} onChange={set('phone')} className={inputClass} />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="font-bebas text-3xl mb-6 text-wff-gold">2. SHIPPING ADDRESS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input required type="text" value={form.firstName} onChange={set('firstName')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input required type="text" value={form.lastName} onChange={set('lastName')} className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Street Address</label>
                    <input required type="text" value={form.address} onChange={set('address')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input required type="text" value={form.city} onChange={set('city')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Region / Country</label>
                    <input required type="text" value={form.region} onChange={set('region')} className={inputClass} />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="font-bebas text-3xl mb-6 text-wff-gold">3. PAYMENT</h2>
                <div className="bg-[#111] border border-white/10 p-6 rounded-xl flex gap-4 items-start">
                  <Lock className="text-wff-gold flex-shrink-0 mt-1" size={20} />
                  <div className="font-sans text-sm text-white/60 leading-relaxed">
                    You will be redirected to <span className="text-white font-bold">Paystack</span> to
                    complete payment by card, bank transfer or mobile money. Your card details are
                    entered on Paystack&apos;s secure page and never touch our servers.
                  </div>
                </div>
              </section>

              {error && (
                <div className="flex gap-3 items-start bg-wff-red/10 border border-wff-red/30 p-4 rounded-md">
                  <AlertCircle className="text-wff-red flex-shrink-0 mt-0.5" size={18} />
                  <p className="font-sans text-sm text-wff-red">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-wff-red text-white font-bebas text-3xl py-6 rounded-md hover:bg-white hover:text-wff-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'REDIRECTING TO PAYSTACK...' : `PAY ₵ ${finalTotal.toFixed(2)}`}
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
                  <span>{SHIPPING_FEE > 0 ? `₵ ${SHIPPING_FEE.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="flex justify-between font-bebas text-3xl text-white pt-4 border-t border-white/10">
                  <span>TOTAL</span>
                  <span className="text-wff-red">₵ {finalTotal.toFixed(2)}</span>
                </div>
                <p className="font-sans text-[11px] text-white/30 pt-2">
                  Final amount is confirmed by our server before payment is taken.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
