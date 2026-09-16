import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, ChevronRight, HelpCircle, Shuffle, Lightbulb } from 'lucide-react';
import { ParentSettings } from '../../types';
import {
  VIETNAMESE_RIDDLES,
  VIETNAMESE_SENTENCE_PUZZLES,
  VIETNAMESE_ODD_ONE_OUT,
  VietnameseRiddleQuestion,
  VietnameseSentenceBuilderQuestion,
  VietnameseOddOneOutQuestion,
} from '../../data/thinkingLessons';
import { soundFx, speakText } from '../../utils/audio';

interface VietnameseThinkingGameProps {
  settings: ParentSettings;
  mode: 'riddles' | 'sentence_builder' | 'odd_one_out';
  onFinishExercise: (subject: 'vietnamese', mode: string, score: number, total: number, stars: number) => void;
}

export const VietnameseThinkingGame: React.FC<VietnameseThinkingGameProps> = ({
  settings,
  mode,
  onFinishExercise,
}) => {
  // Riddles state
  const [riddleIdx, setRiddleIdx] = useState(0);
  const [riddleScore, setRiddleScore] = useState(0);
  const [selectedRiddleOpt, setSelectedRiddleOpt] = useState<number | null>(null);
  const [riddleFeedback, setRiddleFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [showRiddleHint, setShowRiddleHint] = useState(false);

  // Sentence builder state
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [sentenceScore, setSentenceScore] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [sentenceFeedback, setSentenceFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // Odd one out state
  const [oddIdx, setOddIdx] = useState(0);
  const [oddScore, setOddScore] = useState(0);
  const [selectedOddWord, setSelectedOddWord] = useState<string | null>(null);
  const [oddFeedback, setOddFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // RIDDLE HANDLERS
  const currentRiddle: VietnameseRiddleQuestion = VIETNAMESE_RIDDLES[riddleIdx] || VIETNAMESE_RIDDLES[0];
  const handleSelectRiddleOption = (idx: number, isCorrect: boolean) => {
    if (riddleFeedback === 'correct') return;
    soundFx.playPop(settings.soundEnabled);
    setSelectedRiddleOpt(idx);

    if (isCorrect) {
      soundFx.playSuccess(settings.soundEnabled);
      setRiddleFeedback('correct');
      setRiddleScore((s) => s + 1);
    } else {
      soundFx.playError(settings.soundEnabled);
      setRiddleFeedback('wrong');
    }
  };

  const handleNextRiddle = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedRiddleOpt(null);
    setRiddleFeedback('none');
    setShowRiddleHint(false);

    if (riddleIdx + 1 < VIETNAMESE_RIDDLES.length) {
      setRiddleIdx((r) => r + 1);
    } else {
      onFinishExercise('vietnamese', 'riddles', riddleScore + (riddleFeedback === 'correct' ? 1 : 0), VIETNAMESE_RIDDLES.length, 3);
      setRiddleIdx(0);
      setRiddleScore(0);
    }
  };

  // SENTENCE BUILDER HANDLERS
  const currentSentence: VietnameseSentenceBuilderQuestion = VIETNAMESE_SENTENCE_PUZZLES[sentenceIdx] || VIETNAMESE_SENTENCE_PUZZLES[0];

  const handleTapWord = (word: string) => {
    soundFx.playPop(settings.soundEnabled);
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      const next = [...selectedWords, word];
      setSelectedWords(next);

      // Check if sentence complete
      const assembled = next.join(' ');
      if (assembled === currentSentence.targetSentence) {
        soundFx.playSuccess(settings.soundEnabled);
        setSentenceFeedback('correct');
        setSentenceScore((s) => s + 1);
      } else if (next.length === currentSentence.scrambledWords.length) {
        soundFx.playError(settings.soundEnabled);
        setSentenceFeedback('wrong');
      }
    }
  };

  const handleNextSentence = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedWords([]);
    setSentenceFeedback('none');

    if (sentenceIdx + 1 < VIETNAMESE_SENTENCE_PUZZLES.length) {
      setSentenceIdx((s) => s + 1);
    } else {
      onFinishExercise('vietnamese', 'sentence_builder', sentenceScore + (sentenceFeedback === 'correct' ? 1 : 0), VIETNAMESE_SENTENCE_PUZZLES.length, 3);
      setSentenceIdx(0);
      setSentenceScore(0);
    }
  };

  // ODD ONE OUT HANDLERS
  const currentOdd: VietnameseOddOneOutQuestion = VIETNAMESE_ODD_ONE_OUT[oddIdx] || VIETNAMESE_ODD_ONE_OUT[0];
  const handleSelectOdd = (word: string) => {
    if (oddFeedback === 'correct') return;
    soundFx.playPop(settings.soundEnabled);
    setSelectedOddWord(word);

    if (word === currentOdd.oddWord) {
      soundFx.playSuccess(settings.soundEnabled);
      setOddFeedback('correct');
      setOddScore((s) => s + 1);
    } else {
      soundFx.playError(settings.soundEnabled);
      setOddFeedback('wrong');
    }
  };

  const handleNextOdd = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedOddWord(null);
    setOddFeedback('none');

    if (oddIdx + 1 < VIETNAMESE_ODD_ONE_OUT.length) {
      setOddIdx((o) => o + 1);
    } else {
      onFinishExercise('vietnamese', 'odd_one_out', oddScore + (oddFeedback === 'correct' ? 1 : 0), VIETNAMESE_ODD_ONE_OUT.length, 3);
      setOddIdx(0);
      setOddScore(0);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-sm p-5 sm:p-7 space-y-6 animate-fade-in">
      {/* 1. RIDDLES GAME */}
      {mode === 'riddles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span>🧩 Đố Vui Dân Gian</span>
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Câu {riddleIdx + 1}/{VIETNAMESE_RIDDLES.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop(settings.soundEnabled);
                  speakText(currentRiddle.riddleVi, 'vi', settings.speechEnabled);
                }}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nghe Đố</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop(settings.soundEnabled);
                  setShowRiddleHint(!showRiddleHint);
                }}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Gợi ý</span>
              </button>
              <span className="font-black text-amber-600 text-xs bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                ⭐ {riddleScore}
              </span>
            </div>
          </div>

          {/* Riddle Card */}
          <div className="bg-gradient-to-b from-emerald-50/70 to-teal-50/50 p-6 rounded-3xl border-2 border-emerald-200 text-center space-y-2">
            <span className="text-4xl inline-block mb-1">📜</span>
            <p className="text-lg sm:text-xl font-black text-slate-800 leading-relaxed max-w-xl mx-auto">
              "{currentRiddle.riddleVi}"
            </p>
          </div>

          {showRiddleHint && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 max-w-md mx-auto animate-fade-in flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Gợi ý: {currentRiddle.hintVi}</span>
            </div>
          )}

          {/* Multiple Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            {currentRiddle.options.map((opt, i) => {
              const isSelected = selectedRiddleOpt === i;
              return (
                <button
                  key={opt.text}
                  onClick={() => handleSelectRiddleOption(i, opt.isCorrect)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected && riddleFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                      : isSelected && riddleFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="font-black text-sm">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Success Banner */}
          {riddleFeedback === 'correct' && (
            <div className="max-w-md mx-auto p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-950 text-sm">Bé Gạo đoán trúng rồi!</span>
                <button
                  type="button"
                  onClick={handleNextRiddle}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-emerald-900 font-medium">{currentRiddle.explanationVi}</p>
            </div>
          )}
        </div>
      )}

      {/* 2. SENTENCE BUILDER GAME */}
      {mode === 'sentence_builder' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span>🔤 Xếp Chữ Thành Câu</span>
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Câu {sentenceIdx + 1}/{VIETNAMESE_SENTENCE_PUZZLES.length}
              </span>
            </div>
            <span className="font-black text-amber-600 text-xs bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {sentenceScore}
            </span>
          </div>

          <div className="text-center space-y-1">
            <div className="text-4xl">{currentSentence.imageEmoji}</div>
            <h3 className="text-sm sm:text-base font-bold text-slate-600">
              Chạm vào các từ bên dưới theo thứ tự để ghép thành câu hoàn chỉnh:
            </h3>
          </div>

          {/* Assembled Sentence Box */}
          <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-300 min-h-[70px] flex items-center justify-center gap-2 flex-wrap max-w-lg mx-auto">
            {selectedWords.length === 0 ? (
              <span className="text-sm font-bold text-slate-400 italic">
                (Chạm vào các thẻ từ bên dưới...)
              </span>
            ) : (
              selectedWords.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTapWord(w)}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-black text-sm rounded-xl shadow-xs hover:bg-emerald-700 cursor-pointer transition-all"
                  title="Chạm để gỡ thẻ từ"
                >
                  {w}
                </button>
              ))
            )}
          </div>

          {/* Available Word Chips */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-md mx-auto">
            {currentSentence.scrambledWords.map((word, idx) => {
              const isUsed = selectedWords.includes(word);
              return (
                <button
                  key={idx}
                  disabled={isUsed}
                  onClick={() => handleTapWord(word)}
                  className={`px-4 py-2.5 rounded-2xl font-black text-sm border-2 transition-all cursor-pointer ${
                    isUsed
                      ? 'opacity-30 border-dashed border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs hover:scale-105 active:scale-95'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {sentenceFeedback === 'correct' && (
            <div className="max-w-md mx-auto p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2 animate-fade-in text-center">
              <span className="font-black text-emerald-950 text-sm block">🎉 Ghép câu hoàn toàn chính xác!</span>
              <p className="text-xs text-emerald-800 font-medium">{currentSentence.meaningVi}</p>
              <button
                type="button"
                onClick={handleNextSentence}
                className="mt-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl inline-flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {sentenceFeedback === 'wrong' && (
            <div className="text-center">
              <span className="text-xs font-black text-rose-600">Thứ tự từ chưa đúng, bé hãy bấm vào thẻ để xếp lại nhé!</span>
            </div>
          )}
        </div>
      )}

      {/* 3. ODD ONE OUT GAME */}
      {mode === 'odd_one_out' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span>🔍 Tìm Từ Khác Biệt</span>
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Câu {oddIdx + 1}/{VIETNAMESE_ODD_ONE_OUT.length}
              </span>
            </div>
            <span className="font-black text-amber-600 text-xs bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {oddScore}
            </span>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-800">{currentOdd.titleVi}</h3>
            <p className="text-xs text-slate-500 italic">Rèn luyện tư duy phân loại và logic ngôn ngữ</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            {currentOdd.items.map((item) => {
              const isSelected = selectedOddWord === item.word;
              return (
                <button
                  key={item.word}
                  onClick={() => handleSelectOdd(item.word)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isSelected && oddFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                      : isSelected && oddFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="text-4xl">{item.emoji}</span>
                  <span className="font-black text-xs sm:text-sm">{item.word}</span>
                </button>
              );
            })}
          </div>

          {oddFeedback === 'correct' && (
            <div className="max-w-md mx-auto p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-950 text-sm">Chính xác tư duy!</span>
                <button
                  type="button"
                  onClick={handleNextOdd}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-emerald-900 font-medium">{currentOdd.reasonVi}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
