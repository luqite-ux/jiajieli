import { mkdir, appendFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const form = await request.formData()
  const payload = {
    createdAt: new Date().toISOString(),
    name: String(form.get('name') || ''),
    company: String(form.get('company') || ''),
    email: String(form.get('email') || ''),
    phone: String(form.get('phone') || ''),
    country: String(form.get('country') || ''),
    productInterest: String(form.get('productInterest') || ''),
    estimatedQuantity: String(form.get('estimatedQuantity') || ''),
    customization: String(form.get('customization') || ''),
    message: String(form.get('message') || ''),
  }

  if (!payload.name || !payload.company || !payload.email || !payload.message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const dir = path.join(process.cwd(), '.data')
  await mkdir(dir, { recursive: true })
  await appendFile(path.join(dir, 'inquiries.jsonl'), `${JSON.stringify(payload)}\n`, 'utf8')
  return NextResponse.json({ ok: true })
}
