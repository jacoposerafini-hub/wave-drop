import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function updateProduct(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  const imagesRaw = String(formData.get('images') ?? '').trim();
  const images = imagesRaw ? imagesRaw.split('\n').map((l) => l.trim()).filter(Boolean) : [];
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
  if (!size) return;
  await db.variant.upsert({
    where: { productId_size: { productId, size } },
    create: { productId, size, stock },
    update: { stock },
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

export default async function EditProduct({ params, searchParams }: { params: { id: string }; searchParams: { saved?: string } }) {
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { variants: { orderBy: { size: 'asc' } }, drop: true },
  });
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-muted hover:text-white text-xs">← Prodotti</Link>
        <h1 className="display text-4xl">{product.name}</h1>
        {searchParams.saved && <span className="pill bg-success/20 text-success">✓ Salvato</span>}
      </div>

      <form action={updateProduct} className="grid gap-4 md:grid-cols-2 card p-6">
        <input type="hidden" name="id" value={product.id} />
        <Field label="Nome">
          <input name="name" defaultValue={product.name} required className="input" />
        </Field>
        <Field label="Prezzo (EUR)">
          <input name="priceEur" type="number" step="0.01" defaultValue={(product.priceCents / 100).toFixed(2)} required className="input" />
        </Field>
        <Field label="Descrizione" wide>
          <textarea name="description" defaultValue={product.description} rows={4} className="input" />
        </Field>
        <Field label="Composizione">
          <input name="composition" defaultValue={product.composition ?? ''} className="input" />
        </Field>
        <Field label="Vestibilità">
          <input name="fit" defaultValue={product.fit ?? ''} className="input" />
        </Field>
        <Field label="Immagini (una URL per riga)" wide>
          <textarea name="images" defaultValue={product.images.join('\n')} rows={4} className="input font-mono text-xs" />
        </Field>
        <Field label="Ordine">
          <input name="position" type="number" defaultValue={product.position} className="input" />
        </Field>
        <div className="md:col-span-2">
          <button className="btn-primary h-12 px-6">Salva</button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        <h2 className="display text-3xl">VARIANTI / STOCK</h2>
        {product.variants.map((v) => (
          <div key={v.id} className="card p-4 flex items-center gap-4">
            <p className="font-semibold w-20">{v.size}</p>
            <form action={upsertVariant} className="flex items-center gap-2 flex-1">
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="size" value={v.size} />
              <input
                type="number"
                name="stock"
                defaultValue={v.stock}
                className="input w-24"
              />
              <span className="text-xs text-muted">stock (riservati: {v.reserved})</span>
              <button className="btn-ghost ml-auto px-3 py-1.5 text-xs">Aggiorna</button>
            </form>
            <form action={deleteVariant}>
              <input type="hidden" name="id" value={v.id} />
              <input type="hidden" name="productId" value={product.id} />
              <button className="text-danger text-xs hover:underline">Elimina</button>
            </form>
          </div>
        ))}

        <form action={upsertVariant} className="card p-4 flex items-center gap-2">
          <input type="hidden" name="productId" value={product.id} />
          <input name="size" placeholder="Taglia (es. M)" className="input w-32" required />
          <input name="stock" type="number" placeholder="Stock" className="input w-32" required />
          <button className="btn-primary px-4 py-2">+ Aggiungi taglia</button>
        </form>
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
