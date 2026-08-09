import { Metadata } from 'next';
import ChampionshipClient, { type ChampionshipClientProps } from './ChampionshipClient';
import { createServerSupabase } from '@/lib/supabase/server';
import { fetchActiveEvent } from '@/lib/activeEvent';
import { fetchPublicEventPageContent } from '@/lib/eventContent';

export const metadata: Metadata = {
  title: '2026 All Africa Championship | WFF Ghana',
  description: 'Event details, schedule, and ticketing for the 2026 All Africa Championship in Accra, Ghana.',
};

export const dynamic = 'force-dynamic';

export default async function ChampionshipPage() {
  const supabase = await createServerSupabase();

  const [ticketsRes, hotelsRes, championshipEvent, pageContent] = await Promise.all([
    supabase.from('ticket_tiers').select('*').order('price', { ascending: true }),
    supabase.from('accommodations').select('*'),
    fetchActiveEvent(supabase),
    fetchPublicEventPageContent(supabase),
  ]);

  const props: ChampionshipClientProps = {
    tickets:
      ticketsRes.data?.map((t) => ({
        id: t.id,
        name: t.name,
        price: Number(t.price),
        isVip: Boolean(t.type?.toLowerCase().includes('vip')),
        category: 'Tickets',
        description: t.description,
      })) ?? [],
    hotels:
      hotelsRes.data?.map((h) => ({
        type: h.type,
        name: h.name,
        location: h.location,
        desc: h.description,
        labelColor: h.label_color,
      })) ?? [],
    championshipEvent,
    pageContent,
  };

  return <ChampionshipClient {...props} />;
}
