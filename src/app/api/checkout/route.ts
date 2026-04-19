import { NextResponse } from 'next/server';
import { getCartWithDetails, clearCart } from '@/lib/cart';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { generateOrderNumber } from '@/lib/utils';

export async function POST() {
  const { items, subtotalCents } = await getCartWithDetails();
  if (items.length === 0) return NextResponse.redirect(new URL('/cart', process.env.NEXT_PUBLIC_SITE_URL!));

  const shipping = subtotalCents >= 10000 ? 0 : 700;
  const orderNumber = generateOrderNumber();

  const order = await db.order.create({
    data: {
      orderNumber,
      email: 'pending@wavedrop.it',
      phone: '',
      shippingName: '',
      shippingAddr: {},
      subtotalCents,
      shippingCents: shipping,
      totalCents: subtotalCents + shipping,
      status: 'pending',
      items: {
        create: items.map((i) => ({
          variantId: i.variantId,
          qty: i.qty,
          priceCents: i.priceCents,
          nameSnap: i.product.name,
          sizeSnap: i.size,
        })),
      },
    },
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'klarna'],
      line_items: [
        ...items.map((i) => ({
          price_data: {
            currency: 'eur',
            product_data: { name: `${i.product.name} · ${i.size}` },
            unit_amount: i.priceCents,
          },
          quantity: i.qty,
        })),
        ...(shipping > 0
          ? [
              {
                price_data: {
                  currency: 'eur' as const,
                  product_data: { name: 'Spedizione' },
                  unit_amount: shipping,
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      shipping_address_collection: { allowed_countries: ['IT'] },
      customer_creation: 'always',
      metadata: { orderId: order.id, orderNumber },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}?paid=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    });

    await db.order.update({ where: { id: order.id }, data: { stripeId: session.id } });
    await clearCart();
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL('/cart?error=1', process.env.NEXT_PUBLIC_SITE_URL!));
  }
}
