-- Seed script to migrate static frontend data to Supabase Tables

-- 1. Create the main event
INSERT INTO public.events (id, title, start_date, end_date, venue_name, venue_location, description, is_active)
VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'ALL AFRICA BODYBUILDING CHAMPIONSHIPS (2026 EDITION)',
    '2026-09-26',
    '2026-09-26',
    'UPSA AUDITORIUM',
    'Madina East, Accra, Ghana',
    'Road to the Championship. Africa''s elite are coming. Welcoming National Teams, Clubs, and Individual Athletes across the continent.',
    true
) ON CONFLICT DO NOTHING;

-- 1b. Official competition taxonomy: 10 categories across 3 groups,
-- each with its own ordered division list (age/height/pro tier —
-- kept inline in the division name, matching how the federation
-- publishes it). Re-run safe: clears and re-seeds both tables, and
-- divisions cascades from categories so there's nothing orphaned.
DELETE FROM public.categories;

INSERT INTO public.categories (id, name, group_name, display_order) VALUES
  (gen_random_uuid(), 'Men''s Classic Bodybuilding',              'Bodybuilding & Figure', 1),
  (gen_random_uuid(), 'Women''s Figure',                          'Bodybuilding & Figure', 2),
  (gen_random_uuid(), 'Women''s Sports Model',                    'Fitness Models',        3),
  (gen_random_uuid(), 'Men''s Sports Model',                      'Fitness Models',        4),
  (gen_random_uuid(), 'Bikini Model',                             'Fitness Models',        5),
  (gen_random_uuid(), 'Bermuda Beach Model (Men''s Physique)',    'Fitness Models',        6),
  (gen_random_uuid(), 'Latino Model (Wellness)',                  'Fitness Models',        7),
  (gen_random_uuid(), 'Women''s Glamour',                         'Fashion Models',        8),
  (gen_random_uuid(), 'Men''s Jeans Model',                       'Fashion Models',        9),
  (gen_random_uuid(), 'Women''s Monokini (One Piece)',            'Fashion Models',        10);

