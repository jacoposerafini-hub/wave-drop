import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { ArrowLeft } from 'lucide-react';
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
      startsAt: formData.get('startsAt')
        ? new Date(String(formData.get('startsAt')))
        : null,
      featured: formData.get('featured') === 'on',
    },
  });
  revalidatePath('/');
  revalidatePath(`/admin/drops/${id}`);
  redirect(`/admin/drops/${id}?saved=1`);
}

export default async function EditDrop({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { saved?: string };
}) {
  const drop = await db.drop.findUnique({
    where: { id: params.id },
    include: { products: { orderBy: { position: 'asc' } } },
  });
  if (!drop) notFound();

  return (
    <>
      <Link href="/admin/drops" className="admin-back">
        <ArrowLeft size={14} /> Drops
      </Link>

      <div className="admin-page-head">
        <h1 className="admin-page-head__title">{drop.name}</h1>
        <div className="admin-page-head__actions">
          {searchParams.saved && (
            <span className="admin-pill admin-pill--ok">✓ Salvato</span>
          )}
        </div>
      </div>

      <form action={updateDrop} className="admin-card admin-form-grid">
        <input type="hidden" name="id" value={drop.id} />

        <Field label="Nome">
          <input
            name="name"
            defaultValue={drop.name}
            required
            className="admin-input"
          />
        </Field>
        <Field label="Tagline">
          <input
            name="tagline"
            defaultValue={drop.tagline ?? ''}
            className="admin-input"
          />
        </Field>

        <Field label="Hero Image URL" wide>
          <input
            name="heroImage"
            defaultValue={drop.heroImage ?? ''}
            className="admin-input"
            placeholder="https://..."
          />
        </Field>
        <Field label="Hero Video URL" wide>
          <input
            name="heroVideo"
            defaultValue={drop.heroVideo ?? ''}
            className="admin-input"
            placeholder="https://..."
          />
        </Field>

        <Field label="Descrizione" wide>
          <textarea
            name="description"
            defaultValue={drop.description ?? ''}
            rows={5}
            className="admin-textarea"
          />
        </Field>

        <Field label="Status">
          <select name="status" defaultValue={drop.status} className="admin-select">
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="sold_out">Sold out</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Access">
          <select
            name="accessType"
            defaultValue={drop.accessType}
            className="admin-select"
          >
            <option value="public">Public</option>
            <option value="password">Password</option>
            <option value="members_only">Members only</option>
          </select>
        </Field>

        <Field label="Password (se access=password)">
          <input
            name="password"
            defaultValue={drop.password ?? ''}
            className="admin-input"
          />
        </Field>
        <Field label="Parte il">
          <input
            name="startsAt"
            type="datetime-local"
            defaultValue={
              drop.startsAt ? drop.startsAt.toISOString().slice(0, 16) : ''
            }
            className="admin-input"
          />
        </Field>

        <label className="admin-checkbox admin-field--wide">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={drop.featured}
          />
          Featured in homepage
        </label>

        <div className="admin-field--wide">
          <button type="submit" className="btn primary">
            Salva
          </button>
        </div>
      </form>

      <div className="admin-section-head">
        <h2>Prodotti</h2>
        <Link
          href={`/admin/products?dropId=${drop.id}`}
          className="btn ghost sm"
        >
          Gestisci prodotti
        </Link>
      </div>

      <div className="admin-grid-2">
        {drop.products.map((p) => (
          <Link
            key={p.id}
            href={`/admin/products/${p.id}`}
            className="admin-card is-link"
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: '-0.02em',
                }}
              >
                {p.name}
              </p>
              <p
                style={{
                  color: 'var(--accent)',
                  fontVariantNumeric: 'tabular-nums',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                }}
              >
                {formatPrice(p.priceCents)}
              </p>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: 'var(--fg-mute)',
                marginTop: 6,
              }}
            >
              /{p.slug}
            </p>
          </Link>
        ))}
        {drop.products.length === 0 && (
          <div className="admin-empty" style={{ gridColumn: '1 / -1' }}>
            Nessun prodotto. Aggiungili dalla sezione prodotti.
          </div>
        )}
      </div>
    </>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={'admin-field' + (wide ? ' admin-field--wide' : '')}>
      <span className="admin-field__label">{label}</span>
      {children}
    </label>
  );
}
