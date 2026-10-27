"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Send, 
  Bot, 
  User, 
  Scale, 
  BookOpen, 
  Loader2, 
  FileText, 
  Building2, 
  ShieldAlert, 
  Users, 
  Gavel, 
  Sparkles 
} from "lucide-react";
import { sendChatQuery as sendChatMessage, getHistoryDetail } from "../services/api";
import Image from "next/image";

// قائمة البطاقات المقترحة حسب مجلدات البيانات
const SUGGESTED_CARDS = [
  {
    id: "civil",
    title: "القانون المدني",
    icon: FileText,
    question: "ما هي أحكام وشروط فسخ العقد والتعويض في القانون المدني الأردني؟",
    color: "border-blue-200 hover:border-blue-400 bg-blue-50/40 text-blue-900",
  },
  {
    id: "companies",
    title: "قانون الشركات",
    icon: Building2,
    question: "ما هي إجراءات وشروط تأسيس شركة ذات مسؤولية محدودة في الأردن؟",
    color: "border-emerald-200 hover:border-emerald-400 bg-emerald-50/40 text-emerald-900",
  },
  {
    id: "penal",
    title: "قانون العقوبات",
    icon: ShieldAlert,
    question: "ما هي عقوبة الشيك بدون رصيد والجرائم الإلكترونية في القانون الأردني؟",
    color: "border-rose-200 hover:border-rose-400 bg-rose-50/40 text-rose-900",
  },
  {
    id: "personal_status",
    title: "الأحوال الشخصية",
    icon: Users,
    question: "ما هي شروط الحضانة وحقوق الزوجة في النفقة المؤجلة والمؤجلة؟",
    color: "border-purple-200 hover:border-purple-400 bg-purple-50/40 text-purple-900",
  },
  {
    id: "procedures",
    title: "الإجراءات والأصول",
    icon: Gavel,
    question: "ما هي مدد الطعن بالاستئناف والتمييز في القضايا الحقوقية الأردنية؟",
    color: "border-amber-200 hover:border-amber-400 bg-amber-50/40 text-amber-900",
  },
];

