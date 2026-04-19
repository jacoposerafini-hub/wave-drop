import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function updateDrop(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  await db.drop.update({
    where: { id },
    data: {
      name: String(formData.get('name') ?? '').trim(),
      tagline: String(formData.get('tagline') ?? '') || null,
      description: String(formData.get('description') ?? '') || null,
      heroImage: String(formData.get('heroImage') ?? '') || null,
      heroVideo: String(formData.get('heroVideo') ?? '') || null,
      status: String(formData.get('status') ?? 'upcoming'),
      accessType: String(formData.get('accessType') ?? 'public'),
      password: String(formData.get('password') ?? '') || null,
      startsAt: formData.get('startsAt') ? new Date(String(formData.get('startsAt'))) : null,
      featured: formData.get('featured') === 'on',
    },
  });
  revalidatePath('/');
  revalidatePath(`/admin/drops/${id}`);
  redirect(`/admin/drops/${id}?saved=1`);
}

export default async function EditDrop({ params, searchParams }: { params: { id: string }; searchParams: { saved?: string } }) {
  const drop = await db.drop.findUnique({
    where: { id: params.id },
    include: { products: { orderBy: { position: 'asc' } } },
  });
  if (!drop) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/drops" className="text-muted hover:text-white text-xs">← Drops</Link>
        <h1 className="display text-4xl">{drop.name}</h1>
        {searchParams.saved && <span className="pill bg-success/20 text-success">✓ Salvato</span>}
      </div>

      <form action={updateDrop} className="grid gap-4 md:grid-cols-2 card p-6">
        <input type="hidden" name="id" value={drop.id} />

        <Field label="Nome">
          <input name="name" defaultValue={drop.name} required className="input" />
        </Field>
        <Field label="Tagline">
          <input name="tagline" defaultValue={drop.tagline ?? ''} className="input" />
        </Field>

        <Field label="Hero Image URL" wide>
          <input name="heroImage" defaultValue={drop.heroImage ?? ''} className="input" placeholder="https://..." />
        </Field>
        <Field label="Hero Video URL" wide>
          <input name="heroVideo" defaultValue={drop.heroVideo ?? ''} className="input" placeholder="https://..." />
        </Field>

        <Field label="Descrizione" wide>
          <textarea name="description" defaultValue={drop.description ?? ''} rows={5} className="input" />
        </Field>

        <Field label="Status">
          <select name="status" defaultValue={drop.status} className="input">
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="sold_out">Sold out</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Access">
          <select name="accessType" defaultValue={drop.accessType} className="input">
            <option value="public">Public</option>
            <option value="password">Password</option>
            <option value="members_only">Members only</option>
          </select>
        </Field>

        <Field label="Password (se access=password)">
          <input name="password" defaultValue={drop.password ?? ''} className="input" />
        </Field>
        <Field label="Parte il">
          <input
            name="startsAt"
            type="datetime-local"
            defaultValue={drop.startsAt ? drop.startsAt.toISOString().slice(0, 16) : ''}
            className="input"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" name="featured" defaultChecked={drop.featured} /> Featured in homepage
        </label>

        <div className="md:col-span-2">
          <button className="btn-primary h-12 px-6">Salva</button>
        </div>
      </form>

      {/* PRODOTTI */}
      <div className="flex items-center justify-between mt-4">
        <h2 className="display text-3xl">PRODOTTI</h2>
        <Link href={`/admin/products?dropId=${drop.id}`} className="btn-ghost px-3 py-2 text-xs">Gestisci prodotti</Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {drop.products.map((p) => (
          <Link key={p.id} href={`/admin/products/${p.id}`} className="card p-4 hover:border-accent/40">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{p.name}</p>
              <p className="text-accent tabular-nums">{formatPrice(p.priceCents)}</p>
            </div>
            <p className="text-xs text-muted mt-1">/{p.slug}</p>
          </Link>
        ))}
        {drop.products.length === 0 && <p className="text-muted text-sm">Nessun prodotto. Aggiungili dalla sezione prodotti.</p>}
      </div>
    </div>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${wide ? 'md:col-span-2' : ''}`}>
      <span className="text-[10px] uppercase tracking-widest text-muted">{label}</span>
      {children}
    </label>
  );
}
