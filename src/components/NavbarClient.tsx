'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Shop' },
  { href: '/archive', label: 'Archive' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function NavbarClient({ cartCount }: { cartCount: number }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b transition-all duration-300 ease-smooth',
          scrolled
            ? 'border-border bg-bg-primary/85 backdrop-blur-xl'
            : 'border-transparent bg-transparent',
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-[1600px] items-center justify-between px-5 transition-all duration-300 ease-smooth md:px-10',
            scrolled ? 'h-14' : 'h-16',
          )}
        >
          <Link
            href="/"
            className="group flex items-center gap-2 font-display text-2xl tracking-tight"
          >
            <span className="h-2 w-2 animate-glow-pulse rounded-full bg-accent shadow-glow-soft" />
            <span className="transition-colors group-hover:text-accent">WAVE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest">
            {NAV.map((n) => {
              const active =
                n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    'link-underline transition-colors',
                    active ? 'text-white' : 'text-muted hover:text-white',
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/cart"
              aria-label="Carrello"
              className="relative flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-accent"
            >
              <ShoppingBag size={18} strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-black shadow-glow-soft">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label={open ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center text-white md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-30 md:hidden transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-xl" />
        <nav
          className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center gap-2 px-8"
          onClick={(e) => e.stopPropagation()}
        >
          {NAV.map((n, i) => {
            const active =
              n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                style={{
                  transitionDelay: open ? `${i * 60}ms` : '0ms',
                }}
                className={cn(
                  'display text-6xl transition-all duration-500 ease-smooth',
                  open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0',
                  active ? 'text-accent' : 'text-white hover:text-accent',
                )}
              >
                {n.label}
              </Link>
            );
          })}
          <div
            className={cn(
              'mt-10 flex items-center gap-4 text-xs uppercase tracking-widest text-muted transition-opacity duration-500',
              open ? 'opacity-100' : 'opacity-0',
            )}
          >
            <span className="h-2 w-2 animate-glow-pulse rounded-full bg-accent" />
            Lucca after dark
          </div>
        </nav>
      </div>
    </>
  );
}
