import { NextResponse } from 'next/server'
import { createPublicSupabaseClient, getTenantId } from '@/lib/supabase'

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
  const { error } = await supabase.from('inquiries').insert(payload)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
