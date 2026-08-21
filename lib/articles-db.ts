import { createPublicSupabaseClient, getTenantId } from '@/lib/supabase'
import type { NewsPost } from '@/lib/data/news'

type ArticleRow = {
  slug: string
  title_i18n: Record<string, string> | null
  excerpt_i18n: Record<string, string> | null
  content_i18n: Record<string, string | string[]> | null
  featured_image: string | null
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
      .select('slug,title_i18n,excerpt_i18n,content_i18n,featured_image,published_at,created_at')
      .eq('tenant_id', getTenantId())
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })

    if (error) throw error
    if (!data?.length) return []

    return (data as ArticleRow[]).map((article) => {
      const content = pick(article.content_i18n, [])
      return {
        slug: article.slug,
        title: pick(article.title_i18n, article.slug),
        date: (article.published_at ?? article.created_at).slice(0, 10),
        category: 'News',
        excerpt: pick(article.excerpt_i18n, ''),
        image: article.featured_image ?? '/images/factory-aerial.png',
        body: paragraphs(content, []),
      }
    })
  } catch (error) {
    console.error('Unable to load published articles', error)
    return []
  }
}

export async function fetchArticleBySlug(slug: string) {
  const articles = await fetchPublishedArticles()
  return articles.find((article) => article.slug === slug)
}
