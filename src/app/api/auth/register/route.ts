import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, setUserSession } from '@/lib/user-auth';

export const runtime = 'nodejs';

function backTo(req: NextRequest, error?: string) {
  const url = new URL('/account', req.url);
  if (error) url.searchParams.set('error', error);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');

  if (!name || !email || password.length < 8) {
    return backTo(req, 'invalid');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return backTo(req, 'invalid_email');
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return backTo(req, 'email_taken');

  const user = await db.user.create({
    data: { name, email, passwordHash: hashPassword(password) },
  });

  setUserSession(user.id);
  return NextResponse.redirect(new URL('/account', req.url), { status: 303 });
}
