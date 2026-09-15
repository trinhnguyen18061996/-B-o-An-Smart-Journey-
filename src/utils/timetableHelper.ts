import * as XLSX from 'xlsx';
import { SchoolDaySchedule, SchoolPeriod } from '../types';

export interface SubjectMeta {
  name: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export const DEFAULT_SCHOOL_TIMETABLE: SchoolDaySchedule[] = [
  {
    dayIndex: 1,
    dayNameVi: 'Thứ Hai',
    dayNameEn: 'Monday',
    morningPeriods: [
      { periodNumber: 1, session: 'morning', time: '07:30 - 08:05', subjectName: 'Chào cờ', note: 'Mặc đồng phục chỉnh tề' },
      { periodNumber: 2, session: 'morning', time: '08:15 - 08:50', subjectName: 'Tiếng Việt', note: 'Tập đọc bài mới' },
      { periodNumber: 3, session: 'morning', time: '09:05 - 09:40', subjectName: 'Tiếng Việt', note: 'Luyện viết chữ đẹp' },
      { periodNumber: 4, session: 'morning', time: '09:50 - 10:25', subjectName: 'Toán', note: 'Phép tính cộng trừ' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '14:00 - 14:35', subjectName: 'Hoạt động trải nghiệm', note: 'Sinh hoạt đầu tuần' },
      { periodNumber: 2, session: 'afternoon', time: '14:45 - 15:20', subjectName: 'Giáo dục thể chất', note: 'Mang giày bata thể thao' },
      { periodNumber: 3, session: 'afternoon', time: '15:30 - 16:05', subjectName: 'Tự học có hướng dẫn', note: 'Hoàn thành bài tập' },
    ],
    notes: 'Bé nhớ mặc đồng phục trường và mang mũ cờ đỏ đầu tuần nhé!',
  },
  {
    dayIndex: 2,
    dayNameVi: 'Thứ Ba',
    dayNameEn: 'Tuesday',
    morningPeriods: [
      { periodNumber: 1, session: 'morning', time: '07:30 - 08:05', subjectName: 'Toán', note: 'Luyện tập toán' },
      { periodNumber: 2, session: 'morning', time: '08:15 - 08:50', subjectName: 'Tiếng Việt', note: 'Luyện từ và câu' },
      { periodNumber: 3, session: 'morning', time: '09:05 - 09:40', subjectName: 'Tiếng Việt', note: 'Tập viết chữ hoa' },
      { periodNumber: 4, session: 'morning', time: '09:50 - 10:25', subjectName: 'Đạo đức', note: 'Bài học lễ phép' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '14:00 - 14:35', subjectName: 'Tiếng Anh', note: 'Từ vựng chủ đề gia đình' },
      { periodNumber: 2, session: 'afternoon', time: '14:45 - 15:20', subjectName: 'Tiếng Anh', note: 'Luyện nghe phản xạ' },
      { periodNumber: 3, session: 'afternoon', time: '15:30 - 16:05', subjectName: 'Mỹ thuật', note: 'Mang hộp màu sáp và giấy vẽ' },
    ],
    notes: 'Hôm nay có môn Mỹ thuật, bé nhớ kiểm tra hộp sáp màu nhé.',
  },
  {
    dayIndex: 3,
    dayNameVi: 'Thứ Tư',
    dayNameEn: 'Wednesday',
    morningPeriods: [
      { periodNumber: 1, session: 'morning', time: '07:30 - 08:05', subjectName: 'Tiếng Việt', note: 'Tập đọc và trả lời câu hỏi' },
      { periodNumber: 2, session: 'morning', time: '08:15 - 08:50', subjectName: 'Tiếng Việt', note: 'Chính tả nghe viết' },
      { periodNumber: 3, session: 'morning', time: '09:05 - 09:40', subjectName: 'Toán', note: 'Hình học và đo lường' },
      { periodNumber: 4, session: 'morning', time: '09:50 - 10:25', subjectName: 'Tự nhiên & Xã hội', note: 'Khám phá thế giới quanh ta' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '14:00 - 14:35', subjectName: 'Âm nhạc', note: 'Hát và vỗ tay theo nhịp' },
      { periodNumber: 2, session: 'afternoon', time: '14:45 - 15:20', subjectName: 'Giáo dục thể chất', note: 'Trò chơi vận động' },
      { periodNumber: 3, session: 'afternoon', time: '15:30 - 16:05', subjectName: 'Đọc sách thư viện', note: 'Đọc truyện tranh bổ ích' },
    ],
    notes: 'Giữ gìn sách thư viện cẩn thận khi đọc nhé bé!',
  },
  {
    dayIndex: 4,
    dayNameVi: 'Thứ Năm',
    dayNameEn: 'Thursday',
    morningPeriods: [
      { periodNumber: 1, session: 'morning', time: '07:30 - 08:05', subjectName: 'Toán', note: 'Giải bài toán có lời văn' },
      { periodNumber: 2, session: 'morning', time: '08:15 - 08:50', subjectName: 'Tiếng Việt', note: 'Kể chuyện theo tranh' },
      { periodNumber: 3, session: 'morning', time: '09:05 - 09:40', subjectName: 'Tiếng Việt', note: 'Ôn tập từ vựng' },
      { periodNumber: 4, session: 'morning', time: '09:50 - 10:25', subjectName: 'Tiếng Anh', note: 'Học bài hát tiếng Anh' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '14:00 - 14:35', subjectName: 'Tin học & Công nghệ', note: 'Làm quen máy tính' },
      { periodNumber: 2, session: 'afternoon', time: '14:45 - 15:20', subjectName: 'Tự nhiên & Xã hội', note: 'Cây cối và con vật' },
      { periodNumber: 3, session: 'afternoon', time: '15:30 - 16:05', subjectName: 'Kỹ năng sống', note: 'Bảo vệ bản thân an toàn' },
    ],
    notes: 'Chuẩn bị đầy đủ vở bài tập Toán và Tiếng Việt.',
  },
  {
    dayIndex: 5,
    dayNameVi: 'Thứ Sáu',
    dayNameEn: 'Friday',
    morningPeriods: [
      { periodNumber: 1, session: 'morning', time: '07:30 - 08:05', subjectName: 'Tiếng Việt', note: 'Kiểm tra đọc hiểu tuần' },
      { periodNumber: 2, session: 'morning', time: '08:15 - 08:50', subjectName: 'Toán', note: 'Ôn tập toán tuần' },
      { periodNumber: 3, session: 'morning', time: '09:05 - 09:40', subjectName: 'Tiếng Anh', note: 'Trò chơi từ vựng' },
      { periodNumber: 4, session: 'morning', time: '09:50 - 10:25', subjectName: 'Sinh hoạt lớp', note: 'Bình bầu hoa điểm tốt & khen thưởng' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '14:00 - 14:35', subjectName: 'Mỹ thuật / Thủ công', note: 'Gấp giấy hoa lá' },
      { periodNumber: 2, session: 'afternoon', time: '14:45 - 15:20', subjectName: 'Hoạt động trải nghiệm', note: 'Giao lưu cuối tuần' },
      { periodNumber: 3, session: 'afternoon', time: '15:30 - 16:05', subjectName: 'Dọn dẹp góc học tập', note: 'Sắp xếp ngăn nắp cặp sách' },
    ],
    notes: 'Tổng kết tuần học, nhận sao khen thưởng cuối tuần cùng cô giáo!',
  },
  {
    dayIndex: 6,
    dayNameVi: 'Thứ Bảy',
    dayNameEn: 'Saturday',
    morningPeriods: [
      { periodNumber: 1, session: 'morning', time: '08:00 - 09:00', subjectName: 'Câu lạc bộ bơi lội / Năng khiếu', note: 'Rèn luyện sức khỏe' },
      { periodNumber: 2, session: 'morning', time: '09:15 - 10:15', subjectName: 'Vui học tiếng Anh giao tiếp', note: 'Trò chơi tập thể' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '15:00 - 16:30', subjectName: 'Dã ngoại cùng gia đình', note: 'Công viên hoặc khu vui chơi' },
    ],
    notes: 'Ngày nghỉ cuối tuần vui vẻ, nạp năng lượng cùng gia đình!',
  },
  {
    dayIndex: 0,
    dayNameVi: 'Chủ Nhật',
    dayNameEn: 'Sunday',
    morningPeriods: [
      { periodNumber: 1, session: 'morning', time: '08:30 - 09:30', subjectName: 'Đọc truyện tranh & Vẽ tự do', note: 'Thư giãn sáng chủ nhật' },
    ],
    afternoonPeriods: [
      { periodNumber: 1, session: 'afternoon', time: '16:00 - 17:00', subjectName: 'Soạn sách vở cho tuần mới', note: 'Kiểm tra thời khóa biểu thứ Hai' },
    ],
    notes: 'Bé nhớ soạn sẵn sách vở cho thứ Hai nhé!',
  },
];

export function getSubjectMeta(subjectName: string): SubjectMeta {
  const norm = (subjectName || '').toLowerCase().trim();

  if (norm.includes('chào cờ') || norm.includes('sinh hoạt dưới cờ')) {
    return { name: subjectName, icon: '🚩', colorClass: 'text-red-700', bgClass: 'bg-red-50', borderClass: 'border-red-200' };
  }
  if (norm.includes('tiếng việt') || norm.includes('tập đọc') || norm.includes('chính tả') || norm.includes('tập viết') || norm.includes('văn')) {
    return { name: subjectName, icon: '🔤', colorClass: 'text-rose-700', bgClass: 'bg-rose-50', borderClass: 'border-rose-200' };
  }
  if (norm.includes('toán') || norm.includes('số học') || norm.includes('hình học') || norm.includes('math')) {
    return { name: subjectName, icon: '🔢', colorClass: 'text-sky-700', bgClass: 'bg-sky-50', borderClass: 'border-sky-200' };
  }
  if (norm.includes('tiếng anh') || norm.includes('ngoại ngữ') || norm.includes('english')) {
    return { name: subjectName, icon: '🇬🇧', colorClass: 'text-emerald-700', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200' };
  }
  if (norm.includes('mỹ thuật') || norm.includes('vẽ') || norm.includes('thủ công') || norm.includes('art')) {
    return { name: subjectName, icon: '🎨', colorClass: 'text-purple-700', bgClass: 'bg-purple-50', borderClass: 'border-purple-200' };
  }
  if (norm.includes('âm nhạc') || norm.includes('hát') || norm.includes('nhạc') || norm.includes('music')) {
    return { name: subjectName, icon: '🎵', colorClass: 'text-pink-700', bgClass: 'bg-pink-50', borderClass: 'border-pink-200' };
  }
  if (norm.includes('thể dục') || norm.includes('thể chất') || norm.includes('gdtc') || norm.includes('bơi')) {
    return { name: subjectName, icon: '🏃', colorClass: 'text-orange-700', bgClass: 'bg-orange-50', borderClass: 'border-orange-200' };
  }
  if (norm.includes('đạo đức') || norm.includes('lễ phép') || norm.includes('ethics')) {
    return { name: subjectName, icon: '🕊️', colorClass: 'text-teal-700', bgClass: 'bg-teal-50', borderClass: 'border-teal-200' };
  }
  if (norm.includes('tự nhiên') || norm.includes('xã hội') || norm.includes('tn&xh') || norm.includes('tnxh') || norm.includes('khoa học')) {
    return { name: subjectName, icon: '🌿', colorClass: 'text-lime-800', bgClass: 'bg-lime-50', borderClass: 'border-lime-200' };
  }
  if (norm.includes('trải nghiệm') || norm.includes('hđtn') || norm.includes('kỹ năng')) {
    return { name: subjectName, icon: '🌟', colorClass: 'text-amber-800', bgClass: 'bg-amber-50', borderClass: 'border-amber-200' };
  }
  if (norm.includes('sinh hoạt lớp') || norm.includes('shl') || norm.includes('tổng kết') || norm.includes('khen thưởng')) {
    return { name: subjectName, icon: '🏆', colorClass: 'text-yellow-800', bgClass: 'bg-yellow-50', borderClass: 'border-yellow-200' };
  }
  if (norm.includes('tin học') || norm.includes('máy tính') || norm.includes('công nghệ') || norm.includes('it')) {
    return { name: subjectName, icon: '💻', colorClass: 'text-cyan-800', bgClass: 'bg-cyan-50', borderClass: 'border-cyan-200' };
  }
  if (norm.includes('đọc') || norm.includes('thư viện') || norm.includes('truyện') || norm.includes('tự học')) {
    return { name: subjectName, icon: '📖', colorClass: 'text-indigo-800', bgClass: 'bg-indigo-50', borderClass: 'border-indigo-200' };
  }
  if (norm.includes('nghỉ') || norm.includes('ăn trưa') || norm.includes('bán trú') || norm.includes('ngủ trưa')) {
    return { name: subjectName, icon: '🍱', colorClass: 'text-slate-700', bgClass: 'bg-slate-100', borderClass: 'border-slate-200' };
  }

  // Fallback default
  return { name: subjectName, icon: '📚', colorClass: 'text-blue-700', bgClass: 'bg-blue-50', borderClass: 'border-blue-200' };
}

/**
 * Import Timetable from an Excel (.xlsx, .xls) or CSV file.
 * Handles both:
 * 1. Matrix Format (Columns: Tiết, Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu)
 * 2. Row/List Format (Columns: Thứ, Buổi, Tiết, Môn Học, Ghi Chú)
 */
export async function parseTimetableFile(file: File): Promise<SchoolDaySchedule[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  // Get first worksheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  if (!worksheet) {
    throw new Error('Tệp không có dữ liệu bảng tính!');
  }

  const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  if (!rawRows || rawRows.length === 0) {
    throw new Error('Bảng tính trống!');
  }

  // Initialize schedule template for 7 days
  const dayMap: { [dayIndex: number]: SchoolDaySchedule } = {
    1: { dayIndex: 1, dayNameVi: 'Thứ Hai', dayNameEn: 'Monday', morningPeriods: [], afternoonPeriods: [] },
    2: { dayIndex: 2, dayNameVi: 'Thứ Ba', dayNameEn: 'Tuesday', morningPeriods: [], afternoonPeriods: [] },
    3: { dayIndex: 3, dayNameVi: 'Thứ Tư', dayNameEn: 'Wednesday', morningPeriods: [], afternoonPeriods: [] },
    4: { dayIndex: 4, dayNameVi: 'Thứ Năm', dayNameEn: 'Thursday', morningPeriods: [], afternoonPeriods: [] },
    5: { dayIndex: 5, dayNameVi: 'Thứ Sáu', dayNameEn: 'Friday', morningPeriods: [], afternoonPeriods: [] },
    6: { dayIndex: 6, dayNameVi: 'Thứ Bảy', dayNameEn: 'Saturday', morningPeriods: [], afternoonPeriods: [] },
    0: { dayIndex: 0, dayNameVi: 'Chủ Nhật', dayNameEn: 'Sunday', morningPeriods: [], afternoonPeriods: [] },
  };

  // Detect Format: Check header row
  let headerRowIdx = -1;
  let dayColumnMap: { [colIdx: number]: number } = {}; // colIdx -> dayIndex
  let isMatrixFormat = false;

  for (let r = 0; r < Math.min(10, rawRows.length); r++) {
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
      isMatrixFormat = true;
      break;
    }
  }

