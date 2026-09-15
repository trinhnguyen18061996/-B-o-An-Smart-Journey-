import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Settings2,
  FileSpreadsheet,
  Download,
  BookOpen,
  Sparkles,
  Backpack,
  CheckCircle2,
} from 'lucide-react';
import { ParentSettings, SchoolDaySchedule, SchoolPeriod, Subject } from '../types';
import { DEFAULT_SCHOOL_TIMETABLE, getSubjectMeta, exportTimetableToExcel } from '../utils/timetableHelper';
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
  onSelectSubject,
}) => {
  const timetable: SchoolDaySchedule[] = settings.schoolTimetable && settings.schoolTimetable.length > 0
    ? settings.schoolTimetable
    : DEFAULT_SCHOOL_TIMETABLE;

  const todayDayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(
    timetable.some((d) => d.dayIndex === todayDayIndex) ? todayDayIndex : 1
  );
  const [showFullWeeklyView, setShowFullWeeklyView] = useState(false);
  const [showBackpackChecklist, setShowBackpackChecklist] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const activeDaySchedule = timetable.find((d) => d.dayIndex === selectedDayIndex) || timetable[0];

  const handleDownloadExcel = () => {
    soundFx.playSuccess(settings.soundEnabled);
    exportTimetableToExcel(timetable, childName);
  };

  const toggleCheckItem = (id: string) => {
    soundFx.playPop(settings.soundEnabled);
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Days list for selector (Mon -> Sat, Sun)
  const orderedDays = [1, 2, 3, 4, 5, 6, 0]
    .map((idx) => timetable.find((d) => d.dayIndex === idx))
    .filter(Boolean) as SchoolDaySchedule[];

  // Get tomorrow schedule for backpack prep
  const tomorrowDayIndex = (todayDayIndex + 1) % 7;
  const tomorrowSchedule = timetable.find((d) => d.dayIndex === tomorrowDayIndex) || timetable[0];
  const tomorrowSubjects = [
    ...tomorrowSchedule.morningPeriods.map((p) => p.subjectName),
    ...tomorrowSchedule.afternoonPeriods.map((p) => p.subjectName),
  ].filter((v, i, a) => a.indexOf(v) === i); // unique

  return (
    <section
      aria-label="Thời khóa biểu trường lớp của bé"
      className={
        isStandaloneView
          ? 'w-full bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 rounded-3xl border-2 border-amber-300 p-4 sm:p-6 shadow-sm space-y-4'
          : 'w-full bg-gradient-to-r from-amber-100/90 via-orange-50 to-amber-100/90 border-b-2 border-amber-300/80 py-3 px-3 sm:px-6 shadow-xs'
      }
    >
      <div className={isStandaloneView ? 'w-full space-y-4' : 'max-w-7xl mx-auto space-y-3'}>
        {/* Top Header Row of Schedule */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Left: Title & Quick Today Info */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-amber-950 rounded-2xl shadow-sm border border-amber-500/30 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
                  Thời Khóa Biểu Trường Lớp của {childName}
                </h2>
                <span className="bg-amber-500 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-2xs">
                  {selectedDayIndex === todayDayIndex ? '🌟 Hôm Nay' : activeDaySchedule.dayNameVi}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200">
                  Lịch học ở trường
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {activeDaySchedule.notes || `Xem các tiết học sáng & chiều để chuẩn bị sách vở chu đáo`}
              </p>
            </div>
          </div>

          {/* Center: Day Selector Tabs (Thứ 2 -> Thứ 7, CN) */}
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded-2xl border border-amber-300 shadow-2xs overflow-x-auto max-w-full">
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
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm scale-102'
                      : isToday
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'text-slate-600 hover:bg-amber-50'
                  }`}
                >
                  <span>{day.dayNameVi}</span>
                  {isToday && (
                    <span className={`text-[9px] px-1 py-0.2 rounded-full ${isSelected ? 'bg-white text-amber-800' : 'bg-amber-400 text-amber-950'}`}>
                      Nay
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Controls (Toggle Full View, Backpack, Excel Export/Import) */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Toggle Full Matrix Timetable */}
            <button
              id="btn-toggle-full-timetable"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setShowFullWeeklyView(!showFullWeeklyView);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-extrabold shadow-2xs cursor-pointer active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>{showFullWeeklyView ? 'Thu Gọn Bảng' : 'Xem Bảng Cả Tuần'}</span>
              {showFullWeeklyView ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Backpack Prep Helper */}
            <button
              id="btn-backpack-prep"
              onClick={() => {
                soundFx.playPop(settings.soundEnabled);
                setShowBackpackChecklist(!showBackpackChecklist);
              }}
              title="Soạn sách vở cho ngày mai"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-2xs cursor-pointer active:scale-95"
            >
              <Backpack className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Soạn Cặp Sách</span>
            </button>

            {/* Direct Link to Parent Timetable Settings */}
            <button
              id="btn-schedule-banner-settings"
              onClick={onOpenScheduleSettings}
              title="Nhập file Excel thời khóa biểu hoặc chỉnh sửa"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl text-xs font-black border border-amber-500 shadow-2xs cursor-pointer active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Nhập Excel</span>
            </button>
          </div>
        </div>

        {/* Active Day Period Pills (Sáng & Chiều) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
          {/* SÁNG */}
          <div className="bg-white/95 p-3 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <span>☀️ Buổi Sáng</span>
                <span className="text-[11px] font-semibold text-slate-400">
                  ({activeDaySchedule.morningPeriods.length} tiết)
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Từ 07:30 - 10:30</span>
            </div>

            {activeDaySchedule.morningPeriods.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 text-center">Không có tiết học buổi sáng</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {activeDaySchedule.morningPeriods.map((period) => {
                  const meta = getSubjectMeta(period.subjectName);
                  return (
                    <div
                      key={period.periodNumber}
                      className={`p-2 rounded-xl border ${meta.bgClass} ${meta.borderClass} flex flex-col justify-between transition-all hover:scale-102`}
                      title={period.note ? `${period.subjectName}: ${period.note}` : period.subjectName}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-slate-500">Tiết {period.periodNumber}</span>
                        <span className="text-base">{meta.icon}</span>
                      </div>
                      <span className={`text-xs font-black ${meta.colorClass} truncate mt-1`}>
                        {period.subjectName}
                      </span>
                      {period.note && (
                        <span className="text-[10px] text-slate-500 truncate mt-0.5" title={period.note}>
                          📝 {period.note}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CHIỀU */}
          <div className="bg-white/95 p-3 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <span>🌤️ Buổi Chiều</span>
                <span className="text-[11px] font-semibold text-slate-400">
                  ({activeDaySchedule.afternoonPeriods.length} tiết)
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Từ 14:00 - 16:15</span>
            </div>

            {activeDaySchedule.afternoonPeriods.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 text-center">Không có tiết học buổi chiều</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeDaySchedule.afternoonPeriods.map((period) => {
                  const meta = getSubjectMeta(period.subjectName);
                  return (
                    <div
                      key={period.periodNumber}
                      className={`p-2 rounded-xl border ${meta.bgClass} ${meta.borderClass} flex flex-col justify-between transition-all hover:scale-102`}
                      title={period.note ? `${period.subjectName}: ${period.note}` : period.subjectName}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-slate-500">Tiết {period.periodNumber}</span>
                        <span className="text-base">{meta.icon}</span>
                      </div>
                      <span className={`text-xs font-black ${meta.colorClass} truncate mt-1`}>
                        {period.subjectName}
                      </span>
                      {period.note && (
                        <span className="text-[10px] text-slate-500 truncate mt-0.5" title={period.note}>
                          📝 {period.note}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* COLLAPSIBLE 1: BACKPACK PREP CHECKLIST */}
        {showBackpackChecklist && (
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Backpack className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-xs sm:text-sm text-emerald-950">
                  Góc Soạn Sách Vở Cho {tomorrowSchedule.dayNameVi} Ngày Mai
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
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
                    className={`p-2 rounded-xl border text-left flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs scale-102'
                        : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span>{meta.icon}</span>
                      <span className="text-xs font-extrabold truncate">{subName}</span>
                    </div>
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${isChecked ? 'text-white' : 'text-slate-300'}`} />
                  </button>
                );
              })}

              <button
                onClick={() => toggleCheckItem('item-pencil-box')}
                className={`p-2 rounded-xl border text-left flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                  checkedItems['item-pencil-box']
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-800 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>✏️</span>
                  <span className="text-xs font-extrabold truncate">Hộp bút & Thước</span>
                </div>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${checkedItems['item-pencil-box'] ? 'text-white' : 'text-slate-300'}`} />
              </button>

              <button
                onClick={() => toggleCheckItem('item-water-bottle')}
                className={`p-2 rounded-xl border text-left flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                  checkedItems['item-water-bottle']
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-800 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>💧</span>
                  <span className="text-xs font-extrabold truncate">Bình nước uống</span>
                </div>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${checkedItems['item-water-bottle'] ? 'text-white' : 'text-slate-300'}`} />
              </button>
            </div>
          </div>
        )}

        {/* COLLAPSIBLE 2: FULL WEEKLY TIMETABLE MATRIX VIEW */}
        {showFullWeeklyView && (
          <div className="p-4 bg-white rounded-3xl border-2 border-amber-300 shadow-md space-y-3 animate-in fade-in duration-200 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Bảng Thời Khóa Biểu Cả Tuần (Thứ Hai Đến Thứ Bảy)</span>
                </h3>
                <p className="text-xs text-slate-500">Được đồng bộ trực tiếp từ file Excel nhập vào</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải File Excel (.xlsx)</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenScheduleSettings}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>Cài Đặt Lịch</span>
                </button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-100/70 text-slate-800 border-b-2 border-amber-300">
                    <th className="p-2 text-center font-black border border-amber-200 w-16">Buổi</th>
                    <th className="p-2 text-center font-black border border-amber-200 w-16">Tiết</th>
                    {[1, 2, 3, 4, 5, 6].map((dayIdx) => {
                      const dayObj = timetable.find((d) => d.dayIndex === dayIdx);
                      const isToday = dayIdx === todayDayIndex;
                      return (
                        <th
                          key={dayIdx}
                          className={`p-2 text-center font-black border border-amber-200 min-w-[120px] ${
                            isToday ? 'bg-amber-400 text-amber-950 font-black' : ''
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>{dayObj?.dayNameVi || `Thứ ${dayIdx + 1}`}</span>
                            {isToday && <span className="text-[10px] bg-white text-amber-900 px-1 rounded-full">Hôm nay</span>}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {/* SÁNG Tiết 1 - 4 */}
                  {[1, 2, 3, 4].map((pNum) => (
                    <tr key={`m-${pNum}`} className="hover:bg-amber-50/40 border-b border-slate-200">
                      {pNum === 1 && (
                        <td rowSpan={4} className="p-2 text-center font-black bg-orange-50 text-orange-900 border border-amber-200 align-middle">
                          SÁNG
                        </td>
                      )}
                      <td className="p-2 text-center font-bold text-slate-600 bg-slate-50 border border-amber-100">
                        Tiết {pNum}
                      </td>
                      {[1, 2, 3, 4, 5, 6].map((dayIdx) => {
                        const dayObj = timetable.find((d) => d.dayIndex === dayIdx);
                        const period = dayObj?.morningPeriods.find((p) => p.periodNumber === pNum);
                        if (!period) {
                          return <td key={dayIdx} className="p-2 text-center text-slate-300 border border-slate-100">-</td>;
                        }
                        const meta = getSubjectMeta(period.subjectName);
                        return (
                          <td key={dayIdx} className={`p-1.5 border border-slate-200 text-center ${dayIdx === todayDayIndex ? 'bg-amber-50/30' : ''}`}>
                            <div className={`p-1.5 rounded-lg border ${meta.bgClass} ${meta.borderClass} flex items-center justify-center gap-1 shadow-2xs`}>
                              <span>{meta.icon}</span>
                              <span className={`font-black ${meta.colorClass} truncate`}>{period.subjectName}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Divider */}
                  <tr className="bg-slate-100 text-slate-500 text-[11px] font-bold text-center">
                    <td colSpan={8} className="py-1">🍱 Nghỉ Trưa & Bán Trú (11:00 - 13:45)</td>
                  </tr>

                  {/* CHIỀU Tiết 1 - 3 */}
                  {[1, 2, 3].map((pNum) => (
                    <tr key={`a-${pNum}`} className="hover:bg-amber-50/40 border-b border-slate-200">
                      {pNum === 1 && (
                        <td rowSpan={3} className="p-2 text-center font-black bg-blue-50 text-blue-900 border border-amber-200 align-middle">
                          CHIỀU
                        </td>
                      )}
                      <td className="p-2 text-center font-bold text-slate-600 bg-slate-50 border border-amber-100">
                        Tiết {pNum}
                      </td>
                      {[1, 2, 3, 4, 5, 6].map((dayIdx) => {
                        const dayObj = timetable.find((d) => d.dayIndex === dayIdx);
                        const period = dayObj?.afternoonPeriods.find((p) => p.periodNumber === pNum);
                        if (!period) {
                          return <td key={dayIdx} className="p-2 text-center text-slate-300 border border-slate-100">-</td>;
                        }
                        const meta = getSubjectMeta(period.subjectName);
                        return (
                          <td key={dayIdx} className={`p-1.5 border border-slate-200 text-center ${dayIdx === todayDayIndex ? 'bg-amber-50/30' : ''}`}>
                            <div className={`p-1.5 rounded-lg border ${meta.bgClass} ${meta.borderClass} flex items-center justify-center gap-1 shadow-2xs`}>
                              <span>{meta.icon}</span>
                              <span className={`font-black ${meta.colorClass} truncate`}>{period.subjectName}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
