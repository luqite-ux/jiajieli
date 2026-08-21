export function paginateProducts<T>(items: T[], requestedPage: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.min(totalPages, Math.max(1, Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1))
  const start = (page - 1) * pageSize
  return { items: items.slice(start, start + pageSize), page, pageSize, totalPages, totalItems: items.length }
}

export function buildProductQueryHref(values: {
  category?: string
  material?: string
  q?: string
  page?: number
}) {
  const params = new URLSearchParams()
  if (values.category?.trim()) params.set('category', values.category.trim())
  if (values.material?.trim() && values.material !== 'all') params.set('material', values.material.trim())
  if (values.q?.trim()) params.set('q', values.q.trim())
  if (values.page && values.page > 1) params.set('page', String(Math.floor(values.page)))
  const query = params.toString()
  return query ? `/products?${query}` : '/products'
}
