import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // جلب البيانات المخزنة في الكوكيز أو الترويسة إذا لزم الأمر
  // في Next.js App Router يتم التحقق من المسارات المحمية
  
  // إذا حاول المستخدم الوصول لصفحة المحامي
  if (pathname.startsWith('/dashboard/lawyer')) {
    // يمكنك هنا إضافة فحص التوكن أو توجيهه للـ login إذا لم يكن مسجلاً
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};