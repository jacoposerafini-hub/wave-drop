import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin, logoutAdmin } from '@/lib/auth';
import { headers } from 'next/headers';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get('x-pathname') || '';
  const isLoginRoute = pathname.includes('/admin/login');
  if (!isLoginRoute && !isAdmin()) redirect('/admin/login');

  async function logout() {
    'use server';
    await logoutAdmin();
    redirect('/admin/login');
  }

  if (isLoginRoute) return <>{children}</>;

  return (
    <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-10">
      <nav className="mb-10 flex flex-wrap items-center gap-4 border-b border-border pb-4 text-xs uppercase tracking-widest">
        <Link href="/admin/drops" className="text-white hover:text-accent">Drops</Link>
        <Link href="/admin/products" className="text-muted hover:text-white">Prodotti</Link>
        <Link href="/admin/orders" className="text-muted hover:text-white">Ordini</Link>
        <Link href="/admin/analytics" className="text-muted hover:text-white">Analytics</Link>
        <form action={logout} className="ml-auto">
          <button className="text-muted hover:text-danger">Logout</button>
        </form>
      </nav>
      {children}
    </div>
  );
}
