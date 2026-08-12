import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Factory, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import { SectionShell } from '@/components/section-shell'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { StatCounter } from '@/components/stat-counter'
import { InquiryForm } from '@/components/inquiry-form'
import { applicationMarkets, company, proofStats } from '@/lib/data/company'
import { fetchPublishedArticles } from '@/lib/articles-db'
import { fetchProductCategories, fetchProducts } from '@/lib/products-db'

export const revalidate = 60

export default async function HomePage() {
  const [categories, products, newsPosts] = await Promise.all([
    fetchProductCategories(),
    fetchProducts(),
    fetchPublishedArticles(),
  ])

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(126,190,199,.32),transparent_28%),linear-gradient(135deg,#f8fcfb_0%,#eaf6f7_45%,#fff7ed_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,.75),transparent)] animate-[shine_8s_ease-in-out_infinite]" />
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8">
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm">
              <Sparkles className="size-4 text-accent" />
              Export-ready mat manufacturing
            </p>
            <h1 className="text-balance font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Premium Anti-Slip Mat Manufacturing for Global Buyers
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              JIAJIELI manufactures PVC and TPE bath mats, floor mats, door mats, and custom OEM/ODM mat programs from a 50,000+ sqm Yiwu production base.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/contact">Request a Quote <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white/70">
                <Link href="/products">Explore Products</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={140} className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/15 via-white/20 to-accent/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/65 p-3 shadow-2xl">
              <Image src="/images/factory-aerial.png" alt="JIAJIELI factory and production base" width={900} height={620} priority className="aspect-[4/3] rounded-[1.1rem] object-cover" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg backdrop-blur">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><p className="font-heading text-2xl font-semibold text-primary">30</p><p className="text-xs text-muted-foreground">Lines</p></div>
                  <div><p className="font-heading text-2xl font-semibold text-primary">1.8M</p><p className="text-xs text-muted-foreground">Monthly pcs</p></div>
                  <div><p className="font-heading text-2xl font-semibold text-primary">65%+</p><p className="text-xs text-muted-foreground">Export</p></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionShell eyebrow="Proof Points" title="Built for repeat B2B supply, not retail storefronts." description="Production capacity, compliance references, and customization support are structured around international purchasing teams.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {proofStats.map((stat) => <StatCounter key={stat.label} {...stat} />)}
        </div>
      </SectionShell>

      <SectionShell className="bg-secondary/50" eyebrow="Product Range" title="Core mat categories for bathroom, floor, entryway, and vehicle use.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((category, index) => (
            <Reveal key={category.slug} delay={index * 70} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <Link href={`/products?category=${category.slug}`} className="block">
                <Image src={category.image} alt={category.name} width={520} height={360} className="aspect-[4/3] w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-heading text-xl font-semibold text-foreground">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell eyebrow="Manufacturing" title="OEM/ODM support backed by 30 advanced production lines.">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            ['Custom Development', 'Colors, textures, die-cut shapes, packaging, and private-label requirements can be discussed per program.', Layers3],
            ['Production Capacity', 'About 1.8 million pieces per month, supported by Haitian customized injection molding equipment.', Factory],
            ['Inspection Process', 'Incoming materials, in-process checks, and pre-shipment inspection support export-grade consistency.', ShieldCheck],
          ].map(([title, text, Icon]) => (
            <div key={String(title)} className="rounded-2xl border border-border bg-card p-7">
              <Icon className="size-8 text-primary" />
              <h3 className="mt-5 font-heading text-xl font-semibold">{title as string}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text as string}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-gradient-to-br from-[#eaf7f8] via-white to-[#fff4e8]" eyebrow="Applications" title="Designed for sourcing programs across global channels.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {applicationMarkets.map((market) => (
            <div key={market.title} className="rounded-2xl border border-white bg-white/75 p-5 shadow-sm">
              <h3 className="font-heading font-semibold text-foreground">{market.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{market.description}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell eyebrow="Selected Products" title="Launch catalog highlights">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <Link key={product.slug} href={`/products/${product.slug}`} className="rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:shadow-lg">
              <Image src={product.image} alt={product.name} width={420} height={320} className="aspect-square rounded-xl object-cover" />
              <h3 className="mt-4 font-heading font-semibold text-foreground">{product.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{product.material}</p>
            </Link>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-secondary/45" eyebrow="Insights" title="Company updates and sourcing notes">
        <div className="grid gap-5 lg:grid-cols-3">
          {newsPosts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/news/${post.slug}`} className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <Image src={post.image} alt={post.title} width={520} height={320} className="aspect-video rounded-xl object-cover" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-accent">{post.category}</p>
              <h3 className="mt-2 font-heading text-lg font-semibold">{post.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="inquiry" eyebrow="Start a Program" title="Tell us what you want to source." description={`Email: ${company.contactEmail}`}>
        <InquiryForm compact />
      </SectionShell>
    </>
  )
}
