import React, { useState } from 'react';
import { X, Lock, Sparkles, Award } from 'lucide-react';
import { Badge, ChildProfile, Language, ParentSettings } from '../types';
import { INITIAL_STICKERS } from '../data/rewards';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface StickerAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ChildProfile;
  settings: ParentSettings;
}

export const StickerAlbumModal: React.FC<StickerAlbumModalProps> = ({
  isOpen,
  onClose,
  profile,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'stickers' | 'badges'>('stickers');
  const t = translations[settings.language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-white w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-amber-300 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-pink-400 text-white rounded-2xl shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {t.stickersTitle}
              </h2>
              <p className="text-xs text-slate-600 font-semibold">{t.stickersDesc}</p>
            </div>
          </div>
          <button
            id="btn-close-stickers"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              onClose();
            }}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Stars Banner */}
        <div className="my-3 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 rounded-2xl p-3 border border-amber-400 shadow-sm flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-800" />
            <span className="font-extrabold text-amber-950 text-sm">
              {settings.language === 'vi' ? 'Số sao hiện có của bé:' : 'Your total stars:'}
            </span>
          </div>
          <span className="text-xl font-black text-amber-950 bg-white/80 px-3 py-0.5 rounded-full border border-amber-300">
            ⭐ {profile.stars}
          </span>
        </div>

        {/* Tabs: Stickers vs Badges */}
        <div className="flex gap-2 mb-3">
          <button
            id="tab-stickers"
            onClick={() => setActiveTab('stickers')}
            className={`flex-1 py-2 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'stickers'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-amber-100/60 border border-amber-200'
            }`}
          >
            🐾 {settings.language === 'vi' ? 'Nhãn Dán Thú Cưng' : 'Animal Stickers'}
          </button>
          <button
            id="tab-badges"
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-2 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-amber-100/60 border border-amber-200'
            }`}
          >
            🏅 {t.badgesTitle}
          </button>
        </div>

        {/* Content Area with custom scrollbar */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {activeTab === 'stickers' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INITIAL_STICKERS.map((sticker) => {
                const isUnlocked = profile.stars >= sticker.requiredStars || profile.unlockedStickers.includes(sticker.id);
                return (
                  <div
                    key={sticker.id}
                    className={`rounded-2xl p-3 text-center border-2 transition-all ${
                      isUnlocked
                        ? 'bg-white border-pink-300 shadow-sm hover:scale-105'
                        : 'bg-slate-100/80 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="text-4xl sm:text-5xl my-1 relative inline-block">
                      {sticker.emoji}
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 rounded-full">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1">
                      {settings.language === 'vi' ? sticker.nameVi : sticker.nameEn}
                    </h3>
                    <div className="mt-1.5">
                      {isUnlocked ? (
                        <span className="text-[10px] font-black text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                          {t.unlockedText}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full flex items-center justify-center gap-0.5">
                          ⭐ {sticker.requiredStars} {t.stars}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2.5">
              {profile.badges.map((badge: Badge) => {
                return (
                  <div
                    key={badge.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                      badge.unlocked
                        ? 'bg-white border-indigo-200 shadow-sm'
                        : 'bg-slate-100/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl p-2 bg-indigo-50 rounded-2xl border border-indigo-100">
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {settings.language === 'vi' ? badge.titleVi : badge.titleEn}
                        </h3>
                        {badge.unlocked ? (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {t.unlockedText}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Chưa đạt
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {settings.language === 'vi' ? badge.descVi : badge.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
