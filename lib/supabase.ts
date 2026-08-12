import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID

export function getTenantId() {
  if (!tenantId) throw new Error('Missing NEXT_PUBLIC_TENANT_ID')
  return tenantId
}

export function createPublicSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase public environment variables')
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  })
}
