import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from './env.js'

let adminClient: SupabaseClient | null = null

/**
 * Returns a server-only Supabase client configured with the service role key.
 * Throws if required Supabase environment variables are missing.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase server configuration is missing')
  }

  if (!adminClient) {
    adminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return adminClient
}
