import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, ClipboardCheck, Layers3, PackageCheck } from 'lucide-react'
import { SectionShell } from '@/components/section-shell'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { InquiryForm } from '@/components/inquiry-form'
import { applicationMarkets, company } from '@/lib/data/company'
import { faqItems } from '@/lib/data/faq'
import { factoryImages, oemSteps } from '@/lib/factory-content'
import { fetchPublishedArticles } from '@/lib/articles-db'
import { fetchProductCategories, fetchProducts } from '@/lib/products-db'
import { canonicalPath } from '@/lib/seo'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'JIAJIELI | Bath, Shower & Anti-Slip Mat Supplier',
  description: 'Explore JIAJIELI bath, shower, massage, sink, door, and anti-slip mat products for B2B sourcing and custom project discussion.',
  alternates: { canonical: canonicalPath('/') },
}

export default async function HomePage() {
  const [categories, products, newsPosts] = await Promise.all([fetchProductCategories(), fetchProducts(), fetchPublishedArticles()])
  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(126,190,199,.32),transparent_28%),linear-gradient(135deg,#f8fcfb_0%,#eaf6f7_45%,#fff7ed_100%)]">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8">
          <Reveal>
            <p className="mb-4 inline-flex rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-primary">Bath & household mat sourcing</p>
            <h1 className="text-balance font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">Mat Collections for Bathrooms, Sinks, Entryways & Custom Programs</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Browse JIAJIELI product images and specifications, then send the selected item, quantity, color, size, and packaging requirements for project review.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg" className="rounded-full"><Link href="/products">Explore Products <ArrowRight className="size-4" /></Link></Button><Button asChild size="lg" variant="outline" className="rounded-full bg-white/80"><Link href="/contact">Request a Quote</Link></Button></div>
          </Reveal>
          <Reveal delay={120} className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/70 p-3 shadow-2xl"><Image src={factoryImages.finishedStock} alt="Finished mat products at the JIAJIELI facility" width={1000} height={760} priority className="aspect-[4/3] rounded-[1.2rem] object-cover" /></Reveal>
        </div>
      </section>

      <SectionShell className="bg-secondary/50" eyebrow="Product Range" title="Find the right mat category faster.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{categories.slice(0, 6).map((category, index) => <Reveal key={category.slug} delay={index * 50} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><Link href={`/products?category=${category.slug}`} className="block"><Image src={category.image} alt={category.name} width={520} height={360} className="aspect-[4/3] w-full object-cover" /><div className="p-5"><h2 className="font-heading text-xl font-semibold text-card-foreground">{category.name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p></div></Link></Reveal>)}</div>
      </SectionShell>

      <SectionShell eyebrow="Selected Products" title="Real catalog products with image galleries and specifications.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0, 8).map((product) => <Link key={product.slug} href={`/products/${product.slug}`} className="rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:shadow-lg"><Image src={product.image} alt={product.name} width={420} height={320} className="aspect-square rounded-xl object-cover" /><h2 className="mt-4 font-heading font-semibold text-card-foreground">{product.name}</h2><p className="mt-2 text-sm text-muted-foreground">{product.material}</p></Link>)}</div>
        <div className="mt-8 text-center"><Button asChild variant="outline" className="rounded-full"><Link href="/products">View the full catalog <ArrowRight className="size-4" /></Link></Button></div>
      </SectionShell>

      <SectionShell className="bg-[#123b3f] text-white" eyebrow="Inside JIAJIELI" title="Factory imagery supplied by the customer." description="See the facility, production activity, equipment area, and finished-product storage in the manufacturing gallery.">
        <div className="grid gap-5 lg:grid-cols-2"><Image src={factoryImages.lineWide} alt="JIAJIELI production line" width={900} height={600} className="aspect-[3/2] rounded-2xl object-cover" /><Image src={factoryImages.productionMaterials} alt="Equipment and production materials at JIAJIELI" width={900} height={600} className="aspect-[3/2] rounded-2xl object-cover" /></div>
        <Button asChild className="mt-7 rounded-full bg-white text-[#123b3f] hover:bg-white/90"><Link href="/manufacturing">View Manufacturing <ArrowRight className="size-4" /></Link></Button>
      </SectionShell>

      <SectionShell eyebrow="OEM / ODM Workflow" title="A clear path from requirement to packing.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{oemSteps.map(([, title, description], index) => <div key={title} className="rounded-2xl border border-border bg-card p-6"><p className="text-sm font-semibold text-primary">0{index + 1}</p><h2 className="mt-3 font-heading text-lg font-semibold text-card-foreground">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p></div>)}</div>
      </SectionShell>

      <SectionShell className="bg-gradient-to-br from-[#eaf7f8] via-white to-[#fff4e8]" eyebrow="Applications" title="Product directions for different assortments."><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{applicationMarkets.map((market) => <div key={market.title} className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm"><h2 className="font-heading font-semibold text-foreground">{market.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{market.description}</p></div>)}</div></SectionShell>

      <SectionShell eyebrow="Order Review" title="Confirm the details that matter to your project."><div className="grid gap-5 md:grid-cols-3">{[[Layers3,'Product','Reference item, size, material, color, and surface direction.'],[ClipboardCheck,'Specification','Artwork, inspection points, destination market, and timing.'],[PackageCheck,'Packing','Labels, inserts, carton marks, and packing method.']].map(([Icon,title,text]) => { const IconComponent=Icon as typeof Layers3; return <div key={String(title)} className="rounded-2xl border border-border bg-card p-6"><IconComponent className="size-7 text-primary" /><h2 className="mt-5 font-heading text-lg font-semibold">{title as string}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{text as string}</p></div> })}</div></SectionShell>

      <SectionShell className="bg-secondary/45" eyebrow="FAQ" title="Common sourcing questions"><div className="grid gap-4 md:grid-cols-2">{faqItems.slice(0, 6).map((item) => <div key={item.question} className="rounded-2xl border border-border bg-card p-6"><h2 className="font-heading font-semibold text-card-foreground">{item.question}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p></div>)}</div></SectionShell>

      {newsPosts.length > 0 && <SectionShell eyebrow="News" title="Verified company updates"><div className="grid gap-5 lg:grid-cols-3">{newsPosts.slice(0,3).map((post) => <Link key={post.slug} href={`/news/${post.slug}`} className="rounded-2xl border border-border bg-card p-5"><p className="text-xs font-semibold uppercase tracking-wide text-primary">{post.date}</p><h2 className="mt-2 font-heading text-lg font-semibold">{post.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</p></Link>)}</div></SectionShell>}
      <SectionShell id="inquiry" eyebrow="Start an Inquiry" title="Tell us what you want to source." description={`Email: ${company.contactEmail}`}><InquiryForm compact /></SectionShell>
    </>
  )
}
