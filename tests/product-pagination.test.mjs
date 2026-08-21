import assert from 'node:assert/strict'
import test from 'node:test'

import { buildProductQueryHref, paginateProducts } from '../lib/product-pagination.ts'

test('paginates products and clamps page numbers to available results', () => {
  const products = Array.from({ length: 50 }, (_, index) => ({ slug: `product-${index + 1}` }))

  const second = paginateProducts(products, 2, 24)
  assert.deepEqual(second.items.map((product) => product.slug), Array.from({ length: 24 }, (_, index) => `product-${index + 25}`))
  assert.equal(second.page, 2)
  assert.equal(second.totalPages, 3)

  const clamped = paginateProducts(products, 99, 24)
  assert.equal(clamped.page, 3)
  assert.equal(clamped.items.length, 2)
})

test('builds shareable filter links while dropping empty and reset values', () => {
  assert.equal(
    buildProductQueryHref({ category: 'sink-mats', material: 'PVC', q: 'drain mat', page: 2 }),
    '/products?category=sink-mats&material=PVC&q=drain+mat&page=2',
  )
  assert.equal(
    buildProductQueryHref({ category: '', material: 'all', q: '  ', page: 1 }),
    '/products',
  )
})
