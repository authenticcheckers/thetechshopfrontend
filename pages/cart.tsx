import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CartPage() {
  const { cart } = useCart();
  const total = cart.reduce((acc: number, item: any) => acc + item.price, 0);

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-5">Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map(item => <CartItem key={item.id} item={item} />)}
            <p className="mt-5 text-xl font-bold">Total: {total} GHS</p>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
