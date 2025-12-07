import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../utils/api';

export default function Checkout() {
  const { cart } = useCart();
  const total = cart.reduce((acc: number, item: any) => acc + item.price, 0);

  const handleCheckout = async () => {
    const order = await createOrder({ items: cart, total, currency: 'GHS' });
    alert('Order created! Check your email.');
  }

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-5">Checkout</h1>
        <p>Total: {total} GHS</p>
        <button onClick={handleCheckout} className="mt-5 bg-primary text-black py-2 px-5 rounded-lg">Pay Now</button>
      </div>
      <Footer />
    </div>
  );
}
