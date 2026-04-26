import { cookies } from 'next/headers';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { db } from './db';

const COOKIE = 'wd_user';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  return process.env.SESSION_SECRET || 'dev-secret-change-me';
}

function sign(value: string): string {
  return createHmac('sha256', secret()).update(value).digest('hex');
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (test.length !== expected.length) return false;
  return timingSafeEqual(test, expected);
}

export function setUserSession(userId: string) {
  const ts = Date.now().toString();
  const payload = `${userId}.${ts}`;
  const token = `${payload}.${sign(payload)}`;
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export function clearUserSession() {
  cookies().delete(COOKIE);
}

export function getUserId(): string | null {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, ts, sig] = parts;
  const expected = sign(`${userId}.${ts}`);
  if (expected !== sig) return null;
  if (Date.now() - Number(ts) > MAX_AGE * 1000) return null;
  return userId;
}

export async function getCurrentUser() {
  const id = getUserId();
  if (!id) return null;
  return db.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, createdAt: true },
  });
}
