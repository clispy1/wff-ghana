import { Metadata } from 'next';
import ChampionshipClient from './ChampionshipClient';

export const metadata: Metadata = {
  title: '2026 All Africa Championship | WFF Ghana',
  description: 'Event details, schedule, and ticketing for the 2026 All Africa Championship in Accra, Ghana.',
};

export default function ChampionshipPage() {
  return <ChampionshipClient />;
}
