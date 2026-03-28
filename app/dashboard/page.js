"use client";
import { useEffect, useState, useCallback } from "react";
import api from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, TrendingUp, Package, Clock, Bot, RefreshCcw } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState({
    orders: [],
    store: null
  });
  const [loading, setLoading] = useState(true);

  // Using useCallback for consistent fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, storeRes] = await Promise.all([
        api.get("/orders/all"),
        api.get("/store/my")
      ]);

      setData({
        orders: ordersRes.data,
        store: storeRes.data
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      // Small delay for smooth UI feel
      setTimeout(() => setLoading(false), 400);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const revenue = data.orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const pending = data.orders.filter(o => o.status === "pending").length;

  return (
    <div className="relative min-h-screen">
      
      {/* GLOBAL ACTIVITY INDICATOR */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md"
          >
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="mt-4 font-semibold text-blue-600 animate-pulse">Updating dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 p-4"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {data.store?.name || "Store Owner"} 👋
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Here's what's happening in your store today
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-blue-600"
              title="Refresh Data"
            >
              <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <div className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border">
              {new Date().toLocaleDateString('en-GB')}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Revenue" value={`${revenue.toLocaleString()} DZD`} icon={<TrendingUp size={20}/>} color="text-green-600" />
          <StatCard title="Total Orders" value={data.orders.length} icon={<Package size={20}/>} color="text-blue-600" />
          <StatCard title="Pending" value={pending} icon={<Clock size={20}/>} color="text-yellow-600" />
          <StatCard title="AI Efficiency" value="72%" icon={<Bot size={20}/>} color="text-purple-600" />
        </div>

        {/* AI INSIGHTS */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-3xl shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Bot size={100} />
            </div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bot size={20} /> AI Insights
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm relative z-10">
            <Insight text="You have 5 unanswered messages" />
            <Insight text="Most asked: delivery time" />
            <Insight text="AI handled 72% conversations" />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ORDERS TABLE */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800 text-lg">Recent Orders</h2>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</button>
            </div>

            <div className="space-y-4">
              {data.orders.length === 0 ? (
                <p className="text-center py-10 text-gray-400">No recent orders found</p>
              ) : (
                data.orders.slice(0, 5).map(o => (
                  <div key={o._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {o.customer?.name?.charAt(0) || "C"}
                        </div>
                        <div>
                        <p className="font-bold text-gray-900">{o.customer?.name || "Guest Customer"}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">ID: {o._id.slice(-6)}</p>
                        </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{o.total?.toLocaleString()} DZD</p>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACTIVITY FEED */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="font-bold mb-6 text-gray-800 text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                Live Activity
            </h2>
            <div className="space-y-6">
              <Activity text="New order placed" time="2 mins ago" />
              <Activity text="AI replied to customer" time="15 mins ago" />
              <Activity text="New message: 'Shipping price?'" time="1 hour ago" />
              <Activity text="Product 'LED Mirror' updated" time="3 hours ago" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className={`p-2 w-fit rounded-lg bg-gray-50 ${color} mb-3`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function Insight({ text }) {
  return (
    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition cursor-default">
      {text}
    </div>
  );
}

function Activity({ text, time }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full border-4 border-blue-100" />
        <div className="w-0.5 h-full bg-gray-100 my-1" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 leading-none">{text}</p>
        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{time}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-amber-100 text-amber-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700"
  };

  return (
    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}