  if (isMatrixFormat && headerRowIdx >= 0) {
    // MATRIX FORMAT
    let currentSession: 'morning' | 'afternoon' = 'morning';
    let morningCounter = 1;
    let afternoonCounter = 1;

    for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!row || row.length === 0) continue;

      const firstCell = String(row[0] || '').toLowerCase().trim();
      const secondCell = String(row[1] || '').toLowerCase().trim();
      const combinedRowStr = row.join(' ').toLowerCase();

      // Check if session divider row (e.g. "Buổi chiều", "Chiều", "Sau giờ nghỉ trưa")
      if (combinedRowStr.includes('chiều') || combinedRowStr.includes('afternoon') || combinedRowStr.includes('buổi chiều')) {
        currentSession = 'afternoon';
      } else if (combinedRowStr.includes('sáng') || combinedRowStr.includes('morning') || combinedRowStr.includes('buổi sáng')) {
        currentSession = 'morning';
      }

      // Check period number from first or second cell
      let periodNum = 0;
      const numMatch = (firstCell + ' ' + secondCell).match(/(?:tiết\s*)?(\d+)/i);
      if (numMatch) {
        periodNum = parseInt(numMatch[1], 10);
      } else {
        periodNum = currentSession === 'morning' ? morningCounter : afternoonCounter;
      }

