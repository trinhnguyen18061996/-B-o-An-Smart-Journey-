import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Shield,
  Award,
  Sparkles,
  Clock,
  Globe,
  Menu,
  ChevronRight,
} from 'lucide-react';
import { ChildProfile, GradeLevel, ParentSettings } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  profile: ChildProfile;
  settings: ParentSettings;
  activeTabTitle?: string;
  onToggleSidebar?: () => void;
  onOpenParentModal: () => void;
  onOpenStickerAlbum: () => void;
  onToggleSound: () => void;
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  settings,
  activeTabTitle,
  onToggleSidebar,
  onOpenParentModal,
  onOpenStickerAlbum,
  onToggleSound,
  onToggleLanguage,
}) => {
  const t = translations[settings.language];
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRealtimeDate = (d: Date) => {
    const daysVi = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = settings.language === 'vi' ? daysVi[d.getDay()] : d.toLocaleDateString('en-US', { weekday: 'short' });
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  };

  const formatRealtimeTime = (d: Date) => {
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getGradeLabel = () => {
    switch (profile.gradeLevel) {
      case 'grade_2':
        return settings.language === 'vi' ? 'Lớp 2' : 'Grade 2';
      case 'grade_3':
        return settings.language === 'vi' ? 'Lớp 3' : 'Grade 3';
      case 'grade_4':
        return settings.language === 'vi' ? 'Lớp 4' : 'Grade 4';
      case 'grade_5':
        return settings.language === 'vi' ? 'Lớp 5' : 'Grade 5';
      case 'grade_1':
      default:
        return settings.language === 'vi' ? 'Lớp 1' : 'Grade 1';
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-amber-200/80 sticky top-0 z-30 px-3 sm:px-6 py-2.5 shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Sidebar Toggle Button & Current Breadcrumb / Profile info */}
        <div className="flex items-center gap-2.5 min-w-0">
          {onToggleSidebar && (
            <button
              id="btn-toggle-sidebar"
              onClick={onToggleSidebar}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-amber-100/60 rounded-2xl transition-all cursor-pointer lg:hidden shrink-0"
              title="Mở menu điều hướng"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Child Identity / Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0 hidden sm:block">
              {profile.customAvatarUrl ? (
                <img
                  src={profile.customAvatarUrl}
                  alt={profile.name || 'bé Gạo'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-xs"
                />
              ) : (
                <span className="text-2xl filter drop-shadow select-none inline-block">
                  {profile.avatar}
                </span>
              )}
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-[9px] font-black px-1 rounded-full text-amber-950 border border-white shadow-xs">
                {getGradeLabel()}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                  {profile.name || 'bé Gạo'}
                </span>
                {activeTabTitle && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-bold text-xs sm:text-sm text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-lg truncate">
                      {activeTabTitle}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Live Realtime Clock */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-50 to-orange-50/80 px-2.5 sm:px-3 py-1.5 rounded-2xl border border-amber-200 text-slate-800 shadow-2xs shrink-0">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0 animate-pulse" />
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-mono font-black text-xs sm:text-sm md:text-base text-amber-950 tracking-wider">
              {formatRealtimeTime(now)}
            </span>
            <span className="text-[11px] font-bold text-amber-800/90 hidden md:inline border-l border-amber-300 pl-2">
              {formatRealtimeDate(now)}
            </span>
          </div>
        </div>

        {/* Right Controls: Stars, Sound, Parent button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Star Counter */}
          <button
            id="btn-header-stars"
            onClick={() => {
              soundFx.playStar(settings.soundEnabled);
              onOpenStickerAlbum();
            }}
            title={t.stars}
            className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-xs border border-amber-300 transition-all active:scale-95 cursor-pointer text-xs sm:text-sm"
          >
            <Sparkles className="w-3.5 h-3.5 fill-amber-950 text-amber-950 animate-float-star" />
            <span>{profile.stars}</span>
            <span className="hidden sm:inline text-xs font-bold">{t.stars}</span>
          </button>

          {/* Sound Toggle (Quick access) */}
          <button
            id="btn-header-sound"
            onClick={onToggleSound}
            title={t.sound}
            className={`p-2 rounded-2xl border transition-all active:scale-95 cursor-pointer hidden sm:flex ${
              settings.soundEnabled
                ? 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200'
                : 'bg-slate-100 text-slate-400 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Parent Zone Quick Trigger */}
          <button
            id="btn-header-parent-zone"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              onOpenParentModal();
            }}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white font-bold px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-xs border border-slate-700 transition-all active:scale-95 cursor-pointer text-xs sm:text-sm"
            title="Cài đặt dành cho Bố Mẹ"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t.parentsZone}</span>
            <span className="sm:hidden text-xs">Bố Mẹ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
