export type Language = 'vi' | 'en';

export type GradeLevel = 'preschool' | 'grade_1' | 'grade_2' | 'grade_3';

export type Subject = 'vietnamese' | 'math' | 'english';

export type VietnameseGameMode = 'alphabet' | 'rhyme_builder' | 'missing_letter' | 'word_match';

export type MathGameMode = 'counting' | 'speed_math' | 'comparison' | 'shapes';

export type EnglishGameMode = 'phonics' | 'communication' | 'vocab' | 'dialogue';

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  subject: Subject;
  mode: string;
  totalQuestions: number;
  correctAnswers: number;
  starsEarned: number;
  durationMinutes: number;
  gradeLevel?: GradeLevel;
}

export interface Badge {
  id: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Sticker {
  id: string;
  nameVi: string;
  nameEn: string;
  emoji: string;
  category: string;
  requiredStars: number;
  unlocked: boolean;
}

export interface ScheduleDay {
  dayIndex: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  dayNameVi: string;
  dayNameEn: string;
  subject: Subject | 'both' | 'all' | 'rest';
  titleVi: string;
  titleEn: string;
  timeSlot: string; // e.g. "19:30 - 20:00"
  targetGoal: number; // number of exercises
}

export interface ParentSettings {
  pinCode: string;
  dailyTimeLimitMinutes: number; // 0 = unlimited, 15, 30, 45, 60
  soundEnabled: boolean;
  speechEnabled: boolean;
  language: Language;
  syncCode: string;
  reminderTime: string; // e.g. "19:30"
  reminderEnabled: boolean;
  schedule: ScheduleDay[];
}

export interface ChildProfile {
  name: string;
  avatar: string; // emoji icon or fallback
  customAvatarUrl?: string; // base64 uploaded image from parents
  gradeLevel: GradeLevel;
  stars: number;
  currentStreak: number;
  todayUsageMinutes: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedLessons: string[];
  badges: Badge[];
  unlockedStickers: string[];
  history: StudySession[];
}

export interface AppState {
  profile: ChildProfile;
  settings: ParentSettings;
}

