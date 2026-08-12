import Image from 'next/image'
import { SectionShell } from '@/components/section-shell'
import { company, certificateImages } from '@/lib/data/company'

export default function AboutPage() {
  return (
    <>
      <SectionShell className="bg-gradient-to-br from-[#eef9fa] via-white to-[#fff5eb]" eyebrow="About JIAJIELI" title={`${company.legalName} has focused on anti-slip mat manufacturing since ${company.foundedYear}.`} description="From Yiwu, Zhejiang, JIAJIELI supplies PVC and TPE mat programs for global B2B buyers, private-label brands, hospitality channels, and household goods distributors." />
      <SectionShell title="Factory facts buyers can verify.">
        <div className="grid gap-6 md:grid-cols-2">
          <Image src="/images/factory-aerial.png" alt="JIAJIELI factory exterior" width={900} height={620} className="rounded-2xl object-cover shadow-lg" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['26 years', 'Manufacturing experience'],
              ['50,000+ m2', 'Factory area'],
              ['30', 'Advanced production lines'],
              ['8,000 tons', 'Annual output'],
              ['65%+', 'Export share'],
              ['200+', 'Patterns and patent references'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-heading text-3xl font-semibold text-primary">{value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
      <SectionShell className="bg-secondary/45" eyebrow="Credentials" title="Selected company honors and compliance references">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {certificateImages.map((cert) => (
            <figure key={cert.label} className="rounded-2xl border border-border bg-card p-4">
              <Image src={cert.src} alt={cert.alt} width={420} height={280} className="aspect-[4/3] rounded-xl object-cover" />
              <figcaption className="mt-3 text-sm font-semibold text-foreground">{cert.label}</figcaption>
            </figure>
          ))}
        </div>
      </SectionShell>
    </>
  )
}
