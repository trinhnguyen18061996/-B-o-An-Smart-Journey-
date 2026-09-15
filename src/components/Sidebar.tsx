import React from 'react';
import {
  BookOpen,
  Calculator,
  Languages,
  CalendarDays,
  Award,
  BarChart3,
  Shield,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Globe,
  X,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { ChildProfile, GradeLevel, ParentSettings } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

export type MainTab = 'vietnamese' | 'math' | 'english' | 'timetable' | 'stickers' | 'progress';

interface SidebarProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  profile: ChildProfile;
  settings: ParentSettings;
  onOpenParentModal: () => void;
  onOpenStickerAlbum: () => void;
  onToggleSound: () => void;
  onToggleLanguage: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  settings,
  onOpenParentModal,
  onOpenStickerAlbum,
  onToggleSound,
  onToggleLanguage,
  isMobileOpen,
  onCloseMobile,
}) => {
  const t = translations[settings.language];

  const getGradeName = (grade?: GradeLevel) => {
    switch (grade) {
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

  const navItems: {
    id: MainTab;
    labelVi: string;
    labelEn: string;
    icon: React.ReactNode;
    badge?: string;
    colorClasses: {
      active: string;
      hover: string;
      iconBg: string;
    };
  }[] = [
    {
      id: 'vietnamese',
      labelVi: 'Tiếng Việt',
      labelEn: 'Vietnamese',
      icon: <span className="text-xl">🔤</span>,
      badge: 'Luyện chữ & vần',
      colorClasses: {
        active: 'bg-rose-500 text-white shadow-md shadow-rose-200 border-rose-600',
        hover: 'hover:bg-rose-50 hover:text-rose-700 text-slate-700',
        iconBg: 'bg-rose-100 text-rose-600',
      },
    },
    {
      id: 'math',
      labelVi: 'Toán Học',
      labelEn: 'Math',
      icon: <span className="text-xl">🔢</span>,
      badge: 'Số học & tư duy',
      colorClasses: {
        active: 'bg-sky-500 text-white shadow-md shadow-sky-200 border-sky-600',
        hover: 'hover:bg-sky-50 hover:text-sky-700 text-slate-700',
        iconBg: 'bg-sky-100 text-sky-600',
      },
    },
    {
      id: 'english',
      labelVi: 'Tiếng Anh',
      labelEn: 'English',
      icon: <span className="text-xl">🇬🇧</span>,
      badge: 'Hội thoại & Phonics',
      colorClasses: {
        active: 'bg-emerald-500 text-white shadow-md shadow-emerald-200 border-emerald-600',
        hover: 'hover:bg-emerald-50 hover:text-emerald-700 text-slate-700',
        iconBg: 'bg-emerald-100 text-emerald-600',
      },
    },
    {
      id: 'timetable',
      labelVi: 'Thời Khóa Biểu',
      labelEn: 'School Timetable',
      icon: <CalendarDays className="w-5 h-5 text-amber-600" />,
      badge: 'Lịch học trường lớp',
      colorClasses: {
        active: 'bg-amber-500 text-white shadow-md shadow-amber-200 border-amber-600',
        hover: 'hover:bg-amber-50 hover:text-amber-800 text-slate-700',
        iconBg: 'bg-amber-100 text-amber-700',
      },
    },
    {
      id: 'stickers',
      labelVi: 'Kho Thưởng & Quà',
      labelEn: 'Sticker Treasury',
      icon: <Award className="w-5 h-5 text-pink-600" />,
      badge: `${profile.unlockedStickers.length} sticker`,
      colorClasses: {
        active: 'bg-pink-500 text-white shadow-md shadow-pink-200 border-pink-600',
        hover: 'hover:bg-pink-50 hover:text-pink-700 text-slate-700',
        iconBg: 'bg-pink-100 text-pink-600',
      },
    },
    {
      id: 'progress',
      labelVi: 'Tiến Độ Học Tập',
      labelEn: 'Progress Report',
      icon: <BarChart3 className="w-5 h-5 text-indigo-600" />,
      badge: 'Báo cáo tuần',
      colorClasses: {
        active: 'bg-indigo-600 text-white shadow-md shadow-indigo-200 border-indigo-700',
        hover: 'hover:bg-indigo-50 hover:text-indigo-700 text-slate-700',
        iconBg: 'bg-indigo-100 text-indigo-600',
      },
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-md border-r border-amber-200/80 flex flex-col justify-between shadow-xl lg:shadow-none transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Child Profile Card */}
        <div className="p-4 border-b border-amber-100 space-y-3">
          {/* Logo & Close button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-sm font-black text-lg">
                BA
              </div>
              <div>
                <h2 className="font-black text-base text-slate-900 leading-tight">Bảo An</h2>
                <p className="text-[11px] font-bold text-amber-700">Smart Journey</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden cursor-pointer"
              title="Đóng sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Child Profile Mini-card */}
          <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-yellow-50/80 p-3 rounded-2xl border border-amber-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {profile.customAvatarUrl ? (
                  <img
                    src={profile.customAvatarUrl}
                    alt={profile.name || 'bé Gạo'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-amber-300 flex items-center justify-center text-2xl shadow-xs">
                    {profile.avatar || '🐰'}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-[10px] font-black px-1.5 py-0.2 rounded-full text-white shadow-xs">
                  {getGradeName(profile.gradeLevel)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-slate-900 truncate">
                    {profile.name || 'bé Gạo'}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="inline-flex items-center gap-1 bg-amber-400/30 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full border border-amber-300">
                    <Sparkles className="w-3 h-3 fill-amber-600 text-amber-600" />
                    {profile.stars} {settings.language === 'vi' ? 'sao' : 'stars'}
                  </span>
                </div>
              </div>
            </div>

            {/* Screen Time Progress Bar */}
            <div className="pt-1.5 border-t border-amber-200/50 flex items-center justify-between text-[11px] font-medium text-slate-600">
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3 h-3 text-amber-600" />
                {settings.language === 'vi' ? 'Thời gian học hôm nay:' : 'Today usage:'}
              </span>
              <span className="font-bold text-slate-800">
                {profile.todayUsageMinutes}
                {settings.dailyTimeLimitMinutes > 0 ? `/${settings.dailyTimeLimitMinutes}` : ''} {t.minutes}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Group 1: Chương trình học */}
          <div className="space-y-1.5">
            <div className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              {settings.language === 'vi' ? 'Chương trình học tập' : 'Learning Subjects'}
            </div>
            {navItems.slice(0, 3).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-btn-${item.id}`}
                  onClick={() => {
                    soundFx.playPop(settings.soundEnabled);
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-black text-sm transition-all cursor-pointer text-left border ${
                    isActive
                      ? `${item.colorClasses.active} border-transparent`
                      : `${item.colorClasses.hover} border-transparent bg-transparent`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : item.colorClasses.iconBg
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <span className="block leading-tight">
                        {settings.language === 'vi' ? item.labelVi : item.labelEn}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold block ${
                            isActive ? 'text-white/80' : 'text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Group 2: Trường lớp & Phần thưởng */}
          <div className="space-y-1.5">
            <div className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              {settings.language === 'vi' ? 'Trường học & Thành tích' : 'School & Achievements'}
            </div>
            {navItems.slice(3).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-btn-${item.id}`}
                  onClick={() => {
                    soundFx.playPop(settings.soundEnabled);
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-black text-sm transition-all cursor-pointer text-left border ${
                    isActive
                      ? `${item.colorClasses.active} border-transparent`
                      : `${item.colorClasses.hover} border-transparent bg-transparent`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : item.colorClasses.iconBg
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <span className="block leading-tight">
                        {settings.language === 'vi' ? item.labelVi : item.labelEn}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold block ${
                            isActive ? 'text-white/80' : 'text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Group 3: Dành cho phụ huynh */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              {settings.language === 'vi' ? 'Quản lý phụ huynh' : 'Parent Management'}
            </div>
            <button
              id="sidebar-btn-parent-settings"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                onOpenParentModal();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-extrabold text-sm text-slate-800 hover:bg-slate-900 hover:text-white transition-all cursor-pointer group bg-slate-50 border border-slate-200 hover:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 group-hover:bg-slate-800 group-hover:text-amber-400 text-slate-700 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="block leading-tight">
                    {settings.language === 'vi' ? 'Cài Đặt Phụ Huynh' : 'Parent Controls'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-300 block">
                    Khóa PIN, TKB Excel, Lớp 1-5
                  </span>
                </div>
              </div>
              <span className="text-xs">🔒</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3.5 border-t border-amber-100 bg-amber-50/40 space-y-2">
          <div className="flex items-center justify-between gap-2">
            {/* Sound switch */}
            <button
              id="sidebar-btn-sound"
              onClick={onToggleSound}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{settings.soundEnabled ? (settings.language === 'vi' ? 'Âm thanh: Bật' : 'Sound: On') : (settings.language === 'vi' ? 'Tắt âm' : 'Muted')}</span>
            </button>

            {/* Language switch */}
            <button
              id="sidebar-btn-lang"
              onClick={onToggleLanguage}
              className="py-1.5 px-3 rounded-xl text-xs font-extrabold border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{settings.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
            </button>
          </div>

          <div className="text-center text-[10px] text-slate-400 font-medium">
            Bảo An – Smart Journey v2.0
          </div>
        </div>
      </aside>
    </>
  );
};
