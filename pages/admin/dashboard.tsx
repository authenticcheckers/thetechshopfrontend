import { useEffect, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    const res = await axios.get("/api/products/list");
    setProducts(res.data.products);
  };

  useEffect(() => { fetchProducts(); }, []);

  // Dropzone for image
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 });

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Start editing
  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setPreview(product.image_url);
    setImage(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingProduct(null);
    setForm({ name: "", description: "", price: "", stock: "" });
    setImage(null);
    setPreview(null);
  };

  // Delete product
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await axios.delete("/api/products/delete", { data: { id } });
    fetchProducts();
  };

  // Submit form (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Name and price are required");

    setUploading(true);
    let imageUrl = preview; // default to existing preview

    // Upload image if a new one is selected
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      await new Promise<void>((resolve) => {
        reader.onloadend = async () => {
          const imgRes = await axios.post("/api/upload-image", { image: reader.result });
          imageUrl = imgRes.data.url;
          resolve();
        };
      });
    }

    try {
      if (editingProduct) {
        // Update existing product
        await axios.put("/api/products/update", {
          id: editingProduct.id,
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          image_url: imageUrl,
        });
        alert("Product updated successfully!");
      } else {
        // Add new product
        await axios.post("/api/products/add", {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          image_url: imageUrl,
        });
        alert("Product added successfully!");
      }
      cancelEdit();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      {/* Product Form */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 w-full rounded"/>
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full rounded"/>
          <input name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 w-full rounded"/>
          <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} className="border p-2 w-full rounded"/>
          
          <div {...getRootProps()} className="border-2 border-dashed border-gray-500 p-4 rounded cursor-pointer text-center hover:border-blue-500 transition">
            <input {...getInputProps()} />
            {preview ? <img src={preview} className="mx-auto h-40 object-contain" /> : <p>Drag & drop image here, or click to select</p>}
          </div>

          <div className="flex space-x-2">
            <button type="submit" disabled={uploading} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">
              {uploading ? "Uploading..." : editingProduct ? "Update Product" : "Add Product"}
            </button>
            {editingProduct && <button type="button" onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>}
          </div>
        </form>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-gray-800 p-4 rounded shadow hover:scale-105 transition-transform">
            <img src={p.image_url} alt={p.name} className="w-full h-48 object-cover rounded mb-2"/>
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-300">{p.description}</p>
            <p className="mt-2 font-bold">${p.price}</p>
            <p>Stock: {p.stock}</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => startEdit(p)} className="bg-yellow-500 hover:bg-yellow-400 px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
