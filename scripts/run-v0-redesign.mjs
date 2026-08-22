import { createReadStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createClient as createV0Client } from 'v0-sdk'
import { isUsableV0Version, requiredV0RouteFiles } from '../lib/v0-generation-state.mjs'

const execFileAsync = promisify(execFile)
const root = path.resolve(import.meta.dirname, '..')
const approvedTeamId = 'team_v0pxRIIzSUGJleUTRNSz6GS4'
const specPath = path.join(root, 'docs', 'superpowers', 'specs', '2026-08-22-jiajieli-v0-redesign-design.md')
const manifestPath = path.join(root, 'data', 'sources', 'jiajieli-hero-assets.json')
const outputRoot = path.join(root, '.tmp', 'v0-jiajieli-redesign')
const archivePath = path.join(outputRoot, 'jiajieli-v0-redesign.zip')
const extractedPath = path.join(outputRoot, 'source')
const recordPath = path.join(root, 'data', 'sources', 'jiajieli-v0-redesign.json')

async function loadEnvFile(file) {
  try {
    const text = await fs.readFile(file, 'utf8')
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
      if (!match || process.env[match[1]]) continue
      process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
}

for (const envFile of [
  path.join('D:', 'Cursor', 'Grand', 'huanqiu-admin', '.env'),
  path.join('D:', 'Cursor', 'Grand', 'huanqiu-admin', '.env.local'),
  path.join('D:', 'Cursor', 'Grand', 'huanqiu-admin', '_migrate-batch', '.env'),
]) {
  await loadEnvFile(envFile)
}

const apiKey = process.env.V0_API_KEY || process.env.V0_TOKEN
if (!apiKey) throw new Error('Missing approved V0_API_KEY or V0_TOKEN')
const tokenParts = apiKey.split(':')
if (tokenParts[0] !== 'v1' || tokenParts[1] !== approvedTeamId) {
  throw new Error(`The configured v0 credential is not scoped to ${approvedTeamId}`)
}

const r2Keys = ['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_S3_ENDPOINT', 'R2_BUCKET_NAME', 'R2_PUBLIC_URL_PREFIX']
const missingR2 = r2Keys.filter((key) => !process.env[key])
if (missingR2.length) throw new Error(`Missing R2 configuration: ${missingR2.join(', ')}`)

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
const spec = await fs.readFile(specPath, 'utf8')
const prompt = `
Create a complete high-end English B2B inquiry website frontend for JIAJIELI / Zhejiang Jiajie Plastic Co., Ltd.

Treat the attached logo and three hero images as immutable brand and media inputs. Use the three hero images exactly once each in an accessible homepage carousel. Do not redraw the logo and do not generate replacement images.

Deliver complete independent routes for Home, About Us, Products, Product Detail, Manufacturing, OEM/ODM, Quality Control, FAQ, News, News Detail, and Contact using Next.js App Router, TypeScript, Tailwind CSS, shadcn/Radix primitives, Lucide icons, and responsive accessible components.

This is presentation-only source. Use clearly centralized typed mock data so Codex can reconnect the existing Supabase Server Components. Do not configure or replace Supabase, R2, tenant identity, admin authentication, DeepSeek, inquiry persistence, GitHub, Vercel, Cloudflare, or environment variables.

Hard requirements:
- bright premium warm-white, aqua, turquoise and restrained coral palette;
- gradients, subtle water texture and real imagery instead of large flat-color blocks;
- larger official logo in header and footer with preserved aspect ratio;
- exactly three hero slides: product bathroom, factory line, production equipment;
- no price, cart, checkout, payment, account registration or retail shopping UI;
- all product, CTA and contact actions lead to a real-integration-ready inquiry form;
- no fabricated company statistics, production counts, certifications, awards, testing claims or customer logos;
- never use warranty or guarantee language;
- no dark visual direction, particle effects, aggressive parallax or excessive 3D;
- WCAG AA contrast, keyboard carousel controls, visible focus and reduced-motion support;
- no placeholder lorem ipsum and no broken-image placeholders.

Approved design specification follows:

${spec}
`

const forbiddenOutsideRules = prompt
  .split(/\r?\n/)
  .filter((line) => !/never use warranty or guarantee|Prohibit all warranty\/guarantee/i.test(line))
  .join('\n')
if (/质保|保修|质量保证|\bwarrant(?:y|ies)\b|\bguarantee(?:d|s|ing)?\b/iu.test(forbiddenOutsideRules)) {
  throw new Error('v0 prompt contains prohibited service language outside the explicit prohibition')
}

const resume = process.argv.includes('--resume')
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})
const publicBase = process.env.R2_PUBLIC_URL_PREFIX.replace(/\/$/, '')
const attachmentInputs = [
  { name: 'official-jiajieli-logo.png', file: path.join(root, 'public', 'images', 'logo.png') },
  ...manifest.map((item) => ({ name: path.basename(item.localPath), file: path.join(root, item.localPath) })),
]
const attachments = []

