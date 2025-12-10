import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../utils/api";
import { useCart } from "../hooks/useCart";
import { Product } from "../types/Product";
import { CartItem } from "../types/CartItem";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]));
  }, []);

  const handleAddToCart = (p: Product) => {
    const item: CartItem = {
      id: p.id,
      name: p.name,
      description: p.description,
      specs: p.specs ?? undefined,
      price: Number(p.price),
      stock: p.stock ? Number(p.stock) : undefined,
      image: p.image_url,
      quantity: 1,
    };
    addToCart(item);
  };

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          The Tech Shop
        </h1>

        <ProductGrid products={products} onAdd={handleAddToCart} />
      </main>
      <Footer />
    </div>
  );
}
