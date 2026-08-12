// Centralized product catalog. Structured so it can migrate to a Supabase
// table (categories, products) with minimal changes to consuming components.

export type ProductCategory = {
  slug: string
  name: string
  description: string
  image: string
}

export type Product = {
  slug: string
  name: string
  categorySlug: string
  material: string
  image: string
  gallery: string[]
  features: string[]
  specs: { label: string; value: string }[]
  summary: string
}

export const categories: ProductCategory[] = [
  {
    slug: 'bathroom-anti-slip-mat',
    name: 'Bathroom Anti-slip Mat',
    description: 'Suction-base PVC and TPE mats engineered for wet bathroom floors.',
    image: '/images/products/transparent-blue.png',
  },
  {
    slug: 'kids-bath-mat',
    name: 'Kids Bath Mat',
    description: 'Soft-touch, child-focused non-slip mats for family bathrooms.',
    image: '/images/products/bubble-teal.png',
  },
  {
    slug: 'floor-mat',
    name: 'Floor Mat',
    description: 'Textured PVC floor mats for bathroom, kitchen, and entryway use.',
    image: '/images/products/woven-teal.png',
  },
  {
    slug: 'cartoon-bath-mat',
    name: 'Cartoon Bath Mat',
    description: 'Playful shaped mats that combine grip performance with character design.',
    image: '/images/products/otter.png',
  },
  {
    slug: 'massage-anti-slip-mat',
    name: 'Massage Anti-slip Mat',
    description: 'Raised-texture mats that combine foot-massage feel with stable traction.',
    image: '/images/products/durian-green.png',
  },
  {
    slug: 'door-mat',
    name: 'Door Mat',
    description: 'Entry mats built for durability and consistent anti-slip performance.',
    image: '/images/products/honeycomb-gray.png',
  },
  {
    slug: 'automotive-accessories',
    name: 'Automotive Accessories',
    description: 'Precision-molded mats and accessories for vehicle interiors.',
    image: '/images/products/woven-teal.png',
  },
]

