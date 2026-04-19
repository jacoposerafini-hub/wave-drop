import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { variant: { include: { product: true } } } } },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-[900px] px-5 md:px-10 py-16">
      <p className="pill bg-accent text-black">
        {order.status === 'paid' ? '✓ Pagato' : order.status === 'pending' ? 'In attesa' : order.status}
      </p>
      <h1 className="display mt-4 text-6xl md:text-8xl">{order.orderNumber}</h1>
      <p className="mt-4 text-muted">
        Grazie. Riceverai una conferma a <span className="text-white">{order.email}</span>.
        Appena spediamo, ti mandiamo il tracking.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {order.items.map((it) => (
          <div key={it.id} className="flex items-center gap-4 border border-border p-3">
            <div className="relative h-20 w-16 bg-bg-elevated overflow-hidden">
              {it.variant.product.images[0] && (
                <Image src={it.variant.product.images[0]} alt={it.nameSnap} fill sizes="64px" className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{it.nameSnap}</p>
              <p className="text-xs text-muted">Taglia {it.sizeSnap} · x{it.qty}</p>
            </div>
            <p className="display text-xl tabular-nums">{formatPrice(it.priceCents * it.qty)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between border-t border-border pt-6">
        <span className="pill text-muted">Totale</span>
        <span className="display text-3xl tabular-nums">{formatPrice(order.totalCents)}</span>
      </div>

      <Link href="/" className="btn-ghost mt-10 h-12 px-6 inline-flex">
        ← Torna al drop
      </Link>
    </div>
  );
}
