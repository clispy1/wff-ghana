import { Metadata } from 'next';
import HomeClient, { type HomeClientProps } from './HomeClient';
import { createServerSupabase } from '@/lib/supabase/server';
import { fetchActiveEvent } from '@/lib/activeEvent';
import { fetchPublicHomeContent } from '@/lib/homeContent';
import { fetchGalleryMedia } from '@/lib/galleryMedia';

export const metadata: Metadata = {
  title: 'WFF Ghana | 2026 All Africa Championship',
  description:
    'World Fitness Federation (WFF) Ghana — host of the 2026 All Africa Bodybuilding Championship in Accra. Official news, athlete registration, tickets, vendors and merchandise.',
};

// The homepage is admin-driven CMS content — never cache it at build time,
// always read it fresh from the database on each request.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createServerSupabase();

  const [
    sponsorsRes,
    newsRes,
    productsRes,
    eventData,
    content,
    galleryPhotos,
    vendorsRes,
  ] = await Promise.all([
    supabase
      .from('sponsors')
      .select('name, tier, display_order')
      .order('display_order', { ascending: true }),
    supabase
      .from('news_articles')
      .select('id, publish_date, title, summary')
      .order('publish_date', { ascending: false })
      .limit(3),
    supabase
      .from('ecommerce_products')
      .select('id, name, price, image_url, category, description')
      .order('created_at', { ascending: false })
      .limit(4),
    fetchActiveEvent(supabase),
    fetchPublicHomeContent(supabase),
    fetchGalleryMedia(4, supabase),
    supabase
      .from('vendors')
      .select('id, name, category, display_order')
      .eq('status', 'approved')
      .order('display_order', { ascending: true }),
  ]);

  const props: HomeClientProps = {
    sponsors:
      sponsorsRes.data?.map((s) => ({ name: s.name, role: s.tier })) ?? [],
    news:
      newsRes.data?.map((n) => ({
        id: n.id,
        date: n.publish_date,
        title: n.title,
        summary: n.summary,
      })) ?? [],
    products:
      productsRes.data?.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        img: p.image_url,
        category: p.category,
        description: p.description,
      })) ?? [],
    eventData,
    content,
    galleryPhotos,
    vendors:
      vendorsRes.data?.map((v) => ({
        id: v.id,
        name: v.name,
        category: v.category,
      })) ?? [],
  };

  return <HomeClient {...props} />;
}
