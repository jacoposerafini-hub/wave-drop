import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60;

export default async function DropDetailPage({ params }: { params: { slug: string } }) {
  const drop = await db.drop.findUnique({
    where: { slug: params.slug },
    include: { products: { orderBy: { position: 'asc' }, include: { variants: true } } },
  });
  if (!drop) notFound();

  return (
    <div>
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {drop.heroImage && (
          <Image src={drop.heroImage} alt={drop.name} fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 md:px-10 pb-10">
          <p className="pill bg-white text-black">
            {drop.status === 'sold_out' ? 'Sold out' : drop.status === 'archived' ? 'Archived' : drop.status}
          </p>
          <h1 className="display mt-3 text-[12vw] md:text-[8vw] leading-[0.85]">{drop.name}</h1>
          {drop.tagline && <p className="mt-3 max-w-xl text-white/80">{drop.tagline}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
          {drop.products.map((p) => {
            const total = p.variants.reduce((s, v) => s + v.stock, 0);
            const avail = p.variants.reduce((s, v) => s + (v.stock - v.reserved), 0);
            return (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                priceCents={p.priceCents}
                images={p.images}
                stockTotal={total}
                stockAvailable={avail}
              />
            );
          })}
        </div>
      </section>

      {drop.description && (
        <section className="mx-auto max-w-[1200px] px-5 md:px-10 py-16 border-t border-border">
          <p className="text-lg leading-relaxed text-white/80">{drop.description}</p>
        </section>
      )}
    </div>
  );
}
