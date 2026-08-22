import { NextResponse } from 'next/server'
import { createCaptcha } from '@/lib/inquiry-captcha'

export const dynamic = 'force-dynamic'

export async function GET() {
  const secret = process.env.CAPTCHA_SECRET?.trim()
  if (!secret) return NextResponse.json({ error: 'Verification service is temporarily unavailable.' }, { status: 503 })
  try {
    const { svg, token, expiresAt } = createCaptcha(secret)
    return NextResponse.json({ svg, token, expiresAt }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch {
    return NextResponse.json({ error: 'Verification service is temporarily unavailable.' }, { status: 503 })
  }
}
