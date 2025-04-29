import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import FontProvider from './components/FontProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Michael Bobov - Product Designer',
  description: 'Portfolio of Michael Bobov, Product Designer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FontProvider />
        {children}
      </body>
    </html>
  )
} 