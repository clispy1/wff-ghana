import VendorsClient, { type Vendor } from './VendorsClient';
import { createServerSupabase } from '@/lib/supabase/server';

export const metadata = {
  title: 'Event Vendors | WFF Ghana 2026 All Africa Championship',
  description: 'The food, merchandise and services vendors at the 2026 WFF All Africa Championship in Accra, Ghana.',
};

export const dynamic = 'force-dynamic';

export default async function VendorsPage() {
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from('vendors')
    .select('id, name, category, contact_person, phone, email, website_url, package_name, display_order')
    .eq('status', 'approved')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });

  return <VendorsClient vendors={(data as Vendor[]) || []} />;
}
