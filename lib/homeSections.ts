import { supabase } from './supabase';

/**
 * Admin-controlled section visibility for the homepage.
 *
 * Stored as a single JSONB row in site_content (key
 * `home_sections_visibility`) so it reuses the existing public-read /
 * admin-write RLS on that table. The row can be missing entirely
 * (migration not run, or admin never saved) — every section then
 * defaults to ON so the page renders exactly as it always has.
 *
 * The hero is deliberately not listed: it is the page's entry point and
 * is always rendered.
 */

export interface HomeSectionVisibility {
  sponsorsMarquee: boolean;
  federation: boolean;
  journey: boolean;
  championship: boolean;
  rulebook: boolean;
  divisions: boolean;
  wellness: boolean;
  armory: boolean;
  gallery: boolean;
  news: boolean;
  partnerships: boolean;
  becomeVendor: boolean;
  vendors: boolean;
  finalCta: boolean;
}

export const HOME_SECTION_KEY = 'home_sections_visibility';

export const HOME_SECTION_DEFAULTS: HomeSectionVisibility = {
  sponsorsMarquee: true,
  federation: true,
  journey: true,
  championship: true,
  rulebook: true,
  divisions: true,
  wellness: true,
  armory: true,
  gallery: true,
  news: true,
  partnerships: true,
  becomeVendor: true,
  vendors: true,
  finalCta: true,
};

export const HOME_SECTION_META: Record<
  keyof HomeSectionVisibility,
  { label: string; hint: string }
> = {
  sponsorsMarquee: {
    label: 'Sponsors Marquee',
    hint: 'Animated partner strip directly below the hero.',
  },
  federation: {
    label: 'Federation & President',
    hint: 'The president photo, quote and federation body copy.',
  },
  journey: {
    label: 'The Journey',
    hint: 'The five-panel bento story grid.',
  },
  championship: {
    label: 'Championship Details',
    hint: 'Categories, prize and venue cards (uses the live event when one is active).',
  },
  rulebook: {
    label: 'Continental Rulebook',
    hint: 'The World Championships division rules panel.',
  },
  divisions: {
    label: 'Division Registry',
    hint: 'The Founding Embassy division slot cards.',
  },
  wellness: {
    label: 'Wellness & Physiology',
    hint: 'The rest & physiology banner.',
  },
  armory: {
    label: 'Merchandise Shop',
    hint: 'Product grid from the Armory.',
  },
  gallery: {
    label: 'Media & Gallery',
    hint: 'Latest gallery photos.',
  },
  news: {
    label: 'News Chronicle',
    hint: 'Latest news articles.',
  },
  partnerships: {
    label: 'Partnerships',
    hint: 'Affiliation & sector partner CTA.',
  },
  becomeVendor: {
    label: 'Become a Vendor',
    hint: 'The vendor pitch with benefits and the apply CTA.',
  },
  vendors: {
    label: 'Event Vendors',
    hint: 'Approved vendor directory block.',
  },
  finalCta: {
    label: 'Final CTA',
    hint: 'The bottom "READY FOR THE STAGE?" call to action.',
  },
};

/**
 * Loads the section-visibility row, layered over HOME_SECTION_DEFAULTS.
 * Used by both the admin editor (browser client, via default) and the
 * public homepage (server client, passed in) — a missing row defaults to
 * "everything on", which is safe for public rendering.
 */
export async function fetchHomeSectionVisibility(
  db: { from: typeof supabase.from } = supabase,
): Promise<HomeSectionVisibility> {
  const { data } = await db
    .from('site_content')
    .select('value')
    .eq('key', HOME_SECTION_KEY)
    .maybeSingle();

  if (!data?.value) return { ...HOME_SECTION_DEFAULTS };
  return { ...HOME_SECTION_DEFAULTS, ...(data.value as Partial<HomeSectionVisibility>) };
}

/** Upserts the whole visibility row. Used by the admin editor. */
export async function saveHomeSectionVisibility(value: HomeSectionVisibility) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key: HOME_SECTION_KEY, value, updated_at: new Date().toISOString() });

  if (error) throw error;
}
