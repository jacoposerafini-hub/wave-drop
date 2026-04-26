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

const STATUS_PILL: Record<string, string> = {
  paid: 'admin-pill admin-pill--ok',
  shipped: 'admin-pill admin-pill--live',
  delivered: 'admin-pill admin-pill--ok',
  pending: 'admin-pill admin-pill--warn',
  cancelled: 'admin-pill admin-pill--danger',
};

export default async function AdminOrders() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
    take: 100,
  });

  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-page-head__title">Ordini</h1>
      </div>

      <div className="admin-list">
        {orders.map((o) => (
          <div key={o.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Link
                href={`/orders/${o.id}`}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 20,
                  letterSpacing: '-0.025em',
                  color: 'var(--fg)',
                }}
              >
                {o.orderNumber}
              </Link>
              <span className={STATUS_PILL[o.status] ?? 'admin-pill'}>
                {o.status}
              </span>
              <span style={{ fontSize: 12.5, color: 'var(--fg-mute)' }}>
                {o.createdAt.toLocaleString('it-IT')}
              </span>
              <p
                style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: '-0.025em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatPrice(o.totalCents)}
              </p>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--fg-dim)' }}>
              {o.email} · {o.shippingName || '—'} · {o.items.length} articol
              {o.items.length === 1 ? 'o' : 'i'}
            </p>
            <form
              action={updateStatus}
              style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}
            >
              <input type="hidden" name="id" value={o.id} />
              <select
                name="status"
                defaultValue={o.status}
                className="admin-select"
                style={{ width: 160 }}
              >
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
                className="admin-input"
                style={{ flex: 1, minWidth: 200 }}
              />
              <button type="submit" className="btn ghost sm">
                Aggiorna
              </button>
            </form>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="admin-empty">Nessun ordine.</div>
        )}
      </div>
    </>
  );
}
