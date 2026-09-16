import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, ChevronRight, HelpCircle, Lightbulb, BookOpen, RotateCcw } from 'lucide-react';
import { ParentSettings } from '../../types';
import {
  ENGLISH_MATH_QUESTIONS,
  ENGLISH_WORD_SCRAMBLE,
  EnglishMathQuestion,
  EnglishWordScrambleQuestion,
} from '../../data/thinkingLessons';
import { soundFx, speakText } from '../../utils/audio';

interface EnglishThinkingGameProps {
  settings: ParentSettings;
  mode: 'english_math' | 'word_scramble';
  onFinishExercise: (subject: 'english', mode: string, score: number, total: number, stars: number) => void;
}

export const EnglishThinkingGame: React.FC<EnglishThinkingGameProps> = ({
  settings,
  mode,
  onFinishExercise,
}) => {
  // English Math State
  const [mathIdx, setMathIdx] = useState(0);
  const [mathScore, setMathScore] = useState(0);
  const [selectedMathOpt, setSelectedMathOpt] = useState<number | null>(null);
  const [mathFeedback, setMathFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [showMathHint, setShowMathHint] = useState(false);

  // Word Scramble State
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambleScore, setScrambleScore] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [scrambleFeedback, setScrambleFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // MATH HANDLERS
  const currentMath: EnglishMathQuestion = ENGLISH_MATH_QUESTIONS[mathIdx] || ENGLISH_MATH_QUESTIONS[0];
  const handleSelectMathOpt = (idx: number, isCorrect: boolean) => {
    if (mathFeedback === 'correct') return;
    soundFx.playPop(settings.soundEnabled);
    setSelectedMathOpt(idx);

    if (isCorrect) {
      soundFx.playSuccess(settings.soundEnabled);
      setMathFeedback('correct');
      setMathScore((s) => s + 1);
    } else {
      soundFx.playError(settings.soundEnabled);
      setMathFeedback('wrong');
    }
  };

  const handleNextMath = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedMathOpt(null);
    setMathFeedback('none');
    setShowMathHint(false);

    if (mathIdx + 1 < ENGLISH_MATH_QUESTIONS.length) {
      setMathIdx((m) => m + 1);
    } else {
      onFinishExercise('english', 'english_math', mathScore + (mathFeedback === 'correct' ? 1 : 0), ENGLISH_MATH_QUESTIONS.length, 3);
      setMathIdx(0);
      setMathScore(0);
    }
  };

  // SCRAMBLE HANDLERS
  const currentScramble: EnglishWordScrambleQuestion = ENGLISH_WORD_SCRAMBLE[scrambleIdx] || ENGLISH_WORD_SCRAMBLE[0];

  const handleTapLetter = (letter: string, index: number) => {
    soundFx.playPop(settings.soundEnabled);
    const next = [...selectedLetters, letter];
    setSelectedLetters(next);
    speakText(letter, 'en', settings.speechEnabled);

    if (next.length === currentScramble.scrambledLetters.length) {
      const formedWord = next.join('');
      if (formedWord === currentScramble.wordEn) {
        soundFx.playSuccess(settings.soundEnabled);
        setScrambleFeedback('correct');
        setScrambleScore((s) => s + 1);
      } else {
        soundFx.playError(settings.soundEnabled);
        setScrambleFeedback('wrong');
      }
    }
  };

  const handleResetLetters = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedLetters([]);
    setScrambleFeedback('none');
  };

  const handleNextScramble = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedLetters([]);
    setScrambleFeedback('none');

    if (scrambleIdx + 1 < ENGLISH_WORD_SCRAMBLE.length) {
      setScrambleIdx((s) => s + 1);
    } else {
      onFinishExercise('english', 'word_scramble', scrambleScore + (scrambleFeedback === 'correct' ? 1 : 0), ENGLISH_WORD_SCRAMBLE.length, 3);
      setScrambleIdx(0);
      setScrambleScore(0);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-sm p-5 sm:p-7 space-y-6 animate-fade-in">
      {/* 1. MATH IN ENGLISH */}
      {mode === 'english_math' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-xs">
                <span>🔤 Math in English</span>
              </span>
              <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                Question {mathIdx + 1}/{ENGLISH_MATH_QUESTIONS.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop(settings.soundEnabled);
                  speakText(currentMath.questionEn, 'en', settings.speechEnabled);
                }}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Read Aloud</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop(settings.soundEnabled);
                  setShowMathHint(!showMathHint);
                }}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Hint</span>
              </button>
              <span className="font-black text-amber-600 text-xs bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                ⭐ {mathScore}
              </span>
            </div>
          </div>

          {/* Bilingual Card */}
          <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-5 sm:p-6 rounded-3xl border border-blue-100 space-y-3">
            <span className="inline-block px-3 py-0.5 bg-blue-200/70 text-blue-900 text-[11px] font-black rounded-lg">
              Topic: {currentMath.topic}
            </span>
            <p className="text-base sm:text-lg font-black text-slate-800 leading-snug">
              {currentMath.questionEn}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 italic border-t border-blue-100/80 pt-2">
              Dịch nghĩa: {currentMath.questionVi}
            </p>
          </div>

          {/* Key Vocabulary Chips */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-[11px] font-black text-slate-600 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Key Math Vocabulary (Từ vựng toán học):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentMath.keyVocabulary.map((v) => (
                <button
                  key={v.word}
                  type="button"
                  onClick={() => {
                    soundFx.playPop(settings.soundEnabled);
                    speakText(v.word, 'en', settings.speechEnabled);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <span className="text-blue-700 font-black">{v.word}</span>
                  <span className="text-slate-400 text-[10px]">{v.pronunciation}</span>
                  <span className="text-slate-500 font-normal">({v.meaning})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hint panel */}
          {showMathHint && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 max-w-md mx-auto animate-fade-in flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">{currentMath.hintEn}</p>
                <p className="text-amber-800 text-[11px]">{currentMath.hintVi}</p>
              </div>
            </div>
          )}

          {/* Multiple choice options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {currentMath.options.map((opt, i) => {
              const isSelected = selectedMathOpt === i;
              return (
                <button
                  key={opt.textEn}
                  onClick={() => handleSelectMathOpt(i, opt.isCorrect)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected && mathFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                      : isSelected && mathFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-blue-50/60 border-slate-200 hover:border-blue-300 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-black text-sm">{opt.textEn}</div>
                    <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>{opt.textVi}</div>
                  </div>
                  {isSelected && mathFeedback === 'correct' && (
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation banner */}
          {mathFeedback === 'correct' && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="font-black text-emerald-950 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Correct! Well done!</span>
                </div>
                <button
                  type="button"
                  onClick={handleNextMath}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                >
                  <span>{mathIdx + 1 < ENGLISH_MATH_QUESTIONS.length ? 'Next Question' : 'Finish Exercise'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-emerald-900 font-medium">{currentMath.hintEn}</p>
            </div>
          )}
        </div>
      )}

      {/* 2. WORD SCRAMBLE / SPELLING BEE */}
      {mode === 'word_scramble' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span>🐝 Word Scramble (Xếp Chữ)</span>
              </span>
              <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                Word {scrambleIdx + 1}/{ENGLISH_WORD_SCRAMBLE.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetLetters}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xếp lại</span>
              </button>
              <span className="font-black text-amber-600 text-xs bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                ⭐ {scrambleScore}
              </span>
            </div>
          </div>

          {/* Visual Target Word Card */}
          <div className="bg-gradient-to-b from-indigo-50 to-purple-50 p-6 rounded-3xl border-2 border-indigo-200 text-center space-y-2 max-w-md mx-auto">
            <div className="text-6xl mb-1 animate-bounce-gentle inline-block">{currentScramble.emoji}</div>
            <div className="text-lg font-black text-slate-800">{currentScramble.meaningVi}</div>
            <div className="text-xs font-mono text-indigo-600">{currentScramble.phonetic}</div>
          </div>

          {/* Letters assembled so far */}
          <div className="p-4 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 min-h-[60px] flex items-center justify-center gap-2 max-w-xs mx-auto">
            {selectedLetters.length === 0 ? (
              <span className="text-xs font-bold text-slate-400 italic">
                (Chạm vào các chữ cái bên dưới...)
              </span>
            ) : (
              selectedLetters.map((l, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-xs"
                >
                  {l}
                </div>
              ))
            )}
          </div>

          {/* Available Letter buttons */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-sm mx-auto">
            {currentScramble.scrambledLetters.map((l, i) => (
              <button
                key={i}
                onClick={() => handleTapLetter(l, i)}
                className="w-12 h-12 rounded-2xl bg-white hover:bg-indigo-50 border-2 border-indigo-300 text-indigo-950 font-black text-2xl flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                {l}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {scrambleFeedback === 'correct' && (
            <div className="max-w-md mx-auto p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2 animate-fade-in text-center">
              <span className="font-black text-emerald-950 text-sm block">🎉 Fantastic! You spelled "{currentScramble.wordEn}" correctly!</span>
              <p className="text-xs text-emerald-800 italic">"{currentScramble.exampleSentence}"</p>
              <button
                type="button"
                onClick={handleNextScramble}
                className="mt-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl inline-flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
              >
                <span>Next Word</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {scrambleFeedback === 'wrong' && (
            <div className="text-center">
              <span className="text-xs font-black text-rose-600">Chưa đúng thứ tự từ rồi, bé hãy bấm "Xếp lại" để thử lại nhé!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
