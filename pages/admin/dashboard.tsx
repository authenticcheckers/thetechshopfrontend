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

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products/list");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch products failed:", err);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, imageFile: e.target.files[0] });
    }
  };

  // Upload image to Cloudinary via API
  const uploadImage = async (): Promise<string> => {
    if (!form.imageFile) {
      throw new Error("No image selected");
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", form.imageFile);

    try {
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData, // ✅ use the instance, not the class
      });

      const text = await res.text(); // Read body once
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server returned invalid JSON: ${text}`);
      }

      if (!res.ok) throw new Error(data?.error || "Upload failed");
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit (add or update product)
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
      console.error("Product save failed:", err);
      alert(`Product save failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Handle edit
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

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await axios.delete("/api/products/delete", { data: { id } });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded mb-8 space-y-4">
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

        <button disabled={uploading} className="bg-blue-600 p-2 rounded w-full">
          {uploading ? "Uploading..." : form.id ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-gray-800 p-4 rounded space-y-2">
            <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover rounded" />
            <h2 className="text-lg font-bold">{p.name}</h2>
            <p>{p.description}</p>
            <p>Price: ${p.price}</p>
            <p>Stock: {p.stock}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="bg-yellow-500 p-1 rounded flex-1">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="bg-red-600 p-1 rounded flex-1">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
