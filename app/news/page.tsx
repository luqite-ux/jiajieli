import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SectionShell } from '@/components/section-shell'
import { fetchPublishedArticles } from '@/lib/articles-db'
import { canonicalPath } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'News | JIAJIELI Company Updates',
  description:
    'Read verified JIAJIELI company and product updates as they are published.',
  alternates: { canonical: canonicalPath('/news') },
}

export default async function NewsPage() {
  const newsPosts = await fetchPublishedArticles()

  return (
    <SectionShell headingLevel="h1" className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff7ed]" eyebrow="News" title="Company updates and sourcing insights">
      <div className="grid gap-5 md:grid-cols-2">
        {newsPosts.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 md:col-span-2">
            <h2 className="font-heading text-xl font-semibold text-foreground">No updates published yet</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Verified company and product updates will appear here after publication.</p>
          </div>
        )}
        {newsPosts.map((post) => (
          <Link key={post.slug} href={`/news/${post.slug}`} className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg">
            <Image src={post.image} alt={post.title} width={640} height={360} className="aspect-video rounded-xl object-cover" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-accent">{post.category} / {post.date}</p>
            <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">{post.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </SectionShell>
  )
}
