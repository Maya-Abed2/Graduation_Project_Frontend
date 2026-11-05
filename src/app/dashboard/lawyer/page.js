'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function LawyerCaseAnalysis() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [caseText, setCaseText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisReport, setAnalysisReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

 
  const [usage, setUsage] = useState({ used: 0, limit: 4, remaining: 4 });


  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || (role !== 'lawyer' && role !== 'trainee')) {
      alert('عذراً، هذه الصفحة مخصصة للمحامين والمتدربين المسجلين فقط.');
      router.push('/login');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserRole(role);
      setAuthorized(true);

    
      if (role === 'trainee') {
        // eslint-disable-next-line react-hooks/immutability
        fetchUsageStatus(token);
      }
    }
  }, [router]);

  //  لجلب حالة العداد للمتدرب
  const fetchUsageStatus = async (token) => {
    try {
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      const res = await fetch('http://localhost:8000/api/lawyer/usage-status', {
        headers: {
          'Authorization': `Bearer ${cleanToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch (err) {
      console.error('خطأ في جلب بيانات العداد:', err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setPdfFile(selectedFile);
        setErrorMsg('');
      } else {
        setErrorMsg('يرجى اختيار ملف بصيغة PDF فقط.');
      }
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setAnalysisReport(null);

    if (!caseText.trim() && !pdfFile) {
      setErrorMsg('يرجى إما كتابة نص القضية أو رفع ملف PDF للتحليل.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('يرجى تسجيل الدخول أولاً.');
      }

      const cleanToken = token.replace(/^Bearer\s+/i, '');

      const formData = new FormData();
      if (caseText.trim()) {
        formData.append('case_text', caseText);
      }
      if (pdfFile) {
        formData.append('file', pdfFile);
      }

      const response = await fetch('http://localhost:8000/api/lawyer/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanToken}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'حدث خطأ أثناء تحليل القضية.');
      }

      setAnalysisReport(data.analysis_report);

      // تحديث العداد للمتدرب بعد التحليل بنجاح
      if (userRole === 'trainee') {
        fetchUsageStatus(token);
      }

      // إرسال إشعار عام للفرونت إيند لتحديث السجل الجانبي
      window.dispatchEvent(new Event('refresh_chat_history'));

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'تعذر الاتصال بالسيرفر.');
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="animate-spin text-4xl">⏳</div>
          <p className="text-stone-600 font-semibold text-sm">جاري التحقق من صلاحيات الوصول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
     
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-red-900"><Image src="/scale.png" alt="المساعد الذكي" width={40} height={40} className="inline-block ml-2" /> المساعد الذكي لتحليل القضاية والمستندات</h1>
          <p className="text-stone-500 text-sm mt-1">
            قم برفع مستند الدعوى بصيغة PDF أو كتابة التفاصيل مباشرة لكشف الثغرات والرأي القانوني.
          </p>
        </div>

        
        {userRole === 'trainee' && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs space-y-1.5 min-w-50">
            <div className="flex items-center justify-between text-stone-900 font-bold">
              <span>⏱️ الاستهلاك الأسبوعي:</span>
              <span className="bg-red-200/80 px-2 py-0.5 rounded text-red-900">
                {usage.used} / {usage.limit}
              </span>
            </div>
            <div className="w-full bg-red-200/60 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-red-800 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-stone-800 font-medium">
              متبقى لك {usage.remaining} تحليلات مجانية هذا الأسبوع.
            </p>
          </div>
        )}
      </div>

     
      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm">
          ⚠️ {errorMsg}
        </div>
      )}

    
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-6">
        
      
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            📄 رفع لائحة الدعوى أو الملف (PDF):
          </label>
          <div className="border-2 border-dashed border-stone-300 hover:border-stone-500 p-6 rounded-xl text-center bg-stone-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="text-2xl">📁</span>
              <p className="text-sm text-stone-600 font-medium">
                اضغط هنا لرفع ملف الـ PDF الخاص بالقضية
              </p>
              <p className="text-xs text-stone-400">يدعم الملفات النصية المستخرجة من المحاكم</p>
            </div>
          </div>

         
          {pdfFile && (
            <div className="mt-3 flex items-center justify-between bg-stone-100 border border-stone-200 p-3 rounded-lg text-sm text-stone-800">
              <span>📌 تم إرفاق: <strong>{pdfFile.name}</strong> ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700 font-bold text-xs bg-white px-2 py-1 rounded border border-red-200"
              >
                إلغاء الملف ✖
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-stone-400 text-xs font-semibold">أو</div>

      
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            📝 أو اكتب/الصق تفاصيل القضية هنا:
          </label>
          <textarea
            rows={5}
            className="w-full border border-stone-300 p-3 rounded-xl text-stone-900 focus:ring-2 focus:ring-stone-500 focus:outline-none text-sm"
            placeholder="أدخل ملخص وقائع الدعوى..."
            value={caseText}
            onChange={(e) => setCaseText(e.target.value)}
          />
        </div>

      
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin text-lg">⏳</span> جاري استخراج النص وتحليله بالذكاء الاصطناعي...
            </>
          ) : (
            'بدء التحليل القانوني للكشوفات والثغرات 🚀'
          )}
        </button>
      </form>

     
      {analysisReport && (
        <div className="bg-stone-900 text-slate-100 p-6 rounded-2xl shadow-xl space-y-4 border border-stone-800">
          <div className="flex items-center justify-between border-b border-stone-700 pb-3">
            <h2 className="text-lg font-bold text-red-800">📊 التقرير التكتيكي والتحليل القانوني:</h2>
            <span className="text-xs bg-stone-900/60 text-stone-300 px-3 py-1 rounded-full border border-stone-700">
              تم التحليل بنجاح
            </span>
          </div>
          
          <div className="text-slate-200 text-sm leading-relaxed font-sans">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-blue-300 mt-4 mb-2 border-b border-slate-700 pb-1" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-blue-400 mt-4 mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-sky-300 mt-3 mb-1" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 text-slate-300" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2 text-slate-300" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-red-700" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-r-4 border-blue-500 bg-slate-800/60 pr-4 py-2 my-3 rounded-l-lg italic text-slate-300" {...props} />
                ),
                p: ({ node, ...props }) => <p className="mb-3 leading-7" {...props} />
              }}
            >
              {analysisReport}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
