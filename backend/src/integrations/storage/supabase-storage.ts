import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env.js';

/**
 * Client Supabase khusus server (menggunakan service role key).
 * Hanya digunakan di backend untuk mengakses bucket Storage PRIVAT.
 */
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

/**
 * Membuat signed URL sementara untuk file PDF di bucket privat.
 */
export async function createPrivatePdfSignedUrl(
  objectPath: string,
  expiresInSeconds = 300,
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUrl(objectPath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? 'Gagal membuat signed URL dari Supabase Storage');
  }

  return data.signedUrl;
}
