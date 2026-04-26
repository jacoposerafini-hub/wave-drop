import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Forward pathname to server components via header so admin layout
  // can detect /admin/login and skip its auth check (avoids loop).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('wd_admin')?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: ['/admin/:path*'] };
