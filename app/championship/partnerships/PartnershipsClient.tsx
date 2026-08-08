"use client";

import { useState } from "react";
import { Globe2, Users, BarChart3, Trophy } from "lucide-react";

const PARTNERSHIP_STATS = [
  { icon: <Globe2 size={32} />, value: "40+", label: "Participating Nations" },
  { icon: <Users size={32} />, value: "10,000+", label: "Expected Attendees" },
  { icon: <BarChart3 size={32} />, value: "5M+", label: "Digital Reach" },
  { icon: <Trophy size={32} />, value: "500+", label: "Elite Athletes" },
];

const TIERS = [
  {
    name: "Title Sponsor",
    price: "Custom Tier",
    color: "border-wff-gold text-wff-gold",
    bg: "bg-wff-gold/5",
    benefits: [
      "Naming rights to the 2026 Championship",
      "Prime logo placement on all main stages and media channels",
      "VIP Boardroom and direct stage access during the event",
      "Dedicated continuous digital marketing campaigns globally",
    ],
  },
  {
    name: "Gold Partner",
    price: "₵ 250,000",
    color: "border-white text-white",
    bg: "bg-white/5",
    benefits: [
      "Secondary logo placement on main dynamic stage banners",
      "10 VIP Premium Tickets for corporate executives",
      "Frequent social media campaign mentions (10x)",
      "Premium spacious exhibition booth space",
    ],
  },
  {
    name: "Silver Partner",
    price: "₵ 100,000",
    color: "border-white/50 text-white/80",
    bg: "bg-white/2",
    benefits: [
      "Logo printed on central physical sponsor wall",
      "5 VIP Tickets for executive team members",
      "Social media thank you mentions (5x)",
      "Shared exhibition hall space",
    ],
  },
];

function PartnershipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="w-16 h-16 rounded-full bg-wff-gold/10 text-wff-gold flex items-center justify-center mx-auto mb-4 border border-wff-gold/20 shadow-[0_0_15px_rgba(252,209,22,0.15)]">
          <Trophy size={32} />
        </div>
        <h4 className="font-bebas text-2xl text-white">DECK REQUESTED</h4>
        <p className="font-sans text-xs text-white/60 leading-relaxed">
          Thank you. Our partnership relations executive will reach out to your
          team by email within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="font-bebas text-sm text-wff-gold hover:underline uppercase tracking-wider block mx-auto pt-4"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
      <div>
        <label className="block text-white/50 uppercase tracking-widest font-bold mb-1.5">
          Representative Name
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Ama Mensah"
          className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-lg"
        />
      </div>
      <div>
        <label className="block text-white/50 uppercase tracking-widest font-bold mb-1.5">
          Company Name
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Zenith Brands"
          className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-lg"
        />
      </div>
      <div>
        <label className="block text-white/50 uppercase tracking-widest font-bold mb-1.5">
          Business Email
        </label>
        <input
          type="email"
          required
          placeholder="e.g. partner@zenith.com"
          className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-lg"
        />
      </div>
      <div>
        <label className="block text-white/50 uppercase tracking-widest font-bold mb-1.5">
          Tier Interest
        </label>
        <div className="relative">
          <select
            required
            className="w-full bg-black border border-white/10 p-3 text-white focus:border-wff-gold outline-none transition-colors rounded-lg appearance-none cursor-pointer"
          >
            <option>Title Sponsor Package</option>
            <option>Gold Partner Package</option>
            <option>Silver Partner Package</option>
            <option>Custom Activation</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-white/40">
            ▼
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-wff-gold text-black font-bebas text-lg py-3 rounded-lg hover:bg-white hover:text-black transition-colors duration-200 uppercase tracking-wider shadow-lg font-bold"
      >
        {loading ? "Processing..." : "SEND REQUEST"}
      </button>
    </form>
  );
}

export default function PartnershipsClient() {
  return (
    <div className="container mx-auto px-6 max-w-6xl py-24">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <p className="text-wff-gold font-bebas text-xl tracking-[0.3em] uppercase mb-4">
          2026 All Africa Championship
        </p>
        <h1 className="font-bebas text-5xl md:text-7xl text-white mb-6 tracking-wide">
          ALIGN WITH <span className="text-wff-red">EXCELLENCE</span>
        </h1>
        <p className="font-sans text-lg text-white/70 leading-relaxed max-w-3xl mx-auto">
          The 2026 All Africa Championship is a massive cultural phenomenon.
          Partnering with WFF Ghana positions your brand at the absolute
          forefront of health, discipline, and continental unity.
        </p>
      </div>

      {/* Partnership Reach Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {PARTNERSHIP_STATS.map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#111] border border-white/5 p-6 text-center flex flex-col items-center justify-center rounded-2xl transition-all hover:bg-black/80"
          >
            <div className="text-wff-red mb-3">{stat.icon}</div>
            <div className="font-bebas text-4xl text-white mb-1 leading-none">
              {stat.value}
            </div>
            <div className="font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tiers & Form split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bebas text-3xl mb-4 text-white">
            SPONSORSHIP PACKAGES
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`border ${tier.color} ${tier.bg} p-8 rounded-2xl flex flex-col relative overflow-hidden group hover:scale-[1.02] transition-transform`}
              >
                <h4 className="font-bebas text-2xl mb-1">{tier.name}</h4>
                <div className="font-sans font-bold text-lg mb-6">
                  {tier.price}
                </div>
                <ul className="space-y-3 flex-grow mb-6">
                  {tier.benefits.map((benefit, bIdx) => (
                    <li
                      key={bIdx}
                      className="font-sans text-xs text-white/75 flex items-start"
                    >
                      <span className="text-wff-gold mr-2 mt-0.5">▹</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 p-8 rounded-2xl">
          <h3 className="font-bebas text-3xl mb-2 text-wff-gold">
            REQUEST A DECK
          </h3>
          <p className="font-sans text-xs text-white/50 mb-6 font-bold uppercase tracking-wider">
            Align your brand with sports excellence. Fill the request below:
          </p>
          <PartnershipForm />
        </div>
      </div>
    </div>
  );
}
