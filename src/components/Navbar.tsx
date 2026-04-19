import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { getCart } from '@/lib/cart';

export default async function Navbar() {
  const cart = await getCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-5 md:px-10">
        <Link href="/" className="font-display text-2xl tracking-tight hover:text-accent transition-colors">
          WAVE
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-muted">
          <Link href="/" className="hover:text-white transition-colors">Shop</Link>
          <Link href="/archive" className="hover:text-white transition-colors">Archive</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>

        <Link
          href="/cart"
          aria-label="Carrello"
          className="relative flex h-10 w-10 items-center justify-center text-white hover:text-accent transition-colors"
        >
          <ShoppingBag size={18} />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-black">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
