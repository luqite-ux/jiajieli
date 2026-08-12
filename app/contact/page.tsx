import { Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import { SectionShell } from '@/components/section-shell'
import { InquiryForm } from '@/components/inquiry-form'
import { company } from '@/lib/data/company'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact JIAJIELI | Send a B2B Inquiry',
  description:
    'Contact JIAJIELI to discuss PVC and TPE mat sourcing, OEM/ODM customization, target quantity, samples, and export documentation needs.',
  alternates: { canonical: canonicalPath('/contact') },
}

export default function ContactPage() {
  return (
    <>
      <SectionShell className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff7ed]" eyebrow="Contact" title="Send JIAJIELI your sourcing requirements." description="Share the product type, target quantity, market, and customization details. The export team will follow up directly." />
      <SectionShell>
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <aside className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-2xl font-semibold">Export Office</h2>
            <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
              <p className="flex gap-3"><Mail className="mt-1 size-4 text-accent" /> <a href={`mailto:${company.contactEmail}`}>{company.contactEmail}</a></p>
              <p className="flex gap-3"><MapPin className="mt-1 size-4 text-accent" /> <span>{company.address}</span></p>
            </div>
          </aside>
          <InquiryForm />
        </div>
      </SectionShell>
    </>
  )
}
