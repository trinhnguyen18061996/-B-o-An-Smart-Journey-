import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, MainTab } from './components/Sidebar';
import { ScheduleBanner } from './components/ScheduleBanner';
import { VietnameseGame } from './components/VietnameseGame';
import { MathGame } from './components/MathGame';
import { EnglishGame } from './components/EnglishGame';
import { ProgressReportView } from './components/ProgressReportView';
import { ParentModal } from './components/ParentModal';
import { StickerAlbumModal } from './components/StickerAlbumModal';
import { ScreenTimeLock } from './components/ScreenTimeLock';
import { RewardModal } from './components/RewardModal';
import { AppState, ChildProfile, ParentSettings, Sticker, StudySession, Subject } from './types';
import { loadInitialState, saveStateToLocal } from './utils/storage';
import { translations } from './utils/translations';
import { soundFx } from './utils/audio';
import { INITIAL_STICKERS } from './data/rewards';
import { CalendarDays, FileSpreadsheet, Sparkles, BookOpen, Settings, Award } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(loadInitialState);
  const { profile, settings } = appState;
  const t = translations[settings.language];

  // Active Tab: 'vietnamese' | 'math' | 'english' | 'timetable' | 'stickers' | 'progress'
  const [activeTab, setActiveTab] = useState<MainTab>('vietnamese');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isStickerAlbumOpen, setIsStickerAlbumOpen] = useState(false);
  const [isScreenTimeLocked, setIsScreenTimeLocked] = useState(false);

  // Reward Modal state
  const [rewardData, setRewardData] = useState<{
    isOpen: boolean;
    score: number;
    total: number;
    starsEarned: number;
    newSticker?: Sticker | null;
  }>({
    isOpen: false,
    score: 0,
    total: 0,
    starsEarned: 0,
    newSticker: null,
  });

  // Save state on any change
  useEffect(() => {
    saveStateToLocal(appState);
  }, [appState]);

  // Screen time tracking (ticks every minute)
  useEffect(() => {
    const timer = setInterval(() => {
      setAppState((prev) => {
        const nextMinutes = prev.profile.todayUsageMinutes + 1;
        const limit = prev.settings.dailyTimeLimitMinutes;
        if (limit > 0 && nextMinutes >= limit) {
          setIsScreenTimeLocked(true);
        }
        return {
          ...prev,
          profile: {
            ...prev.profile,
            todayUsageMinutes: nextMinutes,
          },
        };
      });
    }, 60000); // every 1 minute

    return () => clearInterval(timer);
  }, []);

  // Initial check on load for screen time limit
  useEffect(() => {
    if (settings.dailyTimeLimitMinutes > 0 && profile.todayUsageMinutes >= settings.dailyTimeLimitMinutes) {
      setIsScreenTimeLocked(true);
    }
  }, [profile.todayUsageMinutes, settings.dailyTimeLimitMinutes]);

  // Handle study session completion & check for rewards
  const handleFinishExercise = (
    subject: Subject,
    mode: string,
    score: number,
    total: number,
    starsAwarded: number
  ) => {
    const newSession: StudySession = {
      id: `session_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      subject,
      mode,
      totalQuestions: total,
      correctAnswers: score,
      starsEarned: starsAwarded,
      durationMinutes: 3,
    };

    const updatedStars = profile.stars + starsAwarded;

    // Check if any new sticker unlocks
    let unlockedSticker: Sticker | null = null;
    const currentUnlockedIds = new Set(profile.unlockedStickers);
    INITIAL_STICKERS.forEach((stk) => {
      if (!currentUnlockedIds.has(stk.id) && updatedStars >= stk.requiredStars) {
        currentUnlockedIds.add(stk.id);
        unlockedSticker = stk;
      }
    });

    // Check badge unlocks
    const updatedBadges = profile.badges.map((b) => {
      if (!b.unlocked) {
        if (b.id === 'star_collector' && updatedStars >= 30) {
          return { ...b, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        if (b.id === 'math_starter' && subject === 'math' && score === total) {
          return { ...b, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        if (b.id === 'rhyme_master' && mode === 'rhyme_builder') {
          return { ...b, unlocked: true, unlockedAt: new Date().toISOString() };
        }
      }
      return b;
    });

    setAppState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        stars: updatedStars,
        unlockedStickers: Array.from(currentUnlockedIds),
        badges: updatedBadges,
        history: [newSession, ...prev.profile.history],
      },
    }));

    setRewardData({
      isOpen: true,
      score,
      total,
      starsEarned: starsAwarded,
      newSticker: unlockedSticker,
    });
  };

  // Toggle handlers
  const handleToggleSound = () => {
    setAppState((prev) => ({
      ...prev,
      settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled },
    }));
  };

  const handleToggleLanguage = () => {
    setAppState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        language: prev.settings.language === 'vi' ? 'en' : 'vi',
      },
    }));
  };

  const getTabTitle = (tab: MainTab): string => {
    switch (tab) {
      case 'vietnamese':
        return settings.language === 'vi' ? '🔤 Tiếng Việt' : '🔤 Vietnamese';
      case 'math':
        return settings.language === 'vi' ? '🔢 Toán Học' : '🔢 Math';
      case 'english':
        return settings.language === 'vi' ? '🇬🇧 Tiếng Anh' : '🇬🇧 English';
      case 'timetable':
        return settings.language === 'vi' ? '📅 Thời Khóa Biểu' : '📅 School Timetable';
      case 'stickers':
        return settings.language === 'vi' ? '🏆 Kho Thưởng' : '🏆 Sticker Treasury';
      case 'progress':
        return settings.language === 'vi' ? '📊 Tiến Độ Học' : '📊 Progress';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col lg:flex-row selection:bg-amber-200">
      {/* 1. Left Sidebar Navigation (Docked on Desktop, Drawer on Mobile) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'stickers') {
            setIsStickerAlbumOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        profile={profile}
        settings={settings}
        onOpenParentModal={() => setIsParentModalOpen(true)}
        onOpenStickerAlbum={() => setIsStickerAlbumOpen(true)}
        onToggleSound={handleToggleSound}
        onToggleLanguage={handleToggleLanguage}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Stage */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          profile={profile}
          settings={settings}
          activeTabTitle={getTabTitle(activeTab)}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          onOpenParentModal={() => setIsParentModalOpen(true)}
          onOpenStickerAlbum={() => setIsStickerAlbumOpen(true)}
          onToggleSound={handleToggleSound}
          onToggleLanguage={handleToggleLanguage}
        />

        {/* Dynamic Viewport Content */}
        <main className="flex-1 p-3 sm:p-6 max-w-6xl w-full mx-auto space-y-4">
          {/* Quick Tab Switcher Pills for mobile & fast subject switching */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              id="quick-tab-vietnamese"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setActiveTab('vietnamese');
              }}
              className={`px-3.5 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'vietnamese'
                  ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-rose-50 border-slate-200'
              }`}
            >
              <span>🔤</span>
              <span>{t.vietnamese}</span>
            </button>

            <button
              id="quick-tab-math"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setActiveTab('math');
              }}
              className={`px-3.5 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'math'
                  ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-sky-50 border-slate-200'
              }`}
            >
              <span>🔢</span>
              <span>{t.math}</span>
            </button>

            <button
              id="quick-tab-english"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setActiveTab('english');
              }}
              className={`px-3.5 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'english'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border-slate-200'
              }`}
            >
              <span>🇬🇧</span>
              <span>{t.english || 'Tiếng Anh'}</span>
            </button>

            <button
              id="quick-tab-timetable"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setActiveTab('timetable');
              }}
              className={`px-3.5 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'timetable'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border-slate-200'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{settings.language === 'vi' ? 'Thời khóa biểu' : 'Timetable'}</span>
            </button>

            <button
              id="quick-tab-progress"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setActiveTab('progress');
              }}
              className={`px-3.5 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'progress'
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-indigo-50 border-slate-200'
              }`}
            >
              <span>📊</span>
              <span>{settings.language === 'vi' ? 'Tiến độ' : 'Progress'}</span>
            </button>
          </div>

          {/* ACTIVE VIEW 1: TIẾNG VIỆT */}
          {activeTab === 'vietnamese' && (
            <div className="space-y-4 animate-fade-in">
              <VietnameseGame
                settings={settings}
                onFinishExercise={handleFinishExercise}
              />
            </div>
          )}

          {/* ACTIVE VIEW 2: TOÁN HỌC */}
          {activeTab === 'math' && (
            <div className="space-y-4 animate-fade-in">
              <MathGame
                settings={settings}
                onFinishExercise={handleFinishExercise}
              />
            </div>
          )}

          {/* ACTIVE VIEW 3: TIẾNG ANH */}
          {activeTab === 'english' && (
            <div className="space-y-4 animate-fade-in">
              <EnglishGame
                settings={settings}
                gradeLevel={profile.gradeLevel || 'grade_1'}
                onFinishExercise={handleFinishExercise}
              />
            </div>
          )}

          {/* ACTIVE VIEW 4: THỜI KHÓA BIỂU TRƯỜNG LỚP */}
          {activeTab === 'timetable' && (
            <div className="space-y-4 animate-fade-in">
              {/* Timetable Header Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 font-extrabold text-xs px-2.5 py-0.5 rounded-full mb-1 border border-amber-300">
                    <CalendarDays className="w-3.5 h-3.5 text-amber-700" />
                    <span>Lịch học chính khóa ở trường</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Thời Khóa Biểu của {profile.name || 'bé Gạo'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thời khóa biểu nhập từ file Excel giúp bố mẹ và bé theo dõi các tiết học sáng chiều, sắp xếp sách vở balo chu đáo.
                  </p>
                </div>

                {/* Direct Excel Action */}
                <button
                  id="btn-timetable-import-excel"
                  onClick={() => {
                    soundFx.playPop(settings.soundEnabled);
                    setIsParentModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Cập nhật file Excel TKB</span>
                </button>
              </div>

              {/* Standalone Schedule Banner */}
              <ScheduleBanner
                settings={settings}
                childName={profile.name || 'bé Gạo'}
                isStandaloneView={true}
                onOpenScheduleSettings={() => setIsParentModalOpen(true)}
                onSelectSubject={(sub) => {
                  if (sub === 'vietnamese' || sub === 'math' || sub === 'english') {
                    setActiveTab(sub);
                  }
                }}
              />
            </div>
          )}

          {/* ACTIVE VIEW 5: TIẾN ĐỘ HỌC TẬP */}
          {activeTab === 'progress' && (
            <div className="animate-fade-in">
              <ProgressReportView
                profile={profile}
                settings={settings}
                onOpenParentSettings={() => setIsParentModalOpen(true)}
                onStartSubject={(sub) => setActiveTab(sub)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Parent Dashboard Modal */}
      <ParentModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
        appState={appState}
        onUpdateState={(newState) => setAppState(newState)}
      />

      {/* Sticker & Badges Treasury Album */}
      <StickerAlbumModal
        isOpen={isStickerAlbumOpen}
        onClose={() => setIsStickerAlbumOpen(false)}
        profile={profile}
        settings={settings}
      />

      {/* Screen Time Lock Screen */}
      <ScreenTimeLock
        isOpen={isScreenTimeLocked}
        settings={settings}
        onExtend15Mins={() => {
          setAppState((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              todayUsageMinutes: Math.max(0, prev.profile.todayUsageMinutes - 15),
            },
          }));
          setIsScreenTimeLocked(false);
        }}
        onUnlockTemporarily={() => {
          setIsScreenTimeLocked(false);
        }}
      />

      {/* Reward Confetti Celebration Modal */}
      <RewardModal
        isOpen={rewardData.isOpen}
        score={rewardData.score}
        total={rewardData.total}
        starsEarned={rewardData.starsEarned}
        newStickerUnlocked={rewardData.newSticker}
        language={settings.language}
        soundEnabled={settings.soundEnabled}
        onPlayAgain={() => {
          setRewardData((prev) => ({ ...prev, isOpen: false }));
        }}
        onNextOrHome={() => {
          setRewardData((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
}
