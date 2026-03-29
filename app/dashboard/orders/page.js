"use client";
import { useEffect, useState, useCallback } from "react";
import api from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  RefreshCcw, 
  Loader2, 
  Globe,
  ChevronDown,
  User,
  Package2
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } catch (err) {
      console.error("Order fetch error:", err);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function updateStatus(id, status) {
    setLoading(true); 
    try {
      await api.put(`/orders/status/${id}`, { status });
      await fetchOrders(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  const getStatusStyles = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      confirmed: "bg-blue-50 text-blue-600 border-blue-100",
      shipped: "bg-purple-50 text-purple-600 border-purple-100",
      delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
      cancelled: "bg-rose-50 text-rose-600 border-rose-100"
    };
    return styles[status] || "bg-slate-50 text-slate-600 border-slate-100";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "قيد الانتظار",
      confirmed: "تم التأكيد",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي"
    };
    return labels[status] || status;
  };

  return (
    <div dir="rtl" className="min-h-screen p-6 lg:p-10 space-y-8 bg-slate-50/50">
      
      {/* LOADING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md"
          >
            <Loader2 className="w-14 h-14 text-[#25D366] animate-spin" />
            <p className="mt-4 font-black text-slate-900 tracking-tight">تحديث قائمة الطلبيات...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
              <ShoppingBag size={24} />
            </div>
            إدارة الطلبيات
          </h1>
          <p className="text-slate-500 font-medium mt-2 mr-1">تتبع المبيعات وإدارة حالة الشحن من مختلف القنوات.</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => fetchOrders()}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 hover:shadow-sm transition-all shadow-sm"
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          تحديث البيانات
        </motion.button>
      </div>

      {/* ORDERS TABLE CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">معلومات العميل</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المنتج</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">القيمة الإجمالية</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">القناة</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">حالة الطلب</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="p-28 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                         <ShoppingBag size={48} className="text-slate-400" />
                      </div>
                      <p className="font-black text-xl text-slate-500">لا توجدطلبيات حالياً</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <motion.tr 
                    key={order._id}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="hover:bg-slate-50/80 transition-all group border-b border-transparent"
                  >
                    {/* CUSTOMER INFO */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 shrink-0 font-black">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base mb-1">{order.customer.name}</p>
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1.5 text-[11px] text-[#25D366] font-black">
                              <Phone size={10} /> {order.customer.phone}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                              <MapPin size={10} /> {order.customer.wilayaName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* PRODUCT DETAILS */}
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                           <Package2 size={14} className="text-slate-400" /> {order.product.name}
                        </p>
                        <span className="w-fit px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded uppercase tracking-tighter">
                          الكمية: {order.product.quantity}
                        </span>
                      </div>
                    </td>

                    {/* TOTAL VALUE */}
                    <td className="p-6">
                      <div className="flex flex-col">
                        <p className="text-lg font-black text-slate-900 tracking-tight leading-none">
                          {order.total?.toLocaleString()}
                        </p>
                        <span className="text-[10px] font-black text-slate-400 mt-1">دينار جزائري</span>
                      </div>
                    </td>

                    {/* CHANNEL */}
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors">
                          <PlatformIcon platform={order.platform} />
                        </div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{order.platform}</span>
                      </div>
                    </td>

                    {/* STATUS BADGE */}
                    <td className="p-6 text-center">
                      <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-wide shadow-sm ${getStatusStyles(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>

                    {/* ACTION DROPDOWN */}
                    <td className="p-6">
                      <div className="relative flex justify-center group/select">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order._id, e.target.value)}
                          className="appearance-none text-[11px] font-black border-2 border-slate-100 rounded-2xl pr-4 pl-10 py-3 outline-none focus:border-slate-900 bg-white cursor-pointer hover:shadow-lg transition-all"
                        >
                          <option value="pending">🟡 قيد الانتظار</option>
                          <option value="confirmed">🔵 تم التأكيد</option>
                          <option value="shipped">🟣 تم الشحن</option>
                          <option value="delivered">🟢 تم التسليم</option>
                          <option value="cancelled">🔴 ملغي</option>
                        </select>
                        <ChevronDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function PlatformIcon({ platform }) {
  const size = 18;
  const p = platform?.toLowerCase();

  if (p === "whatsapp") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#25D366]">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L22 4l-2.5 5.5Z"/>
      </svg>
    );
  }

  if (p === "messenger" || p === "facebook") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
      </svg>
    );
  }

  return <Globe size={size} className="text-slate-400" />;
}