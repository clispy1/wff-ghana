'use client';

import { useState } from 'react';
import { X, Lock, AlertCircle, Minus, Plus } from 'lucide-react';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description?: string | null;
}

/**
 * Buyer details for a ticket purchase, then straight to Paystack.
 * Tickets are not shipped, so they deliberately bypass the merch cart
 * and are written to ticket_orders instead.
 */
export default function TicketPurchaseModal({
  tier,
  onClose,
}: {
  tier: TicketTier;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = tier.price * quantity;

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_tier_id: tier.id,
          buyer_name: form.name,
          buyer_email: form.email,
          buyer_phone: form.phone,
          quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start checkout.');

      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start checkout.');
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-black border border-white/10 p-3 text-white text-sm focus:border-wff-gold outline-none transition-colors rounded-md';
  const labelClass =
    'block font-sans text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-bold';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 w-full max-w-md rounded-xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-white/40 hover:text-wff-red transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="font-bebas text-3xl text-wff-gold mb-1">{tier.name}</h3>
        <p className="font-sans text-xs text-white/50 mb-6 leading-relaxed">
          {tier.description || 'Championship admission'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input required type="text" value={form.name} onChange={set('name')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input required type="email" value={form.email} onChange={set('email')} className={inputClass} />
            <p className="font-sans text-[10px] text-white/30 mt-1.5">
              Your tickets are sent to this address.
            </p>
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input type="tel" value={form.phone} onChange={set('phone')} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Quantity</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-9 h-9 border border-white/10 rounded-md flex items-center justify-center text-white/60 hover:border-wff-gold hover:text-wff-gold transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="font-bebas text-2xl text-white w-8 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                aria-label="Increase quantity"
                className="w-9 h-9 border border-white/10 rounded-md flex items-center justify-center text-white/60 hover:border-wff-gold hover:text-wff-gold transition-colors"
              >
                <Plus size={14} />
              </button>
              <span className="font-sans text-[10px] text-white/30 ml-auto">Max 20 per order</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-6">
            <span className="font-sans text-xs uppercase tracking-widest text-white/40 font-bold">Total</span>
            <span className="font-bebas text-3xl text-wff-gold">₵ {total.toFixed(2)}</span>
          </div>

          {error && (
            <div className="flex gap-2 items-start bg-wff-red/10 border border-wff-red/30 p-3 rounded-md">
              <AlertCircle className="text-wff-red flex-shrink-0 mt-0.5" size={16} />
              <p className="font-sans text-xs text-wff-red">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-wff-red text-white font-bebas text-xl py-3.5 rounded-md hover:bg-white hover:text-wff-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
          >
            {isSubmitting ? 'Redirecting…' : 'Pay with Paystack'}
          </button>

          <p className="flex items-center justify-center gap-1.5 font-sans text-[10px] text-white/30 pt-1">
            <Lock size={11} /> Secured by Paystack — card, bank or mobile money
          </p>
        </form>
      </div>
    </div>
  );
}
