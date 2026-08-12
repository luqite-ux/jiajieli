import Image from 'next/image'
import Link from 'next/link'
import { SectionShell } from '@/components/section-shell'
import { Button } from '@/components/ui/button'
import { categories, products, getCategoryBySlug } from '@/lib/data/products'

export default function ProductsPage() {
  return (
    <>
      <SectionShell className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff7ed]" eyebrow="Products" title="PVC and TPE mat programs for B2B sourcing." description="Browse launch products and send an inquiry for materials, custom colors, dimensions, packaging, and export documentation needs." />
      <SectionShell title="Categories">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/products?category=${category.slug}`} className="rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:shadow-lg">
              <Image src={category.image} alt={category.name} width={360} height={260} className="aspect-[4/3] rounded-xl object-cover" />
              <h2 className="mt-4 font-heading text-lg font-semibold">{category.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </SectionShell>
      <SectionShell className="bg-secondary/45" title="Launch Products">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const category = getCategoryBySlug(product.categorySlug)
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
