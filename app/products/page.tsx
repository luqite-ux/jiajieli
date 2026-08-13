import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
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
    <div className="bg-[#eef8f9]">
      <section className="border-b border-border/70 bg-[linear-gradient(135deg,#f8fcfb_0%,#edf8f8_52%,#fff6ec_100%)]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8 lg:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Products</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                PVC and TPE mat programs for B2B sourcing.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Select a category to update the product results immediately below.
              </p>
            </div>
            <div className="rounded-full border border-primary/15 bg-white/75 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              {visibleProducts.length} of {products.length} products
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link
              href="/products"
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedCategory ? 'border-border bg-white text-muted-foreground hover:text-foreground' : 'border-primary bg-primary text-primary-foreground shadow-sm'}`}
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedCategory?.slug === category.slug ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {selectedCategory ? 'Filtered Results' : 'Launch Catalog'}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground">
              {selectedCategory ? `${selectedCategory.name} Products` : 'All Launch Products'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedCategory
                ? `${visibleProducts.length} matching products in this category.`
                : `${products.length} active products across ${categories.length} sourcing categories.`}
            </p>
          </div>
          {selectedCategory ? (
            <Button asChild variant="outline" className="w-fit rounded-full bg-white">
              <Link href="/products">Clear Filter</Link>
            </Button>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product) => {
            const category = categories.find((item) => item.slug === product.categorySlug)
            return (
              <article key={product.slug} className="flex rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex w-full flex-col">
                  <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}>
                    <Image src={product.image} alt={product.name} width={420} height={320} className="aspect-square rounded-xl object-cover transition hover:opacity-90" />
                  </Link>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-accent">{category?.name}</p>
                  <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-foreground">
                    <Link href={`/products/${product.slug}`} className="hover:text-primary">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{product.material}</p>
                  <Button asChild className="mt-auto w-full rounded-full">
                    <Link href={`/products/${product.slug}`}>
                      View Details
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