export const products: Product[] = [
  {
    slug: 'transparent-blue-pvc-bathroom-non-slip-bath-mat',
    name: 'Transparent Blue PVC Bathroom Non-slip Bath Mat',
    categorySlug: 'bathroom-anti-slip-mat',
    material: 'Eco-friendly PVC',
    image: '/images/products/transparent-blue.png',
    gallery: ['/images/products/transparent-blue.png'],
    summary:
      'A transparent, suction-mounted PVC bath mat with a textured anti-slip surface, supplied in multiple colorways for hospitality and residential markets.',
    features: [
      'Suction cup base for secure floor mounting',
      'Textured anti-slip surface for wet-floor safety',
      'Easy cleaning and quick drying',
      'Suitable for bathrooms, hotels, and gym shower rooms',
    ],
    specs: [
      { label: 'Color Options', value: 'Transparent blue, green, red, yellow' },
      { label: 'Dimensions', value: '40 x 16 in (100 x 40 cm) / 38 x 78 cm' },
      { label: 'Weight', value: 'Approx. 2.8 kg' },
      { label: 'Material', value: 'Eco-friendly PVC' },
    ],
  },
  {
    slug: 'eco-friendly-tpe-cell-design-massage-bath-mat',
    name: 'Eco-friendly TPE Cell Design Massage Bath Mat',
    categorySlug: 'bathroom-anti-slip-mat',
    material: 'TPE',
    image: '/images/products/honeycomb-gray.png',
    gallery: ['/images/products/honeycomb-gray.png'],
    summary:
      'A honeycomb-cell TPE bath mat that pairs efficient drainage with a gentle foot-massage surface, held in place by a full suction cup base.',
    features: [
      'Non-toxic, odorless TPE material',
      'Honeycomb cell design for efficient drainage',
      'Gentle foot massage texture',
      'Suction cup base for stability',
    ],
    specs: [
      { label: 'Material', value: 'TPE (thermoplastic elastomer)' },
      { label: 'Surface', value: 'Raised honeycomb cell texture' },
      { label: 'Base', value: 'Full-surface suction cups' },
    ],
  },
  {
    slug: 'kids-special-bathroom-anti-slip-shower-mat',
    name: 'Kids Special Bathroom Anti-slip Shower Mat',
    categorySlug: 'kids-bath-mat',
    material: 'Soft silicone / eco-friendly TPE',
    image: '/images/products/bubble-teal.png',
    gallery: ['/images/products/bubble-teal.png'],
    summary:
      'A soft-touch shower mat designed specifically for children, with a gentle bubble-texture surface for confident, non-slip footing.',
    features: [
      'Child-focused design and sizing',
      'Soft touch surface',
      'Non-slip texture for safety',
      'Suitable for family bathrooms and daycare use',
    ],
    specs: [
      { label: 'Material', value: 'Soft silicone or eco-friendly TPE' },
      { label: 'Target Use', value: 'Family bathrooms, daycare facilities' },
    ],
  },
  {
    slug: 'stone-series-massage-floor-mat',
    name: 'Stone Series Massage Floor Mat',
    categorySlug: 'floor-mat',
    material: 'PVC',
    image: '/images/products/honeycomb-gray.png',
    gallery: ['/images/products/honeycomb-gray.png'],
    summary:
      'A natural stone-inspired PVC floor mat with a raised massage texture and non-slip backing, suitable across multiple rooms in the home.',
    features: [
      'Natural stone-inspired raised texture',
      'Massage-feel underfoot surface',
      'Non-slip backing',
      'Suitable for bathroom, kitchen, bedroom, and entryway',
    ],
    specs: [
      { label: 'Material', value: 'PVC' },
      { label: 'Texture', value: 'Raised stone-pattern massage surface' },
      { label: 'Backing', value: 'Non-slip base layer' },
    ],
  },
  {
    slug: 'otter-shape-cartoon-bath-mat',
    name: 'Otter Shape Cartoon Bath Mat',
    categorySlug: 'cartoon-bath-mat',
    material: 'PVC / TPE',
    image: '/images/products/otter.png',
    gallery: ['/images/products/otter.png'],
    summary:
      'A playful otter-shaped bath mat that brings character design to bathroom safety, with a soft texture and secure suction base.',
    features: [
      'Playful otter shape',
      'Soft touch texture',
      'Suction cup base for stability',
      'Suitable for children and family bathrooms',
    ],
    specs: [
      { label: 'Material', value: 'PVC / TPE' },
      { label: 'Design', value: 'Character-shaped die-cut mat' },
      { label: 'Base', value: 'Suction cup fixing' },
    ],
  },
  {
    slug: 'flower-design-bathroom-anti-slip-mat',
    name: 'Flower Design Bathroom Anti-slip Mat',
    categorySlug: 'bathroom-anti-slip-mat',
    material: 'PVC',
    image: '/images/products/flower-pink.png',
    gallery: ['/images/products/flower-pink.png'],
    summary:
      'A decorative flower-shaped PVC mat with an integrated drainage layout and suction fixing, suited to style-forward bathroom programs.',
    features: [
      'Flower-shaped silhouette',
      'Drainage layout',
      'Suction cup fixing',
      'Decorative bathroom use',
    ],
    specs: [
      { label: 'Material', value: 'PVC' },
      { label: 'Design', value: 'Flower-shaped die-cut mat' },
      { label: 'Fixing', value: 'Suction cup base' },
    ],
  },
  {
    slug: 'woven-texture-bathroom-floor-mat',
    name: 'Woven Texture Bathroom Floor Mat',
    categorySlug: 'floor-mat',
    material: 'PVC',
    image: '/images/products/woven-teal.png',
    gallery: ['/images/products/woven-teal.png'],
    summary:
      'A woven-texture PVC floor mat that combines quick drying performance with dependable anti-slip traction across wet-room floors.',
    features: [
      'Woven texture surface',
      'Anti-slip floor traction',
      'Quick drying',
      'Suitable for bathroom, kitchen, and laundry room',
    ],
    specs: [
      { label: 'Material', value: 'PVC' },
      { label: 'Texture', value: 'Woven lattice pattern' },
      { label: 'Drying', value: 'Quick-dry surface' },
    ],
  },
  {
    slug: 'durian-shape-massage-anti-slip-mat',
    name: 'Durian Shape Massage Anti-slip Mat',
    categorySlug: 'massage-anti-slip-mat',
    material: 'Eco-friendly PVC',
    image: '/images/products/durian-green.png',
    gallery: ['/images/products/durian-green.png'],
    summary:
      'A durian-inspired raised-texture mat that delivers a wellness-focused foot massage feel on a stable, non-slip base.',
    features: [
      'Raised durian-inspired texture',
      'Foot massage feel',
      'Stable non-slip base',
      'Creative wellness-focused design',
    ],
    specs: [
      { label: 'Material', value: 'Eco-friendly PVC' },
      { label: 'Texture', value: 'Raised nodular massage surface' },
      { label: 'Category Focus', value: 'Wellness / spa-style use' },
    ],
  },
]

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug)
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((product) => product.categorySlug === categorySlug)
}
