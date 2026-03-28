"use client";
import { useEffect, useState, useCallback } from "react";
import api from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Upload, Search, Pencil, Trash2, Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // Global loading state
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });

  // UseCallback prevents unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products/all");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      // Small delay so the user actually sees the transition (optional)
      setTimeout(() => setLoading(false), 300);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleAdd(e) {
    e.preventDefault();
    setLoading(true); // Start loading during the save operation
    try {
      await api.post("/products/add", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      });
      setShowModal(false);
      setForm({ name: "", description: "", price: "", stock: "" });
      await fetchProducts(); // Re-fetch fresh data from DB
    } catch (error) {
      console.error("Error adding product:", error);
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await api.delete(`/products/delete/${id}`);
      await fetchProducts(); // Re-fetch fresh data from DB
    } catch (error) {
      console.error("Error deleting product:", error);
      setLoading(false);
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen space-y-6 p-4">
      
      {/* GLOBAL LOADING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm"
          >
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="mt-2 font-medium text-blue-600">Syncing database...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black flex items-center gap-2">
            📦 Products
          </h1>
          <p className="text-gray-600 text-sm mt-1">Manage your products efficiently</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchProducts} // Manual refresh button
            className="px-4 py-2 rounded-xl border font-medium hover:bg-gray-100 flex items-center gap-2"
          >
            Refresh Data
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border rounded-xl pl-10 pr-4 py-3 text-black focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold text-black">Name</th>
              <th className="text-left p-4 font-semibold text-black">Price</th>
              <th className="text-left p-4 font-semibold text-black">Stock</th>
              <th className="text-left p-4 font-semibold text-black">Status</th>
              <th className="text-right p-4 font-semibold text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-10 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p._id} className="border-b hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-black">{p.name}</td>
                  <td className="p-4 font-bold text-blue-600">{p.price.toLocaleString()} DZD</td>
                  <td className="p-4 text-black font-mono">{p.stock}</td>
                  <td className="p-4">
                    <Status stock={p.stock} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition">
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (Same logic as before, just kept for completeness) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl"
            >
              <h2 className="text-xl font-bold mb-6 text-black">Add New Product</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <input
                  required
                  placeholder="Product name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border px-4 py-2 rounded-lg outline-none focus:border-blue-500"
                />
                <input
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border px-4 py-2 rounded-lg outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="number"
                    placeholder="Price (DZD)"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full border px-4 py-2 rounded-lg outline-none focus:border-blue-500"
                  />
                  <input
                    required
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full border px-4 py-2 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Status({ stock }) {
  if (stock === 0) return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Out of stock</span>;
  if (stock < 5) return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Low stock</span>;
  return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">In stock</span>;
}