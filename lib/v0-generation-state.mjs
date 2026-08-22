export const requiredV0RouteFiles = [
  'app/page.tsx',
  'app/about/page.tsx',
  'app/products/page.tsx',
  'app/products/[slug]/page.tsx',
  'app/manufacturing/page.tsx',
  'app/oem-odm/page.tsx',
  'app/quality-control/page.tsx',
  'app/faq/page.tsx',
  'app/news/page.tsx',
  'app/news/[slug]/page.tsx',
  'app/contact/page.tsx',
]

export function isUsableV0Version(version, requiredFiles = requiredV0RouteFiles) {
  if (!version?.id || version.status !== 'completed' || !version.files?.length) return false
  const fileNames = new Set(version.files.map((file) => file.name))
  return requiredFiles.every((file) => fileNames.has(file))
}
