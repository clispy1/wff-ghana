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

-- 1b. Create the 6 Official Categories from the Flyer
INSERT INTO public.categories (id, name, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'Men''s Bodybuilding', 'Full muscle mass and conditioning'),
('c0000000-0000-0000-0000-000000000002', 'Men''s Physique', 'Aesthetic v-taper and board shorts'),
('c0000000-0000-0000-0000-000000000003', 'Classic Physique', 'Golden era symmetry and proportions'),
('c0000000-0000-0000-0000-000000000004', 'Women''s Bikini', 'Tone, balance, and stage presentation'),
('c0000000-0000-0000-0000-000000000005', 'Women''s Fitness', 'Athletic tone and gymnastic routines'),
('c0000000-0000-0000-0000-000000000006', 'Women''s Figure', 'Muscular symmetry and definition')
ON CONFLICT DO NOTHING;

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
