export type ProductCategory = {
  slug: string
  name: string
  description: string
  image: string
}

export type Product = {
  slug: string
  name: string
  categorySlug: string
  material: string
  image: string
  gallery: string[]
  features: string[]
  applications: string[]
  advantages: string[]
  specs: { label: string; value: string }[]
  summary: string
  longDescription?: string
  sourceUrls: string[]
}

export const categories: ProductCategory[] = [
  ['shower-bath-mats', 'Shower & Bath Mats'],
  ['massage-bath-mats', 'Massage Bath Mats'],
  ['kids-cartoon-bath-mats', 'Kids & Cartoon Bath Mats'],
  ['sink-mats', 'Sink Mats'],
  ['door-mats', 'Door & Coil Mats'],
  ['scrubber-mats', 'Scrubber & Brush Mats'],
  ['modular-floor-mats', 'Modular Floor Mats'],
].map(([slug, name]) => ({ slug, name, description: '', image: '' }))

// Production catalog data comes from Supabase. Keep this export empty so a
// database/query failure cannot silently republish the old demo catalog.
export const products: Product[] = []
