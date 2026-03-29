"use client";
import { useEffect, useState, useCallback } from "react";
import api from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  TrendingUp, 
  Package, 
  Clock, 
  Bot, 
  RefreshCcw, 
  ArrowUpRight, 
  Zap,
  Calendar,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";

export default function DashboardPage() {
  // --- KEEPING ORIGINAL STATES ---
  const [data, setData] = useState({
    orders: [],
    store: null
  });
  const [loading, setLoading] = useState(true);

  // --- KEEPING ORIGINAL FETCH LOGIC ---
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
      setTimeout(() => setLoading(false), 400);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const revenue = data.orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const pending = data.orders.filter(o => o.status === "pending").length;

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* GLOBAL LOADING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl"
          >
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-slate-900/5 animate-ping" />
                <Loader2 className="w-12 h-12 text-slate-900 animate-spin relative z-10" />
            </div>
            <p className="mt-6 font-black text-slate-900 text-[10px] uppercase tracking-[0.3em] animate-pulse">جاري تحديث البيانات</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1600px] mx-auto space-y-10 p-6 lg:p-10"
      >
        {/* TOP BAR / HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <LayoutDashboard size={14} /> لوحة التحكم العامة
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              مرحباً، {data.store?.name || "صاحب المتجر"} <span className="text-slate-300">👋</span>
            </h1>
            <p className="text-slate-500 font-medium">إليك نظرة سريعة على أداء متجرك اليوم.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 px-4 py-2 text-slate-600 font-bold text-xs">
               <Calendar size={16} className="text-slate-400" />
               {new Date().toLocaleDateString('ar-DZ', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <button 
              onClick={fetchData}
              className="p-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl transition-all duration-300 text-slate-400"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* STATS GRID - BENTO STYLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="إجمالي المداخيل" value={`${revenue.toLocaleString()}`} unit="DZD" icon={<TrendingUp size={20}/>} trend="+12.5%" color="bg-emerald-500" />
          <StatCard title="إجمالي الطلبات" value={data.orders.length} unit="طلب" icon={<Package size={20}/>} trend="+5" color="bg-slate-900" />
          <StatCard title="طلبات قيد التنفيذ" value={pending} unit="طلبية" icon={<Clock size={20}/>} trend="مهم" color="bg-orange-500" />
          <StatCard title="كفاءة الذكاء الاصطناعي" value="94" unit="%" icon={<Bot size={20}/>} trend="ممتاز" color="bg-indigo-600" />
        </div>

        {/* AI INSIGHTS BOX - PREMIUM SAAS LOOK */}
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
            <div className="relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Zap size={28} fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">تحليلات الذكاء الاصطناعي</h2>
                            <p className="text-slate-500 text-sm font-medium italic">اقتراحات ذكية لتحسين مبيعاتك</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 max-w-3xl">
                        <Insight text="لديك 5 رسائل لم يتم الرد عليها" type="alert" />
                        <Insight text="الأكثر طلباً: توصيل العاصمة" type="info" />
                        <Insight text="الذكاء الاصطناعي وفر 4 ساعات عمل" type="success" />
                    </div>
                </div>
                <Bot size={180} className="absolute -bottom-10 -left-10 text-slate-50 pointer-events-none" />
            </div>
        </div>

        {/* MAIN SECTION GRID */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* ORDERS LIST */}
          <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-black text-slate-900 text-xl tracking-tight">آخر الطلبيات</h2>
                <p className="text-slate-400 text-xs font-bold mt-1">قائمة بأحدث المعاملات في متجرك</p>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                عرض الكل <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {data.orders.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-slate-300">
                    <Package size={48} className="mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest">لا توجد طلبيات حالياً</p>
                </div>
              ) : (
                data.orders.slice(0, 5).map(o => (
                  <div key={o._id} className="group flex items-center justify-between p-5 rounded-[1.8rem] bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 font-black text-lg group-hover:scale-110 transition-transform">
                            {o.customer?.name?.charAt(0) || "C"}
                        </div>
                        <div>
                        <p className="font-black text-slate-900 text-sm">{o.customer?.name || "زبون عابر"}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">معرف: {o._id.slice(-6)}</p>
                        </div>
                    </div>
                    <div className="text-left flex flex-col items-end gap-2">
                      <p className="font-black text-slate-900">{o.total?.toLocaleString()} <span className="text-[10px] text-slate-400">DZD</span></p>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LIVE ACTIVITY FEED */}
          <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
            <h2 className="font-black mb-8 text-slate-900 text-xl tracking-tight flex items-center gap-3">
                النشاط المباشر
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <div className="space-y-8 relative z-10">
              <Activity text="تم استلام طلب جديد" time="منذ دقيقتين" icon="bg-emerald-500" />
              <Activity text="الذكاء الاصطناعي رد على زبون" time="منذ 15 دقيقة" icon="bg-indigo-500" />
              <Activity text="رسالة جديدة: 'سعر التوصيل؟'" time="منذ ساعة" icon="bg-orange-500" />
              <Activity text="تم تحديث مخزون 'LED Mirror'" time="منذ 3 ساعات" icon="bg-slate-900" />
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* --- REFACTORED SUB-COMPONENTS (FRONT-END ENHANCEMENTS) --- */

function StatCard({ title, value, unit, icon, trend, color }) {
  return (
    <div className="bg-white p-7 rounded-[2.2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group relative overflow-hidden">
      <div className={`p-3 w-fit rounded-2xl ${color} text-white mb-6 shadow-lg shadow-inherit group-hover:rotate-12 transition-transform`}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
            <span className="text-xs font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-emerald-500 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
            <ArrowUpRight size={12} /> {trend}
        </div>
      )}
    </div>
  );
}

function Insight({ text, type }) {
  const styles = {
    alert: "bg-orange-50 border-orange-100 text-orange-700",
    success: "bg-emerald-50 border-emerald-100 text-emerald-700",
    info: "bg-slate-50 border-slate-200 text-slate-700"
  };
  return (
    <div className={`px-4 py-4 rounded-2xl border text-xs font-bold leading-relaxed shadow-sm transition-all hover:scale-[1.02] ${styles[type]}`}>
      {text}
    </div>
  );
}

function Activity({ text, time, icon }) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 ${icon} rounded-full ring-4 ring-slate-50 z-10`} />
        <div className="w-0.5 h-full bg-slate-100 my-1 group-last:hidden" />
      </div>
      <div className="-mt-1">
        <p className="text-sm font-black text-slate-800 leading-tight">{text}</p>
        <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-tighter">{time}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const configs = {
    pending: { label: "قيد الانتظار", color: "bg-amber-100 text-amber-700 border-amber-200" },
    delivered: { label: "تم التوصيل", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    cancelled: { label: "ملغى", color: "bg-rose-100 text-rose-700 border-rose-200" }
  };
  const config = configs[status] || { label: status, color: "bg-slate-100 text-slate-600 border-slate-200" };

  return (
    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${config.color} shadow-sm`}>
      {config.label}
    </span>
  );
}