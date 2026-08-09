import { Metadata } from 'next';
import MediaClient from './MediaClient';
import { createServerSupabase } from '@/lib/supabase/server';
import { fetchGalleryMedia } from '@/lib/galleryMedia';

export const metadata: Metadata = {
  title: 'Media & Gallery | WFF Ghana',
  description: 'Official photo galleries from the WFF Ghana Championships and the 2026 All Africa Championship.',
};

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const supabase = await createServerSupabase();
  const photos = await fetchGalleryMedia(undefined, supabase);
  return <MediaClient photos={photos} />;
}
