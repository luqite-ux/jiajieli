import { createPublicSupabaseClient, getTenantId } from '@/lib/supabase'
import { pickLocalized } from '@/lib/i18n'
import type { Product, ProductCategory } from '@/lib/data/products'

type CategoryRow = {
  slug: string
  name_i18n: Record<string, string> | null
  description_i18n: Record<string, string> | null
}

type ProductRow = {
  slug: string
  name_i18n: Record<string, string> | null
  description_i18n: Record<string, string> | null
  overview_i18n: Record<string, string> | null
  features_i18n: Record<string, string[]> | null
  applications_i18n: Record<string, string[]> | null
  advantages_i18n: Record<string, string[]> | null
  specs: Record<string, string> | Array<{ label: string; value: string }> | null
  image_url: string | null
  category_slug: string | null
  extra_data: { images?: string[]; source_urls?: string[] } | null
}

export type ProductQuery = {
  locale?: string
  defaultLocale?: string
  category?: string
  material?: string
  query?: string
}

function normalizeSpecs(specs: ProductRow['specs']): Product['specs'] {
  if (Array.isArray(specs)) return specs.filter((spec) => spec.label && spec.value)
  return Object.entries(specs ?? {})
    .filter(([label, value]) => label && value)
    .map(([label, value]) => ({ label, value: String(value) }))
}

function sanitizeProductClaim(value: string) {
  return value
    .replace(/\bTUV\s+Certified\b/gi, '')
    .replace(/\bCertified\b/gi, '')
    .replace(/\b(?:cheap|workable|competitive|best)\s+price\b/gi, '')
    .replace(/\bprice\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function sanitizeProductList(values: string[]) {
  return values.map(sanitizeProductClaim).filter(Boolean)
}

function mapProduct(row: ProductRow, locale: string, defaultLocale: string): Product {
  const specs = normalizeSpecs(row.specs)
  const image = row.image_url ?? row.extra_data?.images?.[0] ?? ''
  const description = sanitizeProductClaim(pickLocalized(row.description_i18n, locale, defaultLocale, ''))
  return {
    slug: row.slug,
    name: sanitizeProductClaim(pickLocalized(row.name_i18n, locale, defaultLocale, row.slug)),
    categorySlug: row.category_slug ?? '',
    material: specs.find((spec) => spec.label.toLowerCase() === 'material')?.value ?? '',
    image,
    gallery: row.extra_data?.images?.length ? row.extra_data.images : image ? [image] : [],
    features: sanitizeProductList(pickLocalized(row.features_i18n, locale, defaultLocale, [])),
    applications: sanitizeProductList(pickLocalized(row.applications_i18n, locale, defaultLocale, [])),
    advantages: sanitizeProductList(pickLocalized(row.advantages_i18n, locale, defaultLocale, [])),
    specs,
    summary: sanitizeProductClaim(pickLocalized(row.overview_i18n, locale, defaultLocale, description)),
    longDescription: description,
    sourceUrls: row.extra_data?.source_urls ?? [],
  }
}

export async function fetchProductCategories(locale = 'en', defaultLocale = 'en'): Promise<ProductCategory[]> {
  const supabase = createPublicSupabaseClient()
  const [{ data: categoryRows, error: categoryError }, { data: productRows, error: productError }] = await Promise.all([
    supabase
      .from('product_categories')
      .select('slug,name_i18n,description_i18n')
      .eq('tenant_id', getTenantId())
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('products')
      .select('category_slug,image_url')
      .eq('tenant_id', getTenantId())
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ])
  if (categoryError) throw new Error(`Unable to load product categories: ${categoryError.message}`)
  if (productError) throw new Error(`Unable to load category images: ${productError.message}`)

  const firstImageByCategory = new Map<string, string>()
  for (const product of productRows ?? []) {
    if (product.category_slug && product.image_url && !firstImageByCategory.has(product.category_slug)) {
      firstImageByCategory.set(product.category_slug, product.image_url)
    }
  }
  return ((categoryRows ?? []) as CategoryRow[]).map((category) => ({
    slug: category.slug,
    name: pickLocalized(category.name_i18n, locale, defaultLocale, category.slug),
    description: pickLocalized(category.description_i18n, locale, defaultLocale, ''),
    image: firstImageByCategory.get(category.slug) ?? '',
  }))
}

export async function fetchProducts(options: ProductQuery = {}): Promise<Product[]> {
  const locale = options.locale ?? 'en'
  const defaultLocale = options.defaultLocale ?? 'en'
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .select('slug,name_i18n,description_i18n,overview_i18n,features_i18n,applications_i18n,advantages_i18n,specs,image_url,category_slug,extra_data')
    .eq('tenant_id', getTenantId())
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) throw new Error(`Unable to load products: ${error.message}`)

  let products = ((data ?? []) as ProductRow[]).map((row) => mapProduct(row, locale, defaultLocale))
  if (options.category) products = products.filter((product) => product.categorySlug === options.category)
  if (options.material) products = products.filter((product) => product.material.toLowerCase().includes(options.material!.toLowerCase()))
  if (options.query) {
    const query = options.query.toLowerCase()
    products = products.filter((product) => `${product.name} ${product.material} ${product.summary}`.toLowerCase().includes(query))
  }
  return products
}

export async function fetchProductBySlug(slug: string, locale = 'en', defaultLocale = 'en') {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .select('slug,name_i18n,description_i18n,overview_i18n,features_i18n,applications_i18n,advantages_i18n,specs,image_url,category_slug,extra_data')
    .eq('tenant_id', getTenantId())
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw new Error(`Unable to load product ${slug}: ${error.message}`)
  return data ? mapProduct(data as ProductRow, locale, defaultLocale) : undefined
}
