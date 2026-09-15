import React, { useState } from 'react';
import { Calendar, Bell, ArrowRight, Settings2, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
import { ParentSettings, Subject } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface ScheduleBannerProps {
  settings: ParentSettings;
  onStartScheduledLesson: (subject: Subject) => void;
  onOpenScheduleSettings: () => void;
}

export const ScheduleBanner: React.FC<ScheduleBannerProps> = ({
  settings,
  onStartScheduledLesson,
  onOpenScheduleSettings,
}) => {
  const [showFullWeeklyView, setShowFullWeeklyView] = useState(false);
  const t = translations[settings.language];
  const todayDayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon ...
  const todaySchedule = settings.schedule.find((s) => s.dayIndex === todayDayIndex) || settings.schedule[0];

  const handleStart = (sub?: Subject | 'both' | 'all' | 'rest') => {
    soundFx.playPop(settings.soundEnabled);
    const targetSub = sub || todaySchedule.subject;
    if (targetSub === 'vietnamese') {
      onStartScheduledLesson('vietnamese');
    } else if (targetSub === 'math') {
      onStartScheduledLesson('math');
    } else if (targetSub === 'english') {
      onStartScheduledLesson('english');
    } else {
      // both, all or rest -> default to vietnamese or today's primary
      onStartScheduledLesson('vietnamese');
    }
  };

  const getSubjectBadge = (sub: Subject | 'both' | 'all' | 'rest') => {
    switch (sub) {
      case 'vietnamese':
        return (
          <span className="bg-rose-100 text-rose-700 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-rose-300">
            🔤 {t.vietnamese}
          </span>
        );
      case 'math':
        return (
          <span className="bg-sky-100 text-sky-700 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-sky-300">
            🔢 {t.math}
          </span>
        );
      case 'english':
        return (
          <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-emerald-300">
            🇬🇧 {t.english}
          </span>
        );
      case 'both':
      case 'all':
        return (
          <span className="bg-purple-100 text-purple-700 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-purple-300">
            🌟 {settings.language === 'vi' ? 'Toán, TV & Anh' : 'All Subjects'}
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-amber-300">
            🎈 {settings.language === 'vi' ? 'Nghỉ Ngơi' : 'Free Time'}
          </span>
        );
    }
  };

  return (
    <section aria-label="Schedule Banner" className="w-full bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border-b-2 border-amber-200/90 py-2.5 px-3 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Left: Schedule Information */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-amber-950 rounded-2xl shadow-sm border border-amber-500/20 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {settings.language === 'vi' ? todaySchedule.dayNameVi : todaySchedule.dayNameEn}
                </span>
                {getSubjectBadge(todaySchedule.subject)}
                <span className="text-xs font-semibold text-slate-600 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200">
                  ⏰ {todaySchedule.timeSlot}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5 flex items-center gap-1.5">
                <span>{settings.language === 'vi' ? todaySchedule.titleVi : todaySchedule.titleEn}</span>
                <span className="hidden sm:inline text-slate-400 font-normal">|</span>
                <span className="hidden sm:inline text-xs text-amber-800 font-semibold bg-amber-200/60 px-1.5 py-0.5 rounded">
                  🎯 {todaySchedule.targetGoal} {settings.language === 'vi' ? 'bài tập' : 'tasks'}
                </span>
              </p>
            </div>
          </div>

          {/* Center: Week at a Glance mini-calendar */}
          <div className="hidden lg:flex items-center gap-1 bg-white/70 p-1.5 rounded-2xl border border-amber-200/80">
            {settings.schedule.map((item) => {
              const isToday = item.dayIndex === todayDayIndex;
              return (
                <button
                  key={item.dayIndex}
                  onClick={() => handleStart(item.subject)}
                  title={`${item.dayNameVi}: ${item.titleVi}`}
                  className={`text-center px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    isToday
                      ? 'bg-amber-400 text-amber-950 font-black shadow-sm scale-105 border border-amber-500'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase">
                    {settings.language === 'vi' ? item.dayNameVi.slice(0, 4) : item.dayNameEn.slice(0, 3)}
                  </div>
                  <div className="text-xs">
                    {item.subject === 'vietnamese' ? '🔤' : item.subject === 'math' ? '🔢' : item.subject === 'english' ? '🇬🇧' : item.subject === 'both' || item.subject === 'all' ? '🌟' : '🎈'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Actions & Reminder indicator */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {/* Toggle full weekly timetable display on home page */}
            <button
              id="btn-toggle-full-schedule"
              onClick={() => setShowFullWeeklyView(!showFullWeeklyView)}
              className="flex items-center gap-1 px-3 py-2 bg-white/90 hover:bg-white border border-amber-300 text-amber-900 rounded-2xl text-xs font-black shadow-xs cursor-pointer active:scale-95"
            >
              <span>{showFullWeeklyView ? t.hideFullSchedule : t.viewFullSchedule}</span>
              {showFullWeeklyView ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Reminder status */}
            {settings.reminderEnabled && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-200/70 border border-amber-300 px-2 py-1.5 rounded-xl">
                <Bell className="w-3.5 h-3.5 text-amber-700 animate-bounce-gentle" />
                <span>{settings.reminderTime}</span>
              </div>
            )}

            {/* Quick Start Button */}
            <button
              id="btn-schedule-start"
              onClick={() => handleStart()}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-sm border border-orange-400 active:scale-95 transition-all cursor-pointer"
            >
              <span>{t.startScheduledLesson}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Edit Schedule Button */}
            <button
              id="btn-schedule-edit"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                onOpenScheduleSettings();
              }}
              title={t.editSchedule}
              className="p-2 rounded-2xl bg-white hover:bg-slate-50 border border-amber-200 text-slate-600 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* EXPANDABLE FULL 7-DAY WEEKLY SCHEDULE ON HOME PAGE FOR PARENTS */}
        {showFullWeeklyView && (
          <div className="bg-white/95 rounded-3xl p-4 border-2 border-amber-300 shadow-lg space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <h4 className="font-black text-sm text-slate-900">
                  Lịch Học Tuần Chi Tiết Dành Cho Phụ Huynh Theo Dõi
                </h4>
              </div>
              <button
                onClick={onOpenScheduleSettings}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 underline flex items-center gap-1 cursor-pointer"
              >
                <span>Chỉnh sửa / Nhập file TKB</span>
                <Settings2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {settings.schedule.map((day) => {
                const isToday = day.dayIndex === todayDayIndex;
                return (
                  <div
                    key={day.dayIndex}
                    className={`p-3 rounded-2xl border-2 flex flex-col justify-between gap-2 transition-all ${
                      isToday
                        ? 'bg-amber-50 border-amber-500 shadow-sm ring-2 ring-amber-300'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xs text-slate-900">
                          {day.dayNameVi} {isToday && <span className="text-[10px] text-amber-600 bg-amber-200 px-1 rounded font-bold">Hôm nay</span>}
                        </span>
                      </div>
                      <div className="my-1">
                        {getSubjectBadge(day.subject)}
                      </div>
                      <p className="text-[11px] font-bold text-slate-700 mt-1 line-clamp-2">
                        {day.titleVi}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        ⏰ {day.timeSlot}
                      </p>
                    </div>

                    <button
                      onClick={() => handleStart(day.subject)}
                      className="w-full py-1.5 px-2 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 font-bold text-[10px] rounded-xl transition-all cursor-pointer text-center"
                    >
                      Bắt đầu ôn môn này 🚀
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

