import assert from 'node:assert/strict'
import test from 'node:test'

import { buildCatalog, classifyProduct, parseProductFacts } from '../lib/catalog/catalog-mapping.mjs'

test('parses only material and size facts present in the Alibaba title', () => {
  assert.deepEqual(
    parseProductFacts('Extra Long 100X40CM PVC and TPE Non-Slip Shower Mat'),
    { material: 'PVC / TPE', size: '100×40 cm' },
  )
  assert.deepEqual(parseProductFacts('Cartoon Bath Mat'), { material: '', size: '' })
})

test('classifies products by buyer-facing use before generic title terms', () => {
  assert.equal(classifyProduct('PVC sink protector mat with drain holes'), 'sink-mats')
  assert.equal(classifyProduct('Silicone back scrubber bath brush'), 'scrubber-mats')
  assert.equal(classifyProduct('Kids sea turtle PVC shower mat'), 'kids-cartoon-bath-mats')
  assert.equal(classifyProduct('PVC stone massage bath mat'), 'massage-bath-mats')
  assert.equal(classifyProduct('Classic PVC shower mat'), 'shower-bath-mats')
})

test('merges only products with the same primary image, material, and size', () => {
  const sources = [
    source('1', '100x40cm PVC Cartoon Bath Mat', 'https://www.alibaba.com/product-detail/a_1.html'),
    source('2', 'PVC Cartoon Bath Mat 100×40 cm', 'https://www.alibaba.com/product-detail/b_2.html'),
    source('3', '100x40cm TPE Cartoon Bath Mat', 'https://www.alibaba.com/product-detail/c_3.html'),
  ]
  const references = [
    image('1', 'hash-a', 'https://assets.example.com/a.webp'),
    image('2', 'hash-a', 'https://assets.example.com/a.webp'),
    image('3', 'hash-a', 'https://assets.example.com/a.webp'),
  ]

  const catalog = buildCatalog(sources, references)

  assert.equal(catalog.products.length, 2)
  assert.deepEqual(catalog.products[0].extra_data.source_product_ids, ['1', '2'])
  assert.deepEqual(catalog.products[0].extra_data.source_urls, [
    'https://www.alibaba.com/product-detail/a_1.html',
    'https://www.alibaba.com/product-detail/b_2.html',
  ])
  assert.equal(catalog.products[0].specs.Material, 'PVC')
  assert.equal(catalog.products[0].specs.Size, '100×40 cm')
  assert.equal(catalog.products[1].specs.Material, 'TPE')
})

test('maps locale fields, provenance, and tenant-safe payloads', () => {
  const catalog = buildCatalog(
    [source('1', 'PVC Sink Mat with Drain Holes', 'https://www.alibaba.com/product-detail/a_1.html')],
    [
      image('1', 'hash-a', 'https://assets.example.com/a.webp'),
      { ...image('1', 'hash-b', 'https://assets.example.com/b.webp'), role: 'gallery' },
    ],
  )
  const product = catalog.products[0]

  assert.equal(product.tenant_id, 'a1471a06-d1a8-4fe8-a12d-59cc6fe2b12b')
  assert.equal(product.category_slug, 'sink-mats')
  assert.equal(product.name_i18n.en, product.name)
  assert.equal(product.description_i18n.en, product.description)
  assert.equal(product.overview_i18n.en, product.overview)
  assert.deepEqual(product.extra_data.images, [
    'https://assets.example.com/a.webp',
    'https://assets.example.com/b.webp',
  ])
  assert.equal(product.image_url, 'https://assets.example.com/a.webp')
  assert.equal(product.extra_data.multilingual_ready, true)
})

function source(id, title, url) {
  return {
    sourceProductId: id,
    sourceTitle: title,
    sourceUrl: url,
    sourceCategory: 'Ungrouped',
    sourceSpecs: {},
    sourceImages: [`https://source.example.com/${id}.jpg`],
    capturedAt: '2026-08-21T00:00:00.000Z',
    contentHash: id.padStart(64, '0'),
  }
}

function image(sourceProductId, outputSha256, publicUrl) {
  return { sourceProductId, outputSha256, publicUrl, role: 'primary' }
}
