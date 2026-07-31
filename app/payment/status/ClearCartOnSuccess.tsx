'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/CartContext';

/**
 * The cart is only emptied once payment is actually confirmed — if
 * checkout fails the customer returns to a cart that still has their
 * items in it.
 */
export default function ClearCartOnSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // Run once on mount; clearCart is stable enough for this purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
