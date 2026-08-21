import type { Metadata } from 'next'
import { SectionShell } from '@/components/section-shell'
import { faqItems } from '@/lib/data/faq'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'FAQ | JIAJIELI B2B Sourcing Questions',
  description:
    'Answers to common JIAJIELI sourcing questions about lead time, OEM/ODM customization, materials, capacity, export markets, and sample requests.',
  alternates: { canonical: canonicalPath('/faq') },
}

export default function FaqPage() {
  return (
    <SectionShell headingLevel="h1" className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff7ed]" eyebrow="FAQ" title="Common sourcing questions">
      <div className="grid gap-4">
        {faqItems.map((item) => (
          <article key={item.question} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-xl font-semibold text-foreground">{item.question}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  )
}
