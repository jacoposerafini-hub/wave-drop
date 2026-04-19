import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function updateStatus(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  const status = String(formData.get('status'));
  const trackingNumber = String(formData.get('trackingNumber') ?? '') || null;
  await db.order.update({ where: { id }, data: { status, trackingNumber } });
  revalidatePath('/admin/orders');
}

export default async function AdminOrders() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="display text-5xl">ORDINI</h1>

      <div className="flex flex-col gap-3">
        {orders.map((o) => (
          <div key={o.id} className="card p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Link href={`/orders/${o.id}`} className="font-display text-2xl hover:text-accent">
                {o.orderNumber}
              </Link>
              <span className={`pill ${o.status === 'paid' ? 'bg-success/20 text-success' : o.status === 'shipped' ? 'bg-accent/20 text-accent' : o.status === 'pending' ? 'bg-white/5 text-muted' : 'bg-white/5 text-muted'}`}>
                {o.status}
              </span>
              <span className="text-xs text-muted">{o.createdAt.toLocaleString('it-IT')}</span>
              <p className="ml-auto display text-xl tabular-nums">{formatPrice(o.totalCents)}</p>
            </div>
            <p className="text-sm text-muted">
              {o.email} · {o.shippingName || '—'} · {o.items.length} articol{o.items.length === 1 ? 'o' : 'i'}
            </p>
            <form action={updateStatus} className="flex items-center gap-2">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className="input w-40 py-2">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input
                name="trackingNumber"
                defaultValue={o.trackingNumber ?? ''}
                placeholder="Tracking #"
                className="input flex-1 py-2"
              />
              <button className="btn-ghost px-3 py-2 text-xs">Aggiorna</button>
            </form>
          </div>
        ))}
        {orders.length === 0 && <p className="text-muted">Nessun ordine.</p>}
      </div>
    </div>
  );
}
