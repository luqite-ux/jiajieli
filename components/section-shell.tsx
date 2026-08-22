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
  headingLevel = 'h2',
  tone = 'light',
  children,
}: {
  id?: string
  className?: string
  containerClassName?: string
  eyebrow?: string
  title?: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
  headingLevel?: 'h1' | 'h2'
  tone?: 'light' | 'dark'
  children?: React.ReactNode
}) {
  const Heading = headingLevel

  return (
    <section id={id} className={cn('relative overflow-hidden py-16 sm:py-20 lg:py-24', tone === 'dark' ? 'text-white' : 'text-foreground', className)}>
      <Container className={containerClassName}>
        {(eyebrow || title || description) && (
          <div className={cn('mb-10 sm:mb-14', align === 'center' && 'text-center mx-auto max-w-2xl')}>
            {eyebrow && (
              <p className={cn('mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]', tone === 'dark' ? 'text-brand-aqua' : 'text-brand-teal')}>
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {eyebrow}
              </p>
            )}
            {title && (
              <Heading className={cn('text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl', tone === 'dark' ? 'text-white' : 'text-foreground')}>
                {title}
              </Heading>
            )}
            {description && (
              <p className={cn('mt-4 max-w-2xl text-pretty leading-relaxed', tone === 'dark' ? 'text-white/75' : 'text-muted-foreground')}>{description}</p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}
