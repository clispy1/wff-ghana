/**
 * An athlete can enter up to 3 categories. The full list lives in
 * registrations.entries; category/division hold the first pick, and
 * are all that rows from before multi-category entry have.
 */

export type RegistrationEntry = { category: string; division: string | null };

type RegistrationLike = {
  entries?: unknown;
  category?: string | null;
  division?: string | null;
};

export function registrationEntries(reg: RegistrationLike): RegistrationEntry[] {
  if (Array.isArray(reg.entries) && reg.entries.length > 0) {
    return (reg.entries as RegistrationEntry[]).filter(e => e?.category);
  }
  return reg.category ? [{ category: reg.category, division: reg.division ?? null }] : [];
}

/** "Men's Physique (Short), Bikini (Open)" — for SMS and short labels. */
export function formatEntries(reg: RegistrationLike): string {
  return registrationEntries(reg)
    .map(e => (e.division ? `${e.category} (${e.division})` : e.category))
    .join(', ');
}
