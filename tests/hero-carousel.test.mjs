import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('defines exactly three verified hero slides', async () => {
  const source = await readFile(new URL('../lib/hero-slides.ts', import.meta.url), 'utf8')
  for (const image of ['product-bathroom.webp', 'factory-line.webp', 'production-equipment.webp']) {
    assert.match(source, new RegExp(image.replace('.', '\\.')))
  }
  assert.match(source, /satisfies readonly HeroSlide\[\]/)
})

test('carousel is accessible, controllable and motion-aware', async () => {
  const source = await readFile(new URL('../components/home/hero-carousel.tsx', import.meta.url), 'utf8')
  assert.match(source, /aria-roledescription="carousel"/)
  assert.match(source, /Previous slide/)
  assert.match(source, /Next slide/)
  assert.match(source, /ArrowRight/)
  assert.match(source, /ArrowLeft/)
  assert.match(source, /useSyncExternalStore/)
  assert.match(source, /6000/)
  assert.equal((source.match(/<h1/g) ?? []).length, 1)
})
