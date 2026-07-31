"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Middleware bounces people here with a reason attached. Reading it
  // from the URL directly avoids needing a Suspense boundary for
  // useSearchParams on this otherwise-static page.
  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("error");
    if (reason === "forbidden") {
      setError(
        "That account is signed in but is not a federation administrator. Contact a super admin to be added.",
      );
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Signing in is not the same as being an admin — the dashboard is
    // gated on admin_users, so check before sending them onward.
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!adminRow) {
      await supabase.auth.signOut();
      setError("This account does not have administrator access.");
      setLoading(false);
      return;
    }

    const next = new URLSearchParams(window.location.search).get("next") || "/admin";
    // refresh() so middleware picks up the new session cookie.
    router.replace(next);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#111] border-white/10 text-white">
        <CardHeader className="text-center space-y-2">
          <div className="w-12 h-12 bg-wff-red/10 rounded-full flex items-center justify-center mx-auto mb-2 text-wff-red">
            <ShieldAlert size={24} />
          </div>
          <CardTitle className="font-bebas text-4xl tracking-widest text-wff-gold">COMMAND CENTER</CardTitle>
          <CardDescription className="font-sans text-xs text-white/50">Authenticate to access federation tools</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">Secure Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@wffghana.com" 
                className="bg-black border-white/10 text-white focus:border-wff-gold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70">Passphrase</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-black border-white/10 text-white focus:border-wff-gold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-wff-red text-xs mt-2">{error}</p>}
            <Button 
              type="submit" 
              className="w-full bg-wff-red hover:bg-white hover:text-black font-bebas tracking-widest text-lg transition-colors"
              disabled={loading}
            >
              {loading ? "AUTHENTICATING..." : "INITIATE LINK"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
