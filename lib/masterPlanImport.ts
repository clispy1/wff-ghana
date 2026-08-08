// ------------------------------------------------------------------
// MASTER PLAN BULK IMPORT — pure logic, no Supabase dependency.
//
// Accepts three shapes pasted into the admin dashboard:
//   1. A JSON array of titles           ["Book venue", "Hire crew"]
//   2. A JSON array of rich objects      [{ "title": "...", "phase": "Pre-Launch", ... }]
//   3. A table (CSV or TSV) copied from Excel/Sheets with a header row
// Names for phase/status resolve against the board's columns & phases.
// ------------------------------------------------------------------

export type ParsedImportTask = {
  title: string;
  description: string | null;
  phase_id: string | null;
  phase_label: string | null;
  column_id: string | null;
  column_label: string | null;
  priority: "low" | "medium" | "high" | "critical";
  assignee: string | null;
  due_date: string | null;
};

export type ParseResult = {
  format: string;
  tasks: ParsedImportTask[];
  errors: string[];
  duplicates: string[];
};

export const IMPORT_EXAMPLE_JSON = `{
  "tasks": [
    {
      "title": "Confirm judges for physique category",
      "description": "Send contracts and travel details",
      "phase": "Pre-Launch",
      "status": "In Progress",
      "priority": "high",
      "assignee": "Kwame Mensah",
      "due": "2026-08-20"
    },
    {
      "title": "Print welcome banners",
      "phase": "Build-Up",
      "status": "To Do",
      "priority": "medium"
    },
    "Order championship trophies"
  ]
}`;

export const IMPORT_EXAMPLE_TSV = `Title\tPhase\tStatus\tPriority\tAssignee\tDue
Book venue security contract\tPre-Launch\tTo Do\thigh\tKwame Mensah\t2026-08-15
Hire sound engineer\tBuild-Up\tIn Progress\tcritical\t\t2026-08-22
Order championship trophies\tBuild-Up\tTo Do\tmedium\t` + "\t2026-09-01";

const NORM_KEY = (s: string) => s.trim().toLowerCase().replace(/[\s_\-]+/g, "");

const HEADER_ALIASES: Record<string, string> = {
  title: "title",
  name: "title",
  task: "title",
  description: "description",
  desc: "description",
  notes: "description",
  details: "description",
  phase: "phase",
  status: "status",
  column: "status",
  stage: "status",
  board: "status",
  list: "status",
  col: "status",
  priority: "priority",
  prio: "priority",
  assignee: "assignee",
  owner: "assignee",
  responsible: "assignee",
  person: "assignee",
  who: "assignee",
  due: "due",
  duedate: "due",
  date: "due",
  deadline: "due",
};

const PRIORITY_ALIASES: Record<string, "low" | "medium" | "high" | "critical"> = {
  critical: "critical",
  urgent: "critical",
  high: "high",
  medium: "medium",
  med: "medium",
  normal: "medium",
  low: "low",
};

function splitTableLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delim) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

/** "2026-08-20" stays as-is; anything date-like converts to ISO. */
function normalizeDueDate(raw: string | undefined): { value: string | null; error?: string } {
  const s = (raw ?? "").trim();
  if (!s) return { value: null };
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { value: s };
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return { value: d.toISOString().slice(0, 10) };
  return { value: null, error: `"${s}" is not a valid date — use YYYY-MM-DD` };
}

/**
 * Turn pasted JSON/TSV/CSV text into board-ready tasks. `existingTitles`
 * are used to flag (and skip) duplicates that are already on the board.
 */
