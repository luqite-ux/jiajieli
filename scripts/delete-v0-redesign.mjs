import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createClient as createV0Client } from 'v0-sdk'
import { requiredV0RouteFiles } from '../lib/v0-generation-state.mjs'

const execFileAsync = promisify(execFile)
const root = path.resolve(import.meta.dirname, '..')
const approvedTeamId = 'team_v0pxRIIzSUGJleUTRNSz6GS4'
const recordPath = path.join(root, 'data', 'sources', 'jiajieli-v0-redesign.json')

async function loadEnv(file) {
  try {
    for (const line of (await fs.readFile(file, 'utf8')).split(/\r?\n/)) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
}

for (const file of [
  'D:/Cursor/Grand/huanqiu-admin/.env',
  'D:/Cursor/Grand/huanqiu-admin/.env.local',
  'D:/Cursor/Grand/huanqiu-admin/_migrate-batch/.env',
]) await loadEnv(file)

const apiKey = process.env.V0_API_KEY || process.env.V0_TOKEN
if (!apiKey || apiKey.split(':')[1] !== approvedTeamId) throw new Error('Approved v0 team credential is unavailable')

const record = JSON.parse(await fs.readFile(recordPath, 'utf8'))
if (record.teamId !== approvedTeamId) throw new Error('Provenance record has an unexpected v0 team')
const archive = path.join(root, record.downloadedArchive)
const extracted = path.join(root, record.extractedDirectory)
const listing = await execFileAsync('tar.exe', ['-tf', archive], { windowsHide: true })
if (!listing.stdout.includes('package.json')) throw new Error('v0 ZIP cannot be listed as a valid source archive')
for (const file of [...requiredV0RouteFiles, 'package.json']) await fs.access(path.join(extracted, file))
for (const file of [
  'public/images/logo.png',
  'public/images/hero/product-bathroom.webp',
  'public/images/hero/factory-line.webp',
  'public/images/hero/production-equipment.webp',
]) await fs.access(path.join(root, file))

const v0 = createV0Client({ apiKey })
const before = await v0.projects.find()
if (!before.data.some((project) => project.id === record.projectId)) throw new Error('Recorded v0 project was not present before cleanup')
const chat = await v0.chats.getById({ chatId: record.chatId })
if (chat.id !== record.chatId) throw new Error('Recorded v0 chat could not be read before cleanup')

await v0.projects.delete({ projectId: record.projectId, deleteAllChats: true })
const after = await v0.projects.find()
if (after.data.some((project) => project.id === record.projectId)) throw new Error('v0 project remains visible after deletion')

record.deletedAt = new Date().toISOString()
record.deleteAllChats = true
record.deletionVerified = true
await fs.writeFile(recordPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({ projectAbsent: true, deleteAllChats: true, localArchiveVerified: true }, null, 2))
