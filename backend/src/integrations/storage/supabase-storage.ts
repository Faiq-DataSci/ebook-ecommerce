import { getSupabaseAdmin } from '../../config/supabase.js'
import { env } from '../../config/env.js'

/**
 * Membuat signed URL sementara untuk file PDF di bucket privat.
 */
export async function createPrivatePdfSignedUrl(
  objectPath: string,
  expiresInSeconds = 300,
): Promise<string> {
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin.storage
    .from(env.SUPABASE_EBOOK_BUCKET)
    .createSignedUrl(objectPath, expiresInSeconds)

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? 'Gagal membuat signed URL dari Supabase Storage')
  }

  return data.signedUrl
}
