import React from 'react';
import { Volume2, VolumeX, Shield, Award, Sparkles, Clock, Flame, Globe } from 'lucide-react';
import { ChildProfile, ParentSettings } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  profile: ChildProfile;
  settings: ParentSettings;
  onOpenParentModal: () => void;
  onOpenStickerAlbum: () => void;
  onToggleSound: () => void;
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  settings,
  onOpenParentModal,
  onOpenStickerAlbum,
  onToggleSound,
  onToggleLanguage,
}) => {
  const t = translations[settings.language];

  const getGradeLabel = () => {
    switch (profile.gradeLevel) {
      case 'preschool':
        return settings.language === 'vi' ? 'Mầm Non' : 'Kindergarten';
      case 'grade_2':
        return settings.language === 'vi' ? 'Lớp 2' : 'Grade 2';
      case 'grade_3':
        return settings.language === 'vi' ? 'Lớp 3' : 'Grade 3';
      case 'grade_1':
      default:
        return settings.language === 'vi' ? 'Lớp 1' : 'Grade 1';
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b-2 border-amber-200/80 sticky top-0 z-30 px-3 sm:px-6 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Child Profile & Mascot */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            {profile.customAvatarUrl ? (
              <img
                src={profile.customAvatarUrl}
                alt={profile.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amber-400 shadow-md"
              />
            ) : (
              <span className="text-3xl sm:text-4xl filter drop-shadow select-none animate-bounce-gentle inline-block">
                {profile.avatar}
              </span>
            )}
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-[10px] font-black px-1.5 py-0.2 rounded-full text-amber-950 border border-white shadow-xs">
              {getGradeLabel()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight leading-tight">
                {profile.name}
              </h1>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                {t.appTitle}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center text-orange-600 font-bold gap-0.5">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                {profile.currentStreak} {t.days}
              </span>
              <span>•</span>
              {settings.dailyTimeLimitMinutes > 0 ? (
                <span className={`flex items-center gap-1 font-semibold ${profile.todayUsageMinutes >= settings.dailyTimeLimitMinutes ? 'text-rose-600' : 'text-slate-600'}`}>
                  <Clock className="w-3 h-3" />
                  {profile.todayUsageMinutes}/{settings.dailyTimeLimitMinutes} {t.minutes}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <Clock className="w-3 h-3" />
                  {profile.todayUsageMinutes} {t.minutes}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Star Counter */}
          <button
            id="btn-header-stars"
            onClick={() => {
              soundFx.playStar(settings.soundEnabled);
              onOpenStickerAlbum();
            }}
            title={t.stars}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black px-3 py-1.5 rounded-2xl shadow-sm border-2 border-amber-300 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-amber-950 text-amber-950 animate-float-star" />
            <span className="text-sm sm:text-base font-black">{profile.stars}</span>
            <span className="text-xs font-bold hidden xs:inline">{t.stars}</span>
          </button>

          {/* Sticker Album */}
          <button
            id="btn-header-stickers"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              onOpenStickerAlbum();
            }}
            title={t.stickers}
            className="flex items-center gap-1.5 bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold px-3 py-1.5 rounded-2xl border border-pink-300 transition-all active:scale-95 cursor-pointer text-xs sm:text-sm"
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">{t.stickers}</span>
            <span className="sm:hidden">🎁</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-header-sound"
            onClick={onToggleSound}
            title={t.sound}
            className={`p-2 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
              settings.soundEnabled
                ? 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200'
                : 'bg-slate-100 text-slate-400 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <button
            id="btn-header-lang"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              onToggleLanguage();
            }}
            title="Chuyển ngôn ngữ / Switch Language"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-700 font-extrabold text-xs hover:bg-indigo-100 transition-all active:scale-95 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{settings.language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
          </button>

          {/* Parental Gate Button */}
          <button
            id="btn-header-parent-zone"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              onOpenParentModal();
            }}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-2xl shadow-sm border border-slate-700 transition-all active:scale-95 cursor-pointer text-xs sm:text-sm"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">{t.parentsZone}</span>
            <span className="md:hidden">Bố Mẹ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
