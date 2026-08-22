'use client'

import { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'

type Challenge = { svg: string; token: string }

async function loadChallenge() {
  const response = await fetch('/api/captcha', { cache: 'no-store' })
  if (!response.ok) throw new Error('unavailable')
  const body = (await response.json()) as Challenge
  if (!body.svg || !body.token) throw new Error('invalid')
  return body
}

export function InquiryCaptchaField({ refreshKey = 0 }: { refreshKey?: number }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    setChallenge(null)
    setError('')
    try {
      setChallenge(await loadChallenge())
    } catch {
      setError('Verification code failed to load. Please try another code.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    loadChallenge()
      .then((body) => { if (active) setChallenge(body) })
      .catch(() => { if (active) setError('Verification code failed to load. Please try another code.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refreshKey])

  return (
    <Field>
      <FieldLabel htmlFor="captchaAnswer">Verification Code</FieldLabel>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-14 w-40 items-center justify-center overflow-hidden rounded-lg border border-border bg-slate-50">
          {challenge ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(challenge.svg)}`} width={160} height={56} alt="Four-character verification code" />
          ) : <span className="text-xs text-slate-500">{loading ? 'Loading…' : 'Unavailable'}</span>}
        </div>
        <input type="hidden" name="captchaToken" value={challenge?.token ?? ''} />
        <Input key={challenge?.token ?? refreshKey} id="captchaAnswer" name="captchaAnswer" required disabled={!challenge} minLength={4} maxLength={4} autoComplete="off" autoCapitalize="characters" spellCheck={false} className="w-36 uppercase tracking-[0.2em]" placeholder="Enter code" />
        <Button type="button" variant="outline" onClick={() => void refresh()} disabled={loading}>Try another</Button>
      </div>
      {error ? <FieldDescription role="alert" className="text-red-700">{error}</FieldDescription> : null}
    </Field>
  )
}
