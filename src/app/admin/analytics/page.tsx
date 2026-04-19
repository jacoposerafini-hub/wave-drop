import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminAnalytics() {
  const [orders, signups, drops] = await Promise.all([
    db.order.findMany({ where: { status: { in: ['paid', 'shipped', 'delivered'] } }, include: { items: true } }),
    db.notifySignup.count(),
    db.drop.count(),
  ]);

  const totalRevenue = orders.reduce((s, o) => s + o.totalCents, 0);
  const orderCount = orders.length;
  const avgOrder = orderCount ? Math.round(totalRevenue / orderCount) : 0;
  const unitsSold = orders.flatMap((o) => o.items).reduce((s, i) => s + i.qty, 0);

  // Top prodotti
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
  const topProducts = Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="display text-5xl">ANALYTICS</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Revenue" value={formatPrice(totalRevenue)} />
        <Kpi label="Ordini" value={orderCount.toString()} />
        <Kpi label="Avg order" value={formatPrice(avgOrder)} />
        <Kpi label="Pezzi venduti" value={unitsSold.toString()} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-6">
          <p className="pill text-muted mb-4">Top prodotti</p>
          {topProducts.length === 0 ? (
            <p className="text-muted text-sm">Nessuna vendita ancora.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="display text-xl text-muted w-6">{i + 1}</span>
                  <p className="flex-1 text-sm">{p.name}</p>
                  <p className="text-xs text-muted">{p.units} pz</p>
                  <p className="display tabular-nums text-accent">{formatPrice(p.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <p className="pill text-muted mb-4">Database</p>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Iscritti notify" value={signups} />
            <Stat label="Drop totali" value={drops} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="pill text-muted">{label}</p>
      <p className="display mt-3 text-4xl">{value}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="display text-3xl text-accent">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
