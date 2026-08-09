import { Metadata } from 'next';
import ShopClient, { type ShopProduct } from './ShopClient';
import { createServerSupabase } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Official Merch Shop | WFF Ghana',
  description: 'Get your official Team Ghana and 2026 All Africa Championship apparel.',
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from('ecommerce_products')
    .select('id, name, price, image_url, category, description, tag')
    .order('created_at', { ascending: false });

  const products: ShopProduct[] = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    image: p.image_url ?? '',
    category: p.category ?? '',
    description: p.description ?? '',
    tag: p.tag,
  }));

  return <ShopClient products={products} />;
}
