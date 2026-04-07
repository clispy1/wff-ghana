import { Metadata } from 'next';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: 'Official Merch Shop | WFF Ghana',
  description: 'Get your official Team Ghana and 2026 World Championship apparel.',
};

export default function ShopPage() {
  return <ShopClient />;
}
