"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadPublicMedia } from "@/lib/uploadPublicMedia";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2, RefreshCw } from "lucide-react";

export type FieldType = "text" | "textarea" | "number" | "date" | "checkbox" | "select" | "image";

export interface ResourceField {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  /** Half-width in the two-column form grid. */
  half?: boolean;
}

export interface ResourceColumn {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

export interface ResourceManagerProps {
  table: string;
  title: string;
  description?: string;
  singular: string;
  columns: ResourceColumn[];
  fields: ResourceField[];
  orderBy?: { column: string; ascending?: boolean };
  /** Extra columns to select, e.g. a joined relation. */
  select?: string;
}

/**
 * Table + create/edit dialog over a single Supabase table.
 *
 * Writes go through the logged-in admin's session, so RLS (is_admin())
 * is the thing actually granting access — this component just drives the
 * UI. Every CMS section is a thin config on top of it.
 */
export default function ResourceManager({
  table,
  title,
  description,
  singular,
  columns,
  fields,
  orderBy = { column: "created_at", ascending: false },
  select = "*",
}: ResourceManagerProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const emptyForm = useCallback(
    () =>
      Object.fromEntries(
        fields.map((f) => [f.key, f.type === "checkbox" ? false : ""]),
      ) as Record<string, any>,
    [fields],
  );

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: queryError } = await supabase
      .from(table)
      .select(select)
      .order(orderBy.column, { ascending: orderBy.ascending ?? false });

    if (queryError) setError(queryError.message);
    setRows((data as any[]) || []);
    setLoading(false);
  }, [table, select, orderBy.column, orderBy.ascending]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Empty optional values become NULL rather than empty strings, and
    // numeric fields are coerced so Postgres doesn't reject "".
    const payload = Object.fromEntries(
      fields.map((field) => {
        const value = formData[field.key];
        if (field.type === "checkbox") return [field.key, !!value];
        if (field.type === "number") return [field.key, value === "" || value == null ? null : Number(value)];
        return [field.key, value === "" || value == null ? null : value];
      }),
    );

    const { error: writeError } = editId
      ? await supabase.from(table).update(payload).eq("id", editId)
      : await supabase.from(table).insert([payload]);

    setSaving(false);

    if (writeError) {
      setError(writeError.message);
      return;
    }

    setIsOpen(false);
    fetchRows();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${singular.toLowerCase()}? This cannot be undone.`)) return;

    const { error: deleteError } = await supabase.from(table).delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    fetchRows();
  };

  const openEdit = (row: any) => {
    setEditId(row.id);
    setFormData(
      Object.fromEntries(
        fields.map((f) => [f.key, row[f.key] ?? (f.type === "checkbox" ? false : "")]),
      ),
    );
    setIsOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setFormData(emptyForm());
    setIsOpen(true);
  };

  const uploadImage = async (field: string, file: File) => {
    setSaving(true);
    setError(null);

    try {
      const publicUrl = await uploadPublicMedia(table, file);
      setFormData((prev) => ({ ...prev, [field]: publicUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "bg-black border-white/10";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-bebas text-4xl text-white">{title}</h2>
          {description && (
            <p className="text-white/50 text-sm font-sans mt-2">{description}</p>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchRows}
            className="text-white/40 hover:text-white"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={openNew}
            className="bg-wff-red hover:bg-white hover:text-black font-bebas tracking-widest"
          >
            <Plus className="mr-2 h-4 w-4" /> NEW {singular.toUpperCase()}
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
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-white/40 uppercase font-bold text-[10px] tracking-widest"
                >
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="text-right text-white/40 uppercase font-bold text-[10px] tracking-widest">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-8 text-white/40 font-sans text-xs"
                >
                  Loading data...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-8 text-white/40 font-sans text-xs"
                >
                  Nothing here yet. Create your first {singular.toLowerCase()}.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-white/5 hover:bg-white/5 transition-colors group"
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-white/70">
                      {col.render ? col.render(row) : (row[col.key] ?? "—")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(row)}
                      className="text-white/40 hover:text-wff-gold hover:bg-transparent mr-2"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(row.id)}
                      className="text-white/40 hover:text-wff-red hover:bg-transparent"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#111] text-white border-white/10 sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bebas text-3xl tracking-widest text-wff-gold">
              {editId ? `EDIT ${singular.toUpperCase()}` : `CREATE NEW ${singular.toUpperCase()}`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 pt-4">
            {fields.map((field) => (
              <div
                key={field.key}
                className={`space-y-2 ${field.half ? "col-span-1" : "col-span-2"}`}
              >
                <Label>
                  {field.label}
                  {field.required && <span className="text-wff-red ml-1">*</span>}
                </Label>

                {field.type === "textarea" ? (
                  <textarea
                    value={formData[field.key] ?? ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    required={field.required}
                    rows={4}
                    placeholder={field.placeholder}
                    className="w-full bg-black border border-white/10 rounded-md p-3 text-sm text-white outline-none focus:border-wff-gold transition-colors resize-none"
                  />
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.key] ?? ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    required={field.required}
                    className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-wff-gold transition-colors"
                  >
                    <option value="">Select…</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                      className="w-4 h-4 accent-wff-red"
                    />
                    {field.placeholder || "Enabled"}
                  </label>
                ) : field.type === "image" ? (
                  <div className="space-y-3">
                    {formData[field.key] && (
                      <div className="relative w-24 h-24 rounded-md overflow-hidden border border-white/10">
                        <Image
                          src={formData[field.key]}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(field.key, file);
                      }}
                      className="block w-full text-xs text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white/10 file:text-white file:font-sans file:text-xs hover:file:bg-wff-red cursor-pointer"
                    />
                    <Input
                      value={formData[field.key] ?? ""}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder="…or paste an image URL"
                      className={inputClass}
                    />
                  </div>
                ) : (
                  <Input
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    step={field.type === "number" ? "0.01" : undefined}
                    value={formData[field.key] ?? ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    required={field.required}
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                )}

                {field.hint && (
                  <p className="text-[11px] text-white/30 font-sans">{field.hint}</p>
                )}
              </div>
            ))}

            <Button
              type="submit"
              disabled={saving}
              className="col-span-2 w-full bg-wff-gold text-black hover:bg-white font-bebas tracking-widest disabled:opacity-50"
            >
              {saving ? "SAVING…" : "SAVE CONFIGURATION"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
