------------------------------------------------------------------
-- WFF GHANA — HOMEPAGE CONTENT
--
-- Run this ONCE in the Supabase SQL Editor, AFTER supabase_backend.sql
-- (it needs public.is_admin()).
--
-- Moves the copy that was hardcoded in app/page.tsx's HOME_DATA_CONFIG
-- into the database, so it can be edited from Admin -> Homepage
-- Content instead of requiring a code change and redeploy.
--
-- Idempotent: safe to re-run. Re-running will NOT overwrite content an
-- admin has already edited — the seed values only insert on first run
-- (ON CONFLICT DO NOTHING).
------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.site_content (
    key        TEXT PRIMARY KEY,
    value      JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access Site Content" ON public.site_content;
CREATE POLICY "Public Read Access Site Content" ON public.site_content
    FOR SELECT TO public, anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admin manage site_content" ON public.site_content;
CREATE POLICY "Admin manage site_content" ON public.site_content
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Seed with today's hardcoded copy so the admin form starts populated
-- with the live site content instead of blank fields. Every key here
-- has a matching hardcoded fallback in lib/homeContent.ts, so deleting
-- a row (or this never being run) does not break the page.

INSERT INTO public.site_content (key, value) VALUES
('home_president', '{
  "title": "THE FEDERATION",
  "quote": "Our vision is to provide a world-class platform for Ghanaian athletes to showcase their hard work, dedication, and aesthetic excellence on the global stage.",
  "body1": "World Fitness Federation (WFF) Ghana is the premier destination for aesthetic and athletic excellence. We are bringing the global standard of bodybuilding and fitness modeling to the heart of West Africa, ensuring fair judging, athlete welfare, and community building.",
  "body2": "Under authorized international rules, the inaugural chapter serves as the key pathway for outstanding local athletes to represent Ghana globally.",
  "cta": { "text": "Discover Our Alliance" },
  "president": {
    "name": "VICTOR AHENKORAH BAIDEN",
    "role": "President, WFF Ghana",
    "image": "/wff-president.jpg"
  }
}'),

('home_journey', '{
  "items": [
    { "title": "FOUNDATION", "subtitle": "COMMIT TO THE SANCTUARY OF IRON.", "type": "image", "src": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop" },
    { "title": "INTENSITY", "subtitle": "EVERY REP SHAPES YOUR DESTINY.", "type": "video", "src": "https://assets.mixkit.co/videos/preview/mixkit-man-training-with-heavy-ropes-in-the-gym-23450-large.mp4" },
    { "title": "DISCIPLINE", "subtitle": "SACRIFICE IN SILENCE, SHINE ON STAGE.", "type": "image", "src": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" },
    { "title": "STAGE", "subtitle": "THE ULTIMATE CONTINENTAL STAGE.", "type": "video", "src": "https://assets.mixkit.co/videos/preview/mixkit-silhouette-of-a-bodybuilder-flexing-his-muscles-41717-large.mp4" },
    { "title": "ASCENSION", "subtitle": "EARN REST, SEIZE GLORY.", "type": "image", "src": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" }
  ]
}'),

('home_championship', '{
  "supertitle": "UPCOMING INAUGURAL EVENT",
  "title": "THE INAUGURAL SHOWDOWN",
  "description": "The premier battleground for West African natural aesthetics. Register to compete for official WFF International classifications, global pro-am credentials, and direct invitations to world-tier stages.",
  "categoriesTitle": "COMPETITION CLASSES",
  "categories": [
    "Men'\''s Bodybuilding (Open Weight)",
    "Men'\''s Physique (Height Classes)",
    "Classic Physique (Symmetry Ratio)",
    "Women'\''s Bikini & Wellness Divisions"
  ],
  "stakesTitle": "THE PRIZE",
  "stakesDescription": "Overall segment champions receive standard-accredited WFF Pro Status, opening doors to represent Ghana at world-class events in Europe, Asia, and the Americas.",
  "stakesBadge": "Certified Medals • Pro Cards • Global Standings",
  "venueTitle": "UPSA AUDITORIUM",
  "venueLocation": "Madina East, Accra, Ghana",
  "venueDetails": "Accra'\''s state-of-the-art national-scale auditorium with premium production, professional athlete staging, and fully designed modern theater feedback.",
  "ctas": {
    "tickets": { "text": "SECURE PASSES" },
    "register": { "text": "REGISTER TO COMPETE" }
  }
}'),

('home_ambassadors', '{
  "title": "FOUNDING EMBASSY",
  "subtitle": "Authorized Division Categories & Slots",
  "description": "We are establishing pristine competition segments. Competitors may request official slot registration for specific athletic divisions below:",
  "items": [
    { "id": "amb-1", "title": "AESTHETICS", "desc": "Symmetry, Proportion & Conditioning", "image": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop", "badge": "Men'\''s Physique Slot" },
    { "id": "amb-2", "title": "CLASSIC", "desc": "Mass, Structure & Stage Carriage", "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop", "badge": "Classic Bodybuilding Slot" },
    { "id": "amb-3", "title": "WELLNESS", "desc": "Balance, Muscle Tone & Presentation", "image": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop", "badge": "Women'\''s Wellness Slot" }
  ],
  "cta": { "text": "Apply For Stage Access" }
}'),

('home_wellness', '{
  "supertitle": "SUSTAIN THE BODY",
  "title": "WELLNESS & PHYSIOLOGY",
  "body": "Peak athleticism requires supreme physical calibration. Our official guidance covers holistic training protocols, strict natural supplement directives, and structured athletic restoration programs.",
  "cta": { "text": "Explore Wellness Programs" }
}'),

('home_armory', '{
  "supertitle": "OFFICIAL CHAPTER GEAR",
  "title": "THE ARMORY"
}'),

('home_news', '{
  "title": "OFFICIAL CHRONICLES"
}'),

('home_partnerships', '{
  "title": "AFFILIATION & SECTOR PARTNERS",
  "body": "Secure direct alignment with peak athletic lifestyles and highly disciplined consumer demographics in Accra, Kumasi, and West Africa.",
  "cta": { "text": "Discover Sponsorship Tiers" }
}'),

('home_contact_cta', '{
  "title": "READY FOR GLORY?",
  "passesBtn": { "text": "REGISTER TO COMPETE" },
  "contactBtn": { "text": "CONTACT OFFICIALS" }
}')

ON CONFLICT (key) DO NOTHING;
