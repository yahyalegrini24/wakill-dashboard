"use client";
import { useEffect, useState, useCallback } from "react";
import api from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Link2, 
  Loader2,
  Settings2,
  Zap,
  ShieldCheck,
  Lock
} from "lucide-react";

// --- CUSTOM BRAND ICONS ---
const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L22 4l-2.5 5.5Z" />
  </svg>
);

export default function ChannelsPage() {
  // --- KEEPING ALL ORIGINAL STATES ---
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null); 
  const [success, setSuccess] = useState("");
  const [showTokens, setShowTokens] = useState({});

  const [whatsapp, setWhatsapp] = useState({ phoneNumberId: "", token: "" });
  const [facebook, setFacebook] = useState({ pageId: "", token: "" });
  const [instagram, setInstagram] = useState({ igId: "", token: "" });

  // --- KEEPING ORIGINAL FUNCTIONS ---
  const fetchStore = useCallback(async () => {
    try {
      const res = await api.get("/store/my");
      setStore(res.data);
    } catch (err) {
      console.error("Store fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : process.env.NEXT_PUBLIC_FB_APP_ID, 
        cookie     : true,
        xfbml      : true,
        version    : 'v19.0'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    fetchStore();
  }, [fetchStore]);

  const launchWhatsAppSignup = () => {
    setSubmitting('whatsapp');
    const CONFIG_ID = '2736971236643703'; 

    window.FB.login(function(response) {
      if (response.authResponse) {
        const code = response.authResponse.code;
        api.post("/store/connect/meta-exchange", { code })
          .then(res => {
            setSuccess("تم ربط WhatsApp بنجاح!");
            fetchStore();
          })
          .catch(err => {
            alert("فشل الربط. يرجى التحقق من الإعدادات.");
          })
          .finally(() => setSubmitting(null));
      } else {
        setSubmitting(null);
      }
    }, {
      config_id: CONFIG_ID,
      response_type: 'code',
      override_default_response_type: true,
      scope: 'whatsapp_business_management,whatsapp_business_messaging,business_management'
    });
  };

  const handleConnectManual = async (channel, data, endpoint) => {
    setSubmitting(channel);
    try {
      await api.put(endpoint, data);
      setSuccess(`${channel} تم التحديث بنجاح!`);
      await fetchStore();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-slate-900" size={48} />
        <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest">تحميل القنوات...</p>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="p-6 lg:p-10 max-w-[1500px] mx-auto space-y-12">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 border border-blue-100">
            <ShieldCheck size={12} /> نظام ربط آمن
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Settings2 size={36} className="text-slate-900" /> إعدادات القنوات
          </h1>
          <p className="text-slate-500 font-medium mt-2">اربط حسابات Meta لتفعيل WAKILL لمتجرك.</p>
        </div>
        
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="bg-emerald-500 text-white px-8 py-4 rounded-[2rem] shadow-xl shadow-emerald-100 flex items-center gap-3 text-sm font-black"
            >
              <CheckCircle2 size={20} /> {success}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CHANNELS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* WHATSAPP CARD - FULLY ACTIVE */}
        <ChannelCard 
          icon={<WhatsAppIcon className="text-[#25D366]" />}
          title="WhatsApp"
          isConnected={store?.channels?.whatsapp?.connected}
        >
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">الربط السريع (موصى به)</p>
               <button
                 onClick={launchWhatsAppSignup}
                 disabled={submitting === 'whatsapp'}
                 className="w-full bg-[#25D366] text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl shadow-lg shadow-green-100 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40"
               >
                 {submitting === 'whatsapp' ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="white" />}
                 {store?.channels?.whatsapp?.connected ? "إعادة ربط الحساب" : "الاتصال عبر Meta"}
               </button>
            </div>

            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-slate-100"></div>
              <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest">أو يدوياً</span>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <InputField label="Token (Dev only)" type={showTokens.wa ? "text" : "password"} value={whatsapp.token} onChange={v => setWhatsapp({...whatsapp, token: v})} toggle={() => setShowTokens(p => ({...p, wa: !p.wa}))} isToggled={showTokens.wa} />
            <SubmitButton onClick={() => handleConnectManual('whatsapp', whatsapp, "/store/connect/whatsapp")} loading={submitting === 'whatsapp'} color="bg-slate-900" label="حفظ التوكن" />
          </div>
        </ChannelCard>

        {/* MESSENGER CARD - COMING SOON */}
        <ChannelCard 
          icon={<FacebookIcon className="text-slate-400" />}
          title="Messenger"
          comingSoon
        >
          <div className="flex flex-col items-center justify-center py-10 space-y-4 opacity-40 grayscale pointer-events-none select-none">
             <div className="p-6 bg-slate-100 rounded-full">
                <Lock size={32} className="text-slate-400" />
             </div>
             <p className="text-slate-500 font-bold text-center">خدمة الربط عبر مسنجر قيد التطوير حالياً.</p>
          </div>
        </ChannelCard>

        {/* INSTAGRAM CARD - COMING SOON */}
        <ChannelCard 
          icon={<InstagramIcon className="text-slate-400" />}
          title="Instagram"
          comingSoon
        >
          <div className="flex flex-col items-center justify-center py-10 space-y-4 opacity-40 grayscale pointer-events-none select-none">
             <div className="p-6 bg-slate-100 rounded-full">
                <Lock size={32} className="text-slate-400" />
             </div>
             <p className="text-slate-500 font-bold text-center">خدمة الربط عبر إنستغرام ستتوفر قريباً.</p>
          </div>
        </ChannelCard>

      </div>
    </div>
  );
}

// --- SHARED UI COMPONENTS ---

function ChannelCard({ icon, title, isConnected, comingSoon, children }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/40 flex flex-col h-full transition-all duration-500 overflow-hidden relative ${comingSoon ? 'border-dashed border-slate-200' : 'hover:shadow-2xl hover:shadow-slate-200'}`}
    >
      <div className="p-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">{icon}</div>
          {comingSoon ? (
            <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 border border-amber-100 text-amber-600 shadow-sm animate-pulse">
                قريباً
            </div>
          ) : (
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${isConnected ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
              {isConnected ? "● متصل" : "○ غير نشط"}
            </div>
          )}
        </div>
        
        <h2 className={`text-2xl font-black mb-2 ${comingSoon ? 'text-slate-400' : 'text-slate-900'}`}>{title}</h2>
        <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
          {comingSoon ? `نحن نعمل بجد لإتاحة الرد الآلي عبر ${title}.` : `تفعيل ردود الذكاء الاصطناعي على قناة ${title}.`}
        </p>
        {children}
      </div>
    </motion.div>
  );
}

function InputField({ label, type = "text", value, onChange, toggle, isToggled }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">{label}</label>
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-slate-900 transition-all text-left placeholder:text-slate-300"
          placeholder="..."
        />
        {toggle && (
          <button type="button" onClick={toggle} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors">
            {isToggled ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

function SubmitButton({ loading, color, label, onClick }) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={loading}
      className={`w-full ${color} text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40 mt-4`}
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <Link2 size={18} />}
      {label}
    </button>
  );
}