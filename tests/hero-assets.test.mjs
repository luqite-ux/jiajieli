import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('defines exactly three bright hero subjects without qualification claims', async () => {
  const manifest = JSON.parse(
    await readFile(new URL('../data/sources/jiajieli-hero-assets.json', import.meta.url), 'utf8'),
  )

  assert.deepEqual(
    manifest.map((item) => item.id),
    ['product-bathroom', 'factory-line', 'production-equipment'],
  )
  assert.equal(manifest.length, 3)

  for (const item of manifest) {
    assert.match(item.localPath, /^public\/images\/hero\/.+\.webp$/)
    assert.match(item.r2Key, /^tenants\/jiajieli\/hero\/.+\.webp$/)
    assert.equal(item.width, 1920)
    assert.equal(item.height, 1080)
    assert.match(item.sha256, /^[a-f0-9]{64}$/)
    assert.doesNotMatch(JSON.stringify(item), /certificate|qualification|warrant|guarantee/i)
  }
})
