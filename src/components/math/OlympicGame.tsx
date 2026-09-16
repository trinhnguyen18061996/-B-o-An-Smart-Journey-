import React, { useState } from 'react';
import { Volume2, Award, CheckCircle2, ChevronRight, HelpCircle, Trophy, Sparkles } from 'lucide-react';
import { ParentSettings } from '../../types';
import { OLYMPIC_QUESTIONS, OlympicMathQuestion } from '../../data/thinkingLessons';
import { soundFx, speakText } from '../../utils/audio';

interface OlympicGameProps {
  settings: ParentSettings;
  onFinishExercise: (subject: 'math', mode: string, score: number, total: number, stars: number) => void;
}

export const OlympicGame: React.FC<OlympicGameProps> = ({
  settings,
  onFinishExercise,
}) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptIndex, setSelectedOptIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ: OlympicMathQuestion = OLYMPIC_QUESTIONS[index] || OLYMPIC_QUESTIONS[0];

  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    if (feedback === 'correct') return;
    soundFx.playPop(settings.soundEnabled);
    setSelectedOptIndex(idx);

    if (isCorrect) {
      soundFx.playSuccess(settings.soundEnabled);
      setFeedback('correct');
      setScore((s) => s + 1);
    } else {
      soundFx.playError(settings.soundEnabled);
      setFeedback('wrong');
    }
  };

  const handleNext = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedOptIndex(null);
    setFeedback('none');
    setShowExplanation(false);

    if (index + 1 < OLYMPIC_QUESTIONS.length) {
      setIndex((i) => i + 1);
    } else {
      onFinishExercise('math', 'olympic_math', score + (feedback === 'correct' ? 1 : 0), OLYMPIC_QUESTIONS.length, 3);
      setIndex(0);
      setScore(0);
    }
  };

  const handleSpeakVi = () => {
    soundFx.playPop(settings.soundEnabled);
    speakText(currentQ.questionVi, 'vi', settings.speechEnabled);
  };

  const handleSpeakEn = () => {
    soundFx.playPop(settings.soundEnabled);
    speakText(currentQ.questionEn, 'en', settings.speechEnabled);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-sm p-5 sm:p-7 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-xs">
            <Trophy className="w-3.5 h-3.5" />
            <span>Toán Olympic: {currentQ.competition} ({currentQ.year})</span>
          </span>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            Câu {index + 1}/{OLYMPIC_QUESTIONS.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSpeakVi}
            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Đọc Tiếng Việt</span>
          </button>
          <button
            type="button"
            onClick={handleSpeakEn}
            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Read English</span>
          </button>
          <span className="font-black text-amber-600 text-xs bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            ⭐ {score}
          </span>
        </div>
      </div>

      {/* Bilingual Question Card */}
      <div className="bg-gradient-to-r from-indigo-50/70 to-purple-50/70 p-5 sm:p-6 rounded-3xl border border-indigo-100 space-y-3">
        <p className="text-base sm:text-lg font-black text-slate-800 leading-snug">
          {currentQ.questionVi}
        </p>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 italic border-t border-indigo-100/80 pt-2">
          {currentQ.questionEn}
        </p>
      </div>

      {/* Multiple Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
        {currentQ.options.map((opt, i) => {
          const isSelected = selectedOptIndex === i;
          return (
            <button
              key={opt.label}
              onClick={() => handleSelectOption(i, opt.isCorrect)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected && feedback === 'correct'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                  : isSelected && feedback === 'wrong'
                  ? 'bg-rose-500 text-white border-rose-600'
                  : 'bg-white hover:bg-indigo-50/60 border-slate-200 hover:border-indigo-300 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                  isSelected ? 'bg-white text-slate-900' : 'bg-indigo-100 text-indigo-900'
                }`}>
                  {opt.label}
                </span>
                <div>
                  <div className="font-black text-sm">{opt.textVi}</div>
                  <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>{opt.textEn}</div>
                </div>
              </div>
              {isSelected && feedback === 'correct' && (
                <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      {feedback === 'correct' && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="font-black text-emerald-950 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Chính xác tuyệt đối!</span>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
            >
              <span>{index + 1 < OLYMPIC_QUESTIONS.length ? 'Câu tiếp theo' : 'Hoàn thành'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-emerald-900 font-medium">{currentQ.explanationVi}</p>
          <p className="text-[11px] text-emerald-800 italic">{currentQ.explanationEn}</p>
        </div>
      )}
    </div>
  );
};
