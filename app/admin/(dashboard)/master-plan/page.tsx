"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  fetchMasterPlanColumns,
  fetchMasterPlanDesigns,
  fetchMasterPlanPhases,
  fetchMasterPlanTasks,
  type MasterPlanColumn,
  type MasterPlanDesign,
  type MasterPlanPhase,
  type MasterPlanTask,
} from "@/lib/masterPlan";
import { formatEventDateShort } from "@/lib/activeEvent";
import { MasterPlanNav } from "@/components/admin/master-plan-nav";
import { MasterPlanEventPicker } from "@/components/admin/master-plan-event-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ListChecks,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  CalendarClock,
  ImageDown,
  ArrowRight,
  UsersRound,
} from "lucide-react";

export default function AdminMasterPlanPage() {
  const [eventId, setEventId] = useState("");
  const [tasks, setTasks] = useState<MasterPlanTask[]>([]);
  const [columns, setColumns] = useState<MasterPlanColumn[]>([]);
  const [phases, setPhases] = useState<MasterPlanPhase[]>([]);
  const [designs, setDesigns] = useState<MasterPlanDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const [cols, phs] = await Promise.all([
        fetchMasterPlanColumns(),
        fetchMasterPlanPhases(),
      ]);
      setColumns(cols);
      setPhases(phs);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (loading) return;
    const load = async () => {
      const [ts, ds] = await Promise.all([
        fetchMasterPlanTasks(eventId || undefined),
        fetchMasterPlanDesigns(eventId || undefined),
      ]);
      setTasks(ts);
      setDesigns(ds);
    };
    load().catch((e) => setError(e instanceof Error ? e.message : "Load failed."));
  }, [eventId, loading]);

  const today = new Date().toISOString().slice(0, 10);

  const doneCount = useMemo(
    () => tasks.filter((t) => t.completed_at).length,
    [tasks],
  );
  const openCount = tasks.length - doneCount;
  const overdue = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed_at && t.due_date && t.due_date < today)
        .sort((a, b) => String(a.due_date).localeCompare(String(b.due_date))),
    [tasks, today],
  );
  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed_at && t.due_date && t.due_date >= today)
        .sort((a, b) => String(a.due_date).localeCompare(String(b.due_date)))
        .slice(0, 7),
    [tasks, today],
  );

  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const columnMeta = (id: string | null) => columns.find((c) => c.id === id);

  const columnBreakdown = columns.map((col) => ({
    column: col,
    count: tasks.filter((t) => t.column_id === col.id).length,
    done: tasks.filter((t) => t.column_id === col.id && t.completed_at).length,
  }));

  const phaseBreakdown = phases.map((phase) => {
    const inPhase = tasks.filter((t) => t.phase_id === phase.id);
    return {
      phase,
      count: inPhase.length,
      done: inPhase.filter((t) => t.completed_at).length,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-bebas text-4xl text-white">EVENT MASTER PLAN</h2>
          <p className="text-white/50 text-sm font-sans mt-2">
            Command hub for planning, prelaunch and wrap-up of the championship.
          </p>
        </div>
        <MasterPlanEventPicker value={eventId} onChange={setEventId} />
      </div>

      <MasterPlanNav />

      {error && (
        <div className="bg-wff-red/10 border border-wff-red/30 text-wff-red font-sans text-xs p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/40">
          <Loader2 className="h-5 w-5 animate-spin mr-3" />
          <span className="font-sans text-xs uppercase tracking-widest">Loading plan…</span>
        </div>
      ) : (
        <>
          {/* Overall progress */}
          <Card className="bg-[#111] border-white/10">
            <CardContent className="pt-5">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <div className="font-bebas text-2xl text-white tracking-wide">
                    {progress}% COMPLETE
                  </div>
                  <p className="text-xs text-white/40 font-sans mt-1">
                    {doneCount} of {tasks.length} tasks ticked off
                  </p>
                </div>
                <Link
                  href="/admin/master-plan/checklists"
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-wff-gold hover:text-white transition-colors"
                >
                  Open the checklist board <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-wff-red via-wff-gold to-wff-green transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<ListChecks className="h-4 w-4 text-wff-gold" />}
              label="Total Tasks"
              value={tasks.length}
              sub="Across every column"
            />
            <StatCard
              icon={<CheckCircle2 className="h-4 w-4 text-green-400" />}
              label="Completed"
              value={doneCount}
              sub="Tick-to-complete"
            />
            <StatCard
              icon={<Loader2 className="h-4 w-4 text-wff-red" />}
              label="Still Open"
              value={openCount}
              sub="Not yet ticked"
            />
            <StatCard
              icon={<AlertTriangle className="h-4 w-4 text-red-400" />}
              label="Overdue"
              value={overdue.length}
              sub="Past their due date"
              danger={overdue.length > 0}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column breakdown */}
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white/60 uppercase tracking-widest">
                  Column Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {columnBreakdown.map(({ column, count, done }) => (
                  <div key={column.id}>
                    <div className="flex justify-between text-xs font-sans mb-1.5">
                      <span className="flex items-center gap-2 font-bold text-white/70">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: column.color }}
                        />
                        {column.name}
                      </span>
                      <span className="text-white/40">
                        {done}/{count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          backgroundColor: column.color,
                          width: count ? `${(done / count) * 100}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
                {columnBreakdown.every((c) => c.count === 0) && (
                  <p className="text-sm text-white/30 font-sans">No tasks yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Phase breakdown */}
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white/60 uppercase tracking-widest">
                  Phase Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {phaseBreakdown.map(({ phase, count, done }) => (
                  <div key={phase.id}>
                    <div className="flex justify-between text-xs font-sans mb-1.5">
                      <span className="flex items-center gap-2 font-bold text-white/70">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: phase.color }}
                        />
                        {phase.name}
                      </span>
                      <span className="text-white/40">
                        {done}/{count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          backgroundColor: phase.color,
                          width: count ? `${(done / count) * 100}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
                {phaseBreakdown.every((p) => p.count === 0) && (
                  <p className="text-sm text-white/30 font-sans">No tasks yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overdue + upcoming */}
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-wff-red" /> Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {overdue.length > 0 && (
                  <>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1 font-sans">
                      Overdue
                    </div>
                    {overdue.map((t) => (
                      <DeadlineRow key={t.id} task={t} columnMeta={columnMeta} overdue />
                    ))}
                  </>
                )}
                {upcoming.length > 0 && (
                  <>
                    {overdue.length > 0 && (
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 pt-3 font-sans">
                        Upcoming
                      </div>
                    )}
                    {upcoming.map((t) => (
                      <DeadlineRow key={t.id} task={t} columnMeta={columnMeta} />
                    ))}
                  </>
                )}
                {overdue.length === 0 && upcoming.length === 0 && (
                  <p className="text-sm text-white/30 font-sans">
                    No dated tasks yet. Add a due date when creating checklist items.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent designs */}
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                  <ImageDown className="h-4 w-4 text-wff-gold" /> Latest Design Uploads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {designs.length === 0 ? (
                  <p className="text-sm text-white/30 font-sans">
                    Nothing uploaded yet. Flyers, posters and brand assets go in the design
                    library.
                  </p>
                ) : (
                  designs.slice(0, 5).map((d) => (
                    <Link
                      key={d.id}
                      href="/admin/master-plan/designs"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-bold text-white truncate">
                          {d.title}
                        </span>
                        <span className="block text-[11px] text-white/40 font-sans capitalize">
                          {d.category} · {d.status}
                        </span>
                      </span>
                      <span className="text-[10px] text-white/30 font-mono">
                        {d.created_at?.slice(0, 10)}
                      </span>
                    </Link>
                  ))
                )}
                {designs.length > 0 && (
                  <Link
                    href="/admin/master-plan/designs"
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-wff-gold hover:text-white transition-colors pt-2"
                  >
                    Go to design library <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/master-plan/tasks"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded-lg px-4 py-2 transition-all"
            >
              <UsersRound className="h-4 w-4" /> Assign tasks to team members
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  danger?: boolean;
}) {
  return (
    <Card className={`bg-[#111] border-white/10 ${danger ? "border-red-500/30" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-white/60">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-bebas">{value}</div>
        <p className="text-xs text-white/40 mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

function DeadlineRow({
  task,
  columnMeta,
  overdue,
}: {
  task: MasterPlanTask;
  columnMeta: (id: string | null) => MasterPlanColumn | undefined;
  overdue?: boolean;
}) {
  const col = columnMeta(task.column_id);
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg border ${
        overdue ? "border-red-500/20 bg-red-500/5" : "border-white/5"
      }`}
    >
      {col && <span className="w-1.5 h-8 rounded-full shrink-0" style={{ backgroundColor: col.color }} />}
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-bold text-white truncate">{task.title}</span>
        <span className="block text-[11px] text-white/40 font-sans">
          {task.assignee || "Unassigned"} · {col?.name || "No column"}
        </span>
      </span>
      <span
        className={`text-[11px] font-mono font-bold ${
          overdue ? "text-red-400" : "text-white/40"
        }`}
      >
        {formatEventDateShort(task.due_date)}
      </span>
      {overdue && <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />}
    </div>
  );
}
