import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCartWithDetails } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import CartRow from './cart-row';

export const dynamic = 'force-dynamic';

const FREE_SHIPPING_THRESHOLD = 5000;

export default async function CartPage() {
  const { items, subtotalCents } = await getCartWithDetails();

  if (items.length === 0) {
    return (
      <main className="page-enter">
        <Link href="/" className="drawer-backdrop" aria-label="Chiudi" />
        <aside className="drawer">
          <div className="drawer__head">
            <div className="drawer__title">Carrello</div>
            <Link href="/" className="drawer__close" aria-label="Chiudi">
              ✕
            </Link>
          </div>
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
            <h2 className="display" style={{ fontSize: 56 }}>
              Carrello <span className="italic">vuoto.</span>
            </h2>
            <p
              style={{
                color: 'var(--fg-dim)',
                margin: '16px 0 24px',
                maxWidth: 320,
              }}
            >
              Stai dormendo? I pezzi volano e non tornano più.
            </p>
            <Link href="/" className="btn primary">
              Vai al drop <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </main>
    );
  }

  const shipping =
    subtotalCents >= FREE_SHIPPING_THRESHOLD || subtotalCents === 0 ? 0 : 800;
  const total = subtotalCents + shipping;
  const shipProgress = Math.min(
    100,
    (subtotalCents / FREE_SHIPPING_THRESHOLD) * 100,
  );
  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalCents);

  return (
    <main className="page-enter">
      <Link href="/" className="drawer-backdrop" aria-label="Chiudi" />
      <aside className="drawer">
        <div className="drawer__head">
          <div className="drawer__title">Carrello</div>
          <Link href="/" className="drawer__close" aria-label="Chiudi">
            ✕
          </Link>
        </div>

        <div className="drawer__body">
          {items.map((item) => (
            <CartRow
              key={item.variantId}
              variantId={item.variantId}
              qty={item.qty}
              size={item.size}
              name={item.product.name}
              slug={item.product.slug}
              image={item.product.images[0]}
              priceCents={item.priceCents}
              lineCents={item.lineCents}
              expiresAt={item.expiresAt}
            />
          ))}
        </div>

        <div className="drawer__foot">
          <div className="drawer__row">
            <span>Subtotale</span>
            <span>{formatPrice(subtotalCents)}</span>
          </div>
          <div className="drawer__row">
            <span>Spedizione</span>
            <span>
              {shipping === 0 ? (
                <span style={{ color: 'var(--accent)' }}>
                  Gratis · sopra €50
                </span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>

          {subtotalCents < FREE_SHIPPING_THRESHOLD && (
            <div style={{ marginTop: 14, marginBottom: 4 }}>
              <div className="shipbar">
                <div
                  className="shipbar__fill"
                  style={{ width: `${shipProgress}%` }}
                />
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--fg-mute)',
                  marginTop: 8,
                }}
              >
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
            <button
              type="submit"
              className="btn primary"
              style={{ width: '100%' }}
            >
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
      </aside>
    </main>
  );
}
