"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { parseRegistrationFee } from "@/lib/registrationFee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Wallet, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [account, setAccount] = useState<{ email?: string; role?: string; id?: string } | null>(
    null,
  );

  const [feeGhanaian, setFeeGhanaian] = useState("");
  const [feeForeign, setFeeForeign] = useState("");
  const [feeRate, setFeeRate] = useState("");
  const [feeLoading, setFeeLoading] = useState(true);
  const [feeSaving, setFeeSaving] = useState(false);
  const [feeSaved, setFeeSaved] = useState(false);
  const [feeError, setFeeError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      setAccount({ email: user.email, role: adminRow?.role, id: user.id });
    };
    load();

    const loadFee = async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "registration_fee")
        .maybeSingle();
      const fee = parseRegistrationFee(data?.value);
      setFeeGhanaian(String(fee.ghanaian_usd));
      setFeeForeign(String(fee.foreign_usd));
      setFeeRate(fee.usd_to_ghs ? String(fee.usd_to_ghs) : "");
      setFeeLoading(false);
    };
    loadFee();
  }, []);

  const saveFee = async () => {
    const ghanaian_usd = Number(feeGhanaian);
    const foreign_usd = Number(feeForeign);
    const usd_to_ghs = Number(feeRate);
    if (![ghanaian_usd, foreign_usd, usd_to_ghs].every((n) => Number.isFinite(n) && n > 0)) {
      setFeeError("Enter a positive number in all three fields.");
      return;
    }
    setFeeError(null);
    setFeeSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert(
        { key: "registration_fee", value: { ghanaian_usd, foreign_usd, usd_to_ghs } },
        { onConflict: "key" },
      );
    setFeeSaving(false);
    if (error) {
      setFeeError(error.message);
      return;
    }
    setFeeSaved(true);
    setTimeout(() => setFeeSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-bebas text-4xl text-white">SYSTEM SETTINGS</h2>
        <p className="text-white/50 text-sm font-sans mt-2">
          Registration fee and your admin account.
        </p>
      </div>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader className="flex flex-row items-center gap-3">
          <Wallet className="h-5 w-5 text-wff-gold" />
          <CardTitle className="font-bebas text-2xl tracking-widest">REGISTRATION FEE</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-sm space-y-4 text-white/70">
          <p className="text-white/40 text-xs">
            Priced in US dollars. The Ghanaian rate applies when an athlete&apos;s nationality or
            country representing is Ghana. Paystack charges the cedi equivalent at the exchange
            rate below. Takes effect immediately — no deploy needed.
          </p>
          {feeLoading ? (
            <p className="text-white/30 text-xs">Loading…</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
                <FeeInput label="Ghanaian (USD $)" value={feeGhanaian} onChange={setFeeGhanaian} />
                <FeeInput label="Foreign (USD $)" value={feeForeign} onChange={setFeeForeign} />
                <FeeInput label="Exchange rate (₵ per $1)" value={feeRate} onChange={setFeeRate} />
              </div>
              {Number(feeRate) > 0 ? (
                <p className="text-white/50 text-xs">
                  Paystack will charge Ghanaians ₵ {(Number(feeGhanaian) * Number(feeRate)).toFixed(2)} and
                  foreign athletes ₵ {(Number(feeForeign) * Number(feeRate)).toFixed(2)}.
                </p>
              ) : (
                <p className="text-wff-red text-xs">
                  Set the exchange rate — &quot;Pay now&quot; can&apos;t charge athletes until it is set.
                </p>
              )}
              {feeError && <p className="text-wff-red text-xs">{feeError}</p>}
              <Button
                onClick={saveFee}
                disabled={feeSaving}
                className="bg-wff-gold text-black hover:bg-white font-bebas text-base disabled:opacity-50"
              >
                {feeSaved ? (
                  <><Check className="mr-2 h-4 w-4" /> SAVED</>
                ) : feeSaving ? (
                  "SAVING…"
                ) : (
                  "SAVE FEE"
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader className="flex flex-row items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-wff-gold" />
          <CardTitle className="font-bebas text-2xl tracking-widest">YOUR ACCOUNT</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-sm space-y-2 text-white/70">
          <p>
            Signed in as <span className="text-white font-bold">{account?.email || "…"}</span>
          </p>
          <p>
            Role: <span className="text-wff-gold uppercase">{account?.role || "…"}</span>
          </p>
          <p className="text-[11px] text-white/30 pt-2">
            Admins are granted in the database only. To add another official, insert their
            auth user id into <code className="text-wff-gold">public.admin_users</code> from
            the Supabase SQL editor — there is deliberately no button for it here.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}

function FeeInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">{label}</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-wff-gold/70 focus:outline-none"
      />
    </div>
  );
}
