import AthletesClient, { type Athlete } from './AthletesClient';
import { createServerSupabase } from '@/lib/supabase/server';

export const metadata = {
  title: 'Team Ghana Roster | WFF Ghana 2026 All Africa Championship',
  description: 'Meet the elite athletes representing Ghana at the 2026 WFF All Africa Championship.',
};

export const dynamic = 'force-dynamic';

export default async function AthletesPage() {
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from('memberships')
    .select(`
      id,
      first_name,
      last_name,
      country,
      bio,
      profile_image_url,
      athlete_achievements ( title )
    `);

  const athletes: Athlete[] = (data ?? []).map((m: any) => ({
    id: m.id,
    name: `${m.first_name} ${m.last_name}`,
    category: 'WFF Athlete',
    weightClass: m.country,
    image: m.profile_image_url,
    bio: m.bio,
    achievements: m.athlete_achievements?.map((a: any) => a.title) || [],
  }));

  return <AthletesClient athletes={athletes} />;
}
