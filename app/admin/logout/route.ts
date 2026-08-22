import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, ADMIN_TENANT_COOKIE } from '@/lib/admin-session'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (token) { try { await createAdminSupabaseClient().from('admin_user_sessions').delete().eq('token', token) } catch {} }
  const url = request.nextUrl.clone(); url.pathname = '/admin/login'; url.search = ''
  const response = NextResponse.redirect(url, 303); const expired = { httpOnly: true, path: '/', maxAge: 0 }
  response.cookies.set(ADMIN_SESSION_COOKIE, '', expired); response.cookies.set(ADMIN_TENANT_COOKIE, '', expired); return response
}
