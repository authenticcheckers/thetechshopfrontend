import { useRouter } from "next/router";
import { Product } from "../types/Product";

export default function ProductGrid({ products, onAdd }: any) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product: any) => (
        <div
          key={product.id}
          className="bg-gray-800 p-4 rounded cursor-pointer hover:scale-105 transition"
          onClick={() => router.push(`/product/${product.id}`)}
        >
          <img
            src={product.image_url || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-64 object-cover rounded mb-2"
          />
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p className="text-gray-300 text-sm mb-1">{product.description}</p>
          <p className="text-gray-400 text-sm">{product.specs || "Specs not available"}</p>
          <p className="text-green-400 font-semibold">{product.price} GHS</p>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            className="bg-blue-600 p-2 mt-2 rounded w-full"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
