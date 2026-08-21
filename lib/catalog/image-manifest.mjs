const FACTORY_ROLES = [
  'factory-exterior-wide',
  'factory-exterior-detail',
  'injection-line-wide',
  'injection-line-detail',
  'production-and-materials',
  'finished-stock',
]

export function productSlug(product) {
  const title = String(product.sourceTitle ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .replace(/&/gu, ' ')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '')
    .slice(0, 72)
    .replace(/-$/gu, '')
  const id = String(product.sourceProductId ?? '').replace(/\D/gu, '')
  if (!title || !id) throw new Error('Product title and numeric source id are required')
  return `${title}-${id}`
}

function usableProductImages(sourceImages) {
  return [...new Set((sourceImages ?? []).map((url) => (
    url.replace(/_\d+x\d+\.(?:jpg|jpeg|png|webp)(?=$|\?)/iu, '')
  )))]
    .slice(0, 5)
}

export function buildImagePlan(products, factoryImages) {
  if (factoryImages.length && (
    factoryImages.length !== FACTORY_ROLES.length
    || new Set(factoryImages.map((image) => image.role)).size !== FACTORY_ROLES.length
    || FACTORY_ROLES.some((role) => !factoryImages.some((image) => image.role === role))
  )) {
    throw new Error('Exactly six factory image roles are required')
  }

  return {
    products: products.map((product) => {
      const slug = productSlug(product)
      const images = usableProductImages(product.sourceImages).map((sourceUrl, index) => ({
        sourceUrl,
        role: index === 0 ? 'primary' : 'gallery',
        alt: `${product.sourceTitle}${index === 0 ? '' : ` - view ${index + 1}`}`,
        r2Key: `tenants/jiajieli/catalog/${slug}/${index === 0 ? 'primary' : `gallery-${index + 1}`}.webp`,
      }))
      if (!images.length) throw new Error(`Product ${product.sourceProductId} has no usable source image`)
      return { sourceProductId: product.sourceProductId, slug, images }
    }),
    factory: factoryImages.map((image) => ({
      ...image,
      r2Key: `tenants/jiajieli/factory/${image.role}.webp`,
    })),
  }
}

export { FACTORY_ROLES }
