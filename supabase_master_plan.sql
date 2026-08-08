------------------------------------------------------------------
-- WFF GHANA — EVENT MASTER PLAN
--
-- Run this ONCE in the Supabase SQL Editor, AFTER supabase_backend.sql
-- (it needs public.is_admin()).
--
-- Adds the admin-only event planning suite:
--   • master_plan_phases   — high-level planning phases
--   • master_plan_columns  — user-configurable kanban columns
--   • master_plan_tasks    — one unified task/checklist list
--   • master_plan_designs  — the graphic designer's private file library
--   • master-plan-assets   — private storage bucket for those files
--
-- Idempotent: safe to re-run. Seeds only insert when the tables are
-- empty, so re-running never wipes plan data an admin has entered.
------------------------------------------------------------------

------------------------------------------------------------------
-- 1. PLANNING PHASES
------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.master_plan_phases (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL UNIQUE,
    color      TEXT NOT NULL DEFAULT '#FDCB13',
    sort_order INT  NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

------------------------------------------------------------------
-- 2. KANBAN COLUMNS (user-configurable workflow)
------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.master_plan_columns (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           TEXT NOT NULL UNIQUE,
    color          TEXT NOT NULL DEFAULT '#CE1126',
    sort_order     INT  NOT NULL DEFAULT 0,
    is_done_column BOOLEAN NOT NULL DEFAULT false,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

------------------------------------------------------------------
-- 3. TASKS (the checklist / kanban cards)
------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.master_plan_tasks (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id     UUID REFERENCES public.events(id) ON DELETE CASCADE,
    column_id    UUID REFERENCES public.master_plan_columns(id) ON DELETE SET NULL,
    phase_id     UUID REFERENCES public.master_plan_phases(id) ON DELETE SET NULL,
    title        TEXT NOT NULL,
    description  TEXT,
    assignee     TEXT,
    priority     TEXT NOT NULL DEFAULT 'medium',  -- 'low' | 'medium' | 'high' | 'critical'
    due_date     DATE,
    sort_order   INT  NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

------------------------------------------------------------------
-- 4. DESIGNS (graphic designer file library, private)
------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.master_plan_designs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id    UUID REFERENCES public.events(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    description TEXT,
    file_path   TEXT NOT NULL,   -- path inside the master-plan-assets bucket
    file_name   TEXT NOT NULL,   -- original filename used for download
    file_size   BIGINT,
    mime_type   TEXT,
    category    TEXT NOT NULL DEFAULT 'other',  -- 'flyer' | 'poster' | 'banner' | 'brand' | 'other'
    status      TEXT NOT NULL DEFAULT 'draft',  -- 'draft' | 'final' | 'approved'
    version     TEXT,
    uploaded_by TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

------------------------------------------------------------------
-- 5. INDEXES
------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_mp_tasks_event    ON public.master_plan_tasks(event_id);
CREATE INDEX IF NOT EXISTS idx_mp_tasks_column   ON public.master_plan_tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_mp_tasks_phase    ON public.master_plan_tasks(phase_id);
CREATE INDEX IF NOT EXISTS idx_mp_tasks_due      ON public.master_plan_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_mp_tasks_assignee ON public.master_plan_tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_mp_designs_event  ON public.master_plan_designs(event_id);

------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY — admin only. This is internal planning
--    data; nothing on the public site reads it.
------------------------------------------------------------------

ALTER TABLE public.master_plan_phases  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_plan_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_plan_tasks   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_plan_designs ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'master_plan_phases', 'master_plan_columns',
        'master_plan_tasks', 'master_plan_designs'
    ]
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Admin manage ' || t, t);
        EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
            'Admin manage ' || t, t
        );
    END LOOP;
END $$;

------------------------------------------------------------------
-- 7. PRIVATE STORAGE BUCKET
--
-- Holds the graphic designer's files. Private (public = false), so
-- the dashboard reads them through short-lived signed URLs — exactly
-- like athlete-documents.
------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('master-plan-assets', 'master-plan-assets', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Admin read master plan assets"  ON storage.objects;
DROP POLICY IF EXISTS "Admin write master plan assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin update master plan assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete master plan assets" ON storage.objects;

CREATE POLICY "Admin read master plan assets" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'master-plan-assets' AND public.is_admin());

CREATE POLICY "Admin write master plan assets" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'master-plan-assets' AND public.is_admin());

CREATE POLICY "Admin update master plan assets" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'master-plan-assets' AND public.is_admin())
    WITH CHECK (bucket_id = 'master-plan-assets' AND public.is_admin());

CREATE POLICY "Admin delete master plan assets" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'master-plan-assets' AND public.is_admin());

------------------------------------------------------------------
-- 8. SEED DATA — only on first run
------------------------------------------------------------------

INSERT INTO public.master_plan_columns (name, color, sort_order, is_done_column)
SELECT * FROM (VALUES
    ('To Do',       '#6B7280', 0, false),
    ('In Progress', '#FDCB13', 1, false),
    ('Review',      '#F59E0B', 2, false),
    ('Done',        '#006B3F', 3, true)
) AS seed(name, color, sort_order, is_done_column)
WHERE NOT EXISTS (SELECT 1 FROM public.master_plan_columns);

INSERT INTO public.master_plan_phases (name, color, sort_order)
SELECT * FROM (VALUES
    ('Foundation', '#6B7280', 0),
    ('Pre-Launch', '#FDCB13', 1),
    ('Build-Up',   '#CE1126', 2),
    ('Event Week', '#F59E0B', 3),
    ('Wrap-Up',    '#006B3F', 4)
) AS seed(name, color, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.master_plan_phases);
