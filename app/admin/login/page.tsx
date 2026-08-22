import Image from 'next/image'

const errors: Record<string, string> = { configuration: 'Customer administration is not configured yet.', invalid: 'Incorrect email or password.', missing: 'Enter your email and password.', request: 'The sign-in request could not be read. Please try again.', session: 'A session could not be created. Please try again.' }

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; reason?: string }> }) {
  const { error, reason } = await searchParams
  const message = error ? errors[error] : undefined
  return <main className="water-texture flex min-h-screen items-center justify-center bg-brand-warm-white px-5 py-16">
    <section className="w-full max-w-md rounded-[1.75rem] border border-white bg-white p-7 shadow-[0_24px_80px_rgba(25,78,85,.16)] sm:p-9">
      <Image src="/images/logo-tight.png" alt="JIAJIELI logo" width={220} height={82} className="h-12 w-auto object-contain" priority />
      <p className="mt-3 text-sm text-muted-foreground">Customer Administration</p>
      <h1 className="mt-7 font-heading text-3xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage website content, products, news, and inquiries.</p>
      {reason === 'unauthorized' && !message ? <p className="mt-5 rounded-xl bg-secondary p-3 text-sm">Sign in to continue.</p> : null}
      {message ? <p role="alert" className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{message}</p> : null}
      <form action="/api/auth/login" method="post" className="mt-7 space-y-5">
        <label className="block text-sm font-medium">Email<input className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3" name="email" type="email" autoComplete="username" required /></label>
        <label className="block text-sm font-medium">Password<input className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3" name="password" type="password" autoComplete="current-password" required /></label>
        <button className="h-11 w-full rounded-full bg-primary px-5 font-medium text-primary-foreground hover:bg-primary/90" type="submit">Sign in</button>
      </form>
    </section>
  </main>
}
