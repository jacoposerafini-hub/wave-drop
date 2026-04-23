import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Props {
  slug: string;
  name: string;
  priceCents: number;
  images: string[];
  stockTotal: number;
  stockAvailable: number;
}

export default function ProductCard({
  slug,
  name,
  priceCents,
  images,
  stockTotal,
  stockAvailable,
}: Props) {
  const low = stockAvailable > 0 && stockAvailable < stockTotal * 0.2;
  const soldOut = stockAvailable === 0;

  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-elevated ring-soft">
        {images[0] && (
          <Image
            src={images[0]}
            alt={name}
            fill
            sizes="(min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-[600ms] ease-smooth group-hover:scale-[1.04]"
          />
        )}
        {images[1] && (
          <Image
            src={images[1]}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-400 ease-smooth group-hover:opacity-100"
          />
        )}

        {/* Gradient bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Hover arrow */}
        <div className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white text-black opacity-0 transition-all duration-300 ease-smooth group-hover:translate-y-0 group-hover:opacity-100 translate-y-1">
          <ArrowUpRight size={16} strokeWidth={2} />
        </div>

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/65 backdrop-blur-[2px]">
            <span className="pill bg-white text-black">Sold out</span>
          </div>
        )}
        {!soldOut && low && (
          <span className="pill absolute left-3 top-3 bg-danger text-white shadow-glow-pink-soft">
            Left {stockAvailable}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold tracking-wide transition-colors group-hover:text-accent">
          {name}
        </p>
        <p className="font-display text-lg tabular-nums text-white">
          {formatPrice(priceCents)}
        </p>
      </div>
    </Link>
  );
}
