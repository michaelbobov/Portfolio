import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono, Caveat } from 'next/font/google'
import './globals.css'
import SocialLinks from './components/SocialLinks'
import Footer from './components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700']
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500']
})
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Michael Bobov — Product Designer',
  description: 'Product designer focused on AI, consumer experiences, and iterative product development.',
  openGraph: {
    title: 'Michael Bobov — Product Designer',
    description: 'Product designer focused on AI, consumer experiences, and iterative product development.',
    url: 'https://michaelbobov.com',
    siteName: 'Michael Bobov Portfolio',
    images: [
      {
        url: '/metadata.png',
        width: 1200,
        height: 630,
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
    canonical: 'https://michaelbobov.com',
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} ${caveat.variable} font-sans h-full flex flex-col`}>
        <main className="flex-1">
          {children}
        </main>
        <SocialLinks />
        <Footer />
      </body>
    </html>
  )
} 