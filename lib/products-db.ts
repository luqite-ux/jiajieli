import { createPublicSupabaseClient, getTenantId } from '@/lib/supabase'
import { categories as fallbackCategories, products as fallbackProducts, type Product, type ProductCategory } from '@/lib/data/products'

type CategoryRow = {
  slug: string
  name_i18n: Record<string, string> | null
  description_i18n: Record<string, string> | null
  image_url: string | null
}

type ProductRow = {
  slug: string
  name_i18n: Record<string, string> | null
  description_i18n: Record<string, string> | null
  overview_i18n: Record<string, string> | null
  features_i18n: Record<string, string[]> | null
  specs: Record<string, string> | Array<{ label: string; value: string }> | null
  image_url: string | null
  gallery: string[] | null
  material: string | null
  product_categories: { slug: string } | null
}

function pick<T>(value: Record<string, T> | null | undefined, fallback: T): T {
  return value?.en ?? Object.values(value ?? {})[0] ?? fallback
}

function normalizeSpecs(specs: ProductRow['specs']): Product['specs'] {
  if (Array.isArray(specs)) return specs
  return Object.entries(specs ?? {}).map(([label, value]) => ({ label, value: String(value) }))
}

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  try {
    const supabase = createPublicSupabaseClient()
    const { data, error } = await supabase
      .from('product_categories')
      .select('slug,name_i18n,description_i18n,image_url')
      .eq('tenant_id', getTenantId())
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data?.length) return fallbackCategories

    return (data as CategoryRow[]).map((category) => {
      const fallback = fallbackCategories.find((item) => item.slug === category.slug)
      return {
        slug: category.slug,
        name: pick(category.name_i18n, fallback?.name ?? category.slug),
        description: pick(category.description_i18n, fallback?.description ?? ''),
        image: category.image_url || fallback?.image || '/images/products/transparent-blue.png',
      }
    })
  } catch {
    return fallbackCategories
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const supabase = createPublicSupabaseClient()
    const { data, error } = await supabase
      .from('products')
      .select('slug,name_i18n,description_i18n,overview_i18n,features_i18n,specs,image_url,gallery,material,product_categories(slug)')
      .eq('tenant_id', getTenantId())
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data?.length) return fallbackProducts

    return (data as ProductRow[]).map((product) => {
      const fallback = fallbackProducts.find((item) => item.slug === product.slug)
      const image = product.image_url || fallback?.image || '/images/products/transparent-blue.png'
      const specs = normalizeSpecs(product.specs)
      return {
        slug: product.slug,
        name: pick(product.name_i18n, fallback?.name ?? product.slug),
        categorySlug: product.product_categories?.slug ?? fallback?.categorySlug ?? '',
        material: product.material ?? fallback?.material ?? 'PVC / TPE',
        image,
        gallery: product.gallery?.length ? product.gallery : fallback?.gallery ?? [image],
        features: pick(product.features_i18n, fallback?.features ?? []),
        specs: specs.length ? specs : fallback?.specs ?? [],
        summary: pick(product.overview_i18n, pick(product.description_i18n, fallback?.summary ?? '')),
      }
    })
  } catch {
    return fallbackProducts
  }
}

export async function fetchProductBySlug(slug: string) {
  const products = await fetchProducts()
  return products.find((product) => product.slug === slug)
}
