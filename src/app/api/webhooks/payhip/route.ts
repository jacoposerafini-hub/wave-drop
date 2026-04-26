import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sharedSecret = process.env.PAYHIP_WEBHOOK_SECRET;
  const provided = req.headers.get('x-payhip-signature') ?? req.nextUrl.searchParams.get('secret');

  if (sharedSecret && provided !== sharedSecret) {
    return NextResponse.json({ ok: false, error: 'invalid secret' }, { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  // Payhip "paid" webhook payload contains product link or ID; match it back to our Variant.
  const productId: string | undefined =
    payload?.product_id || payload?.product?.id || payload?.link;
  const quantity = Number(payload?.quantity ?? payload?.qty ?? 1);

  if (!productId) {
    return NextResponse.json({ ok: true, ignored: 'no productId' });
  }

  try {
    const variants = await db.variant.findMany({
      where: { checkoutUrl: { contains: String(productId) } },
    });
    for (const v of variants) {
      await db.variant.update({
        where: { id: v.id },
        data: { stock: { decrement: quantity } },
      });
    }
    return NextResponse.json({ ok: true, updated: variants.length });
  } catch (e) {
    console.error('Payhip webhook error', e);
    return NextResponse.json({ ok: false, error: 'processing failed' }, { status: 500 });
  }
}
