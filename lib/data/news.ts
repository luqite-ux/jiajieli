// Centralized news/insights content. Structured for a future Supabase-backed
// CMS table (title, slug, date, excerpt, body, image).

export type NewsPost = {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  image: string
  body: string[]
}

export const newsPosts: NewsPost[] = [
  {
    slug: 'jiajieli-recognized-specialized-innovative-sme',
    title: 'JIAJIELI Recognized as a Specialized and Innovative SME',
    date: '2026-03-01',
    category: 'Company News',
    excerpt:
      'Zhejiang Jiajie Plastic Co., Ltd. has been recognized by the Zhejiang Provincial Department of Economy and Information Technology as a Specialized and Innovative Small and Medium Enterprise.',
    image: '/images/certs/sme-honor.png',
    body: [
      'Zhejiang Jiajie Plastic Co., Ltd. has been officially recognized as a Specialized and Innovative Small and Medium Enterprise by the Zhejiang Provincial Department of Economy and Information Technology, effective through mid-2028.',
      'The recognition reflects the company\u2019s continued investment in product development, manufacturing process control, and export-grade production standards across its PVC and TPE mat lines.',
      'This designation builds on JIAJIELI\u2019s existing High-Tech Enterprise status and supports ongoing R&D investment across its Yiwu production base.',
    ],
  },
  {
    slug: 'jiajieli-named-2025-rd-pioneer-enterprise',
    title: 'JIAJIELI Named a 2025 R&D Pioneer Enterprise',
    date: '2026-03-01',
    category: 'Company News',
    excerpt:
      'Local government recognition highlights JIAJIELI\u2019s continued investment in research and development across its anti-slip mat product lines.',
    image: '/images/certs/rd-pioneer.png',
    body: [
      'JIAJIELI has been named a 2025 R&D Pioneer Enterprise by the Niansanli Street Party Working Committee and local administrative office in Yiwu.',
      'The recognition acknowledges the company\u2019s sustained investment in new mold development, material formulation, and production-line automation across its 30 production lines.',
      'With 200+ patents and an expanding color and pattern library, JIAJIELI continues to prioritize R&D as a core part of its OEM/ODM support for international buyers.',
    ],
  },
  {
    slug: 'expanding-oem-odm-support-for-global-buyers',
    title: 'Expanding OEM/ODM Support for Global Buyers',
    date: '2026-01-15',
    category: 'Industry Insight',
    excerpt:
      'With 30 production lines and a growing color library of 200+ patterns, JIAJIELI is scaling custom production support for private-label and retail partners.',
    image: '/images/factory-aerial.png',
    body: [
      'As demand for private-label bath and floor mats grows across Europe, North America, Japan, and Australia, JIAJIELI has continued to expand its OEM/ODM production capacity.',
      'The company\u2019s Yiwu facility spans more than 50,000 square meters and operates 30 advanced production lines, including customized Haitian injection molding equipment, supporting a combined output of approximately 1.8 million pieces per month.',
      'Buyers working with JIAJIELI can specify custom colors, patterns, shapes, and packaging, with standard production lead times of approximately 15-25 working days for larger customized orders.',
    ],
  },
  {
    slug: 'understanding-compliance-references-for-anti-slip-mats',
    title: 'Understanding Compliance References for Anti-Slip Mats',
    date: '2025-11-20',
    category: 'Industry Insight',
    excerpt:
      'A brief overview of the compliance references buyers commonly request when sourcing PVC and TPE bath mats for export markets.',
    image: '/images/certs/high-tech-enterprise.png',
    body: [
      'International buyers sourcing PVC and TPE bath mats frequently reference standards and testing frameworks such as TUV, CE, EN71, REACH, and SGS when evaluating suppliers.',
      'JIAJIELI\u2019s production and inspection processes are structured around these reference points, with order-specific testing and documentation support available for qualifying export orders.',
      'For buyers with market-specific compliance requirements, JIAJIELI\u2019s team can advise on appropriate testing scope during the quotation stage.',
    ],
  },
]

export function getNewsBySlug(slug: string) {
  return newsPosts.find((post) => post.slug === slug)
}
