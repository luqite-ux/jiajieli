import { SectionShell } from '@/components/section-shell'
import { certificateImages, company } from '@/lib/data/company'
import Image from 'next/image'
import type { Metadata } from 'next'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Quality Control | JIAJIELI Export Mat Inspection',
  description:
    'Review JIAJIELI material checks, in-process inspection, pre-shipment review, and compliance references for export mat sourcing.',
  alternates: { canonical: canonicalPath('/quality-control') },
}

export default function QualityControlPage() {
  return (
    <>
      <SectionShell className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff7ed]" eyebrow="Quality Control" title="Inspection-led production for export sourcing." description="JIAJIELI uses material checks, in-process inspection, and pre-shipment review to support consistent product output for global buyers." />
      <SectionShell title="Compliance references">
        <div className="flex flex-wrap gap-3">
          {company.certifications.map((cert) => <span key={cert.code} className="rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">{cert.label}</span>)}
        </div>
      </SectionShell>
      <SectionShell className="bg-secondary/45" title="Inspection touchpoints">
        <div className="grid gap-5 md:grid-cols-3">
          {['Incoming material review', 'In-process dimensional and appearance checks', 'Pre-shipment inspection documentation'].map((item) => (
            <div key={item} className="rounded-2xl border border-border bg-card p-6 text-sm leading-6 text-muted-foreground">{item}</div>
          ))}
        </div>
      </SectionShell>
      <SectionShell title="Selected credentials">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {certificateImages.map((cert) => <Image key={cert.label} src={cert.src} alt={cert.alt} width={420} height={280} className="aspect-[4/3] rounded-2xl object-cover shadow" />)}
        </div>
      </SectionShell>
    </>
  )
}