for (const asset of resume ? [] : attachmentInputs) {
  const extension = path.extname(asset.file).toLowerCase()
  const contentType = extension === '.webp' ? 'image/webp' : 'image/png'
  const key = `v0-inputs/jiajieli-redesign/${asset.name}`
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: createReadStream(asset.file),
    ContentType: contentType,
  }))
  attachments.push({ url: `${publicBase}/${key}` })
}

const v0 = createV0Client({ apiKey })
let project
let chatInit
if (resume) {
  const projects = await v0.projects.find()
  project = projects.data.find((item) => item.name === 'jiajieli-bright-b2b-redesign')
  if (!project) throw new Error('Unable to find the existing JIAJIELI redesign project')
  const chats = await v0.chats.find({ vercelProjectId: project.vercelProjectId, limit: 10 })
  chatInit = chats.data[0]
  if (!chatInit) throw new Error('Unable to find the existing JIAJIELI redesign chat')
  chatInit = await v0.chats.getById({ chatId: chatInit.id })
} else {
  project = await v0.projects.create({ name: 'jiajieli-bright-b2b-redesign' })
  chatInit = await v0.chats.create({
    projectId: project.id,
    message: prompt,
    attachments,
    responseMode: 'async',
    modelConfiguration: { modelId: 'v0-pro', imageGenerations: false },
  })
  if (chatInit instanceof ReadableStream) throw new Error('Unexpected streaming response from v0')
}

let chat = chatInit
const deadline = Date.now() + 20 * 60 * 1000
while (Date.now() < deadline) {
  const status = chat.latestVersion?.status
  if (isUsableV0Version(chat.latestVersion)) break
  if (status === 'failed') throw new Error('v0 generation failed')
  await new Promise((resolve) => setTimeout(resolve, 10_000))
  chat = await v0.chats.getById({ chatId: chatInit.id })
  console.log(`v0 generation status: ${chat.latestVersion?.status ?? 'pending'}`)
}
if (!isUsableV0Version(chat.latestVersion)) {
  throw new Error(`v0 generation did not complete: ${chat.latestVersion?.status ?? 'missing'}`)
}

await fs.rm(outputRoot, { recursive: true, force: true })
await fs.mkdir(extractedPath, { recursive: true })
const bytes = new Uint8Array(await v0.chats.downloadVersion({
  chatId: chat.id,
  versionId: chat.latestVersion.id,
}))
if (bytes[0] !== 80 || bytes[1] !== 75) throw new Error('Downloaded v0 source is not a ZIP archive')
await fs.writeFile(archivePath, bytes)
await execFileAsync('tar.exe', ['-xf', archivePath, '-C', extractedPath], { windowsHide: true })

for (const file of [...requiredV0RouteFiles, 'package.json']) {
  await fs.access(path.join(extractedPath, file))
}

const relativeArchive = path.relative(root, archivePath).replaceAll('\\', '/')
const relativeExtracted = path.relative(root, extractedPath).replaceAll('\\', '/')
const record = {
  teamId: approvedTeamId,
  projectId: project.id,
  chatId: chat.id,
  versionId: chat.latestVersion.id,
  webUrl: chat.webUrl,
  downloadedArchive: relativeArchive,
  extractedDirectory: relativeExtracted,
  attachments: attachments.map((item) => item.url),
  generatedAt: new Date().toISOString(),
}
await fs.writeFile(recordPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({
  projectId: record.projectId,
  chatId: record.chatId,
  versionId: record.versionId,
  webUrl: record.webUrl,
  downloadedArchive: record.downloadedArchive,
  extractedDirectory: record.extractedDirectory,
}, null, 2))
