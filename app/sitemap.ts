import type { MetadataRoute } from 'next'
import { fetchPublishedArticles } from '@/lib/articles-db'
import { fetchProducts } from '@/lib/products-db'
import { siteUrl } from '@/lib/seo'

const baseUrl = siteUrl

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, newsPosts] = await Promise.all([fetchProducts(), fetchPublishedArticles()])
  const staticPages = ['', '/about', '/products', '/manufacturing', '/oem-odm', '/quality-control', '/faq', '/news', '/contact']
  return [
    ...staticPages.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() })),
    ...products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, lastModified: new Date() })),
    ...newsPosts.map((post) => ({ url: `${baseUrl}/news/${post.slug}`, lastModified: new Date(post.date) })),
  ]
}
