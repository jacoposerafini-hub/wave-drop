import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE = 'wd_admin';
const MAX_AGE = 60 * 60 * 24 * 7;

function sign(value: string): string {
  const secret = process.env.SESSION_SECRET || 'dev-secret-change-me';
  return createHmac('sha256', secret).update(value).digest('hex');
}

export async function loginAdmin(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  const token = `${Date.now()}.${sign(String(Date.now()))}`;
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
    path: '/',
  });
  return true;
}

export function isAdmin(): boolean {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return false;
  const [ts, sig] = token.split('.');
  if (!ts || !sig) return false;
  const expected = sign(ts);
  return expected === sig && Date.now() - Number(ts) < MAX_AGE * 1000;
}

export async function logoutAdmin() {
  cookies().delete(COOKIE);
}
