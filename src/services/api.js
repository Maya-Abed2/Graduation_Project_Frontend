
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';


const getAuthHeaders = (isJson = true) => {
  let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {};


  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }

  
  if (token) {
    token = token.replace(/^Bearer\s+/i, '');
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

//  (Register)
export const registerUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = typeof data.detail === 'string'
      ? data.detail
      : Array.isArray(data.detail)
        ? data.detail[0]?.msg
        : 'حدث خطأ أثناء إنشاء الحساب';

    throw new Error(errorMessage);
  }

  return data;
};

// (Login)
export const loginUser = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = typeof data.detail === 'string'
      ? data.detail
      : 'بيانات الدخول غير صحيحة أو الخدمة غير متوفرة';
    throw new Error(errorMsg);
  }

  if (typeof window !== 'undefined') {

    const cleanToken = data.access_token ? data.access_token.replace(/^Bearer\s+/i, '') : '';
    localStorage.setItem('token', cleanToken);
    
    const userData = {
      username: data.username,
      role: data.role,
      weekly_limit: data.weekly_limit ?? (data.role === 'trainee' ? 4 : 0),
      used_analyses: data.used_analyses ?? 0,
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
  }

  return data;
};


export const sendChatQuery = async (query) => {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `خطأ في الطلب: ${response.status}`);
  }

  return await response.json();
};

//   تحليل القضية
export const analyzeLawyerCase = async (caseDetails) => {
  const response = await fetch(`${API_BASE_URL}/api/lawyer/analyze`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify(caseDetails),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'فشل إجراء تحليل القضية');
  }

  return await response.json();
};

//   جلب حالة الاستهلاك والحد الأسبوعي 
export const getLawyerUsageStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/api/lawyer/usage-status`, {
    method: 'GET',
    headers: getAuthHeaders(false), // 🌟 نرسل false لمنع إرسال Content-Type في طلب GET
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'تعذر جلب حالة الاستهلاك');
  }

  return await response.json();
};

//   جلب قائمة السجل السابق
export const getHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/api/history`, {
    method: 'GET',
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'تعذر جلب سجل المحادثات');
  }

  return await response.json();
};

//  دالة جلب تفاصيل محادثة/تحليل معين عبر الـ ID
export const getHistoryDetail = async (historyId) => {
  const response = await fetch(`${API_BASE_URL}/api/history/${historyId}`, {
    method: 'GET',
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'تعذر تحميل تفاصيل السجل المحدد');
  }

  return await response.json();
};

//   حذف عنصر محدد من السجل السابق
export const deleteHistoryItem = async (historyId) => {
  const response = await fetch(`${API_BASE_URL}/api/history/${historyId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'تعذر حذف العنصر من السجل');
  }

  return await response.json();
};
