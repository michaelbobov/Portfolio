import type { Metadata } from 'next'
import { Playfair_Display, Bangers, Bricolage_Grotesque, Instrument_Serif, Silkscreen } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Footer from './components/Footer'
import MotionProvider from './components/MotionProvider'

// Geist is the site-wide type (Geist Mono only for the case studies' own labels); Playfair stays for the case-study headings
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700']
})
// Homepage type: Bricolage Grotesque for display (headline key words, the living "Featured Work"
// title, "More about me" and the footer name); Bangers only for comic sound effects and labels;
// Instrument Serif and Silkscreen as accents (headline small words and the Seattle sticker, the
// skill stickers, the panel tickers, "More about me")
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['opsz', 'wdth'],
  display: 'swap',
})
const bangers = Bangers({
  subsets: ['latin'],
  variable: '--font-comic',
  weight: '400',
  display: 'swap',
})
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif-accent',
  weight: '400',
  style: 'italic',
  display: 'swap',
  preload: false,
})
const silkscreen = Silkscreen({
  subsets: ['latin'],
  variable: '--font-pixel',
  weight: ['400', '700'],
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
      <body className={`${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} ${bricolage.variable} ${bangers.variable} ${instrumentSerif.variable} ${silkscreen.variable} font-sans h-full flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-wf-sheet focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg text-sm font-medium text-wf-ink focus:outline-none focus:ring-2 focus:ring-wf-ink"
        >
          Skip to content
        </a>
        <MotionProvider>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  )
} 