"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, PackageCheck, RefreshCw } from "lucide-react";

type Tab = "shop" | "tickets";

export default function AdminOrdersPage() {
  const [tab, setTab] = useState<Tab>("shop");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    const query =
      tab === "shop"
        ? supabase
            .from("shop_orders")
            .select("*, shop_order_items(*)")
            .order("created_at", { ascending: false })
        : supabase
            .from("ticket_orders")
            .select("*, ticket_tiers(name)")
            .order("created_at", { ascending: false });

    const { data, error: queryError } = await query;
    if (queryError) setError(queryError.message);
    setRows((data as any[]) || []);
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const markFulfilled = async (id: string) => {
    const { error: updateError } = await supabase
      .from("shop_orders")
      .update({ fulfillment_status: "fulfilled" })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSelected(null);
    fetchOrders();
  };

  const paymentBadge = (status: string) =>
    status === "paid"
      ? "bg-green-500/20 text-green-400"
      : status === "failed"
        ? "bg-red-500/20 text-red-400"
        : "bg-wff-gold/20 text-wff-gold";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-bebas text-4xl text-white">ORDERS</h2>
          <p className="text-white/50 text-sm font-sans mt-2">
            Merchandise and ticket sales. Payment status is set by verified Paystack
            transactions — it cannot be edited by hand.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {(["shop", "tickets"] as Tab[]).map((option) => (
            <button
              key={option}
              onClick={() => setTab(option)}
              className={`font-sans text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded transition-colors ${
                tab === option ? "bg-wff-red text-white" : "bg-white/5 text-white/40 hover:text-white"
              }`}
            >
              {option === "shop" ? "Merchandise" : "Tickets"}
            </button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchOrders}
            className="text-white/40 hover:text-white"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-wff-red/10 border border-wff-red/30 text-wff-red font-sans text-xs p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-[#111] border border-white/10 rounded-lg overflow-x-auto">
        <Table>
          <TableHeader className="bg-black/40">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Reference</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Buyer</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">
                {tab === "shop" ? "Items" : "Tier"}
              </TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Total</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Payment</TableHead>
              {tab === "shop" && (
                <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Fulfilment</TableHead>
              )}
              <TableHead className="text-right text-white/40 uppercase font-bold text-[10px] tracking-widest">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={7} className="text-center py-8 text-white/40 font-sans text-xs">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={7} className="text-center py-8 text-white/40 font-sans text-xs">
                  No orders yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((order) => (
                <TableRow key={order.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-mono text-[11px] text-white/50">{order.reference || "—"}</TableCell>
                  <TableCell className="text-white">
                    <span className="block font-bold">{order.buyer_name}</span>
                    <span className="text-[11px] text-white/40">{order.buyer_email}</span>
                  </TableCell>
                  <TableCell className="text-white/60 text-xs">
                    {tab === "shop"
                      ? `${order.shop_order_items?.length || 0} item(s)`
                      : `${order.ticket_tiers?.name || "—"} × ${order.quantity}`}
                  </TableCell>
                  <TableCell className="text-wff-gold font-bold">
                    ₵ {Number(order.total ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${paymentBadge(
                        order.payment_status,
                      )}`}
                    >
                      {order.payment_status}
                    </span>
                  </TableCell>
                  {tab === "shop" && (
                    <TableCell className="text-white/60 text-xs capitalize">
                      {order.fulfillment_status}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelected(order)}
                      className="text-white/40 hover:text-white hover:bg-wff-red"
                      aria-label="View order"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="bg-[#111] text-white border-white/10 sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bebas text-3xl tracking-widest text-wff-gold border-b border-white/10 pb-4">
              ORDER DETAIL
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-5 pt-4 font-sans text-sm">
              <div className="grid grid-cols-2 gap-4">
                <Detail label="Reference">{selected.reference || "—"}</Detail>
                <Detail label="Placed">
                  {new Date(selected.created_at).toLocaleString()}
                </Detail>
                <Detail label="Buyer">{selected.buyer_name}</Detail>
                <Detail label="Email">{selected.buyer_email}</Detail>
                <Detail label="Phone">{selected.buyer_phone || "—"}</Detail>
                <Detail label="Payment">
                  <span className="capitalize">{selected.payment_status}</span>
                  {selected.paid_at && ` · ${new Date(selected.paid_at).toLocaleDateString()}`}
                </Detail>
              </div>

              {tab === "shop" && (
                <>
                  <div className="bg-black/50 p-4 border border-white/5 rounded-lg space-y-2">
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold border-b border-white/5 pb-2">
                      Shipping
                    </span>
                    <p className="text-xs text-white/70">
                      {selected.shipping_address || "—"}
                      {selected.shipping_city ? `, ${selected.shipping_city}` : ""}
                      {selected.shipping_country ? `, ${selected.shipping_country}` : ""}
                    </p>
                  </div>

                  <div className="bg-black/50 p-4 border border-white/5 rounded-lg space-y-2">
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold border-b border-white/5 pb-2">
                      Items
                    </span>
                    {selected.shop_order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span>
                          {item.product_name}
                          {item.size ? ` (${item.size})` : ""} × {item.quantity}
                        </span>
                        <span className="text-wff-gold">₵ {Number(item.line_total).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs pt-2 border-t border-white/5 text-white/50">
                      <span>Shipping</span>
                      <span>₵ {Number(selected.shipping_fee ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bebas text-xl pt-2">
                      <span>TOTAL</span>
                      <span className="text-wff-gold">₵ {Number(selected.total).toFixed(2)}</span>
                    </div>
                  </div>

                  {selected.payment_status === "paid" &&
                    selected.fulfillment_status !== "fulfilled" && (
                      <Button
                        onClick={() => markFulfilled(selected.id)}
                        className="w-full bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-black font-bebas text-lg"
                      >
                        <PackageCheck className="mr-2 h-5 w-5" /> MARK AS SHIPPED
                      </Button>
                    )}
                </>
              )}

              {tab === "tickets" && (
                <div className="bg-black/50 p-4 border border-white/5 rounded-lg space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>
                      {selected.ticket_tiers?.name || "Ticket"} × {selected.quantity}
                    </span>
                    <span className="text-wff-gold">₵ {Number(selected.total ?? 0).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">
        {label}
      </span>
      <span className="text-white/80 break-words">{children}</span>
    </div>
  );
}
