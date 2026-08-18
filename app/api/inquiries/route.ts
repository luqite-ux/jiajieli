import { NextResponse } from 'next/server'
import { createPublicSupabaseClient, getTenantId } from '@/lib/supabase'

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
  const payload = {
    tenant_id: getTenantId(),
    name: String(form.get('name') || ''),
    company: String(form.get('company') || ''),
    email: String(form.get('email') || ''),
    phone: String(form.get('phone') || ''),
    subject: `JIAJIELI Inquiry - ${String(form.get('productInterest') || 'General')}`,
    message: [
      String(form.get('message') || ''),
      `Country / Region: ${String(form.get('country') || '')}`,
      `Product Interest: ${String(form.get('productInterest') || '')}`,
      `Estimated Quantity: ${String(form.get('estimatedQuantity') || '')}`,
      `Customization: ${String(form.get('customization') || '')}`,
    ].join('\n'),
    status: 'unread',
  }

  if (!payload.name || !payload.company || !payload.email || !payload.message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.from('inquiries').insert(payload).select('id').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (data?.id) await notifyInquiryEmail(payload.tenant_id, data.id)
  return NextResponse.json({ ok: true })
}
