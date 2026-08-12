import Image from 'next/image'
import { notFound } from 'next/navigation'
import { SectionShell } from '@/components/section-shell'
import { newsPosts } from '@/lib/data/news'
import { fetchArticleBySlug } from '@/lib/articles-db'

export const revalidate = 60
export const dynamicParams = true

export function generateStaticParams() {
  return newsPosts.map((post) => ({ slug: post.slug }))
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await fetchArticleBySlug(slug)
  if (!post) notFound()

  return (
    <SectionShell className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff7ed]" eyebrow={`${post.category} / ${post.date}`} title={post.title} description={post.excerpt}>
      <article className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 sm:p-8">
        <Image src={post.image} alt={post.title} width={900} height={520} className="aspect-video rounded-xl object-cover" />
        <div className="mt-8 space-y-5 text-base leading-8 text-muted-foreground">
          {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </article>
    </SectionShell>
  )
}
