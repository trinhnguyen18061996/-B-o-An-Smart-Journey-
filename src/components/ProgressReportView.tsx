import React from 'react';
import {
  Award,
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { ChildProfile, ParentSettings } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface ProgressReportViewProps {
  profile: ChildProfile;
  settings: ParentSettings;
  onOpenParentSettings: () => void;
  onStartSubject: (sub: 'vietnamese' | 'math' | 'english') => void;
}

export const ProgressReportView: React.FC<ProgressReportViewProps> = ({
  profile,
  settings,
  onOpenParentSettings,
  onStartSubject,
}) => {
  const t = translations[settings.language];
  const history = profile.history || [];

  const vnCount = history.filter((h) => h.subject === 'vietnamese').length;
  const mathCount = history.filter((h) => h.subject === 'math').length;
  const enCount = history.filter((h) => h.subject === 'english').length;
  const totalExercises = history.length;

  const totalCorrect = history.reduce((acc, h) => acc + (h.correctAnswers || 0), 0);
  const totalQuestions = history.reduce((acc, h) => acc + (h.totalQuestions || 0), 0);
  const accuracyPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black text-indigo-100">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Báo cáo tiến độ học tập của bé Gạo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {profile.name || 'bé Gạo'} đang học tập rất xuất sắc!
          </h2>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Dữ liệu được cập nhật theo thời gian thực mỗi khi bé hoàn thành các trò chơi Tiếng Việt, Toán và Tiếng Anh.
          </p>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tổng số Sao</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
              ⭐
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-950">{profile.stars}</div>
          <p className="text-[11px] font-semibold text-amber-700">Đã tích lũy đổi quà</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Bài tập đã làm</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950">{totalExercises}</div>
          <p className="text-[11px] font-semibold text-emerald-700">Lượt tương tác học tập</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-sky-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Độ chính xác</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-950">{accuracyPercent}%</div>
          <p className="text-[11px] font-semibold text-sky-700">{totalCorrect}/{totalQuestions} câu trả lời đúng</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-rose-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Thời gian hôm nay</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-950">{profile.todayUsageMinutes} {t.minutes}</div>
          <p className="text-[11px] font-semibold text-rose-700">
            {settings.dailyTimeLimitMinutes > 0 ? `Giới hạn: ${settings.dailyTimeLimitMinutes} phút` : 'Không giới hạn'}
          </p>
        </div>
      </div>

      {/* Subject Distribution & Quick Jump */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-rose-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔤</span>
              <h4 className="font-extrabold text-slate-900">Môn Tiếng Việt</h4>
            </div>
            <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              {vnCount} bài
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bé đã luyện tập bảng chữ cái, dấu thanh tiếng Việt và ghép vần chính tả.
          </p>
          <button
            onClick={() => onStartSubject('vietnamese')}
            className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <span>Học Tiếng Việt ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-sky-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔢</span>
              <h4 className="font-extrabold text-slate-900">Môn Toán Học</h4>
            </div>
            <span className="text-xs font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              {mathCount} bài
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bé làm quen đếm số, nông trại vui vẻ, so sánh lớn bé và đua xe phép tính.
          </p>
          <button
            onClick={() => onStartSubject('math')}
            className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <span>Học Toán ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇬🇧</span>
              <h4 className="font-extrabold text-slate-900">Môn Tiếng Anh</h4>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {enCount} bài
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hội thoại phản xạ cùng các bạn thú cưng, phát âm Phonics chuẩn và từ vựng phong phú.
          </p>
          <button
            onClick={() => onStartSubject('english')}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <span>Học Tiếng Anh ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Lịch sử các buổi học gần nhất
            </h3>
            <p className="text-xs text-slate-500">Ghi nhận chi tiết kết quả và số sao đạt được</p>
          </div>
          <button
            onClick={onOpenParentSettings}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Xem quản lý phụ huynh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase">
                <th className="py-2.5 px-3">Ngày học</th>
                <th className="py-2.5 px-3">Môn học</th>
                <th className="py-2.5 px-3">Dạng bài</th>
                <th className="py-2.5 px-3 text-center">Kết quả</th>
                <th className="py-2.5 px-3 text-center">Số sao</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.slice(0, 8).map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-700">{item.date}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px] ${
                        item.subject === 'vietnamese'
                          ? 'bg-rose-100 text-rose-800'
                          : item.subject === 'math'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.subject === 'vietnamese' ? '🔤 Tiếng Việt' : item.subject === 'math' ? '🔢 Toán Học' : '🇬🇧 Tiếng Anh'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium capitalize">
                    {item.mode ? item.mode.replace(/_/g, ' ') : 'Luyện tập'}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">
                    {item.correctAnswers}/{item.totalQuestions} ({Math.round(((item.correctAnswers || 0) / (item.totalQuestions || 1)) * 100)}%)
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      ⭐ +{item.starsEarned}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
