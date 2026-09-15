import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ScheduleBanner } from './components/ScheduleBanner';
import { VietnameseGame } from './components/VietnameseGame';
import { MathGame } from './components/MathGame';
import { EnglishGame } from './components/EnglishGame';
import { ParentModal } from './components/ParentModal';
import { StickerAlbumModal } from './components/StickerAlbumModal';
import { ScreenTimeLock } from './components/ScreenTimeLock';
import { RewardModal } from './components/RewardModal';
import { AppState, ChildProfile, ParentSettings, Sticker, StudySession, Subject } from './types';
import { loadInitialState, saveStateToLocal, sendLocalNotification } from './utils/storage';
import { translations } from './utils/translations';
import { soundFx } from './utils/audio';
import { INITIAL_STICKERS } from './data/rewards';

export default function App() {
  const [appState, setAppState] = useState<AppState>(loadInitialState);
  const { profile, settings } = appState;
  const t = translations[settings.language];

  // Active Subject: 'vietnamese', 'math', or 'english'
  const [activeSubject, setActiveSubject] = useState<Subject>('vietnamese');

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

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-800 flex flex-col selection:bg-amber-200">
      {/* 1. Header with Child Profile, Stars & Sound Controls */}
      <Header
        profile={profile}
        settings={settings}
        onOpenParentModal={() => setIsParentModalOpen(true)}
        onOpenStickerAlbum={() => setIsStickerAlbumOpen(true)}
        onToggleSound={handleToggleSound}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* 2. Clear Timetable Banner at the top */}
      <ScheduleBanner
        settings={settings}
        onStartScheduledLesson={(sub) => setActiveSubject(sub)}
        onOpenScheduleSettings={() => setIsParentModalOpen(true)}
      />

      {/* 3. Main Learning Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4">
        {/* Subject Switcher Bar (Big, Touchable, Playful) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            id="btn-switch-vietnamese"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setActiveSubject('vietnamese');
            }}
            className={`py-3 sm:py-3.5 px-2 sm:px-4 rounded-3xl font-black text-sm sm:text-lg border-3 flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer active:scale-98 ${
              activeSubject === 'vietnamese'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-600 shadow-lg scale-102'
                : 'bg-white hover:bg-rose-50 text-slate-700 border-rose-200'
            }`}
          >
            <span className="text-xl sm:text-2xl">🔤</span>
            <span>{t.vietnamese}</span>
          </button>

          <button
            id="btn-switch-math"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setActiveSubject('math');
            }}
            className={`py-3 sm:py-3.5 px-2 sm:px-4 rounded-3xl font-black text-sm sm:text-lg border-3 flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer active:scale-98 ${
              activeSubject === 'math'
                ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white border-sky-600 shadow-lg scale-102'
                : 'bg-white hover:bg-sky-50 text-slate-700 border-sky-200'
            }`}
          >
            <span className="text-xl sm:text-2xl">🔢</span>
            <span>{t.math}</span>
          </button>

          <button
            id="btn-switch-english"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setActiveSubject('english');
            }}
            className={`py-3 sm:py-3.5 px-2 sm:px-4 rounded-3xl font-black text-sm sm:text-lg border-3 flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer active:scale-98 ${
              activeSubject === 'english'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-600 shadow-lg scale-102'
                : 'bg-white hover:bg-emerald-50 text-slate-700 border-emerald-200'
            }`}
          >
            <span className="text-xl sm:text-2xl">🇬🇧</span>
            <span>{t.english || 'Tiếng Anh'}</span>
          </button>
        </div>

        {/* Active Learning Game Area */}
        <div className="transition-all duration-200">
          {activeSubject === 'vietnamese' ? (
            <VietnameseGame
              settings={settings}
              onFinishExercise={handleFinishExercise}
            />
          ) : activeSubject === 'math' ? (
            <MathGame
              settings={settings}
              onFinishExercise={handleFinishExercise}
            />
          ) : (
            <EnglishGame
              settings={settings}
              gradeLevel={profile.gradeLevel || 'grade_1'}
              onFinishExercise={handleFinishExercise}
            />
          )}
        </div>
      </main>

      {/* 4. Parent Dashboard Modal */}
      <ParentModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
        appState={appState}
        onUpdateState={(newState) => setAppState(newState)}
      />

      {/* 5. Sticker & Badges Treasury Album */}
      <StickerAlbumModal
        isOpen={isStickerAlbumOpen}
        onClose={() => setIsStickerAlbumOpen(false)}
        profile={profile}
        settings={settings}
      />

      {/* 6. Screen Time Lock Screen */}
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

      {/* 7. Reward Confetti Celebration Modal */}
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
