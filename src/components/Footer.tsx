import Link from 'next/link';
import { Instagram, Music2, MessageCircle } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-display text-5xl md:text-7xl leading-none">
              RIMANI<br />NEL LOOP.
            </p>
            <p className="mt-4 max-w-md text-sm text-muted">
              Iscriviti per sapere quando esce il prossimo drop. Niente spam,
              solo i drop. Ti avvisiamo 48h prima.
            </p>
            <div className="mt-6 max-w-md">
              <NewsletterForm />
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="pill text-muted">Shop</p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              <li><Link href="/" className="text-muted hover:text-white">Drop corrente</Link></li>
              <li><Link href="/archive" className="text-muted hover:text-white">Archivio</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="pill text-muted">Info</p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              <li><Link href="/about" className="text-muted hover:text-white">About</Link></li>
              <li><Link href="/contact" className="text-muted hover:text-white">Contatti</Link></li>
              <li><Link href="/shipping" className="text-muted hover:text-white">Spedizioni</Link></li>
              <li><Link href="/returns" className="text-muted hover:text-white">Resi</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="pill text-muted">Seguici</p>
            <div className="mt-4 flex gap-3">
              <a href="https://instagram.com/wavestaff" target="_blank" rel="noreferrer" aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center border border-border hover:border-accent hover:text-accent transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://tiktok.com/@wavestaff" target="_blank" rel="noreferrer" aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center border border-border hover:border-accent hover:text-accent transition-colors">
                <Music2 size={16} />
              </a>
              <a href="https://wa.me/393000000000" target="_blank" rel="noreferrer" aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center border border-border hover:border-accent hover:text-accent transition-colors">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Wave Staff · Lucca, IT · P.IVA 00000000000</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Termini</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
