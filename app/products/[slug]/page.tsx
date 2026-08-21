import Link from 'next/link'
import type { Metadata } from 'next'
import { Check, ChevronRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { InquiryForm } from '@/components/inquiry-form'
import { ProductCard } from '@/components/product-card'
import { ProductGallery } from '@/components/product-gallery'
import { SectionShell } from '@/components/section-shell'
import { fetchProductBySlug, fetchProductCategories, fetchProducts } from '@/lib/products-db'
import { canonicalPath, siteUrl } from '@/lib/seo'

export const revalidate = 60
export const dynamicParams = true
export function generateStaticParams() { return [] }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) return { title: 'Product Not Found | JIAJIELI' }
  return {
    title: `${product.name} | JIAJIELI`,
    description: product.summary,
    alternates: { canonical: canonicalPath(`/products/${product.slug}`) },
    openGraph: { title: `${product.name} | JIAJIELI`, description: product.summary, type: 'website', url: canonicalPath(`/products/${product.slug}`), images: [product.image] },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, categories] = await Promise.all([fetchProductBySlug(slug), fetchProductCategories()])
  if (!product) notFound()
  const category = categories.find((item) => item.slug === product.categorySlug)
  const related = (await fetchProducts({ category: product.categorySlug })).filter((item) => item.slug !== product.slug).slice(0, 4)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.gallery,
    description: product.summary,
    sku: product.slug,
    category: category?.name,
    brand: { '@type': 'Brand', name: 'JIAJIELI' },
    manufacturer: { '@type': 'Organization', name: 'Zhejiang Jiajie Plastic Co., Ltd.', url: siteUrl },
    url: canonicalPath(`/products/${product.slug}`),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</gu, '\\u003c') }} />
      <section className="border-b border-[#c5d5d8] bg-[linear-gradient(135deg,#f8fcfb_0%,#e9f7f8_58%,#fff5e8_100%)] text-[#17363d]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1 text-sm text-[#536b70]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#275f6a]">Home</Link><ChevronRight className="size-4" />
            <Link href="/products" className="hover:text-[#275f6a]">Products</Link><ChevronRight className="size-4" />
            {category ? <><Link href={`/products?category=${category.slug}`} className="hover:text-[#275f6a]">{category.name}</Link><ChevronRight className="size-4" /></> : null}
            <span className="line-clamp-1" aria-current="page">{product.name}</span>
          </nav>
        </div>
      </section>

      <SectionShell headingLevel="h1" className="bg-[#eef8f9] text-[#17363d]" eyebrow={category?.name || 'Product'} title={product.name} description={product.summary}>
        <div className="grid gap-10 lg:grid-cols-[.92fr_1.08fr]">
          <ProductGallery images={product.gallery} productName={product.name} />
          <div className="rounded-2xl border border-[#c5d5d8] bg-white p-6 shadow-sm sm:p-8">
            {product.longDescription ? <><h2 className="font-heading text-2xl font-semibold">Product Overview</h2><p className="mt-4 text-sm leading-7 text-[#536b70]">{product.longDescription}</p></> : null}
            {product.specs.length ? <><h2 className="mt-8 font-heading text-2xl font-semibold">Specifications</h2><dl className="mt-4 divide-y divide-[#d7e2e4] border-y border-[#d7e2e4]">{product.specs.map((spec) => <div key={spec.label} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]"><dt className="text-sm font-semibold">{spec.label}</dt><dd className="text-sm text-[#536b70]">{spec.value}</dd></div>)}</dl></> : null}
            {product.features.length ? <><h2 className="mt-8 font-heading text-2xl font-semibold">Documented Features</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{product.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-[#3e5960]"><Check className="mt-0.5 size-4 shrink-0 text-[#275f6a]" />{feature}</li>)}</ul></> : null}
            {product.applications.length ? <><h2 className="mt-8 font-heading text-2xl font-semibold">Applications</h2><ul className="mt-4 flex flex-wrap gap-2">{product.applications.map((application) => <li key={application} className="rounded-full border border-[#8da5aa] bg-[#f7fbfb] px-4 py-2 text-sm text-[#3e5960]">{application}</li>)}</ul></> : null}
            <p className="mt-8 rounded-xl border border-[#d6a766] bg-[#fff7e8] p-4 text-sm leading-6 text-[#67410c]">Available specifications and customization details should be confirmed for this product during inquiry.</p>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="bg-white text-[#17363d]" eyebrow="Product Inquiry" title="Request specifications for this item" description="Include your target market, quantity, dimensions, colors, pattern, and packaging requirements.">
        <InquiryForm defaultProduct={product.slug} productName={product.name} categories={categories} />
      </SectionShell>

      {related.length ? <SectionShell className="bg-[#eef8f9] text-[#17363d]" eyebrow="Related Products" title={`More from ${category?.name || 'this category'}`}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.slug} product={item} categoryName={category?.name} />)}</div></SectionShell> : null}
    </>
  )
}
