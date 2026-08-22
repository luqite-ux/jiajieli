import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('footer normalizes company punctuation before copyright suffix', async () => {
  const source = await readFile(new URL('../components/site-footer.tsx', import.meta.url), 'utf8')
  assert.match(source, /replace\(\/\[\\s.\]\+\$\/, ''\)/)
})

test('product mapping removes unsupported certification wording', async () => {
  const source = await readFile(new URL('../lib/products-db.ts', import.meta.url), 'utf8')
  assert.match(source, /sanitizeProductClaim/)
  assert.match(source, /TUV\\s\+Certified/)
  assert.match(source, /Certified/)
  assert.match(source, /cheap\|workable\|competitive\|best/)
  assert.match(source, /price/)
})

test('reveal content is visible without intersection observer activation', async () => {
  const source = await readFile(new URL('../components/reveal.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /opacity-0/)
  assert.doesNotMatch(source, /IntersectionObserver/)
})
