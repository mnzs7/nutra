import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastContainer } from '@/components/ui/Toast'
import { CompareFloatingBar } from '@/components/products/CompareButton'
import { SessionProvider } from '@/components/providers/SessionProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'VitaShop - Suplementos e Farmácia Online',
    template: '%s | VitaShop',
  },
  description:
    'A sua loja de suplementos e produtos de saúde online. Vitaminas, proteínas, ómega-3, pré-treino, sono e colagénio de alta qualidade certificados.',
  keywords: [
    'suplementos',
    'vitaminas',
    'proteína',
    'omega-3',
    'pré-treino',
    'saúde',
    'bem-estar',
    'farmácia online',
    'Portugal',
  ],
  authors: [{ name: 'VitaShop' }],
  creator: 'VitaShop',
  publisher: 'VitaShop',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://vitashop.pt'),
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: '/',
    siteName: 'VitaShop',
    title: 'VitaShop - Suplementos e Farmácia Online',
    description:
      'A sua loja de suplementos e produtos de saúde online em Portugal. Qualidade certificada.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VitaShop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VitaShop - Suplementos e Farmácia Online',
    description: 'A sua loja de suplementos e produtos de saúde online em Portugal.',
    images: ['/og-image.jpg'],
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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#16a34a' },
    { media: '(prefers-color-scheme: dark)', color: '#15803d' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://picsum.photos" />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-950 antialiased">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {/* Skip to content - accessibility */}
            <a href="#main-content" className="skip-to-content">
              Ir para o conteúdo principal
            </a>

            <Header />

            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>

            <Footer />

            {/* Global UI */}
            <ToastContainer />
            <CompareFloatingBar />
          </ThemeProvider>
        </SessionProvider>

        {/* PWA service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registered'); })
                    .catch(function(err) { console.log('SW error', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
