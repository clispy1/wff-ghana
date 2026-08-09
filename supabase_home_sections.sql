------------------------------------------------------------------
-- WFF GHANA — HOMEPAGE SECTION VISIBILITY
--
-- Run this ONCE in the Supabase SQL Editor, AFTER supabase_homepage_content.sql.
--
-- Adds the site_content row that controls which homepage sections
-- render on the public site (managed from Admin -> Homepage Content ->
-- Section Visibility). The homepage also defaults every section to ON
-- when this row is missing, so the migration is optional — running it
-- just seeds the admin toggle state explicitly.
--
-- Idempotent: safe to re-run. Will NOT overwrite toggles an admin has
-- already set (ON CONFLICT DO NOTHING).
------------------------------------------------------------------

INSERT INTO public.site_content (key, value) VALUES
('home_sections_visibility', '{
  "sponsorsMarquee": true,
  "federation": true,
  "journey": true,
  "championship": true,
  "rulebook": true,
  "divisions": true,
  "wellness": true,
  "armory": true,
  "gallery": true,
  "news": true,
  "partnerships": true,
  "becomeVendor": true,
  "vendors": true,
  "finalCta": true
}')

ON CONFLICT (key) DO NOTHING;
