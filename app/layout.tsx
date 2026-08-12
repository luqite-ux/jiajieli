import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const _geist = Geist({ subsets: ['latin'], variable: '--font-sans-loaded' })
const _geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono-loaded' })
const _spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading-loaded',
})

export const metadata: Metadata = {
  title: 'JIAJIELI | Premium Anti-Slip Mat Manufacturer',
  description:
    'Zhejiang Jiajie Plastic Co., Ltd. manufactures PVC and TPE anti-slip bath mats, floor mats, door mats, and custom OEM/ODM mat solutions for global B2B buyers.',
  metadataBase: new URL('https://jiajieli.vercel.app'),
  openGraph: {
    title: 'JIAJIELI | Premium Anti-Slip Mat Manufacturer',
    description:
      'Zhejiang Jiajie Plastic Co., Ltd. manufactures PVC and TPE anti-slip bath mats, floor mats, door mats, and custom OEM/ODM mat solutions for global B2B buyers.',
    type: 'website',
    images: ['/images/logo.png'],
  },
  icons: {
    icon: [{ url: '/images/logo.png', type: 'image/png' }],
    apple: '/images/logo.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f4f9fa',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${_geist.variable} ${_geistMono.variable} ${_spaceGrotesk.variable} font-sans antialiased`}
        style={
          {
            '--font-sans': 'var(--font-sans-loaded)',
            '--font-mono': 'var(--font-mono-loaded)',
            '--font-heading': 'var(--font-heading-loaded)',
          } as React.CSSProperties
        }
      >
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
