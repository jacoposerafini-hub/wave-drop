'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { addToCartAction } from '@/app/actions';

interface Variant {
  id: string;
  size: string;
  stock: number;
  reserved: number;
  lemonSqueezyUrl?: string | null;
}

declare global {
  interface Window {
    LemonSqueezy?: { Url: { Open: (url: string) => void } };
    createLemonSqueezy?: () => void;
  }
}

type MsgType = 'ok' | 'err' | null;

export default function AddToCartButton({ variants }: { variants: Variant[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ text: string; type: MsgType }>({
    text: '',
    type: null,
  });
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const selVariant = variants.find((v) => v.id === selected);
  const available = selVariant ? selVariant.stock - selVariant.reserved : 0;
  const allSoldOut = variants.every((v) => v.stock - v.reserved <= 0);
  const lsUrl = selVariant?.lemonSqueezyUrl;

  // Initialize Lemon Squeezy overlay once script is loaded
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.createLemonSqueezy) {
      window.createLemonSqueezy();
    }
  }, []);

  function buyNow() {
    if (!selected) {
      setMsg({ text: 'Scegli una taglia', type: 'err' });
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    if (!lsUrl) return;
    if (window.LemonSqueezy?.Url?.Open) {
      window.LemonSqueezy.Url.Open(lsUrl);
    } else {
      // Fallback: open in new tab if overlay script not ready
      window.open(lsUrl, '_blank', 'noopener,noreferrer');
    }
  }

  function add() {
    if (!selected) {
      setMsg({ text: 'Scegli una taglia', type: 'err' });
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setMsg({ text: '', type: null });
    start(async () => {
      const r = await addToCartAction(selected);
      if (r.ok) {
        setMsg({ text: 'Aggiunto al carrello', type: 'ok' });
        router.refresh();
      } else {
        setMsg({ text: r.error, type: 'err' });
      }
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <div className="eyebrow">Taglia</div>
          {selVariant && available > 0 && available < 10 && (
            <span
              className="chip live"
              style={{ fontSize: 10 }}
            >{`Ultimi ${available}`}</span>
          )}
        </div>
        <div className={'size-row' + (shake ? ' shake' : '')}>
          {variants.map((v) => {
            const out = v.stock - v.reserved <= 0;
            const avail = v.stock - v.reserved;
            const low = !out && avail <= 2;
            const active = selected === v.id;
            return (
              <button
                key={v.id}
                onClick={() => !out && setSelected(v.id)}
                disabled={out}
                className={
                  'size-btn' +
                  (active ? ' active' : '') +
                  (out ? ' out' : low ? ' low' : '')
                }
              >
                {v.size}
                {low && !out && ` · ${avail}`}
              </button>
            );
          })}
        </div>
      </div>

      {lsUrl ? (
        <button
          onClick={buyNow}
          disabled={allSoldOut}
          className="btn primary lemonsqueezy-button"
          data-lemonsqueezy-url={lsUrl}
          style={{
            width: '100%',
            opacity: allSoldOut ? 0.5 : 1,
            cursor: allSoldOut ? 'not-allowed' : 'pointer',
          }}
        >
          {allSoldOut ? (
            'Sold out'
          ) : (
            <>
              <ShoppingBag size={16} />
              Acquista ora
            </>
          )}
        </button>
      ) : (
        <button
          onClick={add}
          disabled={pending || allSoldOut}
          className="btn primary"
          style={{
            width: '100%',
            opacity: allSoldOut ? 0.5 : 1,
            cursor: allSoldOut ? 'not-allowed' : 'pointer',
          }}
        >
          {allSoldOut ? (
            'Sold out'
          ) : pending ? (
            'Aggiunta...'
          ) : (
            <>
              <ShoppingBag size={16} />
              Aggiungi al carrello
            </>
          )}
        </button>
      )}

      {msg.type && (
        <p
          style={{
            fontSize: 13,
            color:
              msg.type === 'ok' ? 'var(--accent)' : 'var(--danger)',
          }}
        >
          {msg.type === 'ok' ? '✓ ' : ''}
          {msg.text}
        </p>
      )}
    </div>
  );
}
