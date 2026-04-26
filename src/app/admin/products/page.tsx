import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { formatPrice, slugify } from '@/lib/utils';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function createProduct(formData: FormData) {
  'use server';
  const name = String(formData.get('name') ?? '').trim();
  const dropId = String(formData.get('dropId') ?? '');
  if (!name || !dropId) return;
  const product = await db.product.create({
    data: {
      slug: slugify(name) + '-' + Math.random().toString(36).slice(2, 6),
      name,
      description: '',
      priceCents: 0,
      dropId,
      images: [],
    },
  });
  revalidatePath('/admin/products');
  redirect(`/admin/products/${product.id}`);
}

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: { dropId?: string };
}) {
  const [products, drops] = await Promise.all([
    db.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { drop: true, variants: true },
      where: searchParams.dropId ? { dropId: searchParams.dropId } : undefined,
    }),
    db.drop.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-page-head__title">Prodotti</h1>
        <form action={createProduct} className="admin-page-head__actions">
          <select
            name="dropId"
            required
            defaultValue={searchParams.dropId ?? ''}
            className="admin-select"
            style={{ width: 200 }}
          >
            <option value="">Seleziona drop…</option>
            {drops.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <input
            name="name"
            placeholder="Nome prodotto"
            required
            className="admin-input"
            style={{ width: 240 }}
          />
          <button type="submit" className="btn primary">
            <Plus size={14} /> Crea
          </button>
        </form>
      </div>

      <div className="admin-list">
        {products.map((p) => {
          const stock = p.variants.reduce((s, v) => s + v.stock, 0);
          return (
            <Link
              key={p.id}
              href={`/admin/products/${p.id}`}
              className="admin-list-row"
              style={{ textDecoration: 'none' }}
            >
              <div className="admin-list-row__main">
                <p className="admin-list-row__title">{p.name}</p>
                <p className="admin-list-row__meta">
                  {p.drop.name} · {stock} pz totali · /{p.slug}
                </p>
              </div>
              <p
                style={{
                  color: 'var(--accent)',
                  fontVariantNumeric: 'tabular-nums',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: '-0.02em',
                }}
              >
                {formatPrice(p.priceCents)}
              </p>
            </Link>
          );
        })}
        {products.length === 0 && (
          <div className="admin-empty">Nessun prodotto.</div>
        )}
      </div>
    </>
  );
}