export function parseTaskImport(
  raw: string,
  phases: { id: string; name: string }[],
  columns: { id: string; name: string }[],
  existingTitles: string[] = [],
): ParseResult {
  const tasks: ParsedImportTask[] = [];
  const errors: string[] = [];
  const duplicates: string[] = [];

  const text = raw.trim();
  if (!text) {
    return { format: "empty", tasks, errors: ["Paste some JSON or a table first."], duplicates };
  }

  const existing = new Set(existingTitles.map((t) => t.toLowerCase().trim()));
  const seen = new Set<string>();

  const pushTask = (input: ParsedImportTask) => {
    const key = input.title.toLowerCase().trim();
    if (existing.has(key) || seen.has(key)) {
      duplicates.push(input.title);
      return;
    }
    seen.add(key);
    tasks.push(input);
  };

  const resolveName = (list: { id: string; name: string }[], rawValue: string | undefined) => {
    const v = (rawValue ?? "").trim();
    if (!v) return { id: null as string | null, label: null as string | null };
    const found = list.find((x) => x.name.trim().toLowerCase() === v.toLowerCase());
    if (found) return { id: found.id, label: found.name };
    return { id: null as string | null, label: v, missing: v };
  };

  const fromCanonical = (canonical: Record<string, string | undefined>, label: string) => {
    const title = (canonical.title ?? "").trim();
    if (!title) {
      errors.push(`${label}: missing a title`);
      return;
    }

    const phase = resolveName(phases, canonical.phase);
    if (phase.missing) errors.push(`${label}: unknown phase "${phase.missing}"`);

    const column = resolveName(columns, canonical.status);
    if (column.missing) errors.push(`${label}: unknown status/column "${column.missing}"`);

    const prioRaw = (canonical.priority ?? "").trim().toLowerCase();
    const priority = prioRaw ? (PRIORITY_ALIASES[prioRaw] ?? null) : "medium";
    if (prioRaw && !priority) {
      errors.push(
        `${label}: unknown priority "${canonical.priority}" (use low/medium/high/critical)`,
      );
    }

    const due = normalizeDueDate(canonical.due);
    if (due.error) errors.push(`${label}: ${due.error}`);

    const description = (canonical.description ?? "").trim() || null;
    const assignee = (canonical.assignee ?? "").trim() || null;

    pushTask({
      title,
      description,
      phase_id: phase.id,
      phase_label: phase.label,
      column_id: column.id,
      column_label: column.label,
      priority: priority ?? "medium",
      assignee,
      due_date: due.value,
    });
  };

  const extractCanonical = (row: Record<string, unknown>): Record<string, string | undefined> => {
    const out: Record<string, string | undefined> = {};
    for (const [key, value] of Object.entries(row)) {
      const target = HEADER_ALIASES[NORM_KEY(key)];
      if (target && value !== undefined && value !== null) {
        out[target] = String(value);
      }
    }
    return out;
  };

  let format: string;

  if (text.startsWith("[") || text.startsWith("{")) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return {
        format: "json",
        tasks,
        errors: [`Couldn't parse JSON: ${e instanceof Error ? e.message : String(e)}`],
        duplicates,
      };
    }

    let arr: unknown[] = [];
    if (Array.isArray(parsed)) {
      arr = parsed;
    } else if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as { tasks?: unknown[] }).tasks)
    ) {
      arr = (parsed as { tasks: unknown[] }).tasks;
    } else {
      return {
        format: "json",
        tasks,
        errors: ['JSON must be an array of tasks, or an object with a "tasks" array.'],
        duplicates,
      };
    }
    if (arr.length === 0) {
      return { format: "json", tasks, errors: ["The JSON array is empty."], duplicates };
    }
    format = "json";

    arr.forEach((item, idx) => {
      const label = `Row ${idx + 1}`;
      if (typeof item === "string") {
        fromCanonical({ title: item }, label);
      } else if (item && typeof item === "object") {
        fromCanonical(extractCanonical(item as Record<string, unknown>), label);
      } else {
        errors.push(`${label}: expected a string or an object`);
      }
    });
  } else {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return {
        format: "table",
        tasks,
        errors: ["A table needs a header row plus at least one data row."],
        duplicates,
      };
    }
    const isTsv = lines[0].includes("\t");
    const delim = isTsv ? "\t" : ",";
    format = isTsv ? "tsv" : "csv";

    const header = splitTableLine(lines[0], delim).map(NORM_KEY);
    const canonicalHeaders: string[] = header.map((h) => HEADER_ALIASES[h] ?? "");

    for (let i = 1; i < lines.length; i += 1) {
      const cells = splitTableLine(lines[i], delim);
      const canonical: Record<string, string | undefined> = {};
      canonicalHeaders.forEach((target, idx) => {
        if (target) canonical[target] = cells[idx] ?? "";
      });
      fromCanonical(canonical, `Row ${i + 1}`);
    }
  }

  return { format, tasks, errors, duplicates };
}
