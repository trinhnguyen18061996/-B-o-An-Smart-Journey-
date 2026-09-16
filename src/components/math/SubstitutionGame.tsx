import React, { useState } from 'react';
import { Volume2, Lightbulb, CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { ParentSettings } from '../../types';
import { SUBSTITUTION_QUESTIONS, SubstitutionQuestion } from '../../data/thinkingLessons';
import { soundFx, speakText } from '../../utils/audio';

interface SubstitutionGameProps {
  settings: ParentSettings;
  onFinishExercise: (subject: 'math', mode: string, score: number, total: number, stars: number) => void;
}

export const SubstitutionGame: React.FC<SubstitutionGameProps> = ({
  settings,
  onFinishExercise,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [zoomPercent, setZoomPercent] = useState<number>(100);

  const currentQ: SubstitutionQuestion = SUBSTITUTION_QUESTIONS[currentIndex] || SUBSTITUTION_QUESTIONS[0];

  const handleZoomIn = () => {
    soundFx.playPop(settings.soundEnabled);
    setZoomPercent((z) => Math.min(130, z + 15));
  };

  const handleZoomOut = () => {
    soundFx.playPop(settings.soundEnabled);
    setZoomPercent((z) => Math.max(85, z - 15));
  };

  const handleSpeakVi = () => {
    soundFx.playPop(settings.soundEnabled);
    const spokenText = `${currentQ.questionVi}. ${currentQ.equations.line1}, ${currentQ.equations.line2 || ''}, ${currentQ.equations.line3 || ''}, ${currentQ.equations.targetLine}`;
    speakText(spokenText, 'vi', settings.speechEnabled);
  };

  const handleSpeakEn = () => {
    soundFx.playPop(settings.soundEnabled);
    speakText(`${currentQ.questionEn}. What is the missing number?`, 'en', settings.speechEnabled);
  };

  const handleSelectOption = (optValue: number, optTextEn: string) => {
    if (feedback === 'correct') return;
    soundFx.playPop(settings.soundEnabled);
    setSelectedOption(optValue);

    if (optValue === currentQ.correctAnswer) {
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
    setSelectedOption(null);
    setFeedback('none');
    setShowHint(false);
    setShowSolution(false);

    if (currentIndex + 1 < SUBSTITUTION_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinishExercise('math', 'substitution', score + (feedback === 'correct' ? 1 : 0), SUBSTITUTION_QUESTIONS.length, 3);
      setCurrentIndex(0);
      setScore(0);
    }
  };

  const handlePrev = () => {
    soundFx.playPop(settings.soundEnabled);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
      setFeedback('none');
      setShowHint(false);
      setShowSolution(false);
    }
  };

  // Zoom scale styling helper
  const scaleStyle = {
    transform: `scale(${zoomPercent / 100})`,
    transformOrigin: 'top center',
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-sm overflow-hidden animate-fade-in">
      {/* 1. HEADER BAR EXACTLY AS IN IMAGE 1 */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 sm:p-4 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Question Badge & Category Tag */}
        <div className="flex items-center gap-2">
          <span className="bg-amber-500 text-white font-black text-xs sm:text-sm px-3 py-1 rounded-xl shadow-2xs">
            Câu {currentIndex + 1}/{SUBSTITUTION_QUESTIONS.length}
          </span>
          <span className="bg-sky-100 text-sky-800 border border-sky-300 font-bold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-lg">
            #{currentQ.category}
          </span>
        </div>

        {/* Center: Zoom controls */}
        <div className="flex items-center bg-white border border-amber-200 rounded-xl px-2 py-0.5 gap-1.5 shadow-2xs">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Thu nhỏ"
            className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-bold text-slate-700 min-w-[38px] text-center">{zoomPercent}%</span>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Phóng to"
            className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Audio & Help Controls */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* Read Vietnamese */}
          <button
            type="button"
            onClick={handleSpeakVi}
            className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Đọc TV</span>
          </button>

          {/* Read English */}
          <button
            type="button"
            onClick={handleSpeakEn}
            className="px-2.5 py-1 bg-white hover:bg-sky-100 border border-sky-300 text-sky-900 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Read Eng</span>
          </button>

          {/* Show Answer / Solution */}
          <button
            type="button"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setShowSolution(!showSolution);
            }}
            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Xem đáp án</span>
          </button>

          {/* Hint button */}
          <button
            type="button"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setShowHint(!showHint);
            }}
            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Trợ giúp</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN CARD & WHITEBOARD */}
      <div className="p-5 sm:p-7 space-y-6" style={scaleStyle}>
        {/* Question Prompt */}
        <div className="text-center space-y-1">
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            {currentQ.questionVi}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 italic">
            {currentQ.questionEn}
          </p>
        </div>

        {/* Symbolic Equations Area (Styled cleanly with large readable icons) */}
        <div className="max-w-md mx-auto bg-gradient-to-b from-amber-50/60 to-yellow-50/40 rounded-3xl p-6 border-2 border-amber-200/80 shadow-inner text-center space-y-3">
          <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wider">
            {currentQ.equations.line1}
          </div>
          {currentQ.equations.line2 && (
            <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wider">
              {currentQ.equations.line2}
            </div>
          )}
          {currentQ.equations.line3 && (
            <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wider">
              {currentQ.equations.line3}
            </div>
          )}
          <div className="pt-2 border-t-2 border-dashed border-amber-300">
            <span className="inline-block px-4 py-1.5 bg-amber-200 text-amber-950 rounded-2xl text-2xl sm:text-3xl font-black shadow-xs">
              {currentQ.equations.targetLine}
            </span>
          </div>
        </div>

        {/* 3. MULTIPLE CHOICE BUTTONS (2x2 Grid with individual audio buttons) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.value;
            const isCorrectAnswer = opt.value === currentQ.correctAnswer;
            return (
              <div
                key={opt.label}
                className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected && feedback === 'correct'
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                    : isSelected && feedback === 'wrong'
                    ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                    : showSolution && isCorrectAnswer
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                    : 'bg-white hover:bg-amber-50/80 border-slate-200 hover:border-amber-300 text-slate-800'
                }`}
                onClick={() => handleSelectOption(opt.value, opt.textEn)}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {opt.label}
                  </span>
                  <span className="text-xl sm:text-2xl font-black">
                    {opt.value}
                  </span>
                </div>

                {/* Audio voice for option */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playPop(settings.soundEnabled);
                    speakText(String(opt.value), 'vi', settings.speechEnabled);
                  }}
                  title={`Nghe số ${opt.value}`}
                  className="p-1.5 rounded-lg hover:bg-black/10 text-current transition-colors"
                >
                  <Volume2 className="w-4 h-4 opacity-75" />
                </button>
              </div>
            );
          })}
        </div>

        {/* 4. HINT PANEL */}
        {showHint && (
          <div className="max-w-md mx-auto p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs space-y-1 animate-fade-in">
            <div className="flex items-center gap-1.5 font-black text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Gợi ý tư duy:</span>
            </div>
            <p className="text-amber-950 font-medium">{currentQ.hintVi}</p>
            <p className="text-amber-800 text-[11px] italic font-medium pt-1 border-t border-amber-200">
              {currentQ.hintEn}
            </p>
          </div>
        )}

        {/* 5. SOLUTION PANEL */}
        {showSolution && (
          <div className="max-w-md mx-auto p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-xs space-y-1 animate-fade-in">
            <div className="flex items-center gap-1.5 font-black text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Lời giải chi tiết:</span>
            </div>
            <p className="text-emerald-950 font-medium">{currentQ.explanationVi}</p>
            <p className="text-emerald-800 text-[11px] italic font-medium pt-1 border-t border-emerald-200">
              {currentQ.explanationEn}
            </p>
          </div>
        )}

        {/* Success / Feedback banner */}
        {feedback === 'correct' && (
          <div className="max-w-md mx-auto p-3.5 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center space-y-1 animate-bounce-gentle">
            <div className="font-black text-emerald-900 text-sm flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Tuyệt vời! Bé Gạo đã tìm ra đáp án đúng!</span>
            </div>
            <p className="text-xs text-emerald-800 font-semibold">{currentQ.explanationVi}</p>
          </div>
        )}
      </div>

      {/* 6. BOTTOM NAVIGATION BAR */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 border transition-all ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 cursor-pointer active:scale-95 shadow-2xs'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Câu trước</span>
        </button>

        <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          ⭐ Điểm: {score}
        </span>

        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white cursor-pointer active:scale-95 shadow-xs"
        >
          <span>{currentIndex + 1 < SUBSTITUTION_QUESTIONS.length ? 'Câu tiếp theo' : 'Hoàn thành bài'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
