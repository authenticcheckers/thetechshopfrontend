import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getProductById } from "../../utils/api";
import { useCart } from "../../hooks/useCart";
import { Product } from "../../types/Product";
import { CartItem } from "../../types/CartItem";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      getProductById(id as string).then((data) => setProduct(data));
    }
  }, [id]);

  if (!product)
    return <p className="text-center mt-10 text-white">Loading...</p>;

  const handleAdd = () => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      description: product.description,
      specs: product.specs ?? undefined,
      price: Number(product.price),
      stock: product.stock ? Number(product.stock) : undefined,
      image: product.image_url,
      quantity: 1,
    };
    addToCart(item);
  };

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      <Navbar />
      <div className="p-10 flex flex-col md:flex-row gap-10">
        <img
          src={product.image_url}
          className="w-full md:w-1/2 h-96 object-cover rounded-xl"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
          <p className="text-neutral-400 mb-3">{product.description}</p>
          <p className="text-lg font-semibold mb-3">{product.price} GHS</p>
          <h2 className="text-xl font-bold mb-2">Specs:</h2>
          <p className="text-neutral-300 mb-5">
            {product.specs ?? "Specs not available"}
          </p>
          <button
            onClick={handleAdd}
            className="bg-primary text-black py-2 px-5 rounded-lg hover:bg-cyan-400 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
