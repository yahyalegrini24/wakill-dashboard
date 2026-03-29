"use client";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "أتمتة المحادثات بالذكاء الاصطناعي",
      subtitle: "دع نظامنا الذكي يتولى الرد على عملائك وإغلاق المبيعات بدلاً منك على مدار الساعة.",
      tag: "الذكاء الاصطناعي"
    },
    {
      title: "منصة واحدة لكل قنواتك",
      subtitle: "إدارة رسائل واتساب، فيسبوك وإنستغرام في لوحة تحكم واحدة موحدة واحترافية.",
      tag: "إدارة شاملة"
    },
    {
      title: "تحليلات دقيقة لنمو تجارتك",
      subtitle: "تتبع أداء الطلبيات، تفاعل العملاء، ونمو المبيعات بضغطة زر واحدة.",
      tag: "تقارير ذكية"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      Cookies.set("token", res.data.token, { expires: 7 });
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen flex bg-white font-sans">
      
      {/* LEFT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-[45%] flex flex-col p-8 md:p-12 lg:p-16 justify-between">
        
        {/* Logo */}
        <div className="mb-12">
          <Link href="/">
            <Image src="/logo.png" alt="Wakill.ai" width={160} height={50} className="object-contain" priority />
          </Link>
        </div>

        {/* Content */}
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-right">
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">تسجيل الدخول</h1>
            <p className="text-slate-500 font-medium">مرحباً بعودتك! قم بإدارة متجرك ومساعدك الذكي الآن.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 text-right">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                autoFocus
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 focus:border-[#25D366] transition-all"
                placeholder="name@company.com"
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2 mr-1">
                <label className="block text-sm font-bold text-slate-700">كلمة المرور</label>
                <Link href="/forgot-password" size="sm" className="text-xs font-bold text-[#25D366] hover:underline underline-offset-4">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 focus:border-[#25D366] transition-all pl-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4 shadow-xl shadow-slate-200"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  جاري التحقق...
                </>
              ) : (
                "دخول للمنصة"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            ليس لديك حساب بعد؟{" "}
            <Link href="/register" className="text-[#25D366] font-black hover:underline underline-offset-4">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
           <span>© 2026 WAKILL.AI</span>
           <div className="flex gap-4">
              <Link href="#" className="hover:text-slate-900">الخصوصية</Link>
              <Link href="#" className="hover:text-slate-900">الشروط</Link>
           </div>
        </div>
      </div>

      {/* RIGHT SIDE: MODERN SaaS VISUALS (Consistently Dark/Green Theme) */}
      <div className="hidden lg:flex w-[55%] bg-slate-50 items-center justify-center p-12 relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#25D366]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"></div>

        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
          
          {/* Mockup Display */}
          <div className="w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 mb-16 transform rotate-2 hover:rotate-0 transition-transform duration-700">
             <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                </div>
                <div className="h-6 w-20 bg-green-50 rounded-md border border-[#25D366]/20 flex items-center justify-center">
                    <span className="text-[8px] font-black text-[#25D366]">LIVE CHAT</span>
                </div>
             </div>
             
             {/* Abstract UI Elements */}
             <div className="space-y-4 animate-in fade-in zoom-in-95 duration-1000">
                <div className="flex gap-4">
                    <div className="h-32 flex-1 bg-slate-900 rounded-2xl p-4 flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><Lock size={16} className="text-[#25D366]" /></div>
                        <div>
                            <div className="h-2 w-16 bg-white/20 rounded-full mb-2"></div>
                            <div className="h-4 w-24 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="h-32 flex-1 bg-[#25D366] rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-green-200">
                        <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center"><CheckCircle2 size={16} className="text-white" /></div>
                        <div>
                            <div className="h-2 w-16 bg-white/40 rounded-full mb-2"></div>
                            <div className="h-4 w-24 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="h-40 w-full bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
                    <div className="text-center space-y-2">
                        <div className="h-2 w-32 bg-slate-200 rounded-full mx-auto"></div>
                        <div className="h-2 w-24 bg-slate-100 rounded-full mx-auto"></div>
                    </div>
                </div>
             </div>
          </div>

          {/* Slide Text */}
          <div className="text-center space-y-4 px-10">
            <span className="inline-block px-4 py-1.5 bg-[#25D366] text-white text-[10px] font-black uppercase tracking-wider rounded-full mb-2">
              {slides[currentSlide].tag}
            </span>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md mx-auto">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          {/* Indicators */}
          <div className="flex gap-3 mt-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === currentSlide ? "w-10 bg-[#25D366]" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}