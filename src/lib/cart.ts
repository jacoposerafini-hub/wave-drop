'use server';

import { cookies } from 'next/headers';
import { db } from './db';

const CART_COOKIE = 'wd_cart';
const MAX_ITEMS_PER_VARIANT = 3;
const RESERVE_MINUTES = 10;

export interface CartItem {
  variantId: string;
  qty: number;
  addedAt: number; // epoch ms
}

export async function getCart(): Promise<CartItem[]> {
  const raw = cookies().get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    // remove expired reservations
    const valid = parsed.filter(
      (i) => Date.now() - i.addedAt < RESERVE_MINUTES * 60 * 1000,
    );
    if (valid.length !== parsed.length) await saveCart(valid);
    return valid;
  } catch {
    return [];
  }
}

export async function saveCart(items: CartItem[]) {
  cookies().set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

export async function addToCart(variantId: string, qty = 1) {
  const cart = await getCart();
  const existing = cart.find((i) => i.variantId === variantId);
  const variant = await db.variant.findUnique({ where: { id: variantId } });
  if (!variant) throw new Error('Variante non trovata');
  const available = variant.stock - variant.reserved;
  if (available < qty) throw new Error('Scorte insufficienti');

  if (existing) {
    existing.qty = Math.min(existing.qty + qty, MAX_ITEMS_PER_VARIANT);
    existing.addedAt = Date.now();
  } else {
    cart.push({ variantId, qty: Math.min(qty, MAX_ITEMS_PER_VARIANT), addedAt: Date.now() });
  }
  await saveCart(cart);
  return cart;
}

export async function removeFromCart(variantId: string) {
  const cart = await getCart();
  await saveCart(cart.filter((i) => i.variantId !== variantId));
}

export async function updateQty(variantId: string, qty: number) {
  const cart = await getCart();
  const item = cart.find((i) => i.variantId === variantId);
  if (!item) return;
  if (qty <= 0) return removeFromCart(variantId);
  item.qty = Math.min(qty, MAX_ITEMS_PER_VARIANT);
  item.addedAt = Date.now();
  await saveCart(cart);
}

export async function clearCart() {
  cookies().delete(CART_COOKIE);
}

export async function getCartWithDetails() {
  const cart = await getCart();
  if (cart.length === 0) return { items: [], subtotalCents: 0 };
  const variants = await db.variant.findMany({
    where: { id: { in: cart.map((i) => i.variantId) } },
    include: { product: true },
  });
  const items = cart
    .map((ci) => {
      const v = variants.find((x) => x.id === ci.variantId);
      if (!v) return null;
      return {
        variantId: ci.variantId,
        qty: ci.qty,
        size: v.size,
        product: v.product,
        priceCents: v.product.priceCents,
        lineCents: v.product.priceCents * ci.qty,
        expiresAt: ci.addedAt + RESERVE_MINUTES * 60 * 1000,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  const subtotalCents = items.reduce((s, i) => s + i.lineCents, 0);
  return { items, subtotalCents };
}
