import 'server-only'
import bcrypt from 'bcryptjs'
import { issueAdminSession, type AdminAuthStore } from '@/lib/admin-auth-core'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

function tenantId() {
  const value = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!value) throw new Error('Customer administration is not configured')
  return value
}

function store(): AdminAuthStore {
  const supabase = createAdminSupabaseClient()
  return {
    async findUser(email, currentTenant) {
      const { data, error } = await supabase.from('admin_users').select('id,password_hash').eq('email', email).eq('tenant_id', currentTenant).eq('is_active', true).maybeSingle()
      if (error) throw error
      return data ? { id: data.id, passwordHash: data.password_hash } : null
    },
    async createSession(session) {
      const { error } = await supabase.from('admin_user_sessions').insert({ admin_user_id: session.adminUserId, token: session.token, expires_at: session.expiresAt, ip: session.ip, user_agent: session.userAgent })
      return !error
    },
    async touchLastLogin(userId, currentTenant, loggedInAt) {
      const { error } = await supabase.from('admin_users').update({ last_login_at: loggedInAt }).eq('id', userId).eq('tenant_id', currentTenant)
      if (error) throw error
    },
  }
}

export function loginAdmin(email: string, password: string, metadata: { ip: string; userAgent: string }) {
  return issueAdminSession({ email, password, tenantId: tenantId(), ip: metadata.ip, userAgent: metadata.userAgent, store: store(), verifyPassword: bcrypt.compare, createToken: () => crypto.randomUUID(), now: () => new Date() })
}
