export type RevealMotionStyle = {
  '--reveal-delay': string
}

export function staggerDelay(index: number, step = 70, maximum = 700) {
  const safeIndex = Math.max(0, Math.floor(index))
  return Math.min(safeIndex * step, maximum)
}

export function createRevealMotionStyle(delay: number): RevealMotionStyle {
  const safeDelay = Math.min(Math.max(0, Math.round(delay)), 900)
  return { '--reveal-delay': `${safeDelay}ms` }
}
