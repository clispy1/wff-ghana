"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, KeyRound, Webhook, Database } from "lucide-react";

export default function AdminSettingsPage() {
  const [account, setAccount] = useState<{ email?: string; role?: string; id?: string } | null>(
    null,
  );

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
  }, []);

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
          <EnvRow name="NEXT_PUBLIC_REGISTRATION_FEE" note="Athlete entry fee in GHS" />
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
