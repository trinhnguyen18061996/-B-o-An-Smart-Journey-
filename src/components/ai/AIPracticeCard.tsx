import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Award,
  Volume2,
} from 'lucide-react';
import { GradeLevel, ParentSettings } from '../../types';
import { GRADE_CURRICULUM_INFO, AIQuestionData, generateAIQuestionApi } from '../../data/gradeCurriculum';
import { speakText, soundFx } from '../../utils/audio';

interface AIPracticeCardProps {
  subject: 'math' | 'vietnamese' | 'english';
  gradeLevel: GradeLevel;
  childName: string;
  settings: ParentSettings;
  onAnswerCorrect: (stars: number) => void;
}

export const AIPracticeCard: React.FC<AIPracticeCardProps> = ({
  subject,
  gradeLevel,
  childName,
  settings,
  onAnswerCorrect,
}) => {
  const [questionData, setQuestionData] = useState<AIQuestionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentGrade = GRADE_CURRICULUM_INFO[gradeLevel] || GRADE_CURRICULUM_INFO.grade_1;
  const subjectTitle = subject === 'math' ? 'Toán Học' : subject === 'vietnamese' ? 'Tiếng Việt' : 'Tiếng Anh';
  const subjectTheme =
    subject === 'math'
      ? { bg: 'from-sky-500 to-indigo-600', badge: 'bg-sky-100 text-sky-800 border-sky-300' }
      : subject === 'vietnamese'
      ? { bg: 'from-rose-500 to-orange-600', badge: 'bg-rose-100 text-rose-800 border-rose-300' }
      : { bg: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' };

  const loadQuestion = async () => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    try {
      const q = await generateAIQuestionApi(subject, gradeLevel, undefined, childName);
      setQuestionData(q);
      // Removed automatic speech; kid can tap the speaker icon to hear the question
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [subject, gradeLevel]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !questionData) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === questionData.correctIndex;
    if (isCorrect) {
      soundFx.playCorrect(settings.soundEnabled);
      soundFx.playStar(settings.soundEnabled);
      onAnswerCorrect(2);
    } else {
      soundFx.playWrong(settings.soundEnabled);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-indigo-100 shadow-sm overflow-hidden transition-all">
      {/* Top Banner */}
      <div className={`bg-gradient-to-r ${subjectTheme.bg} p-4 text-white flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-xs">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm sm:text-base">Thử Thách AI Cấp Lớp</h3>
              <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white/30">
                {currentGrade.titleVi}
              </span>
            </div>
            <p className="text-xs text-white/90 font-medium">
              Chương trình chuẩn {currentGrade.ageRange} thích ứng riêng cho {childName || 'bé'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playPop(settings.soundEnabled);
            loadQuestion();
          }}
          disabled={isLoading}
          className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95 disabled:opacity-50"
          title="Đổi câu hỏi AI khác"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Câu hỏi khác</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {isLoading ? (
          <div className="py-10 flex flex-col items-center justify-center gap-2 text-indigo-600">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-xs sm:text-sm font-bold animate-pulse">
              AI đang soạn câu hỏi {subjectTitle} phù hợp với năng lực {currentGrade.titleVi}...
            </p>
          </div>
        ) : questionData ? (
          <>
            {/* Question Text */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start justify-between gap-3">
                <p className="font-extrabold text-sm sm:text-base text-slate-800 leading-relaxed">
                  {questionData.question}
                </p>
                <button
                  onClick={() => speakText(questionData.question, subject === 'english' ? 'en' : 'vi')}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shrink-0 cursor-pointer"
                  title="Đọc câu hỏi"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Hint toggle */}
              {!isAnswered && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      soundFx.playPop(settings.soundEnabled);
                      setShowHint((prev) => !prev);
                    }}
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Ẩn gợi ý' : 'Bé cần gợi ý tư duy?'}</span>
                  </button>

                  <span className="text-[11px] font-bold text-slate-400">
                    Phần thưởng: +2 ⭐
                  </span>
                </div>
              )}

              {showHint && !isAnswered && (
                <p className="mt-2 text-xs bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-200 font-medium">
                  💡 Gợi ý: {questionData.hint}
                </p>
              )}
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {questionData.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === questionData.correctIndex;
                let btnStyle = 'bg-white hover:bg-indigo-50/50 border-slate-200 text-slate-800';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-101';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-500 text-white border-rose-600';
                  } else {
                    btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`p-3.5 rounded-2xl border-2 font-bold text-xs sm:text-sm text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isAnswered && isCorrect
                          ? 'bg-white text-emerald-700'
                          : isAnswered && isSelected
                          ? 'bg-white text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="truncate">{opt}</span>
                    </div>

                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-white shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation when answered */}
            {isAnswered && (
              <div className={`p-3.5 rounded-2xl border ${
                selectedOption === questionData.correctIndex
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              } space-y-1.5 animate-scale-up`}>
                <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                  {selectedOption === questionData.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Tuyệt đỉnh! Bé được thưởng +2 ngôi sao ⭐!</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>Cố gắng thêm nhé! Hãy xem lời giải dưới đây:</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {questionData.explanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      soundFx.playPop(settings.soundEnabled);
                      loadQuestion();
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>Làm câu tiếp theo</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};
