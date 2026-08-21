import assert from 'node:assert/strict'
import test from 'node:test'

import { buildImagePlan, productSlug } from '../lib/catalog/image-manifest.mjs'

test('builds stable product slugs with source ids', () => {
  assert.equal(
    productSlug({ sourceTitle: 'PVC & TPE Bath Mat — Blue', sourceProductId: '160001' }),
    'pvc-tpe-bath-mat-blue-160001',
  )
})

test('keeps original SKU images and excludes Alibaba thumbnail derivatives', () => {
  const plan = buildImagePlan([{
    sourceTitle: 'PVC Bath Mat',
    sourceProductId: '160001',
    sourceImages: [
      'https://sc04.alicdn.com/kf/original-a.jpg',
      'https://sc04.alicdn.com/kf/original-a.jpg',
      'https://sc04.alicdn.com/kf/listing.jpg_350x350.jpg',
      'https://sc04.alicdn.com/kf/original-b.jpg',
    ],
  }], [])

  assert.equal(plan.products.length, 1)
  assert.deepEqual(plan.products[0].images.map((image) => image.sourceUrl), [
    'https://sc04.alicdn.com/kf/original-a.jpg',
    'https://sc04.alicdn.com/kf/listing.jpg',
    'https://sc04.alicdn.com/kf/original-b.jpg',
  ])
  assert.equal(plan.products[0].images[0].role, 'primary')
  assert.equal(plan.products[0].images[1].role, 'gallery')
  assert.equal(plan.products[0].images[0].r2Key, 'tenants/jiajieli/catalog/pvc-bath-mat-160001/primary.webp')
})

test('limits each product gallery to five images', () => {
  const plan = buildImagePlan([{
    sourceTitle: 'PVC Bath Mat',
    sourceProductId: '160001',
    sourceImages: Array.from({ length: 8 }, (_, index) => `https://sc04.alicdn.com/kf/${index}.jpg`),
  }], [])

  assert.equal(plan.products[0].images.length, 5)
})

test('restores an Alibaba original URL when only thumbnail derivatives are listed', () => {
  const plan = buildImagePlan([{
    sourceTitle: 'PVC Bath Mat',
    sourceProductId: '160001',
    sourceImages: [
      'https://sc04.alicdn.com/kf/listing/PVC-Bath-Mat.jpg_350x350.jpg',
      'https://sc04.alicdn.com/kf/listing/PVC-Bath-Mat.jpg_120x120.jpg',
    ],
  }], [])

  assert.deepEqual(plan.products[0].images.map((image) => image.sourceUrl), [
    'https://sc04.alicdn.com/kf/listing/PVC-Bath-Mat.jpg',
  ])
})

test('requires six unique factory roles and deterministic R2 keys', () => {
  const roles = [
    'factory-exterior-wide',
    'factory-exterior-detail',
    'injection-line-wide',
    'injection-line-detail',
    'production-and-materials',
    'finished-stock',
  ]
  const factory = roles.map((role, index) => ({
    role,
    sourcePath: `D:/factory/${index}.jpg`,
    alt: `${role} at Zhejiang Jiajie Plastic`,
  }))

  const plan = buildImagePlan([], factory)

  assert.equal(plan.factory.length, 6)
  assert.deepEqual(plan.factory.map((image) => image.r2Key), roles.map((role) => `tenants/jiajieli/factory/${role}.webp`))
  assert.throws(
    () => buildImagePlan([], factory.slice(0, 5)),
    /six factory image roles are required/,
  )
})
