import Image from 'next/image'
import type { Metadata } from 'next'
import { SectionShell } from '@/components/section-shell'
import { company } from '@/lib/data/company'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Manufacturing | JIAJIELI Production Base',
  description:
    'See how JIAJIELI supports custom B2B mat programs with 30 production lines, sampling checkpoints, and repeat-order manufacturing capacity.',
  alternates: { canonical: canonicalPath('/manufacturing') },
}

export default function ManufacturingPage() {
  return (
    <>
      <SectionShell className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff7ed]" eyebrow="Manufacturing" title="Scalable mat production for custom B2B programs." description={`${company.productionLines} production lines, customized injection molding equipment, and flexible OEM/ODM support help buyers move from samples to repeat orders.`} />
      <SectionShell title="Capability Flow">
        <div className="grid gap-5 lg:grid-cols-4">
          {['Requirement Review', 'Material & Mold Setup', 'Pilot Sample', 'Batch Production'].map((step, index) => (
            <div key={step} className="rounded-2xl border border-border bg-card p-6">
              <p className="font-heading text-4xl font-semibold text-primary">0{index + 1}</p>
              <h2 className="mt-5 font-heading text-xl font-semibold">{step}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Clear checkpoints keep color, texture, size, packaging, and order-specific inspection expectations aligned before shipment.</p>
            </div>
          ))}
        </div>
      </SectionShell>
      <SectionShell className="bg-secondary/45" title="Production Base">
        <Image src="/images/factory-aerial.png" alt="JIAJIELI production base" width={1200} height={650} className="w-full rounded-2xl object-cover shadow-lg" />
      </SectionShell>
    </>
  )
}
