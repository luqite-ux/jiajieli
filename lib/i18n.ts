function hasValue<T>(value: T | undefined): value is T {
  if (value == null) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

export function pickLocalized<T>(
  values: Record<string, T> | null | undefined,
  requestedLocale: string,
  defaultLocale: string,
  fallback: T,
): T {
  const source = values ?? {}
  if (hasValue(source[requestedLocale])) return source[requestedLocale]
  if (hasValue(source[defaultLocale])) return source[defaultLocale]
  const first = Object.values(source).find(hasValue)
  return first ?? fallback
}
