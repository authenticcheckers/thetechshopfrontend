// pages/admin/dashboard.tsx
import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
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
  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    description: "",
    price: "",
    stock: "",
    imageFile: null as File | null,
  });
  const [uploading, setUploading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get("/api/products/list");
      setProducts(res.data.products);
      setLoadingProducts(false);
    } catch (err) {
      console.error("Fetch products failed:", err);
      setLoadingProducts(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await axios.get("/api/orders/list");
      setOrders(res.data.orders);
      setLoadingOrders(false);
    } catch (err) {
      console.error("Fetch orders failed:", err);
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, imageFile: e.target.files[0] });
    }
  };

  // Upload image to Cloudinary
  const uploadImage = async (): Promise<string> => {
    if (!form.imageFile) throw new Error("No image selected");
    setUploading(true);
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(form.imageFile as File);
      reader.onloadend = async () => {
        try {
          const res = await axios.post("/api/upload-image", { image: reader.result });
          setUploading(false);
          resolve(res.data.url);
        } catch (err) {
          setUploading(false);
          reject(err);
        }
      };
    });
  };

  // Add or Edit Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.imageFile) {
      alert("Please fill all fields and select an image.");
      return;
    }
    try {
      const imageUrl = await uploadImage();
      if (form.id) {
        // Update product
        await axios.put("/api/products/update", {
          id: form.id,
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          image_url: imageUrl,
        });
      } else {
        // Add product
        await axios.post("/api/products/add", {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          image_url: imageUrl,
        });
      }
      setForm({ id: null, name: "", description: "", price: "", stock: "", imageFile: null });
      fetchProducts();
    } catch (err) {
      console.error("Submit product failed:", err);
      alert("Failed to add/update product. Check console for details.");
    }
  };

  // Delete Product
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete("/api/products/delete", { data: { id } });
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product.");
    }
  };

  // Edit Product
  const handleEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageFile: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded mb-8 flex flex-col space-y-4">
        <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="p-2 rounded bg-gray-700"/>
        <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="p-2 rounded bg-gray-700"/>
        <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="p-2 rounded bg-gray-700"/>
        <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="p-2 rounded bg-gray-700"/>
        <input type="file" accept="image/*" onChange={handleFileChange} className="p-2 rounded bg-gray-700"/>
        <button type="submit" disabled={uploading} className="bg-blue-600 p-2 rounded hover:bg-blue-700">
          {uploading ? "Uploading..." : form.id ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Products List */}
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      {loadingProducts ? <p>Loading products...</p> :
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map(p => (
          <div key={p.id} className="bg-gray-800 p-4 rounded shadow relative">
            <img src={p.image_url} alt={p.name} className="w-full h-48 object-cover rounded mb-2"/>
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className="text-gray-300">{p.description}</p>
            <p className="mt-2 font-bold">${p.price}</p>
            <p>Stock: {p.stock}</p>
            <div className="flex mt-2 space-x-2">
              <button onClick={() => handleEdit(p)} className="bg-yellow-600 px-2 rounded hover:bg-yellow-700">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="bg-red-600 px-2 rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>}

      {/* Orders List */}
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      {loadingOrders ? <p>Loading orders...</p> :
      <div className="bg-gray-800 p-4 rounded">
        {orders.length === 0 ? <p>No orders yet.</p> :
        <table className="w-full text-white table-auto">
          <thead>
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-2 border">{o.id}</td>
                <td className="p-2 border">{o.customer_name}</td>
                <td className="p-2 border">${o.total_price}</td>
                <td className="p-2 border">{o.status}</td>
                <td className="p-2 border">{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </div>
  );
}
