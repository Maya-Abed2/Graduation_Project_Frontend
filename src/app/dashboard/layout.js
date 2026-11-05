'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Scale, MessageSquare, FileSearch, LogOut, User, History, Clock, Trash2, Plus, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { getHistory, getLawyerUsageStatus, deleteHistoryItem } from '@/services/api';
import Image from 'next/image';


const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useIsMounted();

  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || null;
    }
    return null;
  });

  const [username, setUsername] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try { return JSON.parse(storedUser).username || 'مستخدم'; } catch (e) {}
      }
      return localStorage.getItem('username') || 'مستخدم';
    }
    return 'مستخدم';
  });

  const [role, setRole] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.role) return parsed.role;
        } catch (e) {}
      }
      return localStorage.getItem('role') || 'client';
    }
    return 'client';
  });

  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [usageStatus, setUsageStatus] = useState(null);

  // 1️⃣ التوجيه في حال عدم وجود token
  useEffect(() => {
    if (!isMounted) return;
    if (!token) {
      router.push('/login');
    }
  }, [isMounted, token, router]);

  // 2️⃣ جلب البيانات عند البداية
  useEffect(() => {
    let isSubscribed = true;

    if (!token) return;

    const loadInitialData = async () => {
      setLoadingHistory(true);
      try {
        const data = await getHistory();
        if (isSubscribed) setHistoryList(data);

       
        if (role === 'trainee') {
          const usage = await getLawyerUsageStatus();
          if (isSubscribed) setUsageStatus(usage);
        }
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
      } finally {
        if (isSubscribed) setLoadingHistory(false);
      }
    };

    loadInitialData();

    return () => {
      isSubscribed = false;
    };
  }, [token, role]);


  useEffect(() => {
    if (!token) return;

    const handleRefresh = async () => {
      try {
        const data = await getHistory();
        setHistoryList(data);

    
        if (role === 'trainee') {
          const usage = await getLawyerUsageStatus();
          setUsageStatus(usage);
        }
      } catch (err) {
        console.error("خطأ في تحديث السجل التلقائي:", err);
      }
    };

    window.addEventListener('refresh_chat_history', handleRefresh);
    return () => window.removeEventListener('refresh_chat_history', handleRefresh);
  }, [token, role]);

  //   البدء بمحادثة جديدة
  const handleNewChat = () => {
    router.push('/dashboard');

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('reset_chat_window'));
    }
  };

  //   حذف عنصر من السجل
  const handleDeleteItem = async (e, id) => {
    e.stopPropagation();

    if (!confirm('هل أنت تأكد من رغبتك في حذف هذا العنصر من السجل؟')) {
      return;
    }

    try {
      if (typeof deleteHistoryItem === 'function') {
        await deleteHistoryItem(id);
      }
      setHistoryList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (err) {
      console.error("خطأ أثناء حذف العنصر:", err);
      alert("تعذر حذف العنصر من السجل.");
    }
  };

  if (!isMounted || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50" dir="rtl">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-slate-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-800" dir="rtl">
      
      {/*  (Sidebar) */}
      <aside className="w-64 bg-white border-l border-stone-200 flex flex-col justify-between p-4 shadow-sm h-screen sticky top-0">
        <div className="flex flex-col h-full overflow-hidden">
          
          
          <div className="flex items-center gap-3 px-3 py-4 border-b border-stone-100 mb-4 shrink-0">
            <div className="rounded-xl bg-stone-50 p-2.5 text-blue-600">
              <Link href="/">
                <Image src="/scale.png" alt="شعار المنصة" width={28} height={28} className="rounded-lg" />
              </Link>
            </div>
            <div>
              <h2 className="font-bold text-stone-800 text-base leading-tight">مساعدك القانوني</h2>
            </div>
          </div>

        
          <div className="shrink-0 mb-4">
            <button
              onClick={handleNewChat}
              className="w-full mb-3 flex items-center justify-center gap-2 px-3.5 py-2.5 bg-red-900 hover:bg-red-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>محادثة جديدة</span>
            </button>

            <nav className="space-y-1.5">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-stone-50 text-stone-600 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>المستشار القانوني (الشات)</span>
              </Link>

              
              {(role === 'lawyer' || role === 'trainee') && (
                <Link
                  href="/dashboard/lawyer"
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/dashboard/lawyer'
                      ? 'bg-stone-50 text-stone-600 font-semibold'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <FileSearch className="h-4 w-4" />
                  <span>تحليل القضايا</span>
                </Link>
              )}
            </nav>
          </div>

         
          {role === 'trainee' && usageStatus && (
            <div className="mb-4 p-3 bg-red-50/70 border border-red-200/60 rounded-xl shrink-0">
              <div className="flex items-center justify-between mb-1.5 text-xs font-semibold text-red-900">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-red-900" />
                  الاستهلاك الأسبوعي
                </span>
                <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-[10px]">
                  {usageStatus.used} / {usageStatus.limit}
                </span>
              </div>
              <div className="w-full bg-red-200/50 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-red-900 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (usageStatus.used / usageStatus.limit) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-stone-700 mt-1">
                متبقي لك {usageStatus.remaining} تحليلات مجانية هذا الأسبوع.
              </p>
            </div>
          )}

         
          <div className="flex-1 overflow-y-auto pr-1 border-t border-stone-100 pt-3 min-h-0">
            <div className="flex items-center gap-2 px-2 mb-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
              <History className="h-3.5 w-3.5" />
              <span>السجل السابق</span>
            </div>

            {loadingHistory ? (
              <p className="text-xs text-stone-400 px-2 py-2">جاري تحميل السجل...</p>
            ) : historyList.length === 0 ? (
              <p className="text-xs text-stone-400 px-2 py-2">لا يوجد سجلات حتى الآن</p>
            ) : (
              <div className="space-y-1">
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/dashboard?history_id=${item.id}`)}
                    className="w-full text-right p-2 rounded-lg hover:bg-stone-100 transition-colors group flex items-center justify-between cursor-pointer relative"
                  >
                    <div className="flex items-start gap-2.5 overflow-hidden">
                      {item.type === 'analysis' ? (
                        <FileSearch className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-stone-500 shrink-0 mt-0.5" />
                      )}
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium text-slate-700 truncate group-hover:text-blue-600">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-stone-400">{item.created_at}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteItem(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 p-1 rounded transition-opacity shrink-0"
                      title="حذف من السجل"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        
        <div className="border-t border-stone-100 pt-3 mt-2 space-y-2.5 shrink-0">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-slate-50">
            <div className="rounded-full bg-stone-100 p-2 text-red-900">
              <User className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-stone-800 truncate">{username}</p>
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 ${
                role === 'lawyer' 
                  ? 'bg-amber-100 text-amber-800' 
                  : role === 'trainee'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {role === 'lawyer' 
                  ? '⚖️ محامي ممارس' 
                  : role === 'trainee' 
                  ? '🎓 محامي متدرب' 
                  : '👤 مستخدم عادي'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-900 bg-white py-2 text-xs font-semibold text-red-900 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

    
     <main className="relative flex-1 overflow-y-auto p-8">
 
  <div className="absolute inset-0 z-0">
    <Image 
      src="/law-school-time.jpg" 
      alt="Main Background" 
      fill
      className="object-cover object-center filter grayscale contrast-125"
      priority
    />
    
    <div className="absolute inset-0 bg-stone-950/85"></div>
  </div>

 
  <div className="relative z-10">
    {children}
  </div>
</main>

    </div>
  );
}
