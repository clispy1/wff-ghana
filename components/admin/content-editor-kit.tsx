"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ArrowUp, ArrowDown, Check } from "lucide-react";

/**
 * Shared building blocks for the "one JSONB row per section, save
 * independently" admin editors (Homepage Content, Event Schedule &
 * Logistics). Array-shaped content (schedule days, journey panels,
 * award cards) all reduce to the same add/remove/reorder pattern, so
 * it lives here once instead of being re-implemented per page.
 */

export const textareaClass =
  "w-full bg-black border border-white/10 rounded-md p-3 text-sm text-white outline-none focus:border-wff-gold transition-colors resize-none";
export const inputClass = "bg-black border-white/10";

export function SectionCard({
  title,
  hint,
  saving,
  saved,
  onSave,
  children,
}: {
  title: string;
  hint?: string;
  saving: boolean;
  saved: boolean;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-[#111] border-white/10 text-white">
      <CardHeader>
        <CardTitle className="font-bebas text-2xl tracking-widest text-wff-gold flex items-center justify-between">
          {title}
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-wff-red hover:bg-white hover:text-black font-bebas text-sm tracking-widest h-8 px-4"
          >
            {saving ? "SAVING…" : saved ? <Check className="h-4 w-4" /> : "SAVE"}
          </Button>
        </CardTitle>
        {hint && <p className="text-white/40 text-xs font-sans font-normal pt-1">{hint}</p>}
      </CardHeader>
      <CardContent className="space-y-4 font-sans">{children}</CardContent>
    </Card>
  );
}

export function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1.5">
      <Label className="text-white/50 text-xs">{label}</Label>
      <Input className={inputClass} {...props} />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-white/50 text-xs">{label}</Label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={textareaClass}
      />
    </div>
  );
}

export function updateItem<T>(items: T[], index: number, patch: Partial<T>): T[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function RowControls({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className="h-7 w-7 text-white/40 hover:text-white disabled:opacity-20"
        aria-label="Move up"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
        className="h-7 w-7 text-white/40 hover:text-white disabled:opacity-20"
        aria-label="Move down"
      >
        <ArrowDown className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-7 w-7 text-white/40 hover:text-wff-red"
        aria-label="Remove"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function StringListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-white/50 text-xs">{label}</Label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => onChange(items.map((v, idx) => (idx === i ? e.target.value : v)))}
            className={inputClass}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="text-white/40 hover:text-wff-red flex-shrink-0"
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="w-full bg-white/5 text-white/60 hover:bg-white/10 font-bebas tracking-widest text-sm h-8"
      >
        <Plus className="mr-2 h-3.5 w-3.5" /> ADD ITEM
      </Button>
    </div>
  );
}
