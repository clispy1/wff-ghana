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
