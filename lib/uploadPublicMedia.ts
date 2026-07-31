import { supabase } from './supabase';

/**
 * Uploads to the public-media bucket (public read, admin write — see
 * supabase_backend.sql) and returns the public URL. `folder` just keeps
 * uploads from different admin sections apart in storage, e.g.
 * "homepage/journey" or "ecommerce_products".
 */
export async function uploadPublicMedia(folder: string, file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
  const path = `${folder}/${Date.now()}_${safeName}`;

  const { error } = await supabase.storage
    .from('public-media')
    .upload(path, file, { upsert: false });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from('public-media').getPublicUrl(path);

  return publicUrl;
}
