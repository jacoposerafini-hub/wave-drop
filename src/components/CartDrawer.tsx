'use client';

import { useEffect, useState, useCallback, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { removeFromCartAction, updateQtyAction } from '@/app/actions';

interface Item {
  variantId: string;
  qty: number;
  size: string;
  priceCents: number;
  lineCents: number;
  expiresAt: number;
  product: { name: string; slug: string; images: string[] };
}

const FREE_SHIP = 5000;

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [pending, start] = useTransition();

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/cart', { cache: 'no-store' });
      const d = await r.json();
      setItems(d.items || []);
      setSubtotal(d.subtotalCents || 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sync = () => {
      const isOpen = window.location.hash === '#cart';
      setOpen(isOpen);
      if (isOpen) fetchCart();
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [fetchCart]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => {
    if (typeof window !== 'undefined') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      setOpen(false);
    }
  };

  const refresh = () => fetchCart();

  if (!open) return null;

  const shipping = subtotal >= FREE_SHIP || subtotal === 0 ? 0 : 800;
  const total = subtotal + shipping;
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);
  const missing = Math.max(0, FREE_SHIP - subtotal);

  return (
    <>
      <button
        className="drawer-backdrop"
        onClick={close}
        aria-label="Chiudi"
      />
      <aside className="drawer" role="dialog" aria-label="Carrello">
        <div className="drawer__head">
          <div className="drawer__title">Carrello</div>
          <button onClick={close} className="drawer__close" aria-label="Chiudi">
            ✕
          </button>
        </div>

        {loading && items.length === 0 ? (
          <div className="drawer__body" style={{ flex: 1 }}>
            <div className="eyebrow">Caricamento…</div>
          </div>
        ) : items.length === 0 ? (
          <div
            className="drawer__body"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '60px 22px',
              flex: 1,
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 14 }}>Cart</div>
            <h2 className="display" style={{ fontSize: 48 }}>
              Carrello <span className="italic">vuoto.</span>
            </h2>
            <p style={{ color: 'var(--fg-dim)', margin: '16px 0 24px', maxWidth: 320 }}>
              Stai dormendo? I pezzi volano e non tornano più.
            </p>
            <button onClick={close} className="btn primary">
              Vai al drop <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="drawer__body">
              {items.map((i) => (
                <div key={i.variantId} className="cart-item">
                  <Link
                    href={`/product/${i.product.slug}`}
                    className="cart-item__img"
                    onClick={close}
                  >
                    {i.product.images?.[0] && (
                      <Image
                        src={i.product.images[0]}
                        alt={i.product.name}
                        fill
                        sizes="80px"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </Link>
                  <div className="cart-item__body">
                    <Link
                      href={`/product/${i.product.slug}`}
                      className="cart-item__name"
                      onClick={close}
                    >
                      {i.product.name}
                    </Link>
                    <div className="cart-item__meta">Taglia {i.size}</div>
                    <div className="cart-item__qty">
                      <button
                        onClick={() =>
                          start(async () => {
                            await updateQtyAction(i.variantId, i.qty - 1);
                            refresh();
                          })
                        }
                        disabled={pending}
                        aria-label="Diminuisci"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="tnum">{i.qty}</span>
                      <button
                        onClick={() =>
                          start(async () => {
                            await updateQtyAction(i.variantId, i.qty + 1);
                            refresh();
                          })
                        }
                        disabled={pending}
                        aria-label="Aumenta"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-item__right">
                    <div className="cart-item__price">{formatPrice(i.lineCents)}</div>
                    <button
                      className="cart-item__rem"
                      onClick={() =>
                        start(async () => {
                          await removeFromCartAction(i.variantId);
                          refresh();
                        })
                      }
                      disabled={pending}
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer__foot">
              <div className="drawer__row">
                <span>Subtotale</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="drawer__row">
                <span>Spedizione</span>
                <span>
                  {shipping === 0 ? (
                    <span style={{ color: 'var(--accent)' }}>Gratis · sopra €50</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {subtotal < FREE_SHIP && (
                <div style={{ marginTop: 14, marginBottom: 4 }}>
                  <div className="shipbar">
                    <div className="shipbar__fill" style={{ width: `${progress}%` }} />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--fg-mute)', marginTop: 8 }}>
                    Aggiungi{' '}
                    <span style={{ color: 'var(--fg)', fontWeight: 500 }}>
                      {formatPrice(missing)}
                    </span>{' '}
                    per spedizione gratis.
                  </p>
                </div>
              )}
              <div className="divider-hash" style={{ margin: '14px 0' }} />
              <div className="drawer__total">
                <span className="k">Totale</span>
                <span className="v tnum">{formatPrice(total)}</span>
              </div>
              <form action="/api/checkout" method="POST">
                <button type="submit" className="btn primary" style={{ width: '100%' }}>
                  Checkout <ArrowRight size={16} />
                </button>
              </form>
              <p
                style={{
                  textAlign: 'center',
                  marginTop: 14,
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-mute)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Pagamento protetto · Stripe
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
