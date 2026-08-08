"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  createSignedDownloadUrl,
  DESIGN_CATEGORIES,
  DESIGN_STATUSES,
  designStatusMeta,
  fetchMasterPlanDesigns,
  formatFileSize,
  isImageMime,
  MASTER_PLAN_BUCKET,
  type MasterPlanDesign,
} from "@/lib/masterPlan";
import { MasterPlanNav } from "@/components/admin/master-plan-nav";
import { MasterPlanEventPicker } from "@/components/admin/master-plan-event-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ImageDown,
  UploadCloud,
  Download,
  Trash2,
  Pencil,
  Loader2,
  FileImage,
  FileText,
  Film,
  AudioLines,
  Archive,
  File,
} from "lucide-react";

interface PlanEventOption {
  id: string;
  title: string;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "flyer",
  status: "draft",
  version: "",
};

export default function AdminDesignsPage() {
  const [eventId, setEventId] = useState("");
  const [designs, setDesigns] = useState<MasterPlanDesign[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [events, setEvents] = useState<PlanEventOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [file, setFile] = useState<File | null>(null);

  const reload = useCallback(async () => {
    setError(null);
    const [ds, evts] = await Promise.all([
      fetchMasterPlanDesigns(eventId || undefined),
      supabase.from("events").select("id, title").order("start_date", { ascending: true }),
    ]);
    setDesigns(ds);
    setEvents((evts.data as PlanEventOption[] | null) || []);

    const urls: Record<string, string> = {};
    await Promise.all(
      ds.map(async (d) => {
        const { data } = await supabase.storage
          .from(MASTER_PLAN_BUCKET)
          .createSignedUrl(d.file_path, 3600);
        if (data) urls[d.id] = data.signedUrl;
      }),
    );
    setSignedUrls(urls);
  }, [eventId]);

  useEffect(() => {
    const boot = async () => {
      setLoading(true);
      await reload();
      setLoading(false);
    };
    boot();
  }, [reload]);

  const openNew = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setFile(null);
    setDialogOpen(true);
  };

  const openEdit = (design: MasterPlanDesign) => {
    setEditId(design.id);
    setForm({
      title: design.title,
      description: design.description ?? "",
      category: design.category,
      status: design.status,
      version: design.version ?? "",
    });
    setFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editId) {
        const { error: updateError } = await supabase
          .from("master_plan_designs")
          .update({
            title: form.title.trim(),
            description: form.description || null,
            category: form.category,
            status: form.status,
            version: form.version.trim() || null,
          })
          .eq("id", editId);
        if (updateError) throw updateError;
      } else {
        if (!file) throw new Error("Choose a file to upload.");
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        const path = `designs/${eventId || "_all"}/${Date.now()}_${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from(MASTER_PLAN_BUCKET)
          .upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;

        const { error: insertError } = await supabase.from("master_plan_designs").insert([
          {
            event_id: eventId || null,
            title: form.title.trim(),
            description: form.description || null,
            file_path: path,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type || null,
            category: form.category,
            status: form.status,
            version: form.version.trim() || null,
            uploaded_by: (await supabase.auth.getUser()).data.user?.email ?? null,
          },
        ]);
        if (insertError) throw insertError;
      }
      setDialogOpen(false);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (design: MasterPlanDesign) => {
    if (!confirm(`Delete "${design.title}"? The file is removed for good.`)) return;
    await supabase.storage.from(MASTER_PLAN_BUCKET).remove([design.file_path]);
    await supabase.from("master_plan_designs").delete().eq("id", design.id);
    reload();
  };

  const handleDownload = async (design: MasterPlanDesign) => {
    const url = await createSignedDownloadUrl(design.file_path);
    if (!url) {
      setError("Could not build a download link.");
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = design.file_name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const filtered = designs.filter(
    (d) =>
      (!categoryFilter || d.category === categoryFilter) &&
      (!statusFilter || d.status === statusFilter),
  );

  const eventTitle = (id: string | null) => events.find((e) => e.id === id)?.title;

  const inputClass = "bg-black border-white/10";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-bebas text-4xl text-white">FLYERS & DESIGN</h2>
          <p className="text-white/50 text-sm font-sans mt-2">
            The graphic designer&apos;s private library — upload drafts and finals, download them
            when you need them.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <MasterPlanEventPicker value={eventId} onChange={setEventId} />
          <Button
            onClick={openNew}
            className="bg-wff-red hover:bg-white hover:text-black font-bebas tracking-widest"
          >
            <UploadCloud className="mr-2 h-4 w-4" /> UPLOAD DESIGN
          </Button>
        </div>
      </div>

      <MasterPlanNav />

      {error && (
        <div className="bg-wff-red/10 border border-wff-red/30 text-wff-red font-sans text-xs p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 outline-none focus:border-wff-gold cursor-pointer"
        >
          <option value="">ALL CATEGORIES</option>
          {DESIGN_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value} className="bg-[#111]">
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 outline-none focus:border-wff-gold cursor-pointer"
        >
          <option value="">ALL STATUSES</option>
          {DESIGN_STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="bg-[#111]">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/40">
          <Loader2 className="h-5 w-5 animate-spin mr-3" />
          <span className="font-sans text-xs uppercase tracking-widest">Loading library…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center text-white/30 font-sans text-sm border border-dashed border-white/10 rounded-xl">
          <ImageDown className="h-10 w-10 mx-auto mb-3 text-white/20" />
          Nothing here yet. Upload the first flyer, poster or brand asset.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((design) => {
            const status = designStatusMeta(design.status);
            const preview = signedUrls[design.id];
            return (
              <div
                key={design.id}
                className="bg-[#111] border border-white/10 rounded-xl overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-black/60 border-b border-white/5 overflow-hidden">
                  {preview && isImageMime(design.mime_type) ? (
                    <Image
                      src={preview}
                      alt={design.title}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/25">
                      <DesignIcon mime={design.mime_type} />
                      <span className="text-[10px] uppercase tracking-widest font-bold font-sans">
                        {design.file_name?.split(".").pop() || "file"}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  {design.version && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[9px] font-mono text-white/70">
                      v{design.version}
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bebas text-xl text-white tracking-wide truncate">
                        {design.title}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold font-sans capitalize">
                        {design.category.replace("-", " ")} ·{" "}
                        {eventTitle(design.event_id) || "All events"}
                      </div>
                    </div>
                  </div>

                  {design.description && (
                    <p className="text-xs text-white/40 font-sans mt-2 line-clamp-2">
                      {design.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-3 text-[10px] text-white/30 font-mono">
                    <span>{formatFileSize(design.file_size) || design.file_name?.split(".").pop()}</span>
                    <span>{design.created_at?.slice(0, 10)}</span>
                    {design.uploaded_by && <span className="truncate">{design.uploaded_by}</span>}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleDownload(design)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-wff-red hover:bg-white hover:text-black text-white py-2 rounded-lg font-bebas text-sm tracking-widest transition-all"
                    >
                      <Download className="h-4 w-4" /> DOWNLOAD
                    </button>
                    <button
                      onClick={() => openEdit(design)}
                      className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-wff-gold hover:border-wff-gold/40 transition-all"
                      title="Edit details"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(design)}
                      className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-wff-red hover:border-wff-red/40 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#111] text-white border-white/10 sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bebas text-3xl tracking-widest text-wff-gold">
              {editId ? "EDIT DESIGN" : "UPLOAD DESIGN"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 pt-4">
            {!editId && (
              <div className="col-span-2 space-y-2">
                <Label>
                  File <span className="text-wff-red ml-1">*</span>
                </Label>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/15 hover:border-wff-red/50 rounded-xl py-8 cursor-pointer transition-colors">
                  <UploadCloud className="h-8 w-8 text-white/30" />
                  <span className="text-xs text-white/50 font-sans">
                    {file ? file.name : "Click to choose a file (JPG, PNG, PDF, MP4…)"}
                  </span>
                  {file && (
                    <span className="text-[10px] text-white/30 font-mono">
                      {formatFileSize(file.size)}
                    </span>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            )}

            <div className="col-span-2 space-y-2">
              <Label>
                Title <span className="text-wff-red ml-1">*</span>
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className={inputClass}
                placeholder="e.g. Main event poster — African Championship"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full bg-black border border-white/10 rounded-md p-3 text-sm text-white outline-none focus:border-wff-gold transition-colors resize-none"
                placeholder="Print specs, where it will be used, notes for the team…"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-wff-gold cursor-pointer"
              >
                {DESIGN_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#111]">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-wff-gold cursor-pointer"
              >
                {DESIGN_STATUSES.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[#111]">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Version</Label>
              <Input
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                className={inputClass}
                placeholder="e.g. 2"
              />
            </div>

            {!editId && (
              <div className="space-y-2">
                <Label>Event</Label>
                <div className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white/70">
                  {eventTitle(eventId) || "All events"}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={saving}
              className="col-span-2 w-full bg-wff-gold text-black hover:bg-white font-bebas tracking-widest disabled:opacity-50"
            >
              {saving ? "UPLOADING…" : editId ? "SAVE CHANGES" : "UPLOAD TO LIBRARY"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DesignIcon({ mime }: { mime: string | null }) {
  const type = mime?.split("/")[0];
  const Icon =
    type === "image"
      ? FileImage
      : type === "video"
        ? Film
        : type === "audio"
          ? AudioLines
          : mime === "application/pdf"
            ? FileText
            : mime?.includes("zip") || mime?.includes("archive")
              ? Archive
              : File;
  return <Icon className="h-10 w-10" />;
}
