"use client";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Radio, 
  Settings, 
  LogOut, 
  ChevronLeft,
  Zap,
  Store
} from "lucide-react";

// تعريب عناصر القائمة
const navItems = [
  { href: "/dashboard", label: "لوحة التحكم", icon: <LayoutDashboard size={20} /> },
  { href: "/dashboard/products", label: "المنتجات", icon: <Package size={20} /> },
  { href: "/dashboard/orders", label: "الطلبيات", icon: <ShoppingCart size={20} /> },
  { href: "/dashboard/channels", label: "القنوات", icon: <Radio size={20} /> },
  { href: "/dashboard/settings", label: "الإعدادات", icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initSidebar() {
      try {
        const storeRes = await api.get("/store/my");
        setStore(storeRes.data);
        const token = Cookies.get("token");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUser(payload);
        }
      } catch (err) {
        console.error("Sidebar init failed", err);
      } finally {
        setLoading(false);
      }
    }
    initSidebar();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  const isActive = (href) => href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside dir="rtl" className="w-72 min-h-screen flex flex-col sticky top-0 bg-slate-900 text-white shadow-2xl border-l border-white/5">
      
      {/* 1. BRANDING SECTION */}
      <div className="p-8 mb-4">
        <Link href="/dashboard" className="block transform hover:opacity-80 transition-all">
          <Image 
            src="/logo.png" 
            width={140} 
            height={40} 
            style={{ height: 'auto', filter: 'brightness(0) invert(1)' }} // يجعل اللوجو أبيض ليتناسب مع الخلفية الداكنة
            alt="Wakill Logo" 
            priority
          />
        </Link>
      </div>

      {/* 2. NAVIGATION */}
      <div className="px-4 flex-1">
        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 mr-1">
          مساحة العمل
        </p>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="block relative">
                <motion.div
                  whileHover={{ x: -4 }} // التحريك لليسار لأن الاتجاه RTL
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                    active 
                      ? "bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className={active ? "text-white" : "text-slate-500"}>
                    {item.icon}
                  </span>
                  {item.label}
                  {active && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="mr-auto" // mr-auto لدفعه لأقصى اليسار في RTL
                    >
                      <ChevronLeft size={16} />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. PLAN USAGE CARD */}
      <div className="px-6 mb-8 mt-auto">
        <div className="p-5 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute -left-2 -top-2 text-white/5 group-hover:rotate-12 transition-transform">
              <Zap size={64} fill="currentColor" />
          </div>
          
          <div className="relative z-10 text-right">
            <div className="flex justify-between items-start mb-4">
              <button className="bg-[#25D366] text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-wider hover:scale-105 transition-transform">
                ترقية
              </button>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-500 uppercase">الباقة الحالية</p>
                <p className="text-xs font-black text-white italic">Starter Pack</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "30%" }}
                  className="h-full bg-[#25D366] rounded-full"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                 <span className="text-slate-400">50 رسالة</span>
                 <span className="text-white">15 مستخدمة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. USER PROFILE */}
      <div className="px-4 pb-8 border-t border-white/5 pt-6 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/5 transition-all cursor-default group border border-transparent hover:border-white/5">
          
          {/* Avatar */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#25D366] to-green-600 flex items-center justify-center text-white font-black shadow-lg shadow-green-900/20 shrink-0">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (store?.name?.[0] || <Store size={20}/>)}
          </div>

          <div className="flex-1 min-w-0 text-right">
            {loading ? (
              <div className="space-y-2">
                <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                <div className="h-2 w-28 bg-white/5 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-sm font-black text-white truncate">{store?.name || "متجر وكيل"}</p>
                <p className="text-[10px] text-slate-500 truncate font-bold tracking-tight">{user?.email}</p>
              </>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all mr-1"
            title="تسجيل الخروج"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}