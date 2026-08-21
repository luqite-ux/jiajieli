import assert from 'node:assert/strict'
import test from 'node:test'

import {
  dedupeSourceProducts,
  extractProductListModule,
  normalizeSourceProduct,
} from '../lib/catalog/source-normalization.mjs'

function fixture(overrides = {}) {
  return {
    sourceUrl: 'https://www.alibaba.com/product-detail/example_160001.html?spm=test',
    sourceProductId: '160001',
    sourceTitle: 'PVC Bath Mat',
    sourceCategory: 'Bath Mats',
    sourceSpecs: { Material: 'PVC' },
    sourceImages: ['https://sc04.alicdn.com/example.jpg'],
    capturedAt: '2026-08-21T00:00:00.000Z',
    ...overrides,
  }
}

test('normalizes visible source fields and removes tracking parameters', () => {
  const product = normalizeSourceProduct(fixture({
    sourceTitle: '  PVC   Bath\nMat  ',
    sourceUrl: 'https://www.alibaba.com/product-detail/example_160001.html?spm=a2700&from=detail',
    sourceImages: [
      'https://sc04.alicdn.com/example.jpg?x-oss-process=image/resize,w_300',
      'https://sc04.alicdn.com/example.jpg?x-oss-process=image/resize,w_300',
    ],
  }))

  assert.equal(product.sourceTitle, 'PVC Bath Mat')
  assert.equal(product.sourceUrl, 'https://www.alibaba.com/product-detail/example_160001.html')
  assert.deepEqual(product.sourceImages, ['https://sc04.alicdn.com/example.jpg?x-oss-process=image/resize,w_300'])
  assert.match(product.contentHash, /^[a-f0-9]{64}$/)
})

test('deduplicates Alibaba product ids while keeping distinct product ids', () => {
  const result = dedupeSourceProducts([
    fixture({ sourceProductId: '1001', sourceTitle: 'PVC Bath Mat' }),
    fixture({ sourceProductId: '1001', sourceTitle: ' PVC Bath Mat ' }),
    fixture({
      sourceProductId: '1002',
      sourceTitle: 'PVC Bath Mat',
      sourceSpecs: { Material: 'PVC', Size: '70×40 cm' },
    }),
  ])

  assert.equal(result.products.length, 2)
  assert.equal(result.duplicates.length, 1)
  assert.equal(result.products[1].sourceSpecs.Size, '70×40 cm')
})

test('rejects incomplete products and prohibited service promises', () => {
  assert.throws(
    () => normalizeSourceProduct(fixture({ sourceTitle: '' })),
    /sourceTitle is required/,
  )
  assert.throws(
    () => normalizeSourceProduct(fixture({ sourceImages: [] })),
    /sourceImages must contain at least one image/,
  )
  assert.throws(
    () => normalizeSourceProduct(fixture({ sourceTitle: 'Bath mat with lifetime warranty' })),
    /prohibited service promise/,
  )
})

test('uses content rather than capture time for stable hashes', () => {
  const first = normalizeSourceProduct(fixture({ capturedAt: '2026-08-20T00:00:00.000Z' }))
  const second = normalizeSourceProduct(fixture({ capturedAt: '2026-08-21T00:00:00.000Z' }))

  assert.equal(first.contentHash, second.contentHash)
})

test('extracts the URL-encoded product-list module from Alibaba HTML', () => {
  const moduleData = {
    moduleData: {
      data: {
        pageNavView: { totalLines: 1, pageLines: 16, currentPage: 1 },
        productList: [{ id: 160001, subject: 'PVC Bath Mat' }],
      },
    },
  }
  const html = `<div module-name="icbu-pc-productListPc" module-data='${encodeURIComponent(JSON.stringify(moduleData))}'></div>`

  assert.deepEqual(extractProductListModule(html), moduleData.moduleData.data)
  assert.throws(() => extractProductListModule('<html></html>'), /product list module not found/)
})
