import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductClient, { type ProductDetail } from './ProductClient';
import { createServerSupabase } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Product Details | WFF Ghana Shop',
  description: 'Official WFF Ghana merchandise.',
};

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from('ecommerce_products')
    .select('id, name, price, image_url, category, description, tag')
    .eq('id', id)
    .maybeSingle();

  const product: ProductDetail | null = data
    ? {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        image: data.image_url ?? '',
        category: data.category ?? '',
        description: data.description ?? '',
        tag: data.tag,
      }
    : null;

  if (!product) notFound();

  return <ProductClient product={product} />;
}
