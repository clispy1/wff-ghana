import { supabase } from './supabase';

export interface GalleryPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
}

/**
 * Photos for the homepage "Chapter Media" teaser and the full /media
 * gallery — same table, so both pages can never show different sets.
 * Pass `limit` for the teaser; omit it for the full gallery.
 */
export async function fetchGalleryMedia(limit?: number): Promise<GalleryPhoto[]> {
  let query = supabase
    .from('gallery_media')
    .select('id, image_url, caption, display_order')
    .order('display_order', { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error('Could not load gallery media:', error.message);
    return [];
  }
  return data || [];
}
