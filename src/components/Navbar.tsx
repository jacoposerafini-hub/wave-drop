import { getCart } from '@/lib/cart';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  const cart = await getCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return <NavbarClient cartCount={count} />;
}
