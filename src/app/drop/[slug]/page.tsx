import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60;

export default async function DropDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const drop = await db.drop.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        orderBy: { position: 'asc' },
        include: { variants: true },
      },
    },
  });
  if (!drop) notFound();

  const statusLabel =
    drop.status === 'sold_out'
      ? 'Sold out'
      : drop.status === 'archived'
        ? 'Archived'
        : drop.status === 'live'
          ? 'Live'
          : 'Upcoming';

  return (
    <main className="page-enter container">
      <div className="page__lead">
        <div
          className="row"
          style={{ marginBottom: 20 }}
        >
          <span className="eyebrow">{drop.name}</span>
          <span
            className={
              'chip' + (drop.status === 'live' ? ' live' : '')
            }
          >
            {statusLabel}
          </span>
        </div>
        <h1 className="display">{drop.name}</h1>
        {drop.tagline && (
          <p
            style={{
              color: 'var(--fg-dim)',
              marginTop: 20,
              maxWidth: 540,
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            {drop.tagline}
          </p>
        )}
      </div>

      <div className="section-head" style={{ paddingTop: 40 }}>
        <div className="section-head__l">
          Lookbook
        </div>
        <div className="section-head__r">
          {drop.products.length} pezzi in edizione limitata. Nessun restock.
        </div>
      </div>

      <div className="product-grid">
        {drop.products.map((p, i) => {
          const total = p.variants.reduce((s, v) => s + v.stock, 0);
          const avail = p.variants.reduce(
            (s, v) => s + (v.stock - v.reserved),
            0,
          );
          return (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              priceCents={p.priceCents}
              images={p.images}
              stockTotal={total}
              stockAvailable={avail}
              index={`${String(i + 1).padStart(2, '0')}/${String(drop.products.length).padStart(2, '0')}`}
            />
          );
        })}
      </div>

      {drop.description && (
        <section className="editorial">
          <div className="editorial__text">
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              About
            </div>
            <h3>La storia del drop.</h3>
            <p>{drop.description}</p>
          </div>
          <div
            className="editorial__img-a media portrait"
            data-label="Drop mood"
          />
          <div
            className="editorial__img-b media tall"
            data-label="Behind the scenes"
          />
        </section>
      )}
    </main>
  );
}
