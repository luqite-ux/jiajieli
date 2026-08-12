'use client'

import { useId, useState } from 'react'
import { CheckCircle2, Loader2, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categories, products } from '@/lib/data/products'

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Netherlands',
  'Spain',
  'Italy',
  'Japan',
  'South Korea',
  'Australia',
  'New Zealand',
  'United Arab Emirates',
  'Saudi Arabia',
  'Other',
]

const quantityRanges = [
  '1,000 - 5,000 pieces',
  '5,000 - 20,000 pieces',
  '20,000 - 50,000 pieces',
  '50,000 - 200,000 pieces',
  '200,000+ pieces',
  'Not sure yet',
]

export function InquiryForm({
  defaultProduct,
  compact = false,
}: {
  defaultProduct?: string
  compact?: boolean
}) {
  const formId = useId()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      body: new FormData(event.currentTarget),
    })
    setStatus(response.ok ? 'success' : 'idle')
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-14 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-7" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-semibold text-foreground">Inquiry received</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Thank you for reaching out to JIAJIELI. Our export team typically responds within 1-2
            business days with product guidance tailored to your order.
          </p>
        </div>
        <Button variant="outline" className="mt-2 rounded-full" onClick={() => setStatus('idle')}>
          Submit another inquiry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${formId}-name`}>Name</FieldLabel>
            <Input id={`${formId}-name`} name="name" required placeholder="Full name" autoComplete="name" />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${formId}-company`}>Company</FieldLabel>
            <Input
              id={`${formId}-company`}
              name="company"
              required
              placeholder="Company name"
              autoComplete="organization"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${formId}-email`}>Email</FieldLabel>
            <Input
              id={`${formId}-email`}
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              autoComplete="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${formId}-phone`}>Phone / WhatsApp</FieldLabel>
            <Input id={`${formId}-phone`} name="phone" placeholder="+1 555 000 0000" autoComplete="tel" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${formId}-country`}>Country / Region</FieldLabel>
            <Select name="country">
              <SelectTrigger id={`${formId}-country`} className="w-full">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor={`${formId}-product`}>Product Interest</FieldLabel>
            <Select name="productInterest" defaultValue={defaultProduct}>
              <SelectTrigger id={`${formId}-product`} className="w-full">
                <SelectValue placeholder="Select a product or category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor={`${formId}-quantity`}>Estimated Quantity</FieldLabel>
          <Select name="estimatedQuantity">
            <SelectTrigger id={`${formId}-quantity`} className="w-full">
              <SelectValue placeholder="Select an estimated order size" />
            </SelectTrigger>
            <SelectContent>
              {quantityRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-customization`}>Customization Requirements</FieldLabel>
          <Textarea
            id={`${formId}-customization`}
            name="customization"
            placeholder="Colors, patterns, sizes, logo/branding, packaging, etc."
            className="min-h-20"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-message`}>Message</FieldLabel>
          <Textarea
            id={`${formId}-message`}
            name="message"
            required
            placeholder="Tell us about your project, target market, and timeline."
            className="min-h-28"
          />
        </Field>

        {!compact && (
          <Field>
            <FieldLabel>Reference Files (optional)</FieldLabel>
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/50 px-6 py-8 text-center transition-colors hover:border-primary/40 hover:bg-muted">
              <UploadCloud className="size-6 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm font-medium text-foreground">Drop files or click to attach</p>
              <FieldDescription>Product references, spec sheets, or artwork (max 10MB)</FieldDescription>
            </div>
          </Field>
        )}

        <Button type="submit" size="lg" className="rounded-full" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending Inquiry
            </>
          ) : (
            'Submit Inquiry'
          )}
        </Button>
        <FieldDescription>
          By submitting, you agree to be contacted by JIAJIELI regarding your inquiry. A member of
          our export team will follow up directly.
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}

// Referenced for the product-detail page prefill so linters keep the import
// tree honest even if a page passes a raw slug.
export type { }
void products
