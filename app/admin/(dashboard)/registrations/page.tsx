"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, CheckCircle, XCircle, BadgeCent, RefreshCw } from "lucide-react";

const DOCUMENTS: { key: string; label: string }[] = [
  { key: "passport_url", label: "Passport Scan" },
  { key: "national_id_url", label: "National ID" },
  { key: "headshot_url", label: "Headshot" },
  { key: "full_body_url", label: "Full Body Photo" },
  { key: "certs_url", label: "Certificates" },
  { key: "audio_track_url", label: "Posing Track" },
  { key: "payment_screenshot_url", label: "Payment Receipt" },
];

const STATUS_FILTERS = ["all", "pending", "approved", "rejected"] as const;

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [busy, setBusy] = useState(false);

  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);

    // NB: registrations links to divisions only — category is a plain
    // text column on the row, there is no categories foreign key.
    let query = supabase
      .from("registrations")
      .select("*, divisions(name)")
      .order("created_at", { ascending: false });

    if (filter !== "all") query = query.eq("registration_status", filter);

    const { data, error: queryError } = await query;
    if (queryError) setError(queryError.message);
    setRegistrations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  /**
   * Identity documents live in a private bucket, so each one needs a
   * short-lived signed URL. Rows created before the bucket was locked
   * down stored absolute URLs — pass those straight through.
   */
  useEffect(() => {
    if (!selectedReg) {
      setSignedUrls({});
      return;
    }

    let cancelled = false;

    const sign = async () => {
      const entries = await Promise.all(
        DOCUMENTS.map(async ({ key }) => {
          const value = selectedReg[key];
          if (!value) return null;
          if (typeof value === "string" && value.startsWith("http")) {
            return [key, value] as const;
          }
          const { data } = await supabase.storage
            .from("athlete-documents")
            .createSignedUrl(value, 300); // 5 minutes
          return data?.signedUrl ? ([key, data.signedUrl] as const) : null;
        }),
      );

      if (!cancelled) {
        setSignedUrls(Object.fromEntries(entries.filter(Boolean) as [string, string][]));
      }
    };

    sign();
    return () => {
      cancelled = true;
    };
  }, [selectedReg]);

  const updateRegistration = async (id: string, patch: Record<string, unknown>) => {
    setBusy(true);
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ ...patch, reviewed_at: new Date().toISOString() })
      .eq("id", id);

    setBusy(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSelectedReg(null);
    fetchRegistrations();
  };

  const statusClass = (status: string) =>
    status === "approved"
      ? "bg-green-500/20 text-green-400"
      : status === "rejected"
        ? "bg-red-500/20 text-red-400"
        : "bg-wff-gold/20 text-wff-gold";

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4 flex flex-wrap gap-4 items-end justify-between">
        <div>
          <h2 className="font-bebas text-4xl text-white">ATHLETE REGISTRATIONS</h2>
          <p className="text-white/50 text-sm font-sans mt-2">
            Review inbound event applications, entry fees and submitted documents.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {STATUS_FILTERS.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`font-sans text-[10px] uppercase tracking-widest font-bold px-3 py-2 rounded transition-colors ${
                filter === option
                  ? "bg-wff-red text-white"
                  : "bg-white/5 text-white/40 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchRegistrations}
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

      <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-black/40">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Athlete Name</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Country</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Division/Category</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Fee</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="text-right text-white/40 uppercase font-bold text-[10px] tracking-widest">Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={6} className="text-center py-8 text-white/40 font-sans text-xs">Loading inbound records...</TableCell>
              </TableRow>
            ) : registrations.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={6} className="text-center py-8 text-white/40 font-sans text-xs">
                  No {filter === "all" ? "" : filter} registrations found.
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((reg) => (
                <TableRow key={reg.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="font-bold text-white capitalize">
                    {reg.first_name} {reg.last_name}
                  </TableCell>
                  <TableCell className="text-white/60">{reg.country_representing || reg.country}</TableCell>
                  <TableCell className="text-xs text-wff-gold">
                    {reg.divisions?.name || reg.division} • {reg.category}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                        reg.fee_paid_status === "paid"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {reg.fee_paid_status || "pending"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${statusClass(
                        reg.registration_status,
                      )}`}
                    >
                      {reg.registration_status || "pending"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedReg(reg)}
                      className="text-white/40 hover:text-white hover:bg-wff-red mr-2 transition-colors"
                      aria-label="View application"
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

      <Dialog open={!!selectedReg} onOpenChange={(open) => !open && setSelectedReg(null)}>
        <DialogContent className="bg-[#111] text-white border-white/10 sm:max-w-[680px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bebas text-3xl tracking-widest text-wff-gold border-b border-white/10 pb-4">
              APPLICATION DOSSIER
            </DialogTitle>
          </DialogHeader>

          {selectedReg && (
            <div className="space-y-6 pt-4 font-sans text-sm">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Athlete">
                  <span className="capitalize">
                    {selectedReg.first_name} {selectedReg.middle_name} {selectedReg.last_name}
                  </span>
                </Field>
                <Field label="Email">{selectedReg.email}</Field>
                <Field label="Mobile">{selectedReg.mobile}</Field>
                <Field label="Date of Birth">{selectedReg.dob}</Field>
                <Field label="Representing">{selectedReg.country_representing}</Field>
                <Field label="Athlete Type">{selectedReg.athlete_type}</Field>
                <Field label="Category / Division">
                  {selectedReg.category} • {selectedReg.divisions?.name || selectedReg.division}
                </Field>
                <Field label="Weight / Height Class">
                  {selectedReg.weight_class || "—"} / {selectedReg.height_class || "—"}
                </Field>
                <Field label="Club / Team">
                  {selectedReg.club_name || selectedReg.team_name || "Independent"}
                </Field>
                <Field label="Coach">{selectedReg.coach_name || "—"}</Field>
                <Field label="Emergency Contact">
                  {selectedReg.emergency_name} ({selectedReg.emergency_relation}) —{" "}
                  {selectedReg.emergency_phone}
                </Field>
                <Field label="Submitted">
                  {new Date(selectedReg.created_at).toLocaleDateString()}
                </Field>
              </div>

              <div className="bg-black/50 p-4 border border-white/5 rounded-lg space-y-3">
                <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold border-b border-white/5 pb-2">
                  Entry Fee
                </span>
                <div className="flex justify-between items-center text-xs">
                  <span>
                    Status:{" "}
                    <span
                      className={
                        selectedReg.fee_paid_status === "paid" ? "text-green-400" : "text-wff-gold"
                      }
                    >
                      {selectedReg.fee_paid_status || "pending"}
                    </span>
                    {selectedReg.fee_amount ? ` · ₵ ${Number(selectedReg.fee_amount).toFixed(2)}` : ""}
                  </span>
                  {selectedReg.paystack_ref && (
                    <span className="text-white/40">Ref: {selectedReg.paystack_ref}</span>
                  )}
                </div>
                {selectedReg.fee_paid_status !== "paid" && (
                  <Button
                    disabled={busy}
                    onClick={() =>
                      updateRegistration(selectedReg.id, {
                        fee_paid_status: "paid",
                        paid_at: new Date().toISOString(),
                      })
                    }
                    className="w-full bg-white/5 text-white/70 hover:bg-wff-gold hover:text-black font-bebas text-base"
                  >
                    <BadgeCent className="mr-2 h-4 w-4" /> MARK FEE AS PAID (OFFLINE TRANSFER)
                  </Button>
                )}
              </div>

              <div className="bg-black/50 p-4 border border-white/5 rounded-lg space-y-3">
                <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold border-b border-white/5 pb-2">
                  Documents
                </span>
                {DOCUMENTS.map(({ key, label }) => (
                  <div key={key} className="flex justify-between items-center text-xs">
                    <span>{label}</span>
                    {selectedReg[key] ? (
                      signedUrls[key] ? (
                        <a
                          href={signedUrls[key]}
                          target="_blank"
                          rel="noreferrer"
                          className="text-wff-gold hover:underline"
                        >
                          Open (expires in 5 min)
                        </a>
                      ) : (
                        <span className="text-white/30">Generating link…</span>
                      )
                    ) : (
                      <span className="text-white/30">Not provided</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  disabled={busy}
                  onClick={() =>
                    updateRegistration(selectedReg.id, { registration_status: "approved" })
                  }
                  className="flex-1 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-black font-bebas text-lg"
                >
                  <CheckCircle className="mr-2 h-5 w-5" /> APPROVE ENTRY
                </Button>
                <Button
                  disabled={busy}
                  onClick={() =>
                    updateRegistration(selectedReg.id, { registration_status: "rejected" })
                  }
                  className="flex-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bebas text-lg"
                >
                  <XCircle className="mr-2 h-5 w-5" /> DENY
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">
        {label}
      </span>
      <span className="text-white/80">{children}</span>
    </div>
  );
}
