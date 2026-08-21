import assert from 'node:assert/strict'
import test from 'node:test'

import { buildUploadPlan } from '../lib/catalog/upload-plan.mjs'

test('uploads duplicate product image hashes once and preserves every reference', () => {
  const plan = buildUploadPlan([
    { sourceProductId: '1', role: 'primary', outputSha256: 'a'.repeat(64), localPath: 'D:/a.webp' },
    { sourceProductId: '2', role: 'gallery', outputSha256: 'a'.repeat(64), localPath: 'D:/a-copy.webp' },
  ], 'https://assets.example.com')

  assert.equal(plan.uploads.length, 1)
  assert.equal(plan.references.length, 2)
  assert.equal(plan.uploads[0].r2Key, `tenants/jiajieli/catalog/shared/${'a'.repeat(64)}.webp`)
  assert.equal(plan.references[0].publicUrl, `https://assets.example.com/tenants/jiajieli/catalog/shared/${'a'.repeat(64)}.webp`)
  assert.equal(plan.references[1].publicUrl, plan.references[0].publicUrl)
})

test('keeps factory image roles on stable readable R2 keys', () => {
  const plan = buildUploadPlan([
    {
      role: 'factory-exterior-wide',
      outputSha256: 'b'.repeat(64),
      localPath: 'D:/factory.webp',
      r2Key: 'tenants/jiajieli/factory/factory-exterior-wide.webp',
    },
  ], 'https://assets.example.com/')

  assert.equal(plan.uploads[0].r2Key, 'tenants/jiajieli/factory/factory-exterior-wide.webp')
  assert.equal(plan.references[0].publicUrl, 'https://assets.example.com/tenants/jiajieli/factory/factory-exterior-wide.webp')
})
