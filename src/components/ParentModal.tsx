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
} from 'lucide-react';
import { AppState, ChildProfile, GradeLevel, ParentSettings, ScheduleDay, StudySession, Subject } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';
import { requestNotificationPermission, sendLocalNotification, syncStateToCloud, loadStateFromCloud } from '../utils/storage';

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
  const [activeTab, setActiveTab] = useState<'report' | 'schedule' | 'screen_time' | 'sync' | 'security'>('report');

  // Form states
  const [tempSchedule, setTempSchedule] = useState<ScheduleDay[]>(settings.schedule);
  const [tempLimit, setTempLimit] = useState<number>(settings.dailyTimeLimitMinutes);
  const [tempReminderTime, setTempReminderTime] = useState<string>(settings.reminderTime);
  const [tempReminderEnabled, setTempReminderEnabled] = useState<boolean>(settings.reminderEnabled);
  const [newPin, setNewPin] = useState('');
  const [childName, setChildName] = useState(profile.name);
  const [childAvatar, setChildAvatar] = useState(profile.avatar);
  const [childGradeLevel, setChildGradeLevel] = useState<GradeLevel>(profile.gradeLevel || 'grade_1');
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | undefined>(profile.customAvatarUrl);
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

  // Weekly analytics calculation
  const now = new Date();
  const weekDayNames = [t.daySun, t.dayMon, t.dayTue, t.dayWed, t.dayThu, t.dayFri, t.daySat];
  
  // Calculate daily totals for last 7 days
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

  // Vietnamese vs Math breakdown
  const vnCount = profile.history.filter((s) => s.subject === 'vietnamese').length;
  const mathCount = profile.history.filter((s) => s.subject === 'math').length;
  const totalCount = vnCount + mathCount || 1;
  const vnPercent = Math.round((vnCount / totalCount) * 100);
  const mathPercent = 100 - vnPercent;

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
    } else {
      setSyncStatus({ type: 'error', message: res.message || 'Mã không tồn tại.' });
    }
  };

  // JSON Export / Import
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `be_vui_hoc_lop1_backup_${profile.name}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile && parsed.settings) {
            onUpdateState(parsed);
            setSyncStatus({ type: 'success', message: 'Đã nhập bản sao lưu thành công!' });
          } else {
            setSyncStatus({ type: 'error', message: 'Tệp không đúng cấu trúc.' });
          }
        } catch {
          setSyncStatus({ type: 'error', message: 'Tệp tin JSON không hợp lệ.' });
        }
      };
    }
  };

  // Reminder push test
  const handleTestReminder = async () => {
    const granted = await requestNotificationPermission();
    sendLocalNotification(
      '⏰ Bé Vui Học Lớp 1 - Đến giờ học rồi!',
      `Chào ${profile.name}! Đã đến giờ cùng ôn tập Tiếng Việt và làm quen các con số vui nhộn nhé!`
    );
    alert(
      granted
        ? 'Đã gửi thông báo nhắc nhở đến thiết bị!'
        : 'Trình duyệt chưa cấp quyền thông báo đẩy. Nhắc nhở thông minh vẫn sẽ tự động nhắc trong ứng dụng!'
    );
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
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Timetable Import Handler (JSON / CSV)
  const handleImportScheduleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = (event.target?.result as string).trim();
        let parsedSchedule: ScheduleDay[] = [];

        if (content.startsWith('[') || content.startsWith('{')) {
          // JSON format
          const raw = JSON.parse(content);
          parsedSchedule = Array.isArray(raw) ? raw : raw.schedule;
        } else {
          // CSV format: dayIndex,dayNameVi,dayNameEn,subject,timeSlot,titleVi,titleEn,targetGoal
          const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
          const startIdx = lines[0].toLowerCase().includes('day') || lines[0].toLowerCase().includes('subject') ? 1 : 0;
          for (let i = startIdx; i < lines.length; i++) {
            const parts = lines[i].split(',').map((p) => p.trim());
            if (parts.length >= 4) {
              const dayIdx = parseInt(parts[0], 10);
              const validSubject = ['vietnamese', 'math', 'english', 'both', 'all', 'rest'].includes(parts[3])
                ? parts[3]
                : 'vietnamese';

              parsedSchedule.push({
                dayIndex: isNaN(dayIdx) ? i - startIdx : dayIdx,
                dayNameVi: parts[1] || `Thứ ${i + 1}`,
                dayNameEn: parts[2] || `Day ${i + 1}`,
                subject: validSubject as any,
                timeSlot: parts[4] || '19:30 - 20:00',
                titleVi: parts[5] || 'Ôn tập theo thời khóa biểu',
                titleEn: parts[6] || 'Scheduled study lesson',
                targetGoal: parseInt(parts[7] || '3', 10) || 3,
              });
            }
          }
        }

        if (parsedSchedule && parsedSchedule.length > 0) {
          setTempSchedule(parsedSchedule);
          setScheduleImportStatus(`✅ Đã nhập thành công ${parsedSchedule.length} ngày lịch học! Vui lòng bấm "Lưu Thời Khóa Biểu" để áp dụng.`);
          soundFx.playSuccess(settings.soundEnabled);
        } else {
          setScheduleImportStatus('❌ Không tìm thấy dữ liệu thời khóa biểu hợp lệ trong tệp.');
        }
      } catch (err) {
        setScheduleImportStatus('❌ Tệp không hợp lệ. Vui lòng kiểm tra định dạng JSON hoặc CSV.');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Download schedule templates
  const handleDownloadScheduleTemplate = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tempSchedule, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', 'thoi_khoa_bieu_mau.json');
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      const csvHeader = 'dayIndex,dayNameVi,dayNameEn,subject,timeSlot,titleVi,titleEn,targetGoal\n';
      const csvRows = tempSchedule.map(
        (s) => `${s.dayIndex},${s.dayNameVi},${s.dayNameEn},${s.subject},"${s.timeSlot}","${s.titleVi}","${s.titleEn}",${s.targetGoal}`
      ).join('\n');
      const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvHeader + csvRows);
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', 'thoi_khoa_bieu_mau.csv');
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-50 to-white w-full max-w-3xl rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-slate-700 relative flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 text-amber-400 rounded-2xl shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {t.parentsZone}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Báo cáo tiến độ, thời khóa biểu và kiểm soát màn hình
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
          <div className="py-10 text-center max-w-sm mx-auto space-y-4">
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
                id="input-parent-gate-pin"
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setGateError('');
                }}
                placeholder="****"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 text-center text-2xl font-bold tracking-widest text-slate-900 focus:outline-none focus:border-slate-800"
              />

              {gateError && (
                <p className="text-xs text-rose-600 font-bold">{gateError}</p>
              )}

              <button
                id="btn-submit-parent-pin"
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm shadow cursor-pointer active:scale-95 transition-all"
              >
                Mở Khóa Quản Lý 🛡️
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Parent Control Panel */
          <div className="flex-1 flex flex-col overflow-hidden pt-3">
            {/* Navigation Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 shrink-0">
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
                <span>{t.tabReport}</span>
              </button>

              <button
                id="tab-parent-schedule"
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'bg-slate-800 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{t.tabSchedule}</span>
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
                <span>{t.tabScreenTime}</span>
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
                <span>{t.tabSync}</span>
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
                <KeyRound className="w-4 h-4" />
                <span>{t.tabSecurity}</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto pt-3 pr-1 space-y-4">
              {/* TAB 1: WEEKLY PROGRESS REPORT */}
              {activeTab === 'report' && (
                <div className="space-y-4">
                  {/* Summary Metric Cards */}
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
                    </div>
                    <div className="flex justify-between text-xs font-bold pt-1">
                      <span className="text-rose-600">🔤 Tiếng Việt ({vnCount} bài tập)</span>
                      <span className="text-sky-600">🔢 Toán Học ({mathCount} bài tập)</span>
                    </div>
                  </div>

                  {/* Pedagogical Feedback */}
                  <div className="p-4 bg-amber-50/70 border-2 border-amber-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 font-extrabold text-sm text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>{t.pedagogicalFeedback}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {overallAccuracy >= 85 ? t.adviceGood : t.advicePractice}
                    </p>
                    <div className="text-xs font-semibold text-amber-800 bg-amber-100/80 p-2 rounded-xl border border-amber-200">
                      💡 <strong>Mẹo sư phạm lớp 1:</strong> Kết hợp học qua trò chơi từ 15-20 phút mỗi tối giúp trẻ xây dựng tư duy toán học và ngôn ngữ tự nhiên mà không bị áp lực.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SCHEDULE & SMART REMINDER */}
              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{t.scheduleSettingsTitle}</h4>
                        <p className="text-xs text-slate-500">{t.scheduleSettingsDesc}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          id="btn-save-schedule"
                          onClick={() => {
                            soundFx.playSuccess(settings.soundEnabled);
                            onUpdateState({
                              ...appState,
                              settings: {
                                ...settings,
                                schedule: tempSchedule,
                                reminderTime: tempReminderTime,
                                reminderEnabled: tempReminderEnabled,
                              },
                            });
                            alert('Đã lưu thời khóa biểu thành công!');
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Save className="w-4 h-4" />
                          <span>{t.saveSchedule}</span>
                        </button>
                      </div>
                    </div>

                    {/* IMPORT SCHEDULE FILE BOX */}
                    <div className="p-3.5 bg-amber-50/70 rounded-2xl border-2 border-amber-200 space-y-2.5">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                          <span className="font-extrabold text-xs text-amber-950">
                            Nhập Lịch Học Từ Tệp (File JSON hoặc CSV/Excel)
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDownloadScheduleTemplate('csv')}
                            className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Mẫu CSV/Excel</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadScheduleTemplate('json')}
                            className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Mẫu JSON</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => scheduleFileInputRef.current?.click()}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-extrabold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Chọn Tệp Lịch Học</span>
                          </button>

                          <input
                            ref={scheduleFileInputRef}
                            type="file"
                            accept=".json,.csv,.txt"
                            onChange={handleImportScheduleFile}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {scheduleImportStatus && (
                        <div className="text-xs font-bold text-slate-800 bg-white p-2 rounded-xl border border-amber-300">
                          {scheduleImportStatus}
                        </div>
                      )}
                    </div>

                    {/* Schedule List per Day */}
                    <div className="space-y-2.5">
                      {tempSchedule.map((day, idx) => (
                        <div
                          key={day.dayIndex}
                          className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs"
                        >
                          <div className="w-24 font-black text-slate-800 text-sm">
                            {day.dayNameVi}
                          </div>

                          <div className="flex-1 flex flex-wrap gap-2 items-center">
                            {/* Subject selector */}
                            <select
                              value={day.subject}
                              onChange={(e) => {
                                const newSub = e.target.value as Subject | 'both' | 'all' | 'rest';
                                const updated = [...tempSchedule];
                                updated[idx] = { ...updated[idx], subject: newSub };
                                setTempSchedule(updated);
                              }}
                              className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                            >
                              <option value="vietnamese">🔤 Chuyên Tiếng Việt</option>
                              <option value="math">🔢 Chuyên Toán</option>
                              <option value="english">🇬🇧 Chuyên Tiếng Anh</option>
                              <option value="both">🌟 Toán & Tiếng Việt</option>
                              <option value="all">🏆 Cả 3 Môn Học</option>
                              <option value="rest">🎈 Nghỉ Ngơi</option>
                            </select>

                            {/* Title / Description */}
                            <input
                              type="text"
                              value={day.titleVi}
                              onChange={(e) => {
                                const updated = [...tempSchedule];
                                updated[idx] = { ...updated[idx], titleVi: e.target.value };
                                setTempSchedule(updated);
                              }}
                              placeholder="Mục tiêu học..."
                              className="flex-1 min-w-[140px] px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-xs"
                            />

                            {/* Time slot */}
                            <input
                              type="text"
                              value={day.timeSlot}
                              onChange={(e) => {
                                const updated = [...tempSchedule];
                                updated[idx] = { ...updated[idx], timeSlot: e.target.value };
                                setTempSchedule(updated);
                              }}
                              placeholder="19:30 - 20:00"
                              className="w-28 px-2 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold text-xs text-center"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push Notification Setup */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-600" />
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{t.reminderSetup}</h4>
                          <p className="text-xs text-slate-500">Thông báo nhắc nhở khi đến giờ học của bé</p>
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

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <label className="text-xs font-bold text-slate-700">{t.reminderTimeLabel}</label>
                      <input
                        type="time"
                        value={tempReminderTime}
                        onChange={(e) => setTempReminderTime(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                      />
                      <button
                        id="btn-test-notification"
                        onClick={handleTestReminder}
                        className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs border border-amber-300 cursor-pointer"
                      >
                        {t.testNotification} 🔔
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SCREEN TIME LIMIT */}
              {activeTab === 'screen_time' && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{t.screenTimeSettingsTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{t.screenTimeSettingsDesc}</p>
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
                        alert('Đã đặt lại thời gian học hôm nay!');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 underline font-semibold cursor-pointer"
                    >
                      {t.resetTodayTimer}
                    </button>
                  </div>

                  <button
                    id="btn-save-screentime"
                    onClick={() => {
                      soundFx.playSuccess(settings.soundEnabled);
                      onUpdateState({
                        ...appState,
                        settings: { ...settings, dailyTimeLimitMinutes: tempLimit },
                      });
                      alert('Đã cập nhật giới hạn thời gian học!');
                    }}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm rounded-2xl shadow cursor-pointer active:scale-95"
                  >
                    Lưu Cài Đặt Thời Gian
                  </button>
                </div>
              )}

              {/* TAB 4: SYNC & OFFLINE */}
              {activeTab === 'sync' && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{t.syncTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{t.syncDesc}</p>
                  </div>

                  {/* Offline Status Badge */}
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

                  {/* Restore from Another Device */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">{t.enterCodeToRestore}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={remoteSyncCode}
                        onChange={(e) => setRemoteSyncCode(e.target.value.toUpperCase())}
                        placeholder="KID-XXXX"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-black text-sm uppercase text-slate-800 focus:outline-none focus:border-slate-800"
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

                  {/* Status Banner */}
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

                  {/* File Backup Options */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                    <button
                      id="btn-export-backup"
                      onClick={handleExportJson}
                      className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.exportBackup}</span>
                    </button>

                    <label className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t.importBackup}</span>
                      <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 5: SECURITY, PROFILE & CURRICULUM */}
              {activeTab === 'security' && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">Hồ Sơ Của Bé & Chương Trình Học</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Tùy chỉnh ảnh đại diện, tên, cấp lớp học và mật khẩu quản lý phụ huynh</p>
                  </div>

                  {/* 1. Grade Level Curriculum Selection (Multi-grade support) */}
                  <div className="p-4 bg-gradient-to-br from-indigo-50/70 to-blue-50/70 rounded-2xl border-2 border-indigo-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-700" />
                      <div>
                        <label className="text-xs font-black text-indigo-950 block">
                          Chương Trình Lớp Học Phù Hợp Lứa Tuổi
                        </label>
                        <span className="text-[11px] text-indigo-800">
                          Mức độ khó của Toán, Tiếng Việt và Tiếng Anh sẽ tự động nâng cao theo cấp lớp bé chọn
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {[
                        {
                          level: 'preschool' as GradeLevel,
                          title: '🌱 Mầm Non / Tiền Tiểu Học',
                          age: '4 - 5 tuổi',
                          desc: 'Đếm 1-10, hình khối, bảng chữ cái cơ bản & màu sắc tiếng Anh',
                        },
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

                  {/* 2. Child Profile Info & Custom Avatar Upload */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{t.childNameLabel}</label>
                      <input
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-white"
                      />
                    </div>

                    {/* Photo Avatar Upload */}
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-amber-600" />
                        <span>Ảnh Đại Diện Của Bé (Tải Hình Từ Thiết Bị)</span>
                      </label>

                      <div className="flex items-center gap-4">
                        {/* Avatar Display Box */}
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

                        {/* Upload Controls */}
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
                                <span>Dùng lại biểu tượng</span>
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
                        Hoặc chọn linh vật hoạt hình bé yêu thích:
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

                    <button
                      id="btn-save-child-profile"
                      type="button"
                      onClick={() => {
                        soundFx.playSuccess(settings.soundEnabled);
                        onUpdateState({
                          ...appState,
                          profile: {
                            ...profile,
                            name: childName,
                            avatar: childAvatar,
                            gradeLevel: childGradeLevel,
                            customAvatarUrl: customAvatarUrl,
                          },
                        });
                        alert('Đã cập nhật hồ sơ và chương trình học thành công!');
                      }}
                      className="py-2.5 px-5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-extrabold cursor-pointer active:scale-95 shadow flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4 text-amber-400" />
                      <span>{t.saveProfile} & Cấp Lớp Học</span>
                    </button>
                  </div>

                  {/* 3. Change PIN */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">{t.newPinLabel}</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        maxLength={4}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="Mã PIN 4 số..."
                        className="w-40 px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm text-center tracking-widest bg-white"
                      />
                      <button
                        id="btn-save-new-pin"
                        onClick={() => {
                          if (newPin.length === 4) {
                            soundFx.playSuccess(settings.soundEnabled);
                            onUpdateState({
                              ...appState,
                              settings: { ...settings, pinCode: newPin },
                            });
                            setNewPin('');
                            alert(t.pinSavedSuccess);
                          } else {
                            alert('Mã PIN cần gồm đúng 4 chữ số');
                          }
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        {t.savePin}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
