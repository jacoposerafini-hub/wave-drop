import Link from 'next/link';
import Image from 'next/image';
import { getCartWithDetails } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import CartRow from './cart-row';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const { items, subtotalCents } = await getCartWithDetails();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="pill text-muted mb-4">Cart</p>
        <h1 className="display text-6xl md:text-8xl">VUOTO</h1>
        <p className="mt-4 max-w-md text-muted">
          Niente nel carrello. Torna al drop.
        </p>
        <Link href="/" className="btn-primary mt-8 h-12 px-6">
          Shop the drop
        </Link>
      </div>
    );
  }

  const shipping = subtotalCents >= 10000 ? 0 : 700;
  const total = subtotalCents + shipping;

  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-10 md:py-16">
      <h1 className="display text-5xl md:text-7xl mb-10">CARRELLO</h1>

      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-8 flex flex-col gap-6">
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
          <div className="md:sticky md:top-20 flex flex-col gap-4 border border-border p-6">
            <p className="pill text-muted">Riepilogo</p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotale</span>
              <span className="tabular-nums">{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Spedizione</span>
              <span className="tabular-nums">
                {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
              </span>
            </div>

            {subtotalCents < 10000 && (
              <p className="text-xs text-muted">
                Aggiungi {formatPrice(10000 - subtotalCents)} per spedizione gratis.
              </p>
            )}

            <div className="my-2 border-t border-border" />

            <div className="flex items-baseline justify-between">
              <span className="pill text-muted">Totale</span>
              <span className="display text-3xl tabular-nums">{formatPrice(total)}</span>
            </div>

            <form action="/api/checkout" method="POST">
              <button type="submit" className="btn-primary mt-4 h-14 w-full">
                Checkout
              </button>
            </form>

            <Link href="/" className="text-center text-xs text-muted hover:text-white">
              ← Continua shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
