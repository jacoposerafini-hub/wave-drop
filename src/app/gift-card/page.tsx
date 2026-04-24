import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = { title: 'Gift card' };

const AMOUNTS = ['25', '50', '100', '200'];

export default function GiftCardPage() {
  return (
    <main className="page-enter container">
      <div className="page__lead">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          Gift card
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(72px, 13vw, 180px)' }}>
          Drop a <span className="italic">gift.</span>
        </h1>
        <p style={{ color: 'var(--fg-dim)', marginTop: 20, maxWidth: 520 }}>
          Non sai che regalargli? Facile. Gift card digitale, consegnata via
          email, spesa come vuole, quando vuole.
        </p>
      </div>
      <div className="contact-grid">
        {AMOUNTS.map((a) => (
          <div key={a} className="contact-card">
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              Digitale
            </div>
            <h4>€{a}</h4>
            <p>
              Gift card valida 12 mesi. Codice usabile in un singolo ordine o
              splittato su più acquisti.
            </p>
            <div className="contact-card__handle">In arrivo</div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 40,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <p style={{ color: 'var(--fg-dim)', maxWidth: 420 }}>
          Gift card non ancora in vendita. Scrivici per una gift card custom
          one-off.
        </p>
        <Link href="/contact" className="btn ghost">
          Scrivici <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}
