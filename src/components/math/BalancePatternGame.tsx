import React, { useState } from 'react';
import { Volume2, Scale, Sparkles, CheckCircle2, ChevronRight, HelpCircle, Layers } from 'lucide-react';
import { ParentSettings } from '../../types';
import {
  BALANCE_QUESTIONS,
  PATTERN_QUESTIONS,
  GEOMETRY_COUNT_QUESTIONS,
  BalanceQuestion,
  PatternQuestion,
  GeometryCountQuestion,
} from '../../data/thinkingLessons';
import { soundFx, speakText } from '../../utils/audio';

interface BalancePatternGameProps {
  settings: ParentSettings;
  subType: 'balance' | 'pattern' | 'geometry_count';
  onFinishExercise: (subject: 'math', mode: string, score: number, total: number, stars: number) => void;
}

export const BalancePatternGame: React.FC<BalancePatternGameProps> = ({
  settings,
  subType,
  onFinishExercise,
}) => {
  // Balance state
  const [balIndex, setBalIndex] = useState(0);
  const [balScore, setBalScore] = useState(0);
  const [selectedBalOption, setSelectedBalOption] = useState<number | null>(null);
  const [balFeedback, setBalFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // Pattern state
  const [patIndex, setPatIndex] = useState(0);
  const [patScore, setPatScore] = useState(0);
  const [selectedPatOption, setSelectedPatOption] = useState<string | null>(null);
  const [patFeedback, setPatFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // Geometry state
  const [geoIndex, setGeoIndex] = useState(0);
  const [geoScore, setGeoScore] = useState(0);
  const [selectedGeoOption, setSelectedGeoOption] = useState<number | null>(null);
  const [geoFeedback, setGeoFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // BALANCE HANDLERS
  const currentBal: BalanceQuestion = BALANCE_QUESTIONS[balIndex] || BALANCE_QUESTIONS[0];
  const handleSelectBalance = (val: number) => {
    if (balFeedback === 'correct') return;
    soundFx.playPop(settings.soundEnabled);
    setSelectedBalOption(val);

    if (val === currentBal.correctValue) {
      soundFx.playSuccess(settings.soundEnabled);
      setBalFeedback('correct');
      setBalScore((s) => s + 1);
    } else {
      soundFx.playError(settings.soundEnabled);
      setBalFeedback('wrong');
    }
  };

  const handleNextBalance = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedBalOption(null);
    setBalFeedback('none');

    if (balIndex + 1 < BALANCE_QUESTIONS.length) {
      setBalIndex((b) => b + 1);
    } else {
      onFinishExercise('math', 'balance', balScore + (balFeedback === 'correct' ? 1 : 0), BALANCE_QUESTIONS.length, 3);
      setBalIndex(0);
      setBalScore(0);
    }
  };

  // PATTERN HANDLERS
  const currentPat: PatternQuestion = PATTERN_QUESTIONS[patIndex] || PATTERN_QUESTIONS[0];
  const handleSelectPattern = (opt: string) => {
    if (patFeedback === 'correct') return;
    soundFx.playPop(settings.soundEnabled);
    setSelectedPatOption(opt);

    if (opt === currentPat.correctAnswer) {
      soundFx.playSuccess(settings.soundEnabled);
      setPatFeedback('correct');
      setPatScore((s) => s + 1);
    } else {
      soundFx.playError(settings.soundEnabled);
      setPatFeedback('wrong');
    }
  };

  const handleNextPattern = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedPatOption(null);
    setPatFeedback('none');

    if (patIndex + 1 < PATTERN_QUESTIONS.length) {
      setPatIndex((p) => p + 1);
    } else {
      onFinishExercise('math', 'pattern', patScore + (patFeedback === 'correct' ? 1 : 0), PATTERN_QUESTIONS.length, 3);
      setPatIndex(0);
      setPatScore(0);
    }
  };

  // GEOMETRY HANDLERS
  const currentGeo: GeometryCountQuestion = GEOMETRY_COUNT_QUESTIONS[geoIndex] || GEOMETRY_COUNT_QUESTIONS[0];
  const handleSelectGeometry = (ans: number) => {
    if (geoFeedback === 'correct') return;
    soundFx.playPop(settings.soundEnabled);
    setSelectedGeoOption(ans);

    if (ans === currentGeo.correctAnswer) {
      soundFx.playSuccess(settings.soundEnabled);
      setGeoFeedback('correct');
      setGeoScore((s) => s + 1);
    } else {
      soundFx.playError(settings.soundEnabled);
      setGeoFeedback('wrong');
    }
  };

  const handleNextGeometry = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedGeoOption(null);
    setGeoFeedback('none');

    if (geoIndex + 1 < GEOMETRY_COUNT_QUESTIONS.length) {
      setGeoIndex((g) => g + 1);
    } else {
      onFinishExercise('math', 'geometry_count', geoScore + (geoFeedback === 'correct' ? 1 : 0), GEOMETRY_COUNT_QUESTIONS.length, 3);
      setGeoIndex(0);
      setGeoScore(0);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-sm p-5 sm:p-7 space-y-6 animate-fade-in">
      {/* 1. BALANCE SCALE VIEW */}
      {subType === 'balance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-2xs">
                <Scale className="w-3.5 h-3.5" />
                <span>Toán Cân Bằng ⚖️</span>
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                Câu {balIndex + 1}/{BALANCE_QUESTIONS.length}
              </span>
            </div>
            <span className="font-black text-amber-600 text-xs bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {balScore}
            </span>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-800">{currentBal.questionVi}</h3>
            <p className="text-xs text-slate-500 italic">{currentBal.questionEn}</p>
          </div>

          {/* Interactive Balance Scale Visual */}
          <div className="max-w-md mx-auto bg-gradient-to-b from-sky-50 to-amber-50/50 p-6 rounded-3xl border-2 border-amber-300 text-center relative">
            <div className="text-4xl mb-3">⚖️</div>
            <div className="grid grid-cols-2 gap-4 items-center">
              {/* Left Pan */}
              <div className="p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-2xs space-y-2">
                <div className="text-[11px] font-black text-amber-900 uppercase">Đĩa Trái</div>
                <div className="text-3xl flex justify-center gap-1">
                  {[...Array(currentBal.leftPan.count)].map((_, i) => (
                    <span key={i}>{currentBal.leftPan.item}</span>
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-700">{currentBal.leftPan.label}</div>
              </div>

              {/* Right Pan */}
              <div className="p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-2xs space-y-2">
                <div className="text-[11px] font-black text-amber-900 uppercase">Đĩa Phải</div>
                <div className="text-3xl flex justify-center gap-1">
                  {[...Array(currentBal.rightPan.count)].map((_, i) => (
                    <span key={i}>{currentBal.rightPan.item}</span>
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-700">{currentBal.rightPan.label}</div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto">
            {currentBal.options.map((opt) => {
              const isSelected = selectedBalOption === opt.value;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectBalance(opt.value)}
                  className={`p-3.5 rounded-2xl font-black text-sm border-2 transition-all cursor-pointer ${
                    isSelected && balFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                      : isSelected && balFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-amber-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          {/* Explanation banner */}
          {balFeedback === 'correct' && (
            <div className="max-w-md mx-auto p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-950 text-sm">Chính xác!</span>
                <button
                  type="button"
                  onClick={handleNextBalance}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-emerald-900 font-medium">{currentBal.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* 2. PATTERNS VIEW */}
      {subType === 'pattern' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-2xs">
                <Layers className="w-3.5 h-3.5" />
                <span>Bài Toán Quy Luật</span>
              </span>
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                Câu {patIndex + 1}/{PATTERN_QUESTIONS.length}
              </span>
            </div>
            <span className="font-black text-amber-600 text-xs bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {patScore}
            </span>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-800">{currentPat.titleVi}</h3>
            <p className="text-xs text-slate-500 italic">Tìm hình hoặc số thích hợp điền vào dấu chấm hỏi [ ? ]</p>
          </div>

          {/* Sequence Carousel */}
          <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl border-2 border-purple-200 max-w-xl mx-auto overflow-x-auto">
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {currentPat.sequence.map((item, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl border-2 shadow-2xs ${
                    item === '❓'
                      ? 'bg-amber-300 border-amber-500 text-amber-950 animate-pulse'
                      : 'bg-white border-purple-200 text-slate-800'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Pattern Options */}
          <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
            {currentPat.options.map((opt) => {
              const isSelected = selectedPatOption === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelectPattern(opt)}
                  className={`w-14 h-14 rounded-2xl font-black text-2xl border-2 transition-all cursor-pointer flex items-center justify-center ${
                    isSelected && patFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                      : isSelected && patFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation banner */}
          {patFeedback === 'correct' && (
            <div className="max-w-md mx-auto p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-950 text-sm">Chính xác quy luật!</span>
                <button
                  type="button"
                  onClick={handleNextPattern}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-emerald-900 font-medium">{currentPat.ruleVi}</p>
            </div>
          )}
        </div>
      )}

      {/* 3. GEOMETRY COUNTING VIEW */}
      {subType === 'geometry_count' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-teal-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-teal-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span>Hình Học & Đếm Hình 📐</span>
              </span>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                Câu {geoIndex + 1}/{GEOMETRY_COUNT_QUESTIONS.length}
              </span>
            </div>
            <span className="font-black text-amber-600 text-xs bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {geoScore}
            </span>
          </div>

          <div className="max-w-md mx-auto bg-gradient-to-b from-teal-50 to-emerald-50 p-6 rounded-3xl border-2 border-teal-300 text-center space-y-3">
            <div className="text-6xl animate-bounce-gentle inline-block">{currentGeo.imageIcon}</div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">{currentGeo.descriptionVi}</h3>
            <p className="text-xs text-slate-500 italic">{currentGeo.descriptionEn}</p>
          </div>

          {/* Geometry choices */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
            {currentGeo.options.map((num) => {
              const isSelected = selectedGeoOption === num;
              return (
                <button
                  key={num}
                  onClick={() => handleSelectGeometry(num)}
                  className={`p-3.5 rounded-2xl font-black text-xl border-2 transition-all cursor-pointer ${
                    isSelected && geoFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                      : isSelected && geoFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-teal-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Explanation banner */}
          {geoFeedback === 'correct' && (
            <div className="max-w-md mx-auto p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-950 text-sm">Rất thông minh!</span>
                <button
                  type="button"
                  onClick={handleNextGeometry}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-emerald-900 font-medium">{currentGeo.explanationVi}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
