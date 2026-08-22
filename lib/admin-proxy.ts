export function normalizeAdminOrigin(value: string | undefined) {
  if (!value || /[\r\n]/.test(value)) return null
  try {
    const url = new URL(value.trim())
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null
    return url.origin
  } catch { return null }
}

export function buildAdminDestination(requestUrl: string, adminOrigin: string) {
  const request = new URL(requestUrl)
  const destination = new URL(adminOrigin)
  destination.pathname = request.pathname
  destination.search = request.search
  return destination
}

export function buildAdminRequestHeaders(incoming: Headers, adminOrigin: string) {
  const upstream = new URL(adminOrigin)
  const headers = new Headers(incoming)
  headers.set('origin', upstream.origin)
  headers.set('x-forwarded-host', upstream.host)
  return headers
}
