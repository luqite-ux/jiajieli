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
  if (hasValue(values?.[requestedLocale])) return values[requestedLocale]
  if (hasValue(values?.[defaultLocale])) return values[defaultLocale]
  const first = Object.values(values ?? {}).find(hasValue)
  return first ?? fallback
}
