import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto'

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const TTL_MS = 5 * 60 * 1_000

type Payload = { v: 1; exp: number; n: string; ah: string }
export type CaptchaResult = { ok: true } | { ok: false; code: 'missing' | 'invalid' | 'expired' }

function requireSecret(secret: string) {
  if (secret.trim().length < 32) throw new Error('CAPTCHA_SECRET must contain at least 32 characters')
}

function hmac(secret: string, value: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

function equal(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

function svg(answer: string, nonce: string) {
  const seed = Buffer.from(nonce, 'base64url')
  const letters = [...answer].map((letter, index) => {
    const x = 24 + index * 34
    const y = 43 + (seed[index] % 9) - 4
    const rotate = (seed[index + 4] % 17) - 8
    return `<text x="${x}" y="${y}" transform="rotate(${rotate} ${x} ${y})">${letter}</text>`
  }).join('')
  const lines = [0, 1, 2].map((index) => {
    const offset = index * 4
    const y1 = 8 + (seed[offset] % 43)
    const y2 = 8 + (seed[offset + 1] % 43)
    return `<path d="M 3 ${y1} C 42 ${y2}, 106 ${y1}, 157 ${y2}"/>`
  }).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="56" viewBox="0 0 160 56" role="img" aria-label="Four-character verification code"><rect width="160" height="56" rx="8" fill="#f8fafc"/><g fill="none" stroke="#94a3b8" opacity=".55">${lines}</g><g fill="#0f172a" font-family="Arial,sans-serif" font-size="30" font-weight="700" letter-spacing="4">${letters}</g></svg>`
}

export function createCaptcha(secret: string, now = Date.now()) {
  requireSecret(secret)
  const answer = Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
  const nonce = randomBytes(16).toString('base64url')
  const payload: Payload = { v: 1, exp: now + TTL_MS, n: nonce, ah: hmac(secret, `answer:${nonce}:${answer}`) }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return {
    svg: svg(answer, nonce),
    token: `${encoded}.${hmac(secret, `token:${encoded}`)}`,
    expiresAt: payload.exp,
    ...(process.env.NODE_ENV === 'test' ? { testAnswer: answer } : {}),
  }
}

export function verifyCaptcha(input: { secret: string; token: string; answer: string; now?: number }): CaptchaResult {
  requireSecret(input.secret)
  const answer = input.answer.trim().toUpperCase()
  const token = input.token.trim()
  if (!answer || !token) return { ok: false, code: 'missing' }
  const [encoded, signature, extra] = token.split('.')
  if (!encoded || !signature || extra || !equal(signature, hmac(input.secret, `token:${encoded}`))) return { ok: false, code: 'invalid' }
  let payload: Payload
  try { payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Payload } catch { return { ok: false, code: 'invalid' } }
  if (payload.v !== 1 || !Number.isFinite(payload.exp) || typeof payload.n !== 'string' || typeof payload.ah !== 'string') return { ok: false, code: 'invalid' }
  if ((input.now ?? Date.now()) > payload.exp) return { ok: false, code: 'expired' }
  return equal(payload.ah, hmac(input.secret, `answer:${payload.n}:${answer}`)) ? { ok: true } : { ok: false, code: 'invalid' }
}
