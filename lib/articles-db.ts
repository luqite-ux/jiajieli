import { createPublicSupabaseClient, getTenantId } from '@/lib/supabase'
import { newsPosts as fallbackPosts, type NewsPost } from '@/lib/data/news'

type ArticleRow = {
  slug: string
  title_i18n: Record<string, string> | null
  excerpt_i18n: Record<string, string> | null
  content_i18n: Record<string, string | string[]> | null
  image_url: string | null
  category: string | null
  published_at: string | null
  created_at: string
}

function pick<T>(value: Record<string, T> | null | undefined, fallback: T): T {
  return value?.en ?? Object.values(value ?? {})[0] ?? fallback
}

function paragraphs(content: string | string[] | null | undefined, fallback: string[]) {
  if (Array.isArray(content)) return content
  if (typeof content === 'string') {
    return content.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean)
  }
  return fallback
}

export async function fetchPublishedArticles(): Promise<NewsPost[]> {
  try {
    const supabase = createPublicSupabaseClient()
    const { data, error } = await supabase
      .from('articles')
      .select('slug,title_i18n,excerpt_i18n,content_i18n,image_url,category,published_at,created_at')
      .eq('tenant_id', getTenantId())
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })

    if (error || !data?.length) return fallbackPosts

    return (data as ArticleRow[]).map((article) => {
      const fallback = fallbackPosts.find((post) => post.slug === article.slug)
      const content = pick(article.content_i18n, fallback?.body ?? [])
      return {
        slug: article.slug,
        title: pick(article.title_i18n, fallback?.title ?? article.slug),
        date: (article.published_at ?? article.created_at).slice(0, 10),
        category: article.category ?? fallback?.category ?? 'News',
        excerpt: pick(article.excerpt_i18n, fallback?.excerpt ?? ''),
        image: article.image_url ?? fallback?.image ?? '/images/factory-aerial.png',
        body: paragraphs(content, fallback?.body ?? []),
      }
    })
  } catch {
    return fallbackPosts
  }
}

export async function fetchArticleBySlug(slug: string) {
  const articles = await fetchPublishedArticles()
  return articles.find((article) => article.slug === slug)
}
