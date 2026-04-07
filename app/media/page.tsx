import { Metadata } from 'next';
import MediaClient from './MediaClient';

export const metadata: Metadata = {
  title: 'Media & News | WFF Ghana',
  description: 'Latest news, press releases, and media galleries for WFF Ghana.',
};

export default function MediaPage() {
  return <MediaClient />;
}
