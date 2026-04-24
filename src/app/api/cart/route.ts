import { NextResponse } from 'next/server';
import { getCartWithDetails } from '@/lib/cart';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getCartWithDetails();
  const safeItems = data.items.map((i) => ({
    variantId: i.variantId,
    qty: i.qty,
    size: i.size,
    priceCents: i.priceCents,
    lineCents: i.lineCents,
    expiresAt: i.expiresAt,
    product: {
      name: i.product.name,
      slug: i.product.slug,
      images: i.product.images,
    },
  }));
  return NextResponse.json({ items: safeItems, subtotalCents: data.subtotalCents });
}
