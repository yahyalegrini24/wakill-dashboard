"use client";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Radio, 
  Settings, 
  LogOut, 
  ChevronRight,
  Zap
} from "lucide-react"; // Using Lucide for cleaner, consistent icons

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/dashboard/products", label: "Products", icon: <Package size={20} /> },
  { href: "/dashboard/orders", label: "Orders", icon: <ShoppingCart size={20} /> },
  { href: "/dashboard/channels", label: "Channels", icon: <Radio size={20} /> },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings size={20} /> },
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
    <aside className="w-72 min-h-screen flex flex-col sticky top-0 bg-[#1c98ed] text-white shadow-2xl border-r border-white/10">
      
      {/* 1. BRANDING SECTION */}
      <div className="p-8">
        <Link href="/dashboard" className="block transform hover:scale-105 transition-transform">
         <Image 
         src="/logo.png" 
         width={150} 
         height={50} 
         style={{ height: 'auto' }} // This maintains the aspect ratio
         alt="Wakill Logo" 
        />
        </Link>
      </div>

      {/* 2. NAVIGATION */}
      <div className="px-4 mb-4">
        <p className="px-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">
          Main Workspace
        </p>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="block relative">
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    active 
                      ? "bg-white text-[#1c98ed] shadow-lg shadow-black/10" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={active ? "text-[#1c98ed]" : "text-white/50"}>
                    {item.icon}
                  </span>
                  {item.label}
                  {active && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="ml-auto"
                    >
                      <ChevronRight size={14} />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. PLAN USAGE CARD */}
      <div className="mt-auto px-6 mb-6">
        <div className="p-5 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 text-white/10 group-hover:rotate-12 transition-transform">
             <Zap size={60} />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase">Current Plan</p>
                <p className="text-sm font-bold text-white">Starter Pack</p>
              </div>
              <button className="bg-white text-[#1c98ed] text-[10px] px-2.5 py-1 rounded-lg font-black uppercase hover:bg-blue-50 transition-colors">
                Upgrade
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "30%" }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <p className="text-[10px] text-white/70 font-medium">15 of 50 AI messages used</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. USER PROFILE */}
      <div className="px-4 pb-6 border-t border-white/10 pt-6">
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-default group">
          {/* Avatar with dynamic initials */}
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1c98ed] font-black shadow-inner">
            {loading ? <span className="animate-pulse">...</span> : user?.email?.[0].toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-2">
                <div className="h-3 w-20 bg-white/20 rounded animate-pulse" />
                <div className="h-2 w-28 bg-white/10 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-white truncate">{store?.name || "Wakil Store"}</p>
                <p className="text-[10px] text-white/50 truncate font-medium">{user?.email}</p>
              </>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-white/40 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}