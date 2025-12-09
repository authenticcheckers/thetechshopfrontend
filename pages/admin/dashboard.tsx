// pages/admin/dashboard.tsx
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

interface Order {
  id: number;
  customer_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    description: "",
    specs: "",
    price: "",
    stock: "",
    imageFile: null as File | null,
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get("/api/products/list");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch products failed:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await axios.get("/api/orders/list");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Fetch orders failed:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, imageFile: e.target.files[0] });
    }
  };

  // Upload image to Cloudinary via API route
  const uploadImage = async (): Promise<string> => {
    if (!form.imageFile) throw new Error("No image selected");

    setUploading(true);
    const formData = new FormData();
    formData.append("image", form.imageFile);

    try {
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Upload failed");
      }

      const data = await res.json();
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  // Handle Add / Edit Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock || !form.imageFile) {
      alert("Fill all fields and select an image");
      return;
    }

    try {
      const imageUrl = await uploadImage();

      if (form.id) {
        await axios.put("/api/products/update", {
          id: form.id,
          name: form.name,
          description: form.description,
          specs: form.specs,
          price: Number(form.price),
          stock: Number(form.stock),
          image_url: imageUrl,
        });
      } else {
        await axios.post("/api/products/add", {
          name: form.name,
          description: form.description,
          specs: form.specs,
          price: Number(form.price),
          stock: Number(form.stock),
          image_url: imageUrl,
        });
      }

      // Reset form
      setForm({
        id: null,
        name: "",
        description: "",
        specs: "",
        price: "",
        stock: "",
        imageFile: null,
      });

      fetchProducts();
    } catch (err: any) {
      console.error("Submit failed:", err);
      alert(`Product save failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await axios.delete("/api/products/delete", { data: { id } });
    fetchProducts();
  };

  const handleEdit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      specs: p.specs || "",
      price: p.price.toString(),
      stock: p.stock.toString(),
      imageFile: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded mb-8 space-y-4"
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="p-2 bg-gray-700 rounded w-full"
        />

        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="p-2 bg-gray-700 rounded w-full"
        />

        <textarea
          value={form.specs}
          onChange={(e) => setForm({ ...form, specs: e.target.value })}
          placeholder="Specs (CPU, RAM, Storage, etc)"
          rows={3}
          className="p-2 bg-gray-700 rounded w-full"
        />

        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price"
          className="p-2 bg-gray-700 rounded w-full"
        />

        <input
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          placeholder="Stock"
          className="p-2 bg-gray-700 rounded w-full"
        />

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button
          disabled={uploading}
          className="bg-blue-600 p-2 rounded w-full"
        >
          {uploading
            ? "Uploading..."
            : form.id
            ? "Update Product"
            : "Add Product"}
        </button>
      </form>

      {/* Optionally render products and edit/delete UI here */}
    </div>
  );
}
