------------------------------------------------------------------
-- WFF GHANA — VENDOR APPLICATIONS (phase 2)
--
-- Public self-registration: a business applies on the website, picks
-- a sponsorship/booth package and pays online via Paystack (same flow
-- as shop orders). Run AFTER supabase_backend.sql + supabase_vendors.sql.
--
-- Adds:
--   • vendor_packages  — admin-managed sponsorship/booth tiers
--   • vendors columns  — package_id/package_name/package_price snapshot,
--                        payment_status, paystack_ref, paid_at,
--                        application_note
--   • RLS              — anyone may submit an application (pending +
--                        unpaid only); only admins approve/publish
--
-- Idempotent: safe to re-run.
------------------------------------------------------------------

------------------------------------------------------------------
-- 1. VENDOR PACKAGES
------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.vendor_packages (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    price         NUMERIC(10,2) NOT NULL DEFAULT 0,
                  -- major units (GHS)
    description   TEXT,
    benefits      TEXT NOT NULL DEFAULT '',
                  -- one benefit per line; shown as bullets on the apply page
    is_active     BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_packages_active
    ON public.vendor_packages(is_active, display_order);

------------------------------------------------------------------
-- 2. VENDORS — APPLICATION / PAYMENT COLUMNS
------------------------------------------------------------------

ALTER TABLE public.vendors
    ADD COLUMN IF NOT EXISTS package_id      UUID REFERENCES public.vendor_packages(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS package_name    TEXT,
    ADD COLUMN IF NOT EXISTS package_price   NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS payment_status  TEXT NOT NULL DEFAULT 'pending',
                  -- 'pending' | 'paid' | 'failed'
    ADD COLUMN IF NOT EXISTS paystack_ref    TEXT,
    ADD COLUMN IF NOT EXISTS paid_at         TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS application_note TEXT;
                  -- what the applicant wants to sell; internal review copy

CREATE INDEX IF NOT EXISTS idx_vendors_payment ON public.vendors(payment_status);

------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
------------------------------------------------------------------

-- 3a. Packages: everyone can read the active catalogue; only admins
--     manage it.
ALTER TABLE public.vendor_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read vendor packages" ON public.vendor_packages;
CREATE POLICY "Public read vendor packages" ON public.vendor_packages
    FOR SELECT TO public, anon
    USING (is_active = true);

DROP POLICY IF EXISTS "Admin manage vendor packages" ON public.vendor_packages;
CREATE POLICY "Admin manage vendor packages" ON public.vendor_packages
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3b. Anyone may APPLY, but the application must land as pending and
--     unpaid — an applicant can never self-approve or self-mark paid.
--     The mirror of the registration policy in supabase_backend.sql.
DROP POLICY IF EXISTS "Anon submit vendor application" ON public.vendors;
CREATE POLICY "Anon submit vendor application" ON public.vendors
    FOR INSERT TO public, anon
    WITH CHECK (
        COALESCE(status, 'pending') = 'pending'
        AND COALESCE(payment_status, 'pending') = 'pending'
        AND paid_at IS NULL
    );
