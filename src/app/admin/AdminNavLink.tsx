'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={'admin-nav__link' + (active ? ' active' : '')}
    >
      {label}
    </Link>
  );
}
