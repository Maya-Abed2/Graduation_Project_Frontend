'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    setError('');
    setLoading(true);

    try {
      // 1. تجهيز البيانات بصيغة x-www-form-urlencoded لسيرفر FastAPI
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      // 2. إرسال طلب الـ POST مباشرة للباكيند
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'اسم المستخدم أو كلمة السر غير صحيحة');
      }

      // 3. قراءة الـ role الحقيقي من الـ Response المراجع من السيرفر
      const userRole = data.role || 'client';

      // 4. تخزين التوكن والمعلومات الحقيقية في localStorage
      localStorage.setItem('token', data.access_token || data.token || '');
      localStorage.setItem('username', data.username || username);
      localStorage.setItem('role', userRole);


      const userData = {
        username: data.username || username,
        role: userRole,
        weekly_limit: data.weekly_limit ?? (userRole === 'trainee' ? 4 : 0),
        used_analyses: data.used_analyses ?? 0,
      };
      localStorage.setItem('user', JSON.stringify(userData));

      // 6. الانتقال للداشبورد
      window.location.href = '/dashboard';

    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'تعذر الاتصال بالخادم. تأكدي من تشغيل FastAPI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4 font-sans dir-rtl">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6 border border-stone-200">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-stone-800">تسجيل الدخول ⚖️</h1>
          <p className="text-sm text-red-900">المستشار القانوني الذكي للتشريعات الأردنية</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">اسم المستخدم:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-red-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">كلمة المرور:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-red-900"
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
          </button>
        </div>

       
        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-sm text-stone-600">
            ليس لديك حساب؟{' '}
            <Link 
              href="/register" 
              className="font-bold text-red-900 hover:text-red-700 underline transition-colors"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
