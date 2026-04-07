import { Metadata } from 'next';
import AthletesClient from './AthletesClient';

export const metadata: Metadata = {
  title: 'Athletes & Registration | WFF Ghana',
  description: 'Meet Team Ghana and register for the 2026 All Africa Championship.',
};

export default function AthletesPage() {
  return <AthletesClient />;
}
