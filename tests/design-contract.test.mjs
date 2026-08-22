import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8')

test('uses a bright branded shell with readable official logos', async () => {
  const [css, header, footer, nav] = await Promise.all([
    read('app/globals.css'),
    read('components/site-header.tsx'),
    read('components/site-footer.tsx'),
    read('lib/data/nav.ts'),
  ])

  assert.match(css, /--brand-aqua:/)
  assert.match(css, /--brand-teal-deep:/)
  assert.match(css, /\.water-texture/)
  assert.match(css, /prefers-reduced-motion: reduce/)
  assert.match(nav, /label: 'Home'/)
  assert.match(header, /h-10/)
  assert.match(header, /sm:h-11/)
  assert.match(header, /w-auto object-contain/)
  assert.match(header, /\/images\/logo-tight\.png/)
  assert.match(footer, /h-10/)
  assert.match(footer, /sm:h-12/)
  assert.match(footer, /w-auto object-contain/)
  assert.match(footer, /new Date\(\)\.getFullYear\(\)/)
  assert.match(footer, /company\.legalName/)
  assert.doesNotMatch(`${header}\n${footer}`, /price|cart|checkout|payment/i)
})
