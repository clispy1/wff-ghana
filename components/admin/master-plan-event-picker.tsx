"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CalendarDays, Globe2 } from "lucide-react";

export interface PlanEventOption {
  id: string;
  title: string;
  start_date: string | null;
  is_active: boolean;
}

/**
 * Event selector used across the master plan pages. Defaults to the
 * active event with the soonest start date — the same rule the rest of
 * the site uses (lib/activeEvent.ts).
 */
export function MasterPlanEventPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (eventId: string) => void;
}) {
  const [events, setEvents] = useState<PlanEventOption[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("events")
        .select("id, title, start_date, is_active")
        .order("start_date", { ascending: true });
      const rows = (data as PlanEventOption[] | null) || [];
      setEvents(rows);
      setReady(true);
      if (!value) {
        const active = rows
          .filter((e) => e.is_active)
          .sort((a, b) => String(a.start_date).localeCompare(String(b.start_date)))[0];
        onChange(active?.id || "");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const label = events.find((e) => e.id === value)?.title || "ALL EVENTS";

  return (
    <div className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-lg px-3 py-2">
      <CalendarDays className="h-4 w-4 text-wff-gold shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer appearance-none pr-6"
        disabled={!ready}
      >
        <option value="">ALL EVENTS</option>
        {events.map((evt) => (
          <option key={evt.id} value={evt.id} className="bg-[#111] text-white">
            {evt.title}
            {evt.is_active ? " (LIVE)" : ""}
          </option>
        ))}
      </select>
      {events.some((e) => e.id === value && e.is_active) && (
        <Globe2 className="h-3.5 w-3.5 text-green-400" />
      )}
      <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest text-white/30">
        {label}
      </span>
    </div>
  );
}
