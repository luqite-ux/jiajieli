import { createHash } from 'node:crypto'

const prohibitedPatterns = [
  /质保/iu,
  /保修/iu,
  /质量保证/iu,
  /\bwarrant(?:y|ies)\b/iu,
  /\bguarantee(?:d|s|ing)?\b/iu,
]

function normalizeText(value) {
  return String(value ?? '').replace(/\s+/gu, ' ').trim()
}

function canonicalizeUrl(value) {
  const url = new URL(normalizeText(value))
  url.hash = ''
  for (const key of [...url.searchParams.keys()]) {
    if (/^(spm|from|scm|src|utm_)/iu.test(key)) url.searchParams.delete(key)
  }
  return url.toString().replace(/\?$/u, '')
}

function assertNoProhibitedPromise(value) {
  const serialized = JSON.stringify(value)
  if (prohibitedPatterns.some((pattern) => pattern.test(serialized))) {
    throw new Error('Product contains a prohibited service promise')
  }
}

function stableHash(product) {
  const hashable = {
    sourceUrl: product.sourceUrl,
    sourceProductId: product.sourceProductId,
    sourceTitle: product.sourceTitle,
    sourceCategory: product.sourceCategory,
    sourceSpecs: product.sourceSpecs,
    sourceImages: product.sourceImages,
  }
  return createHash('sha256').update(JSON.stringify(hashable)).digest('hex')
}

export function normalizeSourceProduct(raw) {
  const sourceTitle = normalizeText(raw?.sourceTitle)
  if (!sourceTitle) throw new Error('sourceTitle is required')

  const sourceUrl = canonicalizeUrl(raw?.sourceUrl)
  const sourceImages = [...new Set((raw?.sourceImages ?? []).map(normalizeText).filter(Boolean))]
  if (!sourceImages.length) throw new Error('sourceImages must contain at least one image')

  const sourceSpecs = Object.fromEntries(
    Object.entries(raw?.sourceSpecs ?? {})
      .map(([key, value]) => [normalizeText(key), normalizeText(value)])
      .filter(([key, value]) => key && value),
  )
  const product = {
    sourceUrl,
    sourceProductId: normalizeText(raw?.sourceProductId),
    sourceTitle,
    sourceCategory: normalizeText(raw?.sourceCategory),
    sourceSpecs,
    sourceImages,
    capturedAt: new Date(raw?.capturedAt ?? Date.now()).toISOString(),
  }
  assertNoProhibitedPromise(product)
  return { ...product, contentHash: stableHash(product) }
}

export function dedupeSourceProducts(rawProducts) {
  const products = []
  const duplicates = []
  const seen = new Map()

  for (const raw of rawProducts) {
    const product = normalizeSourceProduct(raw)
    const key = product.sourceProductId
      ? `id:${product.sourceProductId}`
      : `url:${product.sourceUrl}`
    if (seen.has(key)) {
      duplicates.push({ duplicate: product, kept: seen.get(key) })
      continue
    }
    seen.set(key, product)
    products.push(product)
  }

  return { products, duplicates }
}

export function extractProductListModule(html) {
  const match = String(html).match(
    /module-name=["']icbu-pc-productListPc["'][\s\S]*?module-data='([^']+)'/iu,
  )
  if (!match) throw new Error('Alibaba product list module not found')
  const parsed = JSON.parse(decodeURIComponent(match[1]))
  const data = parsed?.moduleData?.data ?? parsed?.mds?.moduleData?.data
  if (!data?.pageNavView || !Array.isArray(data.productList)) {
    throw new Error('Alibaba product list module has an unexpected shape')
  }
  return data
}
