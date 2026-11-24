import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/**
 * Checks whether live Supabase credentials are configured and not placeholders.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('PROJECT_REF') &&
    supabaseAnonKey !== 'ganti_dengan_supabase_anon_key',
)

// Safe fallback for local initialization so the application does not crash if unconfigured
const effectiveUrl = isSupabaseConfigured
  ? supabaseUrl
  : 'https://placeholder-project.supabase.co'
const effectiveKey = isSupabaseConfigured
  ? supabaseAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'

export const supabase: SupabaseClient = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
