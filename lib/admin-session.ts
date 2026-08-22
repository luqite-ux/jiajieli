import 'server-only'

export const ADMIN_SESSION_COOKIE = 'hq_admin_session'
export const ADMIN_TENANT_COOKIE = 'hq_tenant_id'

export function adminSessionCookieOptions(expires: Date) {
  return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, expires, path: '/' }
}
