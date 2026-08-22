import 'server-only'
import { createClient } from '@supabase/supabase-js'

export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key) throw new Error('Supabase admin service is not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false } })
}
