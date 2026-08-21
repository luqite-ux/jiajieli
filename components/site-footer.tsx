import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, ArrowRight } from 'lucide-react'
import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import { company } from '@/lib/data/company'
import { categories } from '@/lib/data/products'
import { mainNav } from '@/lib/data/nav'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/images/logo.png"
              alt="JIAJIELI logo"
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {company.legalName} presents bath, shower, sink, anti-slip, and door mat options for B2B product sourcing.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              Product Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {categories.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {mainNav.slice(1).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <a href={`mailto:${company.contactEmail}`} className="hover:text-foreground">
                  {company.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{company.address}</span>
              </li>
            </ul>
            <Button asChild size="sm" className="mt-5 rounded-full">
              <Link href="/contact">
                Send an Inquiry
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p>B2B inquiries only &middot; No online sales</p>
        </div>
      </Container>
    </footer>
  )
}
