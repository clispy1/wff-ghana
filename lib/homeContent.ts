import { supabase } from './supabase';

/**
 * Homepage copy that used to be hardcoded in HOME_DATA_CONFIG
 * (app/page.tsx), now editable from Admin -> Homepage Content.
 *
 * Each section is stored as one row in site_content, keyed by the
 * `home_*` keys below. Internal link targets (hrefs) are deliberately
 * NOT part of this content — they stay hardcoded in the JSX — so an
 * admin editing copy can never break site navigation.
 */

export interface JourneyItem {
  title: string;
  subtitle: string;
  type: 'image' | 'video';
  src: string;
}

export interface AmbassadorItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  badge: string;
}


export interface HomeContent {
  president: {
    title: string;
    quote: string;
    body1: string;
    body2: string;
    cta: { text: string };
    president: { name: string; role: string; image: string };
  };
  journey: { items: JourneyItem[] };
  championship: {
    supertitle: string;
    title: string;
    description: string;
    categoriesTitle: string;
    categories: string[];
    stakesTitle: string;
    stakesDescription: string;
    stakesBadge: string;
    venueTitle: string;
    venueLocation: string;
    venueDetails: string;
    ctas: { tickets: { text: string }; register: { text: string } };
  };
  ambassadors: {
    title: string;
    subtitle: string;
    description: string;
    items: AmbassadorItem[];
    cta: { text: string };
  };
  wellness: { supertitle: string; title: string; body: string; cta: { text: string } };
  armory: { supertitle: string; title: string };
  gallery: { supertitle: string; title: string };
  news: { title: string };
  partnerships: { title: string; body: string; cta: { text: string } };
  becomeVendor: {
    supertitle: string;
    title: string;
    body: string;
    benefits: string[];
    image: string;
    cta: { text: string };
  };
  contactCta: { title: string; passesBtn: { text: string }; contactBtn: { text: string } };
}

/**
 * Fallback copy. Used until the database responds, and for any section
 * an admin hasn't edited (or if supabase_homepage_content.sql was never
 * run) — the page always renders something sensible either way.
 */
export const HOME_CONTENT_DEFAULTS: HomeContent = {
  president: {
    title: 'THE FEDERATION',
    quote:
      'Our vision is to provide a world-class platform for Ghanaian athletes to showcase their hard work, dedication, and aesthetic excellence on the global stage.',
    body1:
      'World Fitness Federation (WFF) Ghana is the premier destination for aesthetic and athletic excellence. We are bringing the global standard of bodybuilding and fitness modeling to the heart of West Africa, ensuring fair judging, athlete welfare, and community building.',
    body2:
      'Under authorized international rules, the inaugural chapter serves as the key pathway for outstanding local athletes to represent Ghana globally.',
    cta: { text: 'Discover Our Alliance' },
    president: {
      name: 'VICTOR AHENKORAH BAIDEN',
      role: 'President, WFF Ghana',
      image: '/wff-president.jpg',
    },
  },
  journey: {
    items: [
      {
        title: 'FOUNDATION',
        subtitle: 'COMMIT TO THE SANCTUARY OF IRON.',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop',
      },
      {
        title: 'INTENSITY',
        subtitle: 'EVERY REP SHAPES YOUR DESTINY.',
        type: 'video',
        src: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-with-heavy-ropes-in-the-gym-23450-large.mp4',
      },
      {
        title: 'DISCIPLINE',
        subtitle: 'SACRIFICE IN SILENCE, SHINE ON STAGE.',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
      },
      {
        title: 'STAGE',
        subtitle: 'THE ULTIMATE CONTINENTAL STAGE.',
        type: 'video',
        src: 'https://assets.mixkit.co/videos/preview/mixkit-silhouette-of-a-bodybuilder-flexing-his-muscles-41717-large.mp4',
      },
      {
        title: 'ASCENSION',
        subtitle: 'EARN REST, SEIZE GLORY.',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
      },
    ],
  },
  championship: {
    supertitle: 'UPCOMING INAUGURAL EVENT',
    title: 'THE INAUGURAL SHOWDOWN',
    description:
      'The premier battleground for West African natural aesthetics. Register to compete for official WFF International classifications, global pro-am credentials, and direct invitations to world-tier stages.',
    categoriesTitle: 'COMPETITION CLASSES',
    categories: [
      "Men's Bodybuilding (Open Weight)",
      "Men's Physique (Height Classes)",
      'Classic Physique (Symmetry Ratio)',
      "Women's Bikini & Wellness Divisions",
    ],
    stakesTitle: 'THE PRIZE',
    stakesDescription:
      'Overall segment champions receive standard-accredited WFF Pro Status, opening doors to represent Ghana at world-class events in Europe, Asia, and the Americas.',
    stakesBadge: 'Certified Medals • Pro Cards • Global Standings',
    venueTitle: 'UPSA AUDITORIUM',
    venueLocation: 'Madina East, Accra, Ghana',
    venueDetails:
      "Accra's state-of-the-art national-scale auditorium with premium production, professional athlete staging, and fully designed modern theater feedback.",
    ctas: {
      tickets: { text: 'SECURE PASSES' },
      register: { text: 'REGISTER TO COMPETE' },
    },
  },
  ambassadors: {
    title: 'FOUNDING EMBASSY',
    subtitle: 'Authorized Division Categories & Slots',
    description:
      'We are establishing pristine competition segments. Competitors may request official slot registration for specific athletic divisions below:',
    items: [
      {
        id: 'amb-1',
        title: 'AESTHETICS',
        desc: 'Symmetry, Proportion & Conditioning',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
        badge: "Men's Physique Slot",
      },
      {
        id: 'amb-2',
        title: 'CLASSIC',
        desc: 'Mass, Structure & Stage Carriage',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
        badge: 'Classic Bodybuilding Slot',
      },
      {
        id: 'amb-3',
        title: 'WELLNESS',
        desc: 'Balance, Muscle Tone & Presentation',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
        badge: "Women's Wellness Slot",
      },
    ],
    cta: { text: 'Apply For Stage Access' },
  },
  wellness: {
    supertitle: 'SUSTAIN THE BODY',
    title: 'WELLNESS & PHYSIOLOGY',
    body: 'Peak athleticism requires supreme physical calibration. Our official guidance covers holistic training protocols, strict natural supplement directives, and structured athletic restoration programs.',
    cta: { text: 'Explore Wellness Programs' },
  },
  armory: {
    supertitle: 'OFFICIAL CHAPTER GEAR',
    title: 'THE ARMORY',
  },
  gallery: {
    supertitle: 'AUTHORIZED LOGS',
    title: 'CHAPTER MEDIA',
  },
  news: {
    title: 'OFFICIAL CHRONICLES',
  },
  partnerships: {
    title: 'AFFILIATION & SECTOR PARTNERS',
    body: 'Secure direct alignment with peak athletic lifestyles and highly disciplined consumer demographics in Accra, Kumasi, and West Africa.',
    cta: { text: 'Discover Sponsorship Tiers' },
  },
  becomeVendor: {
    supertitle: 'OFFICIAL EVENT SUPPLIERS',
    title: 'BECOME A VENDOR',
    body: 'WFF Ghana is assembling the official supplier base for the 2026 All Africa Bodybuilding Championship in Accra. Secure a vendor slot to put your business in front of athletes, spectators, and partners from across West Africa.',
    benefits: [
      'Prime booth placement at the championship venue',
      'Direct exposure to athletes, fans and media',
      'Flexible package tiers with one festival fee',
      'Official listing in the event vendor directory',
    ],
    image: '',
    cta: { text: 'APPLY TO BECOME A VENDOR' },
  },
  contactCta: {
    title: 'READY FOR GLORY?',
    passesBtn: { text: 'REGISTER TO COMPETE' },
    contactBtn: { text: 'CONTACT OFFICIALS' },
  },
};

