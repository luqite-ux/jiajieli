import { cn } from '@/lib/utils'
import { createRevealMotionStyle } from '@/lib/motion'

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li'
}) {
  return (
    <Tag
      className={cn(
        'reveal-on-scroll',
        className,
      )}
      style={createRevealMotionStyle(delay) as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
