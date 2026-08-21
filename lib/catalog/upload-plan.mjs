export function buildUploadPlan(processedImages, publicBaseUrl) {
  const base = publicBaseUrl.replace(/\/$/u, '')
  const uploadsByKey = new Map()
  const references = []

  for (const image of processedImages) {
    const isProduct = Boolean(image.sourceProductId)
    const r2Key = isProduct
      ? `tenants/jiajieli/catalog/shared/${image.outputSha256}.webp`
      : image.r2Key
    if (!r2Key) throw new Error(`Missing R2 key for image role ${image.role}`)
    if (!uploadsByKey.has(r2Key)) {
      uploadsByKey.set(r2Key, { r2Key, localPath: image.localPath, outputSha256: image.outputSha256 })
    }
    references.push({ ...image, r2Key, publicUrl: `${base}/${r2Key}` })
  }

  return { uploads: [...uploadsByKey.values()], references }
}
