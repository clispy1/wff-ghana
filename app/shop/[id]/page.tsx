import { Metadata } from 'next';
import ProductClient from './ProductClient';

export const metadata: Metadata = {
  title: 'Product Details | WFF Ghana Shop',
  description: 'Official WFF Ghana merchandise.',
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ProductClient id={resolvedParams.id} />;
}
