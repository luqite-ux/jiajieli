import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

test('records a complete downloaded v0 version without secrets', async () => {
  const record = JSON.parse(
    await readFile(new URL('../data/sources/jiajieli-v0-redesign.json', import.meta.url), 'utf8'),
  )

  for (const key of [
    'projectId',
    'chatId',
    'versionId',
    'webUrl',
    'downloadedArchive',
    'extractedDirectory',
  ]) {
    assert.ok(record[key], `${key} is required`)
  }

  assert.equal(record.teamId, 'team_v0pxRIIzSUGJleUTRNSz6GS4')
  assert.doesNotMatch(JSON.stringify(record), /V0_(API_KEY|TOKEN)|Bearer\s/i)
  await access(new URL(`../${record.downloadedArchive}`, import.meta.url))
  await access(new URL(`../${record.extractedDirectory}`, import.meta.url))
})
