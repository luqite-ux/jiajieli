import { NextResponse } from 'next/server'
import { createPublicSupabaseClient, getTenantId } from '@/lib/supabase'
import { verifyCaptcha } from '@/lib/inquiry-captcha'

async function notifyInquiryEmail(tenantId: string, inquiryId: string) {
  const secret = process.env.INQUIRY_NOTIFY_SECRET?.trim()
  const adminUrl = (process.env.HUANQIU_ADMIN_URL ?? process.env.NEXT_PUBLIC_ADMIN_URL)?.trim().replace(/\/$/, '')
  if (!secret || !adminUrl) return

  try {
    const response = await fetch(`${adminUrl}/api/inquiries/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-inquiry-notify-secret': secret,
      },
      body: JSON.stringify({ tenantId, inquiryId }),
    })
    if (!response.ok) {
      console.warn('[inquiries] notification request failed', response.status)
    }
  } catch (error) {
    console.warn('[inquiries] notification request error', error)
  }
}
export async function POST(request: Request) {
  const form = await request.formData()
  const productSlug = String(form.get('productSlug') || '')
  const productName = String(form.get('productName') || '')
  const productInterest = String(form.get('productInterest') || 'General')
  const captchaSecret = process.env.CAPTCHA_SECRET?.trim()
  if (!captchaSecret) {
    return NextResponse.json({ error: 'Verification service is temporarily unavailable.' }, { status: 503 })
  }
  const captcha = verifyCaptcha({
    secret: captchaSecret,
    token: String(form.get('captchaToken') || ''),
    answer: String(form.get('captchaAnswer') || ''),
  })
  if (!captcha.ok) {
    return NextResponse.json({ error: 'The verification code is incorrect or expired. Please try again.' }, { status: 400 })
  }
  const payload = {
    tenant_id: getTenantId(),
    name: String(form.get('name') || ''),
    company: String(form.get('company') || ''),
    email: String(form.get('email') || ''),
    phone: String(form.get('phone') || ''),
    subject: `JIAJIELI Inquiry - ${productName || productInterest}`,
    message: [
      String(form.get('message') || ''),
      `Country / Region: ${String(form.get('country') || '')}`,
      `Product Interest: ${productInterest}`,
      `Product Name: ${productName}`,
      `Product Slug: ${productSlug}`,
      `Estimated Quantity: ${String(form.get('estimatedQuantity') || '')}`,
      `Customization: ${String(form.get('customization') || '')}`,
    ].join('\n'),
    status: 'unread',
  }

  if (!payload.name || !payload.company || !payload.email || !payload.message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createPublicSupabaseClient()
  const inquiryId = crypto.randomUUID()
  const { error } = await supabase.from('inquiries').insert({ id: inquiryId, ...payload })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await notifyInquiryEmail(payload.tenant_id, inquiryId)
  return NextResponse.json({ ok: true })
}
