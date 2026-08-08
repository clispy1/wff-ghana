"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  fetchKnownAssignees,
  fetchMasterPlanColumns,
  fetchMasterPlanPhases,
  fetchMasterPlanTasks,
  PRIORITIES,
  priorityMeta,
  type MasterPlanColumn,
  type MasterPlanPhase,
  type MasterPlanTask,
} from "@/lib/masterPlan";
import { formatEventDateShort } from "@/lib/activeEvent";
import { MasterPlanNav } from "@/components/admin/master-plan-nav";
import { MasterPlanEventPicker } from "@/components/admin/master-plan-event-picker";
import { MasterPlanImport } from "@/components/admin/master-plan-import";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Search,
  Settings2,
  Loader2,
  Flag,
  CalendarDays,
  X,
  ClipboardPaste,
} from "lucide-react";

interface PlanEventOption {
  id: string;
  title: string;
}

const EMPTY_TASK_FORM = {
  event_id: "",
  column_id: "",
  phase_id: "",
  title: "",
  description: "",
  assignee: "",
  priority: "medium",
  due_date: "",
};

export default function AdminChecklistsPage() {
  const [eventId, setEventId] = useState("");
  const [columns, setColumns] = useState<MasterPlanColumn[]>([]);
  const [phases, setPhases] = useState<MasterPlanPhase[]>([]);
  const [tasks, setTasks] = useState<MasterPlanTask[]>([]);
  const [events, setEvents] = useState<PlanEventOption[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({ ...EMPTY_TASK_FORM });

  const [columnManagerOpen, setColumnManagerOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const reload = useCallback(async () => {
    setError(null);
    const [cols, phs, ts, names, evts] = await Promise.all([
      fetchMasterPlanColumns(),
      fetchMasterPlanPhases(),
      fetchMasterPlanTasks(eventId || undefined),
      fetchKnownAssignees(),
      supabase.from("events").select("id, title").order("start_date", { ascending: true }),
    ]);
    setColumns(cols);
    setPhases(phs);
    setTasks(ts);
    setAssignees(names);
    setEvents((evts.data as PlanEventOption[] | null) || []);
  }, [eventId]);

  useEffect(() => {
    const boot = async () => {
      setLoading(true);
      await reload();
      setLoading(false);
    };
    boot();
  }, [reload]);

  const doneColumn = useMemo(
    () => columns.find((c) => c.is_done_column),
    [columns],
  );

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (phaseFilter && t.phase_id !== phaseFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (
        q &&
        !t.title.toLowerCase().includes(q) &&
        !(t.assignee?.toLowerCase().includes(q) ?? false)
      )
        return false;
      return true;
    });
  }, [tasks, phaseFilter, priorityFilter, search]);

  const tasksInColumn = (columnId: string) =>
    filteredTasks
      .filter((t) => t.column_id === columnId)
      .sort((a, b) => a.sort_order - b.sort_order);

  const persist = async (id: string, payload: Partial<MasterPlanTask>) => {
    const { error: writeError } = await supabase
      .from("master_plan_tasks")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (writeError) {
      setError(writeError.message);
      reload();
    }
  };

  const moveTask = async (
    taskId: string,
    toColumnId: string | null,
    completedAt: string | null,
  ) => {
    const siblings = tasks.filter(
      (t) => t.column_id === toColumnId && t.id !== taskId,
    );
    const sortOrder = siblings.length
      ? Math.max(...siblings.map((t) => t.sort_order)) + 1
      : 0;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              column_id: toColumnId,
              sort_order: sortOrder,
              completed_at: completedAt,
            }
          : t,
      ),
    );
    await persist(taskId, { column_id: toColumnId, sort_order: sortOrder, completed_at: completedAt });
  };

  const toggleDone = (task: MasterPlanTask) => {
    if (task.completed_at) {
      const openCol =
        columns.filter((c) => !c.is_done_column).sort((a, b) => a.sort_order - b.sort_order)[0]
          ?.id ?? null;
      moveTask(task.id, task.column_id === doneColumn?.id ? openCol : task.column_id, null);
    } else {
      moveTask(task.id, doneColumn?.id ?? task.column_id, new Date().toISOString());
    }
  };

  const reorderTask = (taskId: string, dir: -1 | 1) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const siblings = tasks
      .filter((t) => t.column_id === task.column_id)
      .sort((a, b) => a.sort_order - b.sort_order);
    const idx = siblings.findIndex((t) => t.id === taskId);
    const other = siblings[idx + dir];
    if (!other) return;
    const a = task.sort_order;
    const b = other.sort_order;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, sort_order: b }
          : t.id === other.id
            ? { ...t, sort_order: a }
            : t,
      ),
    );
    persist(taskId, { sort_order: b });
    persist(other.id, { sort_order: a });
  };

  const openNewTask = (columnId?: string) => {
    setEditTaskId(null);
    const defaultColumn =
      columnId ??
      columns.filter((c) => !c.is_done_column).sort((a, b) => a.sort_order - b.sort_order)[0]
        ?.id ??
      columns[0]?.id ??
      "";
    setTaskForm({ ...EMPTY_TASK_FORM, event_id: eventId, column_id: defaultColumn });
    setTaskDialogOpen(true);
  };

  const openEditTask = (task: MasterPlanTask) => {
    setEditTaskId(task.id);
    setTaskForm({
      event_id: task.event_id ?? "",
      column_id: task.column_id ?? "",
      phase_id: task.phase_id ?? "",
      title: task.title,
      description: task.description ?? "",
      assignee: task.assignee ?? "",
      priority: task.priority,
      due_date: task.due_date ?? "",
    });
    setTaskDialogOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      event_id: taskForm.event_id || null,
      column_id: taskForm.column_id || null,
      phase_id: taskForm.phase_id || null,
      title: taskForm.title.trim(),
      description: taskForm.description || null,
      assignee: taskForm.assignee.trim() || null,
      priority: taskForm.priority,
      due_date: taskForm.due_date || null,
    };
    if (editTaskId) {
      const { error: writeError } = await supabase
        .from("master_plan_tasks")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", editTaskId);
      if (writeError) {
        setError(writeError.message);
        return;
      }
    } else {
      const { error: writeError } = await supabase
        .from("master_plan_tasks")
        .insert([payload]);
      if (writeError) {
        setError(writeError.message);
        return;
      }
    }
    setTaskDialogOpen(false);
    reload();
  };

  const handleDeleteTask = async (task: MasterPlanTask) => {
    if (!confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    const { error } = await supabase
      .from("master_plan_tasks")
      .delete()
      .eq("id", task.id);
    if (error) setError(error.message);
    reload();
  };

  const handleColumnMove = async (columnId: string, dir: -1 | 1) => {
    const sorted = [...columns].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((c) => c.id === columnId);
    const other = sorted[idx + dir];
    if (!other) return;
    const a = sorted[idx].sort_order;
    const b = other.sort_order;
    setColumns((prev) =>
      prev.map((c) =>
        c.id === columnId ? { ...c, sort_order: b } : c.id === other.id ? { ...c, sort_order: a } : c,
      ),
    );
    await supabase.from("master_plan_columns").update({ sort_order: b }).eq("id", columnId);
    await supabase.from("master_plan_columns").update({ sort_order: a }).eq("id", other.id);
  };

  const handleColumnDelete = async (column: MasterPlanColumn) => {
    const count = tasks.filter((t) => t.column_id === column.id).length;
    if (
      !confirm(
        `Delete the "${column.name}" column? ${count} task${count === 1 ? "" : "s"} in it will move to no column.`,
      )
    )
      return;
    await supabase.from("master_plan_columns").delete().eq("id", column.id);
    setColumnManagerOpen(false);
    reload();
  };

  const handleColumnAdd = async () => {
    const name = prompt("New column name:");
    if (!name?.trim()) return;
    const nextOrder = columns.length
      ? Math.max(...columns.map((c) => c.sort_order)) + 1
      : 0;
    await supabase.from("master_plan_columns").insert([
      { name: name.trim(), color: "#6B7280", sort_order: nextOrder },
    ]);
    reload();
  };

  const columnMeta = (id: string | null) => columns.find((c) => c.id === id);
  const phaseMeta = (id: string | null) => phases.find((p) => p.id === id);
  const eventMeta = (id: string | null) => events.find((e) => e.id === id);

  const inputClass = "bg-black border-white/10";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-bebas text-4xl text-white">CHECKLISTS & KANBAN</h2>
          <p className="text-white/50 text-sm font-sans mt-2">
            Drag cards between columns, tick tasks done, and manage the board&apos;s columns.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <MasterPlanEventPicker value={eventId} onChange={setEventId} />
          <Button
            onClick={() => setColumnManagerOpen(true)}
            variant="outline"
            className="border-white/10 text-white/70 hover:text-white hover:border-white/25"
          >
            <Settings2 className="h-4 w-4 mr-2" /> COLUMNS
          </Button>
          <Button
            onClick={() => setImportOpen(true)}
            variant="outline"
            className="border-white/10 text-white/70 hover:text-wff-gold hover:border-wff-gold/40"
          >
            <ClipboardPaste className="h-4 w-4 mr-2" /> BULK IMPORT
          </Button>
          <Button
            onClick={() => openNewTask()}
            className="bg-wff-red hover:bg-white hover:text-black font-bebas tracking-widest"
          >
            <Plus className="mr-2 h-4 w-4" /> NEW TASK
          </Button>
        </div>
      </div>

      <MasterPlanNav />

      {error && (
        <div className="bg-wff-red/10 border border-wff-red/30 text-wff-red font-sans text-xs p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <Search className="h-4 w-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks or assignee…"
            className="bg-[#111] border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-white outline-none focus:border-wff-gold transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 outline-none focus:border-wff-gold cursor-pointer"
        >
          <option value="">ALL PHASES</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id} className="bg-[#111]">
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 outline-none focus:border-wff-gold cursor-pointer"
        >
          <option value="">ALL PRIORITIES</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value} className="bg-[#111]">
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/40">
          <Loader2 className="h-5 w-5 animate-spin mr-3" />
          <span className="font-sans text-xs uppercase tracking-widest">Loading board…</span>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
          {columns.map((column) => {
            const colTasks = tasksInColumn(column.id);
            return (
              <div
                key={column.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverCol(column.id);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverCol((prev) => (prev === column.id ? null : prev));
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragTaskId) moveTask(dragTaskId, column.id, column.is_done_column ? new Date().toISOString() : null);
                  setDragTaskId(null);
                  setDragOverCol(null);
                }}
                className={`w-72 shrink-0 rounded-xl border transition-all ${
                  dragOverCol === column.id
                    ? "border-wff-gold bg-wff-gold/5"
                    : "border-white/10 bg-[#111]"
                } flex flex-col max-h-[70vh]`}
              >
                <div
                  className="px-4 py-3 rounded-t-xl flex items-center gap-2 border-b border-white/5"
                  style={{ backgroundColor: `${column.color}14` }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: column.color }}
                  />
                  <span className="font-bebas text-lg text-white tracking-widest flex-1">
                    {column.name.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-white/40">{colTasks.length}</span>
                  <button
                    onClick={() => openNewTask(column.id)}
                    className="text-white/30 hover:text-wff-gold transition-colors"
                    title="Add task to this column"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1 min-h-[120px]">
                  {colTasks.map((task) => {
                    const prio = priorityMeta(task.priority);
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", task.id);
                          setDragTaskId(task.id);
                        }}
                        onDragEnd={() => {
                          setDragTaskId(null);
                          setDragOverCol(null);
                        }}
                        className={`group rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-all ${
                          task.completed_at
                            ? "border-green-500/20 bg-green-500/5"
                            : "border-white/10 bg-black/40 hover:border-white/25"
                        } ${dragTaskId === task.id ? "opacity-40" : ""}`}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => toggleDone(task)}
                            className={`mt-0.5 shrink-0 transition-colors ${
                              task.completed_at
                                ? "text-green-400"
                                : "text-white/20 hover:text-green-400"
                            }`}
                            title={task.completed_at ? "Reopen task" : "Mark done"}
                          >
                            {task.completed_at ? (
                              <RotateCcw className="h-4 w-4" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-sm font-bold leading-snug ${
                                task.completed_at
                                  ? "text-white/40 line-through"
                                  : "text-white"
                              }`}
                            >
                              {task.title}
                            </div>
                            {task.description && (
                              <div className="text-[11px] text-white/40 font-sans mt-1 line-clamp-2">
                                {task.description}
                              </div>
                            )}
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {phaseMeta(task.phase_id) && (
                                <span
                                  className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest text-white/70"
                                  style={{ backgroundColor: `${phaseMeta(task.phase_id)!.color}22` }}
                                >
                                  {phaseMeta(task.phase_id)!.name}
                                </span>
                              )}
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${prio.color}`}
                              >
                                {prio.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-3 text-[10px] text-white/40 font-sans">
                            {task.assignee && (
                              <span className="flex items-center gap-1">
                                <Flag className="h-3 w-3" />
                                {task.assignee}
                              </span>
                            )}
                            {task.due_date && (
                              <span className="flex items-center gap-1 font-mono">
                                <CalendarDays className="h-3 w-3" />
                                {formatEventDateShort(task.due_date)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => reorderTask(task.id, -1)}
                              className="text-white/30 hover:text-white p-0.5"
                              title="Move up"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => reorderTask(task.id, 1)}
                              className="text-white/30 hover:text-white p-0.5"
                              title="Move down"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => openEditTask(task)}
                              className="text-white/30 hover:text-wff-gold p-0.5"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task)}
                              className="text-white/30 hover:text-wff-red p-0.5"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {colTasks.length === 0 && (
                    <button
                      onClick={() => openNewTask(column.id)}
                      className="w-full py-6 rounded-lg border border-dashed border-white/10 text-white/25 text-xs font-sans hover:text-white/50 hover:border-white/25 transition-colors"
                    >
                      + Add a task
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task create/edit dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="bg-[#111] text-white border-white/10 sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bebas text-3xl tracking-widest text-wff-gold">
              {editTaskId ? "EDIT TASK" : "NEW CHECKLIST TASK"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveTask} className="grid grid-cols-2 gap-4 pt-4">
            <div className="col-span-2 space-y-2">
              <Label>
                Title <span className="text-wff-red ml-1">*</span>
              </Label>
              <Input
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
                className={inputClass}
                placeholder="e.g. Confirm judges for the physique category"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                rows={3}
                className="w-full bg-black border border-white/10 rounded-md p-3 text-sm text-white outline-none focus:border-wff-gold transition-colors resize-none"
                placeholder="Notes, links, or context for whoever picks this up…"
              />
            </div>
            <div className="space-y-2">
              <Label>Event</Label>
              <select
                value={taskForm.event_id}
                onChange={(e) => setTaskForm({ ...taskForm, event_id: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-wff-gold cursor-pointer"
              >
                <option value="" className="bg-[#111]">
                  No event
                </option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id} className="bg-[#111]">
                    {evt.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Column</Label>
              <select
                value={taskForm.column_id}
                onChange={(e) => setTaskForm({ ...taskForm, column_id: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-wff-gold cursor-pointer"
              >
                {columns.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#111]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Phase</Label>
              <select
                value={taskForm.phase_id}
                onChange={(e) => setTaskForm({ ...taskForm, phase_id: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-wff-gold cursor-pointer"
              >
                <option value="" className="bg-[#111]">
                  No phase
                </option>
                {phases.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#111]">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-wff-gold cursor-pointer"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value} className="bg-[#111]">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Input
                value={taskForm.assignee}
                onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                list="master-plan-assignees"
                className={inputClass}
                placeholder="Who owns this?"
              />
              <datalist id="master-plan-assignees">
                {assignees.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                className={inputClass}
              />
            </div>
            <Button
              type="submit"
              className="col-span-2 w-full bg-wff-gold text-black hover:bg-white font-bebas tracking-widest"
            >
              SAVE TASK
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Column manager dialog */}
      <Dialog open={columnManagerOpen} onOpenChange={setColumnManagerOpen}>
        <DialogContent className="bg-[#111] text-white border-white/10 sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bebas text-3xl tracking-widest text-wff-gold">
              BOARD COLUMNS
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-white/40 font-sans -mt-2">
            Rename, recolour, reorder, and decide which column means &quot;done&quot;.
          </p>
          <div className="space-y-3 pt-4">
            {columns.map((column) => (
              <div
                key={column.id}
                className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg p-3"
              >
                <div className="flex flex-col">
                  <button
                    onClick={() => handleColumnMove(column.id, -1)}
                    className="text-white/30 hover:text-white p-0.5 disabled:opacity-20"
                    disabled={column.sort_order === Math.min(...columns.map((c) => c.sort_order))}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleColumnMove(column.id, 1)}
                    className="text-white/30 hover:text-white p-0.5 disabled:opacity-20"
                    disabled={column.sort_order === Math.max(...columns.map((c) => c.sort_order))}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="color"
                  value={column.color}
                  onChange={async (e) => {
                    const color = e.target.value;
                    setColumns((prev) =>
                      prev.map((c) => (c.id === column.id ? { ...c, color } : c)),
                    );
                    await supabase.from("master_plan_columns").update({ color }).eq("id", column.id);
                  }}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                  title="Column colour"
                />
                <input
                  value={column.name}
                  onChange={async (e) => {
                    const name = e.target.value;
                    setColumns((prev) =>
                      prev.map((c) => (c.id === column.id ? { ...c, name } : c)),
                    );
                    await supabase.from("master_plan_columns").update({ name }).eq("id", column.id);
                  }}
                  className="flex-1 bg-transparent text-sm font-bold text-white outline-none border-b border-transparent focus:border-white/20"
                />
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={column.is_done_column}
                    onChange={async (e) => {
                      const isDone = e.target.checked;
                      setColumns((prev) =>
                        prev.map((c) => ({
                          ...c,
                          is_done_column: isDone && c.id === column.id,
                        })),
                      );
                      await supabase
                        .from("master_plan_columns")
                        .update({ is_done_column: isDone })
                        .eq("id", column.id);
                      if (isDone) {
                        await supabase
                          .from("master_plan_columns")
                          .update({ is_done_column: false })
                          .neq("id", column.id);
                      }
                      reload();
                    }}
                    className="w-4 h-4 accent-wff-red"
                  />
                  Done
                </label>
                <button
                  onClick={() => handleColumnDelete(column)}
                  className="text-white/30 hover:text-wff-red p-1"
                  title="Delete column"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button
            onClick={handleColumnAdd}
            className="w-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white font-bebas tracking-widest"
          >
            <Plus className="mr-2 h-4 w-4" /> ADD COLUMN
          </Button>
        </DialogContent>
      </Dialog>

      <MasterPlanImport
        open={importOpen}
        onOpenChange={setImportOpen}
        phases={phases}
        columns={columns}
        tasks={tasks}
        eventId={eventId}
        eventLabel={eventMeta(eventId)?.title || ""}
        onImported={reload}
      />
    </div>
  );
}
