import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'WAVE DROP — Lucca after dark',
    template: '%s · WAVE DROP',
  },
  description:
    'La label streetwear di Wave Staff. Drop limitati nati dalla nightlife di Lucca.',
  openGraph: {
    title: 'WAVE DROP',
    description: 'La label streetwear di Wave Staff. Lucca after dark.',
    type: 'website',
    locale: 'it_IT',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${bebas.variable} ${inter.variable}`}>
      <body className="antialiased">
        <div className="relative z-[2] flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
