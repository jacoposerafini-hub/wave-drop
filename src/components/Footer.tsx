'use client';

import Link from 'next/link';
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
            <Link href="/gift-card">Gift card</Link>
          </div>

          <div className="footer__col">
            <h5>Info</h5>
            <Link href="/about">About</Link>
            <Link href="/contact">Contatti</Link>
            <Link href="/shipping">Spedizioni</Link>
            <Link href="/returns">Resi</Link>
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://imgs.search.brave.com/4QcGZpzmZob664SiqtBms2Azjb1cboTcbHZ4YWPRt0o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZnJlZXBuZ2xvZ29z/LmNvbS91cGxvYWRz/L2xvZ28taWctcG5n/L2xvZ28taWctaW5z/dGFncmFtLW5ldy1s/b2dvLXZlY3Rvci1k/b3dubG9hZC0xMy5w/bmc"
                  alt="Instagram"
                  width={26}
                  height={26}
                  style={{ objectFit: 'contain' }}
                />
              </a>
              <a
                href="https://tiktok.com/@wavestaff"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://imgs.search.brave.com/nGzLTyq5MvBoNQMnGF2nJqnZxMvuOiop6Y8f7YpATrM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjMv/OTg2LzU2MS9zbWFs/bC90aWt0b2stbG9n/by10aWt0b2stbG9n/by10cmFuc3BhcmVu/dC10aWt0b2staWNv/bi10cmFuc3BhcmVu/dC1mcmVlLWZyZWUt/cG5nLnBuZw"
                  alt="TikTok"
                  width={38}
                  height={38}
                  style={{ objectFit: 'contain' }}
                />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 Wave Staff · Lucca, IT</span>
          <span>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookies">Cookie</Link>
            <Link href="/terms">Termini</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
