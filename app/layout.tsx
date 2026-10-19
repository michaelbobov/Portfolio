import type { Metadata } from 'next'
import { Playfair_Display, Noto_Sans_JP, DotGothic16 } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import SocialLinks from './components/SocialLinks'
import Footer from './components/Footer'
import MotionProvider from './components/MotionProvider'

// Geist (sans + mono) is the site-wide type; Playfair stays for the case-study headings
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700']
})
// Japanese station-sign type. Only the Japanese glyphs use these, so skip the Latin preload.
const notoJp = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-jp',
  weight: ['500', '700'],
  display: 'swap',
  preload: false,
})
// Dot-matrix face for the LED "next stop" panel
const dotGothic = DotGothic16({
  subsets: ['latin'],
  variable: '--font-dot',
  weight: '400',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://michaelbobov.com'),
  title: {
    default: 'Michael Bobov — Product Designer',
    template: '%s — Michael Bobov',
  },
  description: 'Product designer focused on AI, consumer experiences, and iterative product development.',
  openGraph: {
    title: 'Michael Bobov — Product Designer',
    description: 'Product designer focused on AI, consumer experiences, and iterative product development.',
    url: '/',
    siteName: 'Michael Bobov Portfolio',
    images: [
      {
        url: '/metadata.png',
        width: 1704,
        height: 767,
        alt: 'Michael Bobov — Product Designer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Bobov — Product Designer',
    description: 'Product designer focused on AI, consumer experiences, and iterative product development.',
    images: ['/metadata.png'],
    creator: '@michaelbobov',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} ${notoJp.variable} ${dotGothic.variable} font-sans h-full flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-wf-sheet focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg font-mono text-sm text-wf-ink focus:outline-none focus:ring-2 focus:ring-wf-ink"
        >
          Skip to content
        </a>
        <MotionProvider>
          <div className="flex-1">
            {children}
          </div>
          <SocialLinks />
          <Footer />
        </MotionProvider>
      </body>
    </html>
  )
} 