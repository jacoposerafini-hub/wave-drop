'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { addToCart, removeFromCart, updateQty } from '@/lib/cart';

const emailSchema = z.string().email();

export async function notifySignup(email: string, dropId?: string) {
  const parse = emailSchema.safeParse(email);
  if (!parse.success) return { ok: false as const, error: 'Email non valida' };
  try {
    await db.notifySignup.upsert({
      where: { email_dropId: { email: parse.data, dropId: dropId ?? null } } as any,
      create: { email: parse.data, dropId: dropId ?? null },
      update: {},
    });
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: 'Riprova tra un attimo' };
  }
}

export async function addToCartAction(variantId: string, qty = 1) {
  try {
    await addToCart(variantId, qty);
    revalidatePath('/');
    revalidatePath('/cart');
    return { ok: true as const };
  } catch (e: any) {
    return { ok: false as const, error: e.message ?? 'Errore' };
  }
}

export async function removeFromCartAction(variantId: string) {
  await removeFromCart(variantId);
  revalidatePath('/cart');
  return { ok: true };
}

export async function updateQtyAction(variantId: string, qty: number) {
  await updateQty(variantId, qty);
  revalidatePath('/cart');
  return { ok: true };
}

export async function verifyDropPassword(slug: string, password: string): Promise<boolean> {
  const drop = await db.drop.findUnique({ where: { slug } });
  if (!drop || !drop.password) return false;
  if (drop.password !== password) return false;
  cookies().set(`wd_drop_${slug}`, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 3,
    path: '/',
  });
  revalidatePath('/');
  return true;
}
