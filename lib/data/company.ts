// Centralized company facts. Keep this the single source of truth so it can
// later be swapped for a Supabase-backed CMS without touching page code.

export const company = {
  name: 'JIAJIELI',
  legalName: 'Zhejiang Jiajie Plastic Co., Ltd.',
  foundedYear: 2000,
  yearsOfExperience: 26,
  annualOutputTons: 8000,
  factoryAreaSqm: 50000,
  productionLines: 30,
  monthlyCapacityPieces: 1_800_000,
  dailyCapacityPieces: 60_000,
  leadTimeStandard: '15-25 working days for larger customized orders',
  leadTimeSample: 'Available-stock samples can ship faster',
  exportShare: 65,
  exportMarkets: ['Europe', 'North America', 'Japan', 'Australia', 'and other global markets'],
  annualForeignExchangeUSD: 8_500_000,
  colorLibraryPatterns: 200,
  patents: 200,
  contactEmail: 'sales3@ywjiajie.com',
  address: 'No. 199 Kaiyuan North Street, Niansanli, Yiwu, Zhejiang, China',
  referenceWebsite: 'http://www.ywjiajie.com',
  strengths: [
    'Extensive color library with 200+ patterns',
    '200+ patents',
    'Industry standard participation',
    'OEM/ODM support',
  ],
  certifications: [
    { code: 'TUV', label: 'TUV' },
    { code: 'CE', label: 'CE' },
    { code: 'EN71', label: 'EN71' },
    { code: 'REACH', label: 'REACH' },
    { code: 'SGS', label: 'SGS' },
  ],
} as const

export const proofStats = [
  { value: 26, suffix: '', label: 'Years of Manufacturing' },
  { value: 50000, suffix: '+', label: 'sqm Factory' },
  { value: 30, suffix: '', label: 'Production Lines' },
  { value: 8000, suffix: '', label: 'Tons Annual Output' },
  { value: 65, suffix: '%+', label: 'Export Share' },
  { value: 200, suffix: '+', label: 'Color Patterns' },
] as const

export const applicationMarkets = [
  {
    title: 'Home Bathrooms',
    description: 'Anti-slip comfort mats designed for daily residential use.',
  },
  {
    title: 'Hotels & Hospitality',
    description: 'Durable, easy-clean mats for high-traffic guest bathrooms.',
  },
  {
    title: 'Apartments & Property Management',
    description: 'Consistent-quality mats supplied at scale for multi-unit properties.',
  },
  {
    title: 'Gyms & Fitness Facilities',
    description: 'Textured anti-slip surfaces built for wet shower-room traffic.',
  },
  {
    title: 'Childcare Facilities',
    description: 'Soft-touch, child-safe surfaces for family and daycare bathrooms.',
  },
  {
    title: 'Retail & Private Label',
    description: 'OEM/ODM programs with custom branding, colors, and packaging.',
  },
  {
    title: 'Automotive Accessories',
    description: 'Precision-molded floor and trunk mats for vehicle interiors.',
  },
] as const

export const certificateImages = [
  {
    src: '/images/certs/high-tech-enterprise.png',
    alt: 'High-Tech Enterprise honorary credential issued to Zhejiang Jiajie Plastic Co., Ltd.',
    label: 'High-Tech Enterprise',
  },
  {
    src: '/images/certs/sme-honor.png',
    alt: 'Zhejiang Province Specialized and Innovative SME honorary credential',
    label: 'Specialized & Innovative SME',
  },
  {
    src: '/images/certs/rd-pioneer.png',
    alt: 'R&D Pioneer Enterprise 2025 recognition certificate',
    label: 'R&D Pioneer Enterprise',
  },
  {
    src: '/images/certs/council-member.png',
    alt: 'Council member unit plaque, Yiwu Small Commodity Standard Innovation Federation',
    label: 'Council Member Unit',
  },
] as const
