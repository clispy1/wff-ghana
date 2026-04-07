import { Metadata } from 'next';
import FederationClient from './FederationClient';

export const metadata: Metadata = {
  title: 'The Federation | WFF Ghana',
  description: 'About the World Fitness Federation Ghana chapter and our executive board.',
};

export default function FederationPage() {
  return <FederationClient />;
}
