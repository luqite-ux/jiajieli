import Image from 'next/image'
import { notFound } from 'next/navigation'
import { SectionShell } from '@/components/section-shell'
import { InquiryForm } from '@/components/inquiry-form'
import { products } from '@/lib/data/products'
import { fetchProductBySlug, fetchProductCategories } from '@/lib/products-db'

export const revalidate = 60
export const dynamicParams = true

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, categories] = await Promise.all([fetchProductBySlug(slug), fetchProductCategories()])
  if (!product) notFound()
  const category = categories.find((item) => item.slug === product.categorySlug)

  return (
    <>
      <SectionShell className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff7ed]" eyebrow={category?.name} title={product.name} description={product.summary}>
        <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr]">
          <Image src={product.image} alt={product.name} width={800} height={700} className="aspect-square rounded-2xl object-cover shadow-lg" />
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-2xl font-semibold">Specifications</h2>
            <dl className="mt-5 divide-y divide-border">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid gap-2 py-3 sm:grid-cols-[160px_1fr]">
                  <dt className="text-sm font-semibold text-foreground">{spec.label}</dt>
                  <dd className="text-sm text-muted-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-6 font-heading text-xl font-semibold">Key Features</h3>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {product.features.map((feature) => <li key={feature}>- {feature}</li>)}
            </ul>
          </div>
        </div>
      </SectionShell>
      <SectionShell eyebrow="Product Inquiry" title="Request details for this product">
        <InquiryForm defaultProduct={product.categorySlug} />
      </SectionShell>
    </>
  )
}
