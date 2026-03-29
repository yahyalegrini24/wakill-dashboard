"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      // تأكد من تطابق مسار صفحة الدخول (Login أو login)
      router.push("/login");
    }
  }, [router]);

  return (
    <div 
      dir="rtl" 
      className="min-h-screen flex flex-row bg-slate-50 font-sans"
    >
      {/* 1. SIDEBAR (سيظهر في اليمين بسبب dir="rtl") */}
      <Sidebar />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* لمسة جمالية: ظل خفيف يفصل المحتوى عن السايدبار عند التمرير */}
      <div className="fixed top-0 right-72 bottom-0 w-px bg-slate-200/50 hidden lg:block" />
    </div>
  );
}