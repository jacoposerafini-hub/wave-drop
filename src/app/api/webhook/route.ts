import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new NextResponse('Missing signature', { status: 400 });

  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const addr = session.shipping_details?.address ?? session.customer_details?.address ?? {};
      const name = session.shipping_details?.name ?? session.customer_details?.name ?? '';
      await db.order.update({
        where: { id: orderId },
        data: {
          status: 'paid',
          email: session.customer_details?.email ?? 'unknown@wavedrop.it',
          phone: session.customer_details?.phone ?? '',
          shippingName: name,
          shippingAddr: addr,
        },
      });
      // Decrement stock on each item
      const items = await db.orderItem.findMany({ where: { orderId } });
      await Promise.all(
        items.map((it) =>
          db.variant.update({ where: { id: it.variantId }, data: { stock: { decrement: it.qty } } }),
        ),
      );
    }
  }

  return NextResponse.json({ received: true });
}
