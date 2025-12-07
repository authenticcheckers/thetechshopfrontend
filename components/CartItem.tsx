import React from 'react';
import { useCart } from '../hooks/useCart'; // Correct import

export default function CartItem({ item }: any) {
  const { removeFromCart } = useCart();
  return (
    <div className="flex justify-between items-center bg-neutral-800 p-3 rounded-lg mb-2">
      <span>{item.name}</span>
      <span>{item.price} GHS</span>
      <button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button>
    </div>
  );
}