function ChatBoxContent() {
  const searchParams = useSearchParams();
  const historyId = searchParams.get("history_id");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "أهلاً بك! أنا مساعدك القانوني الذكي للتشريعات الأردنية. كيف يمكنني مساعدتك اليوم؟",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // 🔄 الاستماع لحدث تصفير الشات
  useEffect(() => {
    const handleResetChat = () => {
      setMessages([
        {
          id: Date.now(),
          sender: "bot",
          text: "أهلاً بك! أنا مساعدك القانوني الذكي للتشريعات الأردنية. كيف يمكنني مساعدتك اليوم؟",
          sources: [],
        },
      ]);
      setInput("");
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", window.location.pathname);
      }
    };

    window.addEventListener("reset_chat_window", handleResetChat);
    return () => window.removeEventListener("reset_chat_window", handleResetChat);
  }, []);

  // 📜 جلب تفاصيل السجل
  useEffect(() => {
    if (!historyId) return;

    const loadHistoryItem = async () => {
      setLoading(true);
      try {
        const data = await getHistoryDetail(historyId);
        if (data) {
          setMessages([
            {
              id: Date.now(),
              sender: "user",
              text: data.prompt_text || data.question || "سؤال سابق",
            },
            {
              id: Date.now() + 1,
              sender: "bot",
              text: data.legal_advice || data.response_text || data.answer || "لا يتوفر نص الإجابة.",
              sources: data.sources || data.context || [],
            },
          ]);
        }
      } catch (err) {
        console.error("خطأ في جلب تفاصيل السجل:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistoryItem();
  }, [historyId]);

  // دالة الإرسال المركزية (تقبل إما إدخال من الحقل أو نص من بطاقة)
  const executeSend = async (queryText) => {
    if (!queryText.trim() || loading) return;

    const userMessage = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      sender: "user",
      text: queryText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(queryText.trim());

      const botText =
        response?.legal_advice ||
        response?.answer ||
        response?.response ||
        response?.result ||
        "تم استلام الإجابة بنجاح.";

      const botSources =
        response?.sources || response?.context || response?.documents || [];

      const botMessage = {
        // eslint-disable-next-line react-hooks/purity
        id: Date.now() + 1,
        sender: "bot",
        text: botText,
        sources: botSources,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("refresh_chat_history"));
      }
    } catch (err) {
      console.error("Chat Error:", err);
      const errorMessage = {
        // eslint-disable-next-line react-hooks/purity
        id: Date.now() + 1,
        sender: "bot",
        text: "عذراً، حدث خطأ أثناء الاتصال بالخادم. يرجى التأكد من تشغيل سيرفر الباكيند ومحاولة الإرسال مجدداً.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeSend(input);
  };

  const handleCardClick = (questionText) => {
    executeSend(questionText);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden" dir="rtl">
      {/* رأس الشات */}
      <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-3">
            <Image src="/chat.png" alt="Logo" width={60} height={60}  />
         
          <div>
            <h3 className="font-bold text-stone-800 text-sm">
            مستشارك القانوني
            </h3>
            <p className="text-[11px] text-red-900">
              متصل بالتشريعات والقوانين الأردنية
            </p>
          </div>
        </div>
      </div>

      {/* منطقة عرض المحادثة */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === "user" ? "mr-auto flex-row-reverse" : "ml-auto"
            }`}
          >
            <div
              className={`shrink-0 h-14 w-14 p-1 rounded-full flex items-center justify-center  text-xs font-bold ${
                msg.sender === "user"
                  ? "bg-red-900 text-white"
                  : "bg-slate-800 text-white"
              }`}
            >
              {msg.sender === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Image src="/robot.png" alt="Logo" width={60} height={60} />
              )}
            </div>

            <div className="space-y-2 flex-1">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-red-900 text-white rounded-tl-none"
                    : msg.isError
                      ? "bg-red-50 text-red-900 border border-red-200 rounded-tr-none"
                      : "bg-white text-stone-800 border border-stone-200 shadow-sm rounded-tr-none"
                }`}
              >
                {msg.text}
              </div>

              {/* المصادر */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="bg-amber-50 border border-red-900 rounded-xl p-3 text-xs text-red-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-red-800 mb-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>المصادر والمراجع القانونية:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    {msg.sources.map((src, idx) => (
                      <li key={idx} className="truncate">
                        {typeof src === "string"
                          ? src
                          : src.document || src.text || src.title || JSON.stringify(src)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 🌟 عرض بطاقات الأسئلة المقترحة إذا كانت المحادثة جديدة فقط */}
        {messages.length === 1 && !loading && (
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>أسئلة شائعة يمكنك البدء بها:</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUGGESTED_CARDS.map((card) => {
                const IconComponent = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.question)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-right transition-all hover:shadow-md cursor-pointer ${card.color}`}
                  >
                    <div className="p-2 bg-white/80 rounded-lg shrink-0 border border-black/5 shadow-xs">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold mb-1 opacity-90">
                        {card.title}
                      </span>
                      <p className="text-[11px] leading-snug line-clamp-2 opacity-80">
                        {card.question}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex gap-3 ml-auto max-w-[80%] items-center">
            <div className="h-14 w-14 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0">
              <Image src="/robot.png" alt="Logo" width={60} height={60} />
            </div>
            <div className="bg-white border border-stone-200 p-3 rounded-2xl text-xs text-stone-500 flex items-center gap-2 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
              <span>جاري استخراج النصوص القانونية وصياغة الإجابة...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* حقل الإدخال */}
      <form
        onSubmit={handleFormSubmit}
        className="p-4 bg-white border-t border-stone-200 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب سؤالك أو استفسارك القانوني هنا..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:red-600 focus:ring-1 focus:ring-red-900 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 bg-red-900 hover:bg-red-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span>إرسال</span>
          <Send className="h-4 w-4 rotate-180" />
        </button>
      </form>
    </div>
  );
}

export default function ChatBox() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-120px)] items-center justify-center bg-white rounded-2xl border border-stone-200">
          <Loader2 className="h-6 w-6 animate-spin text-red-900" />
        </div>
      }
    >
      <ChatBoxContent />
    </Suspense>
  );
}