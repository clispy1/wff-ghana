------------------------------------------------------------------
-- WFF GHANA — EVENT SCHEDULE, LOGISTICS & UPDATED DATES
--
-- Run this ONCE in the Supabase SQL Editor, AFTER supabase_backend.sql
-- and supabase_homepage_content.sql.
--
-- What this does:
--   1. Adds a registration_deadline column to events (editable from
--      Admin -> Events & Logistics; not set here, since no deadline
--      date has been given yet).
--   2. Updates your ACTIVE event row(s) to the new October 2-4, 2026
--      dates and the confirmed venue, per the WFF All Africa
--      Bodybuilding Championships flyers.
--   3. Seeds the day-by-day schedule, arrival/hotel/visa logistics
--      copy, and awards blurbs into site_content — all three become
--      editable from Admin -> Event Schedule & Logistics afterward,
--      and are shared by both /championship and /info so they can
--      never drift out of sync again.
--
-- Idempotent for the seed rows (ON CONFLICT DO NOTHING — re-running
-- this will NOT overwrite content an admin has already edited). The
-- events UPDATE in step 2, however, runs every time you run this file
-- — do not re-run it after you've made further edits in the admin
-- dashboard, or it will overwrite them back to these flyer values.
------------------------------------------------------------------

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_deadline DATE;

------------------------------------------------------------------
-- STEP 2 — Update the active event to the confirmed October dates
-- and venue. This updates every row with is_active = true; check the
-- "UPDATE n" result in the SQL editor matches the number of events you
-- expect to affect (normally exactly 1).
------------------------------------------------------------------

UPDATE public.events
SET
    title          = 'WFF All Africa Bodybuilding Championships',
    start_date     = '2026-10-02',
    end_date       = '2026-10-04',
    venue_name     = 'Ghana College of Physicians and Surgeons',
    venue_location = 'Ridge, Accra, Ghana',
    description    = 'Africa''s biggest bodybuilding event returns to Accra. Athletes from 30+ African countries compete for official WFF International classifications, global pro-am credentials, and direct invitations to world-tier stages. One continent, one stage, one champion.'
WHERE is_active = true;

-- Sanity check: confirm exactly the event(s) you expect were updated.
-- SELECT title, start_date, end_date, venue_name, venue_location, is_active FROM public.events;


------------------------------------------------------------------
-- STEP 3 — Seed schedule / logistics / awards content
------------------------------------------------------------------

INSERT INTO public.site_content (key, value) VALUES

('event_schedule', '{
  "days": [
    {
      "date": "2026-10-02",
      "dayTitle": "Registration & Official Weigh-In",
      "venueName": "Borteyman Sports Complex",
      "venueLocation": "Accra, Ghana",
      "blocks": [
        { "label": "10:00 - 18:00", "items": ["Athlete Check-in, Weigh-in & Height Measurement"] },
        { "label": "15:00 - 16:30", "items": ["WFF Africa Certified Judges Seminar"] },
        { "label": "19:00 - 20:30", "items": ["Official Press Conference & Meet-and-Greet"] }
      ]
    },
    {
      "date": "2026-10-03",
      "dayTitle": "Show Day 1 (Amateur & Pro Qualifier)",
      "blocks": [
        {
          "label": "Morning Session - 09:00 AM",
          "items": [
            "Womens Aerobics / Fitness Modeling",
            "Mens Beach Model (Juniors, Open & Masters)",
            "Womens Sports Modeling",
            "Mens Sports Modeling",
            "Womens Bikini (Short, Tall & Masters Divisions)"
          ]
        },
        {
          "label": "Afternoon Session - 02:00 PM",
          "items": [
            "Mens Fitness Division",
            "Womens Figure Championships",
            "Mens Performance Class",
            "Womens Physique Line-ups",
            "Mens Athletic Showdown",
            "Mens Superbody Grand Prix",
            "Mens Extreme Bodybuilding Overall"
          ]
        }
      ]
    },
    {
      "date": "2026-10-04",
      "dayTitle": "Show Day 2 (Pro Division & Overall Awards)",
      "blocks": [
        { "label": "12:00 PM", "items": ["Overall Amateur Line-ups & Pro Card Convocations"] },
        { "label": "03:00 PM", "items": ["WFF Pro Division (Bikini & Sports Model)"] },
        { "label": "05:30 PM", "items": ["WFF Pro Division (Mens Bodybuilding)"] },
        { "label": "08:00 PM", "items": ["Championship Celebration Banquet"] }
      ]
    }
  ]
}'),

('event_logistics', '{
  "hostNationName": "WFF Ghana",
  "hostNationTagline": "World Fitness Federation",
  "airportIntro": "All international delegates should fly into Kotoka International Airport (ACC), located directly in Accra. Official WFF shuttles operate for pre-booked athletes landing between 08:00 and 22:00.",
  "transportNote": "Uber, Bolt, and Yango operate reliably in Accra for those arriving outside shuttle hours or preferring private transport.",
  "visaNote": "Members of the African Union (AU) and ECOWAS qualify for Visa on Arrival or visa-free entry. Other federations must apply for an e-Visa or consult their local Ghanaian consulate in advance. Invitations will be provided by WFF Ghana upon registration.",
  "yellowFeverNote": "Proof of Yellow Fever vaccination is mandatory for entry into Ghana. Carry your yellow booklet with your passport.",
  "hotelIntro": "We have partnered with leading highly-rated properties in the immediate vicinity of Kotoka International Airport, offering custom-curated food prep packages and airport shuttle channels. These provide the utmost comfort for peak-week prep and have discounted rates when using the code below.",
  "hotelDiscountCode": "WFF2026",
  "pdfUrl": "/info.pdf"
}'),

('event_awards', '{
  "items": [
    { "title": "Amateur Titles", "description": "The top 3 athletes in every amateur division will receive the official custom forged All Africa Championship Medals." },
    { "title": "Pro Status", "description": "Overall Winners of their respective divisions (e.g. Overall Bikini, Overall Bodybuilding) will be awarded the prestigious WFF Pro Card." },
    { "title": "Pro Division", "description": "Competitors in the Pro line-up will battle for substantial cash prizes, the Championship Belts, and legacy qualification." }
  ]
}')

ON CONFLICT (key) DO NOTHING;
