export type NewsPost = {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  image: string
  body: string[]
}

// Published news is loaded from Supabase. Keep static demo content out of the
// production site so only customer-approved articles can appear.
export const newsPosts: NewsPost[] = []

export function getNewsBySlug(slug: string) {
  return newsPosts.find((post) => post.slug === slug)
}
