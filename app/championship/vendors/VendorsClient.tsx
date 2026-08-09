"use client";

import { Store, Phone, Mail, Globe2, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  package_name: string | null;
  display_order: number;
}

const CATEGORY_META = [
  { key: "catering", label: "Catering", desc: "Food, drinks and refreshments." },
  { key: "merchandise", label: "Merchandise", desc: "Official gear, apparel and memorabilia." },
  { key: "services", label: "Services", desc: "Logistics, media, health and support." },
  { key: "other", label: "Other", desc: "Everyone else helping make it happen." },
];

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-wff-gold/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 shrink-0 rounded-lg bg-wff-red/10 border border-wff-red/20 flex items-center justify-center">
          <Store className="h-4 w-4 text-wff-red" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bebas text-2xl text-white tracking-wide leading-none">
            {vendor.name}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-wff-gold font-sans mt-1">
            {vendor.category}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 space-y-2 font-sans text-xs text-white/60">
        {vendor.package_name && (
          <p className="inline-block px-2 py-0.5 rounded border border-wff-gold/30 bg-wff-gold/5 text-wff-gold uppercase tracking-widest text-[10px] font-bold">
            {vendor.package_name}
          </p>
        )}
        {vendor.contact_person && (
          <p className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-white/30 shrink-0" />
            {vendor.contact_person}
          </p>
        )}
        {vendor.phone && (
          <a
            href={`tel:${vendor.phone.replace(/[^+\d]/g, "")}`}
            className="flex items-center gap-2 hover:text-wff-gold transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-white/30 shrink-0" />
            {vendor.phone}
          </a>
        )}
        {vendor.email && (
          <a
            href={`mailto:${vendor.email}`}
            className="flex items-center gap-2 hover:text-wff-gold transition-colors break-all"
          >
            <Mail className="h-3.5 w-3.5 text-white/30 shrink-0" />
            {vendor.email}
          </a>
        )}
        {vendor.website_url && (
          <a
            href={vendor.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-wff-gold transition-colors break-all"
          >
            <Globe2 className="h-3.5 w-3.5 text-white/30 shrink-0" />
            {vendor.website_url.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>
    </div>
  );
}

export default function VendorsClient({ vendors }: { vendors: Vendor[] }) {
  const vendorsByCategory = (key: string) =>
    vendors.filter((v) => v.category === key);
  const hasVendors = vendors.length > 0;

  return (
    <div className="container mx-auto px-6 max-w-6xl py-24">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <p className="text-wff-red font-bebas text-xl tracking-[0.3em] uppercase mb-4">
          2026 All Africa Championship
        </p>
        <h1 className="font-bebas text-5xl md:text-6xl text-white tracking-wide">
          EVENT <span className="text-wff-gold">VENDORS</span>
        </h1>
        <p className="font-sans text-sm text-white/50 max-w-xl mx-auto mt-6">
          The food, merch and services fuelling the championship weekend in
          Accra. More vendors will be added as we get closer to October 2–4, 2026.
        </p>

        <Link
          href="/championship/vendors/apply"
          className="inline-flex items-center gap-2 bg-wff-red text-white font-bebas text-xl px-8 py-3 mt-8 hover:bg-white hover:text-wff-red transition-colors"
        >
          BECOME A VENDOR <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {!hasVendors ? (
        <p className="text-center text-white/40 font-sans text-sm py-24 max-w-md mx-auto">
          The vendor lineup is coming soon. Check back closer to the event.
        </p>
      ) : (
        <div className="space-y-14">
          {CATEGORY_META.map((cat) => {
            const items = vendorsByCategory(cat.key);
            if (items.length === 0) return null;
            return (
              <section key={cat.key}>
                <div className="flex items-baseline gap-4 mb-6">
                  <h2 className="font-bebas text-3xl text-white tracking-widest">
                    {cat.label.toUpperCase()}
                  </h2>
                  <span className="text-[10px] font-sans text-white/40 uppercase tracking-widest">
                    {cat.desc}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
