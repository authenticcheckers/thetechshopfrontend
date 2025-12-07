import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  return (
    <nav className="flex justify-between items-center p-5 bg-secondary">
      <Link href="/"><h1 className="text-2xl font-bold text-primary">The Tech Shop</h1></Link>
      <div className="flex gap-5 items-center">
        <Link href="/cart" className="relative">
          Cart ({cart.length})
        </Link>
        <Link href="/account">Account</Link>
      </div>
    </nav>
  );
}