WITH cat AS (SELECT id, name FROM public.categories)
INSERT INTO public.divisions (id, category_id, name, display_order)
SELECT gen_random_uuid(), cat.id, d.name, d.ord
FROM cat
JOIN (VALUES
  ('Men''s Classic Bodybuilding', 'Novice', 1),
  ('Men''s Classic Bodybuilding', 'First Timers', 2),
  ('Men''s Classic Bodybuilding', 'Teenage (19&under)', 3),
  ('Men''s Classic Bodybuilding', 'Junior (24&under)', 4),
  ('Men''s Classic Bodybuilding', 'Open', 5),
  ('Men''s Classic Bodybuilding', 'Masters (50+)', 6),
  ('Men''s Classic Bodybuilding', 'Grand Masters (60+)', 7),
  ('Men''s Classic Bodybuilding', 'Professional (Classic & Open Pro)', 8),

  ('Women''s Figure', 'Novice', 1),
  ('Women''s Figure', 'First Timers', 2),
  ('Women''s Figure', 'Teenage', 3),
  ('Women''s Figure', 'Junior', 4),
  ('Women''s Figure', 'Open', 5),
  ('Women''s Figure', 'Masters (50+)', 6),
  ('Women''s Figure', 'Grand Masters (60+)', 7),
  ('Women''s Figure', 'Professional (Figure Pro)', 8),

  ('Women''s Sports Model', 'Novice', 1),
  ('Women''s Sports Model', 'First Timers', 2),
  ('Women''s Sports Model', 'Teenage', 3),
  ('Women''s Sports Model', 'Junior', 4),
  ('Women''s Sports Model', 'Short (Under 163cm)', 5),
  ('Women''s Sports Model', 'Tall (163cm+)', 6),
  ('Women''s Sports Model', 'Masters (40+)', 7),
  ('Women''s Sports Model', 'Professional (Sports Model Pro)', 8),

  ('Men''s Sports Model', 'Novice', 1),
  ('Men''s Sports Model', 'First Timers', 2),
  ('Men''s Sports Model', 'Teenage', 3),
  ('Men''s Sports Model', 'Junior', 4),
  ('Men''s Sports Model', 'Short (Under 175cm)', 5),
  ('Men''s Sports Model', 'Tall (175cm+)', 6),
  ('Men''s Sports Model', 'Masters (40+)', 7),
  ('Men''s Sports Model', 'Professional (Sports Model Pro)', 8),

  ('Bikini Model', 'Novice', 1),
  ('Bikini Model', 'First Timers', 2),
  ('Bikini Model', 'Teenage', 3),
  ('Bikini Model', 'Junior', 4),
  ('Bikini Model', 'Short (Under 163cm)', 5),
  ('Bikini Model', 'Tall (163cm+)', 6),
  ('Bikini Model', 'Masters (40+)', 7),
  ('Bikini Model', 'Professional (Bikini Model Pro)', 8),

  ('Bermuda Beach Model (Men''s Physique)', 'Novice', 1),
  ('Bermuda Beach Model (Men''s Physique)', 'First Timers', 2),
  ('Bermuda Beach Model (Men''s Physique)', 'Teenage', 3),
  ('Bermuda Beach Model (Men''s Physique)', 'Junior', 4),
  ('Bermuda Beach Model (Men''s Physique)', 'Short (Under 175cm)', 5),
  ('Bermuda Beach Model (Men''s Physique)', 'Tall (175cm+)', 6),
  ('Bermuda Beach Model (Men''s Physique)', 'Masters (40+)', 7),
  ('Bermuda Beach Model (Men''s Physique)', 'Professional (Beach Model Pro)', 8),

  ('Latino Model (Wellness)', 'Novice', 1),
  ('Latino Model (Wellness)', 'First Timers', 2),
  ('Latino Model (Wellness)', 'Teenage', 3),
  ('Latino Model (Wellness)', 'Junior', 4),
  ('Latino Model (Wellness)', 'Short (Under 163cm)', 5),
  ('Latino Model (Wellness)', 'Tall (163cm+)', 6),
  ('Latino Model (Wellness)', 'Masters (40+)', 7),
  ('Latino Model (Wellness)', 'Professional (Latino Model Pro)', 8),

  ('Women''s Glamour', 'Novice', 1),
  ('Women''s Glamour', 'First Timers', 2),
  ('Women''s Glamour', 'Teenage', 3),
  ('Women''s Glamour', 'Junior', 4),
  ('Women''s Glamour', 'Short (Under 163cm)', 5),
  ('Women''s Glamour', 'Tall (163cm+)', 6),
  ('Women''s Glamour', 'Masters (40+)', 7),

  ('Men''s Jeans Model', 'Novice', 1),
  ('Men''s Jeans Model', 'First Timers', 2),
  ('Men''s Jeans Model', 'Teenage', 3),
  ('Men''s Jeans Model', 'Junior', 4),
  ('Men''s Jeans Model', 'Short (Under 175cm)', 5),
  ('Men''s Jeans Model', 'Tall (175cm+)', 6),
  ('Men''s Jeans Model', 'Professional (Jeans Model Pro)', 7),

  ('Women''s Monokini (One Piece)', 'Novice', 1),
  ('Women''s Monokini (One Piece)', 'First Timers', 2),
  ('Women''s Monokini (One Piece)', 'Teenage', 3),
  ('Women''s Monokini (One Piece)', 'Junior', 4),
  ('Women''s Monokini (One Piece)', 'Short (Under 163cm)', 5),
  ('Women''s Monokini (One Piece)', 'Tall (163cm+)', 6),
  ('Women''s Monokini (One Piece)', 'Masters (40+)', 7),
  ('Women''s Monokini (One Piece)', 'Professional (Monokini Pro)', 8)
) AS d(cat_name, name, ord) ON d.cat_name = cat.name;

