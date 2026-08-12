import type { MetadataRoute } from 'next'
import { products } from '@/lib/data/products'
import { newsPosts } from '@/lib/data/news'

const baseUrl = 'https://www.jiajieli.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/about', '/products', '/manufacturing', '/quality-control', '/faq', '/news', '/contact']
  return [
    ...staticPages.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() })),
    ...products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, lastModified: new Date() })),
    ...newsPosts.map((post) => ({ url: `${baseUrl}/news/${post.slug}`, lastModified: new Date(post.date) })),
  ]
}
