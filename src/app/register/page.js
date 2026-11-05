'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/api';
import { Scale, User, Mail, Lock, ShieldCheck, Loader2, AlertCircle, CheckCircle2, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // القيمة الافتراضية
  const [lawyerCard, setLawyerCard] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLawyerCard(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // بناء FormData لإرسال البيانات والملفات معاً للباكيند
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      
      //  إذا كان الحساب متدرب، نمرر القيم الابتدائية للاستهلاك الأسبوعي
      if (role === 'trainee') {
        formData.append('weekly_limit', '4');
        formData.append('used_analyses', '0');
      }

      // إذا كان محامي وقام برفع ملف، نرفقه بالطلب
      if (role === 'lawyer' && lawyerCard) {
        formData.append('lawyer_card', lawyerCard);
      }

      await registerUser(formData);
      
      setSuccess('تم إنشاء الحساب بنجاح! سيتم توجيهك لصفحة تسجيل الدخول...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err) {
      
      setError(err.message || 'حدث خطأ غير متوقع أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-liner-to-br from-stone-50 to-stone-100 p-4" dir="rtl">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-stone-100">
        
        
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-full bg-red-50 p-4 text-blue-600 mb-3">
            <Image className="h-8 w-8" src="/scale.png" alt="Scale" width={32} height={32} />
          </div>
          <h1 className="text-2xl font-bold text-stone-800">إنشاء حساب جديد</h1>
          <p className="text-sm text-red-900 mt-1">انضم إلى منصة المساعد القانوني الذكي</p>
        </div>

      
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

       
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-100">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">اسم المستخدم</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400">
                <User className="h-5 w-5" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-stone-200 py-2.5 pl-4 pr-10 text-sm outline-none transition-all focus:border-red-900 focus:ring-2 focus:ring-red-100"
                placeholder="أدخل اسم المستخدم"
              />
            </div>
          </div>

         
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-200 py-2.5 pl-4 pr-10 text-sm outline-none transition-all focus:border-red-900 focus:ring-2 focus:ring-red-100"
                placeholder="name@example.com"
              />
            </div>
          </div>

        
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-stone-200 py-2.5 pl-4 pr-10 text-sm outline-none transition-all focus:border-red-900 focus:ring-2 focus:ring-red-100"
                placeholder="••••••••"
              />
            </div>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">نوع الحساب</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-stone-200 py-2.5 pl-4 pr-10 text-sm bg-white outline-none transition-all focus:border-red-900 focus:ring-2 focus:ring-red-100 appearance-none"
              >
                <option value="client">مستخدم عادي / طالب استشارة</option>
                <option value="trainee">متدرب قانوني (4 تحليلات أسبوعية)</option>
                <option value="lawyer">محامي ممارس</option>
              </select>
            </div>
          </div>

        
          {role === 'trainee' && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-amber-800 text-xs flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-amber-600 shrink-0" />
              <span>يتضمن حساب المتدرب 4 استعلامات وتحليلات مجانية تجدد أسبوعياً.</span>
            </div>
          )}

          
          {role === 'lawyer' && (
            <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-4 transition-all animate-fadeIn">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-1">
                <Image className="h-4 w-4" alt="تحقق الهوية النقابية" />
                تحقق الهوية النقابية (KYC)
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                يرجى رفع صورة واضحة لبطاقة نقابة المحامين أو هوية مزاولة المهنة لتفعيل الصلاحيات الحساسة للذكاء الاصطناعي.
              </p>
              <input
                type="file"
                accept="image/*,application/pdf"
                required
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:ml-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              {lawyerCard && (
                <p className="text-[11px] text-emerald-600 mt-1.5 font-medium">
                  ✓ تم تجهيز الملف: {lawyerCard.name}
                </p>
              )}
            </div>
          )}

          
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-900 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>جاري إنشاء الحساب...</span>
              </>
            ) : (
              'تأكيد وإنشاء الحساب'
            )}
          </button>
        </form>

       
        <div className="mt-6 text-center text-sm text-slate-600">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="font-semibold text-red-900 hover:underline">
            تسجيل الدخول
          </Link>
        </div>

      </div>
    </div>
  );
}
