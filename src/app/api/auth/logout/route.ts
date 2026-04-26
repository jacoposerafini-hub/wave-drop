import { NextRequest, NextResponse } from 'next/server';
import { clearUserSession } from '@/lib/user-auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  clearUserSession();
  return NextResponse.redirect(new URL('/account', req.url), { status: 303 });
}
