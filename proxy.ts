import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { buildAdminDestination, buildAdminRequestHeaders, normalizeAdminOrigin } from '@/lib/admin-proxy'
import { ADMIN_SESSION_COOKIE, ADMIN_TENANT_COOKIE } from '@/lib/admin-session'

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const local = pathname === '/admin/login' || pathname === '/admin/logout'
  if (pathname.startsWith('/admin') && !local) {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
    const cookieTenant = request.cookies.get(ADMIN_TENANT_COOKIE)?.value
    const configuredTenant = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
    if (!session || !configuredTenant || cookieTenant !== configuredTenant) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = ''
      url.searchParams.set('reason', 'unauthorized')
      return NextResponse.redirect(url, 303)
    }
  }
  if (local) return NextResponse.next()
  const origin = normalizeAdminOrigin(process.env.NEXT_PUBLIC_ADMIN_URL)
  if (!origin) return NextResponse.next()
  return NextResponse.rewrite(buildAdminDestination(request.url, origin), { request: { headers: buildAdminRequestHeaders(request.headers, origin) } })
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }
