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

/**
 * EXACT OFFICIAL TIMETABLE - LỚP 1/8 TRƯỜNG TIỂU HỌC HUỲNH NGỌC HUỆ
 */
export const DEFAULT_SCHOOL_TIMETABLE: SchoolDaySchedule[] = [
  {
    dayIndex: 1,
    dayNameVi: 'Thứ Hai',
    dayNameEn: 'Monday',
    notes: 'Vào lớp 7h30, ra về 16h30. Chào cờ đầu tuần mặc đồng phục nghiêm túc.',
    morningPeriods: [
      {
        periodNumber: 1,
        session: 'morning',
        time: '7h30 - 8h15',
        subjectName: 'CC - HĐTN',
        teacher: 'c. Thanh (GVCN)',
        note: 'Chào cờ & Hoạt động trải nghiệm đầu tuần',
      },
      {
        periodNumber: 2,
        session: 'morning',
        time: '8h20 - 8h55',
        subjectName: 'Đạo đức',
        teacher: 'th. Chung',
        note: 'Giáo viên bộ môn: Thầy Chung',
      },
      {
        periodNumber: 3,
        session: 'morning',
        time: '9h15 - 9h50',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Học vần & luyện đọc bài mới',
      },
      {
        periodNumber: 4,
        session: 'morning',
        time: '9h55 - 10h30',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Luyện viết & bài tập thực hành',
      },
    ],
    afternoonPeriods: [
      {
        periodNumber: 1,
        session: 'afternoon',
        time: '14h10 - 14h55',
        subjectName: 'Toán',
        teacher: 'c. Thanh (GVCN)',
        note: 'Số học & phép tính',
      },
      {
        periodNumber: 2,
        session: 'afternoon',
        time: '15h00 - 15h35',
        subjectName: 'T. Việt TC',
        teacher: 'c. Khanh',
        note: 'Tiếng Việt tăng cường (Cô Khanh)',
      },
      {
        periodNumber: 3,
        session: 'afternoon',
        time: '15h55 - 16h30',
        subjectName: 'HĐTN',
        teacher: 'c. Thanh (GVCN)',
        note: 'Hoạt động trải nghiệm chiều thứ Hai',
      },
    ],
  },
  {
    dayIndex: 2,
    dayNameVi: 'Thứ Ba',
    dayNameEn: 'Tuesday',
    notes: '⚡ MẶC ĐỒNG PHỤC THỂ DỤC (Chiều có tiết Thầy Học). Vào lớp 7h30.',
    morningPeriods: [
      {
        periodNumber: 1,
        session: 'morning',
        time: '7h30 - 8h15',
        subjectName: 'Toán',
        teacher: 'c. Thanh (GVCN)',
        note: 'Luyện tập toán tư duy',
      },
      {
        periodNumber: 2,
        session: 'morning',
        time: '8h20 - 8h55',
        subjectName: 'Âm nhạc',
        teacher: 'c. Thi',
        note: 'Giáo viên bộ môn: Cô Thi',
      },
      {
        periodNumber: 3,
        session: 'morning',
        time: '9h15 - 9h50',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Tập đọc và trả lời câu hỏi',
      },
      {
        periodNumber: 4,
        session: 'morning',
        time: '9h55 - 10h30',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Chính tả & luyện chữ',
      },
    ],
    afternoonPeriods: [
      {
        periodNumber: 1,
        session: 'afternoon',
        time: '14h10 - 14h55',
        subjectName: 'Tiếng Anh',
        teacher: 'c. Bích',
        note: 'Giáo viên bộ môn: Cô Bích',
      },
      {
        periodNumber: 2,
        session: 'afternoon',
        time: '15h00 - 15h35',
        subjectName: 'Tiếng Anh',
        teacher: 'c. Bích',
        note: 'Giáo viên bộ môn: Cô Bích (Luyện nghe & phản xạ)',
      },
      {
        periodNumber: 3,
        session: 'afternoon',
        time: '15h55 - 16h30',
        subjectName: 'GDTC',
        teacher: 'th. Học',
        note: 'Giáo dục thể chất (Thầy Học) - Mang giày bata',
      },
    ],
  },
  {
    dayIndex: 3,
    dayNameVi: 'Thứ Tư',
    dayNameEn: 'Wednesday',
    notes: '⏰ RIÊNG SÁNG THỨ TƯ VÀO LỚP LÚC 8H00 (Không có tiết 1). Mang hộp sáp màu mĩ thuật.',
    morningPeriods: [
      {
        periodNumber: 2,
        session: 'morning',
        time: '8h20 - 8h55',
        subjectName: 'TNXH',
        teacher: 'c. Ngân',
        note: 'Tự nhiên & Xã hội (Cô Ngân)',
      },
      {
        periodNumber: 3,
        session: 'morning',
        time: '9h15 - 9h50',
        subjectName: 'Toán',
        teacher: 'c. Thanh (GVCN)',
        note: 'Hình học & đo lường',
      },
      {
        periodNumber: 4,
        session: 'morning',
        time: '9h55 - 10h30',
        subjectName: 'Mĩ thuật',
        teacher: 'c. Thảo',
        note: 'Giáo viên bộ môn: Cô Thảo (Mang hộp sáp màu và giấy vẽ)',
      },
    ],
    afternoonPeriods: [
      {
        periodNumber: 1,
        session: 'afternoon',
        time: '14h10 - 14h55',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Luyện từ và câu',
      },
      {
        periodNumber: 2,
        session: 'afternoon',
        time: '15h00 - 15h35',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Tập viết và bài tập chính tả',
      },
      {
        periodNumber: 3,
        session: 'afternoon',
        time: '15h55 - 16h30',
        subjectName: 'T. Việt (TC)',
        teacher: 'c. Thanh (GVCN)',
        note: 'Tiếng Việt tăng cường',
      },
    ],
  },
  {
    dayIndex: 4,
    dayNameVi: 'Thứ Năm',
    dayNameEn: 'Thursday',
    notes: '⏰ SÁNG THỨ NĂM VÀO LỚP LÚC 8H00 & ⚡ MẶC ĐỒNG PHỤC THỂ DỤC (Chiều có Thầy Học).',
    morningPeriods: [
      {
        periodNumber: 2,
        session: 'morning',
        time: '8h20 - 8h55',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Kể chuyện theo tranh',
      },
      {
        periodNumber: 3,
        session: 'morning',
        time: '9h15 - 9h50',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Tập đọc bài mới',
      },
      {
        periodNumber: 4,
        session: 'morning',
        time: '9h55 - 10h30',
        subjectName: 'Toán (TC)',
        teacher: 'c. Thanh (GVCN)',
        note: 'Toán tăng cường',
      },
    ],
    afternoonPeriods: [
      {
        periodNumber: 1,
        session: 'afternoon',
        time: '14h10 - 14h55',
        subjectName: 'TNXH',
        teacher: 'c. Ngân',
        note: 'Tự nhiên & Xã hội (Cô Ngân)',
      },
      {
        periodNumber: 2,
        session: 'afternoon',
        time: '15h00 - 15h35',
        subjectName: 'T. Việt TC',
        teacher: 'c. Ngân',
        note: 'Tiếng Việt tăng cường (Cô Ngân)',
      },
      {
        periodNumber: 3,
        session: 'afternoon',
        time: '15h55 - 16h30',
        subjectName: 'GDTC',
        teacher: 'th. Học',
        note: 'Giáo dục thể chất (Thầy Học)',
      },
    ],
  },
  {
    dayIndex: 5,
    dayNameVi: 'Thứ Sáu',
    dayNameEn: 'Friday',
    notes: '⏰ SÁNG THỨ SÁU VÀO LỚP LÚC 8H00. Chiều có Sinh hoạt lớp, tổng kết sao chăm ngoan!',
    morningPeriods: [
      {
        periodNumber: 2,
        session: 'morning',
        time: '8h20 - 8h55',
        subjectName: 'Toán TC',
        teacher: 'c. Mai',
        note: 'Toán tăng cường (Cô Mai)',
      },
      {
        periodNumber: 3,
        session: 'morning',
        time: '9h15 - 9h50',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Kiểm tra đọc hiểu tuần',
      },
      {
        periodNumber: 4,
        session: 'morning',
        time: '9h55 - 10h30',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Ôn tập chữ và câu',
      },
    ],
    afternoonPeriods: [
      {
        periodNumber: 1,
        session: 'afternoon',
        time: '14h10 - 14h55',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Tập đọc diễn cảm',
      },
      {
        periodNumber: 2,
        session: 'afternoon',
        time: '15h00 - 15h35',
        subjectName: 'Tiếng Việt',
        teacher: 'c. Thanh (GVCN)',
        note: 'Luyện viết sáng tạo',
      },
      {
        periodNumber: 3,
        session: 'afternoon',
        time: '15h55 - 16h30',
        subjectName: 'HĐTN - SHL',
        teacher: 'c. Thanh (GVCN)',
        note: 'Hoạt động trải nghiệm & Sinh hoạt lớp cuối tuần',
      },
    ],
  },
  {
    dayIndex: 6,
    dayNameVi: 'Thứ Bảy',
    dayNameEn: 'Saturday',
    notes: 'Ngày nghỉ cuối tuần: vui chơi năng khiếu, bơi lội hoặc đọc sách cùng gia đình.',
    morningPeriods: [],
    afternoonPeriods: [],
  },
  {
    dayIndex: 0,
    dayNameVi: 'Chủ Nhật',
    dayNameEn: 'Sunday',
    notes: 'Nghỉ ngơi, vui vẻ và chuẩn bị sẵn cặp sách vở cho thứ Hai nhé!',
    morningPeriods: [],
    afternoonPeriods: [],
  },
];

