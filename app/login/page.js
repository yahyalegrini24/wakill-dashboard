"use client";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/test1.png",
      title: "Manage all your messages",
      subtitle: "WhatsApp, Facebook and Instagram in one place"
    },
    {
      image: "/test2.png",
      title: "AI responds in Darija",
      subtitle: "Your smart agent works 24/7 automatically"
    },
    {
      image: "/test1.png",
      title: "Track all your orders",
      subtitle: "Every order saved and managed from your dashboard"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      Cookies.set("token", res.data.token, { expires: 7 });
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-10 bg-white">

        {/* Logo only */}
       <div>
       <Image src="/logo.png" alt="Wakil.ai" width={100} height={50} className="object-contain" />
       </div>

        {/* Form */}
        <div className="max-w-sm w-full mx-auto">

          <h1 className="text-4xl font-bold text-[#1E293B] mb-2">Login</h1>
          <p className="text-[#64748B] text-sm mb-8">
            Manage your store and AI assistant
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-2xl mb-5 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Email
              </label>
              <input
                type="email"
                required
                autoFocus
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-[#1E293B] placeholder-[#CBD5E1] focus:outline-none transition text-sm"
                onFocus={e => e.target.style.borderColor = "#1c98ed"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-[#1E293B]">
                  Password
                </label>
                <a href="#" style={{color: "#1c98ed"}} className="text-sm font-medium hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-[#1E293B] placeholder-[#CBD5E1] focus:outline-none transition text-sm pr-12"
                  onFocus={e => e.target.style.borderColor = "#1c98ed"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{backgroundColor: "#1c98ed"}}
              className="w-full hover:opacity-90 active:scale-95 text-white py-3.5 rounded-2xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Logging in...
                </>
              ) : "Login"}
            </button>

          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Not registered yet?{" "}
            <a href="/register" style={{color: "#1c98ed"}} className="font-semibold hover:underline">
              Create an Account
            </a>
          </p>

        </div>

        {/* Footer */}
        <p className="text-xs text-[#94A3B8]">
          © 2025 Wakil.ai — All rights reserved
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center relative overflow-hidden p-12" style={{backgroundColor: "#1c98ed"}}>

        {/* Slide image */}
        <div className="relative w-full max-w-lg h-96 mb-10">
          <Image
            src={slides[currentSlide].image}
            alt="slide"
            fill
            className="object-contain transition-all duration-700"
          />
        </div>

        {/* Slide text */}
        <div className="text-center mb-8 px-4">
          <h2 className="text-white text-2xl font-bold mb-2">
            {slides[currentSlide].title}
          </h2>
          <p className="text-white/70 text-sm">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentSlide
                  ? "w-8 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  );
}