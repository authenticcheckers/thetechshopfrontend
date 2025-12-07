import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div className="bg-neutral-900 text-white min-h-screen">
      <Navbar />
      <h1 className="text-5xl font-bold text-center py-10">The Tech Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 p-10">
        {products.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
      <Footer />
    </div>
  );
}
