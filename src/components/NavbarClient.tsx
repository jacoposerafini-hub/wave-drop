'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShoppingBag, User, Menu, X } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Shop', key: 'shop' },
  { href: '/archive', label: 'Archivio', key: 'archive' },
  { href: '/about', label: 'About', key: 'about' },
  { href: '/contact', label: 'Contatti', key: 'contact' },
];

export default function NavbarClient({ cartCount }: { cartCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
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
          <Link
            href="/account"
            className="nav__cart hide-sm-only"
            aria-label="Account"
          >
            <User size={18} />
          </Link>
          <a href="#cart" className="nav__cart" aria-label="Carrello">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="nav__cart-count">{cartCount}</span>}
          </a>
          <button
            type="button"
            className="nav__burger"
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      </header>

      {open && (
        <div
          className="nav__mobile"
          role="dialog"
          aria-label="Menu mobile"
        >
          <nav className="nav__mobile-links">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={isActive(n.href) ? 'active' : ''}
              >
                {n.label}
              </Link>
            ))}
            <Link href="/account" className={isActive('/account') ? 'active' : ''}>
              Account
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
