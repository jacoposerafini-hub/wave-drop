import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setUserSession, verifyPassword } from '@/lib/user-auth';

export const runtime = 'nodejs';

function backTo(req: NextRequest, error?: string) {
  const url = new URL('/account', req.url);
  if (error) url.searchParams.set('error', error);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');

  if (!email || !password) return backTo(req, 'invalid');

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return backTo(req, 'bad_credentials');
  }

  setUserSession(user.id);
  return NextResponse.redirect(new URL('/account', req.url), { status: 303 });
}
