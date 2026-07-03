-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Step 1 — Personal
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT,
    gender TEXT NOT NULL,
    dob DATE NOT NULL,
    nationality TEXT NOT NULL,
    country_representing TEXT NOT NULL,
    passport_number TEXT,
    national_id TEXT,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    whatsapp TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,

    -- Step 2 — Competition
    athlete_type TEXT NOT NULL,
    category TEXT NOT NULL,
    division TEXT NOT NULL,
    weight_class TEXT,
    height_class TEXT,

    -- Step 3 — Team / Club
    team_name TEXT,
    club_name TEXT,
    team_country TEXT,
    coach_name TEXT,
    manager_name TEXT,
    manager_contact TEXT,
    federation_affiliation TEXT,

    -- Step 4 — Documents & Medical
    medical_declaration BOOLEAN NOT NULL DEFAULT false,
    fitness_declaration BOOLEAN NOT NULL DEFAULT false,
    passport_url TEXT,
    national_id_url TEXT,
    headshot_url TEXT,
    full_body_url TEXT,
    prev_photos_urls TEXT[],
    certs_url TEXT,

    -- Step 5 — Payment & Logistics
    fee_paid_status TEXT NOT NULL, -- 'paid' or 'pending'
    payment_method TEXT,
    transaction_id TEXT,
    paystack_ref TEXT,
    payment_screenshot_url TEXT,
    
    emergency_name TEXT NOT NULL,
    emergency_relation TEXT NOT NULL,
    emergency_phone TEXT NOT NULL,
    
    instagram TEXT,
    facebook TEXT,
    tiktok TEXT,
    
    arrival_date DATE,
    departure_date DATE,
    needs_pickup TEXT,
    needs_accommodation TEXT,
    
    media_consent BOOLEAN DEFAULT false,
    terms_agreed BOOLEAN NOT NULL DEFAULT false,
    
    -- Backend state
    registration_status TEXT DEFAULT 'pending' -- 'pending', 'approved', 'rejected'
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so public users can register)
CREATE POLICY "Enable insert for anonymous users" 
ON public.registrations FOR INSERT 
TO public, anon 
WITH CHECK (true);

-- Allow admins full access (optional for dashboard later)
-- CREATE POLICY "Enable all for authenticated users" 
-- ON public.registrations FOR ALL 
-- TO authenticated
-- USING (true);


-- Storage setup (run these commands in the Supabase Dashboard -> Storage if SQL doesn't run)
-- Note: It's often easier to create the bucket 'athlete-documents' via the UI and set it to Public.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('athlete-documents', 'athlete-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to storage bucket
CREATE POLICY "Public Uploads" 
ON storage.objects FOR INSERT 
TO public, anon 
WITH CHECK (bucket_id = 'athlete-documents');

-- Allow public reads from storage bucket
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
TO public, anon 
USING (bucket_id = 'athlete-documents');

------------------------------------------------------
-- PHASE 1 EXPANSION: Headless CMS and Dynamic Data
------------------------------------------------------

-- 1. Core Platform Data
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    venue_name TEXT,
    venue_location TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.federation_staff (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT,
    logo_url TEXT,
    link_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    publish_date DATE NOT NULL,
    summary TEXT,
    content_body TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Competitions & Logistics
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.divisions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    weight_limit TEXT,
    height_limit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.event_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    day_date TEXT NOT NULL,
    time_start TEXT,
    time_end TEXT,
    title TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.accommodations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    type TEXT,
    name TEXT NOT NULL,
    location TEXT,
    description TEXT,
    label_color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add relations to existing registrations table
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id);
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS division_id UUID REFERENCES public.divisions(id);

-- 3. Athletes & Community
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- For future auth linking
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    country TEXT NOT NULL,
    bio TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.athlete_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    athlete_id UUID REFERENCES public.memberships(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    year TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Commerce & Ticketing
CREATE TABLE IF NOT EXISTS public.ticket_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ticket_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_tier_id UUID REFERENCES public.ticket_tiers(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    payment_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ecommerce_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    category TEXT,
    description TEXT,
    tag TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for all new tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.federation_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecommerce_products ENABLE ROW LEVEL SECURITY;

-- Read policies (Allow public reads for front end mapping)
CREATE POLICY "Public Read Access Events" ON public.events FOR SELECT TO public, anon USING (true);
CREATE POLICY "Public Read Access Staff" ON public.federation_staff FOR SELECT TO public, anon USING (true);
CREATE POLICY "Public Read Access Sponsors" ON public.sponsors FOR SELECT TO public, anon USING (true);
CREATE POLICY "Public Read Access News" ON public.news_articles FOR SELECT TO public, anon USING (true);
CREATE POLICY "Public Read Access Categories" ON public.categories FOR SELECT TO public, anon USING (true);
CREATE POLICY "Public Read Access Divisions" ON public.divisions FOR SELECT TO public, anon USING (true);
CREATE POLICY "Public Read Access Schedules" ON public.event_schedules FOR SELECT TO public, anon USING (true);
CREATE POLICY "Public Read Access Accommodations" ON public.accommodations FOR SELECT TO public, anon USING (true);
CREATE POLICY "Public Read Access Memberships" ON public.memberships FOR SELECT TO public, anon USING (true);
CREATE POLICY "Public Read Access Achievements" ON public.athlete_achievements FOR SELECT TO public, anon USING (true);
CREATE POLICY "Public Read Access Ticket Tiers" ON public.ticket_tiers FOR SELECT TO public, anon USING (true);
CREATE POLICY "Public Read Access Products" ON public.ecommerce_products FOR SELECT TO public, anon USING (true);

-- Allow public to INSERT into ticket_orders (simulating ticket purchasing)
CREATE POLICY "Enable insert for anonymous users Orders" ON public.ticket_orders FOR INSERT TO public, anon WITH CHECK (true);
