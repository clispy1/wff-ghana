------------------------------------------------------------------
-- WFF GHANA — PHASE 2 BACKEND
--
-- Run this ONCE in the Supabase SQL Editor, AFTER supabase_setup.sql.
-- It supersedes admin_rls.sql (that file's permissive "any logged-in
-- user is an admin" policies are dropped and replaced here).
--
-- It is idempotent: safe to re-run.
--
-- !! AFTER RUNNING: scroll to the bottom and follow STEP FINAL to
-- !! grant yourself admin access, or nobody can log into /admin.
------------------------------------------------------------------


------------------------------------------------------------------
-- 1. ADMIN IDENTITY
------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email      TEXT,
    role       TEXT NOT NULL DEFAULT 'admin', -- 'admin' | 'super_admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER so the check itself bypasses RLS on admin_users
-- (otherwise every policy that calls it would recurse).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

DROP POLICY IF EXISTS "Admins read admin list" ON public.admin_users;
CREATE POLICY "Admins read admin list" ON public.admin_users
    FOR SELECT TO authenticated USING (public.is_admin());

-- Note: no INSERT/UPDATE/DELETE policy on purpose. Admins are added
-- via the SQL editor or the service-role key only — an admin cannot
-- silently promote someone from the dashboard.


------------------------------------------------------------------
-- 2. SCHEMA ADDITIONS
------------------------------------------------------------------

-- 2a. Registrations: payment + audit columns
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS fee_amount     NUMERIC(10,2);
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS currency       TEXT DEFAULT 'GHS';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS paid_at        TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS reviewed_at    TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS review_notes   TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS audio_track_url TEXT;

-- 2b. Contact form
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT,
    subject    TEXT,
    message    TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'new', -- 'new' | 'read' | 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2c. Merchandise orders
CREATE TABLE IF NOT EXISTS public.shop_orders (
    id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reference          TEXT UNIQUE NOT NULL,
    buyer_name         TEXT NOT NULL,
    buyer_email        TEXT NOT NULL,
    buyer_phone        TEXT,
    shipping_address   TEXT,
    shipping_city      TEXT,
    shipping_country   TEXT,
    subtotal           NUMERIC(10,2) NOT NULL,
    shipping_fee       NUMERIC(10,2) NOT NULL DEFAULT 0,
    total              NUMERIC(10,2) NOT NULL,
    currency           TEXT NOT NULL DEFAULT 'GHS',
    payment_status     TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'paid' | 'failed'
    fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled',
    paystack_ref       TEXT,
    paid_at            TIMESTAMP WITH TIME ZONE,
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.shop_order_items (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id     UUID NOT NULL REFERENCES public.shop_orders(id) ON DELETE CASCADE,
    product_id   UUID REFERENCES public.ecommerce_products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    unit_price   NUMERIC(10,2) NOT NULL,
    quantity     INTEGER NOT NULL CHECK (quantity > 0),
    line_total   NUMERIC(10,2) NOT NULL,
    size         TEXT
);

-- 2d. Ticket orders: bring up to parity with shop orders
ALTER TABLE public.ticket_orders ADD COLUMN IF NOT EXISTS reference    TEXT;
ALTER TABLE public.ticket_orders ADD COLUMN IF NOT EXISTS buyer_phone  TEXT;
ALTER TABLE public.ticket_orders ADD COLUMN IF NOT EXISTS unit_price   NUMERIC(10,2);
ALTER TABLE public.ticket_orders ADD COLUMN IF NOT EXISTS total        NUMERIC(10,2);
ALTER TABLE public.ticket_orders ADD COLUMN IF NOT EXISTS currency     TEXT DEFAULT 'GHS';
ALTER TABLE public.ticket_orders ADD COLUMN IF NOT EXISTS paystack_ref TEXT;
ALTER TABLE public.ticket_orders ADD COLUMN IF NOT EXISTS paid_at      TIMESTAMP WITH TIME ZONE;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ticket_orders_reference_key'
    ) THEN
        ALTER TABLE public.ticket_orders ADD CONSTRAINT ticket_orders_reference_key UNIQUE (reference);
    END IF;
END $$;

-- 2e. Central payment ledger. Every Paystack transaction lands here
--     first; the webhook uses `purpose` + `related_id` to decide which
--     order/registration row to mark paid.
CREATE TABLE IF NOT EXISTS public.payments (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reference    TEXT UNIQUE NOT NULL,
    purpose      TEXT NOT NULL,          -- 'registration' | 'shop' | 'ticket'
    related_id   UUID,
    amount       NUMERIC(10,2) NOT NULL, -- major units (GHS), not pesewas
    currency     TEXT NOT NULL DEFAULT 'GHS',
    status       TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'success' | 'failed'
    customer_email TEXT,
    channel      TEXT,
    gateway_response TEXT,
    raw          JSONB,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    verified_at  TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_payments_related      ON public.payments(purpose, related_id);
CREATE INDEX IF NOT EXISTS idx_shop_order_items_ord  ON public.shop_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status  ON public.registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_registrations_created ON public.registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_divisions_category    ON public.divisions(category_id);
CREATE INDEX IF NOT EXISTS idx_schedules_event       ON public.event_schedules(event_id);
CREATE INDEX IF NOT EXISTS idx_accommodations_event  ON public.accommodations(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_tiers_event    ON public.ticket_tiers(event_id);
CREATE INDEX IF NOT EXISTS idx_achievements_athlete  ON public.athlete_achievements(athlete_id);


------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY — REBUILT
--
-- Drops the old "TO authenticated USING (true)" policies from
-- admin_rls.sql and replaces every one with an is_admin() check.
------------------------------------------------------------------

ALTER TABLE public.contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_order_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments          ENABLE ROW LEVEL SECURITY;

-- 3a. Remove the old blanket-admin policies
DROP POLICY IF EXISTS "Admin All Access Events"         ON public.events;
DROP POLICY IF EXISTS "Admin All Access Staff"          ON public.federation_staff;
DROP POLICY IF EXISTS "Admin All Access Sponsors"       ON public.sponsors;
DROP POLICY IF EXISTS "Admin All Access News"           ON public.news_articles;
DROP POLICY IF EXISTS "Admin All Access Accommodations" ON public.accommodations;
DROP POLICY IF EXISTS "Admin All Access Memberships"    ON public.memberships;
DROP POLICY IF EXISTS "Admin All Access Ticket Tiers"   ON public.ticket_tiers;
DROP POLICY IF EXISTS "Admin All Access Products"       ON public.ecommerce_products;
DROP POLICY IF EXISTS "Admin All Access Registrations"  ON public.registrations;

-- 3b. Admin write access, gated on membership in admin_users
DO $$
DECLARE t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'events', 'federation_staff', 'sponsors', 'news_articles',
        'categories', 'divisions', 'event_schedules', 'accommodations',
        'memberships', 'athlete_achievements', 'ticket_tiers',
        'ticket_orders', 'ecommerce_products', 'registrations',
        'contact_messages', 'shop_orders', 'shop_order_items', 'payments'
    ]
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Admin manage ' || t, t);
        EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
            'Admin manage ' || t, t
        );
    END LOOP;
END $$;

-- 3c. Public read stays on CMS/content tables only.
--     Make sure it was never granted on anything sensitive.
DROP POLICY IF EXISTS "Public Read Access Registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public Read Access Orders"        ON public.ticket_orders;

-- Missing read policies from the original setup
DROP POLICY IF EXISTS "Public Read Access Events Schedules" ON public.event_schedules;

-- 3d. Anonymous registration submissions are still allowed, but an
--     applicant can no longer declare themselves paid or approved.
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.registrations;
CREATE POLICY "Anon submit registration" ON public.registrations
    FOR INSERT TO public, anon
    WITH CHECK (
        COALESCE(registration_status, 'pending') = 'pending'
        AND COALESCE(fee_paid_status, 'pending') = 'pending'
        AND paid_at IS NULL
    );

-- 3e. Orders and payments are written by the server (service role key)
--     only. The service role bypasses RLS, so no anon policy is needed —
--     and removing the old one closes the "anyone can forge a paid
--     order" hole.
DROP POLICY IF EXISTS "Enable insert for anonymous users Orders" ON public.ticket_orders;

-- 3f. Contact form: anyone may write, only admins may read.
DROP POLICY IF EXISTS "Anon submit contact message" ON public.contact_messages;
CREATE POLICY "Anon submit contact message" ON public.contact_messages
    FOR INSERT TO public, anon
    WITH CHECK (status = 'new');


------------------------------------------------------------------
-- 4. STORAGE
--
-- athlete-documents holds passport scans and national IDs. It was
-- public-read, which exposed every applicant's identity documents to
-- anyone with the URL. It is now private; the admin dashboard reads it
-- through short-lived signed URLs.
------------------------------------------------------------------

UPDATE storage.buckets SET public = false WHERE id = 'athlete-documents';

DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Uploads"     ON storage.objects;

-- Applicants (anon) may upload, but only into the registrations/ prefix
-- and never read, list, overwrite or delete.
CREATE POLICY "Anon upload athlete docs" ON storage.objects
    FOR INSERT TO public, anon
    WITH CHECK (
        bucket_id = 'athlete-documents'
        AND (storage.foldername(name))[1] = 'registrations'
    );

CREATE POLICY "Admin read athlete docs" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'athlete-documents' AND public.is_admin());

