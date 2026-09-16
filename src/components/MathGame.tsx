import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, ChevronRight, Trophy, Flag, Brain, Award, Layers, Scale, Sparkle, Bot, GraduationCap } from 'lucide-react';
import { GradeLevel, MathGameMode, ParentSettings } from '../types';
import {
  COUNTING_QUESTIONS,
  SHAPE_QUESTIONS,
  MathCountingQuestion,
  ShapeQuestion,
} from '../data/lessons';
import {
  GRADE_CURRICULUM_INFO,
  GRADE_SPEED_MATH,
  GRADE_COMPARISONS,
  GradeSpeedMathItem,
  GradeComparisonItem,
} from '../data/gradeCurriculum';
import { translations } from '../utils/translations';
import { soundFx, speakText } from '../utils/audio';

// Modular Thinking Components
import { SubstitutionGame } from './math/SubstitutionGame';
import { OlympicGame } from './math/OlympicGame';
import { BalancePatternGame } from './math/BalancePatternGame';
import { AIPracticeCard } from './ai/AIPracticeCard';

interface MathGameProps {
  settings: ParentSettings;
  gradeLevel?: GradeLevel;
  childName?: string;
  onFinishExercise: (subject: 'math', mode: string, score: number, total: number, stars: number) => void;
}

export const MathGame: React.FC<MathGameProps> = ({
  settings,
  gradeLevel = 'grade_1',
  childName = 'bé',
  onFinishExercise,
}) => {
  // Age Group Switcher (Preschool vs Primary - matching Image 3)
  const [ageStage, setAgeStage] = useState<'preschool' | 'primary'>('primary');

  // Broad Category: 'foundation' | 'advanced_thinking' | 'olympic' | 'ai'
  const [curriculumCategory, setCurriculumCategory] = useState<'foundation' | 'advanced_thinking' | 'olympic' | 'ai'>('advanced_thinking');

  // Sub-modes
  const [mode, setMode] = useState<MathGameMode>('substitution');
  const t = translations[settings.language];

  const currentGradeInfo = GRADE_CURRICULUM_INFO[gradeLevel] || GRADE_CURRICULUM_INFO.grade_1;
  const gradeSpeedMathList = GRADE_SPEED_MATH[gradeLevel] || GRADE_SPEED_MATH.grade_1;
  const gradeComparisonList = GRADE_COMPARISONS[gradeLevel] || GRADE_COMPARISONS.grade_1;

  // Foundation Mode States
  // 1. Counting state
  const [countingIndex, setCountingIndex] = useState(0);
  const [countingScore, setCountingScore] = useState(0);
  const [countingFeedback, setCountingFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [countedCount, setCountedCount] = useState<number[]>([]);
  const [selectedCountingAnswer, setSelectedCountingAnswer] = useState<number | null>(null);

  // 2. Speed Math state
  const [mathIndex, setMathIndex] = useState(0);
  const [mathScore, setMathScore] = useState(0);
  const [carPositionPercent, setCarPositionPercent] = useState(10);
  const [selectedMathAnswer, setSelectedMathAnswer] = useState<number | null>(null);
  const [mathFeedback, setMathFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // 3. Comparison state
  const [cmpIndex, setCmpIndex] = useState(0);
  const [cmpScore, setCmpScore] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [cmpFeedback, setCmpFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // 4. Shapes state
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
      speakText(`${next.length}`, 'vi', settings.speechEnabled);
    }
  };

  const handleSelectCountAnswer = (ans: number) => {
    if (countingFeedback === 'correct') return;
    setSelectedCountingAnswer(ans);
    if (ans === currentCount.count) {
      soundFx.playSuccess(settings.soundEnabled);
      setCountingFeedback('correct');
      setCountingScore((prev) => prev + 1);
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
      onFinishExercise('math', 'counting', countingScore + (countingFeedback === 'correct' ? 1 : 0), COUNTING_QUESTIONS.length, 3);
      setCountingIndex(0);
      setCountingScore(0);
    }
  };

  // SPEED MATH HANDLERS (Grade synchronized)
  const currentMath = gradeSpeedMathList[mathIndex % gradeSpeedMathList.length];
  const handleSelectMathAnswer = (val: number) => {
    if (mathFeedback === 'correct') return;
    setSelectedMathAnswer(val);

    if (val === currentMath.result) {
      soundFx.playSuccess(settings.soundEnabled);
      setMathFeedback('correct');
      setMathScore((prev) => prev + 1);
      setCarPositionPercent((prev) => Math.min(prev + 18, 90));
    } else {
      soundFx.playError(settings.soundEnabled);
      setMathFeedback('wrong');
    }
  };

  const handleNextMath = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedMathAnswer(null);
    setMathFeedback('none');

    if (mathIndex + 1 < gradeSpeedMathList.length) {
      setMathIndex((prev) => prev + 1);
    } else {
      onFinishExercise('math', 'speed_math', mathScore + (mathFeedback === 'correct' ? 1 : 0), gradeSpeedMathList.length, 3);
      setMathIndex(0);
      setMathScore(0);
      setCarPositionPercent(10);
    }
  };

  // COMPARISON HANDLERS (Grade synchronized)
  const currentCmp = gradeComparisonList[cmpIndex % gradeComparisonList.length];
  const handleSelectSymbol = (sym: '>' | '<' | '=') => {
    if (cmpFeedback === 'correct') return;
    setSelectedSymbol(sym);

    if (sym === currentCmp.correctSymbol) {
      soundFx.playSuccess(settings.soundEnabled);
      setCmpFeedback('correct');
      setCmpScore((prev) => prev + 1);
    } else {
      soundFx.playError(settings.soundEnabled);
      setCmpFeedback('wrong');
    }
  };

  const handleNextComparison = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedSymbol(null);
    setCmpFeedback('none');

    if (cmpIndex + 1 < gradeComparisonList.length) {
      setCmpIndex((prev) => prev + 1);
    } else {
      onFinishExercise('math', 'comparison', cmpScore + (cmpFeedback === 'correct' ? 1 : 0), gradeComparisonList.length, 3);
      setCmpIndex(0);
      setCmpScore(0);
    }
  };

  // SHAPES HANDLERS
  const currentShape: ShapeQuestion = SHAPE_QUESTIONS[shapeIndex];
  const handleSelectShapeOption = (optId: string, isCorrect: boolean) => {
    if (shapeFeedback === 'correct') return;
    setSelectedShapeOptionId(optId);

    if (isCorrect) {
      soundFx.playSuccess(settings.soundEnabled);
      setShapeFeedback('correct');
      setShapeScore((prev) => prev + 1);
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
      onFinishExercise('math', 'shapes', shapeScore + (shapeFeedback === 'correct' ? 1 : 0), SHAPE_QUESTIONS.length, 3);
      setShapeIndex(0);
      setShapeScore(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Grade Synchronized Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 rounded-3xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-2xl border border-white/20 shadow-xs">
            📐
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-900 font-black text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                {currentGradeInfo.titleVi} ({currentGradeInfo.ageRange})
              </span>
              <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white/30">
                ⚡ Tự động đồng bộ chuẩn Bộ GD&ĐT
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-1">Toán Học Phát Triển Toàn Diện</h2>
            <p className="text-xs text-sky-100 font-medium">{currentGradeInfo.mathFocus}</p>
          </div>
        </div>
      </div>

      {/* 1. AGE STAGE SELECTOR (Image 3 Inspiration) */}
      <div className="bg-white rounded-2xl p-2.5 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-700">Lứa tuổi rèn luyện:</span>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setAgeStage('preschool');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                ageStage === 'preschool'
                  ? 'bg-amber-400 text-amber-950 shadow-2xs scale-102'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌟 Mầm non (3-5 tuổi)
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setAgeStage('primary');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                ageStage === 'primary'
                  ? 'bg-sky-500 text-white shadow-2xs scale-102'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎒 {currentGradeInfo.titleVi}
            </button>
          </div>
        </div>

        {/* Major Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5">
          <button
            type="button"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setCurriculumCategory('ai');
              setMode('ai_challenge');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              curriculumCategory === 'ai'
                ? 'bg-purple-600 text-white shadow-xs scale-102 ring-2 ring-purple-300'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>✨ Thử Thách AI Cấp Lớp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setCurriculumCategory('advanced_thinking');
              setMode('substitution');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              curriculumCategory === 'advanced_thinking'
                ? 'bg-amber-500 text-white shadow-xs scale-102'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>IQ & Tư Duy Nâng Cao</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setCurriculumCategory('olympic');
              setMode('olympic_math');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              curriculumCategory === 'olympic'
                ? 'bg-indigo-600 text-white shadow-xs scale-102'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Toán Olympic (TIMO/SASMO)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setCurriculumCategory('foundation');
              setMode('speed_math');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              curriculumCategory === 'foundation'
                ? 'bg-sky-500 text-white shadow-xs scale-102'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tư Duy Nền Tảng</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-MODE SUB-NAV (Depends on selected Curriculum Category) */}
      {curriculumCategory === 'advanced_thinking' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('substitution');
            }}
            className={`p-2.5 rounded-2xl font-black text-xs border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'substitution'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-amber-50 border-amber-200'
            }`}
          >
            <span className="text-base">🍓</span>
            <span>So sánh & Thay thế</span>
          </button>

          <button
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('balance');
            }}
            className={`p-2.5 rounded-2xl font-black text-xs border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'balance'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-amber-50 border-amber-200'
            }`}
          >
            <span className="text-base">⚖️</span>
            <span>Cân thăng bằng</span>
          </button>

          <button
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('pattern');
            }}
            className={`p-2.5 rounded-2xl font-black text-xs border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'pattern'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-amber-50 border-amber-200'
            }`}
          >
            <span className="text-base">🔮</span>
            <span>Bài toán Quy luật</span>
          </button>

          <button
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('geometry_count');
            }}
            className={`p-2.5 rounded-2xl font-black text-xs border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'geometry_count'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-amber-50 border-amber-200'
            }`}
          >
            <span className="text-base">📐</span>
            <span>Đếm hình & Khối 3D</span>
          </button>
        </div>
      )}

      {curriculumCategory === 'foundation' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            id="btn-math-mode-count"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('counting');
            }}
            className={`p-2.5 rounded-2xl font-extrabold text-xs border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'counting'
                ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-sky-50 border-sky-200'
            }`}
          >
            <span className="text-base">🍎</span>
            <span>{t.mathModeCounting}</span>
          </button>

          <button
            id="btn-math-mode-speed"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('speed_math');
            }}
            className={`p-2.5 rounded-2xl font-extrabold text-xs border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'speed_math'
                ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-sky-50 border-sky-200'
            }`}
          >
            <span className="text-base">🏎️</span>
            <span>{t.mathModeSpeed}</span>
          </button>

          <button
            id="btn-math-mode-compare"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('comparison');
            }}
            className={`p-2.5 rounded-2xl font-extrabold text-xs border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'comparison'
                ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-sky-50 border-sky-200'
            }`}
          >
            <span className="text-base">⚖️</span>
            <span>{t.mathModeCompare}</span>
          </button>

          <button
            id="btn-math-mode-shapes"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('shapes');
            }}
            className={`p-2.5 rounded-2xl font-extrabold text-xs border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'shapes'
                ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-sky-50 border-sky-200'
            }`}
          >
            <span className="text-base">🔷</span>
            <span>{t.mathModeShapes}</span>
          </button>
        </div>
      )}

      {/* 3. ACTIVE GAME PLAY ENGINE */}

      {/* AI THỬ THÁCH THÍCH ỨNG THEO LỚP */}
      {(mode === 'ai_challenge' || curriculumCategory === 'ai') && (
        <AIPracticeCard
          subject="math"
          gradeLevel={gradeLevel}
          childName={childName}
          settings={settings}
          onAnswerCorrect={(stars) => {
            onFinishExercise('math', 'ai_challenge', 1, 1, stars);
          }}
        />
      )}

      {/* SO SÁNH VÀ THAY THẾ (Matching Image 1) */}
      {curriculumCategory !== 'ai' && mode === 'substitution' && (
        <SubstitutionGame
          settings={settings}
          onFinishExercise={onFinishExercise}
        />
      )}

      {/* TOÁN CÂN BẰNG, QUY LUẬT & HÌNH HỌC */}
      {curriculumCategory !== 'ai' && (mode === 'balance' || mode === 'pattern' || mode === 'geometry_count') && (
        <BalancePatternGame
          settings={settings}
          subType={mode as 'balance' | 'pattern' | 'geometry_count'}
          onFinishExercise={onFinishExercise}
        />
      )}

      {/* TOÁN OLYMPIC QUỐC TẾ */}
      {curriculumCategory !== 'ai' && mode === 'olympic_math' && (
        <OlympicGame
          settings={settings}
          onFinishExercise={onFinishExercise}
        />
      )}

      {/* FOUNDATION: COUNTING 1-20 */}
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
                ? 'Bấm chạm vào từng hình để đếm số, sau đó chọn số tương ứng:'
                : 'Tap each item to count, then choose the correct number:'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
              {currentCount.options.map((opt) => {
                const isSelected = selectedCountingAnswer === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectCountAnswer(opt)}
                    className={`py-3.5 px-4 rounded-2xl font-black text-2xl border-2 transition-all cursor-pointer active:scale-95 ${
                      isSelected && countingFeedback === 'correct'
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                        : isSelected && countingFeedback === 'wrong'
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-white hover:bg-sky-50 border-sky-200 text-slate-800'
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
              <span className="font-black text-emerald-800">{t.correct}</span>
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

      {/* FOUNDATION: SPEED RACING MATH */}
      {mode === 'speed_math' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-sky-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div>
              <span className="text-xs font-extrabold text-sky-600 bg-sky-100 px-2.5 py-1 rounded-full">
                Vòng {(mathIndex % gradeSpeedMathList.length) + 1}/{gradeSpeedMathList.length} ({currentGradeInfo.titleVi})
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 mt-1">{t.speedMathPrompt}</h3>
            </div>
            <span className="font-black text-amber-600 text-sm bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {mathScore}
            </span>
          </div>

          {/* Racetrack track */}
          <div className="relative bg-slate-800 rounded-3xl p-4 overflow-hidden border-2 border-slate-700 h-28 flex items-center">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b-2 border-dashed border-amber-400/60" />
            <div className="absolute right-4 top-2 bottom-2 flex flex-col items-center justify-center border-l-4 border-white/60 pl-2">
              <Flag className="w-6 h-6 text-amber-400" />
              <span className="text-[10px] font-black text-white uppercase">Đích</span>
            </div>
            <div
              className="absolute transition-all duration-700 ease-out"
              style={{ left: `${carPositionPercent}%`, transform: 'translateY(-15%)' }}
            >
              <span className="text-4xl filter drop-shadow-md">🏎️</span>
            </div>
          </div>

          <div className="text-center py-2">
            <div className="text-4xl sm:text-5xl font-black text-sky-950 tracking-wider">
              {currentMath.expression} = ?
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {currentMath.options.map((opt) => {
              const isSelected = selectedMathAnswer === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelectMathAnswer(opt)}
                  className={`py-4 rounded-2xl font-black text-2xl border-2 transition-all cursor-pointer active:scale-95 ${
                    isSelected && mathFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                      : isSelected && mathFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-sky-50 border-sky-200 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {mathFeedback === 'correct' && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-between">
              <span className="font-black text-emerald-800">Xe của bé tăng tốc vù vù! Tiếp tục nào!</span>
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

      {/* FOUNDATION: COMPARISON */}
      {mode === 'comparison' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-sky-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div>
              <span className="text-xs font-extrabold text-sky-600 bg-sky-100 px-2.5 py-1 rounded-full">
                Bài {(cmpIndex % gradeComparisonList.length) + 1}/{gradeComparisonList.length} ({currentGradeInfo.titleVi})
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 mt-1">{t.comparePrompt}</h3>
            </div>
            <span className="font-black text-amber-600 text-sm bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {cmpScore}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center max-w-lg mx-auto py-3">
            <div className="bg-sky-50 p-4 rounded-3xl border-2 border-sky-200 text-center">
              <div className="text-2xl sm:text-3xl mb-2 flex justify-center items-center font-bold text-sky-800">
                {currentCmp.leftEmoji}
              </div>
              <span className="font-black text-3xl text-sky-900">{currentCmp.leftText}</span>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center font-black text-3xl text-amber-900 shadow-inner">
                {selectedSymbol || '?'}
              </div>
            </div>

            <div className="bg-sky-50 p-4 rounded-3xl border-2 border-sky-200 text-center">
              <div className="text-2xl sm:text-3xl mb-2 flex justify-center items-center font-bold text-sky-800">
                {currentCmp.rightEmoji}
              </div>
              <span className="font-black text-3xl text-sky-900">{currentCmp.rightText}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {(['>', '<', '='] as const).map((sym) => {
              const isSelected = selectedSymbol === sym;
              return (
                <button
                  key={sym}
                  onClick={() => handleSelectSymbol(sym)}
                  className={`py-4 rounded-2xl font-black text-3xl border-2 transition-all cursor-pointer active:scale-95 ${
                    isSelected && cmpFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                      : isSelected && cmpFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-sky-50 border-sky-200 text-slate-800'
                  }`}
                >
                  {sym}
                </button>
              );
            })}
          </div>

          {cmpFeedback === 'correct' && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-between">
              <span className="font-black text-emerald-800">{t.correct}</span>
              <button
                id="btn-next-cmp"
                onClick={handleNextComparison}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1"
              >
                <span>{t.nextQuestion}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* FOUNDATION: SHAPES IDENTIFICATION */}
      {mode === 'shapes' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-sky-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div>
              <span className="text-xs font-extrabold text-sky-600 bg-sky-100 px-2.5 py-1 rounded-full">
                Bài {shapeIndex + 1}/{SHAPE_QUESTIONS.length}
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 mt-1">{t.shapesPrompt}</h3>
            </div>
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
