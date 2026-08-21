import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { SectionShell } from '@/components/section-shell'
import { Button } from '@/components/ui/button'
import { factoryImages } from '@/lib/factory-content'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Manufacturing | JIAJIELI',
  description: 'View customer-provided factory photographs showing the JIAJIELI production building, injection molding equipment, production materials, and finished mat stock.',
  alternates: { canonical: canonicalPath('/manufacturing') },
}

const scenes = [
  [factoryImages.exteriorWide, 'Zhejiang Jiajie Plastic production building', 'Factory Exterior', 'A current exterior view supplied by the customer identifies the operating production site.'],
  [factoryImages.lineWide, 'Panoramic view of injection molding equipment inside the JIAJIELI factory', 'Production Floor', 'A wide factory view shows injection molding equipment arranged across the production floor.'],
  [factoryImages.lineDetail, 'Injection molding equipment and mat components inside the JIAJIELI factory', 'Production Detail', 'A closer view documents equipment, material handling, and produced mat components.'],
  [factoryImages.finishedStock, 'Organized finished mat stock inside the JIAJIELI factory', 'Finished Stock', 'The panoramic stock area shows finished mat products organized for subsequent order handling.'],
] as const

export default function ManufacturingPage() {
  return (
    <main className="bg-[#eef8f9] text-[#17363d]">
      <SectionShell headingLevel="h1" className="bg-[linear-gradient(135deg,#f8fcfb_0%,#e8f6f7_55%,#fff5e8_100%)]" eyebrow="Manufacturing" title="A documented view of the JIAJIELI factory" description="These customer-provided photographs show the factory exterior, production equipment, material flow, and finished mat stock. Capacity and order-specific requirements are confirmed during inquiry.">
        <Image src={factoryImages.exteriorDetail} alt="Detailed exterior view of the Zhejiang Jiajie Plastic factory entrance" width={1600} height={1080} priority className="mt-4 aspect-[16/8] w-full rounded-3xl border border-[#c5d5d8] object-cover shadow-xl" />
      </SectionShell>
      <SectionShell className="bg-white" eyebrow="Factory Tour" title="Production evidence, not stock imagery">
        <div className="grid gap-6 md:grid-cols-2">{scenes.map(([image, alt, title, description]) => <article key={title} className="overflow-hidden rounded-2xl border border-[#c5d5d8] bg-white shadow-sm"><Image src={image} alt={alt} width={1200} height={800} className="aspect-[4/3] w-full object-cover" /><div className="p-6"><h2 className="font-heading text-2xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-[#536b70]">{description}</p></div></article>)}</div>
      </SectionShell>
      <SectionShell className="bg-[#17363d] text-white" eyebrow="Order Alignment" title="Confirm the production scope for the selected product" description="Material, dimensions, colors, patterns, packaging, inspection points, and shipment arrangements are handled as order-specific requirements.">
        <div className="flex flex-col gap-3 sm:flex-row"><Button asChild size="lg" className="rounded-full bg-white text-[#17363d] hover:bg-[#e8f2f3]"><Link href="/oem-odm">View OEM/ODM Process <ArrowRight className="size-4" /></Link></Button><Button asChild size="lg" variant="outline" className="rounded-full border-white bg-transparent text-white hover:bg-white/10"><Link href="/contact">Send an Inquiry</Link></Button></div>
      </SectionShell>
    </main>
  )
}
