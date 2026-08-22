export interface HeroSlide {
  id: string
  eyebrow: string
  heading: string
  description: string
  image: string
  imageAlt: string
  ctaLabel: string
  ctaHref: string
}

export const heroSlides = [
  {
    id: 'bathroom-collection',
    eyebrow: 'Bath & Household Mat Sourcing',
    heading: 'Mat Collections Designed for Everyday Spaces',
    description: 'Explore bath, shower, sink, door, massage, and anti-slip mat options for B2B sourcing programs.',
    image: '/images/hero/product-bathroom.webp',
    imageAlt: 'Turquoise JIAJIELI bath mat styled in a bright modern bathroom',
    ctaLabel: 'Explore Products',
    ctaHref: '/products',
  },
  {
    id: 'factory-line',
    eyebrow: 'Manufacturing View',
    heading: 'See the Production Environment Behind the Product',
    description: 'Review customer-supplied factory imagery, production activity, and the path from material preparation to packing.',
    image: '/images/hero/factory-line.webp',
    imageAlt: 'Brightened wide view of the JIAJIELI production workshop',
    ctaLabel: 'View Manufacturing',
    ctaHref: '/manufacturing',
  },
  {
    id: 'production-equipment',
    eyebrow: 'Equipment & Project Review',
    heading: 'Turn Product Requirements into a Clear Sourcing Brief',
    description: 'Share the item, size, color, quantity, artwork, and packing requirements for project review.',
    image: '/images/hero/production-equipment.webp',
    imageAlt: 'Brightened row of production equipment at the JIAJIELI facility',
    ctaLabel: 'Start an Inquiry',
    ctaHref: '/contact',
  },
] satisfies readonly HeroSlide[]
