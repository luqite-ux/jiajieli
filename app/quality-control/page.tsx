import Image from 'next/image'
import type { Metadata } from 'next'
import { ClipboardCheck, PackageCheck, Ruler, ScanSearch } from 'lucide-react'
import { SectionShell } from '@/components/section-shell'
import { factoryImages } from '@/lib/factory-content'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Quality Control | JIAJIELI Order Inspection',
  description: 'Review the practical inspection points that can be confirmed for a JIAJIELI mat order.',
  alternates: { canonical: canonicalPath('/quality-control') },
}

const stages = [
  { title: 'Order Requirement Review', text: 'Product, dimensions, color, artwork, labels, packaging, quantity, and inspection needs are documented for the order.', icon: ClipboardCheck },
  { title: 'Appearance Check', text: 'Surface texture, color, edges, openings, and other visible details can be checked against the confirmed sample or specification.', icon: ScanSearch },
  { title: 'Size & Detail Check', text: 'Order-specific dimensions and selected construction details can be reviewed during production inspection.', icon: Ruler },
  { title: 'Packing Check', text: 'Labels, inserts, carton marks, packing method, and quantity can be checked against the confirmed packing requirements.', icon: PackageCheck },
] as const

export default function QualityControlPage() {
  return (
    <>
      <SectionShell headingLevel="h1" className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff7ed]" eyebrow="Quality Control" title="Inspection points aligned with the confirmed order." description="Testing, documentation, and third-party inspection requirements differ by product and market. Include them in your inquiry so the applicable scope can be reviewed before ordering.">
        <Image src={factoryImages.lineWide} alt="Production activity inside the JIAJIELI factory" width={1200} height={720} priority className="aspect-[16/7] w-full rounded-2xl object-cover shadow-lg" />
      </SectionShell>
      <SectionShell title="Practical inspection touchpoints">
        <div className="grid gap-5 md:grid-cols-2">
          {stages.map((stage) => { const Icon = stage.icon; return <div key={stage.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm"><Icon className="size-7 text-primary" aria-hidden="true" /><h2 className="mt-5 font-heading text-lg font-semibold text-card-foreground">{stage.title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{stage.text}</p></div> })}
        </div>
      </SectionShell>
    </>
  )
}
