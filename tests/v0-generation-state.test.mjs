import assert from 'node:assert/strict'
import test from 'node:test'
import { isUsableV0Version, requiredV0RouteFiles } from '../lib/v0-generation-state.mjs'

test('waits past attachment-only completed versions until generated source files exist', () => {
  assert.equal(isUsableV0Version({ id: 'asset-version', status: 'completed', files: [] }, []), false)
  assert.equal(
    isUsableV0Version(
      { id: 'site-version', status: 'completed', files: [{ name: 'app/page.tsx' }] },
      ['app/page.tsx'],
    ),
    true,
  )
  assert.equal(isUsableV0Version({ id: 'pending-version', status: 'pending', files: [] }), false)
  assert.equal(
    isUsableV0Version({
      id: 'partial-site',
      status: 'completed',
      files: requiredV0RouteFiles.slice(0, -1).map((name) => ({ name })),
    }),
    false,
  )
  assert.equal(
    isUsableV0Version({
      id: 'complete-site',
      status: 'completed',
      files: requiredV0RouteFiles.map((name) => ({ name })),
    }),
    true,
  )
})
