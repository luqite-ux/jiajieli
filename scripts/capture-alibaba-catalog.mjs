#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'

import {
  dedupeSourceProducts,
  extractProductListModule,
} from '../lib/catalog/source-normalization.mjs'

const BASE_URL = 'https://jiajie.en.alibaba.com'
const OUTPUT = path.resolve('data/sources/jiajieli-alibaba-products.json')
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36'
const capturedAt = new Date().toISOString()

function absoluteUrl(value) {
  if (!value) return ''
  if (value.startsWith('//')) return `https:${value}`
  return new URL(value, BASE_URL).toString()
}

function listingToSourceProduct(listing) {
  const images = [
    ...(listing.skuImg ?? []),
    ...(listing.imageUrlList ?? []).flatMap((image) => [image.x350, image.x120, image.x50]),
  ].map(absoluteUrl).filter(Boolean)

  return {
    sourceUrl: absoluteUrl(listing.url),
    sourceProductId: String(listing.id ?? ''),
    sourceTitle: listing.subject,
    sourceCategory: String(listing.groupId || 'Ungrouped'),
    sourceSpecs: {},
    sourceImages: images,
    capturedAt,
  }
}

async function fetchPage(page) {
  const pathname = page === 1
    ? '/productlist.html'
    : `/productlist-${page}.html?filter=null&sortType=modified-desc`
  const response = await fetch(`${BASE_URL}${pathname}`, {
    headers: { 'user-agent': USER_AGENT, 'accept-language': 'en-US,en;q=0.9' },
  })
  if (!response.ok) throw new Error(`Alibaba page ${page} returned HTTP ${response.status}`)
  const html = await response.text()
  try {
    return extractProductListModule(html)
  } catch (error) {
    throw new Error(`Alibaba page ${page} could not be parsed (${html.length} characters): ${error.message}`)
  }
}

const firstPage = await fetchPage(1)
const pageCount = Math.ceil(firstPage.pageNavView.totalLines / firstPage.pageNavView.pageLines)
const requestedLimit = Number(process.argv.find((arg) => arg.startsWith('--limit-pages='))?.split('=')[1] ?? pageCount)
const limit = Math.max(1, Math.min(pageCount, requestedLimit))
const pages = [firstPage]

for (let page = 2; page <= limit; page += 1) {
  pages.push(await fetchPage(page))
}

const listings = pages.flatMap((page) => page.productList)
const { products, duplicates } = dedupeSourceProducts(listings.map(listingToSourceProduct))
if (!products.length) throw new Error('Alibaba capture returned no products')

await fs.mkdir(path.dirname(OUTPUT), { recursive: true })
await fs.writeFile(OUTPUT, `${JSON.stringify(products, null, 2)}\n`, 'utf8')

console.log(JSON.stringify({
  capturedAt,
  advertisedTotal: firstPage.pageNavView.totalLines,
  pageCount,
  capturedPages: limit,
  listingCount: listings.length,
  productCount: products.length,
  duplicateCount: duplicates.length,
  output: OUTPUT,
}, null, 2))
