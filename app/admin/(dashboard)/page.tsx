"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  ShoppingCart,
  UserCheck,
  Banknote,
  Mail,
  ClipboardList,
} from "lucide-react";

interface Stats {
  registrations_total: number;
  registrations_pending: number;
  registrations_approved: number;
  registrations_week: number;
  events_active: number;
  next_event: string | null;
  products_total: number;
  tickets_sold: number;
  shop_orders_paid: number;
  revenue_total: number;
  messages_unread: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Single admin-gated RPC rather than a dozen count queries.
      const { data, error: rpcError } = await supabase.rpc("admin_dashboard_stats");
      if (rpcError) setError(rpcError.message);
      else setStats(data as Stats);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const value = (n: number | undefined) => (loading ? "—" : String(n ?? 0));

  return (
    <div>
      <h2 className="font-bebas text-4xl mb-8">DASHBOARD OVERVIEW</h2>

      {error && (
        <div className="bg-wff-red/10 border border-wff-red/30 text-wff-red font-sans text-xs p-4 rounded-lg mb-8">
          Could not load stats: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Registered Athletes"
          icon={<Users className="h-4 w-4 text-wff-gold" />}
          value={value(stats?.registrations_total)}
          sub={`+${stats?.registrations_week ?? 0} in the last 7 days`}
          href="/admin/registrations"
        />
        <StatCard
          title="Pending Review"
          icon={<ClipboardList className="h-4 w-4 text-wff-red" />}
          value={value(stats?.registrations_pending)}
          sub={`${stats?.registrations_approved ?? 0} approved so far`}
          href="/admin/registrations"
        />
        <StatCard
          title="Active Events"
          icon={<Calendar className="h-4 w-4 text-wff-red" />}
          value={value(stats?.events_active)}
          sub={stats?.next_event || "No active event"}
          href="/admin/events"
        />
        <StatCard
          title="Shop Products"
          icon={<ShoppingCart className="h-4 w-4 text-wff-gold" />}
          value={value(stats?.products_total)}
          sub="Active inventory items"
          href="/admin/shop"
        />
        <StatCard
          title="Tickets Sold"
          icon={<UserCheck className="h-4 w-4 text-wff-red" />}
          value={value(stats?.tickets_sold)}
          sub="Paid ticket orders only"
          href="/admin/orders"
        />
        <StatCard
          title="Merch Orders Paid"
          icon={<ShoppingCart className="h-4 w-4 text-wff-gold" />}
          value={value(stats?.shop_orders_paid)}
          sub="Awaiting fulfilment"
          href="/admin/orders"
        />
        <StatCard
          title="Revenue Collected"
          icon={<Banknote className="h-4 w-4 text-green-500" />}
          value={loading ? "—" : `₵ ${Number(stats?.revenue_total ?? 0).toFixed(2)}`}
          sub="Verified Paystack payments"
          href="/admin/orders"
        />
        <StatCard
          title="Unread Messages"
          icon={<Mail className="h-4 w-4 text-wff-gold" />}
          value={value(stats?.messages_unread)}
          sub="From the contact form"
          href="/admin/messages"
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  icon,
  value,
  sub,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
  sub: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="bg-[#111] border-white/10 text-white hover:border-wff-red/50 transition-colors h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-white/60">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-bebas">{value}</div>
          <p className="text-xs text-white/40 mt-1 truncate">{sub}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
