import { AppState, ChildProfile, ParentSettings, ScheduleDay, StudySession } from '../types';
import { INITIAL_BADGES, INITIAL_STICKERS } from '../data/rewards';
import { DEFAULT_SCHOOL_TIMETABLE } from './timetableHelper';

const STORAGE_KEY = 'be_vui_hoc_lop1_state_v1';

export const DEFAULT_SCHEDULE: ScheduleDay[] = [
  { dayIndex: 1, dayNameVi: 'Thứ Hai', dayNameEn: 'Monday', subject: 'vietnamese', titleVi: '🔤 Bảng Chữ Cái & Ghép Vần', titleEn: '🔤 Alphabet & Rhymes', timeSlot: '19:30 - 19:50', targetGoal: 3 },
  { dayIndex: 2, dayNameVi: 'Thứ Ba', dayNameEn: 'Tuesday', subject: 'math', titleVi: '🔢 Nông Trại Đếm Số & Phép Cộng', titleEn: '🔢 Counting & Addition', timeSlot: '19:30 - 19:50', targetGoal: 3 },
  { dayIndex: 3, dayNameVi: 'Thứ Tư', dayNameEn: 'Wednesday', subject: 'vietnamese', titleVi: '📝 Điền Chữ & Bắt Chữ Đúng', titleEn: '📝 Missing Letters & Words', timeSlot: '19:30 - 19:50', targetGoal: 3 },
  { dayIndex: 4, dayNameVi: 'Thứ Năm', dayNameEn: 'Thursday', subject: 'math', titleVi: '🏎️ Đua Xe Phép Tính & So Sánh', titleEn: '🏎️ Speed Math & Compare', timeSlot: '19:30 - 19:50', targetGoal: 3 },
  { dayIndex: 5, dayNameVi: 'Thứ Sáu', dayNameEn: 'Friday', subject: 'both', titleVi: '🌟 Tổng Hợp Toán & Tiếng Việt', titleEn: '🌟 Math & Vietnamese Mix', timeSlot: '19:30 - 20:00', targetGoal: 4 },
  { dayIndex: 6, dayNameVi: 'Thứ Bảy', dayNameEn: 'Saturday', subject: 'math', titleVi: '🔷 Thế Giới Hình Khối & Đổi Thưởng', titleEn: '🔷 Shapes & Rewards Quest', timeSlot: '09:30 - 10:00', targetGoal: 2 },
  { dayIndex: 0, dayNameVi: 'Chủ Nhật', dayNameEn: 'Sunday', subject: 'rest', titleVi: '🎈 Ngày Nghỉ & Chơi Tự Do', titleEn: '🎈 Rest & Free Play', timeSlot: 'Tự do', targetGoal: 1 },
];

function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'KID-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate default realistic history sessions for the current week so parent report has rich chart data immediately
function generateSeedHistory(): StudySession[] {
  const now = new Date();
  const sessions: StudySession[] = [];
  const daysOffsets = [6, 5, 4, 3, 2, 1]; // past days

  daysOffsets.forEach((offset, idx) => {
    const d = new Date(now.getTime() - offset * 86400000);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isVn = idx % 2 === 0;
    sessions.push({
      id: `seed_${idx}`,
      date: dateStr,
      timestamp: d.getTime(),
      subject: isVn ? 'vietnamese' : 'math',
      mode: isVn ? 'rhyme_builder' : 'counting',
      totalQuestions: 5,
      correctAnswers: idx === 3 ? 4 : 5,
      starsEarned: idx === 3 ? 4 : 5,
      durationMinutes: 12 + (idx * 2) % 10,
    });
  });

  return sessions;
}

const DEFAULT_PROFILE: ChildProfile = {
  name: 'bé Gạo',
  avatar: '🐰',
  customAvatarUrl: '/og-image.jpg',
  gradeLevel: 'grade_1',
  stars: 18,
  currentStreak: 4,
  todayUsageMinutes: 8,
  lastActiveDate: getTodayString(),
  completedLessons: ['rhyme_1', 'rhyme_2', 'cnt_1', 'cnt_2', 'sm_1'],
  badges: INITIAL_BADGES,
  unlockedStickers: ['bunny', 'kitten'],
  history: generateSeedHistory(),
};

