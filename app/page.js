"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckCircle, Zap, Shield, MessageSquare, ArrowRight, Star, 
  Users, TrendingUp, Clock, Bot, Rocket, Building, Mail, Phone, MapPin 
} from 'lucide-react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-100 selection:text-green-900">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-100/60 backdrop-blur-xl border-b border-slate-200 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image 
  src="/logo.png" 
  alt="WAKILL.AI Logo" 
  width={260}
  height={80}
  className="h-20 w-auto object-contain"
/>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-500">
              <a href="#features" className="hover:text-[#25D366] transition-colors">واش كاين؟</a>
              <a href="#about" className="hover:text-[#25D366] transition-colors">شكون حنا؟</a>
              <a href="#pricing" className="hover:text-[#25D366] transition-colors">الأسعار</a>
              <a href="#contact" className="hover:text-[#25D366] transition-colors">اتصل بنا</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm font-bold px-4 py-2 text-slate-600 hover:text-[#25D366]">
              دخل لحسابك
            </Link>
            <Link href="/register" className="bg-[#25D366] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#20ba5a] shadow-lg shadow-green-100 transition-all">
              ابدأ باطل
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-44 pb-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[11px] font-black uppercase tracking-widest bg-green-50 text-[#25D366] rounded-full border border-green-100">
            <Star size={12} fill="currentColor" />
            أول منصة أتمتة في الدزاير 🇩🇿
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900">
            خلي الواتساب تاعك <br />
            <span className="text-[#25D366]">يبيع في بلاصتك</span> 
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
            ما تضيعش وقتك في الرد على "بشحال" و "كاين توصيل؟". وكيل يجاوب الزبائن، يسجل الطلبيات، ويبعث لهم إشعارات وحدو 24/24 ساعة.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all">
              سجل و جرب باطل
            </Link>
            <Link href="#about" className="border-2 border-slate-100 px-10 py-5 rounded-2xl font-bold text-lg hover:border-[#25D366] transition-all">
              فهمني كتر (About)
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black text-slate-900">وعلاش تسحق "وكيل"؟</h2>
            <p className="text-slate-500 font-medium tracking-tight italic">خدمة نقية، سريعة، و توفر عليك التعب</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "يفهم الدارجة", desc: "البوت تاعنا مخدوم بالذكاء الاصطناعي باش يفهم لهجتنا و يجاوب الزبون كأنه بنادم.", icon: <MessageSquare className="text-[#25D366]" /> },
              { title: "إشعارات الطلبيات", desc: "غير يكوموندي الزبون، تلحقو رسالة تأكيد فيها كامل تفاصيل الطلب تاعه.", icon: <Zap className="text-[#25D366]" /> },
              { title: "أمان وموثوقية", desc: "معلوماتك ومعلومات زبائنك في أمان تام، نخدمو بأحدث التقنيات لضمان الاستقرار.", icon: <Shield className="text-[#25D366]" /> }
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8">{f.icon}</div>
                <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="bg-[#25D366]/5 rounded-[3rem] p-12 aspect-video flex flex-col justify-center border border-[#25D366]/20 shadow-inner text-center">
                 <h4 className="text-[#25D366] font-black text-5xl mb-4 italic">WAKILL AI</h4>
                 <p className="text-slate-700 font-bold text-xl leading-relaxed">
                   "خدمنا هاد المنصة للمحلات الدزايرية باش نطلعو نيفو تاع التجارة عندنا. الزبون ما يحبش يستنى، و أنت ما تقدرش ترد على 100 واحد في دقيقة.. وكيل هو الحل."
                 </p>
              </div>
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">حنا شكون؟ و واش نقدرو نديرو؟</h2>
              <p className="text-slate-500 font-medium leading-relaxed text-lg italic">
                 حنا فريق من المبرمجين الدزايريين، هدفنا نسهلو الخدمة على أصحاب المتاجر الإلكترونية. "وكيل" مخدوم باش يكون العبد اليمين تاعك؛ يشد الميساجات، ينظم الطلبيات، و يخليك تتفرغ غير للسلعة و التوصيل.
              </p>
              <div className="space-y-4 text-slate-700 font-bold">
                <div className="flex items-center gap-3"><CheckCircle size={20} className="text-[#25D366]" /> <span>يرد بالخف (أقل من ثانية)</span></div>
                <div className="flex items-center gap-3"><CheckCircle size={20} className="text-[#25D366]" /> <span>يسجل معلومات الزبائن وحدو</span></div>
                <div className="flex items-center gap-3"><CheckCircle size={20} className="text-[#25D366]" /> <span>يخدم معاك بلا ما يعيا 24/7</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 italic">الأسعار</h2>
            <p className="text-slate-500 font-medium">خير الباقة اللي تخرج على حجم البيزنس تاعك</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all">
              <div className="mb-6"><Bot size={32} className="text-slate-400" /></div>
              <h3 className="text-xl font-black mb-2">المبتدئ (Starter)</h3>
              <div className="text-4xl font-black my-6 text-slate-900 tracking-tighter">999 <span className="text-sm opacity-40">دج/شهر</span></div>
              <ul className="space-y-4 mb-10 text-right text-sm font-bold opacity-70">
                 <li className="flex gap-3"><CheckCircle size={16} className="text-[#25D366]" /> <span>رقم واتساب واحد (1)</span></li>
                 <li className="flex gap-3"><CheckCircle size={16} className="text-[#25D366]" /> <span>100 رسالة في الشهر</span></li>
                 <li className="flex gap-3"><CheckCircle size={16} className="text-[#25D366]" /> <span>بوت يجاوب آليا</span></li>
              </ul>
              <button className="w-full py-4 border-2 border-slate-100 rounded-2xl font-black text-slate-500 hover:border-[#25D366] hover:text-[#25D366] transition-all">جرب باطل</button>
            </div>

            <div className="p-10 rounded-[3rem] border-2 border-[#25D366] relative bg-white shadow-2xl scale-105 z-10">
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#25D366] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase">الأكثر طلباً 🔥</span>
              <div className="mb-6"><Rocket size={32} className="text-[#25D366]" /></div>
              <h3 className="text-2xl font-black mb-2 italic">المحترف (Pro)</h3>
              <div className="text-5xl font-black my-8 text-slate-900 tracking-tighter">4490 <span className="text-lg opacity-40">دج/شهر</span></div>
              <ul className="space-y-5 mb-10 text-right font-bold">
                 <li className="flex gap-3"><CheckCircle size={20} className="text-[#25D366]" /> <span>3 أرقام واتساب</span></li>
                 <li className="flex gap-3"><CheckCircle size={20} className="text-[#25D366]" /> <span>ميساجات غير محدودين</span></li>
                 <li className="flex gap-3"><CheckCircle size={20} className="text-[#25D366]" /> <span>إشعارات الطلبيات</span></li>
                 <li className="flex gap-3"><CheckCircle size={20} className="text-[#25D366]" /> <span>دعم فني سريع</span></li>
              </ul>
              <button className="w-full py-5 bg-[#25D366] text-white rounded-2xl font-black text-xl hover:bg-[#20ba5a] shadow-lg shadow-green-200 transition-all">اشترك درك</button>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all">
              <div className="mb-6"><Building size={32} className="text-slate-900" /></div>
              <h3 className="text-xl font-black mb-2">البيزنس (Business)</h3>
              <div className="text-4xl font-black my-6 text-slate-900 tracking-tighter">9500 <span className="text-sm opacity-40">دج/شهر</span></div>
              <ul className="space-y-4 mb-10 text-right text-sm font-bold opacity-70">
                 <li className="flex gap-3"><CheckCircle size={16} className="text-[#25D366]" /> <span>أرقام واتساب غير محدودة</span></li>
                 <li className="flex gap-3"><CheckCircle size={16} className="text-[#25D366]" /> <span>الربط مع الـ API</span></li>
                 <li className="flex gap-3"><CheckCircle size={16} className="text-[#25D366]" /> <span>مدير حساب خاص بيك</span></li>
              </ul>
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all">اتصل بنا</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#25D366] opacity-10 blur-[100px] -mr-32 -mt-32"></div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10 text-right">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  عندك سؤال؟ <br /> 
                  <span className="text-[#25D366]">رانا هنا باش نعاونوك</span>
                </h2>
                <p className="text-slate-400 text-lg font-medium">
                  حنا ماشي غير منصة، حنا شريك النجاح تاعك. اتصل بينا في أي وقت، ليكيب راهي واجدة تجاوبك.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#25D366]">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">البريد الإلكتروني</p>
                      <p className="font-bold tracking-tight text-left">contact@wakill.ai</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#25D366]">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">المقر</p>
                      <p className="font-bold">باتنة، الجزائر 🇩🇿</p>
                    </div>
                  </div>
                </div>

                <a 
                  href="https://wa.me/213XXXXXXXXX" 
                  className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-green-500/20"
                >
                  <MessageSquare size={24} />
                  اهدر معانا في واتساب
                </a>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2rem]">
                <form className="space-y-4">
                  <div>
                    <label className="text-white text-xs font-bold mb-2 block uppercase opacity-50">الاسم الكامل</label>
                    <input type="text" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#25D366] transition-colors text-right" placeholder="واش اسمك؟" />
                  </div>
                  <div>
                    <label className="text-white text-xs font-bold mb-2 block uppercase opacity-50">رقم الهاتف</label>
                    <input type="text" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#25D366] transition-colors text-right" placeholder="0XXXXXXXXX" />
                  </div>
                  <div>
                    <label className="text-white text-xs font-bold mb-2 block uppercase opacity-50">الميساج تاعك</label>
                    <textarea rows="4" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#25D366] transition-colors text-right" placeholder="واش حبيت تسقسي؟"></textarea>
                  </div>
                  <button className="w-full bg-white text-slate-900 py-4 rounded-xl font-black hover:bg-[#25D366] hover:text-white transition-all">ابعث الميساج</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <div className="flex justify-center">
            <Image 
              src="/logo.png" 
              alt="WAKILL.AI Footer Logo" 
              width={120} 
              height={30} 
              className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
            />
          </div>
          <div className="flex justify-center gap-10 text-sm font-black text-slate-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-[#25D366]">الخصوصية</Link>
            <Link href="#" className="hover:text-[#25D366]">الشروط</Link>
            <Link href="#contact" className="hover:text-[#25D366]">اتصل بنا</Link>
          </div>
          <div className="text-xs font-bold text-slate-300 italic">حقوق المنصة محفوظة لـ Wakill AI 2026 🇩🇿</div>
        </div>
      </footer>
    </div>
  );
}