import React from "react";
import { Product } from "../types/Product";

interface Props {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function ProductGrid({ products, onAdd }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(p => (
        <div
          key={p.id}
          className="bg-gray-800 p-4 rounded-lg flex flex-col items-center"
        >
          <img
            src={p.image_url}
            alt={p.name}
            className="w-full h-48 object-cover rounded"
          />
          <h2 className="mt-2 text-lg font-bold">{p.name}</h2>
          <p className="text-sm text-gray-400">{p.specs}</p>
          <p className="text-white font-semibold mt-1">{p.price} GHS</p>
          <button
            onClick={() => onAdd(p)}
            className="mt-3 bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
