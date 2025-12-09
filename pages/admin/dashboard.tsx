import React, { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  specs: string;
  price: number;
  stock: number;
  image_url: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    description: "",
    specs: "",
    price: "",
    stock: "",
    imageFile: null as File | null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products/list");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch products failed:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, imageFile: e.target.files[0] });
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!form.imageFile) throw new Error("No image selected");

    setUploading(true);
    const formData = new FormData();
    formData.append("image", form.imageFile);

    try {
      const res = await fetch("/api/products/upload", { method: "POST", body: formData });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned invalid JSON: ${await res.text()}`);
      }
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.imageFile) {
      alert("Fill all fields and select an image");
      return;
    }

    try {
      const imageUrl = await uploadImage();

      const payload = {
        id: form.id,
        name: form.name,
        description: form.description,
        specs: form.specs,
        price: Number(form.price),
        stock: Number(form.stock),
        image_url: imageUrl,
      };

      if (form.id) {
        await axios.put("/api/products/update", payload);
      } else {
        await axios.post("/api/products/add", payload);
      }

      setForm({ id: null, name: "", description: "", specs: "", price: "", stock: "", imageFile: null });
      fetchProducts();
    } catch (err: unknown) {
      console.error("Submit failed:", err);
      alert(`Product save failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded mb-8 space-y-4">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="p-2 bg-gray-700 rounded w-full" />
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="p-2 bg-gray-700 rounded w-full" />
        <textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} placeholder="Specs" rows={3} className="p-2 bg-gray-700 rounded w-full" />
        <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" className="p-2 bg-gray-700 rounded w-full" />
        <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" className="p-2 bg-gray-700 rounded w-full" />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button disabled={uploading} className="bg-blue-600 p-2 rounded w-full">{uploading ? "Uploading..." : form.id ? "Update Product" : "Add Product"}</button>
      </form>
    </div>
  );
}
