import Link from 'next/link';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { getCartWithDetails } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import CartRow from './cart-row';

export const dynamic = 'force-dynamic';

const FREE_SHIPPING_THRESHOLD = 10000;

export default async function CartPage() {
  const { items, subtotalCents } = await getCartWithDetails();

  if (items.length === 0) {
    return (
      <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[100px]" />
        <div className="relative flex flex-col items-center">
          <p className="eyebrow mb-3">Cart</p>
          <h1 className="display text-6xl md:text-8xl">VUOTO</h1>
          <p className="mt-4 max-w-md text-muted">
            Niente nel carrello. Torna al drop.
          </p>
          <Link href="/" className="btn-primary group mt-8 h-12 px-6">
            Shop the drop
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = subtotalCents >= FREE_SHIPPING_THRESHOLD ? 0 : 700;
  const total = subtotalCents + shipping;
  const shipProgress = Math.min(100, (subtotalCents / FREE_SHIPPING_THRESHOLD) * 100);
  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalCents);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10 md:px-10 md:py-16">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Cart</p>
          <h1 className="display text-5xl md:text-7xl">CARRELLO</h1>
        </div>
        <Link
          href="/"
          className="hidden items-center gap-1.5 text-xs uppercase tracking-widest text-muted transition-colors hover:text-white md:inline-flex"
        >
          <ArrowLeft size={14} /> Continua shopping
        </Link>
      </div>

      <div className="grid gap-10 md:grid-cols-12">
        <div className="flex flex-col gap-4 md:col-span-8">
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

        <aside className="md:col-span-4">
          <div className="flex flex-col gap-5 border border-border-strong bg-bg-elevated p-6 md:sticky md:top-24">
            <p className="eyebrow">Riepilogo</p>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Subtotale</span>
                <span className="tabular-nums">{formatPrice(subtotalCents)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Spedizione</span>
                <span className="tabular-nums">
                  {shipping === 0 ? (
                    <span className="text-success">Gratis</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
            </div>

            {/* Free shipping progress */}
            {subtotalCents < FREE_SHIPPING_THRESHOLD ? (
              <div className="flex flex-col gap-2">
                <div className="h-1 w-full overflow-hidden bg-bg-sunken">
                  <div
                    className="h-full bg-accent transition-all duration-500 ease-smooth"
                    style={{ width: `${shipProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted">
                  Aggiungi{' '}
                  <span className="font-semibold text-white">
                    {formatPrice(missing)}
                  </span>{' '}
                  per spedizione gratis.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 border border-success/30 bg-success/5 px-3 py-2 text-xs text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Spedizione gratuita sbloccata
              </div>
            )}

            <div className="divider-x" />

            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Totale</span>
              <span className="display text-3xl tabular-nums">
                {formatPrice(total)}
              </span>
            </div>

            <form action="/api/checkout" method="POST">
              <button type="submit" className="btn-primary group h-14 w-full">
                <Lock size={14} /> Checkout sicuro
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            <Link
              href="/"
              className="text-center text-xs uppercase tracking-widest text-muted transition-colors hover:text-white md:hidden"
            >
              ← Continua shopping
            </Link>

            <p className="text-center text-[10px] uppercase tracking-ultra text-subtle">
              Pagamento protetto · Stripe
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
