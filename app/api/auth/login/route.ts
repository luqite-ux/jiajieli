import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { loginAdmin } from '@/lib/admin-auth'
import { normalizeLoginCredentials } from '@/lib/admin-login'
import { ADMIN_SESSION_COOKIE, ADMIN_TENANT_COOKIE, adminSessionCookieOptions } from '@/lib/admin-session'

function fail(request: NextRequest, error: string) {
  const url = request.nextUrl.clone(); url.pathname = '/admin/login'; url.search = ''; url.searchParams.set('error', error); return NextResponse.redirect(url, 303)
}
export async function POST(request: NextRequest) {
  let form: FormData
  try { form = await request.formData() } catch { return fail(request, 'request') }
  const { email, password } = normalizeLoginCredentials(form)
  if (!email || !password) return fail(request, 'missing')
  try {
    const result = await loginAdmin(email, password, { ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '', userAgent: request.headers.get('user-agent') ?? '' })
    if (!result.ok) return fail(request, result.reason)
    const url = request.nextUrl.clone(); url.pathname = '/admin'; url.search = ''
    const response = NextResponse.redirect(url, 303); const options = adminSessionCookieOptions(result.expiresAt)
    response.cookies.set(ADMIN_SESSION_COOKIE, result.token, options); response.cookies.set(ADMIN_TENANT_COOKIE, result.tenantId, options); return response
  } catch { return fail(request, 'configuration') }
}
