import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Volume2,
  Bot,
  HelpCircle,
  Lightbulb,
  GraduationCap,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { GradeLevel, ParentSettings } from '../../types';
import { GRADE_CURRICULUM_INFO, askAITutorApi } from '../../data/gradeCurriculum';
import { speakText, soundFx } from '../../utils/audio';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeLevel: GradeLevel;
  childName: string;
  settings: ParentSettings;
  initialSubject?: 'math' | 'vietnamese' | 'english';
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  gradeLevel,
  childName,
  settings,
  initialSubject = 'math',
}) => {
  const [subject, setSubject] = useState<'math' | 'vietnamese' | 'english'>(initialSubject);
  const [questionInput, setQuestionInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; time: string }>
  >([
    {
      sender: 'ai',
      text: `Xin chào ${childName || 'bé cưng'}! Thầy là Gia sư AI Gấu Trúc 🐼. Thầy đồng hành cùng con trong chương trình ${GRADE_CURRICULUM_INFO[gradeLevel]?.titleVi || 'Tiểu học'}. Con đang thắc mắc bài nào, hãy bấm vào các gợi ý bên dưới hoặc hỏi thầy ngay nhé! 🌟`,
      time: 'Vừa xong',
    },
  ]);

  if (!isOpen) return null;

  const currentGrade = GRADE_CURRICULUM_INFO[gradeLevel] || GRADE_CURRICULUM_INFO.grade_1;

  // Preset quick prompt suggestions based on active grade level
  const QUICK_PROMPTS: Record<GradeLevel, Record<string, string[]>> = {
    grade_1: {
      math: ['Giải thích phép cộng qua 10', 'Làm sao đếm hình vuông và hình tam giác?', 'Cách so sánh số lớn hơn, bé hơn'],
      vietnamese: ['Bảng chữ cái tiếng Việt', 'Quy tắc chính tả c và k', 'Đố vui con vật dễ thương'],
      english: ['Màu sắc trong tiếng Anh nói thế nào?', 'Đếm số từ 1 đến 10 bằng tiếng Anh', 'Chào hỏi bạn bè bằng tiếng Anh'],
    },
    grade_2: {
      math: ['Mẹo học bảng nhân 2 và nhân 5', 'Cách cộng trừ có nhớ trong phạm vi 100', 'Khối lập phương và khối trụ khác nhau thế nào?'],
      vietnamese: ['Từ chỉ hoạt động là gì và cho ví dụ', 'Phân biệt chính tả L và N', 'Ý nghĩa câu Uống nước nhớ nguồn'],
      english: ['Tên các đồ dùng học tập bằng tiếng Anh', 'Cách giới thiệu gia đình: This is my...', 'Đếm số từ 1 đến 20 bằng tiếng Anh'],
    },
    grade_3: {
      math: ['Cách tính chu vi hình chữ nhật và hình vuông', 'Mẹo nhớ nhanh bảng nhân 7, 8, 9', 'Bài toán giảm đi một số lần làm thế nào?'],
      vietnamese: ['Biện pháp nghệ thuật So sánh là gì?', 'Thế nào là biện pháp Nhân hóa?', 'Cách phân biệt Danh từ, Động từ, Tính từ'],
      english: ['Cách dùng thì Hiện tại tiếp diễn (V-ing)', 'Hỏi giờ và trả lời bằng tiếng Anh', 'Hỏi đường đến thư viện trường học'],
    },
    grade_4: {
      math: ['Cách tìm hai số khi biết Tổng và Hiệu', 'Quy tắc cộng trừ hai phân số', 'Dấu hiệu chia hết cho 2, 3, 5, 9'],
      vietnamese: ['Phân biệt Danh từ chung và Danh từ riêng', 'Ba kiểu câu kể: Ai là gì? Ai làm gì? Ai thế nào?', 'Ý nghĩa câu Có công mài sắt, có ngày nên kim'],
      english: ['Cách chia động từ thì Quá khứ đơn (Past Simple)', 'So sánh hơn của tính từ ngắn (faster, bigger)', 'Hỏi câu hỏi với Wh- (Where, When, Why)'],
    },
    grade_5: {
      math: ['Quy tắc cộng trừ nhân chia số thập phân', 'Cách tính vận tốc v = s : t trong toán chuyển động', 'Cách tính tỉ số phần trăm và ứng dụng'],
      vietnamese: ['Thế nào là Từ đồng nghĩa và Từ đồng âm?', 'Cách sử dụng cặp từ quan hệ Vì... nên, Tuy... nhưng', 'Cách viết câu ghép có hai vế hoàn chỉnh'],
      english: ['Cách dùng thì Tương lai với will và be going to', 'Từ vựng chủ đề bảo vệ môi trường thế giới', 'Mẹo đọc hiểu đoạn văn tiếng Anh nhanh'],
    },
  };

  const prompts = QUICK_PROMPTS[gradeLevel]?.[subject] || QUICK_PROMPTS.grade_1.math;

  const handleAsk = async (text: string) => {
    if (!text.trim() || isLoading) return;
    soundFx.playPop(settings.soundEnabled);

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const userMsg = { sender: 'user' as const, text: text.trim(), time: timeStr };

    setConversation((prev) => [...prev, userMsg]);
    setQuestionInput('');
    setIsLoading(true);

    try {
      const subjectName = subject === 'math' ? 'Toán' : subject === 'vietnamese' ? 'Tiếng Việt' : 'Tiếng Anh';
      const aiResponse = await askAITutorApi(text.trim(), gradeLevel, subjectName, childName);

      const aiMsg = { sender: 'ai' as const, text: aiResponse, time: timeStr };
      setConversation((prev) => [...prev, aiMsg]);
      soundFx.playCorrect(settings.soundEnabled);

      // Auto speak response if enabled
      if (settings.speechEnabled) {
        speakText(aiResponse, 'vi');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-indigo-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-2xl border border-white/20 shadow-xs">
              🐼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg flex items-center gap-1.5">
                  <span>Gia Sư AI Tiểu Học</span>
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                </h3>
                <span className="bg-amber-400 text-indigo-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  {currentGrade.titleVi}
                </span>
              </div>
              <p className="text-xs text-indigo-100 font-medium">
                Tự động đồng bộ chuẩn Bộ GD&ĐT ({currentGrade.ageRange})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              onClose();
            }}
            className="p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subject Pills */}
        <div className="bg-indigo-50/80 px-4 py-2 border-b border-indigo-100 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setSubject('math');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                subject === 'math'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
              }`}
            >
              <span>🔢</span>
              <span>Toán {currentGrade.titleVi.split(' ')[0]}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setSubject('vietnamese');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                subject === 'vietnamese'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
              }`}
            >
              <span>🔤</span>
              <span>Tiếng Việt</span>
            </button>

            <button
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setSubject('english');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                subject === 'english'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              <span>🇬🇧</span>
              <span>Tiếng Anh</span>
            </button>
          </div>

          <div className="text-[11px] font-bold text-indigo-700 hidden sm:flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{currentGrade.ageRange}</span>
          </div>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0 mt-1">
                  🐼
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line font-medium">{msg.text}</p>
                <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-slate-100/40 text-[10px] opacity-80">
                  <span>{msg.time}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => speakText(msg.text, 'vi')}
                      className="p-1 hover:bg-slate-100 rounded-md transition-all cursor-pointer text-indigo-600 flex items-center gap-1 font-bold"
                      title="Đọc to câu trả lời"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Đọc cho bé nghe</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-black shadow-xs shrink-0 mt-1">
                  {childName ? childName.charAt(0).toUpperCase() : 'B'}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-indigo-600 bg-white p-3 rounded-2xl border border-indigo-100 w-fit shadow-xs animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-bold">Thầy Gấu Trúc đang suy nghĩ và soạn bài cho bé...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Suggestions */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2 shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Gợi ý câu hỏi chuẩn kiến thức {currentGrade.titleVi}:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(p)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-medium whitespace-nowrap transition-all border border-slate-200 cursor-pointer disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(questionInput);
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder={`Bé hỏi thầy Gấu Trúc điều gì về ${subject === 'math' ? 'Toán' : subject === 'vietnamese' ? 'Tiếng Việt' : 'Tiếng Anh'} ${currentGrade.titleVi}...`}
              className="flex-1 px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-xs sm:text-sm font-medium outline-none bg-slate-50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!questionInput.trim() || isLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <span>Hỏi Thầy</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
