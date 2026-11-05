"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  FileSearch,
  MessageSquare,
  ShieldCheck,
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  Award,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800 font-sans"
      dir="rtl"
    >

      {/* (Navbar) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/scale.png" alt="Scale" width={60} height={32} />
           
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-700">
            <a href="#hero" className="hover:text-red-900 transition-colors">
              الرئيسية
            </a>
            <a href="#about" className="hover:text-red-900 transition-colors">
              عن المنصة
            </a>
            <a
              href="#services"
              className="hover:text-red-900 transition-colors"
            >
              الخدمات الذكية
            </a>
            <a href="#contact" className="hover:text-red-900 transition-colors">
              تواصل معنا
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-stone-700 hover:text-red-900 transition-colors"
            >
              تسجيل الدخول
            </Link>
            
          </div>
        </div>
      </header>

      {/*  (Hero Section) */}
      <section
        id="hero"
        className="relative text-white py-32 px-6 overflow-hidden min-h-[85vh] flex items-center"
      >
      
        <div className="absolute inset-0 z-0">
          <Image
            src="/bg1.png"
            alt="Legal Background"
            fill
            className="object-cover object-center filter grayscale contrast-125"
            priority
          />
      
          <div className="absolute inset-0 bg-stone-950/75"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
          <div className="lg:col-span-8 space-y-6 text-right">
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-slate-100">
              خبرة قانونية معززة <br />
              <span className="text-red-900">بقوة الذكاء الاصطناعي</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg max-w-2xl font-normal leading-relaxed">
              منصة متكاملة تتيح لك إجراء الاستشارات الفورية، تحليل لوائح الدعاوى
              القضائية، وتلخيص مستندات الـ PDF لكشف الثغرات والرأي القانوني
              بدقة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-6">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 bg-red-900 hover:bg-red-800 text-white font-bold rounded-xl transition-all shadow-xl text-sm flex items-center justify-center gap-2"
              >
                <span>جرب المستشار الذكي الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <a
                href="#services"
                className="w-full sm:w-auto px-8 py-3.5 bg-stone-800/80 hover:bg-stone-800 text-stone-200 font-semibold rounded-xl border border-stone-700 transition-all text-sm"
              >
                استكشف الميزات
              </a>
            </div>
          </div>
        </div>
      </section>

      {/*(About Section) */}
      <section id="about" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-red-900 uppercase tracking-widest">
              الدقة والكفاءة
            </span>
            <h2 className="text-3xl font-extrabold text-stone-700 leading-snug">
              نحدث فارقاً في أسلوب الممارسة والأبحاث القانونية
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              تم تصميم هذه المنصة لتلبي احتياجات المحامين الممارسين، والمتدربين،
              والأفراد على حد سواء. نحن نجمع بين التقنية السحابية المتقدمة
              ونماذج الذكاء الاصطناعي المخصصة للأنظمة والقوانين.
            </p>
            <ol className="list-disc list-inside space-y-3 text-sm text-stone-700 font-medium pt-2">
              <li className="leading-relaxed">
                <span className="font-bold text-red-900 ml-1">سرعة فائقة</span>{" "}
                في معالجة واستخراج معطيات القضايا.
              </li>
              <li className="leading-relaxed">
                <span className="font-bold text-red-900 ml-1">
                  قراءة ملفات PDF
                </span>{" "}
                الرسمية وتلخيص الوقائع.
              </li>
              <li className="leading-relaxed">
                <span className="font-bold text-red-900 ml-1">بيئة آمنة</span>{" "}
                تضمن خصوصية المستندات والبيانات.
              </li>
            </ol>
          </div>
          <div className="bg-stone-900 p-8 rounded-2xl text-stone-100 border border-stone-800 shadow-2xl space-y-4">
            <div className="text-red-900 text-4xl">
              <Image src="/scale.png" alt="Scale" width={60} height={32} />
            </div>
            <h3 className="text-xl font-bold">لماذا تختار منصتنا؟</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              تختصر المنصة ساعات طويلة من البحث والقراءة اليدوية في أوراق
              القضايا واللوائح، مما يمنح المحامي رؤية تكتيكية سريعة لاتخاذ
              القرار المناسب.
            </p>
          </div>
        </div>
      </section>

      {/* (Services Section) */}
      <section
        id="services"
        className="py-20 max-w-7xl mx-auto px-6 space-y-12"
      >
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-red-900 uppercase tracking-widest">
            الميزات الرئيسية
          </span>
          <h2 className="text-3xl font-bold text-700 text-stone-700">
            أدوات العمل القانوني الذكي
          </h2>
          <p className="text-stone-500 text-sm max-w-xl mx-auto">
            منظومة متطورة تجمع بين الشات القانوني وحلول تحليل القضايا
            والمستندات.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-stone-200 hover:border-red-500/50 hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-red-900 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-700">
              المستشار التفاعلي (الشات)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              إجابة استشارية لحظية عن الأسئلة والقوانين والمواد الفقهية المعتمدة
              بشكل دقيق.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-red-500/50 hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-red-900 rounded-xl flex items-center justify-center">
              <FileSearch className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-700">
              تحليل اللوائح والقضايا
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              إمكانية رفع ملف القضية (PDF) أو كتابة نصها لاستخراج ملخص الوقائع
              والثغرات القانونية.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-red-500/50 hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-red-900 rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-700">
              سجل وحفظ الجلسات
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              أرشفة المحادثات وتقارير التحليل السابقة في مساحة العمل الخاصة بك
              لسهولة الوصول إليها.
            </p>
          </div>
        </div>
      </section>

      {/* (Contact Form Section) */}
      <section
        id="contact"
        className="relative text-white py-20 px-6 overflow-hidden"
      >
        {/* خلفية الصورة */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/bg2.png"
            alt="Legal Contact Background"
            fill
            className="object-cover object-center"
            priority
          />
          
          <div className="absolute inset-0 bg-stone-950/80"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-red-900 uppercase tracking-widest">
              تواصل معنا
            </span>
            <h2 className="text-3xl font-extrabold text-stone-100">
              هل لديك استفسار؟
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              يسعدنا استقبال استفساراتك حول المنصة أو إمكانية دمجها في مكتبك
              القانوني.
            </p>
            <div className="space-y-4 text-sm text-slate-300 pt-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-red-900" />
                <span>info@legal-assistant.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-red-900" />
                <span>+962 6 000 0000</span>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-stone-900/90 backdrop-blur-md p-6 rounded-2xl border border-stone-800 space-y-4 shadow-2xl"
          >
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                الاسم الكريم
              </label>
              <input
                type="text"
                placeholder="أدخل اسمك"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-stone-100 focus:outline-none focus:border-red-700 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                placeholder="example@domain.com"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-stone-100 focus:outline-none focus:border-red-700 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                تفاصيل الرسالة
              </label>
              <textarea
                rows={3}
                placeholder="اكتب استفسارك هنا..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-stone-100 focus:outline-none focus:border-red-700 transition-all"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-red-900 hover:bg-red-800 text-stone-950 font-bold py-3 rounded-xl transition-all text-sm shadow-lg"
            >
              إرسال الرسالة
            </button>
          </form>
        </div>
      </section>

      {/* (Footer) */}
      <footer className="bg-stone-950 text-stone-500 py-8 px-6 text-center text-xs border-t border-stone-800">
        <p>© 2026 منصة المستشار القانوني الذكي - جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
