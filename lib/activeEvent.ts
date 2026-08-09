import { supabase } from './supabase';

export interface WffEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  venue_name: string | null;
  venue_location: string | null;
  description: string | null;
  is_active: boolean;
  registration_deadline: string | null;
}

/**
 * The one event the public site is currently promoting.
 *
 * Every page needs to agree on this. `select('*').limit(1)` does not —
 * without an ORDER BY, Postgres may hand back a different row to
 * different pages once there is more than one event, so the homepage
 * and the championship page could advertise different venues.
 *
 * The rule: active events only, soonest start date wins.
 */
export async function fetchActiveEvent(
  db: { from: typeof supabase.from } = supabase,
): Promise<WffEvent | null> {
  const { data, error } = await db
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('start_date', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Could not load the active event:', error.message);
    return null;
  }
  return (data as WffEvent) || null;
}

/** "26 September 2026" — falls back to the raw value if unparseable. */
export function formatEventDate(date?: string | null): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** "Sept 26, 2026" — the compact form used in the hero strip. */
export function formatEventDateShort(date?: string | null): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * "20–26 September 2026", collapsing shared month/year. Single-day
 * events render as one date.
 */
export function formatEventRange(
  start?: string | null,
  end?: string | null,
): string | null {
  if (!start) return null;
  if (!end || start === end) return formatEventDate(start);

  const from = new Date(start);
  const to = new Date(end);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return `${start} – ${end}`;
  }

  const sameMonth =
    from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear();

  if (sameMonth) {
    return `${from.getDate()}–${to.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}`;
  }

  return `${formatEventDate(start)} – ${formatEventDate(end)}`;
}
