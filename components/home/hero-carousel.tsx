'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { HeroSlide } from '@/lib/hero-slides'

const SLIDE_DURATION_MS = 6000
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches
}

export function HeroCarousel({ slides }: { slides: readonly HeroSlide[] }) {
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const reducedMotion = React.useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => true)
  const total = slides.length

  const goTo = React.useCallback((next: number) => {
    setIndex(((next % total) + total) % total)
  }, [total])
  const goNext = React.useCallback(() => goTo(index + 1), [goTo, index])
  const goPrevious = React.useCallback(() => goTo(index - 1), [goTo, index])

  React.useEffect(() => {
    if (paused || reducedMotion || total < 2) return
    const timer = window.setTimeout(goNext, SLIDE_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [goNext, paused, reducedMotion, total])

  const active = slides[index]
  if (!active) return null

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured JIAJIELI products and manufacturing"
      className="relative isolate overflow-hidden bg-brand-teal-deep"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') goNext()
        if (event.key === 'ArrowLeft') goPrevious()
      }}
    >
      <div className="relative h-[620px] sm:h-[680px] lg:h-[720px]">
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.id}
            aria-hidden={slideIndex !== index}
            className={cn('absolute inset-0 transition-opacity duration-700', slideIndex === index ? 'opacity-100' : 'opacity-0')}
          >
            <Image
              src={slide.image}
              alt={slideIndex === index ? slide.imageAlt : ''}
              fill
              priority={slideIndex === 0}
              sizes="100vw"
              className={cn('object-cover', slideIndex === index && !reducedMotion && 'hero-media-active')}
            />
            <div className="hero-overlay pointer-events-none absolute inset-0" />
          </div>
        ))}

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-5 pb-24 sm:px-6 sm:pb-28 lg:px-8">
          <div key={active.id} className="hero-copy max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-aqua">{active.eyebrow}</p>
            <h1 className="mt-4 text-balance font-heading text-4xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">{active.heading}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">{active.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-white text-brand-teal-deep hover:bg-brand-warm-white">
                <Link href={active.ctaHref} className="motion-link">{active.ctaLabel}<ArrowRight aria-hidden="true" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/55 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/contact" className="motion-link">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 pb-6 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            <Button type="button" size="icon" variant="outline" onClick={goPrevious} aria-label="Previous slide" className="rounded-full border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white"><ChevronLeft /></Button>
            <Button type="button" size="icon" variant="outline" onClick={goNext} aria-label="Next slide" className="rounded-full border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white"><ChevronRight /></Button>
            <Button type="button" size="icon" variant="outline" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Play carousel' : 'Pause carousel'} className="rounded-full border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white">{paused ? <Play /> : <Pause />}</Button>
          </div>
          <div className="flex items-center gap-2" aria-label="Choose slide">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show slide ${slideIndex + 1}: ${slide.heading}`}
                aria-current={slideIndex === index ? 'true' : undefined}
                onClick={() => goTo(slideIndex)}
                className="relative h-2.5 w-10 overflow-hidden rounded-full bg-white/35"
              >
                {slideIndex === index && <span className={cn('absolute inset-y-0 left-0 rounded-full bg-white', paused || reducedMotion ? 'w-full' : 'animate-[hero-progress_6s_linear_forwards]')} />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`@keyframes hero-progress { from { width: 0; } to { width: 100%; } }`}</style>
    </section>
  )
}
