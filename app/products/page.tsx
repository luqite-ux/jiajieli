import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SectionShell } from '@/components/section-shell'
import { Button } from '@/components/ui/button'
import { fetchProductCategories, fetchProducts } from '@/lib/products-db'
import { canonicalPath } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Products | JIAJIELI Anti-Slip Mats',
  description:
    'Browse JIAJIELI PVC and TPE bath mats, floor mats, door mats, massage mats, cartoon bath mats, and automotive accessories for B2B sourcing.',
  alternates: { canonical: canonicalPath('/products') },
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: selectedCategorySlug } = await searchParams
  const [categories, products] = await Promise.all([fetchProductCategories(), fetchProducts()])
  const selectedCategory = categories.find((category) => category.slug === selectedCategorySlug)
  const visibleProducts = selectedCategory
    ? products.filter((product) => product.categorySlug === selectedCategory.slug)
    : products

  return (
    <>
      <SectionShell className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff7ed]" eyebrow="Products" title="PVC and TPE mat programs for B2B sourcing." description="Browse launch products and send an inquiry for materials, custom colors, dimensions, packaging, and export documentation needs." />
      <SectionShell title={`${categories.length} Categories`} description={`${products.length} launch products are grouped by sourcing category. Some categories include multiple SKU options.`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/products?category=${category.slug}`} className={`rounded-2xl border bg-card p-4 transition hover:-translate-y-1 hover:shadow-lg ${selectedCategory?.slug === category.slug ? 'border-primary shadow-md ring-2 ring-primary/15' : 'border-border'}`}>
              <Image src={category.image} alt={category.name} width={360} height={260} className="aspect-[4/3] rounded-xl object-cover" />
              <h2 className="mt-4 font-heading text-lg font-semibold">{category.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </SectionShell>
      <SectionShell
        className="bg-secondary/45"
        title={selectedCategory ? `${visibleProducts.length} ${selectedCategory.name} Products` : `${products.length} Launch Products`}
        description={selectedCategory ? `Showing products under ${selectedCategory.name}.` : 'All launch SKUs from the current catalog.'}
      >
        {selectedCategory ? (
          <Button asChild variant="outline" className="mb-6 rounded-full bg-white">
            <Link href="/products">All Products</Link>
          </Button>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product) => {
            const category = categories.find((item) => item.slug === product.categorySlug)
            return (
              <article key={product.slug} className="rounded-2xl border border-border bg-card p-4">
                <Image src={product.image} alt={product.name} width={420} height={320} className="aspect-square rounded-xl object-cover" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-accent">{category?.name}</p>
                <h2 className="mt-2 font-heading text-lg font-semibold">{product.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{product.material}</p>
                <Button asChild className="mt-4 w-full rounded-full">
                  <Link href={`/products/${product.slug}`}>View Details</Link>
                </Button>
              </article>
            )
          })}
        </div>
      </SectionShell>
    </>
  )
}
