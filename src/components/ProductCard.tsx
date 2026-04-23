'use client';

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
  index?: string;
  type?: string;
}

export default function ProductCard({
  slug,
  name,
  priceCents,
  images,
  stockTotal: _stockTotal,
  stockAvailable,
  index,
  type,
}: Props) {
  const soldOut = stockAvailable <= 0;
  const low = !soldOut && stockAvailable <= 5;

  let tag: { label: string; cls: string } | null = null;
  if (soldOut) tag = { label: 'Sold out', cls: 'sold' };
  else if (low) tag = { label: 'Ultimi pezzi', cls: 'new' };

  return (
    <Link href={`/product/${slug}`} className="product">
      <div className="product__media">
        {tag && <span className={`product__tag ${tag.cls}`}>{tag.label}</span>}
        {images[0] ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            sizes="(min-width: 1100px) 25vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="product__placeholder">
            [ product shot ]
            <br />
            <br />
            {name}
          </div>
        )}
        {index && <span className="product__index">{index}</span>}
      </div>
      <div className="product__body">
        <div className="product__name">{name}</div>
        <div className="product__price">{formatPrice(priceCents)}</div>
      </div>
      <div className="product__sub">
        <span>{type || ' '}</span>
        <span>{soldOut ? 'Sold out' : `${stockAvailable} pz`}</span>
      </div>
    </Link>
  );
}
