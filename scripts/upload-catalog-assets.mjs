#!/usr/bin/env node
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { buildUploadPlan } from '../lib/catalog/upload-plan.mjs'

const ROOT = path.resolve(process.env.HUANQIU_ADMIN_ROOT || 'D:/Cursor/Grand/huanqiu-admin')
for (const envFile of [path.join(ROOT, '.env.local'), path.join(ROOT, '.env'), path.join(ROOT, '_migrate-batch', '.env')]) {
  if (!fs.existsSync(envFile)) continue
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/u)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/u)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/gu, '')
  }
}

const required = ['R2_S3_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_URL_PREFIX']
for (const name of required) if (!process.env[name]) throw new Error(`Missing ${name}`)
const bucket = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET
if (!bucket) throw new Error('Missing R2_BUCKET_NAME or R2_BUCKET')

const processed = JSON.parse(await fsp.readFile('.audit/jiajieli-processed-images.json', 'utf8'))
const plan = buildUploadPlan(processed, process.env.R2_PUBLIC_URL_PREFIX)
const apply = process.argv.includes('--apply')

if (!apply) {
  console.log(JSON.stringify({ mode: 'check', uniqueUploads: plan.uploads.length, references: plan.references.length, bucket }, null, 2))
  process.exit(0)
}

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

let cursor = 0
async function worker() {
  while (cursor < plan.uploads.length) {
    const index = cursor
    cursor += 1
    const upload = plan.uploads[index]
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: upload.r2Key,
      Body: fs.createReadStream(upload.localPath),
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    }))
    if ((index + 1) % 100 === 0) console.log(`uploaded ${index + 1}/${plan.uploads.length}`)
  }
}

await Promise.all(Array.from({ length: 8 }, () => worker()))
await fsp.writeFile('.audit/jiajieli-uploaded-images.json', `${JSON.stringify(plan.references, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({ mode: 'apply', uniqueUploads: plan.uploads.length, references: plan.references.length }, null, 2))
