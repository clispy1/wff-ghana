"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, KeyRound, Webhook, Database, Wallet, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [account, setAccount] = useState<{ email?: string; role?: string; id?: string } | null>(
    null,
  );

  const [feeGhs, setFeeGhs] = useState("");
  const [feeUsd, setFeeUsd] = useState("");
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
      const value = data?.value as { ghs?: number; usd?: number } | undefined;
      setFeeGhs(String(value?.ghs ?? 500));
      setFeeUsd(String(value?.usd ?? 45));
      setFeeLoading(false);
    };
    loadFee();
  }, []);

  const saveFee = async () => {
    const ghs = Number(feeGhs);
    const usd = Number(feeUsd);
    if (!Number.isFinite(ghs) || ghs < 0 || !Number.isFinite(usd) || usd < 0) {
      setFeeError("Enter valid non-negative amounts for both currencies.");
      return;
    }
    setFeeError(null);
    setFeeSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "registration_fee", value: { ghs, usd } }, { onConflict: "key" });
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
          Account details and the configuration this dashboard depends on.
        </p>
      </div>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader className="flex flex-row items-center gap-3">
          <Wallet className="h-5 w-5 text-wff-gold" />
          <CardTitle className="font-bebas text-2xl tracking-widest">REGISTRATION FEE</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-sm space-y-4 text-white/70">
          <p className="text-white/40 text-xs">
            Shown to athletes on the registration form&apos;s payment step. Takes effect immediately
            for new visits — no deploy needed.
          </p>
          {feeLoading ? (
            <p className="text-white/30 text-xs">Loading…</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                    Amount (GHS ₵)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeGhs}
                    onChange={(e) => setFeeGhs(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-wff-gold/70 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                    Amount (USD $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeUsd}
                    onChange={(e) => setFeeUsd(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-wff-gold/70 focus:outline-none"
                  />
                </div>
              </div>
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

      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader className="flex flex-row items-center gap-3">
          <KeyRound className="h-5 w-5 text-wff-red" />
          <CardTitle className="font-bebas text-2xl tracking-widest">REQUIRED ENVIRONMENT</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-xs space-y-3 text-white/60">
          <EnvRow name="NEXT_PUBLIC_SUPABASE_URL" note="Project URL" />
          <EnvRow name="NEXT_PUBLIC_SUPABASE_ANON_KEY" note="Public anon key" />
          <EnvRow name="SUPABASE_SERVICE_ROLE_KEY" note="Server-side writes — never expose" />
          <EnvRow name="PAYSTACK_SECRET_KEY" note="Payment initialise / verify / webhook signing" />
          <EnvRow name="NEXT_PUBLIC_SITE_URL" note="Used to build Paystack callback URLs" />
          <EnvRow name="NEXT_PUBLIC_REGISTRATION_FEE" note="Fallback only — set the live fee above instead" />
          <EnvRow name="NEXT_PUBLIC_SHOP_SHIPPING_FEE" note="Flat merch shipping in GHS" />
        </CardContent>
      </Card>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader className="flex flex-row items-center gap-3">
          <Webhook className="h-5 w-5 text-wff-gold" />
          <CardTitle className="font-bebas text-2xl tracking-widest">PAYSTACK WEBHOOK</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-xs space-y-2 text-white/60">
          <p>Register this URL in Paystack → Settings → API Keys &amp; Webhooks:</p>
          <code className="block bg-black border border-white/10 rounded p-3 text-wff-gold break-all">
            {typeof window !== "undefined" ? window.location.origin : ""}/api/paystack/webhook
          </code>
          <p className="text-white/30">
            Without it, payments completed after a customer closes the browser tab will not be
            recorded.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader className="flex flex-row items-center gap-3">
          <Database className="h-5 w-5 text-white/60" />
          <CardTitle className="font-bebas text-2xl tracking-widest">DATABASE</CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-xs space-y-2 text-white/60">
          <p>
            Schema and policies live in <code className="text-wff-gold">supabase_setup.sql</code>{" "}
            then <code className="text-wff-gold">supabase_backend.sql</code>, applied in that
            order through the Supabase SQL editor.
          </p>
          <p className="text-white/30">
            Public sign-ups should be disabled in Authentication → Providers → Email. Nothing on
            the public site creates accounts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function EnvRow({ name, note }: { name: string; note: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
      <code className="text-wff-gold break-all">{name}</code>
      <span className="text-white/40 text-right flex-shrink-0">{note}</span>
    </div>
  );
}
