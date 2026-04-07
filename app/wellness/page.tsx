import { Metadata } from 'next';
import WellnessClient from './WellnessClient';

export const metadata: Metadata = {
  title: 'Wellness & Fitness | WFF Ghana',
  description: 'Holistic health, nutrition, and training programs from WFF Ghana.',
};

export default function WellnessPage() {
  return <WellnessClient />;
}
