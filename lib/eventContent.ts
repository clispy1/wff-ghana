import { supabase } from './supabase';
import { formatEventDate } from './activeEvent';

/**
 * Everything on /championship and /info that isn't the athlete roster,
 * ticket tiers, or the active event's own row (title/dates/venue —
 * see lib/activeEvent.ts). Both pages render the SAME schedule and
 * logistics content so they can never drift out of sync the way the
 * old hardcoded copies did.
 */

export interface ScheduleBlock {
  /** e.g. "10:00 - 18:00" for a single timed item, or "Morning Session"
   *  as a heading over several items. */
  label: string;
  items: string[];
}

export interface ScheduleDay {
  /** ISO date ('2026-10-02'). Drives the weekday + formatted date shown
   *  in the day heading — never type "Friday, Oct 2" into dayTitle
   *  itself, or the header goes stale exactly like the old hardcoded
   *  copy did. */
  date: string;
  dayTitle: string;
  /** Overrides the event's main venue for this day only — e.g. the
   *  weigh-in happening at a different venue than the main stage. */
  venueName?: string;
  venueLocation?: string;
  blocks: ScheduleBlock[];
}

/** "Friday, 2 October 2026 — Registration & Official Weigh-In" */
export function formatScheduleDayHeading(day: Pick<ScheduleDay, 'date' | 'dayTitle'>): string {
  const parsed = new Date(`${day.date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return day.dayTitle;

  const weekday = parsed.toLocaleDateString('en-GB', { weekday: 'long' });
  return `${weekday}, ${formatEventDate(day.date)} — ${day.dayTitle}`;
}

export interface EventScheduleContent {
  days: ScheduleDay[];
}

export interface EventLogisticsContent {
  hostNationName: string;
  hostNationTagline: string;
  airportIntro: string;
  transportNote: string;
  visaNote: string;
  yellowFeverNote: string;
  hotelIntro: string;
  hotelDiscountCode: string;
  pdfUrl: string;
}

export interface AwardItem {
  title: string;
  description: string;
}

export interface EventAwardsContent {
  items: AwardItem[];
}

export interface EventPageContent {
  schedule: EventScheduleContent;
  logistics: EventLogisticsContent;
  awards: EventAwardsContent;
}

export const EVENT_CONTENT_DEFAULTS: EventPageContent = {
  schedule: {
    days: [
      {
        date: '2026-10-02',
        dayTitle: 'Registration & Official Weigh-In',
        venueName: 'Borteyman Sports Complex',
        venueLocation: 'Accra, Ghana',
        blocks: [
          { label: '10:00 - 18:00', items: ['Athlete Check-in, Weigh-in & Height Measurement'] },
          { label: '15:00 - 16:30', items: ['WFF Africa Certified Judges Seminar'] },
          { label: '19:00 - 20:30', items: ['Official Press Conference & Meet-and-Greet'] },
        ],
      },
      {
        date: '2026-10-03',
        dayTitle: 'Show Day 1 (Amateur & Pro Qualifier)',
        blocks: [
          {
            label: 'Morning Session - 09:00 AM',
            items: [
              "Women's Aerobics / Fitness Modeling",
              "Men's Beach Model (Juniors, Open & Masters)",
              "Women's Sports Modeling",
              "Men's Sports Modeling",
              "Women's Bikini (Short, Tall & Masters Divisions)",
            ],
          },
          {
            label: 'Afternoon Session - 02:00 PM',
            items: [
              "Men's Fitness Division",
              "Women's Figure Championships",
              "Men's Performance Class",
              "Women's Physique Line-ups",
              "Men's Athletic Showdown",
              "Men's Superbody Grand Prix",
              "Men's Extreme Bodybuilding Overall",
            ],
          },
        ],
      },
      {
        date: '2026-10-04',
        dayTitle: 'Show Day 2 (Pro Division & Overall Awards)',
        blocks: [
          { label: '12:00 PM', items: ['Overall Amateur Line-ups & Pro Card Convocations'] },
          { label: '03:00 PM', items: ['WFF Pro Division (Bikini & Sports Model)'] },
          { label: '05:30 PM', items: ["WFF Pro Division (Men's Bodybuilding)"] },
          { label: '08:00 PM', items: ['Championship Celebration Banquet'] },
        ],
      },
    ],
  },
  logistics: {
    hostNationName: 'WFF Ghana',
    hostNationTagline: 'World Fitness Federation',
    airportIntro:
      'All international delegates should fly into Kotoka International Airport (ACC), located directly in Accra. Official WFF shuttles operate for pre-booked athletes landing between 08:00 and 22:00.',
    transportNote:
      'Uber, Bolt, and Yango operate reliably in Accra for those arriving outside shuttle hours or preferring private transport.',
    visaNote:
      'Members of the African Union (AU) and ECOWAS qualify for Visa on Arrival or visa-free entry. Other federations must apply for an e-Visa or consult their local Ghanaian consulate in advance. Invitations will be provided by WFF Ghana upon registration.',
    yellowFeverNote:
      'Proof of Yellow Fever vaccination is mandatory for entry into Ghana. Carry your yellow booklet with your passport.',
    hotelIntro:
      'We have partnered with leading highly-rated properties in the immediate vicinity of Kotoka International Airport, offering custom-curated food prep packages and airport shuttle channels. These provide the utmost comfort for peak-week prep and have discounted rates when using the code below.',
    hotelDiscountCode: 'WFF2026',
    pdfUrl: '/info.pdf',
  },
  awards: {
    items: [
      {
        title: 'Amateur Titles',
        description:
          'The top 3 athletes in every amateur division will receive the official custom forged All Africa Championship Medals.',
      },
      {
        title: 'Pro Status',
        description:
          'Overall Winners of their respective divisions (e.g. Overall Bikini, Overall Bodybuilding) will be awarded the prestigious WFF Pro Card.',
      },
      {
        title: 'Pro Division',
        description:
          'Competitors in the Pro line-up will battle for substantial cash prizes, the Championship Belts, and legacy qualification.',
      },
    ],
  },
};

export const EVENT_CONTENT_KEYS: Record<keyof EventPageContent, string> = {
  schedule: 'event_schedule',
  logistics: 'event_logistics',
  awards: 'event_awards',
};

/**
 * Loads all three keys and layers them over EVENT_CONTENT_DEFAULTS.
 * A missing row (migration not run, or deleted) falls back to its
 * default rather than leaving a section blank.
 */
export async function fetchEventPageContent(): Promise<EventPageContent> {
  const keys = Object.values(EVENT_CONTENT_KEYS);
  const { data, error } = await supabase.from('site_content').select('key, value').in('key', keys);

  if (error || !data) {
    if (error) console.error('Could not load event page content:', error.message);
    return EVENT_CONTENT_DEFAULTS;
  }

  const byKey = new Map(data.map((row) => [row.key, row.value]));
  const result = { ...EVENT_CONTENT_DEFAULTS };

  (Object.keys(EVENT_CONTENT_KEYS) as (keyof EventPageContent)[]).forEach((section) => {
    const value = byKey.get(EVENT_CONTENT_KEYS[section]);
    if (value) {
      result[section] = { ...result[section], ...value } as any;
    }
  });

  return result;
}

/** Upserts one section. Used by the admin editor — one save per card. */
export async function saveEventContentSection<K extends keyof EventPageContent>(
  section: K,
  value: EventPageContent[K],
) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key: EVENT_CONTENT_KEYS[section], value, updated_at: new Date().toISOString() });

  if (error) throw error;
}
