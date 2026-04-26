import type { Metadata } from 'next';
import { Manrope, JetBrains_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import CartDrawer from '@/components/CartDrawer';
import CookieBanner from '@/components/CookieBanner';
import EventBanner from '@/components/EventBanner';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Wave Drop — Streetwear Lucca · Drop Limitati Nightlife',
    template: '%s · Wave Drop Lucca',
  },
  description:
    'Wave Drop: streetwear made in Italy nato dalla nightlife di Lucca. Drop limitati, pezzi numerati, no restock. Hoodie, tee, cap. Spedizione 48h gratuita sopra 50€.',
  applicationName: 'Wave Drop',
  authors: [{ name: 'Wave Staff', url: 'https://instagram.com/_wave.staff_' }],
  creator: 'Wave Staff',
  publisher: 'Wave Staff',
  keywords: [
    'wave drop',
    'wave staff',
    'streetwear lucca',
    'streetwear italia',
    'drop limitati',
    'hoodie lucca',
    'streetwear toscana',
    'made in italy streetwear',
    'nightlife lucca',
    'villa bruguier',
    'serata lucca',
    'capsule collection italia',
  ],
  category: 'fashion',
  alternates: {
    canonical: '/',
    languages: { 'it-IT': '/' },
  },
  openGraph: {
    title: 'Wave Drop — Streetwear Lucca',
    description:
      'Drop streetwear limitati made in Italy. Lucca after dark. Pezzi numerati, no restock.',
    url: SITE_URL,
    siteName: 'Wave Drop',
    type: 'website',
    locale: 'it_IT',
    images: [
      {
        url: '/Hero_Banner.png',
        width: 1200,
        height: 630,
        alt: 'Wave Drop — streetwear Lucca',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wave Drop — Streetwear Lucca',
    description: 'Drop streetwear limitati made in Italy. Lucca after dark.',
    images: ['/Hero_Banner.png'],
  },
  icons: { icon: '/favicon.svg' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: { email: false, telephone: false, address: false },
  verification: {
    // Add when you set up Google Search Console:
    // google: 'YOUR_VERIFICATION_TOKEN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${manrope.variable} ${jetbrains.variable} ${serif.variable}`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/Hero_Banner.png"
          fetchPriority="high"
        />
        <link rel="canonical" href={SITE_URL} />
        <meta name="theme-color" content="#000000" />
        <meta name="geo.region" content="IT-LU" />
        <meta name="geo.placename" content="Lucca" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${SITE_URL}#org`,
                  name: 'Wave Drop',
                  alternateName: 'Wave Staff',
                  url: SITE_URL,
                  logo: `${SITE_URL}/favicon.svg`,
                  description:
                    'Streetwear made in Italy nato dalla nightlife di Lucca.',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Lucca',
                    addressRegion: 'Toscana',
                    addressCountry: 'IT',
                  },
                  sameAs: [
                    'https://instagram.com/_wave.staff_',
                    'https://tiktok.com/@wavestaff',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_URL}#website`,
                  url: SITE_URL,
                  name: 'Wave Drop',
                  inLanguage: 'it-IT',
                  publisher: { '@id': `${SITE_URL}#org` },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: `${SITE_URL}/archive?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'Store',
                  name: 'Wave Drop',
                  url: SITE_URL,
                  image: `${SITE_URL}/Hero_Banner.png`,
                  priceRange: '€€',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Lucca',
                    addressCountry: 'IT',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 43.8429,
                    longitude: 10.5027,
                  },
                  areaServed: 'IT',
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <div className="wash" />
        <div className="grain" />
        <Navbar />
        <Marquee />
        {children}
        <Footer />
        <CartDrawer />
        <CookieBanner />
        <EventBanner />
      </body>
    </html>
  );
}
