import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart } from 'react-icons/fa';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  rating?: number; // 0-5
  reviewsCount?: number;
};

export default function ProductCard({ product, onAdd }: { product: Product; onAdd?: (p: Product) => void }) {
  const rating = product.rating ?? 0;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <div className="bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
        <button
          aria-label="wishlist"
          className="absolute top-3 right-3 bg-neutral-900/60 p-2 rounded-full"
          onClick={() => alert('Wishlist placeholder')}
        >
          <FaHeart />
        </button>
      </div>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold hover:underline">{product.name}</h3>
        </Link>

        <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center text-yellow-400">
            {Array.from({ length: full }).map((_, i) => <FaStar key={`f${i}`} />)}
            {half ? <FaStarHalfAlt /> : null}
            {Array.from({ length: Math.max(0, 5 - full - (half ? 1 : 0)) }).map((_, i) => <FaRegStar key={`r${i}`} />)}
          </div>
          <span className="text-sm text-neutral-400">({product.reviewsCount ?? 0})</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xl font-bold">{product.price} GHS</div>
          <div className="flex gap-2">
            <button
              onClick={() => onAdd && onAdd(product)}
              className="bg-primary text-black px-3 py-1 rounded-lg hover:opacity-90"
            >
              Add
            </button>
            <Link href={`/product/${product.id}`}>
              <button className="border border-neutral-700 px-3 py-1 rounded-lg">View</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
