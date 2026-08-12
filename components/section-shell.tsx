import { cn } from '@/lib/utils'
import { Container } from '@/components/container'

export function SectionShell({
  id,
  className,
  containerClassName,
  eyebrow,
  title,
  description,
  align = 'left',
  children,
}: {
  id?: string
  className?: string
  containerClassName?: string
  eyebrow?: string
  title?: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
  children?: React.ReactNode
}) {
  return (
    <section id={id} className={cn('py-16 sm:py-20 lg:py-24', className)}>
      <Container className={containerClassName}>
        {(eyebrow || title || description) && (
          <div className={cn('mb-10 sm:mb-14', align === 'center' && 'text-center mx-auto max-w-2xl')}>
            {eyebrow && (
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}
