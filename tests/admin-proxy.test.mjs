import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('customer site exposes tenant-bound admin login and proxy', async () => {
  const [proxy, auth, login, session] = await Promise.all([
    readFile(new URL('../proxy.ts', import.meta.url), 'utf8'),
    readFile(new URL('../lib/admin-auth.ts', import.meta.url), 'utf8'),
    readFile(new URL('../app/admin/login/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../lib/admin-session.ts', import.meta.url), 'utf8'),
  ])
  assert.match(proxy, /NEXT_PUBLIC_ADMIN_URL/)
  assert.match(proxy, /NEXT_PUBLIC_TENANT_ID/)
  assert.match(proxy, /\/admin\/login/)
  assert.match(auth, /\.eq\('tenant_id', [A-Za-z]+Tenant\)/)
  assert.match(auth, /bcrypt\.compare/)
  assert.match(login, /Customer Administration/)
  assert.match(session, /httpOnly: true/)
})
