'use client'

import Image from 'next/image'
import { useState } from 'react'

export function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const usableImages = images.length ? images : []
  const [selected, setSelected] = useState(0)
  if (!usableImages.length) return null

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-[#c5d5d8] bg-white p-3 shadow-lg">
        <Image
          src={usableImages[selected]}
          alt={`${productName}${selected ? ` - view ${selected + 1}` : ''}`}
          width={900}
          height={900}
          priority
          className="aspect-square w-full rounded-xl object-contain"
        />
      </div>
      {usableImages.length > 1 ? (
        <div className="mt-4 grid grid-cols-5 gap-2" aria-label="Product image gallery">
          {usableImages.slice(0, 10).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show product image ${index + 1}`}
              aria-pressed={selected === index}
              className={`overflow-hidden rounded-lg border-2 bg-white p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#275f6a] ${selected === index ? 'border-[#275f6a]' : 'border-[#c5d5d8]'}`}
            >
              <Image src={image} alt="" width={150} height={150} className="aspect-square object-contain" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
