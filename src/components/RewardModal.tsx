import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Sparkles, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { Language, Sticker } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface RewardModalProps {
  isOpen: boolean;
  score: number;
  total: number;
  starsEarned: number;
  newStickerUnlocked?: Sticker | null;
  language: Language;
  soundEnabled: boolean;
  onPlayAgain: () => void;
  onNextOrHome: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  score,
  total,
  starsEarned,
  newStickerUnlocked,
  language,
  soundEnabled,
  onPlayAgain,
  onNextOrHome,
}) => {
  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      soundFx.playFanfare(soundEnabled);
      // Trigger confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'],
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  const isPerfect = score === total;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center relative overflow-hidden">
        {/* Decorative corner stars */}
        <div className="absolute -top-3 -right-3 text-5xl opacity-40 select-none pointer-events-none">⭐</div>
        <div className="absolute -bottom-3 -left-3 text-5xl opacity-40 select-none pointer-events-none">✨</div>

        {/* Mascot / Trophy */}
        <div className="relative inline-block mb-3">
          <div className="text-6xl sm:text-7xl animate-bounce-gentle">
            {isPerfect ? '🏆' : '🎉'}
          </div>
          <span className="absolute -bottom-2 -right-2 text-2xl">✨</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {isPerfect ? t.greatJob : t.lessonCompleted}
        </h2>

        <p className="text-sm font-semibold text-slate-600 mt-1">
          {language === 'vi'
            ? `Bé đã trả lời đúng ${score} trên ${total} câu hỏi!`
            : `You answered ${score} out of ${total} correctly!`}
        </p>

        {/* Stars Earned Card */}
        <div className="my-5 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 rounded-2xl p-4 border-2 border-amber-300 shadow-inner flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-600 animate-float-star" />
          <div className="flex items-center gap-1">
            {[...Array(Math.min(3, starsEarned))].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-amber-500 text-amber-600 animate-bounce-gentle" />
            ))}
          </div>
          <span className="font-black text-2xl text-amber-950">+{starsEarned}</span>
          <span className="text-xs font-bold text-amber-900 uppercase">{t.stars}</span>
        </div>

        {/* Newly Unlocked Sticker Notification */}
        {newStickerUnlocked && (
          <div className="mb-5 bg-pink-50 border-2 border-pink-300 rounded-2xl p-3 flex items-center gap-3 text-left">
            <span className="text-4xl animate-bounce-gentle">{newStickerUnlocked.emoji}</span>
            <div>
              <span className="text-[11px] font-black text-pink-600 uppercase tracking-wider block">
                {language === 'vi' ? '🎉 Nhãn Dán Mới Mở Khóa!' : '🎉 New Sticker Unlocked!'}
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {language === 'vi' ? newStickerUnlocked.nameVi : newStickerUnlocked.nameEn}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
          <button
            id="btn-reward-play-again"
            onClick={() => {
              soundFx.playPop(soundEnabled);
              onPlayAgain();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all active:scale-95 cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.playAgain}</span>
          </button>

          <button
            id="btn-reward-continue"
            onClick={() => {
              soundFx.playPop(soundEnabled);
              onNextOrHome();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md border border-orange-400 transition-all active:scale-95 cursor-pointer text-sm"
          >
            <span>{t.nextQuestion}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
