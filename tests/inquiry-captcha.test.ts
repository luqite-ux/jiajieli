import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { describe, it } from 'node:test'

import { createCaptcha, verifyCaptcha } from '../lib/inquiry-captcha.ts'

Reflect.set(process.env, 'NODE_ENV', 'test')

const secret = 'jiajieli-test-secret-with-at-least-32-characters'

describe('JIAJIELI inquiry CAPTCHA', () => {
  it('accepts a generated answer and rejects wrong, expired, or tampered challenges', () => {
    const challenge = createCaptcha(secret, 1_000)
    assert.ok(challenge.testAnswer)
    assert.deepEqual(verifyCaptcha({ secret, token: challenge.token, answer: challenge.testAnswer, now: 1_001 }), { ok: true })
    assert.deepEqual(verifyCaptcha({ secret, token: challenge.token, answer: 'ZZZZ', now: 1_001 }), { ok: false, code: 'invalid' })
    assert.deepEqual(verifyCaptcha({ secret, token: challenge.token, answer: challenge.testAnswer, now: 301_001 }), { ok: false, code: 'expired' })
    assert.deepEqual(verifyCaptcha({ secret, token: `${challenge.token}x`, answer: challenge.testAnswer, now: 1_001 }), { ok: false, code: 'invalid' })
  })

  it('protects the inquiry insert on the server before persistence', async () => {
    const source = await readFile(new URL('../app/api/inquiries/route.ts', import.meta.url), 'utf8')
    assert.ok(source.includes('verifyCaptcha'))
    assert.ok(source.indexOf('verifyCaptcha') < source.indexOf("from('inquiries').insert"))
    assert.ok(source.includes("form.get('captchaToken')"))
    assert.ok(source.includes("form.get('captchaAnswer')"))
  })
})