/** site_content.key -> HomeContent section, both directions. */
export const HOME_CONTENT_KEYS: Record<keyof HomeContent, string> = {
  president: 'home_president',
  journey: 'home_journey',
  championship: 'home_championship',
  ambassadors: 'home_ambassadors',
  wellness: 'home_wellness',
  armory: 'home_armory',
  gallery: 'home_gallery',
  news: 'home_news',
  partnerships: 'home_partnerships',
  becomeVendor: 'home_become_vendor',
  contactCta: 'home_contact_cta',
};

/**
 * Loads every home_* row and layers it over HOME_CONTENT_DEFAULTS.
 * A section missing from the database (migration not run yet, or the
 * row was deleted) silently falls back to its default rather than
 * blanking that part of the page.
 *
 * Used by the admin editor, where a missing section should still show
 * the default copy to edit from. The public site must NOT use this —
 * it must use fetchPublicHomeContent so no marketing defaults leak.
 */
export async function fetchHomeContent(): Promise<HomeContent> {
  const keys = Object.values(HOME_CONTENT_KEYS);
  const { data, error } = await supabase.from('site_content').select('key, value').in('key', keys);

  if (error || !data) {
    if (error) console.error('Could not load homepage content:', error.message);
    return HOME_CONTENT_DEFAULTS;
  }

  const byKey = new Map(data.map((row) => [row.key, row.value]));
  const result = { ...HOME_CONTENT_DEFAULTS };

  (Object.keys(HOME_CONTENT_KEYS) as (keyof HomeContent)[]).forEach((section) => {
    const value = byKey.get(HOME_CONTENT_KEYS[section]);
    if (value) {
      result[section] = { ...result[section], ...value } as any;
    }
  });

  return result;
}

/**
 * Server-side loader for the public homepage. Returns ONLY the sections
 * an admin has actually saved — no marketing defaults. A missing section
 * renders a skeleton on the page until the admin populates it.
 */
export async function fetchPublicHomeContent(
  db: { from: typeof supabase.from } = supabase,
): Promise<Partial<HomeContent>> {
  const keys = Object.values(HOME_CONTENT_KEYS);
  const { data, error } = await db.from('site_content').select('key, value').in('key', keys);

  if (error || !data) return {};

  const byKey = new Map(data.map((row) => [row.key, row.value]));
  const result: Record<string, unknown> = {};

  (Object.keys(HOME_CONTENT_KEYS) as (keyof HomeContent)[]).forEach((section) => {
    const value = byKey.get(HOME_CONTENT_KEYS[section]);
    if (value) result[section] = value;
  });

  return result as Partial<HomeContent>;
}

/** Upserts one section. Used by the admin editor — one save per card. */
export async function saveHomeContentSection<K extends keyof HomeContent>(
  section: K,
  value: HomeContent[K],
) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key: HOME_CONTENT_KEYS[section], value, updated_at: new Date().toISOString() });

  if (error) throw error;
}