-- 1c. Registration fee, editable from /admin/settings.
INSERT INTO public.site_content (key, value)
VALUES ('registration_fee', '{"ghs": 500, "usd": 45}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 2. Add Federation Staff
INSERT INTO public.federation_staff (name, role, bio, image_url, display_order) VALUES
('VICTOR AHENKORAH BAIDEN', 'President, WFF Ghana', 'Our vision is to provide a world-class platform for Ghanaian athletes to showcase their hard work...', '/wff-president.jpg', 1);

-- 3. Add Sponsors
INSERT INTO public.sponsors (name, tier, display_order) VALUES
('ACCRA ATHLETIC CLUB', 'FOUNDING GYM', 1),
('PRIME PHYSIQUE GH', 'ATHLETIC SUPPORT', 2),
('IRON FORCE EQUIPMENT', 'HARDWARE PARTNER', 3),
('GOLD STANDARD SPORTS', 'NUTRITION DIVISION', 4),
('WEST AFRICA ACTIVE', 'OFFICIAL HOST PORTAL', 5),
('PRESTIGE WELLNESS INC.', 'PHYSIOLOGY DIVISION', 6);

-- 4. Add News Articles (Updated dates to align leading up to September)
INSERT INTO public.news_articles (title, publish_date, summary) VALUES
('WFF CHAPTER SANCTIONED IN ACCRA', '2026-07-01', 'The global licensing body has finalized the constitution of the Ghana federation, establishing a state office to manage West African natural tournaments.'),
('UPSA STAGE LIGHTING CONTRACT LOCKED', '2026-07-20', 'To match WFF''s premium presentation guidelines, a professional lighting and live feed team is selected to operate the main theater.'),
('ANTI-DOPING COMPLIANCE WORKSHOP SET', '2026-08-05', 'WFF Ghana reiterates its commitment to natural physique aesthetics with upcoming public rules workshops explaining natural parameters.');

-- 5. Add Commerce Products
INSERT INTO public.ecommerce_products (name, price, image_url, category, description, tag) VALUES
('Official Team Ghana Track Jacket', 450.00, 'https://picsum.photos/seed/jacket/600/600', 'Outerwear', 'Premium track jacket with WFF Ghana embroidery.', 'New Arrival'),
('WFF Ghana Performance Tee', 150.00, 'https://picsum.photos/seed/tee/600/600', 'T-Shirts', 'Moisture-wicking performance tee for intense workouts.', 'Bestseller'),
('2026 All Africa Champs Cap', 120.00, 'https://picsum.photos/seed/cap/600/600', 'Accessories', 'Adjustable snapback cap with 2026 Championship logo.', 'Limited Edition'),
('Premium Lifting Belt', 350.00, 'https://picsum.photos/seed/belt/600/600', 'Gear', 'Genuine leather lifting belt for heavy compound movements.', 'Gear'),
('WFF Stringer Tank', 100.00, 'https://picsum.photos/seed/tank/600/600', 'Tanks', 'Classic stringer tank top to show off your physique.', ''),
('Ghana Meets Africa Hoodie', 300.00, 'https://picsum.photos/seed/hoodie/600/600', 'Outerwear', 'Heavyweight hoodie celebrating the All Africa Championship.', 'Exclusive');

-- 6. Add Athletes (Memberships)
INSERT INTO public.memberships (id, first_name, last_name, country, bio, profile_image_url) VALUES
('a0000000-0000-0000-0000-000000000001', 'Kofi', 'Mensah', 'Ghana', 'A veteran of the Ghanaian bodybuilding scene, Kofi brings unmatched mass and conditioning. He is a 3-time national champion aiming for his pro card.', '/award-1.jpg'),
('a0000000-0000-0000-0000-000000000002', 'Ama', 'Osei', 'Ghana', 'Ama''s perfect symmetry and stage presence make her a standout in the Bikini division. She has been training for 4 years and is ready for the world stage.', '/culture-1.jpg'),
('a0000000-0000-0000-0000-000000000003', 'Kwesi', 'Appiah', 'Ghana', 'Embodying the golden era of bodybuilding, Kwesi focuses on aesthetics, tiny waist, and wide shoulders. His posing routines are legendary.', '/award-4.jpg'),
('a0000000-0000-0000-0000-000000000004', 'Abena', 'Yeboah', 'Ghana', 'Abena combines athletic performance with fitness modeling. Her dynamic routines and athletic build make her a top contender.', '/culture-2.jpg');

-- 7. Add Athlete Achievements
INSERT INTO public.athlete_achievements (athlete_id, title) VALUES
('a0000000-0000-0000-0000-000000000001', '2025 WFF Ghana Overall Champion'),
('a0000000-0000-0000-0000-000000000001', '2024 West African Classic Winner'),
('a0000000-0000-0000-0000-000000000002', '2025 WFF Ghana Bikini Champion'),
('a0000000-0000-0000-0000-000000000002', '2025 Arnold Classic Africa Top 5'),
('a0000000-0000-0000-0000-000000000003', '2025 WFF Ghana Classic Physique Winner'),
('a0000000-0000-0000-0000-000000000004', '2024 WFF Universe Top 10'),
('a0000000-0000-0000-0000-000000000004', '2025 WFF Ghana Sports Model Winner');
