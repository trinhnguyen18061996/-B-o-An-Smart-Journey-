import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, ChevronRight, Trophy, Flag } from 'lucide-react';
import { MathGameMode, ParentSettings } from '../types';
import {
  COUNTING_QUESTIONS,
  SPEED_MATH_QUESTIONS,
  COMPARISON_QUESTIONS,
  SHAPE_QUESTIONS,
  MathCountingQuestion,
  SpeedMathQuestion,
  ComparisonQuestion,
  ShapeQuestion,
} from '../data/lessons';
import { translations } from '../utils/translations';
import { soundFx, speakText } from '../utils/audio';

interface MathGameProps {
  settings: ParentSettings;
  onFinishExercise: (subject: 'math', mode: string, score: number, total: number, stars: number) => void;
}

export const MathGame: React.FC<MathGameProps> = ({
  settings,
  onFinishExercise,
}) => {
  const [mode, setMode] = useState<MathGameMode>('counting');
  const t = translations[settings.language];

  // Counting state
  const [countingIndex, setCountingIndex] = useState(0);
  const [countingScore, setCountingScore] = useState(0);
  const [countingFeedback, setCountingFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [countedCount, setCountedCount] = useState<number[]>([]);
  const [selectedCountingAnswer, setSelectedCountingAnswer] = useState<number | null>(null);

  // Speed Math state
  const [mathIndex, setMathIndex] = useState(0);
  const [mathScore, setMathScore] = useState(0);
  const [carPositionPercent, setCarPositionPercent] = useState(10);
  const [selectedMathAnswer, setSelectedMathAnswer] = useState<number | null>(null);
  const [mathFeedback, setMathFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // Comparison state
  const [cmpIndex, setCmpIndex] = useState(0);
  const [cmpScore, setCmpScore] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [cmpFeedback, setCmpFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // Shapes state
  const [shapeIndex, setShapeIndex] = useState(0);
  const [shapeScore, setShapeScore] = useState(0);
  const [selectedShapeOptionId, setSelectedShapeOptionId] = useState<string | null>(null);
  const [shapeFeedback, setShapeFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // COUNTING HANDLERS
  const currentCount: MathCountingQuestion = COUNTING_QUESTIONS[countingIndex];
  const handleItemTap = (idx: number) => {
    soundFx.playPop(settings.soundEnabled);
    if (!countedCount.includes(idx)) {
      const next = [...countedCount, idx];
      setCountedCount(next);
      speakText(String(next.length), 'vi', settings.speechEnabled);
    }
  };

  const handlePickCountAnswer = (ans: number) => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedCountingAnswer(ans);
    if (ans === currentCount.count) {
      soundFx.playSuccess(settings.soundEnabled);
      setCountingFeedback('correct');
      setCountingScore((s) => s + 1);
      speakText(`Chính xác! Có ${ans} ${currentCount.nameVi}`, 'vi', settings.speechEnabled);
    } else {
      soundFx.playError(settings.soundEnabled);
      setCountingFeedback('wrong');
    }
  };

  const handleNextCounting = () => {
    soundFx.playPop(settings.soundEnabled);
    setCountedCount([]);
    setSelectedCountingAnswer(null);
    setCountingFeedback('none');
    if (countingIndex + 1 < COUNTING_QUESTIONS.length) {
      setCountingIndex((prev) => prev + 1);
    } else {
      onFinishExercise('math', 'counting', countingScore, COUNTING_QUESTIONS.length, 3);
      setCountingIndex(0);
      setCountingScore(0);
    }
  };

  // SPEED MATH HANDLERS
  const currentMath: SpeedMathQuestion = SPEED_MATH_QUESTIONS[mathIndex];
  const handleSelectMath = (ans: number) => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedMathAnswer(ans);
    if (ans === currentMath.result) {
      soundFx.playSuccess(settings.soundEnabled);
      setMathFeedback('correct');
      setMathScore((s) => s + 1);
      const nextPos = Math.min(90, carPositionPercent + 16);
      setCarPositionPercent(nextPos);
      speakText(`${currentMath.num1} ${currentMath.op === '+' ? 'cộng' : 'trừ'} ${currentMath.num2} bằng ${currentMath.result}`, 'vi', settings.speechEnabled);
    } else {
      soundFx.playError(settings.soundEnabled);
      setMathFeedback('wrong');
    }
  };

  const handleNextMath = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedMathAnswer(null);
    setMathFeedback('none');
    if (mathIndex + 1 < SPEED_MATH_QUESTIONS.length) {
      setMathIndex((prev) => prev + 1);
    } else {
      onFinishExercise('math', 'speed_math', mathScore, SPEED_MATH_QUESTIONS.length, 3);
      setMathIndex(0);
      setMathScore(0);
      setCarPositionPercent(10);
    }
  };

  // COMPARISON HANDLERS
  const currentCmp: ComparisonQuestion = COMPARISON_QUESTIONS[cmpIndex];
  const handleSelectSymbol = (sym: '>' | '<' | '=') => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedSymbol(sym);
    if (sym === currentCmp.correctSymbol) {
      soundFx.playSuccess(settings.soundEnabled);
      setCmpFeedback('correct');
      setCmpScore((s) => s + 1);
      const spokenSym = sym === '>' ? 'lớn hơn' : sym === '<' ? 'bé hơn' : 'bằng';
      speakText(`${currentCmp.leftText} ${spokenSym} ${currentCmp.rightText}`, 'vi', settings.speechEnabled);
    } else {
      soundFx.playError(settings.soundEnabled);
      setCmpFeedback('wrong');
    }
  };

  const handleNextCmp = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedSymbol(null);
    setCmpFeedback('none');
    if (cmpIndex + 1 < COMPARISON_QUESTIONS.length) {
      setCmpIndex((prev) => prev + 1);
    } else {
      onFinishExercise('math', 'comparison', cmpScore, COMPARISON_QUESTIONS.length, 3);
      setCmpIndex(0);
      setCmpScore(0);
    }
  };

  // SHAPES HANDLERS
  const currentShape: ShapeQuestion = SHAPE_QUESTIONS[shapeIndex];
  const handleSelectShapeOption = (optId: string, isCorrect: boolean) => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedShapeOptionId(optId);
    if (isCorrect) {
      soundFx.playSuccess(settings.soundEnabled);
      setShapeFeedback('correct');
      setShapeScore((s) => s + 1);
      speakText(`Chính xác! Đây là ${currentShape.shapeNameVi}`, 'vi', settings.speechEnabled);
    } else {
      soundFx.playError(settings.soundEnabled);
      setShapeFeedback('wrong');
    }
  };

  const handleNextShape = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedShapeOptionId(null);
    setShapeFeedback('none');
    if (shapeIndex + 1 < SHAPE_QUESTIONS.length) {
      setShapeIndex((prev) => prev + 1);
    } else {
      onFinishExercise('math', 'shapes', shapeScore, SHAPE_QUESTIONS.length, 3);
      setShapeIndex(0);
      setShapeScore(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          id="btn-math-mode-counting"
          onClick={() => {
            soundFx.playPop(settings.soundEnabled);
            setMode('counting');
          }}
          className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
            mode === 'counting'
              ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-sky-50 border-sky-200'
          }`}
        >
          <span className="text-xl">🍎</span>
          <span>{t.mathModeCounting}</span>
        </button>

        <button
          id="btn-math-mode-speed"
          onClick={() => {
            soundFx.playPop(settings.soundEnabled);
            setMode('speed_math');
          }}
          className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
            mode === 'speed_math'
              ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-sky-50 border-sky-200'
          }`}
        >
          <span className="text-xl">🏎️</span>
          <span>{t.mathModeSpeed}</span>
        </button>

        <button
          id="btn-math-mode-compare"
          onClick={() => {
            soundFx.playPop(settings.soundEnabled);
            setMode('comparison');
          }}
          className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
            mode === 'comparison'
              ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-sky-50 border-sky-200'
          }`}
        >
          <span className="text-xl">⚖️</span>
          <span>{t.mathModeCompare}</span>
        </button>

        <button
          id="btn-math-mode-shapes"
          onClick={() => {
            soundFx.playPop(settings.soundEnabled);
            setMode('shapes');
          }}
          className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
            mode === 'shapes'
              ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-sky-50 border-sky-200'
          }`}
        >
          <span className="text-xl">🔷</span>
          <span>{t.mathModeShapes}</span>
        </button>
      </div>

      {/* MODE 1: COUNTING 1-20 */}
      {mode === 'counting' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-sky-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div>
              <span className="text-xs font-extrabold text-sky-600 bg-sky-100 px-2.5 py-1 rounded-full">
                Bài {countingIndex + 1}/{COUNTING_QUESTIONS.length}
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 mt-1">{t.countObjectsPrompt}</h3>
            </div>
            <span className="font-black text-amber-600 text-sm bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {countingScore}
            </span>
          </div>

          {/* Interactive Item Garden / Farm */}
          <div className="bg-gradient-to-b from-sky-50 to-emerald-50/50 p-6 rounded-3xl border-2 border-sky-200 text-center min-h-[170px] flex items-center justify-center">
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-xl">
              {[...Array(currentCount.count)].map((_, i) => {
                const isCounted = countedCount.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => handleItemTap(i)}
                    className={`relative p-2 rounded-2xl transition-all cursor-pointer active:scale-95 ${
                      isCounted
                        ? 'bg-amber-300 scale-110 shadow-md border-2 border-amber-500'
                        : 'bg-white/80 hover:bg-white hover:scale-105 border border-sky-200'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl select-none block">
                      {currentCount.itemEmoji}
                    </span>
                    {isCounted && (
                      <span className="absolute -top-2 -right-2 bg-emerald-600 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border border-white">
                        {countedCount.indexOf(i) + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-bold text-slate-500 mb-2">
              {settings.language === 'vi'
                ? `💡 Bé có thể chạm vào từng ${currentCount.nameVi} để đếm, rồi chọn đáp án bên dưới:`
                : 'Tap items to count them, then choose the correct number below:'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
              {currentCount.options.map((opt) => {
                const isSelected = selectedCountingAnswer === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handlePickCountAnswer(opt)}
                    className={`p-4 rounded-2xl font-black text-3xl border-2 transition-all cursor-pointer active:scale-95 ${
                      isSelected && countingFeedback === 'correct'
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                        : isSelected && countingFeedback === 'wrong'
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-800'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {countingFeedback === 'correct' && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-between">
              <span className="font-black text-emerald-800">
                {t.correct} ({currentCount.count} {currentCount.nameVi})
              </span>
              <button
                id="btn-next-counting"
                onClick={handleNextCounting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1"
              >
                <span>{t.nextQuestion}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: SPEED MATH RACING */}
      {mode === 'speed_math' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-sky-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div>
              <span className="text-xs font-extrabold text-sky-600 bg-sky-100 px-2.5 py-1 rounded-full">
                Vòng đua {mathIndex + 1}/{SPEED_MATH_QUESTIONS.length}
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 mt-1">{t.solvePrompt}</h3>
            </div>
            <span className="font-black text-amber-600 text-sm bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {mathScore}
            </span>
          </div>

          {/* Animated Race Track */}
          <div className="bg-slate-800 rounded-3xl p-4 sm:p-5 relative overflow-hidden border-2 border-slate-700 shadow-inner">
            {/* Road lines */}
            <div className="border-b-2 border-dashed border-amber-400/80 my-3"></div>

            <div className="relative h-14 flex items-center">
              {/* Finish Flag */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center text-rose-400">
                <Flag className="w-7 h-7 fill-rose-500 text-white animate-bounce-gentle" />
                <span className="text-[10px] font-black text-amber-300 uppercase">Đích</span>
              </div>

              {/* Race Car */}
              <div
                className="absolute transition-all duration-700 ease-out text-4xl sm:text-5xl"
                style={{ left: `${carPositionPercent}%`, transform: 'translateX(-50%)' }}
              >
                🏎️
              </div>
            </div>

            <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1">
              <span>Xuất phát 🚦</span>
              <span>Về đích 🏁</span>
            </div>
          </div>

          {/* Math Problem Display */}
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-3 bg-sky-50 border-3 border-sky-300 px-6 py-4 rounded-3xl shadow-sm">
              <span className="text-4xl sm:text-5xl font-black text-slate-900">{currentMath.num1}</span>
              <span className="text-4xl sm:text-5xl font-black text-sky-600">{currentMath.op}</span>
              <span className="text-4xl sm:text-5xl font-black text-slate-900">{currentMath.num2}</span>
              <span className="text-4xl sm:text-5xl font-black text-slate-400">=</span>
              <span className="text-4xl sm:text-5xl font-black text-amber-600 bg-white px-4 py-1 rounded-2xl border-2 border-dashed border-amber-400">
                {selectedMathAnswer !== null ? selectedMathAnswer : '?'}
              </span>
            </div>
          </div>

          {/* Multiple choice options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
            {currentMath.options.map((opt) => {
              const isSelected = selectedMathAnswer === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelectMath(opt)}
                  className={`p-4 rounded-2xl font-black text-3xl border-2 transition-all cursor-pointer active:scale-95 ${
                    isSelected && mathFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                      : isSelected && mathFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-sky-100 border-sky-300 text-slate-900'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {mathFeedback === 'correct' && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-between">
              <span className="font-black text-emerald-800">
                {t.correct} ({currentMath.num1} {currentMath.op} {currentMath.num2} = {currentMath.result})
              </span>
              <button
                id="btn-next-math"
                onClick={handleNextMath}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1"
              >
                <span>{t.nextQuestion}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: COMPARISON >, <, = */}
      {mode === 'comparison' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-sky-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <span className="text-xs font-extrabold text-sky-600 bg-sky-100 px-2.5 py-1 rounded-full">
              Câu {cmpIndex + 1}/{COMPARISON_QUESTIONS.length}
            </span>
            <span className="font-black text-amber-600 text-sm bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {cmpScore}
            </span>
          </div>

          <div className="text-center py-2">
            <p className="text-xs font-bold text-slate-500">{t.comparePrompt}</p>

            <div className="flex items-center justify-center gap-4 sm:gap-6 my-4">
              {/* Left Side */}
              <div className="bg-sky-50 p-4 sm:p-6 rounded-3xl border-2 border-sky-300 text-center min-w-[100px] sm:min-w-[130px]">
                <div className="text-3xl sm:text-4xl font-black text-sky-900">
                  {currentCmp.leftText}
                </div>
                <div className="text-xs text-sky-600 font-bold mt-1">{currentCmp.leftEmoji}</div>
              </div>

              {/* Middle Comparison Slot */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 border-3 border-dashed border-amber-400 rounded-3xl flex items-center justify-center font-black text-4xl text-amber-800 shadow-inner">
                {selectedSymbol || '?'}
              </div>

              {/* Right Side */}
              <div className="bg-sky-50 p-4 sm:p-6 rounded-3xl border-2 border-sky-300 text-center min-w-[100px] sm:min-w-[130px]">
                <div className="text-3xl sm:text-4xl font-black text-sky-900">
                  {currentCmp.rightText}
                </div>
                <div className="text-xs text-sky-600 font-bold mt-1">{currentCmp.rightEmoji}</div>
              </div>
            </div>
          </div>

          {/* Symbol Buttons: > < = */}
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {(['>', '=', '<'] as const).map((sym) => {
              const isSelected = selectedSymbol === sym;
              return (
                <button
                  key={sym}
                  onClick={() => handleSelectSymbol(sym)}
                  className={`p-4 rounded-3xl font-black text-4xl border-3 transition-all cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-1 ${
                    isSelected && cmpFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                      : isSelected && cmpFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-amber-100 border-amber-300 text-amber-900'
                  }`}
                >
                  <span>{sym}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {sym === '>' ? 'Lớn Hơn' : sym === '<' ? 'Bé Hơn' : 'Bằng Nhau'}
                  </span>
                </button>
              );
            })}
          </div>

          {cmpFeedback === 'correct' && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-between">
              <span className="font-black text-emerald-800">
                {t.correct} ({currentCmp.leftText} {currentCmp.correctSymbol} {currentCmp.rightText})
              </span>
              <button
                id="btn-next-cmp"
                onClick={handleNextCmp}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1"
              >
                <span>{t.nextQuestion}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 4: SHAPES & GEOMETRY */}
      {mode === 'shapes' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-sky-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <span className="text-xs font-extrabold text-sky-600 bg-sky-100 px-2.5 py-1 rounded-full">
              Câu {shapeIndex + 1}/{SHAPE_QUESTIONS.length}
            </span>
            <span className="font-black text-amber-600 text-sm bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {shapeScore}
            </span>
          </div>

          <div className="text-center py-2">
            <div className="text-6xl sm:text-7xl mb-2 animate-bounce-gentle inline-block">
              {currentShape.emoji}
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-sky-900">
              {currentShape.shapeNameVi}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {settings.language === 'vi' ? 'Đồ vật nào dưới đây có hình dạng này?' : 'Which object below has this shape?'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
            {currentShape.options.map((opt) => {
              const isSelected = selectedShapeOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectShapeOption(opt.id, opt.isCorrect)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-2 ${
                    isSelected && shapeFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                      : isSelected && shapeFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-sky-50 border-sky-200 text-slate-800'
                  }`}
                >
                  <span className="text-5xl">{opt.emoji}</span>
                  <span className="font-extrabold text-sm">
                    {settings.language === 'vi' ? opt.nameVi : opt.nameEn}
                  </span>
                </button>
              );
            })}
          </div>

          {shapeFeedback === 'correct' && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-between">
              <span className="font-black text-emerald-800">{t.correct}</span>
              <button
                id="btn-next-shape"
                onClick={handleNextShape}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1"
              >
                <span>{t.nextQuestion}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
