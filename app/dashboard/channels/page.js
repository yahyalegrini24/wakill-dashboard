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
  Unlink,
  AlertCircle,
  Zap // أيقونة جديدة للربط السريع
} from "lucide-react";

// --- CUSTOM BRAND ICONS (نفس الأيقونات تاعك) ---
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
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null); 
  const [success, setSuccess] = useState("");
  const [showTokens, setShowTokens] = useState({});

  // States للربط اليدوي (احتياط)
  const [whatsapp, setWhatsapp] = useState({ phoneNumberId: "", token: "" });
  const [facebook, setFacebook] = useState({ pageId: "", token: "" });
  const [instagram, setInstagram] = useState({ igId: "", token: "" });

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

  // 1. Initialize Facebook SDK آلياً
  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : process.env.NEXT_PUBLIC_FB_APP_ID, // تأكد من وجوده في .env تاع الـ Frontend
        cookie     : true,
        xfbml      : true,
        version    : 'v19.0'
      });
    };

    // تحميل الـ Script
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    fetchStore();
  }, [fetchStore]);

  // 2. دالة فتح الـ Popup و إرسال الكود للـ Backend
  const launchWhatsAppSignup = () => {
    setSubmitting('whatsapp');
    window.FB.login(function(response) {
      if (response.authResponse) {
        const code = response.authResponse.code;
        // إرسال الكود للـ Route الجديد اللي خدمناه في الـ Backend
        api.post("/store/connect/meta-exchange", { code })
          .then(res => {
            setSuccess("WhatsApp Linked Successfully!");
            fetchStore();
          })
          .catch(err => console.error("Link Error", err))
          .finally(() => setSubmitting(null));
      } else {
        setSubmitting(null);
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {
      config_id: '1665322504783174', // الـ Configuration ID من Meta Dashboard (اختياري بصح أحسن)
      response_type: 'code',
      override_default_response_type: true,
      scope: 'whatsapp_business_management,whatsapp_business_messaging,pages_show_list,pages_manage_metadata',
      extras: {
        setup: { /* خيارات إضافية إذا حبيت */ }
      }
    });
  };

  const handleConnectManual = async (channel, data, endpoint) => {
    setSubmitting(channel);
    try {
      await api.put(endpoint, data);
      setSuccess(`${channel} updated successfully!`);
      await fetchStore();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="font-black text-gray-400 text-xs uppercase tracking-[0.2em]">Loading Channels...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
            <Settings2 size={32} className="text-blue-600" /> Channels
          </h1>
          <p className="text-gray-500 font-medium mt-1">Connect your Meta apps to enable automated AI sales.</p>
        </div>
        
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-emerald-200 flex items-center gap-2 text-sm font-bold"
            >
              <CheckCircle2 size={18} /> {success}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* WHATSAPP - UPDATED TO EMBEDDED SIGNUP */}
        <ChannelCard 
          icon={<WhatsAppIcon className="text-emerald-500" />}
          title="WhatsApp"
          isConnected={store?.channels?.whatsapp?.connected}
          color="emerald"
        >
          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Easy Connect</p>
            <button
              onClick={launchWhatsAppSignup}
              disabled={submitting === 'whatsapp'}
              className="w-full bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.15em] py-5 rounded-2xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40"
            >
              {submitting === 'whatsapp' ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="white" />}
              {store?.channels?.whatsapp?.connected ? "Reconnect WhatsApp" : "Connect with Meta"}
            </button>
            
            {store?.channels?.whatsapp?.businessName && (
              <p className="text-center text-[11px] font-bold text-emerald-600">
                Linked to: {store.channels.whatsapp.businessName}
              </p>
            )}

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-gray-300 bg-white px-2">OR Manual setup</div>
            </div>

            <InputField label="Access Token (Manual)" type={showTokens.wa ? "text" : "password"} value={whatsapp.token} onChange={v => setWhatsapp({...whatsapp, token: v})} toggle={() => setShowTokens(p => ({...p, wa: !p.wa}))} isToggled={showTokens.wa} />
            <SubmitButton onClick={() => handleConnectManual('whatsapp', whatsapp, "/store/connect/whatsapp")} loading={submitting === 'whatsapp'} color="bg-gray-800" label="Save Manual" />
          </div>
        </ChannelCard>

        {/* FACEBOOK */}
        <ChannelCard 
          icon={<FacebookIcon className="text-blue-600" />}
          title="Messenger"
          isConnected={store?.channels?.facebook?.connected}
          color="blue"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleConnectManual('facebook', facebook, "/store/connect/facebook"); }} className="space-y-5">
            <InputField label="Page ID" value={facebook.pageId} onChange={v => setFacebook({...facebook, pageId: v})} />
            <InputField label="Page Access Token" type={showTokens.fb ? "text" : "password"} value={facebook.token} onChange={v => setFacebook({...facebook, token: v})} toggle={() => setShowTokens(p => ({...p, fb: !p.fb}))} isToggled={showTokens.fb} />
            <SubmitButton loading={submitting === 'facebook'} color="bg-blue-600" label={store?.channels?.facebook?.connected ? "Update Connection" : "Connect Channel"} />
          </form>
        </ChannelCard>

        {/* INSTAGRAM */}
        <ChannelCard 
          icon={<InstagramIcon className="text-pink-600" />}
          title="Instagram"
          isConnected={store?.channels?.instagram?.connected}
          color="pink"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleConnectManual('instagram', instagram, "/store/connect/instagram"); }} className="space-y-5">
            <InputField label="Business ID" value={instagram.igId} onChange={v => setInstagram({...instagram, igId: v})} />
            <InputField label="Access Token" type={showTokens.ig ? "text" : "password"} value={instagram.token} onChange={v => setInstagram({...instagram, token: v})} toggle={() => setShowTokens(p => ({...p, ig: !p.ig}))} isToggled={showTokens.ig} />
            <SubmitButton loading={submitting === 'instagram'} color="bg-pink-600" label={store?.channels?.instagram?.connected ? "Update Connection" : "Connect Channel"} />
          </form>
        </ChannelCard>

      </div>
    </div>
  );
}

// --- REUSABLE COMPONENTS (بقت كما هي مع تغيير بسيط في الـ SubmitButton) ---

function ChannelCard({ icon, title, isConnected, children, color }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/50 flex flex-col h-full"
    >
      <div className="p-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">{icon}</div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isConnected ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
            {isConnected ? "● Online" : "○ Offline"}
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">
          Sync your {title} business assets to enable the Wakil AI agent.
        </p>

        {children}
      </div>
    </motion.div>
  );
}

function InputField({ label, type = "text", value, onChange, toggle, isToggled }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-50/50 transition-all"
          placeholder={`Enter ${label}...`}
        />
        {toggle && (
          <button type="button" onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
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
      className={`w-full ${color} text-white font-black text-xs uppercase tracking-[0.15em] py-4 rounded-2xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40 mt-4`}
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <Link2 size={18} />}
      {label}
    </button>
  );
}