      // If period > 4 or 5 and still in morning, might switch to afternoon
      if (currentSession === 'morning' && periodNum > 5) {
        currentSession = 'afternoon';
        periodNum = periodNum - 5;
      }

      // For each day column, extract subject
      let hasDataInRow = false;
      Object.entries(dayColumnMap).forEach(([colStr, dayIdx]) => {
        const col = parseInt(colStr, 10);
        const cellVal = String(row[col] || '').trim();
        if (cellVal && cellVal !== '-' && cellVal !== '0') {
          hasDataInRow = true;
          const period: SchoolPeriod = {
            periodNumber: periodNum || (currentSession === 'morning' ? morningCounter : afternoonCounter),
            session: currentSession,
            subjectName: cellVal,
          };
          if (currentSession === 'morning') {
            dayMap[dayIdx].morningPeriods.push(period);
          } else {
            dayMap[dayIdx].afternoonPeriods.push(period);
          }
        }
      });

      if (hasDataInRow) {
        if (currentSession === 'morning') morningCounter++;
        else afternoonCounter++;
      }
    }
  } else {
    // ROW / LIST FORMAT: e.g. Thứ, Buổi, Tiết, Môn Học, Ghi Chú
    // Look for headers
    let dayCol = 0;
    let sessionCol = 1;
    let periodCol = 2;
    let subjectCol = 3;
    let noteCol = 4;

    const firstRow = rawRows[0].map((c) => String(c).toLowerCase());
    firstRow.forEach((c, idx) => {
      if (c.includes('thứ') || c.includes('ngày') || c.includes('day')) dayCol = idx;
      else if (c.includes('buổi') || c.includes('session')) sessionCol = idx;
      else if (c.includes('tiết') || c.includes('period')) periodCol = idx;
      else if (c.includes('môn') || c.includes('subject')) subjectCol = idx;
      else if (c.includes('ghi chú') || c.includes('note')) noteCol = idx;
    });

    const startR = rawRows[0].some((c) => String(c).toLowerCase().includes('môn') || String(c).toLowerCase().includes('thứ')) ? 1 : 0;

    for (let r = startR; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!row || row.length === 0) continue;

      const dayStr = String(row[dayCol] || '').toLowerCase().trim();
      const subjectStr = String(row[subjectCol] || row[2] || '').trim();
      if (!subjectStr) continue;

      let dayIdx = 1;
      if (dayStr.includes('2') || dayStr.includes('hai')) dayIdx = 1;
      else if (dayStr.includes('3') || dayStr.includes('ba')) dayIdx = 2;
      else if (dayStr.includes('4') || dayStr.includes('tư')) dayIdx = 3;
      else if (dayStr.includes('5') || dayStr.includes('năm')) dayIdx = 4;
      else if (dayStr.includes('6') || dayStr.includes('sáu')) dayIdx = 5;
      else if (dayStr.includes('7') || dayStr.includes('bảy')) dayIdx = 6;
      else if (dayStr.includes('chủ nhật') || dayStr.includes('cn')) dayIdx = 0;

      const sessionStr = String(row[sessionCol] || '').toLowerCase();
      const session: 'morning' | 'afternoon' = sessionStr.includes('chiều') || sessionStr.includes('afternoon') ? 'afternoon' : 'morning';

      const periodNum = parseInt(String(row[periodCol] || '').replace(/\D/g, ''), 10) || 1;
      const note = String(row[noteCol] || '').trim() || undefined;

      const period: SchoolPeriod = {
        periodNumber: periodNum,
        session,
        subjectName: subjectStr,
        note,
      };

      if (session === 'morning') {
        dayMap[dayIdx].morningPeriods.push(period);
      } else {
        dayMap[dayIdx].afternoonPeriods.push(period);
      }
    }
  }

  // Filter and order days: Thứ Hai (1) -> Thứ Sáu (5), Thứ Bảy (6), CN (0)
  const result: SchoolDaySchedule[] = [1, 2, 3, 4, 5, 6, 0]
    .map((idx) => dayMap[idx])
    .filter((d) => d.morningPeriods.length > 0 || d.afternoonPeriods.length > 0);

  if (result.length === 0) {
    throw new Error('Không trích xuất được môn học nào từ tệp. Vui lòng tải và sử dụng tệp Excel mẫu để chuẩn hóa dữ liệu.');
  }

  return result;
}

/**
 * Export School Timetable as standard formatted Excel (.xlsx) file
 */
export function exportTimetableToExcel(schedule: SchoolDaySchedule[], childName: string = 'bé Gạo') {
  const wb = XLSX.utils.book_new();

  // Create Matrix sheet (standard Vietnamese timetable grid)
  const matrixData: any[][] = [
    [`THỜI KHÓA BIỂU HỌC Ở TRƯỜNG - ${childName.toUpperCase()}`],
    ['Cập nhật từ ứng dụng Bảo An – Smart Journey'],
    [],
    ['Buổi', 'Tiết', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
  ];

  // Helper to find subject in day
  const getSub = (dayIdx: number, session: 'morning' | 'afternoon', pNum: number) => {
    const day = schedule.find((s) => s.dayIndex === dayIdx);
    if (!day) return '';
    const periods = session === 'morning' ? day.morningPeriods : day.afternoonPeriods;
    const p = periods.find((item) => item.periodNumber === pNum);
    return p ? p.subjectName : '';
  };

  // Morning Periods 1-4
  for (let p = 1; p <= 4; p++) {
    matrixData.push([
      p === 1 ? 'SÁNG' : '',
      `Tiết ${p}`,
      getSub(1, 'morning', p) || 'Toán',
      getSub(2, 'morning', p) || 'Tiếng Việt',
      getSub(3, 'morning', p) || 'Tiếng Việt',
      getSub(4, 'morning', p) || 'Toán',
      getSub(5, 'morning', p) || 'Tiếng Anh',
      getSub(6, 'morning', p) || '',
    ]);
  }

  // Afternoon Periods 1-3
  for (let p = 1; p <= 3; p++) {
    matrixData.push([
      p === 1 ? 'CHIỀU' : '',
      `Tiết ${p}`,
      getSub(1, 'afternoon', p) || 'Mỹ thuật',
      getSub(2, 'afternoon', p) || 'Tiếng Anh',
      getSub(3, 'afternoon', p) || 'Âm nhạc',
      getSub(4, 'afternoon', p) || 'Tin học',
      getSub(5, 'afternoon', p) || 'HĐTN',
      getSub(6, 'afternoon', p) || '',
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(matrixData);

  // Set column widths
  ws['!cols'] = [
    { wch: 12 }, // Buổi
    { wch: 10 }, // Tiết
    { wch: 20 }, // Thứ Hai
    { wch: 20 }, // Thứ Ba
    { wch: 20 }, // Thứ Tư
    { wch: 20 }, // Thứ Năm
    { wch: 20 }, // Thứ Sáu
    { wch: 20 }, // Thứ Bảy
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'ThoiKhoaBieu');

  // Also create a simple List sheet for easy editing
  const listData: any[][] = [
    ['Thứ', 'Buổi', 'Tiết', 'Môn Học', 'Ghi Chú'],
  ];

  schedule.forEach((day) => {
    day.morningPeriods.forEach((p) => {
      listData.push([day.dayNameVi, 'Sáng', p.periodNumber, p.subjectName, p.note || '']);
    });
    day.afternoonPeriods.forEach((p) => {
      listData.push([day.dayNameVi, 'Chiều', p.periodNumber, p.subjectName, p.note || '']);
    });
  });

  const wsList = XLSX.utils.aoa_to_sheet(listData);
  wsList['!cols'] = [{ wch: 14 }, { wch: 10 }, { wch: 8 }, { wch: 25 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsList, 'DanhSachTietHoc');

  // Trigger download
  XLSX.writeFile(wb, `Thoi_Khoa_Bieu_${childName.replace(/\s+/g, '_')}.xlsx`);
}
