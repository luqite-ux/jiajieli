export interface AdminAuthStore {
  findUser(email: string, tenantId: string): Promise<{ id: string; passwordHash: string } | null>
  createSession(session: { adminUserId: string; token: string; expiresAt: string; ip: string; userAgent: string }): Promise<boolean>
  touchLastLogin(userId: string, tenantId: string, loggedInAt: string): Promise<void>
}

export async function issueAdminSession(options: {
  email: string
  password: string
  tenantId: string
  ip: string
  userAgent: string
  store: AdminAuthStore
  verifyPassword(password: string, hash: string): Promise<boolean>
  createToken(): string
  now(): Date
}) {
  const user = await options.store.findUser(options.email, options.tenantId)
  if (!user || !(await options.verifyPassword(options.password, user.passwordHash))) return { ok: false as const, reason: 'invalid' as const }
  const issuedAt = options.now()
  const expiresAt = new Date(issuedAt.getTime() + 7 * 24 * 60 * 60 * 1000)
  const token = options.createToken()
  const created = await options.store.createSession({ adminUserId: user.id, token, expiresAt: expiresAt.toISOString(), ip: options.ip, userAgent: options.userAgent })
  if (!created) return { ok: false as const, reason: 'session' as const }
  await options.store.touchLastLogin(user.id, options.tenantId, issuedAt.toISOString())
  return { ok: true as const, token, tenantId: options.tenantId, expiresAt }
}
