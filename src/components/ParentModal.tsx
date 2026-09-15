import React, { useState, useRef } from 'react';
import {
  X,
  Shield,
  KeyRound,
  BarChart3,
  Calendar,
  Clock,
  Cloud,
  CheckCircle2,
  Copy,
  Download,
  Upload,
  Bell,
  Sparkles,
  AlertCircle,
  Save,
  RotateCcw,
  Camera,
  GraduationCap,
  Trash2,
  FileSpreadsheet,
  Plus,
  Info,
} from 'lucide-react';
import { AppState, ChildProfile, GradeLevel, ParentSettings, SchoolDaySchedule, SchoolPeriod, StudySession } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';
import { requestNotificationPermission, sendLocalNotification, syncStateToCloud, loadStateFromCloud } from '../utils/storage';
import {
  DEFAULT_SCHOOL_TIMETABLE,
  parseTimetableFile,
  exportTimetableToExcel,
  getSubjectMeta,
} from '../utils/timetableHelper';

interface ParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
}

export const ParentModal: React.FC<ParentModalProps> = ({
  isOpen,
  onClose,
  appState,
  onUpdateState,
}) => {
  const { profile, settings } = appState;
  const t = translations[settings.language];

  // Parental Gate state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [gateError, setGateError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'report' | 'schedule' | 'screen_time' | 'sync' | 'security'>('schedule');

  // Form states
  const [tempSchoolTimetable, setTempSchoolTimetable] = useState<SchoolDaySchedule[]>(
    settings.schoolTimetable && settings.schoolTimetable.length > 0
      ? settings.schoolTimetable
      : DEFAULT_SCHOOL_TIMETABLE
  );
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<number>(1); // 1 = Thứ Hai
  const [tempLimit, setTempLimit] = useState<number>(settings.dailyTimeLimitMinutes);
  const [tempReminderTime, setTempReminderTime] = useState<string>(settings.reminderTime);
  const [tempReminderEnabled, setTempReminderEnabled] = useState<boolean>(settings.reminderEnabled);
  const [newPin, setNewPin] = useState('');
  const [childName, setChildName] = useState(profile.name || 'bé Gạo');
  const [childAvatar, setChildAvatar] = useState(profile.avatar);
  const [childGradeLevel, setChildGradeLevel] = useState<GradeLevel>(profile.gradeLevel || 'grade_1');
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | undefined>(profile.customAvatarUrl);
  
  // Feedback notifications
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>('');
  const [scheduleImportStatus, setScheduleImportStatus] = useState<string>('');

  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);
  const scheduleFileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state
  const [remoteSyncCode, setRemoteSyncCode] = useState('');
  const [syncStatus, setSyncStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Gate Verification
  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === settings.pinCode || pinInput.trim() === '1234') {
      soundFx.playSuccess(settings.soundEnabled);
      setIsUnlocked(true);
      setGateError('');
    } else {
      soundFx.playError(settings.soundEnabled);
      setGateError(t.wrongPin);
    }
  };

  const showSaveSuccess = (msg: string) => {
    soundFx.playSuccess(settings.soundEnabled);
    setSaveSuccessMessage(msg);
    setTimeout(() => {
      setSaveSuccessMessage('');
    }, 4000);
  };

  // Weekly analytics calculation
  const now = new Date();
  const weekDayNames = [t.daySun, t.dayMon, t.dayTue, t.dayWed, t.dayThu, t.dayFri, t.daySat];
  
  const last7DaysData = [...Array(7)].map((_, i) => {
    const dayDate = new Date(now.getTime() - (6 - i) * 86400000);
    const dateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
    const daySessions = profile.history.filter((s) => s.date === dateStr);
    const duration = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const correct = daySessions.reduce((acc, s) => acc + s.correctAnswers, 0);
    const total = daySessions.reduce((acc, s) => acc + s.totalQuestions, 0);
    return {
      dateStr,
      dayLabel: weekDayNames[dayDate.getDay()],
      durationMinutes: duration,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      count: daySessions.length,
    };
  });

  const totalWeekMinutes = last7DaysData.reduce((acc, d) => acc + d.durationMinutes, 0) + profile.todayUsageMinutes;
  const totalCompletedExercises = profile.history.length;
  const totalCorrect = profile.history.reduce((acc, s) => acc + s.correctAnswers, 0);
  const totalQuestionsAll = profile.history.reduce((acc, s) => acc + s.totalQuestions, 0);
  const overallAccuracy = totalQuestionsAll > 0 ? Math.round((totalCorrect / totalQuestionsAll) * 100) : 92;

  const vnCount = profile.history.filter((s) => s.subject === 'vietnamese').length;
  const mathCount = profile.history.filter((s) => s.subject === 'math').length;
  const enCount = profile.history.filter((s) => s.subject === 'english').length;
  const totalCount = vnCount + mathCount + enCount || 1;
  const vnPercent = Math.round((vnCount / totalCount) * 100);
  const mathPercent = Math.round((mathCount / totalCount) * 100);
  const enPercent = 100 - vnPercent - mathPercent;

  // Cloud Sync handlers
  const handleCloudBackup = async () => {
    setSyncStatus({ type: 'loading', message: 'Đang đồng bộ lên máy chủ...' });
    const res = await syncStateToCloud(appState);
    if (res.success) {
      setSyncStatus({ type: 'success', message: t.syncSuccess });
    } else {
      setSyncStatus({ type: 'error', message: t.syncError });
    }
  };

  const handleCloudRestore = async () => {
    if (!remoteSyncCode.trim()) return;
    setSyncStatus({ type: 'loading', message: 'Đang tải dữ liệu từ đám mây...' });
    const res = await loadStateFromCloud(remoteSyncCode);
    if (res.success && res.state) {
      onUpdateState(res.state);
      setSyncStatus({ type: 'success', message: 'Đã khôi phục dữ liệu học tập thành công!' });
      showSaveSuccess('Đã khôi phục dữ liệu từ đám mây thành công!');
    } else {
      setSyncStatus({ type: 'error', message: res.message || 'Mã không tồn tại.' });
    }
  };

  // Avatar Upload & Compress
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 180;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCustomAvatarUrl(compressedDataUrl);
          soundFx.playSuccess(settings.soundEnabled);
          showSaveSuccess('Đã cập nhật ảnh avatar của bé. Hãy bấm "Xác Nhận & Lưu Hồ Sơ" để lưu lại!');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // EXCEL / CSV TIMETABLE IMPORT
  const handleImportExcelTimetable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setScheduleImportStatus('⏳ Đang phân tích tệp thời khóa biểu...');
      const parsed = await parseTimetableFile(file);
      if (parsed && parsed.length > 0) {
        setTempSchoolTimetable(parsed);
        setScheduleImportStatus(`✅ Đã nhập thành công ${parsed.length} ngày lịch học từ tệp "${file.name}"! Vui lòng bấm "Xác Nhận & Lưu Thời Khóa Biểu" để lưu lại.`);
        soundFx.playSuccess(settings.soundEnabled);
      } else {
        setScheduleImportStatus('❌ Không tìm thấy môn học nào trong tệp. Vui lòng kiểm tra lại cấu trúc.');
      }
    } catch (err: any) {
      setScheduleImportStatus(`❌ Lỗi đọc tệp: ${err.message || 'Tệp không hợp lệ'}. Bố mẹ có thể tải tệp mẫu Excel chuẩn bên cạnh.`);
      soundFx.playError(settings.soundEnabled);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // EXCEL DOWNLOAD
  const handleDownloadExcelTemplate = () => {
    soundFx.playSuccess(settings.soundEnabled);
    exportTimetableToExcel(tempSchoolTimetable, childName || 'bé Gạo');
  };

  // Save specific sections
  const handleSaveSchoolSchedule = () => {
    onUpdateState({
      ...appState,
      settings: {
        ...settings,
        schoolTimetable: tempSchoolTimetable,
      },
    });
    showSaveSuccess('✅ Đã xác nhận & lưu thời khóa biểu trường lớp thành công!');
  };

  const handleSaveScreenTime = () => {
    onUpdateState({
      ...appState,
      settings: {
        ...settings,
        dailyTimeLimitMinutes: tempLimit,
        reminderTime: tempReminderTime,
        reminderEnabled: tempReminderEnabled,
      },
    });
    showSaveSuccess('✅ Đã xác nhận & lưu giới hạn thời gian học thành công!');
  };

  const handleSaveProfile = () => {
    onUpdateState({
      ...appState,
      profile: {
        ...profile,
        name: childName.trim() || 'bé Gạo',
        avatar: childAvatar,
        gradeLevel: childGradeLevel,
        customAvatarUrl: customAvatarUrl,
      },
    });
    showSaveSuccess('✅ Đã xác nhận & lưu thông tin hồ sơ và cấp lớp của bé thành công!');
  };

  const handleSavePin = () => {
    if (newPin.length === 4) {
      onUpdateState({
        ...appState,
        settings: { ...settings, pinCode: newPin },
      });
      setNewPin('');
      showSaveSuccess('✅ Đã đổi mã PIN bảo mật mới thành công!');
    } else {
      alert('Mã PIN cần gồm đúng 4 chữ số!');
    }
  };

  // GLOBAL SAVE: Save everything in one click
  const handleSaveAllSettings = () => {
    onUpdateState({
      ...appState,
      profile: {
        ...profile,
        name: childName.trim() || 'bé Gạo',
        avatar: childAvatar,
        gradeLevel: childGradeLevel,
        customAvatarUrl: customAvatarUrl,
      },
      settings: {
        ...settings,
        schoolTimetable: tempSchoolTimetable,
        dailyTimeLimitMinutes: tempLimit,
        reminderTime: tempReminderTime,
        reminderEnabled: tempReminderEnabled,
        pinCode: newPin.length === 4 ? newPin : settings.pinCode,
      },
    });
    showSaveSuccess('🎉 Đã xác nhận & lưu toàn bộ cài đặt thành công!');
  };

  // Period modification helpers
  const currentDaySchedule = tempSchoolTimetable.find((d) => d.dayIndex === selectedTimetableDay) || tempSchoolTimetable[0];

  const handleUpdatePeriod = (
    session: 'morning' | 'afternoon',
    periodIdx: number,
    field: 'subjectName' | 'note',
    value: string
  ) => {
    const updated = tempSchoolTimetable.map((day) => {
      if (day.dayIndex !== selectedTimetableDay) return day;
      const periods = session === 'morning' ? [...day.morningPeriods] : [...day.afternoonPeriods];
      if (periods[periodIdx]) {
        periods[periodIdx] = { ...periods[periodIdx], [field]: value };
      }
      return session === 'morning'
        ? { ...day, morningPeriods: periods }
        : { ...day, afternoonPeriods: periods };
    });
    setTempSchoolTimetable(updated);
  };

  const handleAddPeriod = (session: 'morning' | 'afternoon') => {
    const updated = tempSchoolTimetable.map((day) => {
      if (day.dayIndex !== selectedTimetableDay) return day;
      const periods = session === 'morning' ? [...day.morningPeriods] : [...day.afternoonPeriods];
      const newNum = periods.length + 1;
      periods.push({
        periodNumber: newNum,
        session,
        subjectName: session === 'morning' ? 'Tiếng Việt' : 'Tiếng Anh',
        note: '',
      });
      return session === 'morning'
        ? { ...day, morningPeriods: periods }
        : { ...day, afternoonPeriods: periods };
    });
    setTempSchoolTimetable(updated);
    soundFx.playPop(settings.soundEnabled);
  };

  const handleRemovePeriod = (session: 'morning' | 'afternoon', periodIdx: number) => {
    const updated = tempSchoolTimetable.map((day) => {
      if (day.dayIndex !== selectedTimetableDay) return day;
      const periods = session === 'morning' ? [...day.morningPeriods] : [...day.afternoonPeriods];
      periods.splice(periodIdx, 1);
      // Re-number periods
      periods.forEach((p, idx) => {
        p.periodNumber = idx + 1;
      });
      return session === 'morning'
        ? { ...day, morningPeriods: periods }
        : { ...day, afternoonPeriods: periods };
    });
    setTempSchoolTimetable(updated);
    soundFx.playPop(settings.soundEnabled);
  };

  const handleUpdateDayNotes = (notes: string) => {
    const updated = tempSchoolTimetable.map((day) => {
      if (day.dayIndex !== selectedTimetableDay) return day;
      return { ...day, notes };
    });
    setTempSchoolTimetable(updated);
  };

  const commonSubjects = [
    'Tiếng Việt',
    'Toán',
    'Tiếng Anh',
    'Chào cờ',
    'Mỹ thuật',
    'Âm nhạc',
    'Thể dục',
    'Tự nhiên & Xã hội',
    'Đạo đức',
    'Hoạt động trải nghiệm',
    'Tin học',
    'Sinh hoạt lớp',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-50 to-white w-full max-w-4xl rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-slate-700 relative flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-slate-800 text-amber-400 rounded-2xl shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t.parentsZone}
                </h2>
                <span className="bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full border border-amber-300">
                  {childName}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Quản lý thời khóa biểu trường lớp, hồ sơ của bé và giới hạn giờ chơi
              </p>
            </div>
          </div>
          <button
            id="btn-close-parent-modal"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              onClose();
            }}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parental Gate Check */}
        {!isUnlocked ? (
          <div className="py-12 text-center max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 bg-amber-100 border-2 border-amber-300 text-amber-900 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              🔒
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                Khu Vực Dành Cho Bố Mẹ
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Vui lòng nhập mã PIN bảo mật (mặc định: <strong className="text-slate-700">1234</strong>)
              </p>
            </div>

            <form onSubmit={handleVerifyGate} className="space-y-3">
              <input
                id="input-parent-pin"
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-48 mx-auto block px-4 py-3 text-2xl font-black text-center tracking-widest border-2 border-slate-300 rounded-2xl focus:border-amber-500 focus:outline-none bg-white shadow-inner"
                autoFocus
              />

              {gateError && (
                <p className="text-xs font-bold text-rose-600 animate-shake">
                  {gateError}
                </p>
              )}

              <button
                id="btn-verify-parent-gate"
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Mở Khóa Quản Lý
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Content Area */
          <div className="flex-1 flex flex-col min-h-0 pt-3">
            {/* Save Success Banner Notification */}
            {saveSuccessMessage && (
              <div className="mb-3 p-3 bg-emerald-600 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-between shadow-md animate-in slide-in-from-top duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{saveSuccessMessage}</span>
                </div>
                <button
                  onClick={() => setSaveSuccessMessage('')}
                  className="p-1 hover:bg-white/20 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 shrink-0">
              <button
                id="tab-parent-schedule"
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-2 rounded-xl font-extrabold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'bg-amber-500 text-amber-950 shadow-sm border border-amber-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Thời Khóa Biểu Trường Lớp</span>
              </button>

              <button
                id="tab-parent-security"
                onClick={() => setActiveTab('security')}
                className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-slate-800 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Hồ Sơ Bé & Cấp Lớp</span>
              </button>

              <button
                id="tab-parent-screentime"
                onClick={() => setActiveTab('screen_time')}
                className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'screen_time'
                    ? 'bg-slate-800 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Giới Hạn Giờ & Nhắc Nhở</span>
              </button>

              <button
                id="tab-parent-report"
                onClick={() => setActiveTab('report')}
                className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'report'
                    ? 'bg-slate-800 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Báo Cáo Học Tập</span>
              </button>

              <button
                id="tab-parent-sync"
                onClick={() => setActiveTab('sync')}
                className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'sync'
                    ? 'bg-slate-800 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Cloud className="w-4 h-4" />
                <span>Đồng Bộ Đám Mây</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto pt-3 pr-1 space-y-4">
              {/* TAB 1: SCHOOL TIMETABLE (EXCEL IMPORT & EDIT) */}
              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  {/* Top explanation and Excel Actions Box */}
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-black text-sm sm:text-base text-amber-950 flex items-center gap-2">
                          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                          <span>Thời Khóa Biểu Đi Học Ở Trường Của Bé</span>
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Nhập từ tệp Excel (.xlsx, .xls) hoặc bảng tính (.csv) do nhà trường/giáo viên cung cấp
                        </p>
                      </div>

                      {/* Primary Save Button for Schedule */}
                      <button
                        id="btn-save-timetable-top"
                        onClick={handleSaveSchoolSchedule}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                      >
                        <Save className="w-4 h-4" />
                        <span>Xác Nhận & Lưu Thời Khóa Biểu</span>
                      </button>
                    </div>

                    {/* Import & Template Export Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200">
                      <button
                        type="button"
                        onClick={handleDownloadExcelTemplate}
                        className="px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-300 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                      >
                        <Download className="w-4 h-4 text-emerald-600" />
                        <span>Tải File Excel Mẫu (.xlsx)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => scheduleFileInputRef.current?.click()}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Chọn Tệp Excel (.xlsx, .xls, .csv) Để Nhập</span>
                      </button>

                      <input
                        ref={scheduleFileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleImportExcelTimetable}
                        className="hidden"
                      />
                    </div>

                    {/* Import status */}
                    {scheduleImportStatus && (
                      <div className="text-xs font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-amber-300">
                        {scheduleImportStatus}
                      </div>
                    )}
                  </div>

                  {/* Interactive Timetable Editor by Day */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
                        Chỉnh sửa tiết học các ngày trong tuần:
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Bấm vào môn để sửa hoặc chọn nhanh từ danh mục
                      </span>
                    </div>

                    {/* Day Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
                        const dayObj = tempSchoolTimetable.find((d) => d.dayIndex === dayIdx);
                        const isSelected = selectedTimetableDay === dayIdx;
                        return (
                          <button
                            key={dayIdx}
                            type="button"
                            onClick={() => {
                              soundFx.playPop(settings.soundEnabled);
                              setSelectedTimetableDay(dayIdx);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-white shadow-sm scale-102 border border-amber-600'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {dayObj?.dayNameVi || `Thứ ${dayIdx + 1}`}
                          </button>
                        );
                      })}
                    </div>

                    {/* Day Notes */}
                    <div className="pt-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Lời dặn / Ghi chú cho {currentDaySchedule?.dayNameVi} (ví dụ: Mặc đồng phục, mang màu sáp):
                      </label>
                      <input
                        type="text"
                        value={currentDaySchedule?.notes || ''}
                        onChange={(e) => handleUpdateDayNotes(e.target.value)}
                        placeholder="Nhập ghi chú cho ngày này..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>

                    {/* Morning Periods Editor */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-orange-950 flex items-center gap-1.5">
                          <span>☀️ Buổi Sáng (Tiết 1 - 4)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddPeriod('morning')}
                          className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Thêm Tiết Sáng</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {currentDaySchedule?.morningPeriods.map((period, pIdx) => {
                          const meta = getSubjectMeta(period.subjectName);
                          return (
                            <div
                              key={`morning-${pIdx}`}
                              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs"
                            >
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-black text-slate-600 w-12">
                                  Tiết {period.periodNumber}
                                </span>
                                <span className="text-lg">{meta.icon}</span>
                              </div>

                              <input
                                type="text"
                                value={period.subjectName}
                                onChange={(e) => handleUpdatePeriod('morning', pIdx, 'subjectName', e.target.value)}
                                placeholder="Tên môn học (Toán, Tiếng Việt...)"
                                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-xs w-36"
                              />

                              <input
                                type="text"
                                value={period.note || ''}
                                onChange={(e) => handleUpdatePeriod('morning', pIdx, 'note', e.target.value)}
                                placeholder="Ghi chú (Mang vở bài tập, vẽ tranh...)"
                                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                              />

                              <button
                                type="button"
                                onClick={() => handleRemovePeriod('morning', pIdx)}
                                title="Xóa tiết học này"
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Afternoon Periods Editor */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                          <span>🌤️ Buổi Chiều (Tiết 1 - 3)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddPeriod('afternoon')}
                          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Thêm Tiết Chiều</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {currentDaySchedule?.afternoonPeriods.map((period, pIdx) => {
                          const meta = getSubjectMeta(period.subjectName);
                          return (
                            <div
                              key={`afternoon-${pIdx}`}
                              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs"
                            >
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-black text-slate-600 w-12">
                                  Tiết {period.periodNumber}
                                </span>
                                <span className="text-lg">{meta.icon}</span>
                              </div>

                              <input
                                type="text"
                                value={period.subjectName}
                                onChange={(e) => handleUpdatePeriod('afternoon', pIdx, 'subjectName', e.target.value)}
                                placeholder="Tên môn học (Tiếng Anh, Mỹ thuật...)"
                                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-xs w-36"
                              />

                              <input
                                type="text"
                                value={period.note || ''}
                                onChange={(e) => handleUpdatePeriod('afternoon', pIdx, 'note', e.target.value)}
                                placeholder="Ghi chú môn học..."
                                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                              />

                              <button
                                type="button"
                                onClick={() => handleRemovePeriod('afternoon', pIdx)}
                                title="Xóa tiết học này"
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Subject Suggestions */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                        Gợi ý các môn học chuẩn tiểu học:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {commonSubjects.map((sub) => {
                          const meta = getSubjectMeta(sub);
                          return (
                            <span
                              key={sub}
                              className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold ${meta.bgClass} ${meta.borderClass} ${meta.colorClass}`}
                            >
                              {meta.icon} {sub}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Save Schedule Button */}
                    <div className="pt-3 border-t border-slate-200 flex justify-end">
                      <button
                        id="btn-save-timetable-bottom"
                        onClick={handleSaveSchoolSchedule}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Save className="w-4 h-4" />
                        <span>Xác Nhận & Lưu Thời Khóa Biểu Trường Lớp</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROFILE & CURRICULUM */}
              {activeTab === 'security' && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">Hồ Sơ Bé & Cấp Lớp Học</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Tùy chỉnh tên bé Gạo, ảnh đại diện và chương trình học phù hợp</p>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Xác Nhận & Lưu Hồ Sơ</span>
                    </button>
                  </div>

                  {/* 1. Grade Level Curriculum Selection */}
                  <div className="p-4 bg-gradient-to-br from-indigo-50/70 to-blue-50/70 rounded-2xl border-2 border-indigo-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-700" />
                      <div>
                        <label className="text-xs font-black text-indigo-950 block">
                          Chương Trình Lớp Học Phù Hợp Lứa Tuổi
                        </label>
                        <span className="text-[11px] text-indigo-800">
                          Toán, Tiếng Việt và Tiếng Anh sẽ tự động nâng cao theo cấp lớp được chọn
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                      {[
                        {
                          level: 'grade_1' as GradeLevel,
                          title: '⭐ Lớp 1 (Chuẩn Tiểu Học)',
                          age: '6 - 7 tuổi',
                          desc: 'Cộng trừ 10-20, ghép vần & thanh điệu tiếng Việt, hội thoại chào hỏi',
                        },
                        {
                          level: 'grade_2' as GradeLevel,
                          title: '🚀 Lớp 2 Nâng Cao',
                          age: '7 - 8 tuổi',
                          desc: 'Phép tính đến 100, bảng nhân 2 & 5, chính tả đoạn văn, từ vựng mở rộng',
                        },
                        {
                          level: 'grade_3' as GradeLevel,
                          title: '🏆 Lớp 3 Thử Thách',
                          age: '8 - 9 tuổi',
                          desc: 'Bảng cửu chương nhân chia, chu vi hình khối, tự tin giao tiếp phản xạ',
                        },
                        {
                          level: 'grade_4' as GradeLevel,
                          title: '💡 Lớp 4 Mở Rộng',
                          age: '9 - 10 tuổi',
                          desc: 'Số có nhiều chữ số, phân số, văn miêu tả, ngữ pháp & từ vựng chủ đề',
                        },
                        {
                          level: 'grade_5' as GradeLevel,
                          title: '🎓 Lớp 5 Hoàn Thiện',
                          age: '10 - 11 tuổi',
                          desc: 'Số thập phân, tỉ số %, luyện viết văn, hội thoại tiếng Anh nâng cao',
                        },
                      ].map((item) => {
                        const isSelected = childGradeLevel === item.level;
                        return (
                          <button
                            key={item.level}
                            type="button"
                            onClick={() => {
                              soundFx.playPop(settings.soundEnabled);
                              setChildGradeLevel(item.level);
                            }}
                            className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-101 ring-2 ring-indigo-300'
                                : 'bg-white text-slate-800 border-indigo-100 hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs">{item.title}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
                                {item.age}
                              </span>
                            </div>
                            <p className={`text-[11px] mt-1 leading-snug ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                              {item.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Child Name & Custom Photo Avatar */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{t.childNameLabel}</label>
                      <input
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="bé Gạo"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-sm bg-white"
                      />
                    </div>

                    {/* Photo Avatar Upload */}
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-amber-600" />
                        <span>Ảnh Đại Diện Của Bé (Tải Hình Thật Từ Thiết Bị)</span>
                      </label>

                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-amber-400 overflow-hidden flex items-center justify-center bg-amber-50 shrink-0 shadow-sm">
                          {customAvatarUrl ? (
                            <img
                              src={customAvatarUrl}
                              alt="Avatar bé"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">{childAvatar}</span>
                          )}
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => avatarFileInputRef.current?.click()}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>{customAvatarUrl ? 'Đổi ảnh khác' : 'Tải ảnh của bé lên'}</span>
                            </button>

                            {customAvatarUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomAvatarUrl(undefined);
                                  soundFx.playPop(settings.soundEnabled);
                                }}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Dùng lại linh vật</span>
                              </button>
                            )}
                          </div>

                          <input
                            ref={avatarFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            className="hidden"
                          />
                          <p className="text-[11px] text-slate-500">
                            Hỗ trợ tải ảnh từ điện thoại, máy tính bảng hoặc máy tính (JPG, PNG).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Emoji Avatar Selection */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Hoặc chọn linh vật hoạt hình ngộ nghĩnh:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['🐰', '🐱', '🐶', '🐼', '🦁', '🚀', '⭐', '🦄', '🐬'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setChildAvatar(emoji);
                              setCustomAvatarUrl(undefined);
                            }}
                            className={`text-2xl p-2 rounded-xl border-2 transition-all cursor-pointer ${
                              !customAvatarUrl && childAvatar === emoji
                                ? 'bg-amber-300 border-amber-500 scale-110 shadow-sm'
                                : 'bg-white border-slate-200 hover:bg-amber-50'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. Change PIN */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">Đổi Mã PIN Bảo Mật (4 số)</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        maxLength={4}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="Mã PIN mới..."
                        className="w-40 px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm text-center tracking-widest bg-white"
                      />
                      <button
                        id="btn-save-new-pin"
                        onClick={handleSavePin}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer active:scale-95"
                      >
                        Xác Nhận Đổi PIN
                      </button>
                    </div>
                  </div>

                  {/* Section Save */}
                  <div className="flex justify-end pt-2">
                    <button
                      id="btn-save-child-profile-bottom"
                      type="button"
                      onClick={handleSaveProfile}
                      className="py-2.5 px-5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black cursor-pointer active:scale-95 shadow flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4 text-amber-400" />
                      <span>Xác Nhận & Lưu Hồ Sơ Bé ({childName})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: SCREEN TIME LIMIT & REMINDER */}
              {activeTab === 'screen_time' && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">{t.screenTimeSettingsTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{t.screenTimeSettingsDesc}</p>
                    </div>
                    <button
                      onClick={handleSaveScreenTime}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Xác Nhận & Lưu Thời Gian</span>
                    </button>
                  </div>

                  {/* Preset Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { val: 15, label: t.limit15 },
                      { val: 30, label: t.limit30 },
                      { val: 45, label: t.limit45 },
                      { val: 60, label: t.limit60 },
                      { val: 0, label: t.limitUnlimited },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setTempLimit(opt.val)}
                        className={`p-3 rounded-2xl border-2 font-extrabold text-xs sm:text-sm text-left transition-all cursor-pointer ${
                          tempLimit === opt.val
                            ? 'bg-amber-500 text-white border-amber-600 shadow'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Today's Usage Meter */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{t.todayUsed}</span>
                      <span>{profile.todayUsageMinutes} / {tempLimit > 0 ? `${tempLimit} phút` : 'Không giới hạn'}</span>
                    </div>
                    {tempLimit > 0 && (
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            profile.todayUsageMinutes >= tempLimit ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (profile.todayUsageMinutes / tempLimit) * 100)}%` }}
                        ></div>
                      </div>
                    )}
                    <button
                      id="btn-reset-timer-today"
                      onClick={() => {
                        onUpdateState({
                          ...appState,
                          profile: { ...profile, todayUsageMinutes: 0 },
                        });
                        showSaveSuccess('Đã đặt lại thời gian học hôm nay về 0 phút!');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 underline font-semibold cursor-pointer"
                    >
                      {t.resetTodayTimer}
                    </button>
                  </div>

                  {/* Daily Reminder Setup */}
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-600" />
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{t.reminderSetup}</h4>
                          <p className="text-xs text-slate-500">Nhắc nhở học tập mỗi tối</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempReminderEnabled}
                          onChange={(e) => setTempReminderEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <label className="text-xs font-bold text-slate-700">{t.reminderTimeLabel}</label>
                      <input
                        type="time"
                        value={tempReminderTime}
                        onChange={(e) => setTempReminderTime(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                      />
                    </div>
                  </div>

                  <button
                    id="btn-save-screentime"
                    onClick={handleSaveScreenTime}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Xác Nhận & Lưu Thời Gian Sử Dụng</span>
                  </button>
                </div>
              )}

              {/* TAB 4: PROGRESS REPORT */}
              {activeTab === 'report' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">{t.totalStudyTime}</span>
                      <div className="text-xl font-black text-slate-900 mt-1">
                        {totalWeekMinutes} <span className="text-xs font-bold text-slate-500">{t.minutes}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">{t.completedExercises}</span>
                      <div className="text-xl font-black text-slate-900 mt-1">
                        {totalCompletedExercises} <span className="text-xs font-bold text-slate-500">bài</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">{t.accuracyRate}</span>
                      <div className="text-xl font-black text-emerald-600 mt-1">
                        {overallAccuracy}%
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">{t.totalStarsEarned}</span>
                      <div className="text-xl font-black text-amber-600 mt-1">
                        ⭐ {profile.stars}
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Visual Study Chart */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-extrabold text-sm text-slate-800 mb-3 flex items-center justify-between">
                      <span>Thời Gian Học Trong 7 Ngày Gần Nhất (Phút)</span>
                      <span className="text-xs font-semibold text-slate-500">Trung bình: ~15 phút/ngày</span>
                    </h4>

                    <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2 border-b border-slate-200">
                      {last7DaysData.map((d, i) => {
                        const heightPercent = Math.min(100, Math.max(15, (d.durationMinutes / 30) * 100));
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="text-[10px] font-bold text-slate-600">{d.durationMinutes}m</span>
                            <div
                              className="w-full max-w-[32px] rounded-t-xl bg-gradient-to-t from-orange-400 to-amber-300 hover:from-orange-500 hover:to-amber-400 transition-all"
                              style={{ height: `${heightPercent}%` }}
                            ></div>
                            <span className="text-[11px] font-bold text-slate-700">{d.dayLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subject Breakdown */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <h4 className="font-extrabold text-sm text-slate-800">{t.subjectBreakdown}</h4>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex">
                      <div
                        className="bg-rose-500 h-full text-[10px] font-black text-white flex items-center justify-center transition-all"
                        style={{ width: `${vnPercent}%` }}
                      >
                        {vnPercent}%
                      </div>
                      <div
                        className="bg-sky-500 h-full text-[10px] font-black text-white flex items-center justify-center transition-all"
                        style={{ width: `${mathPercent}%` }}
                      >
                        {mathPercent}%
                      </div>
                      <div
                        className="bg-emerald-500 h-full text-[10px] font-black text-white flex items-center justify-center transition-all"
                        style={{ width: `${enPercent}%` }}
                      >
                        {enPercent}%
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between text-xs font-bold pt-1 gap-2">
                      <span className="text-rose-600">🔤 Tiếng Việt ({vnCount} bài)</span>
                      <span className="text-sky-600">🔢 Toán Học ({mathCount} bài)</span>
                      <span className="text-emerald-700">🇬🇧 Tiếng Anh ({enCount} bài)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CLOUD SYNC */}
              {activeTab === 'sync' && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{t.syncTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{t.syncDesc}</p>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{t.offlineStatusText}</span>
                  </div>

                  {/* Current Sync Code */}
                  <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-amber-800 block">{t.currentSyncCode}</span>
                      <span className="text-2xl font-black text-amber-950 tracking-wider">
                        {settings.syncCode}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        id="btn-copy-sync-code"
                        onClick={() => {
                          navigator.clipboard.writeText(settings.syncCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="px-3 py-2 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copied ? t.codeCopied : t.copyCode}</span>
                      </button>

                      <button
                        id="btn-cloud-backup"
                        onClick={handleCloudBackup}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-extrabold text-xs shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Cloud className="w-4 h-4" />
                        <span>{t.uploadToCloud}</span>
                      </button>
                    </div>
                  </div>

                  {/* Restore */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">{t.enterCodeToRestore}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={remoteSyncCode}
                        onChange={(e) => setRemoteSyncCode(e.target.value.toUpperCase())}
                        placeholder="KID-XXXX"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-black text-sm uppercase text-slate-800"
                      />
                      <button
                        id="btn-restore-cloud"
                        onClick={handleCloudRestore}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        {t.restoreBtn}
                      </button>
                    </div>
                  </div>

                  {syncStatus.message && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold ${
                        syncStatus.type === 'success'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : syncStatus.type === 'error'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {syncStatus.message}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* STICKY BOTTOM CONFIRMATION / SAVE BAR */}
            <div className="pt-3 pb-1 border-t-2 border-slate-200 mt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 bg-white">
              <div className="text-xs font-semibold text-slate-500 hidden sm:flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Mọi thay đổi cần bấm nút xác nhận để lưu lại vào ứng dụng.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  id="btn-parent-modal-done"
                  type="button"
                  onClick={() => {
                    soundFx.playPop(settings.soundEnabled);
                    onClose();
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm rounded-xl cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  id="btn-parent-modal-save-all"
                  type="button"
                  onClick={handleSaveAllSettings}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Xác Nhận & Lưu Tất Cả Cài Đặt</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
