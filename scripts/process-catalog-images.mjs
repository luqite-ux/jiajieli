#!/usr/bin/env node
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

import { buildImagePlan } from '../lib/catalog/image-manifest.mjs'

const products = JSON.parse(await fs.readFile('data/sources/jiajieli-alibaba-products.json', 'utf8'))
const factoryDefinitions = JSON.parse(await fs.readFile('data/sources/jiajieli-factory-images.json', 'utf8'))
const factoryDirArg = process.argv.find((arg) => arg.startsWith('--factory-dir='))?.slice('--factory-dir='.length)
const factoryDir = path.resolve(factoryDirArg || process.env.JIAJIELI_FACTORY_IMAGE_DIR || '')
const outputRoot = path.resolve('.audit/catalog-assets')
const manifestPath = path.resolve('.audit/jiajieli-processed-images.json')
const apply = process.argv.includes('--apply')

const factoryImages = factoryDefinitions.map((image) => ({
  ...image,
  sourcePath: path.join(factoryDir, image.sourceFileName),
}))
const plan = buildImagePlan(products, factoryImages)

if (!apply) {
  console.log(JSON.stringify({
    mode: 'check',
    products: plan.products.length,
    productImages: plan.products.reduce((count, product) => count + product.images.length, 0),
    factoryImages: plan.factory.length,
    factoryDir,
  }, null, 2))
  process.exit(0)
}

if (!factoryDirArg && !process.env.JIAJIELI_FACTORY_IMAGE_DIR) {
  throw new Error('Provide --factory-dir or JIAJIELI_FACTORY_IMAGE_DIR in apply mode')
}

async function transformBuffer(buffer, outputPath) {
  const output = await sharp(buffer)
    .rotate()
    .toColourspace('srgb')
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toBuffer()
  const metadata = await sharp(output).metadata()
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, output)
  return {
    outputSha256: createHash('sha256').update(output).digest('hex'),
    width: metadata.width,
    height: metadata.height,
    bytes: output.length,
    format: metadata.format,
  }
}

async function download(url) {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 JIAJIELI source audit' } })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

const jobs = [
  ...plan.products.flatMap((product) => product.images.map((image) => ({ ...image, sourceProductId: product.sourceProductId, slug: product.slug }))),
  ...plan.factory,
]
const results = new Array(jobs.length)
let cursor = 0

async function worker() {
  while (cursor < jobs.length) {
    const index = cursor
    cursor += 1
    const job = jobs[index]
    const source = job.sourceUrl ? await download(job.sourceUrl) : await fs.readFile(job.sourcePath)
    const localPath = path.join(outputRoot, job.r2Key)
    const transformed = await transformBuffer(source, localPath)
    results[index] = {
      ...job,
      sourceSha256: createHash('sha256').update(source).digest('hex'),
      localPath,
      ...transformed,
    }
    if ((index + 1) % 100 === 0) console.log(`processed ${index + 1}/${jobs.length}`)
  }
}

await Promise.all(Array.from({ length: 6 }, () => worker()))
await fs.mkdir(path.dirname(manifestPath), { recursive: true })
await fs.writeFile(manifestPath, `${JSON.stringify(results, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({ mode: 'apply', processed: results.length, manifestPath, outputRoot }, null, 2))
