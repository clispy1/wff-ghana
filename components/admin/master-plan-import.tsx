"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  IMPORT_EXAMPLE_JSON,
  IMPORT_EXAMPLE_TSV,
  parseTaskImport,
  priorityMeta,
  type MasterPlanColumn,
  type MasterPlanPhase,
  type MasterPlanTask,
  type ParsedImportTask,
  type ParseResult,
} from "@/lib/masterPlan";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ClipboardPaste,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  Flag,
  CalendarDays,
} from "lucide-react";

interface MasterPlanImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phases: MasterPlanPhase[];
  columns: MasterPlanColumn[];
  tasks: MasterPlanTask[];
  eventId: string;
  eventLabel: string;
  onImported: () => Promise<void>;
}

const EMPTY_RESULT: ParseResult = { format: "", tasks: [], errors: [], duplicates: [] };

export function MasterPlanImport({
  open,
  onOpenChange,
  phases,
  columns,
  tasks,
  eventId,
  eventLabel,
  onImported,
}: MasterPlanImportProps) {
  const [text, setText] = useState("");
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!open) return EMPTY_RESULT;
    return parseTaskImport(
      text,
      phases,
      columns,
      tasks.map((t) => t.title),
    );
  }, [text, phases, columns, tasks, open]);

  const formatLabel = useMemo(() => {
    switch (result.format) {
      case "json":
        return "JSON";
      case "tsv":
        return "TAB-SEPARATED (SHEETS)";
      case "csv":
        return "COMMA-SEPARATED (EXCEL)";
      default:
        return "";
    }
  }, [result.format]);

  const canImport = result.tasks.length > 0 && result.errors.length === 0;

  const handleImport = async () => {
    setImporting(true);
    setError(null);
    try {
      const maxByColumn: Record<string, number> = {};
      for (const t of tasks) {
        if (!t.column_id) continue;
        maxByColumn[t.column_id] = Math.max(maxByColumn[t.column_id] ?? -1, t.sort_order);
      }
      const nextByColumn: Record<string, number> = {};
      const rows = result.tasks.map((t) => {
        const col = t.column_id ?? "";
        const order = nextByColumn[col] ?? (maxByColumn[col] ?? -1) + 1;
        nextByColumn[col] = order + 1;
        return {
          event_id: eventId || null,
          phase_id: t.phase_id,
          column_id: t.column_id,
          title: t.title,
          description: t.description,
          assignee: t.assignee,
          priority: t.priority,
          due_date: t.due_date,
          sort_order: order,
        };
      });

      const { error: insertError } = await supabase
        .from("master_plan_tasks")
        .insert(rows);
      if (insertError) throw insertError;

      setText("");
      onOpenChange(false);
      await onImported();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111] text-white border-white/10 sm:max-w-[680px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bebas text-3xl tracking-widest text-wff-gold">
            BULK IMPORT TASKS
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-white/40 font-sans -mt-2">
          Paste a JSON list or a table copied from Excel/Sheets. Phase &amp; status names
          resolve against your board automatically.
        </p>

        <div className="mt-3 text-[11px] text-white/50 font-sans flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
          <ClipboardPaste className="h-3.5 w-3.5 text-wff-gold" />
          Importing under:{" "}
          <span className="font-bold text-wff-gold uppercase tracking-widest">
            {eventLabel || "ALL EVENTS"}
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'[\n  "Book venue security contract",\n  "Hire sound engineer"\n]'}
          className="w-full h-44 bg-black border border-white/10 rounded-lg p-3 text-sm font-mono text-white outline-none focus:border-wff-gold transition-colors resize-none placeholder:text-white/20"
        />

        <div className="flex flex-wrap gap-2 items-center">
          <Button
            onClick={() => setText(IMPORT_EXAMPLE_JSON)}
            variant="outline"
            size="sm"
            className="border-white/10 text-white/60 hover:text-wff-gold hover:border-wff-gold/40"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> JSON example
          </Button>
          <Button
            onClick={() => setText(IMPORT_EXAMPLE_TSV)}
            variant="outline"
            size="sm"
            className="border-white/10 text-white/60 hover:text-wff-gold hover:border-wff-gold/40"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Sheets example
          </Button>
          <Button
            onClick={() => setText("")}
            variant="ghost"
            size="sm"
            className="text-white/40 hover:text-white"
          >
            <X className="h-3.5 w-3.5 mr-1.5" /> Clear
          </Button>
          <div className="ml-auto flex items-center gap-3 text-[11px] font-sans">
            {formatLabel && (
              <span className="px-2 py-0.5 rounded border border-white/10 text-white/40 font-mono tracking-widest">
                {formatLabel}
              </span>
            )}
            <span className={result.errors.length ? "text-red-400 font-bold" : "text-white/40"}>
              {result.tasks.length} ready
            </span>
            <span className={result.errors.length ? "text-red-400 font-bold" : "text-white/40"}>
              {result.errors.length} errors
            </span>
            {result.duplicates.length > 0 && (
              <span className="text-wff-gold">{result.duplicates.length} skipped</span>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-wff-red/10 border border-wff-red/30 text-wff-red font-sans text-xs p-3 rounded-lg">
            {error}
          </div>
        )}

        {result.errors.length > 0 && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-red-400 font-sans flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Fix these before importing
            </div>
            {result.errors.slice(0, 8).map((err, idx) => (
              <div key={idx} className="text-xs text-red-300 font-sans font-mono">
                {err}
              </div>
            ))}
            {result.errors.length > 8 && (
              <div className="text-[11px] text-red-400/70 font-sans">
                …and {result.errors.length - 8} more.
              </div>
            )}
          </div>
        )}

        {result.duplicates.length > 0 && (
          <div className="bg-wff-gold/5 border border-wff-gold/20 rounded-lg p-3 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-wff-gold font-sans">
              Already on the board — skipped
            </div>
            <div className="text-xs text-wff-gold/80 font-sans">
              {result.duplicates.slice(0, 6).join(" · ")}
              {result.duplicates.length > 6 ? ` · +${result.duplicates.length - 6} more` : ""}
            </div>
          </div>
        )}

        {result.tasks.length > 0 && (
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-black/40 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 font-sans">
              Preview — {result.tasks.length} task{result.tasks.length === 1 ? "" : "s"}
            </div>
            <div className="max-h-44 overflow-y-auto divide-y divide-white/5">
              {result.tasks.map((t, idx) => (
                <ImportPreviewRow key={idx} task={t} />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            onClick={handleImport}
            disabled={!canImport || importing}
            className="flex-1 bg-wff-red hover:bg-white hover:text-black font-bebas tracking-widest disabled:opacity-40"
          >
            {importing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> IMPORTING…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" /> IMPORT {result.tasks.length || ""} TASK
                {result.tasks.length === 1 ? "" : "S"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ImportPreviewRow({ task }: { task: ParsedImportTask }) {
  const prio = priorityMeta(task.priority);
  return (
    <div className="px-3 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors">
      <span className="flex-1 min-w-0 truncate text-sm font-bold text-white">{task.title}</span>
      {task.phase_label && (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest text-white/60 border border-white/10 whitespace-nowrap">
          {task.phase_label}
        </span>
      )}
      {task.column_label && (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest text-white/60 border border-white/10 whitespace-nowrap">
          {task.column_label}
        </span>
      )}
      <span
        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border whitespace-nowrap ${prio.color}`}
      >
        {prio.label}
      </span>
      {task.assignee && (
        <span className="flex items-center gap-1 text-[10px] text-white/40 font-sans whitespace-nowrap">
          <Flag className="h-3 w-3" /> {task.assignee}
        </span>
      )}
      {task.due_date && (
        <span className="flex items-center gap-1 text-[10px] font-mono text-white/40 whitespace-nowrap">
          <CalendarDays className="h-3 w-3" /> {task.due_date}
        </span>
      )}
    </div>
  );
}