const DEFAULT_SETTINGS: ParentSettings = {
  pinCode: '1234',
  dailyTimeLimitMinutes: 30, // 30 minutes standard recommendation for 6-year-olds
  soundEnabled: true,
  speechEnabled: true,
  language: 'vi',
  syncCode: generateRandomCode(),
  reminderTime: '19:30',
  reminderEnabled: true,
  schedule: DEFAULT_SCHEDULE,
  schoolTimetable: DEFAULT_SCHOOL_TIMETABLE,
  showWeekendTimetable: false,
};

export function loadInitialState(): AppState {
  if (typeof window === 'undefined') {
    return { profile: DEFAULT_PROFILE, settings: DEFAULT_SETTINGS };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // verify today's timer reset if new day
      const today = getTodayString();
      if (parsed.profile.lastActiveDate !== today) {
        parsed.profile.todayUsageMinutes = 0;
        parsed.profile.lastActiveDate = today;
      }
      const loadedName = parsed.profile.name === 'Bé Bắp' || !parsed.profile.name ? 'bé Gạo' : parsed.profile.name;
      const validGradeLevels = ['grade_1', 'grade_2', 'grade_3', 'grade_4', 'grade_5'];
      const loadedGrade = validGradeLevels.includes(parsed.profile.gradeLevel) ? parsed.profile.gradeLevel : 'grade_1';
      
      // Auto-migrate to official Huỳnh Ngọc Huệ timetable if user had old template or missing
      const hasOldGenericTimetable = !parsed.settings?.schoolTimetable ||
        !Array.isArray(parsed.settings.schoolTimetable) ||
        parsed.settings.schoolTimetable.some((d: any) =>
          d.morningPeriods?.some((p: any) => p.subjectName === 'Chào cờ' && p.time === '07:30 - 08:05')
        ) ||
        !parsed.settings.schoolTimetable.some((d: any) =>
          d.morningPeriods?.some((p: any) => p.subjectName === 'CC - HĐTN')
        );

      const activeTimetable = hasOldGenericTimetable ? DEFAULT_SCHOOL_TIMETABLE : parsed.settings.schoolTimetable;

      return {
        profile: { ...DEFAULT_PROFILE, ...parsed.profile, name: loadedName, gradeLevel: loadedGrade },
        settings: {
          ...DEFAULT_SETTINGS,
          ...parsed.settings,
          schoolTimetable: activeTimetable,
        },
      };
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }

  return { profile: DEFAULT_PROFILE, settings: DEFAULT_SETTINGS };
}

export function saveStateToLocal(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

// Server Sync API Call
export async function syncStateToCloud(state: AppState): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/sync/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        syncCode: state.settings.syncCode,
        payload: state,
      }),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return { success: data.success, message: data.message };
  } catch (err) {
    console.warn('Sync failed (working offline):', err);
    return { success: false, message: err instanceof Error ? err.message : 'Lỗi kết nối' };
  }
}

export async function loadStateFromCloud(syncCode: string): Promise<{ success: boolean; state?: AppState; message?: string }> {
  try {
    const res = await fetch(`/api/sync/load/${encodeURIComponent(syncCode.trim().toUpperCase())}`);
    if (!res.ok) {
      return { success: false, message: 'Không tìm thấy mã đồng bộ này' };
    }
    const data = await res.json();
    if (data.success && data.data) {
      return { success: true, state: data.data as AppState };
    }
    return { success: false, message: 'Dữ liệu không hợp lệ' };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Không thể kết nối máy chủ' };
  }
}

// Request Notification Permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  try {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  } catch {
    return false;
  }
}

export function sendLocalNotification(title: string, body: string): void {
  if (typeof window === 'undefined') return;
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=128&auto=format&fit=crop&q=80',
      });
    } catch {
      // ignore
    }
  }
}
