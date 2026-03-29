"use client";
import { useEffect, useState, useCallback } from "react";
import api from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Pencil, Trash2, Loader2, 
  Package, RefreshCw, MoreVertical, AlertCircle, 
  CheckCircle2, XCircle, TrendingDown 
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products/all");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleAdd(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/products/add", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      });
      setShowModal(false);
      setForm({ name: "", description: "", price: "", stock: "" });
      await fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    setLoading(true);
    try {
      await api.delete(`/products/delete/${id}`);
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setLoading(false);
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50/50 p-6 lg:p-10 font-sans">
      
      {/* LOADING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md"
          >
            <div className="relative">
                <Loader2 className="w-14 h-14 text-[#25D366] animate-spin" />
                <Package className="w-6 h-6 text-slate-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 font-black text-slate-900 tracking-tight">جاري تحديث البيانات...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                <Package className="text-[#25D366]" size={28} />
            </div>
            إدارة المنتجات
          </h1>
          <p className="text-slate-500 font-medium mt-1 mr-14">تابع مخزونك، أسعارك ومنتجاتك في مكان واحد.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchProducts}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={20} /> إضافة منتج جديد
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="relative mb-8 group">
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#25D366] transition-colors" size={20} />
        <input
          type="text"
          placeholder="ابحث عن منتج بالاسم..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-[1.5rem] pr-14 pl-6 py-4.5 text-slate-900 font-bold placeholder-slate-400 focus:ring-4 focus:ring-[#25D366]/5 focus:border-[#25D366] outline-none transition-all shadow-sm"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 font-black text-slate-900 text-sm">المنتج</th>
                <th className="p-6 font-black text-slate-900 text-sm">السعر</th>
                <th className="p-6 font-black text-slate-900 text-sm">المخزون</th>
                <th className="p-6 font-black text-slate-900 text-sm">الحالة</th>
                <th className="p-6 font-black text-slate-900 text-sm text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                            <Search size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold text-lg">لا توجد منتجات مطابقة للبحث</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black group-hover:bg-[#25D366]/10 group-hover:text-[#25D366] transition-colors">
                           {p.name[0].toUpperCase()}
                        </div>
                        <div>
                           <p className="font-black text-slate-900">{p.name}</p>
                           <p className="text-xs text-slate-400 font-medium truncate max-w-[150px]">{p.description || "لا يوجد وصف"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="font-black text-slate-900 text-lg">{p.price.toLocaleString()}</span>
                      <span className="text-[10px] font-black text-slate-400 mr-1.5 uppercase">DZD</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 font-mono font-bold text-slate-700">
                        {p.stock}
                      </div>
                    </td>
                    <td className="p-6">
                      <StatusBadge stock={p.stock} />
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
      </div>

      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative z-10 border border-slate-100"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900 mb-2">إضافة منتج جديد</h2>
                <p className="text-slate-500 text-sm font-medium">أدخل تفاصيل المنتج ليتمكن المساعد الذكي من عرضه للعملاء.</p>
              </div>

              <form onSubmit={handleAdd} className="space-y-5 text-right">
                <div className="space-y-1.5">
                    <label className="text-sm font-black text-slate-700 mr-1">اسم المنتج</label>
                    <input
                      required
                      placeholder="مثلاً: قميص قطني عصري"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:bg-white focus:border-[#25D366] transition-all font-bold"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-black text-slate-700 mr-1">الوصف</label>
                    <textarea
                      placeholder="اكتب وصفاً مختصراً للمنتج..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:bg-white focus:border-[#25D366] transition-all font-bold min-h-[100px] resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-black text-slate-700 mr-1">السعر (د.ج)</label>
                        <input
                            required type="number"
                            placeholder="0.00"
                            value={form.price}
                            onChange={e => setForm({ ...form, price: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:bg-white focus:border-[#25D366] transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-black text-slate-700 mr-1">الكمية</label>
                        <input
                            required type="number"
                            placeholder="0"
                            value={form.stock}
                            onChange={e => setForm({ ...form, stock: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:bg-white focus:border-[#25D366] transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    disabled={loading}
                    className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all disabled:opacity-50"
                  >
                    {loading ? "جاري الحفظ..." : "حفظ المنتج"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-8 py-4 text-slate-500 hover:bg-slate-50 rounded-2xl font-black transition-all"
                  >
                    إلغاء
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

function StatusBadge({ stock }) {
  if (stock === 0) return (
    <span className="flex items-center gap-1.5 w-fit bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
        <XCircle size={12} /> نفذت الكمية
    </span>
  );
  if (stock < 5) return (
    <span className="flex items-center gap-1.5 w-fit bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-orange-100">
        <TrendingDown size={12} /> مخزون منخفض
    </span>
  );
  return (
    <span className="flex items-center gap-1.5 w-fit bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100">
        <CheckCircle2 size={12} /> متوفر
    </span>
  );
}