'use client';

import Link from 'next/link';
import { Instagram, Music2, MessageCircle } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__big">
              Entra
              <br />
              <span className="italic">nel club.</span>
            </div>
            <p
              style={{
                color: 'var(--fg-dim)',
                maxWidth: 380,
                marginTop: 20,
                marginBottom: 22,
              }}
            >
              I drop vanno sold out in fretta. Niente spam, solo release
              esclusive. Ti avvisiamo 48h prima di tutti gli altri. Non restare
              fuori.
            </p>
            <div style={{ maxWidth: 380 }}>
              <NewsletterForm />
            </div>
          </div>

          <div className="footer__col">
            <h5>Shop</h5>
            <Link href="/">Drop corrente</Link>
            <Link href="/archive">Archivio</Link>
            <a>Gift card</a>
          </div>

          <div className="footer__col">
            <h5>Info</h5>
            <Link href="/about">About</Link>
            <Link href="/contact">Contatti</Link>
            <a>Spedizioni</a>
            <a>Resi</a>
          </div>

          <div className="footer__col">
            <h5>Seguici</h5>
            <div className="footer__socials">
              <a
                href="https://instagram.com/wavestaff"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://tiktok.com/@wavestaff"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                <Music2 size={18} />
              </a>
              <a
                href="https://wa.me/393000000000"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 Wave Staff · Lucca, IT · P.IVA 00000000000</span>
          <span>
            <a>Privacy</a>
            <a>Termini</a>
            <Link href="/_not-a-page">404</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
