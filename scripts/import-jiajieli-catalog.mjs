#!/usr/bin/env node
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

import { buildCatalog, TENANT_ID } from '../lib/catalog/catalog-mapping.mjs'

const ROOT = path.resolve(process.env.HUANQIU_ADMIN_ROOT || 'D:/Cursor/Grand/huanqiu-admin')
for (const envFile of [path.join(ROOT, '.env'), path.join(ROOT, '.env.local')]) {
  if (!fs.existsSync(envFile)) continue
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/u)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/u)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/gu, '')
  }
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase service credentials')
}

const sources = JSON.parse(await fsp.readFile('data/sources/jiajieli-alibaba-products.json', 'utf8'))
const images = JSON.parse(await fsp.readFile('.audit/jiajieli-uploaded-images.json', 'utf8'))
const catalog = buildCatalog(sources, images)
const prohibited = [/质保/iu, /保修/iu, /质量保证/iu, /\bwarrant(?:y|ies)\b/iu, /\bguarantee(?:d|s|ing)?\b/iu]
const serialized = JSON.stringify(catalog)
if (prohibited.some((pattern) => pattern.test(serialized))) throw new Error('Catalog contains prohibited service-promise content')
if (catalog.products.some((product) => product.tenant_id !== TENANT_ID)) throw new Error('Cross-tenant product payload detected')
if (catalog.categories.some((category) => category.tenant_id !== TENANT_ID)) throw new Error('Cross-tenant category payload detected')

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const [tenantResult, existingProductsResult, existingCategoriesResult] = await Promise.all([
  supabase.from('tenants').select('id,display_name,domain,admin_group,default_language,supported_languages').eq('id', TENANT_ID).single(),
  supabase.from('products').select('id,slug,is_active,extra_data').eq('tenant_id', TENANT_ID),
  supabase.from('product_categories').select('id,slug,is_active,extra_data').eq('tenant_id', TENANT_ID),
])
for (const result of [tenantResult, existingProductsResult, existingCategoriesResult]) if (result.error) throw result.error
if (tenantResult.data.admin_group !== 2) throw new Error(`Unexpected admin_group ${tenantResult.data.admin_group}`)

const nextSlugs = new Set(catalog.products.map((product) => product.slug))
const deactivateProductIds = existingProductsResult.data
  .filter((product) => !nextSlugs.has(product.slug) && ['jiajieli', 'jiajieli-alibaba-2026-08-21'].includes(product.extra_data?.delivery_key))
  .map((product) => product.id)
const legacyCategorySlugs = new Set([
  'bathroom-anti-slip-mat', 'kids-bath-mat', 'floor-mat', 'cartoon-bath-mat',
  'massage-anti-slip-mat', 'door-mat', 'automotive-accessories',
])
const nextCategorySlugs = new Set(catalog.categories.map((category) => category.slug))
const deactivateCategoryIds = existingCategoriesResult.data
  .filter((category) => legacyCategorySlugs.has(category.slug) && !nextCategorySlugs.has(category.slug))
  .map((category) => category.id)

await fsp.mkdir('.audit', { recursive: true })
await fsp.writeFile('.audit/jiajieli-catalog-payload.json', `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')

const summary = {
  mode: process.argv.includes('--apply') ? 'apply' : 'check',
  tenant: tenantResult.data,
  sourceListings: sources.length,
  categories: catalog.categories.length,
  products: catalog.products.length,
  mergedSourceLinks: sources.length - catalog.products.length,
  existingProducts: existingProductsResult.data.length,
  existingCategories: existingCategoriesResult.data.length,
  deactivateProducts: deactivateProductIds.length,
  deactivateCategories: deactivateCategoryIds.length,
}

const apply = process.argv.includes('--apply')
if (!apply) {
  console.log(JSON.stringify(summary, null, 2))
}

if (apply) {
for (let index = 0; index < catalog.categories.length; index += 50) {
  const result = await supabase.from('product_categories').upsert(catalog.categories.slice(index, index + 50), { onConflict: 'tenant_id,slug' })
  if (result.error) throw result.error
}
for (let index = 0; index < catalog.products.length; index += 40) {
  const result = await supabase.from('products').upsert(catalog.products.slice(index, index + 40), { onConflict: 'tenant_id,slug' })
  if (result.error) throw result.error
  console.log(`upserted ${Math.min(index + 40, catalog.products.length)}/${catalog.products.length}`)
}
if (deactivateProductIds.length) {
  const result = await supabase.from('products').update({ is_active: false }).eq('tenant_id', TENANT_ID).in('id', deactivateProductIds)
  if (result.error) throw result.error
}
if (deactivateCategoryIds.length) {
  const result = await supabase.from('product_categories').update({ is_active: false }).eq('tenant_id', TENANT_ID).in('id', deactivateCategoryIds)
  if (result.error) throw result.error
}

const [productsRead, categoriesRead, tenantRead] = await Promise.all([
  supabase.from('products').select('id,tenant_id,slug,name_i18n,image_url,extra_data,is_active').eq('tenant_id', TENANT_ID).eq('is_active', true),
  supabase.from('product_categories').select('id,tenant_id,slug,name_i18n,is_active').eq('tenant_id', TENANT_ID).eq('is_active', true),
  supabase.from('tenants').select('id,display_name,domain,admin_group,default_language,supported_languages').eq('id', TENANT_ID).single(),
])
for (const result of [productsRead, categoriesRead, tenantRead]) if (result.error) throw result.error
if (productsRead.data.length !== catalog.products.length) throw new Error(`Expected ${catalog.products.length} active products, read ${productsRead.data.length}`)
if (categoriesRead.data.length !== catalog.categories.length) throw new Error(`Expected ${catalog.categories.length} active categories, read ${categoriesRead.data.length}`)
if (productsRead.data.some((product) => product.tenant_id !== TENANT_ID || !product.name_i18n?.en || !product.image_url?.includes('/tenants/jiajieli/'))) {
  throw new Error('Product readback validation failed')
}
console.log(JSON.stringify({ ...summary, readbackProducts: productsRead.data.length, readbackCategories: categoriesRead.data.length, tenantRead: tenantRead.data }, null, 2))
}
