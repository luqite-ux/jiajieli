import { SectionShell } from '@/components/section-shell'
import { certificateImages, company } from '@/lib/data/company'
import { ClipboardCheck, Factory, FileSearch, FlaskConical, PackageCheck, Ruler } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Quality Control | JIAJIELI Export Mat Inspection',
  description:
    'Review JIAJIELI factory inspection touchpoints, export documentation, and common compliance references for PVC and TPE bath mat sourcing.',
  alternates: { canonical: canonicalPath('/quality-control') },
}

const inspectionStages = [
  {
    title: 'Material & Formula Review',
    description:
      'PVC, TPE, color masterbatch, and order-specific additives are checked before production scheduling so the workshop starts from agreed specifications.',
    icon: FlaskConical,
  },
  {
    title: 'Molding Line Checks',
    description:
      'Across 20+ professional production lines, operators review surface texture, suction-cup shape, drainage openings, color consistency, and trim finish.',
    icon: Factory,
  },
  {
    title: 'Dimensional & Appearance Inspection',
    description:
      'Sampling covers size, thickness feel, edge condition, print or pattern alignment, and visible defects before mats move to packing.',
    icon: Ruler,
  },
  {
    title: 'Packing & Carton Review',
    description:
      'Private-label labels, inserts, carton marks, quantity, and packaging method are checked against the purchase order and export packing plan.',
    icon: PackageCheck,
  },
  {
    title: 'Document Preparation',
    description:
      'Inspection notes, product photos, packing details, and requested third-party test references can be organized for buyer review before shipment.',
    icon: ClipboardCheck,
  },
  {
    title: 'Compliance File Support',
    description:
      'The domestic company site references TUV, CE, EN71, REACH, SGS, and anti-mildew or antibacterial evaluations for applicable sourcing programs.',
    icon: FileSearch,
  },
] as const

const factoryFacts = [
  { value: '50,000+', label: 'sqm factory area in Yiwu' },
  { value: '20+', label: 'professional production lines referenced by the domestic site' },
  { value: '50+', label: 'countries and regions served through export sales' },
] as const

export default function QualityControlPage() {
  return (
    <>
      <SectionShell
        className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff7ed]"
        eyebrow="Quality Control"
        title="Factory-backed inspection for export mat orders."
        description="JIAJIELI's domestic company site describes a Yiwu-based bath mat manufacturer with a 50,000+ sqm facility, professional production lines, self-operated import and export rights, and inspection references used for overseas sourcing programs."
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="grid gap-4 sm:grid-cols-3">
            {factoryFacts.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-primary/15 bg-white/85 p-6 shadow-sm">
                <p className="font-heading text-3xl font-semibold text-primary">{fact.value}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{fact.label}</p>
              </div>
            ))}
          </div>
          <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-primary/15 bg-primary/10">
            <Image
              src="/images/factory-aerial.png"
              alt="JIAJIELI factory and production site"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell title="Compliance references">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              Buyer programs can align order inspection and documentation with common references listed by JIAJIELI's
              domestic site. Final testing scope, samples, materials, and labeling requirements should be confirmed per
              purchase order.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {company.certifications.map((cert) => (
                <span
                  key={cert.code}
                  className="rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary"
                >
                  {cert.label}
                </span>
              ))}
              <span className="rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
                Anti-mildew
              </span>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
                Antibacterial
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Self-operated import and export rights for direct foreign-trade coordination.',
              'Bath mat R&D, production, and sales integrated in one daily-use products company.',
              'Large-chain retail and supermarket supply experience referenced on the domestic site.',
              'Export sales reported across Europe, North America, Southeast Asia, and other markets.',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-card p-5 text-sm leading-6 text-card-foreground shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="bg-secondary/45" title="Inspection touchpoints">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {inspectionStages.map((stage) => {
            const Icon = stage.icon
            return (
              <div key={stage.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-card-foreground">{stage.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{stage.description}</p>
              </div>
            )
          })}
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
