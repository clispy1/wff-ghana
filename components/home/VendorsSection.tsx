'use client';

import Link from 'next/link';

export interface Vendor {
  id: string;
  name: string;
  category: string;
}

/** Event Vendors — approved vendors from the admin dashboard. Renders nothing when none are approved. */
export function VendorsSection({ vendors }: { vendors: Vendor[] }) {
  if (vendors.length === 0) return null;

  return (
    <section className="py-24 bg-[#070707] border-b border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal-target">
          <div>
            <p className="font-sans text-wff-gold font-bold uppercase tracking-[0.4em] text-xs mb-3">
              OFFICIAL EVENT SUPPLIERS
            </p>
            <h2 className="font-bebas text-5xl md:text-7xl text-white select-none">
              EVENT VENDORS
            </h2>
          </div>
          <Link
            href="/championship/vendors"
            className="hidden md:inline-flex border border-wff-gold text-wff-gold hover:bg-wff-gold hover:text-black font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 mb-2"
          >
            View All Vendors
          </Link>
          <Link
            href="/championship/vendors/apply"
            className="hidden md:inline-flex bg-wff-red text-white hover:bg-white hover:text-wff-red font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 mb-2"
          >
            Become a Vendor
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.slice(0, 8).map((vendor) => (
            <div
              key={vendor.id}
              className="reveal-target bg-[#111] border border-white/10 rounded-xl p-6 hover:border-wff-gold/40 transition-colors"
            >
              <h3 className="font-bebas text-2xl text-white tracking-wide leading-none truncate">
                {vendor.name}
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-wff-gold font-sans mt-1.5">
                {vendor.category}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden reveal-target">
          <Link
            href="/championship/vendors"
            className="inline-block border border-wff-gold text-wff-gold hover:bg-wff-gold hover:text-black font-sans text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 w-full"
          >
            View All Vendors
          </Link>
        </div>
      </div>
    </section>
  );
}
