'use client';

import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

const STORAGE_KEY = 'wd_event_banner_dismissed';
const SHOW_DELAY_MS = 2500;
const IG_HANDLE = '_wave.staff_';
const IG_DM_URL = `https://ig.me/m/${IG_HANDLE}`;

export default function EventBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    // Wait for cookie banner consent before showing
    const hasCookieConsent = document.cookie
      .split('; ')
      .some((r) => r.startsWith('wd_consent='));

    const delay = hasCookieConsent ? SHOW_DELAY_MS : SHOW_DELAY_MS + 1500;

    const t = setTimeout(() => {
      // Re-check at fire time
      const stillDismissed = localStorage.getItem(STORAGE_KEY);
      if (!stillDismissed) setShow(true);
    }, delay);

    const onConsent = () => {
      const now = localStorage.getItem(STORAGE_KEY);
      if (!now) setShow(true);
    };
    window.addEventListener('consent-change', onConsent);

    return () => {
      clearTimeout(t);
      window.removeEventListener('consent-change', onConsent);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="event-banner" role="complementary" aria-label="Evento Wave Staff">
      <button
        type="button"
        className="event-banner__close"
        onClick={dismiss}
        aria-label="Chiudi"
      >
        <X size={14} />
      </button>
      <div className="event-banner__icon" aria-hidden="true">
        <Sparkles size={18} />
      </div>
      <div className="event-banner__body">
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          Sabato · Wave Staff
        </div>
        <h4 className="event-banner__title">Vuoi un tavolo?</h4>
        <p className="event-banner__copy">
          Sabato c&apos;è la serata. Prenota tavolo o unisciti a uno —
          scrivici in DM su Instagram.
        </p>
        <a
          href={IG_DM_URL}
          target="_blank"
          rel="noreferrer"
          className="btn primary sm event-banner__cta"
          onClick={() => {
            // Don't auto-dismiss on click — user might come back.
          }}
        >
          DM @{IG_HANDLE}
        </a>
      </div>
    </div>
  );
}
