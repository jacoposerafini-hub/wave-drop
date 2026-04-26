import type { Metadata } from 'next';
import { Manrope, JetBrains_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import CartDrawer from '@/components/CartDrawer';

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Wave Drop — Lucca',
    template: '%s · Wave Drop',
  },
  description:
    'La label streetwear di Wave Staff. Drop limitati nati dalla nightlife di Lucca.',
  openGraph: {
    title: 'Wave Drop',
    description: 'La label streetwear di Wave Staff. Lucca after dark.',
    type: 'website',
    locale: 'it_IT',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${manrope.variable} ${jetbrains.variable} ${serif.variable}`}
    >
      <body>
        <div className="wash" />
        <div className="grain" />
        <Navbar />
        <Marquee />
        {children}
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
