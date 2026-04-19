import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/AddToCartButton';

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { drop: true, variants: { orderBy: { size: 'asc' } } },
  });

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-[1600px] px-0 md:px-10">
      <nav className="px-5 pt-6 text-xs uppercase tracking-widest text-muted md:px-0">
        <Link href="/" className="hover:text-white">{product.drop.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="mt-4 grid gap-6 md:grid-cols-12 md:gap-10">
        {/* GALLERY */}
        <div className="md:col-span-7">
          <div className="flex flex-col gap-2 md:gap-4">
            {product.images.map((src, i) => (
              <div key={i} className="relative aspect-[4/5] w-full bg-bg-elevated overflow-hidden">
                <Image
                  src={src}
                  alt={product.name}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* STICKY PANEL */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-20 flex flex-col gap-6 px-5 md:px-0 pb-24 md:pb-10">
            <div>
              <h1 className="display text-5xl md:text-6xl">{product.name}</h1>
              <p className="mt-3 display text-3xl text-accent tabular-nums">
                {formatPrice(product.priceCents)}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-white/80">{product.description}</p>

            <AddToCartButton
              variants={product.variants.map((v) => ({
                id: v.id,
                size: v.size,
                stock: v.stock,
                reserved: v.reserved,
              }))}
            />

            <div className="flex flex-col border-t border-border">
              {product.composition && (
                <Accordion title="Composizione">{product.composition}</Accordion>
              )}
              {product.fit && <Accordion title="Vestibilità">{product.fit}</Accordion>}
              <Accordion title="Spedizione & Resi">
                Spedizione in 3-5 giorni lavorativi in tutta Italia. Reso gratuito entro 14
                giorni. I drop limitati non possono essere rifatti: se cambi idea, puoi
                restituire ma non cambiare taglia.
              </Accordion>
            </div>

            <a
              href="https://wa.me/393000000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-muted hover:text-accent"
            >
              <MessageCircle size={14} /> Domande? Scrivici su WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-border py-4">
      <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-widest">
        {title}
        <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-sm text-muted">{children}</p>
    </details>
  );
}
