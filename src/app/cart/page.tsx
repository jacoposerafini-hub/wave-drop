import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCartWithDetails } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import CartRow from './cart-row';

export const dynamic = 'force-dynamic';

const FREE_SHIPPING_THRESHOLD = 8000;

export default async function CartPage() {
  const { items, subtotalCents } = await getCartWithDetails();

  if (items.length === 0) {
    return (
      <main className="page-enter container">
        <div className="notfound">
          <div className="notfound__code">Carrello</div>
          <h1 className="notfound__title">
            Vuoto<span className="italic">.</span>
          </h1>
          <p
            style={{
              color: 'var(--fg-dim)',
              maxWidth: 420,
              margin: '0 auto 28px',
            }}
          >
            Niente nel carrello. Torna al drop.
          </p>
          <Link href="/" className="btn primary">
            Shop the drop <ArrowRight size={16} />
          </Link>
        </div>
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
    <main className="page-enter container">
      <div className="section-head" style={{ paddingTop: 56 }}>
        <div className="section-head__l">Carrello</div>
        <div className="section-head__r">
          Riservato per 10 minuti. Continua e completa l&apos;ordine prima che il
          timer scada.
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.8fr)',
          gap: 40,
          alignItems: 'start',
        }}
        className="cart-grid"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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

        <aside
          style={{
            position: 'sticky',
            top: 96,
            border: '1px solid var(--line-2)',
            borderRadius: 'var(--r-lg)',
            padding: 24,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Riepilogo
          </div>

          <div className="drawer__row">
            <span>Subtotale</span>
            <span>{formatPrice(subtotalCents)}</span>
          </div>
          <div className="drawer__row">
            <span>Spedizione</span>
            <span>
              {shipping === 0 ? (
                <span style={{ color: 'var(--accent)' }}>
                  Gratis · sopra €80
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
        </aside>
      </div>

      <div style={{ marginTop: 32 }}>
        <Link href="/" className="eyebrow">
          ← Continua shopping
        </Link>
      </div>
    </main>
  );
}
