"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  fetchMasterPlanColumns,
  fetchMasterPlanPhases,
  fetchMasterPlanTasks,
  priorityMeta,
  type MasterPlanColumn,
  type MasterPlanPhase,
  type MasterPlanTask,
} from "@/lib/masterPlan";
import { formatEventDateShort } from "@/lib/activeEvent";
import { MasterPlanNav } from "@/components/admin/master-plan-nav";
import { MasterPlanEventPicker } from "@/components/admin/master-plan-event-picker";
import { Button } from "@/components/ui/button";
import {
  UsersRound,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  Circle,
  CalendarDays,
  Inbox,
} from "lucide-react";

export default function AdminTaskAssignmentsPage() {
  const [eventId, setEventId] = useState("");
  const [tasks, setTasks] = useState<MasterPlanTask[]>([]);
  const [columns, setColumns] = useState<MasterPlanColumn[]>([]);
  const [phases, setPhases] = useState<MasterPlanPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hideDone, setHideDone] = useState(false);

  const reload = useCallback(async () => {
    setError(null);
    const [ts, cols, phs] = await Promise.all([
      fetchMasterPlanTasks(eventId || undefined),
      fetchMasterPlanColumns(),
      fetchMasterPlanPhases(),
    ]);
    setTasks(ts);
    setColumns(cols);
    setPhases(phs);
  }, [eventId]);

  useEffect(() => {
    const boot = async () => {
      setLoading(true);
      await reload();
      setLoading(false);
    };
    boot();
  }, [reload]);

  const visible = useMemo(
    () => (hideDone ? tasks.filter((t) => !t.completed_at) : tasks),
    [tasks, hideDone],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, MasterPlanTask[]>();
    for (const task of visible) {
      const key = task.assignee?.trim() || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(task);
    }
    const buckets = [...map.entries()].sort((a, b) => {
      if (a[0] === "") return 1;
      if (b[0] === "") return -1;
      return a[0].localeCompare(b[0]);
    });
    return buckets.map(([assignee, list]) => ({
      assignee,
      total: list.length,
      done: list.filter((t) => t.completed_at).length,
      list: list.sort((a, b) => String(a.due_date ?? "9999").localeCompare(String(b.due_date ?? "9999"))),
    }));
  }, [visible]);

  const people = grouped.filter((g) => g.assignee).length;

  const columnMeta = (id: string | null) => columns.find((c) => c.id === id);
  const phaseMeta = (id: string | null) => phases.find((p) => p.id === id);

  const handleDelete = async (task: MasterPlanTask) => {
    if (!confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase
      .from("master_plan_tasks")
      .delete()
      .eq("id", task.id);
    if (deleteError) setError(deleteError.message);
    reload();
  };

  const toggleDone = async (task: MasterPlanTask) => {
    const doneCol = columns.find((c) => c.is_done_column);
    if (task.completed_at) {
      const openCol =
        columns.filter((c) => !c.is_done_column).sort((a, b) => a.sort_order - b.sort_order)[0]
          ?.id ?? null;
      await supabase
        .from("master_plan_tasks")
        .update({ column_id: task.column_id === doneCol?.id ? openCol : task.column_id, completed_at: null })
        .eq("id", task.id);
    } else {
      await supabase
        .from("master_plan_tasks")
        .update({ column_id: doneCol?.id ?? task.column_id, completed_at: new Date().toISOString() })
        .eq("id", task.id);
    }
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-bebas text-4xl text-white">TASK ASSIGNMENTS</h2>
          <p className="text-white/50 text-sm font-sans mt-2">
            Who&apos;s doing what — workload grouped by team member.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <MasterPlanEventPicker value={eventId} onChange={setEventId} />
          <Button
            onClick={() => setHideDone((v) => !v)}
            variant="outline"
            className="border-white/10 text-white/70 hover:text-white hover:border-white/25"
          >
            {hideDone ? "Show completed" : "Hide completed"}
          </Button>
        </div>
      </div>

      <MasterPlanNav />

      {error && (
        <div className="bg-wff-red/10 border border-wff-red/30 text-wff-red font-sans text-xs p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-lg px-4 py-3">
          <UsersRound className="h-5 w-5 text-wff-gold" />
          <div>
            <div className="font-bebas text-2xl text-white leading-none">{people}</div>
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold font-sans">
              Team Members
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-lg px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <div>
            <div className="font-bebas text-2xl text-white leading-none">
              {visible.filter((t) => t.completed_at).length}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold font-sans">
              Completed
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-lg px-4 py-3">
          <Inbox className="h-5 w-5 text-wff-red" />
          <div>
            <div className="font-bebas text-2xl text-white leading-none">
              {visible.filter((t) => !t.assignee?.trim()).length}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold font-sans">
              Unassigned
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/40">
          <Loader2 className="h-5 w-5 animate-spin mr-3" />
          <span className="font-sans text-xs uppercase tracking-widest">Loading assignments…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {grouped.map((group) => {
            const isUnassigned = group.assignee === "";
            return (
              <div
                key={group.assignee || "__unassigned__"}
                className="bg-[#111] border border-white/10 rounded-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 bg-black/30">
                  {isUnassigned ? (
                    <Inbox className="h-5 w-5 text-white/30" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-wff-red/15 border border-wff-red/30 flex items-center justify-center font-bebas text-lg text-wff-red">
                      {group.assignee.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-bebas text-xl text-white tracking-widest">
                      {isUnassigned ? "UNASSIGNED" : group.assignee.toUpperCase()}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold font-sans">
                      {group.done} done · {group.total - group.done} open
                    </div>
                  </div>
                  <div className="h-1.5 w-20 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-wff-green rounded-full"
                      style={{
                        width: group.total ? `${(group.done / group.total) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>

                <div className="divide-y divide-white/5">
                  {group.list.map((task) => {
                    const prio = priorityMeta(task.priority);
                    const col = columnMeta(task.column_id);
                    const phase = phaseMeta(task.phase_id);
                    return (
                      <div
                        key={task.id}
                        className="px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition-colors group"
                      >
                        <button
                          onClick={() => toggleDone(task)}
                          className={`mt-0.5 shrink-0 transition-colors ${
                            task.completed_at ? "text-green-400" : "text-white/20 hover:text-green-400"
                          }`}
                          title={task.completed_at ? "Reopen" : "Mark done"}
                        >
                          {task.completed_at ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-sm font-bold ${
                              task.completed_at ? "text-white/40 line-through" : "text-white"
                            }`}
                          >
                            {task.title}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-white/40 font-sans">
                            {col && (
                              <span className="flex items-center gap-1">
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: col.color }}
                                />
                                {col.name}
                              </span>
                            )}
                            {phase && <span>{phase.name}</span>}
                            <span
                              className={`px-1 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest ${prio.color}`}
                            >
                              {prio.label}
                            </span>
                            {task.due_date && (
                              <span className="flex items-center gap-1 font-mono">
                                <CalendarDays className="h-3 w-3" />
                                {formatEventDateShort(task.due_date)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={toggleDone.bind(null, task)}
                            className="text-white/30 hover:text-green-400 p-1"
                            title={task.completed_at ? "Reopen" : "Tick complete"}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <Link
                            href="/admin/master-plan/checklists"
                            className="text-white/30 hover:text-wff-gold p-1"
                            title="Edit on checklist board"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(task)}
                            className="text-white/30 hover:text-wff-red p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {group.list.length === 0 && (
                    <div className="px-4 py-6 text-center text-white/25 text-xs font-sans">
                      Nothing here.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
