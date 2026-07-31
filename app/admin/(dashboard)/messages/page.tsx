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
import { Eye, Archive, RefreshCw, Trash2 } from "lucide-react";

const FILTERS = ["new", "read", "archived", "all"] as const;

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("new");
  const [selected, setSelected] = useState<any | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") query = query.eq("status", filter);

    const { data, error: queryError } = await query;
    if (queryError) setError(queryError.message);
    setMessages((data as any[]) || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const setStatus = async (id: string, status: string) => {
    const { error: updateError } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSelected(null);
    fetchMessages();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    const { error: deleteError } = await supabase.from("contact_messages").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setSelected(null);
    fetchMessages();
  };

  // Opening a message is what marks it read — no separate button needed.
  const open = (message: any) => {
    setSelected(message);
    if (message.status === "new") setStatus(message.id, "read");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-bebas text-4xl text-white">INBOX</h2>
          <p className="text-white/50 text-sm font-sans mt-2">
            Enquiries submitted through the public contact form.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {FILTERS.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`font-sans text-[10px] uppercase tracking-widest font-bold px-3 py-2 rounded transition-colors ${
                filter === option ? "bg-wff-red text-white" : "bg-white/5 text-white/40 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchMessages}
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
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">From</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Subject</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Received</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="text-right text-white/40 uppercase font-bold text-[10px] tracking-widest">Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-8 text-white/40 font-sans text-xs">
                  Loading messages...
                </TableCell>
              </TableRow>
            ) : messages.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-8 text-white/40 font-sans text-xs">
                  No {filter === "all" ? "" : filter} messages.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="text-white">
                    <span className="block font-bold">{message.name}</span>
                    <span className="text-[11px] text-white/40">{message.email}</span>
                  </TableCell>
                  <TableCell className="text-white/60 text-xs">{message.subject || "—"}</TableCell>
                  <TableCell className="text-white/40 text-xs">
                    {new Date(message.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                        message.status === "new"
                          ? "bg-wff-gold/20 text-wff-gold"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {message.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => open(message)}
                      className="text-white/40 hover:text-white hover:bg-wff-red"
                      aria-label="Open message"
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

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-[#111] text-white border-white/10 sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="font-bebas text-3xl tracking-widest text-wff-gold border-b border-white/10 pb-4">
              {selected?.subject || "MESSAGE"}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-5 pt-4 font-sans text-sm">
              <div className="text-xs text-white/50">
                From <span className="text-white font-bold">{selected.name}</span> ·{" "}
                <a href={`mailto:${selected.email}`} className="text-wff-gold hover:underline">
                  {selected.email}
                </a>
                {selected.phone && ` · ${selected.phone}`}
                <br />
                {new Date(selected.created_at).toLocaleString()}
              </div>

              <p className="text-white/80 leading-relaxed whitespace-pre-wrap bg-black/50 border border-white/5 rounded-lg p-4">
                {selected.message}
              </p>

              <div className="flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your enquiry")}`}
                  className="flex-1 text-center bg-wff-red text-white font-bebas text-lg py-2.5 rounded-md hover:bg-white hover:text-black transition-colors uppercase tracking-widest"
                >
                  Reply by Email
                </a>
                <Button
                  onClick={() => setStatus(selected.id, "archived")}
                  className="bg-white/5 text-white/60 hover:bg-white/10 font-bebas text-lg"
                >
                  <Archive className="mr-2 h-4 w-4" /> ARCHIVE
                </Button>
                <Button
                  onClick={() => remove(selected.id)}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bebas text-lg"
                  aria-label="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
