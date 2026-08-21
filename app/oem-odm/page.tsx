import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Check } from 'lucide-react'
import { SectionShell } from '@/components/section-shell'
import { Button } from '@/components/ui/button'
import { factoryImages, oemSteps } from '@/lib/factory-content'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'OEM/ODM Bath Mat Programs | JIAJIELI',
  description: 'Discuss product materials, dimensions, colors, patterns, packaging, samples, production checks, and shipment requirements with JIAJIELI.',
  alternates: { canonical: canonicalPath('/oem-odm') },
}

const options = ['Material and construction', 'Dimensions and shape', 'Colors and surface pattern', 'Artwork and brand reference', 'Packaging configuration', 'Order-specific inspection points']

export default function OemOdmPage() {
  return (
    <main className="bg-white text-[#17363d]">
      <SectionShell headingLevel="h1" className="bg-[linear-gradient(135deg,#f8fcfb_0%,#e8f6f7_55%,#fff5e8_100%)]" eyebrow="OEM/ODM" title="Build a sourcing brief around a real product" description="Start with a catalog item or reference sample, then confirm the available material, size, appearance, packaging, and order requirements with JIAJIELI.">
        <div className="grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center"><div className="grid gap-3 sm:grid-cols-2">{options.map((option) => <div key={option} className="flex gap-3 rounded-xl border border-[#c5d5d8] bg-white p-4 text-sm font-medium"><Check className="size-5 shrink-0 text-[#275f6a]" />{option}</div>)}</div><Image src={factoryImages.productionMaterials} alt="Production equipment and mold storage at Zhejiang Jiajie Plastic" width={1200} height={900} className="aspect-[4/3] rounded-2xl border border-[#c5d5d8] object-cover shadow-lg" /></div>
      </SectionShell>
      <SectionShell eyebrow="Process" title="From product selection to order alignment"><ol className="grid gap-5 md:grid-cols-2">{oemSteps.map(([number, title, description]) => <li key={number} className="rounded-2xl border border-[#c5d5d8] bg-[#f7fbfb] p-6"><span className="flex size-10 items-center justify-center rounded-full bg-[#275f6a] font-semibold text-white">{number}</span><h2 className="mt-5 font-heading text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-[#536b70]">{description}</p></li>)}</ol></SectionShell>
      <SectionShell className="bg-[#17363d] text-white" eyebrow="Start Your Brief" title="Send the product and sourcing details you already have" description="If a specification is not yet decided, identify the intended use and target market so the available options can be reviewed."><Button asChild size="lg" className="rounded-full bg-white text-[#17363d] hover:bg-[#e8f2f3]"><Link href="/contact">Discuss a Product <ArrowRight className="size-4" /></Link></Button></SectionShell>
    </main>
  )
}
