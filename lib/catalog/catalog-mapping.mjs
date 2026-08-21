import { productSlug } from './image-manifest.mjs'

const TENANT_ID = 'a1471a06-d1a8-4fe8-a12d-59cc6fe2b12b'

export const CATALOG_CATEGORIES = [
  ['shower-bath-mats', 'Shower & Bath Mats', 'Anti-slip mats for shower and bathtub areas.'],
  ['massage-bath-mats', 'Massage Bath Mats', 'Textured bath mats with massage-oriented surface designs.'],
  ['kids-cartoon-bath-mats', 'Kids & Cartoon Bath Mats', 'Bath mats with child-focused sizes, shapes, or printed designs.'],
  ['sink-mats', 'Sink Mats', 'Protective and drainable mats designed for sink areas.'],
  ['door-mats', 'Door & Coil Mats', 'Entry and coil mat products for doorway applications.'],
  ['scrubber-mats', 'Scrubber & Brush Mats', 'Silicone and related scrubber-style mat products.'],
  ['modular-floor-mats', 'Modular Floor Mats', 'Interlocking and modular mats for wet floor coverage.'],
]

const categoryLabel = new Map(CATALOG_CATEGORIES.map(([slug, name]) => [slug, name]))

export function parseProductFacts(title) {
  const text = String(title)
  const materialMatches = [
    ['PVC', /\bPVC\b/iu],
    ['TPE', /\bTPE\b/iu],
    ['TPR', /\bTPR\b/iu],
    ['Silicone', /\b(?:silicone|silica gel)\b/iu],
    ['Rubber', /\brubber\b/iu],
    ['PP', /\bPP\b/iu],
    ['EVA', /\bEVA\b/iu],
  ].filter(([, pattern]) => pattern.test(text)).map(([name]) => name)
  const sizeMatch = text.match(/(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(cm|inches?|in)?\b/iu)
  const unit = sizeMatch?.[3]?.toLowerCase()
  const normalizedUnit = unit?.startsWith('in') ? ' in' : unit === 'cm' ? ' cm' : ''
  return {
    material: materialMatches.join(' / '),
    size: sizeMatch ? `${sizeMatch[1]}×${sizeMatch[2]}${normalizedUnit}` : '',
  }
}

export function classifyProduct(title) {
  const text = String(title).toLowerCase()
  if (/\bsink\b/u.test(text)) return 'sink-mats'
  if (/\b(?:door|entry|coil)\b/u.test(text)) return 'door-mats'
  if (/\b(?:scrubber|scrub|brush)\b/u.test(text)) return 'scrubber-mats'
  if (/\b(?:interlocking|interlock|splice|splicing|modular)\b/u.test(text)) return 'modular-floor-mats'
  if (/\b(?:kid|kids|baby|children|child|toddler|cartoon|fish|turtle|animal)\b/u.test(text)) return 'kids-cartoon-bath-mats'
  if (/\b(?:massage|pebble|stone|bubble|honeycomb|cell)\b/u.test(text)) return 'massage-bath-mats'
  return 'shower-bath-mats'
}

function sourceFeatures(title) {
  const text = title.toLowerCase()
  const features = []
  if (/non[- ]?slip|anti[- ]?slip/iu.test(text)) features.push('Anti-slip surface design')
  if (/suction|sucker/iu.test(text)) features.push('Suction-cup backing')
  if (/drain/iu.test(text)) features.push('Drain-hole design')
  if (/machine washable/iu.test(text)) features.push('Machine-washable construction')
  if (/massage|pebble|stone|bubble/iu.test(text)) features.push('Textured massage surface')
  if (/water absorption|absorbent/iu.test(text)) features.push('Water-absorbent surface')
  return [...new Set(features)]
}

function categoryApplications(categorySlug) {
  const applications = {
    'sink-mats': ['Kitchen and utility sink areas'],
    'door-mats': ['Residential and commercial entryways'],
    'scrubber-mats': ['Bathroom washing and scrubbing areas'],
    'modular-floor-mats': ['Wet rooms and modular floor coverage'],
    'kids-cartoon-bath-mats': ['Family bathrooms and bathtubs'],
    'massage-bath-mats': ['Showers, bathtubs, and bathroom floors'],
    'shower-bath-mats': ['Showers, bathtubs, and bathroom floors'],
  }
  return applications[categorySlug]
}

export function buildCatalog(sources, imageReferences) {
  const imagesByProduct = new Map()
  for (const image of imageReferences.filter((entry) => entry.sourceProductId)) {
    if (!imagesByProduct.has(image.sourceProductId)) imagesByProduct.set(image.sourceProductId, [])
    imagesByProduct.get(image.sourceProductId).push(image)
  }

  const grouped = new Map()
  for (const source of sources) {
    const images = imagesByProduct.get(source.sourceProductId) ?? []
    const primary = images.find((image) => image.role === 'primary')
    if (!primary) throw new Error(`Missing uploaded primary image for ${source.sourceProductId}`)
    const facts = parseProductFacts(source.sourceTitle)
    const signature = `${primary.outputSha256}|${facts.material}|${facts.size}`
    if (!grouped.has(signature)) grouped.set(signature, [])
    grouped.get(signature).push({ source, images, facts })
  }

  const products = [...grouped.values()].map((entries, sortOrder) => {
    const canonical = [...entries].sort((a, b) => a.source.sourceTitle.length - b.source.sourceTitle.length)[0]
    const sourcesForProduct = entries.map((entry) => entry.source)
    const allImages = [...new Map(
      entries.flatMap((entry) => entry.images).map((image) => [image.outputSha256, image]),
    ).values()]
    const primary = canonical.images.find((image) => image.role === 'primary') ?? allImages[0]
    const gallery = [primary, ...allImages.filter((image) => image.outputSha256 !== primary.outputSha256)]
    const name = canonical.source.sourceTitle
    const categorySlug = classifyProduct(name)
    const description = `This product is documented from JIAJIELI's public Alibaba catalog. Confirm the available specifications for the selected item during inquiry.`
    const overview = `${name}. ${description}`
    const features = sourceFeatures(sourcesForProduct.map((source) => source.sourceTitle).join(' '))
    const applications = categoryApplications(categorySlug)
    const specs = Object.fromEntries(Object.entries({
      Material: canonical.facts.material,
      Size: canonical.facts.size,
    }).filter(([, value]) => value))
    return {
      tenant_id: TENANT_ID,
      slug: productSlug(canonical.source),
      model: `JJ-${canonical.source.sourceProductId}`,
      name,
      name_en: name,
      name_i18n: { en: name },
      description,
      description_en: description,
      description_i18n: { en: description },
      overview,
      overview_en: overview,
      overview_i18n: { en: overview },
      category: categoryLabel.get(categorySlug),
      category_slug: categorySlug,
      features,
      features_i18n: { en: features },
      applications,
      applications_i18n: { en: applications },
      advantages: [],
      advantages_i18n: { en: [] },
      specs,
      image_url: primary.publicUrl,
      sort_order: sortOrder,
      is_active: true,
      extra_data: {
        delivery_key: 'jiajieli-alibaba-2026-08-21',
        multilingual_ready: true,
        images: gallery.map((image) => image.publicUrl),
        source_product_ids: sourcesForProduct.map((source) => source.sourceProductId),
        source_urls: sourcesForProduct.map((source) => source.sourceUrl),
        source_content_hashes: sourcesForProduct.map((source) => source.contentHash),
        source_checked_at: '2026-08-21T11:51:51.734Z',
        image_processing: 'sRGB WebP, EXIF orientation corrected, max 1600px, no generative edits',
      },
    }
  })

  const categories = CATALOG_CATEGORIES.map(([slug, name, description], sortOrder) => ({
    tenant_id: TENANT_ID,
    slug,
    name,
    name_en: name,
    name_i18n: { en: name },
    description,
    description_en: description,
    description_i18n: { en: description },
    sort_order: sortOrder,
    is_active: true,
    extra_data: { source: 'JIAJIELI Alibaba catalog audit 2026-08-21' },
  }))

  return { categories, products }
}

export { TENANT_ID }
