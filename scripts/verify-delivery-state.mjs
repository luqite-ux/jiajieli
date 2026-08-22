import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const tenantId = 'a1471a06-d1a8-4fe8-a12d-59cc6fe2b12b'
for (const file of ['D:/Cursor/Grand/huanqiu-admin/.env.local', 'D:/Cursor/Grand/huanqiu-admin/.env']) {
  if (!fs.existsSync(file)) continue
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const [tenant, admin, product, article, inquiry] = await Promise.all([
  db.from('tenants').select('display_name,admin_group,default_language,supported_languages,logo_url,favicon_url,contact_email').eq('id', tenantId).single(),
  db.from('admin_users').select('email,is_active,admin_group').eq('tenant_id', tenantId).eq('email', 'info@jiajiebathmat.com').single(),
  db.from('products').select('name_i18n,description_i18n').eq('tenant_id', tenantId).eq('id', '4a862f2d-a528-42e5-94d4-ce8614c66460').single(),
  db.from('articles').select('title_i18n,excerpt_i18n,is_published').eq('tenant_id', tenantId).eq('id', '9fc6614e-c4df-4d08-a014-3b40d92faa03').single(),
  db.from('inquiries').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('email', 'qa+jiajieli-20260822@globle-trade.com'),
])
for (const result of [tenant, admin, product, article, inquiry]) if (result.error) throw result.error
const checks = {
  displayName: tenant.data.display_name === '浙江佳洁塑胶有限公司',
  adminGroup: tenant.data.admin_group === 2 && admin.data.admin_group === 2,
  languages: tenant.data.default_language === 'en' && tenant.data.supported_languages.includes('en') && tenant.data.supported_languages.includes('zh'),
  media: Boolean(tenant.data.logo_url && tenant.data.favicon_url),
  contact: tenant.data.contact_email === 'info@jiajiebathmat.com' && admin.data.is_active,
  productTranslation: Boolean(product.data.name_i18n?.en && product.data.name_i18n?.zh && product.data.description_i18n?.en && product.data.description_i18n?.zh),
  articleTranslation: Boolean(article.data.title_i18n?.en && article.data.title_i18n?.zh && article.data.excerpt_i18n?.en && article.data.excerpt_i18n?.zh),
  articleRemainsDraft: article.data.is_published === false,
  testInquiryRemoved: inquiry.count === 0,
}
if (Object.values(checks).some((value) => !value)) throw new Error(`Delivery state mismatch: ${JSON.stringify(checks)}`)
console.log(JSON.stringify({ tenantId, checks }, null, 2))
