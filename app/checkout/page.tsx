import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout | WFF Ghana Shop',
  description: 'Secure checkout for official WFF Ghana merchandise.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
