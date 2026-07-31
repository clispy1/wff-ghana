-- WFF GHANA — GALLERY MEDIA
--
-- Run this ONCE in the Supabase SQL Editor, AFTER supabase_backend.sql.
--
-- Replaces two separate hardcoded photo arrays — 4 stock photos baked
-- into the homepage's "Chapter Media" section, and 8 more (pointing at
-- /award-*.jpg / /culture-*.jpg files that don't actually exist in
-- public/, so they were silently 404ing to a placeholder) baked into
-- the /media page — with one real table both pages read from. The
-- homepage shows the first few (newest first); /media shows all of
-- them. Add, remove, or reorder photos once, from Admin -> Gallery,
-- and both pages stay in sync.

CREATE TABLE IF NOT EXISTS public.gallery_media (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url      TEXT NOT NULL,
    caption        TEXT,
    display_order  INT NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access Gallery" ON public.gallery_media;
CREATE POLICY "Public Read Access Gallery" ON public.gallery_media
    FOR SELECT TO public, anon USING (true);

DROP POLICY IF EXISTS "Admin manage gallery_media" ON public.gallery_media;
CREATE POLICY "Admin manage gallery_media" ON public.gallery_media
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Idempotent — only seeds placeholder photos if the table is empty, so
-- re-running this never overwrites photos an admin has already added.
INSERT INTO public.gallery_media (image_url, caption, display_order)
SELECT * FROM (VALUES
    ('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop', 'Training Floor', 0),
    ('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop', 'Stage Preparation', 1),
    ('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop', 'Athlete Focus', 2),
    ('https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop', 'Championship Gear', 3),
    ('https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop', 'Team Ghana', 4),
    ('https://images.unsplash.com/photo-1584865288642-42078afe6942?q=80&w=800&auto=format&fit=crop', 'Competition Prep', 5),
    ('https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop', 'Official Merchandise', 6),
    ('https://images.unsplash.com/photo-1540039155732-6761b54f228a?q=80&w=800&auto=format&fit=crop', 'Fan Zone', 7)
) AS seed(image_url, caption, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_media);
