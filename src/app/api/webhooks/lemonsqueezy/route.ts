import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(signature, 'hex');
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get('x-signature');

  if (!verifySignature(raw, signature)) {
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const eventName = payload?.meta?.event_name as string | undefined;

  // Only act on completed orders
  if (eventName !== 'order_created' && eventName !== 'order_paid') {
    return NextResponse.json({ ok: true, ignored: eventName });
  }

  try {
    const order = payload?.data?.attributes;
    const checkoutUrl: string | undefined = order?.urls?.receipt; // not the buy url
    // Buy URL is on first_order_item or product? Easier: variant_id provided
    const items: any[] = order?.first_order_item ? [order.first_order_item] : [];

    // Match our DB Variant by lemonSqueezyUrl containing the variant identifier
    // LS provides variant_id and product_id; we stored full URL like https://STORE/buy/UUID
    // So we look up by URL contains variant_id or similar token.
    for (const it of items) {
      const variantId = String(it?.variant_id ?? '');
      if (!variantId) continue;
      // Match via URL containing the LS UUID
      const matches = await db.variant.findMany({
        where: {
          lemonSqueezyUrl: { contains: variantId },
        },
      });
      for (const m of matches) {
        const qty = Number(it?.quantity ?? 1);
        await db.variant.update({
          where: { id: m.id },
          data: { stock: { decrement: qty } },
        });
      }
    }

    // TODO: persist Order/OrderItem in our DB if you want a unified order view
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('LS webhook error', e);
    return NextResponse.json({ ok: false, error: 'processing failed' }, { status: 500 });
  }
}
