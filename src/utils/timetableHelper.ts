import * as XLSX from 'xlsx';
import { SchoolDaySchedule, SchoolPeriod } from '../types';

export interface SubjectMeta {
  name: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export interface SchoolClassInfo {
  schoolName: string;
  className: string;
  academicYear: string;
  teacherName: string;
  teacherPhone: string;
  generalNotes: string[];
}

export const HUYNH_NGOC_HUE_CLASS_INFO: SchoolClassInfo = {
  schoolName: 'Trường Tiểu học Huỳnh Ngọc Huệ',
  className: 'Lớp 1/8',
  academicYear: 'Năm học 2026 - 2027 (Thực hiện từ 05/09/2026)',
  teacherName: 'Lê Thị Minh Thanh',
  teacherPhone: '0775.526.778',
  generalNotes: [
    'Vào lớp lúc 7h30, ra về 16h30, riêng sáng Thứ Tư, Thứ Năm, Thứ Sáu vào lớp lúc 8h00',
    'Mặc đồng phục thể dục vào Thứ Ba, Thứ Năm (các ngày có tiết Thể dục)',
    'Tiết in nghiêng là của giáo viên bộ môn (các tiết còn lại của GVCN)',
    'TC là tăng cường, HĐTN là Hoạt động trải nghiệm, TNXH là Tự nhiên xã hội, GDTC là Giáo dục thể chất, CC là Chào cờ, SHL là Sinh hoạt lớp.',
    'Chăm ngoan, học giỏi – Mỗi ngày một niềm vui!',
  ],
};

export const DEFAULT_SCHOOL_TIMETABLE: SchoolDaySchedule[] = [
  {
    dayIndex: 1,
    dayNameVi: 'Thứ Hai',
    dayNameEn: 'Monday',
    notes: 'Vào lớp 7h30, ra về 16h30. Chào cờ đầu tuần mặc đồng phục nghiêm túc.',
    morningPeriods: [
      { periodNumber: 1, session: 'morning', time: '7h30 - 8h15', subjectName: 'CC - HĐTN', teacher: 'c. Thanh (GVCN)', note: 'Chào cờ & Hoạt động trải nghiệm đầu tuần' },
      { periodNumber: 2, session: 'morning', time: '8h20 - 8h55', subjectName: 'Đạo đức', teacher: 'th. Chung', note: 'Giáo viên bộ môn: Thầy Chung' },
      { periodNumber: 3, session: 'morning', time: '9h15 - 9h50', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Học vần & luyện đọc bài mới' },
      { periodNumber: 4, session: 'morning', time: '9h55 - 10h30', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Luyện viết & bài tập thực hành' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '14h10 - 14h55', subjectName: 'Toán', teacher: 'c. Thanh (GVCN)', note: 'Số học & phép tính' },
      { periodNumber: 2, session: 'afternoon', time: '15h00 - 15h35', subjectName: 'T. Việt TC', teacher: 'c. Khanh', note: 'Tiếng Việt tăng cường (Cô Khanh)' },
      { periodNumber: 3, session: 'afternoon', time: '15h55 - 16h30', subjectName: 'HĐTN', teacher: 'c. Thanh (GVCN)', note: 'Hoạt động trải nghiệm chiều thứ Hai' },
    ],
  },
  {
    dayIndex: 2,
    dayNameVi: 'Thứ Ba',
    dayNameEn: 'Tuesday',
    notes: '⚡ MẶC ĐỒNG PHỤC THỂ DỤC (Chiều có tiết Thầy Học). Vào lớp 7h30.',
    morningPeriods: [
      { periodNumber: 1, session: 'morning', time: '7h30 - 8h15', subjectName: 'Toán', teacher: 'c. Thanh (GVCN)', note: 'Luyện tập toán tư duy' },
      { periodNumber: 2, session: 'morning', time: '8h20 - 8h55', subjectName: 'Âm nhạc', teacher: 'c. Thi', note: 'Giáo viên bộ môn: Cô Thi' },
      { periodNumber: 3, session: 'morning', time: '9h15 - 9h50', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Tập đọc và trả lời câu hỏi' },
      { periodNumber: 4, session: 'morning', time: '9h55 - 10h30', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Chính tả & luyện chữ' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '14h10 - 14h55', subjectName: 'Tiếng Anh', teacher: 'c. Bích', note: 'Giáo viên bộ môn: Cô Bích' },
      { periodNumber: 2, session: 'afternoon', time: '15h00 - 15h35', subjectName: 'Tiếng Anh', teacher: 'c. Bích', note: 'Giáo viên bộ môn: Cô Bích' },
      { periodNumber: 3, session: 'afternoon', time: '15h55 - 16h30', subjectName: 'GDTC', teacher: 'th. Học', note: 'Giáo dục thể chất (Thầy Học) - Mang giày bata' },
    ],
  },
  {
    dayIndex: 3,
    dayNameVi: 'Thứ Tư',
    dayNameEn: 'Wednesday',
    notes: '⏰ RIÊNG SÁNG THỨ TƯ VÀO LỚP LÚC 8H00 (Không có tiết 1). Mang hộp sáp màu mĩ thuật.',
    morningPeriods: [
      { periodNumber: 2, session: 'morning', time: '8h20 - 8h55', subjectName: 'TNXH', teacher: 'c. Ngân', note: 'Tự nhiên & Xã hội (Cô Ngân)' },
      { periodNumber: 3, session: 'morning', time: '9h15 - 9h50', subjectName: 'Toán', teacher: 'c. Thanh (GVCN)', note: 'Hình học & đo lường' },
      { periodNumber: 4, session: 'morning', time: '9h55 - 10h30', subjectName: 'Mĩ thuật', teacher: 'c. Thảo', note: 'Giáo viên bộ môn: Cô Thảo (Mang hộp màu)' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '14h10 - 14h55', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Luyện từ và câu' },
      { periodNumber: 2, session: 'afternoon', time: '15h00 - 15h35', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Tập viết và bài tập chính tả' },
      { periodNumber: 3, session: 'afternoon', time: '15h55 - 16h30', subjectName: 'T. Việt (TC)', teacher: 'c. Thanh (GVCN)', note: 'Tiếng Việt tăng cường' },
    ],
  },
  {
    dayIndex: 4,
    dayNameVi: 'Thứ Năm',
    dayNameEn: 'Thursday',
    notes: '⏰ SÁNG THỨ NĂM VÀO LỚP LÚC 8H00 & ⚡ MẶC ĐỒNG PHỤC THỂ DỤC.',
    morningPeriods: [
      { periodNumber: 2, session: 'morning', time: '8h20 - 8h55', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Kể chuyện theo tranh' },
      { periodNumber: 3, session: 'morning', time: '9h15 - 9h50', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Tập đọc bài mới' },
      { periodNumber: 4, session: 'morning', time: '9h55 - 10h30', subjectName: 'Toán (TC)', teacher: 'c. Thanh (GVCN)', note: 'Toán tăng cường' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '14h10 - 14h55', subjectName: 'TNXH', teacher: 'c. Ngân', note: 'Tự nhiên & Xã hội (Cô Ngân)' },
      { periodNumber: 2, session: 'afternoon', time: '15h00 - 15h35', subjectName: 'T. Việt TC', teacher: 'c. Ngân', note: 'Tiếng Việt tăng cường (Cô Ngân)' },
      { periodNumber: 3, session: 'afternoon', time: '15h55 - 16h30', subjectName: 'GDTC', teacher: 'th. Học', note: 'Giáo dục thể chất (Thầy Học)' },
    ],
  },
  {
    dayIndex: 5,
    dayNameVi: 'Thứ Sáu',
    dayNameEn: 'Friday',
    notes: '⏰ SÁNG THỨ SÁU VÀO LỚP LÚC 8H00. Chiều có Sinh hoạt lớp, tổng kết tuần!',
    morningPeriods: [
      { periodNumber: 2, session: 'morning', time: '8h20 - 8h55', subjectName: 'Toán TC', teacher: 'c. Mai', note: 'Toán tăng cường (Cô Mai)' },
      { periodNumber: 3, session: 'morning', time: '9h15 - 9h50', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Kiểm tra đọc hiểu tuần' },
      { periodNumber: 4, session: 'morning', time: '9h55 - 10h30', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Ôn tập chữ và câu' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '14h10 - 14h55', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Tập đọc diễn cảm' },
      { periodNumber: 2, session: 'afternoon', time: '15h00 - 15h35', subjectName: 'Tiếng Việt', teacher: 'c. Thanh (GVCN)', note: 'Luyện viết sáng tạo' },
      { periodNumber: 3, session: 'afternoon', time: '15h55 - 16h30', subjectName: 'HĐTN - SHL', teacher: 'c. Thanh (GVCN)', note: 'Hoạt động trải nghiệm & Sinh hoạt lớp cuối tuần' },
    ],
  },
  { dayIndex: 6, dayNameVi: 'Thứ Bảy', dayNameEn: 'Saturday', notes: 'Ngày nghỉ cuối tuần.', morningPeriods: [], afternoonPeriods: [] },
  { dayIndex: 0, dayNameVi: 'Chủ Nhật', dayNameEn: 'Sunday', notes: 'Nghỉ ngơi và chuẩn bị sách vở cho tuần mới.', morningPeriods: [], afternoonPeriods: [] },
];
