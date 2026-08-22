import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/data/products'

export function ProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  return (
    <article className="motion-card group flex rounded-2xl border border-[#c5d5d8] bg-white p-4 shadow-sm">
      <div className="flex w-full flex-col">
        <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}>
          <span className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(145deg,#f8fbfb,#e9f4f5)] p-4">
            <Image src={product.image} alt={product.name} width={520} height={520} className="h-full w-full object-contain" />
          </span>
        </Link>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#b45309]">{categoryName}</p>
        <h2 className="mt-2 line-clamp-3 font-heading text-lg font-semibold leading-snug text-[#17363d]">
          <Link href={`/products/${product.slug}`} className="hover:text-[#275f6a]">{product.name}</Link>
        </h2>
        <p className="mt-2 min-h-5 text-sm text-[#536b70]">{product.material || 'Specification on inquiry'}</p>
        <Button asChild className="mt-5 w-full rounded-full">
          <Link href={`/products/${product.slug}`} className="motion-link">View Details <ArrowRight className="size-4" /></Link>
        </Button>
      </div>
    </article>
  )
}
