import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/AddToCartButton';

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { drop: true, variants: { orderBy: { size: 'asc' } } },
  });

  if (!product) notFound();

  const totalStock = product.variants.reduce(
    (s, v) => s + (v.stock - v.reserved),
    0,
  );

  return (
    <main className="page-enter container">
      <nav
        className="eyebrow"
        style={{ paddingTop: 40, display: 'flex', gap: 10, alignItems: 'center' }}
      >
        <Link href="/">Shop</Link>
        <span style={{ color: 'var(--fg-mute)' }}>/</span>
        <Link href={`/drop/${product.drop.slug}`}>{product.drop.name}</Link>
        <span style={{ color: 'var(--fg-mute)' }}>/</span>
        <span style={{ color: 'var(--fg)' }}>{product.name}</span>
      </nav>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
          gap: 48,
          marginTop: 32,
          alignItems: 'start',
        }}
        className="product-detail-grid"
      >
        {/* GALLERY */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {product.images.length > 0 ? (
            product.images.map((src, i) => (
              <div
                key={i}
                className="media portrait"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <Image
                  src={src}
                  alt={product.name}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1100px) 55vw, 100vw"
                  style={{ objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    right: 14,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    color: 'var(--fg-mute)',
                    zIndex: 2,
                  }}
                >
                  {String(i + 1).padStart(2, '0')} /{' '}
                  {String(product.images.length).padStart(2, '0')}
                </span>
              </div>
            ))
          ) : (
            <div className="media portrait" data-label={product.name} />
          )}
        </div>

        {/* STICKY PANEL */}
        <aside
          style={{
            position: 'sticky',
            top: 96,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          <div>
            <div className="eyebrow">{product.drop.name}</div>
            <h1
              className="display"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginTop: 12 }}
            >
              {product.name}
            </h1>
            <div
              className="row"
              style={{ justifyContent: 'space-between', marginTop: 18 }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 22,
                  letterSpacing: '-0.01em',
                }}
              >
                {formatPrice(product.priceCents)}
              </span>
              {totalStock === 0 ? (
                <span className="chip" style={{ color: 'var(--fg-mute)' }}>
                  Sold out
                </span>
              ) : totalStock <= 6 ? (
                <span className="chip live">Ultimi pezzi</span>
              ) : (
                <span className="chip">{totalStock} disponibili</span>
              )}
            </div>
          </div>

          <hr className="hr" />

          <p style={{ color: 'var(--fg-dim)', fontSize: 15, lineHeight: 1.6 }}>
            {product.description}
          </p>

          <AddToCartButton
            variants={product.variants.map((v) => ({
              id: v.id,
              size: v.size,
              stock: v.stock,
              reserved: v.reserved,
              checkoutUrl: v.checkoutUrl,
            }))}
          />

          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              Dettagli
            </div>
            <ul
              style={{
                listStyle: 'none',
                color: 'var(--fg-dim)',
                fontSize: 13,
              }}
            >
              {product.composition && (
                <li
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px dashed var(--line)',
                  }}
                >
                  — {product.composition}
                </li>
              )}
              {product.fit && (
                <li
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px dashed var(--line)',
                  }}
                >
                  — {product.fit}
                </li>
              )}
              <li style={{ padding: '8px 0' }}>
                — Spedizione in 3-5 giorni lavorativi. Reso gratuito entro 14
                giorni.
              </li>
            </ul>
          </div>

        </aside>
      </div>
    </main>
  );
}
