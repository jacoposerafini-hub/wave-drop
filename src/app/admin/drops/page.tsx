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

export default async function AdminDrops() {
  const drops = await db.drop.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="display text-5xl">DROPS</h1>
        <form action={createDrop} className="flex gap-2">
          <input name="name" placeholder="Nome drop" className="input w-64" required />
          <button className="btn-primary px-4"><Plus size={14} /> Crea</button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {drops.map((d) => (
          <div key={d.id} className="card p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="font-semibold">{d.name}</p>
                <span className={`pill ${d.status === 'live' ? 'bg-danger text-white' : 'bg-white/5 text-muted'}`}>
                  {d.status}
                </span>
              </div>
              <p className="text-xs text-muted">
                {d._count.products} prodott{d._count.products === 1 ? 'o' : 'i'} · /{d.slug}
              </p>
            </div>
            <Link href={`/admin/drops/${d.id}`} className="btn-ghost px-3 py-1.5 text-xs">Modifica</Link>
            <Link href={`/drop/${d.slug}`} target="_blank" className="btn-ghost px-3 py-1.5 text-xs">Visualizza</Link>
            <form action={deleteDrop}>
              <input type="hidden" name="id" value={d.id} />
              <button className="text-danger text-xs px-3 py-1.5 border border-danger/40 hover:bg-danger/10">Elimina</button>
            </form>
          </div>
        ))}
        {drops.length === 0 && <p className="text-muted">Nessun drop. Creane uno.</p>}
      </div>
    </div>
  );
}
