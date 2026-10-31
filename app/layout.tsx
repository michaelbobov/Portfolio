import type { Metadata } from 'next'
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import './site.css'
import { SiteClose } from './components/Site'
import HideOnHome from './components/HideOnHome'
import Dock from './components/Dock'
import MotionProvider from './components/MotionProvider'

// Geist for text and UI, Bricolage Grotesque for display (headlines, section and panel titles, the
// footer name), and Instrument Serif italic for one accent phrase per homepage heading
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['opsz', 'wdth'],
  display: 'swap',
})
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif-accent',
  weight: '400',
  style: 'italic',
  display: 'swap',
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
    // The script marks that scripts run, before the first paint, so the flat dolls can wait unseen for
    // the 3D ones (hp.css); it changes the class after the server's, hence suppressHydrationWarning
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className={`${GeistSans.variable} ${bricolage.variable} ${instrumentSerif.variable} font-sans h-full flex flex-col`}>
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
          <HideOnHome><SiteClose /></HideOnHome>
          <HideOnHome><Dock /></HideOnHome>
        </MotionProvider>
      </body>
    </html>
  )
} 