import assert from 'node:assert/strict'
import test from 'node:test'

import { pickLocalized } from '../lib/i18n.ts'

test('prefers the requested locale, then the default locale, then the first nonempty value', () => {
  const values = { de: '', en: 'English', fr: 'Français' }

  assert.equal(pickLocalized(values, 'fr', 'en', 'Fallback'), 'Français')
  assert.equal(pickLocalized(values, 'de', 'en', 'Fallback'), 'English')
  assert.equal(pickLocalized({ de: '', fr: 'Français' }, 'de', 'en', 'Fallback'), 'Français')
  assert.equal(pickLocalized({ de: '' }, 'de', 'en', 'Fallback'), 'Fallback')
})

test('preserves arrays and rejects empty arrays during fallback', () => {
  assert.deepEqual(
    pickLocalized({ de: [], en: ['Drain-hole design'] }, 'de', 'en', ['Fallback']),
    ['Drain-hole design'],
  )
})
