import { supabase } from "./supabase";

export const MASTER_PLAN_BUCKET = "master-plan-assets";

export type MasterPlanPhase = {
  id: string;
  name: string;
  color: string;
  sort_order: number;
  created_at: string;
};

export type MasterPlanColumn = {
  id: string;
  name: string;
  color: string;
  sort_order: number;
  is_done_column: boolean;
  created_at: string;
};

export type MasterPlanTask = {
  id: string;
  event_id: string | null;
  column_id: string | null;
  phase_id: string | null;
  title: string;
  description: string | null;
  assignee: string | null;
  priority: "low" | "medium" | "high" | "critical";
  due_date: string | null;
  sort_order: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MasterPlanDesign = {
  id: string;
  event_id: string | null;
  title: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  category: string;
  status: string;
  version: string | null;
  uploaded_by: string | null;
  created_at: string;
};

export const PRIORITIES: { value: MasterPlanTask["priority"]; label: string; color: string }[] = [
  { value: "low", label: "LOW", color: "text-white/40 border-white/20 bg-white/5" },
  { value: "medium", label: "MEDIUM", color: "text-wff-gold border-wff-gold/30 bg-wff-gold/10" },
  { value: "high", label: "HIGH", color: "text-wff-red border-wff-red/30 bg-wff-red/10" },
  { value: "critical", label: "CRITICAL", color: "text-red-400 border-red-500/40 bg-red-500/10" },
];

export const DESIGN_CATEGORIES: { value: string; label: string }[] = [
  { value: "flyer", label: "Flyer" },
  { value: "poster", label: "Poster" },
  { value: "banner", label: "Banner" },
  { value: "brand", label: "Brand Asset" },
  { value: "other", label: "Other" },
];

export const DESIGN_STATUSES: { value: string; label: string; color: string }[] = [
  { value: "draft", label: "DRAFT", color: "text-white/40 border-white/20 bg-white/5" },
  { value: "final", label: "FINAL", color: "text-wff-gold border-wff-gold/30 bg-wff-gold/10" },
  { value: "approved", label: "APPROVED", color: "text-green-400 border-green-500/30 bg-green-500/10" },
];

export const priorityMeta = (p: string) =>
  PRIORITIES.find((x) => x.value === p) ?? PRIORITIES[1];

export const designStatusMeta = (s: string) =>
  DESIGN_STATUSES.find((x) => x.value === s) ?? DESIGN_STATUSES[0];

export async function fetchMasterPlanPhases(): Promise<MasterPlanPhase[]> {
  const { data } = await supabase
    .from("master_plan_phases")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as MasterPlanPhase[]) || [];
}

export async function fetchMasterPlanColumns(): Promise<MasterPlanColumn[]> {
  const { data } = await supabase
    .from("master_plan_columns")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as MasterPlanColumn[]) || [];
}

export async function fetchMasterPlanTasks(
  eventId?: string,
): Promise<MasterPlanTask[]> {
  let query = supabase
    .from("master_plan_tasks")
    .select("*")
    .order("sort_order", { ascending: true });
  if (eventId) query = query.eq("event_id", eventId);
  const { data } = await query;
  return (data as MasterPlanTask[]) || [];
}

export async function fetchMasterPlanDesigns(
  eventId?: string,
): Promise<MasterPlanDesign[]> {
  let query = supabase
    .from("master_plan_designs")
    .select("*")
    .order("created_at", { ascending: false });
  if (eventId) query = query.eq("event_id", eventId);
  const { data } = await query;
  return (data as MasterPlanDesign[]) || [];
}

/** Unique assignee names already in use — backs the datalist suggestion. */
export async function fetchKnownAssignees(): Promise<string[]> {
  const { data } = await supabase
    .from("master_plan_tasks")
    .select("assignee")
    .not("assignee", "is", null);
  const names = new Set(
    ((data as { assignee: string | null }[]) || [])
      .map((r) => r.assignee?.trim())
      .filter((n): n is string => !!n),
  );
  return [...names].sort((a, b) => a.localeCompare(b));
}

/** Short-lived admin-only download URL for a design file. */
export async function createSignedDownloadUrl(
  path: string,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(MASTER_PLAN_BUCKET)
    .createSignedUrl(path, 3600, { download: true });
  if (error) return null;
  return data.signedUrl;
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** True when a design file is an image that can be previewed inline. */
export function isImageMime(mime: string | null): boolean {
  return !!mime && mime.startsWith("image/");
}

export * from "./masterPlanImport";
