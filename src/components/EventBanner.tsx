'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

// Bump version when copy/design changes — invalidates prior "seen" flags so users see the new version once.
const STORAGE_KEY = 'wd_event_banner_seen_v2';
const SHOW_DELAY_MS = 9000; // 9s after load
const IG_HANDLE = '_wave.staff_';
const IG_URL = `https://instagram.com/${IG_HANDLE}`;
const IG_DM_URL = `https://ig.me/m/${IG_HANDLE}`;
const IG_LOGO =
  'https://imgs.search.brave.com/4QcGZpzmZob664SiqtBms2Azjb1cboTcbHZ4YWPRt0o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZnJlZXBuZ2xvZ29z/LmNvbS91cGxvYWRz/L2xvZ28taWctcG5n/L2xvZ28taWctaW5z/dGFncmFtLW5ldy1s/b2dvLXZlY3Rvci1k/b3dubG9hZC0xMy5w/bmc';

export default function EventBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Already seen this session? skip
    if (localStorage.getItem(STORAGE_KEY)) return;

    const t = setTimeout(() => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      localStorage.setItem(STORAGE_KEY, '1'); // mark seen on first display
      setShow(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(t);
  }, []);

  const dismiss = () => setShow(false);

  if (!show) return null;

  return (
    <div className="event-banner" role="complementary" aria-label="Evento Wave Staff">
      <div className="event-banner__bg" aria-hidden="true" />
      <button
        type="button"
        className="event-banner__close"
        onClick={dismiss}
        aria-label="Chiudi"
      >
        <X size={14} />
      </button>
      <div className="event-banner__body">
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Sabato notte · Wave Staff
        </div>
        <h4 className="event-banner__title">
          Questo sabato si balla a{' '}
          <span className="event-banner__venue">Villa Bruguier</span>.
        </h4>
        <p className="event-banner__copy">
          Tavoli, lista e info: scrivici in DM su Instagram. Posti limitati.
        </p>
        <a
          href={IG_DM_URL}
          target="_blank"
          rel="noreferrer"
          className="event-banner__cta"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IG_LOGO} alt="" width={18} height={18} />
          <span>Prenota in DM</span>
        </a>
        <a
          href={IG_URL}
          target="_blank"
          rel="noreferrer"
          className="event-banner__sub"
        >
          @{IG_HANDLE} →
        </a>
      </div>
    </div>
  );
}
