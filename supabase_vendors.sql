------------------------------------------------------------------
-- WFF GHANA — EVENT VENDORS
--
-- Run this ONCE in the Supabase SQL Editor, AFTER supabase_backend.sql
-- (it needs public.is_admin()).
--
-- Adds the vendors directory used by:
--   • the admin dashboard (full CRUD, admin-only)
--   • the public directory at /championship/vendors (approved only)
--
-- Idempotent: safe to re-run.
------------------------------------------------------------------

------------------------------------------------------------------
-- 1. VENDORS
------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.vendors (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           TEXT NOT NULL,
    category       TEXT NOT NULL DEFAULT 'other',
                   -- 'catering' | 'merchandise' | 'services' | 'other'
    contact_person TEXT,
    phone          TEXT,
    email          TEXT,
    website_url    TEXT,
    notes          TEXT,            -- internal only, never shown publicly
    status         TEXT NOT NULL DEFAULT 'pending',
                   -- 'approved' (appears on public site) | 'pending' (admin only)
    display_order  INT  NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

------------------------------------------------------------------
-- 2. INDEXES
------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON public.vendors(category);

------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
--
-- Public/anon can only read APPROVED vendors (the public directory).
-- Admins get full CRUD through public.is_admin().
------------------------------------------------------------------

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read vendors" ON public.vendors;
CREATE POLICY "Public read vendors" ON public.vendors
    FOR SELECT TO public, anon
    USING (status = 'approved');

DROP POLICY IF EXISTS "Admin manage vendors" ON public.vendors;
CREATE POLICY "Admin manage vendors" ON public.vendors
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
