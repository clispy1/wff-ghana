import ApplyClient, { type VendorPackage } from './ApplyClient';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { fetchActiveEvent } from '@/lib/activeEvent';
import { isEventOver } from '@/lib/eventPhase';

export const metadata = {
  title: 'Become a Vendor | WFF Ghana 2026 All Africa Championship',
  description: 'Apply for a sponsorship or booth package at the 2026 WFF All Africa Championship in Accra, Ghana.',
};

export const dynamic = 'force-dynamic';

export default async function VendorApplyPage() {
  const supabase = await createServerSupabase();

  // Applications close with the event; a new active event reopens them.
  if (isEventOver(await fetchActiveEvent(supabase))) {
    return (
      <main className="min-h-screen bg-page pt-40 pb-24">
        <div className="container mx-auto px-6 max-w-xl text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-wff-red mb-4">Vendors</p>
          <h1 className="font-bebas text-6xl md:text-7xl leading-none mb-6">Vendor applications are closed</h1>
          <p className="font-sans text-fg/60 leading-relaxed mb-10">
            The championship has ended. Vendor applications for the next event will open here.
            To talk to us about it now, get in touch.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-wff-red text-white font-bebas text-xl tracking-wider px-8 py-3 rounded-lg hover:bg-white hover:text-wff-red transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </main>
    );
  }

  const { data } = await supabase
    .from('vendor_packages')
    .select('id, name, price, description, benefits')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const packages = (data as unknown as VendorPackage[]) || [];

  return <ApplyClient packages={packages} />;
}
