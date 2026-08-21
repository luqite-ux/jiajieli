import Link from 'next/link'
import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchProductCategories, fetchProducts } from '@/lib/products-db'
import { buildProductQueryHref, paginateProducts } from '@/lib/product-pagination'
import { canonicalPath } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Products | JIAJIELI Bath Mat Manufacturer',
  description: 'Browse JIAJIELI shower mats, massage bath mats, kids mats, sink mats, door mats, scrubber mats, and modular floor mats.',
  alternates: { canonical: canonicalPath('/products') },
}

type ProductSearch = { category?: string; material?: string; q?: string; page?: string }

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductSearch> }) {
  const params = await searchParams
  const [categories, allProducts] = await Promise.all([fetchProductCategories(), fetchProducts()])
  const materials = [...new Set(allProducts.map((product) => product.material).filter(Boolean))].sort()
  const filtered = allProducts.filter((product) => {
    if (params.category && product.categorySlug !== params.category) return false
    if (params.material && params.material !== 'all' && !product.material.toLowerCase().includes(params.material.toLowerCase())) return false
    if (params.q?.trim()) {
      const query = params.q.trim().toLowerCase()
      if (!`${product.name} ${product.material} ${product.summary}`.toLowerCase().includes(query)) return false
    }
    return true
  })
  const pagination = paginateProducts(filtered, Number(params.page || 1), 24)
  const selectedCategory = categories.find((category) => category.slug === params.category)

  return (
    <div className="min-h-screen bg-[#eef8f9] text-[#17363d]">
      <section className="border-b border-[#c5d5d8] bg-[linear-gradient(135deg,#f8fcfb_0%,#e8f6f7_55%,#fff5e8_100%)]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]">Product Catalog</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Bath and floor mat products for B2B sourcing</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#536b70]">Search and filter the catalog collected from JIAJIELI&apos;s public product range. Product-specific specifications remain linked to their original source records.</p>
            </div>
            <div className="rounded-full border border-[#8db0b7] bg-white px-5 py-2 text-sm font-semibold text-[#275f6a] shadow-sm">
              {filtered.length} matching products
            </div>
          </div>

          <form action="/products" className="mt-8 grid gap-3 rounded-2xl border border-[#c5d5d8] bg-white/90 p-4 shadow-sm md:grid-cols-[1fr_220px_auto]">
            {params.category ? <input type="hidden" name="category" value={params.category} /> : null}
            <label className="relative">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#536b70]" />
              <Input name="q" defaultValue={params.q} placeholder="Search by product, material, design, or use" className="pl-9" />
            </label>
            <label>
              <span className="sr-only">Filter by material</span>
              <select name="material" defaultValue={params.material || 'all'} className="h-10 w-full rounded-md border border-[#8da5aa] bg-white px-3 text-sm text-[#17363d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#275f6a]">
                <option value="all">All materials</option>
                {materials.map((material) => <option key={material} value={material}>{material}</option>)}
              </select>
            </label>
            <Button type="submit" className="rounded-full px-7">Apply Filters</Button>
          </form>

          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Product categories">
            <Link href={buildProductQueryHref({ material: params.material, q: params.q })} className={`rounded-full border px-4 py-2 text-sm font-semibold ${!params.category ? 'border-[#275f6a] bg-[#275f6a] text-white' : 'border-[#8da5aa] bg-white text-[#3e5960] hover:border-[#275f6a]'}`}>All Products</Link>
            {categories.map((category) => (
              <Link key={category.slug} href={buildProductQueryHref({ category: category.slug, material: params.material, q: params.q })} className={`rounded-full border px-4 py-2 text-sm font-semibold ${params.category === category.slug ? 'border-[#275f6a] bg-[#275f6a] text-white' : 'border-[#8da5aa] bg-white text-[#3e5960] hover:border-[#275f6a]'}`}>
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b45309]">{selectedCategory?.name || 'All categories'}</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold">{filtered.length ? `Page ${pagination.page} of ${pagination.totalPages}` : 'No matching products'}</h2>
          </div>
          {(params.category || params.material || params.q) ? <Button asChild variant="outline" className="rounded-full bg-white"><Link href="/products">Clear all</Link></Button> : null}
        </div>

        {pagination.items.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pagination.items.map((product) => <ProductCard key={product.slug} product={product} categoryName={categories.find((category) => category.slug === product.categorySlug)?.name} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#c5d5d8] bg-white p-10 text-center">
            <p className="text-lg font-semibold">No products match these filters.</p>
            <p className="mt-2 text-sm text-[#536b70]">Clear one or more filters, or send an inquiry for a custom sourcing request.</p>
          </div>
        )}

        {pagination.totalPages > 1 ? (
          <nav className="mt-10 flex flex-wrap justify-center gap-2" aria-label="Product pagination">
            {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((page) => (
              <Link key={page} href={buildProductQueryHref({ category: params.category, material: params.material, q: params.q, page })} aria-current={page === pagination.page ? 'page' : undefined} className={`flex size-10 items-center justify-center rounded-full border text-sm font-semibold ${page === pagination.page ? 'border-[#275f6a] bg-[#275f6a] text-white' : 'border-[#8da5aa] bg-white text-[#3e5960] hover:border-[#275f6a]'}`}>{page}</Link>
            ))}
          </nav>
        ) : null}
      </main>
    </div>
  )
}