CREATE POLICY "Admin manage athlete docs" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'athlete-documents' AND public.is_admin());

-- Public CMS media (product shots, sponsor logos, staff headshots,
-- news images) lives in its own genuinely-public bucket.
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-media', 'public-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read media"  ON storage.objects;
DROP POLICY IF EXISTS "Admin write media"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete media" ON storage.objects;

CREATE POLICY "Public read media" ON storage.objects
    FOR SELECT TO public, anon, authenticated
    USING (bucket_id = 'public-media');

CREATE POLICY "Admin write media" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'public-media' AND public.is_admin());

CREATE POLICY "Admin update media" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'public-media' AND public.is_admin());

CREATE POLICY "Admin delete media" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'public-media' AND public.is_admin());


------------------------------------------------------------------
-- 5. DASHBOARD COUNTS
--
-- The dashboard needs totals across tables the anon key cannot read.
-- One SECURITY DEFINER function, admin-gated, avoids shipping a dozen
-- count queries to the browser.
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE result JSON;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'not authorized';
    END IF;

    SELECT json_build_object(
        'registrations_total',    (SELECT COUNT(*) FROM public.registrations),
        'registrations_pending',  (SELECT COUNT(*) FROM public.registrations WHERE COALESCE(registration_status,'pending') = 'pending'),
        'registrations_approved', (SELECT COUNT(*) FROM public.registrations WHERE registration_status = 'approved'),
        'registrations_week',     (SELECT COUNT(*) FROM public.registrations WHERE created_at > now() - interval '7 days'),
        'events_active',          (SELECT COUNT(*) FROM public.events WHERE is_active),
        'next_event',             (SELECT title FROM public.events WHERE is_active ORDER BY start_date LIMIT 1),
        'products_total',         (SELECT COUNT(*) FROM public.ecommerce_products),
        'tickets_sold',           (SELECT COALESCE(SUM(quantity),0) FROM public.ticket_orders WHERE payment_status = 'paid'),
        'shop_orders_paid',       (SELECT COUNT(*) FROM public.shop_orders WHERE payment_status = 'paid'),
        'revenue_total',          (SELECT COALESCE(SUM(amount),0) FROM public.payments WHERE status = 'success'),
        'messages_unread',        (SELECT COUNT(*) FROM public.contact_messages WHERE status = 'new')
    ) INTO result;

    RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_dashboard_stats() FROM public;
GRANT EXECUTE ON FUNCTION public.admin_dashboard_stats() TO authenticated;


------------------------------------------------------------------
-- STEP FINAL — GRANT YOURSELF ADMIN
--
-- 1. Create your admin user in Supabase Dashboard → Authentication →
--    Users → "Add user" (set a password, tick auto-confirm).
-- 2. Replace the email below with that address and run this block.
-- 3. Then turn OFF public signup:
--    Dashboard → Authentication → Providers → Email → disable
--    "Enable sign ups". Nothing in this site signs users up, so this
--    costs nothing and removes the last way in.
------------------------------------------------------------------

-- INSERT INTO public.admin_users (user_id, email, role)
-- SELECT id, email, 'super_admin' FROM auth.users WHERE email = 'you@wffghana.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
