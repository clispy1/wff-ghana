import type { WffEvent } from './activeEvent';

/**
 * True once the active event's last day has fully passed. Accra runs on
 * UTC all year, so the end date's midnight-to-midnight day is UTC.
 *
 * The public site flips to post-event mode off this alone — ticket sales,
 * athlete registration and the "come to the event" calls to action switch
 * off, and the gallery takes their place. Setting a new active event with
 * future dates in the admin flips everything back.
 *
 * Call it on the server (pages are force-dynamic) and pass the result
 * down, so client components never compare against their own clock.
 */
export function isEventOver(event: Pick<WffEvent, 'start_date' | 'end_date'> | null | undefined, now = Date.now()): boolean {
  const last = event?.end_date || event?.start_date;
  if (!last) return false;
  const endOfLastDay = new Date(`${last}T23:59:59Z`).getTime();
  return !Number.isNaN(endOfLastDay) && now > endOfLastDay;
}
