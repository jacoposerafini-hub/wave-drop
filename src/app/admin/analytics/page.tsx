import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminAnalytics() {
  const [orders, signups, drops] = await Promise.all([
    db.order.findMany({
      where: { status: { in: ['paid', 'shipped', 'delivered'] } },
      include: { items: true },
    }),
    db.notifySignup.count(),
    db.drop.count(),
  ]);

  const totalRevenue = orders.reduce((s, o) => s + o.totalCents, 0);
  const orderCount = orders.length;
  const avgOrder = orderCount ? Math.round(totalRevenue / orderCount) : 0;
  const unitsSold = orders
    .flatMap((o) => o.items)
    .reduce((s, i) => s + i.qty, 0);

  const productMap = new Map<string, { name: string; units: number; revenue: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const key = item.nameSnap;
      const existing = productMap.get(key) ?? { name: key, units: 0, revenue: 0 };
      existing.units += item.qty;
      existing.revenue += item.qty * item.priceCents;
      productMap.set(key, existing);
    }
  }
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-page-head__title">Analytics</h1>
      </div>

      <div className="admin-kpi-grid">
        <Kpi label="Revenue" value={formatPrice(totalRevenue)} />
        <Kpi label="Ordini" value={orderCount.toString()} />
        <Kpi label="Avg order" value={formatPrice(avgOrder)} />
        <Kpi label="Pezzi venduti" value={unitsSold.toString()} />
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-kpi__label" style={{ marginBottom: 16 }}>
            Top prodotti
          </div>
          {topProducts.length === 0 ? (
            <p style={{ color: 'var(--fg-mute)', fontSize: 14 }}>
              Nessuna vendita ancora.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topProducts.map((p, i) => (
                <div
                  key={p.name}
                  style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: 22,
                      color: 'var(--fg-mute)',
                      width: 26,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {i + 1}
                  </span>
                  <p style={{ flex: 1, fontSize: 14 }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--fg-mute)' }}>
                    {p.units} pz
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {formatPrice(p.revenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-kpi__label" style={{ marginBottom: 16 }}>
            Database
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <Stat label="Iscritti notify" value={signups} />
            <Stat label="Drop totali" value={drops} />
          </div>
        </div>
      </div>
    </>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-card admin-kpi">
      <div className="admin-kpi__label">{label}</div>
      <div className="admin-kpi__value">{value}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 30,
          color: 'var(--accent)',
          letterSpacing: '-0.03em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </p>
      <p style={{ marginTop: 6, fontSize: 12, color: 'var(--fg-mute)' }}>
        {label}
      </p>
    </div>
  );
}
