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
  ChevronDown
} from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    wilaya: { number: "", name: "" },
    paymentMethod: "cash_on_delivery"
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchStore = useCallback(async () => {
    try {
      const res = await api.get("/store/my");
      setForm({
        name: res.data.name || "",
        wilaya: res.data.wilaya || { number: "16", name: "Alger" },
        paymentMethod: res.data.paymentMethod || "cash_on_delivery"
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load store settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  async function handleUpdate(e) {
    e.preventDefault();
    setIsSaving(true);
    setSuccess("");
    setError("");
    try {
      await api.put("/store/update", form);
      setSuccess("Settings updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
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
    <div className="flex h-screen items-center justify-center bg-gray-50/50">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl p-8 mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Settings2Icon className="text-blue-600" /> Store Profile
        </h1>
        <p className="text-gray-500 font-medium mt-2">Update your store identity and checkout preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Summary Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Store size={24} />
            </div>
            <h3 className="text-xl font-bold leading-tight">{form.name || "Unnamed Store"}</h3>
            <p className="text-blue-100 text-xs mt-2 font-medium uppercase tracking-widest">
              {form.wilaya.name}, DZ
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Help</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              These details will be shown to your customers during the automated checkout process on Messenger and WhatsApp.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40"
          >
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm font-bold"
                >
                  <CheckCircle2 size={18} /> {success}
                </motion.div>
              )}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm font-bold"
                >
                  <AlertTriangle size={18} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleUpdate} className="space-y-6">
              
              <FormInput 
                label="Public Store Name" 
                icon={<Store size={16} />}
                placeholder="e.g. My Algerian Shop"
                value={form.name}
                onChange={v => setForm({ ...form, name: v })}
              />

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <MapPin size={12} className="text-blue-500" /> Main Wilaya
                </label>
                <div className="relative">
                  <select
                    value={form.wilaya.number}
                    onChange={e => {
                      const selected = wilayas.find(w => w.number === Number(e.target.value));
                      setForm({ ...form, wilaya: selected });
                    }}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 appearance-none outline-none focus:bg-white focus:border-blue-500 transition-all shadow-sm"
                  >
                    {wilayas.map(w => (
                      <option key={w.number} value={w.number}>
                        {w.number.toString().padStart(2, '0')} — {w.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <CreditCard size={12} className="text-blue-500" /> Default Payment Method
                </label>
                <div className="relative">
                  <select
                    value={form.paymentMethod}
                    onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 appearance-none outline-none focus:bg-white focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="cash_on_delivery">💵 Cash on Delivery (COD)</option>
                    <option value="ccp">🏤 CCP (Algérie Poste)</option>
                    <option value="baridimob">📱 BaridiMob</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSaving}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {isSaving ? "Syncing..." : "Apply Settings"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FormInput({ label, icon, placeholder, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
        {icon && <span className="text-blue-500">{icon}</span>}
        {label}
      </label>
      <input
        type="text"
        required
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition-all shadow-sm placeholder:font-normal placeholder:text-gray-300"
      />
    </div>
  );
}

function Settings2Icon({ className }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
    </svg>
  );
}