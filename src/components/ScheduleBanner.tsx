import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Settings2,
  Backpack,
  CheckCircle2,
  Phone,
  UserCheck,
  AlertCircle,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { ParentSettings, SchoolDaySchedule, Subject } from '../types';
import {
  DEFAULT_SCHOOL_TIMETABLE,
  HUYNH_NGOC_HUE_CLASS_INFO,
  getSubjectMeta,
} from '../utils/timetableHelper';
import { soundFx } from '../utils/audio';

interface ScheduleBannerProps {
  settings: ParentSettings;
  childName?: string;
  isStandaloneView?: boolean;
  onOpenScheduleSettings: () => void;
  onSelectSubject?: (subject: Subject) => void;
}

export const ScheduleBanner: React.FC<ScheduleBannerProps> = ({
  settings,
  childName = 'bé Gạo',
  isStandaloneView = false,
  onOpenScheduleSettings,
}) => {
  const timetable: SchoolDaySchedule[] =
    settings.schoolTimetable && settings.schoolTimetable.length > 0
      ? settings.schoolTimetable
      : DEFAULT_SCHOOL_TIMETABLE;

  const showWeekends = !!settings.showWeekendTimetable;
  const dayIndices = showWeekends ? [1, 2, 3, 4, 5, 6, 0] : [1, 2, 3, 4, 5];

  const todayDayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const initialDayIndex = dayIndices.includes(todayDayIndex) ? todayDayIndex : 1;
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(initialDayIndex);
  const [showFullWeeklyView, setShowFullWeeklyView] = useState(isStandaloneView);
  const [showBackpackChecklist, setShowBackpackChecklist] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const activeDaySchedule =
    timetable.find((d) => d.dayIndex === selectedDayIndex) ||
    timetable.find((d) => d.dayIndex === 1) ||
    DEFAULT_SCHOOL_TIMETABLE[0];

  const toggleCheckItem = (id: string) => {
    soundFx.playPop(settings.soundEnabled);
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Days list for selector (Mon -> Fri by default, Sat/Sun if enabled in Settings)
  const orderedDays = dayIndices
    .map((idx) => timetable.find((d) => d.dayIndex === idx))
    .filter(Boolean) as SchoolDaySchedule[];

  // Get tomorrow schedule for backpack prep
  const tomorrowDayIndex = (todayDayIndex + 1) % 7;
  const tomorrowSchedule = timetable.find((d) => d.dayIndex === tomorrowDayIndex) || timetable[0];
  const tomorrowSubjects = [
    ...tomorrowSchedule.morningPeriods.map((p) => p.subjectName),
    ...tomorrowSchedule.afternoonPeriods.map((p) => p.subjectName),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const isPEday = selectedDayIndex === 2 || selectedDayIndex === 4;
  const isLateStart = selectedDayIndex === 3 || selectedDayIndex === 4 || selectedDayIndex === 5;

  return (
    <section
      aria-label="Thời khóa biểu trường Huỳnh Ngọc Huệ của bé"
      className={
        isStandaloneView
          ? 'w-full bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 rounded-3xl border-2 border-amber-300 p-4 sm:p-6 shadow-sm space-y-4'
          : 'w-full bg-gradient-to-r from-amber-100/90 via-orange-50 to-amber-100/90 border-b-2 border-amber-300/80 py-3 px-3 sm:px-6 shadow-xs'
      }
    >
      <div className={isStandaloneView ? 'w-full space-y-4' : 'max-w-7xl mx-auto space-y-3'}>
        {/* School & Teacher Banner Header */}
        <div className="bg-white/90 border border-amber-200 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xs shrink-0">
              🏫
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-xs uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  {HUYNH_NGOC_HUE_CLASS_INFO.schoolName}
                </span>
                <span className="font-black text-sm text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  {HUYNH_NGOC_HUE_CLASS_INFO.className}
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  {HUYNH_NGOC_HUE_CLASS_INFO.academicYear}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-700 font-medium">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>GVCN: <strong className="text-slate-900">{HUYNH_NGOC_HUE_CLASS_INFO.teacherName}</strong></span>
                </span>
                <span className="flex items-center gap-1 text-sky-800">
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span>SĐT: <strong className="font-bold">{HUYNH_NGOC_HUE_CLASS_INFO.teacherPhone}</strong></span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Notice Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {isPEday && (
              <span className="inline-flex items-center gap-1 text-xs font-black bg-orange-100 text-orange-900 border border-orange-300 px-2.5 py-1 rounded-xl animate-pulse">
                <Shirt className="w-3.5 h-3.5 text-orange-600" />
                <span>Mặc Đồng Phục Thể Dục</span>
              </span>
            )}
            {isLateStart ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Vào lớp lúc 8h00</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Vào lớp lúc 7h30</span>
              </span>
            )}
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-xl">
              Tan trường: 16h30
            </span>
          </div>
        </div>

        {/* Day Selector & Action Buttons */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Day Tabs */}
          <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl border border-amber-300 shadow-2xs overflow-x-auto max-w-full">
            {orderedDays.map((day) => {
              const isSelected = day.dayIndex === selectedDayIndex;
              const isToday = day.dayIndex === todayDayIndex;
              return (
                <button
                  key={day.dayIndex}
                  onClick={() => {
                    soundFx.playPop(settings.soundEnabled);
                    setSelectedDayIndex(day.dayIndex);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm scale-102'
                      : isToday
                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                      : 'text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  <span>{day.dayNameVi}</span>
                  {isToday && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded-full font-extrabold ${
                        isSelected ? 'bg-white text-amber-800' : 'bg-amber-400 text-amber-950'
                      }`}
                    >
                      Nay
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              id="btn-toggle-full-timetable"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setShowFullWeeklyView(!showFullWeeklyView);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-extrabold shadow-2xs cursor-pointer active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>{showFullWeeklyView ? 'Thu Gọn Bảng Tuần' : 'Xem Bảng Cả Tuần'}</span>
              {showFullWeeklyView ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              id="btn-backpack-prep"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setShowBackpackChecklist(!showBackpackChecklist);
              }}
              title="Soạn sách vở cho ngày mai"
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-2xs cursor-pointer active:scale-95"
            >
              <Backpack className="w-3.5 h-3.5" />
              <span>Soạn Cặp Sách</span>
            </button>
          </div>
        </div>

        {/* Note for Active Day */}
        {activeDaySchedule.notes && (
          <div className="bg-amber-50/90 border-l-4 border-amber-400 p-2.5 rounded-r-xl text-xs font-semibold text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{activeDaySchedule.notes}</span>
          </div>
        )}

        {/* Active Day Detail: Morning & Afternoon Periods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* BUỔI SÁNG */}
          <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span>☀️ BUỔI SÁNG</span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  {activeDaySchedule.morningPeriods.length} tiết
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {selectedDayIndex >= 3 && selectedDayIndex <= 5 ? 'Vào lớp: 8h00' : 'Vào lớp: 7h30'} – Ra chơi: 8h55–9h15
              </span>
            </div>

            {activeDaySchedule.morningPeriods.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 italic">
                Sáng hôm nay không có tiết học
              </div>
            ) : (
              <div className="space-y-2">
                {activeDaySchedule.morningPeriods.map((period) => {
                  const meta = getSubjectMeta(period.subjectName);
                  return (
                    <div
                      key={`m-${period.periodNumber}`}
                      className={`p-2.5 rounded-xl border ${meta.bgClass} ${meta.borderClass} flex items-center justify-between gap-2 transition-all hover:shadow-2xs`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-white/80 font-black text-xs text-slate-700 flex items-center justify-center border border-slate-200 shrink-0">
                          {period.periodNumber}
                        </span>
                        <span className="text-lg shrink-0">{meta.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black ${meta.colorClass} truncate`}>
                              {period.subjectName}
                            </span>
                            {period.teacher && (
                              <span className="text-[11px] font-semibold text-slate-600 bg-white/80 px-1.5 py-0.2 rounded-md border border-slate-200 truncate">
                                🧑‍🏫 {period.teacher}
                              </span>
                            )}
                          </div>
                          {period.note && (
                            <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                              {period.note}
                            </span>
                          )}
                        </div>
                      </div>

                      {period.time && (
                        <span className="text-[11px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                          {period.time}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* BUỔI CHIỀU */}
          <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                <span>🌤️ BUỔI CHIỀU</span>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {activeDaySchedule.afternoonPeriods.length} tiết
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                14h10 - 16h30 – Ra chơi: 15h35–15h55
              </span>
            </div>

            {activeDaySchedule.afternoonPeriods.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 italic">
                Chiều hôm nay không có tiết học
              </div>
            ) : (
              <div className="space-y-2">
                {activeDaySchedule.afternoonPeriods.map((period) => {
                  const meta = getSubjectMeta(period.subjectName);
                  return (
                    <div
                      key={`a-${period.periodNumber}`}
                      className={`p-2.5 rounded-xl border ${meta.bgClass} ${meta.borderClass} flex items-center justify-between gap-2 transition-all hover:shadow-2xs`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-white/80 font-black text-xs text-slate-700 flex items-center justify-center border border-slate-200 shrink-0">
                          {period.periodNumber}
                        </span>
                        <span className="text-lg shrink-0">{meta.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black ${meta.colorClass} truncate`}>
                              {period.subjectName}
                            </span>
                            {period.teacher && (
                              <span className="text-[11px] font-semibold text-slate-600 bg-white/80 px-1.5 py-0.2 rounded-md border border-slate-200 truncate">
                                🧑‍🏫 {period.teacher}
                              </span>
                            )}
                          </div>
                          {period.note && (
                            <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                              {period.note}
                            </span>
                          )}
                        </div>
                      </div>

                      {period.time && (
                        <span className="text-[11px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                          {period.time}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* BACKPACK CHECKLIST MODAL / DRAWER */}
        {showBackpackChecklist && (
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Backpack className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-xs sm:text-sm text-emerald-950">
                  Góc Soạn Sách Vở Cho {tomorrowSchedule.dayNameVi} Ngày Mai
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                {tomorrowSubjects.length} môn học
              </span>
            </div>

            <p className="text-xs text-emerald-800">
              Bé Gạo cùng bố mẹ đánh dấu các sách vở và dụng cụ học tập cần mang đến lớp nhé:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {tomorrowSubjects.map((subName, i) => {
                const meta = getSubjectMeta(subName);
                const itemId = `tomorrow-${subName}-${i}`;
                const isChecked = checkedItems[itemId] || false;
                return (
                  <button
                    key={itemId}
                    onClick={() => toggleCheckItem(itemId)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{meta.icon}</span>
                      <span className="text-xs font-extrabold truncate">{subName}</span>
                    </div>
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${isChecked ? 'text-white' : 'text-slate-300'}`} />
                  </button>
                );
              })}

              <button
                onClick={() => toggleCheckItem('item-pencil-box')}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                  checkedItems['item-pencil-box']
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-800 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>✏️</span>
                  <span className="text-xs font-extrabold truncate">Hộp bút & Thước kẻ</span>
                </div>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${checkedItems['item-pencil-box'] ? 'text-white' : 'text-slate-300'}`} />
              </button>

              <button
                onClick={() => toggleCheckItem('item-water-bottle')}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                  checkedItems['item-water-bottle']
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-800 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>💧</span>
                  <span className="text-xs font-extrabold truncate">Bình nước uống</span>
                </div>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${checkedItems['item-water-bottle'] ? 'text-white' : 'text-slate-300'}`} />
              </button>
            </div>
          </div>
        )}

        {/* FULL WEEKLY TIMETABLE TABLE (Exact format of Trường Huỳnh Ngọc Huệ) */}
        {showFullWeeklyView && (
          <div className="p-4 bg-white rounded-3xl border-2 border-amber-300 shadow-md space-y-4 animate-in fade-in duration-200 overflow-hidden">
            {/* Header Title inside table */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
              <div>
                <div className="text-[11px] font-bold uppercase text-slate-500">
                  ỦY BAN NHÂN DÂN PHƯỜNG THANH KHÊ – TRƯỜNG TIỂU HỌC HUỲNH NGỌC HUỆ
                </div>
                <h3 className="font-black text-base text-red-600 tracking-tight flex items-center gap-2">
                  <span>THỜI KHÓA BIỂU - LỚP 1/8</span>
                  <span className="text-xs font-bold text-slate-600 bg-amber-100 px-2 py-0.5 rounded-md">
                    Năm học 2026 - 2027
                  </span>
                </h3>
                <div className="text-xs text-slate-600 mt-0.5">
                  GVCN: <strong>Lê Thị Minh Thanh</strong> — SĐT: <strong>0775.526.778</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenScheduleSettings}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                >
                  <Settings2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Cài đặt thời khóa biểu</span>
                </button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto border border-amber-200 rounded-2xl">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white border-b border-slate-700 text-center font-black">
                    <th className="p-2 border-r border-slate-700 w-14">TIẾT</th>
                    <th className="p-2 border-r border-slate-700 w-28">THỜI GIAN</th>
                    {orderedDays.map((d) => (
                      <th
                        key={d.dayIndex}
                        className={`p-2 border-r border-slate-700 min-w-[120px] text-white ${
                          d.dayIndex === 1
                            ? 'bg-amber-600'
                            : d.dayIndex === 2
                            ? 'bg-sky-600'
                            : d.dayIndex === 3
                            ? 'bg-amber-600'
                            : d.dayIndex === 4
                            ? 'bg-orange-600'
                            : d.dayIndex === 5
                            ? 'bg-blue-600'
                            : 'bg-emerald-600'
                        }`}
                      >
                        {d.dayNameVi.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* BUỔI SÁNG Banner */}
                  <tr className="bg-amber-100/90 text-amber-950 font-black text-center border-b border-amber-200">
                    <td colSpan={orderedDays.length + 2} className="py-1.5 tracking-wide text-xs">
                      ☀️ BUỔI SÁNG
                    </td>
                  </tr>

                  {/* Sáng Tiết 1, 2, 3, 4 */}
                  {[
                    { num: 1, defaultTime: '7h30 - 8h15' },
                    { num: 2, defaultTime: '8h20 - 8h55' },
                    { num: 3, defaultTime: '9h15 - 9h50' },
                    { num: 4, defaultTime: '9h55 - 10h30' },
                  ].map((pInfo, idx) => (
                    <React.Fragment key={`morning-${pInfo.num}`}>
                      {/* RA CHƠI SÁNG between period 2 and 3 */}
                      {pInfo.num === 3 && (
                        <tr className="bg-sky-50 text-sky-900 text-center font-extrabold border-b border-sky-200">
                          <td colSpan={orderedDays.length + 2} className="py-1 text-[11px] tracking-wider">
                            ⚡ RA CHƠI 8H55 – 9H15 ⚡
                          </td>
                        </tr>
                      )}
                      <tr className={`border-b ${idx === 3 ? 'border-b-2 border-slate-300' : 'border-slate-200'} hover:bg-amber-50/40`}>
                        <td className="p-2 text-center font-black text-slate-700 border-r border-slate-200 bg-slate-50">
                          Tiết {pInfo.num}
                        </td>
                        <td className="p-2 text-center text-slate-600 font-semibold border-r border-slate-200 bg-slate-50">
                          {pInfo.defaultTime}
                        </td>
                        {orderedDays.map((day) => {
                          const period = day.morningPeriods.find((p) => p.periodNumber === pInfo.num);
                          if (!period) {
                            const isLate = pInfo.num === 1 && (day.dayIndex >= 3 && day.dayIndex <= 5);
                            return (
                              <td key={day.dayIndex} className="p-2 border-r border-slate-200 text-center text-slate-300 italic">
                                {isLate ? '(Vào lớp 8h00)' : '—'}
                              </td>
                            );
                          }
                          const meta = getSubjectMeta(period.subjectName);
                          return (
                            <td key={day.dayIndex} className={`p-2 border-r border-slate-200 text-center ${meta.bgClass}`}>
                              <div className={`font-bold ${meta.colorClass}`}>{period.subjectName}</div>
                              {period.teacher && (
                                <div className="text-[10px] text-slate-500 italic">({period.teacher})</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </React.Fragment>
                  ))}

                  {/* NGHỈ TRƯA & BÁN TRÚ */}
                  <tr className="bg-slate-100 text-slate-700 font-black text-center border-b-2 border-slate-300">
                    <td colSpan={orderedDays.length + 2} className="py-2 text-xs">
                      🍱 NGHỈ TRƯA & BÁN TRÚ (10h30 – 14h10)
                    </td>
                  </tr>

                  {/* BUỔI CHIỀU Banner */}
                  <tr className="bg-blue-100/90 text-blue-950 font-black text-center border-b border-blue-200">
                    <td colSpan={orderedDays.length + 2} className="py-1.5 tracking-wide text-xs">
                      🌤️ BUỔI CHIỀU
                    </td>
                  </tr>

                  {/* Chiều Tiết 1, 2, 3 */}
                  {[
                    { num: 1, defaultTime: '14h10 - 14h55' },
                    { num: 2, defaultTime: '15h00 - 15h35' },
                    { num: 3, defaultTime: '15h55 - 16h30' },
                  ].map((pInfo) => (
                    <React.Fragment key={`afternoon-${pInfo.num}`}>
                      {/* RA CHƠI CHIỀU between period 2 and 3 */}
                      {pInfo.num === 3 && (
                        <tr className="bg-sky-50 text-sky-900 text-center font-extrabold border-b border-sky-200">
                          <td colSpan={orderedDays.length + 2} className="py-1 text-[11px] tracking-wider">
                            ⚡ RA CHƠI 15H35 – 15H55 ⚡
                          </td>
                        </tr>
                      )}
                      <tr className="border-b border-slate-200 hover:bg-amber-50/40">
                        <td className="p-2 text-center font-black text-slate-700 border-r border-slate-200 bg-slate-50">
                          Tiết {pInfo.num}
                        </td>
                        <td className="p-2 text-center text-slate-600 font-semibold border-r border-slate-200 bg-slate-50">
                          {pInfo.defaultTime}
                        </td>
                        {orderedDays.map((day) => {
                          const period = day.afternoonPeriods.find((p) => p.periodNumber === pInfo.num);
                          if (!period) {
                            return (
                              <td key={day.dayIndex} className="p-2 border-r border-slate-200 text-center text-slate-300 italic">
                                —
                              </td>
                            );
                          }
                          const meta = getSubjectMeta(period.subjectName);
                          return (
                            <td key={day.dayIndex} className={`p-2 border-r border-slate-200 text-center ${meta.bgClass}`}>
                              <div className={`font-bold ${meta.colorClass}`}>{period.subjectName}</div>
                              {period.teacher && (
                                <div className="text-[10px] text-slate-500 italic">({period.teacher})</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* LƯU Ý BOX */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 p-4 rounded-2xl space-y-2">
              <div className="font-black text-sm text-emerald-950 flex items-center gap-2">
                <span>📌 LƯU Ý TỪ NHÀ TRƯỜNG & CÔ CHỦ NHIỆM:</span>
              </div>
              <ul className="text-xs text-emerald-900 space-y-1 list-disc list-inside font-medium">
                <li>
                  <strong>Vào lớp lúc 7h30, ra về 16h30</strong>, riêng sáng Thứ Tư, Thứ Năm, Thứ Sáu vào lớp lúc <strong>8h00</strong>.
                </li>
                <li>
                  <strong className="text-orange-800">Mặc đồng phục thể dục vào Thứ Ba, Thứ Năm</strong> (các ngày có tiết GDTC cùng Thầy Học).
                </li>
                <li>Tiết in nghiêng là của giáo viên bộ môn (các tiết còn lại do Cô GVCN Lê Thị Minh Thanh giảng dạy).</li>
                <li>
                  <strong>Chú thích viết tắt:</strong> TC: tăng cường, HĐTN: Hoạt động trải nghiệm, TNXH: Tự nhiên xã hội, GDTC: Giáo dục thể chất, CC: Chào cờ, SHL: Sinh hoạt lớp.
                </li>
              </ul>
              <div className="pt-2 text-center font-black text-sm text-rose-700 border-t border-emerald-200">
                🌺 Chăm ngoan, học giỏi – Mỗi ngày một niềm vui! 🌺
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
