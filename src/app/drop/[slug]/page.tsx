import { notFound } from 'next/navigation';
import Image from 'next/image';
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
      products: { orderBy: { position: 'asc' }, include: { variants: true } },
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
          : drop.status;

  return (
    <div>
      <section className="relative -mt-16 h-[70vh] min-h-[500px] w-full overflow-hidden">
        {drop.heroImage && (
          <Image
            src={drop.heroImage}
            alt={drop.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-bg-primary/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 pb-12 pt-24 md:px-10 md:pb-16">
          <div className="stagger flex flex-col gap-4">
            <span className="pill self-start bg-white text-black">
              {statusLabel}
            </span>
            <h1 className="display text-[12vw] leading-[0.85] md:text-[8vw]">
              {drop.name}
            </h1>
            {drop.tagline && (
              <p className="max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                {drop.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-3">Lookbook</p>
            <h2 className="display text-4xl md:text-6xl">
              {drop.products.length} pezzi
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
          {drop.products.map((p) => {
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
              />
            );
          })}
        </div>
      </section>

      {drop.description && (
        <section className="border-t border-border">
          <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-16 md:grid-cols-12 md:gap-16 md:px-10 md:py-24">
            <div className="md:col-span-4">
              <p className="eyebrow mb-3">About</p>
              <p className="display text-3xl md:text-4xl">La storia</p>
              <div className="mt-4 h-px w-16 bg-accent" />
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="text-lg leading-relaxed text-white/85">
                {drop.description}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
