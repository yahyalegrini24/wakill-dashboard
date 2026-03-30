"use client";
import { useEffect, useState, useCallback } from "react";
import api from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store, 
  MapPin, 
  CreditCard, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  Info,
  ShieldCheck,
  PlusCircle
} from "lucide-react";

export default function SettingsPage() {
  // --- UPDATED STATES ---
  const [form, setForm] = useState({
    name: "",
    wilaya: { number: "16", name: "Alger" },
    paymentMethod: "cash_on_delivery",
    deliveryCompanies: [] // Added to match backend expectation for Create
  });
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isNewStore, setIsNewStore] = useState(false); // Flag for Create vs Update

  // --- IMPROVED LOGIC: CHECK IF STORE EXISTS ---
  const fetchStore = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/store/my");
      
      // If successful, store exists -> Map data to form
      setForm({
        name: res.data.name || "",
        wilaya: res.data.wilaya || { number: "16", name: "Alger" },
        paymentMethod: res.data.paymentMethod || "cash_on_delivery",
        deliveryCompanies: res.data.deliveryCompanies || []
      });
      setIsNewStore(false);
    } catch (err) {
      // If 404, the user has no store yet -> Switch to Create Mode
      if (err.response?.status === 404) {
        setIsNewStore(true);
        console.log("No store found. Switching to Creation mode.");
      } else {
        setError("تعذر تحميل إعدادات المتجر.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  // --- UPSERT LOGIC: POST IF NEW, PUT IF EXISTING ---
  async function handleUpdate(e) {
    e.preventDefault();
    setIsSaving(true);
    setSuccess("");
    setError("");

    try {
      if (isNewStore) {
        // Step 1: Create the store
        await api.post("/store/create", form);
        setSuccess("تم إنشاء متجرك الجديد بنجاح!");
        setIsNewStore(false); // Switch to update mode for next save
      } else {
        // Step 2: Update existing store
        await api.put("/store/update", form);
        setSuccess("تم تحديث الإعدادات بنجاح!");
      }
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "فشلت العملية، يرجى المحاولة لاحقاً");
    } finally {
      setIsSaving(false);
    }
  }

  const wilayas = [
    { number: 1, name: "Adrar" }, { number: 2, name: "Chlef" }, { number: 3, name: "Laghouat" },
    { number: 4, name: "Oum El Bouaghi" }, { number: 5, name: "Batna" }, { number: 6, name: "Béjaïa" },
    { number: 7, name: "Biskra" }, { number: 8, name: "Béchar" }, { number: 9, name: "Blida" },
    { number: 10, name: "Bouira" }, { number: 11, name: "Tamanrasset" }, { number: 12, name: "Tébessa" },
    { number: 13, name: "Tlemcen" }, { number: 14, name: "Tiaret" }, { number: 15, name: "Tizi Ouzou" },
    { number: 16, name: "Alger" }, { number: 17, name: "Djelfa" }, { number: 18, name: "Jijel" },
    { number: 19, name: "Sétif" }, { number: 20, name: "Saïda" }, { number: 21, name: "Skikda" },
    { number: 22, name: "Sidi Bel Abbès" }, { number: 23, name: "Annaba" }, { number: 24, name: "Guelma" },
    { number: 25, name: "Constantine" }, { number: 26, name: "Médéa" }, { number: 27, name: "Mostaganem" },
    { number: 28, name: "M'Sila" }, { number: 29, name: "Mascara" }, { number: 30, name: "Ouargla" },
    { number: 31, name: "Oran" }, { number: 32, name: "El Bayadh" }, { number: 33, name: "Illizi" },
    { number: 34, name: "Bordj Bou Arréridj" }, { number: 35, name: "Boumerdès" }, { number: 36, name: "El Tarf" },
    { number: 37, name: "Tindouf" }, { number: 38, name: "Tissemsilt" }, { number: 39, name: "El Oued" },
    { number: 40, name: "Khenchela" }, { number: 41, name: "Souk Ahras" }, { number: 42, name: "Tipaza" },
    { number: 43, name: "Mila" }, { number: 44, name: "Aïn Defla" }, { number: 45, name: "Naâma" },
    { number: 46, name: "Aïn Témouchent" }, { number: 47, name: "Ghardaïa" }, { number: 48, name: "Relizane" },
    { number: 49, name: "Timimoun" }, { number: 50, name: "Bordj Badji Mokhtar" }, { number: 51, name: "Ouled Djellal" },
    { number: 52, name: "Béni Abbès" }, { number: 53, name: "In Salah" }, { number: 54, name: "In Guezzam" },
    { number: 55, name: "Touggourt" }, { number: 56, name: "Djanet" }, { number: 57, name: "El M'Ghair" },
    { number: 58, name: "El Meniaa" }
  ];

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50/50">
      <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
    </div>
  );

  return (
    <div dir="rtl" className="max-w-6xl p-6 lg:p-10 mx-auto space-y-10">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.1em]">
            <ShieldCheck size={12} /> {isNewStore ? "إعداد متجر جديد" : "الملف التعريفي للمتجر"}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              {isNewStore ? "إنشاء الهوية" : "إعدادات الهوية"}
          </h1>
          <p className="text-slate-500 font-medium">تحكم في اسم متجرك، موقعه، وطرق الدفع المفضلة.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDE: PREVIEW CARD */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 group-hover:rotate-12 transition-transform">
                <Store size={28} className="text-white" />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">اسم المتجر</p>
              <h3 className="text-2xl font-black leading-tight truncate">{form.name || "متجر جديد"}</h3>
              
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">الولاية</p>
                  <p className="font-bold flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {form.wilaya.name || "غير محدد"}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl text-[10px] font-black tracking-widest border border-white/5">DZ</div>
              </div>
            </div>
            <Store size={150} className="absolute -bottom-10 -left-10 text-white/[0.03] -rotate-12" />
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Info size={20} /></div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {isNewStore 
                ? "ابدأ بإدخال اسم متجرك واختيار الولاية لتفعيل نظام الطلبات الآلي."
                : "هذه المعلومات ستظهر لزبائنك أثناء عملية الطلب الآلية عبر مسنجر وواتساب."
              }
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: SETTINGS FORM */}
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 lg:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <AnimatePresence mode="wait">
              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-5 rounded-[1.5rem] mb-8 flex items-center gap-3 text-sm font-black shadow-sm"
                >
                  <CheckCircle2 size={20} /> {success}
                </motion.div>
              )}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-rose-50 border border-rose-100 text-rose-700 p-5 rounded-[1.5rem] mb-8 flex items-center gap-3 text-sm font-black shadow-sm"
                >
                  <AlertTriangle size={20} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleUpdate} className="space-y-8">
              
              <FormInput 
                label="اسم المتجر العام" 
                icon={<Store size={16} />}
                placeholder="مثلاً: متجر الأناقة الجزائري"
                value={form.name}
                onChange={v => setForm({ ...form, name: v })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-1 flex items-center gap-2">
                    <MapPin size={14} className="text-slate-900" /> الولاية الرئيسية
                  </label>
                  <div className="relative group">
                    <select
                      value={form.wilaya.number}
                      onChange={e => {
                        const selected = wilayas.find(w => w.number === Number(e.target.value));
                        setForm({ ...form, wilaya: selected });
                      }}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 appearance-none outline-none focus:bg-white focus:border-slate-900 transition-all shadow-sm"
                    >
                      {wilayas.map(w => (
                        <option key={w.number} value={w.number}>
                          {w.number.toString().padStart(2, '0')} — {w.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-1 flex items-center gap-2">
                    <CreditCard size={14} className="text-slate-900" /> طريقة الدفع الافتراضية
                  </label>
                  <div className="relative group">
                    <select
                      value={form.paymentMethod}
                      onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 appearance-none outline-none focus:bg-white focus:border-slate-900 transition-all shadow-sm"
                    >
                      <option value="cash_on_delivery">💵 الدفع عند الاستلام (COD)</option>
                      <option value="ccp">🏤 الدفع عبر CCP</option>
                      <option value="baridimob">📱 تطبيق BaridiMob</option>
                    </select>
                    <ChevronDown size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSaving}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : (isNewStore ? <PlusCircle size={18} /> : <Save size={18} />)}
                {isSaving ? "جاري الحفظ..." : (isNewStore ? "إنشاء المتجر الآن" : "تطبيق الإعدادات")}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, icon, placeholder, value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-1 flex items-center gap-2">
        {icon && <span className="text-slate-900">{icon}</span>}
        {label}
      </label>
      <input
        type="text"
        required
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-sm placeholder:font-medium placeholder:text-slate-300"
      />
    </div>
  );
}