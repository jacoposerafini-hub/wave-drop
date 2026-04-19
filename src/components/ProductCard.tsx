import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface Props {
  slug: string;
  name: string;
  priceCents: number;
  images: string[];
  stockTotal: number;
  stockAvailable: number;
}

export default function ProductCard({ slug, name, priceCents, images, stockTotal, stockAvailable }: Props) {
  const low = stockAvailable > 0 && stockAvailable < stockTotal * 0.2;
  const soldOut = stockAvailable === 0;

  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-elevated">
        {images[0] && (
          <Image
            src={images[0]}
            alt={name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
          />
        )}
        {images[1] && (
          <Image
            src={images[1]}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover opacity-0 transition-opacity duration-300 ease-smooth group-hover:opacity-100"
          />
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="pill bg-white text-black">Sold out</span>
          </div>
        )}
        {!soldOut && low && (
          <span className="pill absolute left-3 top-3 bg-danger text-white">
            Left {stockAvailable}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold tracking-wide">{name}</p>
        <p className="font-display text-lg tabular-nums text-white">{formatPrice(priceCents)}</p>
      </div>
    </Link>
  );
}
