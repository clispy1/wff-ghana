import ApplyClient, { type VendorPackage } from './ApplyClient';
import { createServerSupabase } from '@/lib/supabase/server';

export const metadata = {
  title: 'Become a Vendor | WFF Ghana 2026 All Africa Championship',
  description: 'Apply for a sponsorship or booth package at the 2026 WFF All Africa Championship in Accra, Ghana.',
};

export const dynamic = 'force-dynamic';

export default async function VendorApplyPage() {
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from('vendor_packages')
    .select('id, name, price, description, benefits')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const packages = (data as unknown as VendorPackage[]) || [];

  return <ApplyClient packages={packages} />;
}
