import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { LogOut } from 'lucide-react';
import { isAdmin, logoutAdmin } from '@/lib/auth';
import AdminNavLink from './AdminNavLink';

const NAV = [
  { href: '/admin/drops', label: 'Drops' },
  { href: '/admin/products', label: 'Prodotti' },
  { href: '/admin/orders', label: 'Ordini' },
  { href: '/admin/analytics', label: 'Analytics' },
];

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
    <main className="page-enter admin-shell">
      <nav className="admin-nav">
        {NAV.map((n) => (
          <AdminNavLink key={n.href} href={n.href} label={n.label} />
        ))}
        <form action={logout} className="admin-nav__logout-form" style={{ marginLeft: 'auto' }}>
          <button type="submit" className="admin-nav__logout">
            <LogOut size={14} style={{ marginRight: 4 }} />
            Logout
          </button>
        </form>
      </nav>
      {children}
    </main>
  );
}
