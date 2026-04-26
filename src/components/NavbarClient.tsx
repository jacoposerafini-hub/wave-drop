'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Shop', key: 'shop' },
  { href: '/archive', label: 'Archivio', key: 'archive' },
  { href: '/about', label: 'About', key: 'about' },
  { href: '/contact', label: 'Contatti', key: 'contact' },
];

export default function NavbarClient({ cartCount }: { cartCount: number }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="nav">
      <div className="container nav__inner">
        <div className="nav__logo">
          <Link href="/">
            WAVE<b>/</b>DROP
          </Link>
        </div>
        <nav className="nav__links">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={isActive(n.href) ? 'active' : ''}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="nav__right">
          <span className="chip live hide-sm">Drop 007 · Live</span>
          <Link href="/account" className="nav__cart" aria-label="Account">
            <User size={18} />
          </Link>
          <a href="#cart" className="nav__cart" aria-label="Carrello">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="nav__cart-count">{cartCount}</span>}
          </a>
        </div>
      </div>
    </header>
  );
}