/**
 * Visual styling & icon resolver for subjects with all official Vietnamese abbreviations
 */
export function getSubjectMeta(subjectName: string): SubjectMeta {
  const norm = (subjectName || '').toLowerCase().trim();

  // Chào cờ / Hoạt động trải nghiệm
  if (norm.includes('cc - hđtn') || norm.includes('chào cờ') || norm.includes('sinh hoạt dưới cờ')) {
    return { name: subjectName, icon: '🚩', colorClass: 'text-red-700', bgClass: 'bg-red-50', borderClass: 'border-red-300' };
  }
  if (norm.includes('hđtn - shl') || norm.includes('sinh hoạt lớp') || norm.includes('shl')) {
    return { name: subjectName, icon: '🏆', colorClass: 'text-amber-800', bgClass: 'bg-amber-100', borderClass: 'border-amber-300' };
  }
  if (norm.includes('hđtn') || norm.includes('trải nghiệm')) {
    return { name: subjectName, icon: '🌟', colorClass: 'text-yellow-800', bgClass: 'bg-yellow-50', borderClass: 'border-yellow-300' };
  }

  // Tiếng Việt / T. Việt TC
  if (
    norm.includes('tiếng việt') ||
    norm.includes('t. việt') ||
    norm.includes('t.việt') ||
    norm.includes('tập đọc') ||
    norm.includes('chính tả') ||
    norm.includes('tập viết')
  ) {
    return { name: subjectName, icon: '🔤', colorClass: 'text-rose-700', bgClass: 'bg-rose-50', borderClass: 'border-rose-300' };
  }

  // Toán / Toán TC
  if (norm.includes('toán') || norm.includes('số học') || norm.includes('hình học') || norm.includes('math')) {
    return { name: subjectName, icon: '🔢', colorClass: 'text-sky-700', bgClass: 'bg-sky-50', borderClass: 'border-sky-300' };
  }

  // Tiếng Anh
  if (norm.includes('tiếng anh') || norm.includes('ngoại ngữ') || norm.includes('english')) {
    return { name: subjectName, icon: '🇬🇧', colorClass: 'text-emerald-700', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-300' };
  }

  // Giáo dục thể chất / Thể dục
  if (norm.includes('gdtc') || norm.includes('thể chất') || norm.includes('thể dục') || norm.includes('bơi')) {
    return { name: subjectName, icon: '🏃', colorClass: 'text-orange-700', bgClass: 'bg-orange-50', borderClass: 'border-orange-300' };
  }

  // Tự nhiên xã hội (TNXH)
  if (norm.includes('tnxh') || norm.includes('tự nhiên') || norm.includes('xã hội')) {
    return { name: subjectName, icon: '🌿', colorClass: 'text-teal-700', bgClass: 'bg-teal-50', borderClass: 'border-teal-300' };
  }

  // Mĩ thuật / Mỹ thuật
  if (norm.includes('mĩ thuật') || norm.includes('mỹ thuật') || norm.includes('vẽ') || norm.includes('art')) {
    return { name: subjectName, icon: '🎨', colorClass: 'text-purple-700', bgClass: 'bg-purple-50', borderClass: 'border-purple-300' };
  }

  // Âm nhạc
  if (norm.includes('âm nhạc') || norm.includes('hát') || norm.includes('nhạc') || norm.includes('music')) {
    return { name: subjectName, icon: '🎵', colorClass: 'text-pink-700', bgClass: 'bg-pink-50', borderClass: 'border-pink-300' };
  }

  // Đạo đức
  if (norm.includes('đạo đức') || norm.includes('lễ phép') || norm.includes('ethics')) {
    return { name: subjectName, icon: '🕊️', colorClass: 'text-indigo-700', bgClass: 'bg-indigo-50', borderClass: 'border-indigo-300' };
  }

  // Fallback
  return { name: subjectName, icon: '📚', colorClass: 'text-blue-700', bgClass: 'bg-blue-50', borderClass: 'border-blue-300' };
}

/**
 * Smart, tolerant parser for School Timetable files (.xlsx, .xls)
 * Handles school banners, headers, merged session rows, ra chơi rows, and teacher annotations.
 */
export async function parseTimetableFile(file: File): Promise<SchoolDaySchedule[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  if (!worksheet) {
    throw new Error('Tệp không có dữ liệu bảng tính!');
  }

  const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  if (!rawRows || rawRows.length === 0) {
    throw new Error('Bảng tính trống!');
  }

  // Initialize day structure
  const dayMap: { [dayIndex: number]: SchoolDaySchedule } = {
    1: { dayIndex: 1, dayNameVi: 'Thứ Hai', dayNameEn: 'Monday', morningPeriods: [], afternoonPeriods: [], notes: 'Vào lớp 7h30, ra về 16h30' },
    2: { dayIndex: 2, dayNameVi: 'Thứ Ba', dayNameEn: 'Tuesday', morningPeriods: [], afternoonPeriods: [], notes: 'Mặc đồng phục thể dục' },
    3: { dayIndex: 3, dayNameVi: 'Thứ Tư', dayNameEn: 'Wednesday', morningPeriods: [], afternoonPeriods: [], notes: 'Sáng Thứ Tư vào lớp lúc 8h00' },
    4: { dayIndex: 4, dayNameVi: 'Thứ Năm', dayNameEn: 'Thursday', morningPeriods: [], afternoonPeriods: [], notes: 'Sáng Thứ Năm vào lớp lúc 8h00 & Mặc đồng phục thể dục' },
    5: { dayIndex: 5, dayNameVi: 'Thứ Sáu', dayNameEn: 'Friday', morningPeriods: [], afternoonPeriods: [], notes: 'Sáng Thứ Sáu vào lớp lúc 8h00' },
    6: { dayIndex: 6, dayNameVi: 'Thứ Bảy', dayNameEn: 'Saturday', morningPeriods: [], afternoonPeriods: [], notes: 'Nghỉ cuối tuần' },
    0: { dayIndex: 0, dayNameVi: 'Chủ Nhật', dayNameEn: 'Sunday', morningPeriods: [], afternoonPeriods: [], notes: 'Nghỉ cuối tuần' },
  };

  // 1. Locate header row containing Thứ Hai / Thứ 2 / Monday
  let headerRowIdx = -1;
  let dayColumnMap: { [colIdx: number]: number } = {};

  for (let r = 0; r < Math.min(15, rawRows.length); r++) {
    const row = rawRows[r].map((cell) => String(cell).toLowerCase().trim());
    const foundDays: { [colIdx: number]: number } = {};

    row.forEach((cell, colIdx) => {
      if (cell.includes('thứ 2') || cell.includes('thứ hai') || cell === 't2' || cell === 'mon') foundDays[colIdx] = 1;
      else if (cell.includes('thứ 3') || cell.includes('thứ ba') || cell === 't3' || cell === 'tue') foundDays[colIdx] = 2;
      else if (cell.includes('thứ 4') || cell.includes('thứ tư') || cell === 't4' || cell === 'wed') foundDays[colIdx] = 3;
      else if (cell.includes('thứ 5') || cell.includes('thứ năm') || cell === 't5' || cell === 'thu') foundDays[colIdx] = 4;
      else if (cell.includes('thứ 6') || cell.includes('thứ sáu') || cell === 't6' || cell === 'fri') foundDays[colIdx] = 5;
      else if (cell.includes('thứ 7') || cell.includes('thứ bảy') || cell === 't7' || cell === 'sat') foundDays[colIdx] = 6;
      else if (cell.includes('chủ nhật') || cell === 'cn' || cell === 'sun') foundDays[colIdx] = 0;
    });

    if (Object.keys(foundDays).length >= 2) {
      headerRowIdx = r;
      dayColumnMap = foundDays;
      break;
    }
  }

  if (headerRowIdx >= 0 && Object.keys(dayColumnMap).length >= 2) {
    let currentSession: 'morning' | 'afternoon' = 'morning';

    // Standard school times
    const defaultMorningTimes = ['7h30 - 8h15', '8h20 - 8h55', '9h15 - 9h50', '9h55 - 10h30'];
    const defaultAfternoonTimes = ['14h10 - 14h55', '15h00 - 15h35', '15h55 - 16h30'];

    for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!row || row.length === 0) continue;

      const combinedRowStr = row.map((c) => String(c).trim()).join(' ').toLowerCase();

      // Skip break or decorative rows
      if (combinedRowStr.includes('ra chơi') || combinedRowStr.includes('nghỉ giữa giờ')) {
        continue;
      }
      if (combinedRowStr.includes('lưu ý') || combinedRowStr.includes('chăm ngoan')) {
        break; // Reached footer notes
      }

      // Detect session switch
      if (combinedRowStr.includes('buổi chiều') || combinedRowStr.includes('chiều')) {
        currentSession = 'afternoon';
        continue;
      }
      if (combinedRowStr.includes('buổi sáng') || combinedRowStr.includes('sáng')) {
        currentSession = 'morning';
        continue;
      }

      // Check period number
      const firstCell = String(row[0] || '').trim();
      const secondCell = String(row[1] || '').trim();

      let periodNum = 0;
      const numMatch = (firstCell + ' ' + secondCell).match(/(?:tiết\s*)?([1-5])/i);
      if (numMatch) {
        periodNum = parseInt(numMatch[1], 10);
      }

      if (periodNum === 0) {
        continue;
      }

      // Determine period time
      let timeStr = '';
      const timeMatch = (firstCell + ' ' + secondCell).match(/(\d{1,2}h\d{0,2}\s*-\s*\d{1,2}h\d{0,2})/i);
      if (timeMatch) {
        timeStr = timeMatch[1];
      } else {
        timeStr =
          currentSession === 'morning'
            ? defaultMorningTimes[periodNum - 1] || '7h30 - 8h15'
            : defaultAfternoonTimes[periodNum - 1] || '14h10 - 14h55';
      }

      // For each day column, extract cell contents
      Object.entries(dayColumnMap).forEach(([colIdxStr, dayIdx]) => {
        const col = parseInt(colIdxStr, 10);
        const cellRaw = String(row[col] || '').trim();

        if (cellRaw && cellRaw !== '-' && cellRaw !== '0') {
          // Extract teacher if present in parentheses e.g. "Âm nhạc (c. Thi)" or "Đạo đức\n(th. Chung)"
          let subject = cellRaw;
          let teacher: string | undefined = undefined;

          const teacherMatch = cellRaw.match(/^([^\(\n\r]+)[\(\r\n]+([^)]*)\)?$/);
          if (teacherMatch) {
            subject = teacherMatch[1].trim();
            teacher = teacherMatch[2].replace(/[()]/g, '').trim();
          }

          const period: SchoolPeriod = {
            periodNumber: periodNum,
            session: currentSession,
            time: timeStr,
            subjectName: subject,
            teacher: teacher,
          };

          if (currentSession === 'morning') {
            dayMap[dayIdx].morningPeriods.push(period);
          } else {
            dayMap[dayIdx].afternoonPeriods.push(period);
          }
        }
      });
    }

    // Sort periods
    [1, 2, 3, 4, 5, 6, 0].forEach((idx) => {
      dayMap[idx].morningPeriods.sort((a, b) => a.periodNumber - b.periodNumber);
      dayMap[idx].afternoonPeriods.sort((a, b) => a.periodNumber - b.periodNumber);
    });
  }

  const result = [1, 2, 3, 4, 5, 6, 0]
    .map((idx) => dayMap[idx])
    .filter((d) => d.morningPeriods.length > 0 || d.afternoonPeriods.length > 0);

  if (result.length === 0) {
    // If extraction yielded empty, return the official Huỳnh Ngọc Huệ timetable
    return DEFAULT_SCHOOL_TIMETABLE;
  }

  return result;
}

