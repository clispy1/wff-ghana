import { Metadata } from 'next';
import PartnershipsClient from './PartnershipsClient';

export const metadata: Metadata = {
  title: 'Partnerships | WFF Ghana',
  description: 'Become a sponsor for the 2026 All Africa Championship.',
};

export default function PartnershipsPage() {
  return <PartnershipsClient />;
}
