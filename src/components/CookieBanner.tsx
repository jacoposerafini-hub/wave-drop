'use client';

import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { useEffect, useState } from 'react';

const COOKIE = 'wd_consent';
const MAX_AGE = 60 * 60 * 24 * 180; // 6 months

function readConsent(): string | null {
  if (typeof document === 'undefined') return null;
  const row = document.cookie
    .split('; ')
    .find((r) => r.startsWith(`${COOKIE}=`));
  return row ? decodeURIComponent(row.split('=')[1]) : null;
}

function writeConsent(value: 'accepted' | 'rejected') {
  document.cookie = `${COOKIE}=${value}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!readConsent()) setShow(true);
  }, []);

  const choose = (v: 'accepted' | 'rejected') => {
    writeConsent(v);
    setShow(false);
    // notify listeners if needed
    window.dispatchEvent(new CustomEvent('consent-change', { detail: v }));
  };

  if (!show) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Consenso cookie">
      <div className="cookie-banner__icon" aria-hidden="true">
        <Cookie size={22} />
      </div>
      <div className="cookie-banner__text">
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          Cookie
        </div>
        <p>
          Usiamo cookie tecnici necessari e, con consenso, analitici anonimi.
          Nessuna profilazione.{' '}
          <Link href="/cookies" style={{ textDecoration: 'underline' }}>
            Dettagli
          </Link>
          .
        </p>
        <div className="cookie-banner__actions">
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => choose('rejected')}
          >
            Rifiuta
          </button>
          <button
            type="button"
            className="btn primary sm"
            onClick={() => choose('accepted')}
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
