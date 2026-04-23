import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, MessageCircle, Truck, RotateCcw, Shield } from 'lucide-react';
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

  return (
    <div className="mx-auto max-w-[1600px] px-0 md:px-10">
      <nav className="px-5 pt-8 text-xs uppercase tracking-widest text-muted md:px-0">
        <Link href="/" className="transition-colors hover:text-white">
          Shop
        </Link>
        <span className="mx-2 text-subtle">/</span>
        <Link
          href={`/drop/${product.drop.slug}`}
          className="transition-colors hover:text-white"
        >
          {product.drop.name}
        </Link>
        <span className="mx-2 text-subtle">/</span>
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-6 md:mt-10 md:grid-cols-12 md:gap-12">
        {/* GALLERY */}
        <div className="md:col-span-7">
          <div className="flex flex-col gap-2 md:gap-4">
            {product.images.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-[4/5] w-full overflow-hidden bg-bg-elevated ring-soft"
              >
                <Image
                  src={src}
                  alt={product.name}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover transition-transform duration-[800ms] ease-smooth group-hover:scale-[1.02]"
                />
                <span className="pointer-events-none absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {String(i + 1).padStart(2, '0')} / {String(product.images.length).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* STICKY PANEL */}
        <div className="md:col-span-5">
          <div className="flex flex-col gap-6 px-5 pb-24 md:sticky md:top-24 md:px-0 md:pb-10">
            <div>
              <p className="eyebrow mb-3">{product.drop.name}</p>
              <h1 className="display text-5xl md:text-6xl">{product.name}</h1>
              <p className="mt-4 font-display text-3xl tabular-nums text-gradient-accent">
                {formatPrice(product.priceCents)}
              </p>
            </div>

            <div className="divider-x" />

            <p className="text-sm leading-relaxed text-white/80">
              {product.description}
            </p>

            <AddToCartButton
              variants={product.variants.map((v) => ({
                id: v.id,
                size: v.size,
                stock: v.stock,
                reserved: v.reserved,
              }))}
            />

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-2 border-y border-border py-4 text-center">
              <TrustItem icon={<Truck size={14} />} label="3-5 gg" sub="Spedizione" />
              <TrustItem icon={<RotateCcw size={14} />} label="14 gg" sub="Reso" />
              <TrustItem icon={<Shield size={14} />} label="Sicuro" sub="Pagamento" />
            </div>

            <div className="flex flex-col">
              {product.composition && (
                <Accordion title="Composizione">{product.composition}</Accordion>
              )}
              {product.fit && <Accordion title="Vestibilità">{product.fit}</Accordion>}
              <Accordion title="Spedizione & Resi">
                Spedizione in 3-5 giorni lavorativi in tutta Italia. Reso
                gratuito entro 14 giorni. I drop limitati non possono essere
                rifatti: se cambi idea, puoi restituire ma non cambiare taglia.
              </Accordion>
            </div>

            <a
              href="https://wa.me/393000000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
            >
              <MessageCircle size={14} /> Domande? Scrivici su WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustItem({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-accent">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-widest">
        {label}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-muted">
        {sub}
      </span>
    </div>
  );
}

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-b border-border py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-widest transition-colors hover:text-accent">
        {title}
        <ChevronDown
          size={14}
          className="transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-muted">{children}</p>
    </details>
  );
}
