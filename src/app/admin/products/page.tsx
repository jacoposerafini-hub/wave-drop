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

export default async function AdminProducts({ searchParams }: { searchParams: { dropId?: string } }) {
  const [products, drops] = await Promise.all([
    db.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { drop: true, variants: true },
      where: searchParams.dropId ? { dropId: searchParams.dropId } : undefined,
    }),
    db.drop.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="display text-5xl">PRODOTTI</h1>
        <form action={createProduct} className="flex gap-2">
          <select name="dropId" required defaultValue={searchParams.dropId ?? ''} className="input w-48">
            <option value="">Seleziona drop…</option>
            {drops.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <input name="name" placeholder="Nome prodotto" className="input w-64" required />
          <button className="btn-primary px-4"><Plus size={14} /> Crea</button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {products.map((p) => {
          const stock = p.variants.reduce((s, v) => s + v.stock, 0);
          return (
            <Link key={p.id} href={`/admin/products/${p.id}`} className="card p-4 flex items-center gap-4 hover:border-accent/40">
              <div className="flex-1">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-muted">
                  {p.drop.name} · {stock} pz totali · /{p.slug}
                </p>
              </div>
              <p className="text-accent tabular-nums">{formatPrice(p.priceCents)}</p>
            </Link>
          );
        })}
        {products.length === 0 && <p className="text-muted">Nessun prodotto.</p>}
      </div>
    </div>
  );
}
