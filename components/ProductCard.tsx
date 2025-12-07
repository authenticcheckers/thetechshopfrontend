import React from 'react';
import { useCart } from '../hooks/useCart';

export default function ProductCard({ product }: any) {
  const { addToCart } = useCart();
  return (
    <div className="bg-neutral-800 p-5 rounded-2xl shadow-lg hover:scale-105 transform transition">
      <img src={product.image} className="rounded-xl w-full h-48 object-cover" />
      <h2 className="text-xl font-semibold mt-3">{product.name}</h2>
      <p className="text-neutral-400 mt-1">{product.description}</p>
      <p className="font-bold mt-2">{product.price} GHS</p>
      <button 
        onClick={() => addToCart(product)} 
        className="mt-3 w-full bg-primary text-black py-2 rounded-lg hover:bg-cyan-400 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
