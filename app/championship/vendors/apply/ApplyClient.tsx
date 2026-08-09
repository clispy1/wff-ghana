"use client";

import { useState } from "react";
import { Store, Check, Loader2, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export interface VendorPackage {
  id: string;
  name: string;
  price: number;
  description: string | null;
  benefits: string;
}

const CATEGORIES = [
  { value: "catering", label: "Catering", desc: "Food, drinks and refreshments" },
  { value: "merchandise", label: "Merchandise", desc: "Official gear, apparel and memorabilia" },
  { value: "services", label: "Services", desc: "Logistics, media, health and support" },
  { value: "other", label: "Other", desc: "Everyone else helping make it happen" },
];

const inputCls =
  "w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 focus:border-wff-red/70 focus:outline-none focus:bg-white/8 transition-all duration-200";

export default function ApplyClient({ packages }: { packages: VendorPackage[] }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    contact_person: "",
    phone: "",
    email: "",
    website_url: "",
    application_note: "",
  });
  const [packageId, setPackageId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const selectedPkg = packages.find((p) => p.id === packageId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.category) {
      setError("Please fill in your business name, a category and a contact email.");
      return;
    }
    if (!packageId) {
      setError("Please select a sponsorship or booth package.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: inserted, error: insertError } = await supabase
        .from("vendors")
        .insert({
          name: form.name.trim(),
          category: form.category,
          contact_person: form.contact_person.trim() || null,
          phone: form.phone.trim() || null,
          email: form.email.trim(),
          website_url: form.website_url.trim() || null,
          application_note: form.application_note.trim() || null,
          package_id: packageId,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      const res = await fetch("/api/checkout/vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor_id: inserted.id }),
      });
      const payment = await res.json();

      if (!res.ok) {
        throw new Error(
          `${payment.error || "Could not start payment."} Your application was saved — contact us to pay the package fee.`,
        );
      }

      window.location.href = payment.authorization_url;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-5xl py-24">
      <Link
        href="/championship/vendors"
        className="inline-flex items-center gap-2 text-xs font-sans text-white/50 hover:text-wff-gold transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Event Vendors
      </Link>

      <div className="max-w-3xl text-center mx-auto mb-16">
        <p className="text-wff-red font-bebas text-xl tracking-[0.3em] uppercase mb-4">
          2026 All Africa Championship
        </p>
        <h1 className="font-bebas text-5xl md:text-6xl text-white tracking-wide">
          BECOME A <span className="text-wff-gold">VENDOR</span>
        </h1>
        <p className="font-sans text-sm text-white/50 max-w-xl mx-auto mt-6">
          Pick a sponsorship or booth package, tell us about your business and pay
          online. Once your application is approved you will appear in the event
          directory.
        </p>
      </div>

      {packages.length === 0 ? (
        <div className="max-w-xl mx-auto text-center border border-white/10 bg-[#111] rounded-xl p-12">
          <Store className="h-10 w-10 text-wff-gold mx-auto mb-6" />
          <h2 className="font-bebas text-3xl text-white mb-3">APPLICATIONS OPENING SOON</h2>
          <p className="font-sans text-sm text-white/50">
            Vendor packages are being finalised. Check back closer to the event, or
            email us to express interest.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-14">
          {/* Package selection */}
          <section>
            <h2 className="font-bebas text-3xl text-white tracking-widest mb-1">
              CHOOSE YOUR PACKAGE
            </h2>
            <p className="font-sans text-xs text-white/40 mb-6">
              Pay online with Paystack when you submit.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map((pkg) => {
                const selected = pkg.id === packageId;
                return (
                  <button
                    type="button"
                    key={pkg.id}
                    onClick={() => setPackageId(pkg.id)}
                    className={`text-left border rounded-xl p-6 transition-all duration-200 ${
                      selected
                        ? "border-wff-gold bg-wff-gold/5"
                        : "border-white/10 bg-[#111] hover:border-wff-gold/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-9 h-9 rounded-lg bg-wff-red/10 border border-wff-red/20 flex items-center justify-center shrink-0">
                        <Store className="h-4 w-4 text-wff-red" />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          selected ? "border-wff-gold bg-wff-gold" : "border-white/25"
                        }`}
                      >
                        {selected && <Check className="h-3.5 w-3.5 text-black" />}
                      </div>
                    </div>
                    <h3 className="font-bebas text-2xl text-white tracking-wide mt-4 leading-none">
                      {pkg.name}
                    </h3>
                    <p className="font-sans text-lg text-wff-gold font-bold mt-2">
                      ₵ {Number(pkg.price).toFixed(2)}
                    </p>
                    {pkg.description && (
                      <p className="font-sans text-xs text-white/50 mt-3 leading-relaxed">
                        {pkg.description}
                      </p>
                    )}
                    {pkg.benefits && (
                      <ul className="mt-4 space-y-1.5">
                        {pkg.benefits
                          .split("\n")
                          .map((b) => b.trim())
                          .filter(Boolean)
                          .map((b, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 font-sans text-xs text-white/60"
                            >
                              <Check className="h-3.5 w-3.5 text-wff-gold shrink-0 mt-0.5" />
                              {b}
                            </li>
                          ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Business details */}
          <section>
            <h2 className="font-bebas text-3xl text-white tracking-widest mb-6">
              YOUR BUSINESS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block font-sans text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  Business Name *
                </label>
                <input
                  className={inputCls}
                  placeholder="e.g. Accra Grills & Chill"
                  value={form.name}
                  onChange={set("name")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-sans text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  Category *
                </label>
                <select
                  className={`${inputCls} appearance-none cursor-pointer`}
                  value={form.category}
                  onChange={set("category")}
                >
                  <option value="" className="bg-[#111]">
                    Select a category…
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-[#111]">
                      {c.label} — {c.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-sans text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  Contact Person
                </label>
                <input
                  className={inputCls}
                  placeholder="Full name"
                  value={form.contact_person}
                  onChange={set("contact_person")}
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  Phone
                </label>
                <input
                  className={inputCls}
                  placeholder="+233 …"
                  value={form.phone}
                  onChange={set("phone")}
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  Email *
                </label>
                <input
                  className={inputCls}
                  type="email"
                  placeholder="you@business.com"
                  value={form.email}
                  onChange={set("email")}
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  Website / Social
                </label>
                <input
                  className={inputCls}
                  placeholder="https://…"
                  value={form.website_url}
                  onChange={set("website_url")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-sans text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  What will you offer?
                </label>
                <textarea
                  className={`${inputCls} min-h-[100px] resize-y`}
                  placeholder="A short note about your products or services…"
                  value={form.application_note}
                  onChange={set("application_note")}
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="border border-wff-red/40 bg-wff-red/5 px-5 py-4 font-sans text-sm text-wff-red">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-white/10 pt-8">
            <p className="font-sans text-xs text-white/40">
              {selectedPkg
                ? `Total: ₵ ${Number(selectedPkg.price).toFixed(2)} · paid securely via Paystack`
                : "Select a package to see your total."}
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-wff-red text-white font-bebas text-2xl px-10 py-3 hover:bg-white hover:text-wff-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> STARTING…
                </>
              ) : (
                <>
                  CONTINUE TO PAYMENT <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
