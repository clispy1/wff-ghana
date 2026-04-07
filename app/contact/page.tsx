import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | WFF Ghana',
  description: 'Get in touch with the World Fitness Federation Ghana chapter.',
};

export default function ContactPage() {
  return <ContactClient />;
}
