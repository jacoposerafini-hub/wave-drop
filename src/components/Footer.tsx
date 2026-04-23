import Link from 'next/link';
import { Instagram, Music2, MessageCircle, ArrowUpRight } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

const MARQUEE_ITEMS = [
  'Lucca after dark',
  'Drop limitati',
  'Produzione vera',
  'Niente restock',
  'Wave Staff',
  'Nightlife uniform',
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      {/* MARQUEE */}
      <div className="relative overflow-hidden border-b border-border py-6">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-display text-3xl md:text-5xl">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex gap-12">
              {MARQUEE_ITEMS.map((t, i) => (
                <span key={`${dup}-${i}`} className="flex items-center gap-12 text-white/60">
                  {t}
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-display text-5xl leading-none md:text-7xl">
              RIMANI<br />
              <span className="text-gradient-accent">NEL LOOP.</span>
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              Iscriviti per sapere quando esce il prossimo drop. Niente spam,
              solo i drop. Ti avvisiamo 48h prima.
            </p>
            <div className="mt-6 max-w-md">
              <NewsletterForm />
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow">Shop</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/" className="text-muted transition-colors hover:text-white">
                  Drop corrente
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-muted transition-colors hover:text-white">
                  Archivio
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow">Info</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/about" className="text-muted transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted transition-colors hover:text-white">
                  Contatti
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted transition-colors hover:text-white">
                  Spedizioni
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted transition-colors hover:text-white">
                  Resi
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow">Seguici</p>
            <div className="mt-4 flex gap-2">
              <SocialLink href="https://instagram.com/wavestaff" label="Instagram">
                <Instagram size={16} />
              </SocialLink>
              <SocialLink href="https://tiktok.com/@wavestaff" label="TikTok">
                <Music2 size={16} />
              </SocialLink>
              <SocialLink href="https://wa.me/393000000000" label="WhatsApp">
                <MessageCircle size={16} />
              </SocialLink>
            </div>
            <a
              href="https://instagram.com/wavestaff"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent"
            >
              @wavestaff <ArrowUpRight size={12} />
            </a>
          </div>
        </div>

        {/* GIGANTIC WORDMARK */}
        <div className="mt-20 overflow-hidden">
          <p className="display text-[22vw] leading-[0.8] text-white/[0.04] md:text-[18vw]">
            WAVE DROP
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Wave Staff · Lucca, IT · P.IVA 00000000000</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Termini
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group relative flex h-10 w-10 items-center justify-center border border-border transition-all duration-300 ease-smooth hover:border-accent hover:bg-accent/10 hover:text-accent"
    >
      {children}
    </a>
  );
}
