import Image from 'next/image'
import type { Metadata } from 'next'
import { SectionShell } from '@/components/section-shell'
import { company } from '@/lib/data/company'
import { factoryImages } from '@/lib/factory-content'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'About JIAJIELI | Zhejiang Jiajie Plastic Co., Ltd.',
  description: 'Meet Zhejiang Jiajie Plastic Co., Ltd., a Jinhua supplier of bath, shower, sink, anti-slip, and door mat products.',
  alternates: { canonical: canonicalPath('/about') },
}

export default function AboutPage() {
  return (
    <>
      <SectionShell headingLevel="h1" className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff5eb]" eyebrow="About JIAJIELI" title="A focused mat supplier in Zhejiang, China." description={`${company.legalName} presents bath, shower, sink, anti-slip, and door mat options for international B2B sourcing.`} />
      <SectionShell title="Company profile">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <Image src={factoryImages.exteriorWide} alt="Zhejiang Jiajie Plastic factory exterior" width={960} height={640} priority className="aspect-[3/2] rounded-2xl object-cover shadow-lg" />
          <div className="space-y-4">
            {[
              ['Legal name', company.legalName],
              ['Business type', company.businessType],
              ['Location', company.location],
              ['Main products', company.mainProducts.join(', ')],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</p>
                <p className="mt-2 text-sm leading-6 text-card-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
      <SectionShell className="bg-secondary/45" eyebrow="Product Focus" title="A catalog built around practical household mat categories.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {company.mainProducts.map((item) => <div key={item} className="rounded-2xl border border-border bg-card p-6 font-heading text-lg font-semibold text-card-foreground">{item}</div>)}
        </div>
      </SectionShell>
    </>
  )
}
