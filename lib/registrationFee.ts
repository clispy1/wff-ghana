/**
 * Athlete entry fee. Priced in USD with a Ghanaian and a foreign rate;
 * Paystack charges the cedi equivalent at an admin-set exchange rate,
 * because a Ghana Paystack account can't reliably charge in USD.
 *
 * Stored in site_content under key 'registration_fee' and edited from
 * /admin/settings. Shared by the form (display) and the checkout route
 * (the amount actually charged) so the two can never disagree.
 */

export type RegistrationFeeConfig = {
  ghanaian_usd: number;
  foreign_usd: number;
  /** Cedis per US dollar. null until an admin sets it. */
  usd_to_ghs: number | null;
};

export const DEFAULT_REGISTRATION_FEE: RegistrationFeeConfig = {
  ghanaian_usd: 50,
  foreign_usd: 100,
  usd_to_ghs: null,
};

const positive = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function parseRegistrationFee(value: unknown): RegistrationFeeConfig {
  const v = (value ?? {}) as Record<string, unknown>;
  return {
    ghanaian_usd: positive(v.ghanaian_usd) ?? DEFAULT_REGISTRATION_FEE.ghanaian_usd,
    foreign_usd: positive(v.foreign_usd) ?? DEFAULT_REGISTRATION_FEE.foreign_usd,
    usd_to_ghs: positive(v.usd_to_ghs),
  };
}

const isGhana = (v?: string | null) => {
  const s = (v || '').trim().toLowerCase();
  return s === 'ghana' || s === 'ghanaian';
};

/** Ghanaian rate applies if the athlete is Ghanaian OR represents Ghana. */
export function isGhanaianRate(nationality?: string | null, countryRepresenting?: string | null) {
  return isGhana(nationality) || isGhana(countryRepresenting);
}

export function feeFor(config: RegistrationFeeConfig, ghanaian: boolean) {
  const usd = ghanaian ? config.ghanaian_usd : config.foreign_usd;
  const ghs = config.usd_to_ghs ? Math.round(usd * config.usd_to_ghs * 100) / 100 : null;
  return { usd, ghs };
}