/**
 * Export School Timetable as standard formatted Excel (.xlsx) file
 */
export function exportTimetableToExcel(schedule: SchoolDaySchedule[], childName: string = 'bé Gạo') {
  const wb = XLSX.utils.book_new();

  const matrixData: any[][] = [
    ['ỦY BAN NHÂN DÂN PHƯỜNG THANH KHÊ'],
    ['TRƯỜNG TIỂU HỌC HUỲNH NGỌC HUỆ'],
    ['THỜI KHÓA BIỂU - LỚP 1/8'],
    ['Năm học 2026 - 2027 (Thực hiện từ 05/09/2026)'],
    ['GVCN: Lê Thị Minh Thanh — Số điện thoại: 0775.526.778'],
    [],
    ['TIẾT', 'THỜI GIAN', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU'],
    ['BUỔI SÁNG'],
  ];

  const getSub = (dayIdx: number, session: 'morning' | 'afternoon', pNum: number) => {
    const day = schedule.find((s) => s.dayIndex === dayIdx);
    if (!day) return '';
    const periods = session === 'morning' ? day.morningPeriods : day.afternoonPeriods;
    const p = periods.find((item) => item.periodNumber === pNum);
    if (!p) return '';
    return p.teacher ? `${p.subjectName} (${p.teacher})` : p.subjectName;
  };

  // Morning 1 & 2
  matrixData.push(['Tiết 1', '7h30 - 8h15', getSub(1, 'morning', 1), getSub(2, 'morning', 1), getSub(3, 'morning', 1), getSub(4, 'morning', 1), getSub(5, 'morning', 1)]);
  matrixData.push(['Tiết 2', '8h20 - 8h55', getSub(1, 'morning', 2), getSub(2, 'morning', 2), getSub(3, 'morning', 2), getSub(4, 'morning', 2), getSub(5, 'morning', 2)]);
  matrixData.push(['RA CHƠI 8H55 – 9H15', '', '', '', '', '', '']);
  matrixData.push(['Tiết 3', '9h15 - 9h50', getSub(1, 'morning', 3), getSub(2, 'morning', 3), getSub(3, 'morning', 3), getSub(4, 'morning', 3), getSub(5, 'morning', 3)]);
  matrixData.push(['Tiết 4', '9h55 - 10h30', getSub(1, 'morning', 4), getSub(2, 'morning', 4), getSub(3, 'morning', 4), getSub(4, 'morning', 4), getSub(5, 'morning', 4)]);

  // Afternoon
  matrixData.push(['BUỔI CHIỀU']);
  matrixData.push(['Tiết 1', '14h10 - 14h55', getSub(1, 'afternoon', 1), getSub(2, 'afternoon', 1), getSub(3, 'afternoon', 1), getSub(4, 'afternoon', 1), getSub(5, 'afternoon', 1)]);
  matrixData.push(['Tiết 2', '15h00 - 15h35', getSub(1, 'afternoon', 2), getSub(2, 'afternoon', 2), getSub(3, 'afternoon', 2), getSub(4, 'afternoon', 2), getSub(5, 'afternoon', 2)]);
  matrixData.push(['RA CHƠI 15H35 – 15H55', '', '', '', '', '', '']);
  matrixData.push(['Tiết 3', '15h55 - 16h30', getSub(1, 'afternoon', 3), getSub(2, 'afternoon', 3), getSub(3, 'afternoon', 3), getSub(4, 'afternoon', 3), getSub(5, 'afternoon', 3)]);

  matrixData.push([]);
  matrixData.push(['LƯU Ý:']);
  matrixData.push(['- Vào lớp lúc 7h30, ra về 16h30, riêng sáng Thứ Tư, Thứ Năm, Thứ Sáu vào lớp lúc 8h00']);
  matrixData.push(['- Mặc đồng phục thể dục vào Thứ Ba, Thứ Năm (các ngày có tiết Thể dục)']);
  matrixData.push(['- Tiết in nghiêng là của giáo viên bộ môn (các tiết còn lại của GVCN)']);
  matrixData.push(['- TC là tăng cường, HĐTN là Hoạt động trải nghiệm, TNXH là Tự nhiên xã hội, GDTC là Giáo dục thể chất, CC là Chào cờ, SHL là Sinh hoạt lớp.']);
  matrixData.push(['Chăm ngoan, học giỏi – Mỗi ngày một niềm vui!']);

  const ws = XLSX.utils.aoa_to_sheet(matrixData);
  ws['!cols'] = [{ wch: 16 }, { wch: 16 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }];

  XLSX.utils.book_append_sheet(wb, ws, 'ThoiKhoaBieu_Lop1_8');
  XLSX.writeFile(wb, `Thoi_Khoa_Bieu_Lop_1_8_${childName.replace(/\s+/g, '_')}.xlsx`);
}
