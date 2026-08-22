import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const tenantId = 'a1471a06-d1a8-4fe8-a12d-59cc6fe2b12b'
const inquiryId = 'd9038f93-c6e0-489b-8dd2-3a5a4886f970'
const email = 'qa+jiajieli-20260822@globle-trade.com'

for (const file of [
  'D:/Cursor/Grand/huanqiu-admin/.env.local',
  'D:/Cursor/Grand/huanqiu-admin/.env',
]) {
  if (!fs.existsSync(file)) continue
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const before = await supabase.from('inquiries').select('id,tenant_id,email,status').eq('tenant_id', tenantId).eq('id', inquiryId).eq('email', email).single()
if (before.error) throw before.error
const deletion = await supabase.from('inquiries').delete().eq('tenant_id', tenantId).eq('id', inquiryId).eq('email', email)
if (deletion.error) throw deletion.error
const residual = await supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('id', inquiryId).eq('email', email)
if (residual.error) throw residual.error
if (residual.count !== 0) throw new Error(`Delivery test cleanup failed: ${residual.count}`)
console.log(JSON.stringify({ verifiedBeforeDelete: before.data.id === inquiryId, tenantId: before.data.tenant_id, status: before.data.status, residualCount: residual.count }, null, 2))
