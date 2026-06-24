import type { Metadata } from 'next'
import { Cinzel, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Web3Provider } from '@/providers/Web3Provider'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: ['400', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: false,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://xdinar.io'),
  title: 'xDINAR — DeFi Protocol on BNB Smart Chain',
  description:
    'xDINAR bridges the timeless value of the Dinar with the power of decentralized finance. Swap, stake, lend, and pay — built on BNB Smart Chain.',
  keywords: ['xDINAR', 'DeFi', 'BNB Smart Chain', 'BEP-20', 'Dinar', 'Islamic Finance', 'staking', 'token'],
  authors: [{ name: 'xDINAR Team' }],
  creator: 'xDINAR',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://xdinar.io',
    siteName: 'xDINAR',
    title: 'xDINAR — DeFi Protocol on BNB Smart Chain',
    description:
      'Bridging the timeless value of Dinar with decentralized finance. Swap, stake, lend, and pay on BNB Smart Chain.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'xDINAR — DeFi Protocol',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xDINAR — DeFi Protocol on BNB Smart Chain',
    description: 'Bridging the timeless value of Dinar with decentralized finance.',
    images: ['/og-image.png'],
    // TODO: replace with real Twitter handle
    creator: '@xDINAR',
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
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg-base text-content font-body antialiased">
        <Web3Provider>
          <Navbar />
          {children}
          <Footer />
        </Web3Provider>
      </body>
    </html>
  )
}
