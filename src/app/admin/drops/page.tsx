import Link from 'next/link';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function createDrop(formData: FormData) {
  'use server';
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return;
  const drop = await db.drop.create({
    data: {
      slug: slugify(name) + '-' + Math.random().toString(36).slice(2, 6),
      name,
      status: 'upcoming',
      accessType: 'public',
    },
  });
  revalidatePath('/admin/drops');
  redirect(`/admin/drops/${drop.id}`);
}

async function deleteDrop(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  await db.drop.delete({ where: { id } });
  revalidatePath('/admin/drops');
  revalidatePath('/');
}

const STATUS_PILL: Record<string, string> = {
  live: 'admin-pill admin-pill--live',
  upcoming: 'admin-pill admin-pill--warn',
  sold_out: 'admin-pill admin-pill--danger',
  archived: 'admin-pill',
};

export default async function AdminDrops() {
  const drops = await db.drop.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-page-head__title">Drops</h1>
        <form action={createDrop} className="admin-page-head__actions">
          <input
            name="name"
            placeholder="Nome drop"
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
        {drops.map((d) => (
          <div key={d.id} className="admin-list-row">
            <div className="admin-list-row__main">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <p className="admin-list-row__title">{d.name}</p>
                <span className={STATUS_PILL[d.status] ?? 'admin-pill'}>
                  {d.status}
                </span>
              </div>
              <p className="admin-list-row__meta">
                {d._count.products} prodott
                {d._count.products === 1 ? 'o' : 'i'} · /{d.slug}
              </p>
            </div>
            <div className="admin-list-row__actions">
              <Link href={`/admin/drops/${d.id}`} className="btn ghost sm">
                Modifica
              </Link>
              <Link
                href={`/drop/${d.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn ghost sm"
              >
                Visualizza
              </Link>
              <form action={deleteDrop}>
                <input type="hidden" name="id" value={d.id} />
                <button
                  type="submit"
                  className="btn ghost sm"
                  style={{ color: 'var(--danger)' }}
                >
                  Elimina
                </button>
              </form>
            </div>
          </div>
        ))}
        {drops.length === 0 && (
          <div className="admin-empty">Nessun drop. Creane uno qui sopra.</div>
        )}
      </div>
    </>
  );
}
