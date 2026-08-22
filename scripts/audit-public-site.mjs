const baseUrl = new URL(process.argv[2] ?? 'http://localhost:3001')
const forbidden = [
  /\bwarrant(?:y|ies)\b/iu,
  /\bguarantee(?:d|s|ing)?\b/iu,
  /质保|保修|质保期|保修期/iu,
  /\bprice(?:s|d|ing)?\b/iu,
  /\bcart\b/iu,
  /\bcheckout\b/iu,
  /\bpayment(?:s)?\b/iu,
  /Ltd\.\./u,
]

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, ' ')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/&nbsp;|&#xA0;/giu, ' ')
    .replace(/\s+/gu, ' ')
}

const sitemapResponse = await fetch(new URL('/sitemap.xml', baseUrl))
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`)
const sitemap = await sitemapResponse.text()
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gu)].map((match) => {
  const published = new URL(match[1])
  return new URL(`${published.pathname}${published.search}`, baseUrl)
})

const failures = []
let cursor = 0
async function worker() {
  while (cursor < urls.length) {
    const url = urls[cursor++]
    const response = await fetch(url)
    if (!response.ok) {
      failures.push(`${url.pathname}: HTTP ${response.status}`)
      continue
    }
    const html = await response.text()
    const text = visibleText(html)
    const h1Count = (html.match(/<h1\b/giu) ?? []).length
    if (h1Count !== 1) failures.push(`${url.pathname}: ${h1Count} H1 elements`)
    for (const pattern of forbidden) {
      const match = text.match(pattern)
      if (match?.index !== undefined) {
        const context = text.slice(Math.max(0, match.index - 60), match.index + match[0].length + 80)
        failures.push(`${url.pathname}: forbidden ${pattern} near ${JSON.stringify(context)}`)
      }
    }
  }
}

await Promise.all(Array.from({ length: Math.min(12, urls.length) }, () => worker()))
console.log(JSON.stringify({ pages: urls.length, failures: failures.length }, null, 2))
if (failures.length) {
  console.error(failures.slice(0, 50).join('\n'))
  process.exitCode = 1
}
