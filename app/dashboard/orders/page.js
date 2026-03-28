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
  ChevronDown
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
      // Smooth transition out of loading state
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
      await fetchOrders(true); // Re-fetch data silently after update
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  const getStatusStyles = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
      cancelled: "bg-rose-100 text-rose-700 border-rose-200"
    };
    return styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="relative min-h-screen p-6 space-y-6 bg-gray-50/30">
      
      {/* GLOBAL ACTIVITY INDICATOR */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md"
          >
            <Loader2 className="w-12 h-12 text-[#1c98ed] animate-spin" />
            <p className="mt-4 font-bold text-[#1c98ed] tracking-tight animate-pulse">Syncing Orders...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <ShoppingBag size={24} />
            </div>
            Orders
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Manage customer fulfillment and sales channels</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchOrders()}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-2xl font-bold text-sm text-gray-600 hover:shadow-md transition-all"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Feed
        </motion.button>
      </div>

      {/* ORDERS TABLE CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer Information</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Details</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Value</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Channel</th>
                <th className="text-left p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Status</th>
                <th className="text-right p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="p-24 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <ShoppingBag size={64} className="mb-4" />
                      <p className="font-black text-xl">No orders in queue</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <motion.tr 
                    key={order._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="hover:bg-blue-50/40 transition-colors group cursor-default"
                  >
                    {/* CUSTOMER INFO */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 font-black shadow-md shadow-blue-100">
                          {order.customer?.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base leading-none mb-1.5">{order.customer.name}</p>
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1.5 text-[11px] text-gray-500 font-bold uppercase tracking-tight">
                              <Phone size={10} className="text-blue-500" /> {order.customer.phone}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-semibold">
                              <MapPin size={10} /> {order.customer.wilayaName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* PRODUCT DETAILS */}
                    <td className="p-6">
                      <p className="font-bold text-gray-800 text-sm">{order.product.name}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-black rounded uppercase tracking-tighter">
                        Quantity: {order.product.quantity}
                      </span>
                    </td>

                    {/* TOTAL VALUE */}
                    <td className="p-6">
                      <p className="text-lg font-black text-gray-900 tracking-tight">
                        {order.total?.toLocaleString()} 
                        <span className="text-[10px] ml-1 text-blue-600 font-black">DZD</span>
                      </p>
                    </td>

                    {/* CHANNEL ICON */}
                    <td className="p-6">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 group-hover:border-blue-200 transition-colors">
                          <PlatformIcon platform={order.platform} />
                        </div>
                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">{order.platform}</span>
                      </div>
                    </td>

                    {/* STATUS BADGE */}
                    <td className="p-6">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border shadow-sm ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* ACTION DROPDOWN */}
                    <td className="p-6 text-right">
                      <div className="relative inline-block group/select">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order._id, e.target.value)}
                          className="appearance-none text-xs font-black border-2 border-gray-100 rounded-xl pl-4 pr-10 py-2.5 outline-none focus:border-blue-500 bg-white cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all"
                        >
                          <option value="pending">🟡 Pending</option>
                          <option value="confirmed">🔵 Confirmed</option>
                          <option value="shipped">🟣 Shipped</option>
                          <option value="delivered">🟢 Delivered</option>
                          <option value="cancelled">🔴 Cancelled</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover/select:text-blue-500 transition-colors" />
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

/** * Platform Icons using clean SVGs since Lucide 
 * sometimes misses brand-specific logos.
 */
function PlatformIcon({ platform }) {
  const size = 18;
  const p = platform?.toLowerCase();

  if (p === "whatsapp") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L22 4l-2.5 5.5Z"/>
      </svg>
    );
  }

  if (p === "messenger" || p === "facebook") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
      </svg>
    );
  }

  return <Globe size={size} className="text-gray-400" />;
}