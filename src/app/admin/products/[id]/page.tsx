import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function updateProduct(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  const imagesRaw = String(formData.get('images') ?? '').trim();
  const images = imagesRaw
    ? imagesRaw.split('\n').map((l) => l.trim()).filter(Boolean)
    : [];
  await db.product.update({
    where: { id },
    data: {
      name: String(formData.get('name') ?? '').trim(),
      description: String(formData.get('description') ?? ''),
      priceCents: Math.round(Number(formData.get('priceEur') ?? 0) * 100),
      composition: String(formData.get('composition') ?? '') || null,
      fit: String(formData.get('fit') ?? '') || null,
      position: Number(formData.get('position') ?? 0),
      images,
    },
  });
  revalidatePath(`/admin/products/${id}`);
  revalidatePath('/');
  redirect(`/admin/products/${id}?saved=1`);
}

async function upsertVariant(formData: FormData) {
  'use server';
  const productId = String(formData.get('productId'));
  const size = String(formData.get('size') ?? '').trim().toUpperCase();
  const stock = Number(formData.get('stock') ?? 0);
  const checkoutUrlRaw = String(formData.get('checkoutUrl') ?? '').trim();
  const checkoutUrl = checkoutUrlRaw || null;
  if (!size) return;
  await db.variant.upsert({
    where: { productId_size: { productId, size } },
    create: { productId, size, stock, checkoutUrl },
    update: { stock, checkoutUrl },
  });
  revalidatePath(`/admin/products/${productId}`);
}

async function deleteVariant(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  const productId = String(formData.get('productId'));
  await db.variant.delete({ where: { id } });
  revalidatePath(`/admin/products/${productId}`);
}

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { saved?: string };
}) {
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { variants: { orderBy: { size: 'asc' } }, drop: true },
  });
  if (!product) notFound();

  return (
    <>
      <Link href="/admin/products" className="admin-back">
        <ArrowLeft size={14} /> Prodotti
      </Link>

      <div className="admin-page-head">
        <h1 className="admin-page-head__title">{product.name}</h1>
        <div className="admin-page-head__actions">
          {searchParams.saved && (
            <span className="admin-pill admin-pill--ok">✓ Salvato</span>
          )}
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn ghost sm"
          >
            Anteprima
          </Link>
        </div>
      </div>

      <form action={updateProduct} className="admin-card admin-form-grid">
        <input type="hidden" name="id" value={product.id} />
        <Field label="Nome">
          <input
            name="name"
            defaultValue={product.name}
            required
            className="admin-input"
          />
        </Field>
        <Field label="Prezzo (EUR)">
          <input
            name="priceEur"
            type="number"
            step="0.01"
            defaultValue={(product.priceCents / 100).toFixed(2)}
            required
            className="admin-input"
          />
        </Field>
        <Field label="Descrizione" wide>
          <textarea
            name="description"
            defaultValue={product.description}
            rows={4}
            className="admin-textarea"
          />
        </Field>
        <Field label="Composizione">
          <input
            name="composition"
            defaultValue={product.composition ?? ''}
            className="admin-input"
          />
        </Field>
        <Field label="Vestibilità">
          <input
            name="fit"
            defaultValue={product.fit ?? ''}
            className="admin-input"
          />
        </Field>
        <Field label="Immagini (una URL per riga)" wide>
          <textarea
            name="images"
            defaultValue={product.images.join('\n')}
            rows={4}
            className="admin-textarea"
          />
        </Field>
        <Field label="Ordine">
          <input
            name="position"
            type="number"
            defaultValue={product.position}
            className="admin-input"
          />
        </Field>
        <div className="admin-field--wide">
          <button type="submit" className="btn primary">
            Salva
          </button>
        </div>
      </form>

      <div className="admin-section-head">
        <h2>Varianti / Stock</h2>
      </div>

      <div className="admin-list">
        {product.variants.map((v) => (
          <div
            key={v.id}
            className="admin-card"
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <form
              action={upsertVariant}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="size" value={v.size} />
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 16,
                  width: 60,
                }}
              >
                {v.size}
              </p>
              <input
                type="number"
                name="stock"
                defaultValue={v.stock}
                className="admin-input"
                style={{ width: 100 }}
              />
              <span style={{ fontSize: 12, color: 'var(--fg-mute)' }}>
                stock (riservati: {v.reserved})
              </span>
              <input
                type="url"
                name="checkoutUrl"
                defaultValue={v.checkoutUrl ?? ''}
                placeholder="Checkout URL (Payhip: https://payhip.com/b/XXXX)"
                className="admin-input"
                style={{ flex: 1, minWidth: 260, fontFamily: 'var(--font-mono)', fontSize: 12.5 }}
              />
              <button type="submit" className="btn ghost sm">
                Aggiorna
              </button>
            </form>
            <form action={deleteVariant} style={{ alignSelf: 'flex-end' }}>
              <input type="hidden" name="id" value={v.id} />
              <input type="hidden" name="productId" value={product.id} />
              <button
                type="submit"
                style={{
                  fontSize: 12,
                  color: 'var(--danger)',
                  background: 'transparent',
                  textDecoration: 'underline',
                }}
              >
                Elimina taglia
              </button>
            </form>
          </div>
        ))}

        <form
          action={upsertVariant}
          className="admin-card"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <input type="hidden" name="productId" value={product.id} />
          <input
            name="size"
            placeholder="Taglia (es. M)"
            className="admin-input"
            style={{ width: 130 }}
            required
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            className="admin-input"
            style={{ width: 110 }}
            required
          />
          <input
            name="checkoutUrl"
            type="url"
            placeholder="Checkout URL (opzionale)"
            className="admin-input"
            style={{ flex: 1, minWidth: 240, fontFamily: 'var(--font-mono)', fontSize: 12.5 }}
          />
          <button type="submit" className="btn primary sm">
            + Aggiungi taglia
          </button>
        </form>
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
