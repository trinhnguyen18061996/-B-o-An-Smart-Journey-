import { GradeLevel } from '../types';

export interface GradeCurriculumInfo {
  level: GradeLevel;
  gradeNumber: number;
  titleVi: string;
  titleEn: string;
  ageRange: string;
  badgeEmoji: string;
  description: string;
  mathFocus: string;
  vietnameseFocus: string;
  englishFocus: string;
}

export const GRADE_CURRICULUM_INFO: Record<GradeLevel, GradeCurriculumInfo> = {
  grade_1: {
    level: 'grade_1',
    gradeNumber: 1,
    titleVi: 'Lớp 1 Khởi Đầu',
    titleEn: 'Grade 1 Foundation',
    ageRange: '6 - 7 tuổi',
    badgeEmoji: '🌱',
    description: 'Nền tảng phép tính trong phạm vi 20, bảng chữ cái âm vần, tiếng Anh trực quan sinh động.',
    mathFocus: 'Cộng trừ phạm vi 20, so sánh số, đếm hình tròn/vuông/tam giác',
    vietnameseFocus: 'Bảng chữ cái, dấu thanh, ghép vần cơ bản, câu đố đồ vật con vật',
    englishFocus: 'Phonics bảng chữ cái, màu sắc, con vật, chào hỏi đơn giản',
  },
  grade_2: {
    level: 'grade_2',
    gradeNumber: 2,
    titleVi: 'Lớp 2 Khám Phá',
    titleEn: 'Grade 2 Explorer',
    ageRange: '7 - 8 tuổi',
    badgeEmoji: '🚀',
    description: 'Cộng trừ có nhớ trong phạm vi 100, bảng nhân 2 & 5, từ chỉ sự vật hoạt động, tiếng Anh chủ đề gia đình & lớp học.',
    mathFocus: 'Cộng trừ trong phạm vi 100, bảng nhân 2 & 5, bảng chia 2 & 5, khối hình trụ & khối lập phương',
    vietnameseFocus: 'Từ chỉ sự vật, hoạt động, đặc điểm; phân biệt chính tả l/n, s/x, ch/tr; ghép câu kể',
    englishFocus: 'Đồ dùng học tập, gia đình, bộ phận cơ thể, mẫu câu This is my..., số đếm đến 20',
  },
  grade_3: {
    level: 'grade_3',
    gradeNumber: 3,
    titleVi: 'Lớp 3 Bứt Phá',
    titleEn: 'Grade 3 Challenger',
    ageRange: '8 - 9 tuổi',
    badgeEmoji: '⭐',
    description: 'Bảng cửu chương toàn diện từ 2 đến 9, chu vi hình khối, biện pháp so sánh & nhân hóa, phản xạ giao tiếp tiếng Anh.',
    mathFocus: 'Bảng cửu chương nhân chia 2 - 9, tính nhẩm với số tròn trăm tròn nghìn, chu vi hình chữ nhật & hình vuông',
    vietnameseFocus: 'Biện pháp nghệ thuật So sánh & Nhân hóa; nhận diện Danh từ, Động từ, Tính từ; dấu hai chấm & ngoặc kép',
    englishFocus: 'Hoạt động hằng ngày, nghề nghiệp, thì hiện tại đơn & tiếp diễn, hỏi giờ và chỉ đường',
  },
  grade_4: {
    level: 'grade_4',
    gradeNumber: 4,
    titleVi: 'Lớp 4 Mở Rộng',
    titleEn: 'Grade 4 Expansion',
    ageRange: '9 - 10 tuổi',
    badgeEmoji: '💡',
    description: 'Phép tính với số có nhiều chữ số, phân số, văn miêu tả, câu kể Ai làm gì/Ai thế nào/Ai là gì, thì quá khứ tiếng Anh.',
    mathFocus: 'Số có nhiều chữ số, 4 phép tính với số lớn, khái niệm và cộng trừ phân số, tìm 2 số khi biết tổng & hiệu',
    vietnameseFocus: 'Danh từ chung & riêng, mở rộng vốn từ Nhân hậu & Dũng cảm, câu kể và câu hỏi, thành ngữ tục ngữ Việt Nam',
    englishFocus: 'Khoa học, địa lý, thì quá khứ đơn (Past Simple), tính từ so sánh hơn/nhất, Wh- questions',
  },
  grade_5: {
    level: 'grade_5',
    gradeNumber: 5,
    titleVi: 'Lớp 5 Hoàn Thiện',
    titleEn: 'Grade 5 Mastery',
    ageRange: '10 - 11 tuổi',
    badgeEmoji: '🎓',
    description: 'Số thập phân, tỉ số phần trăm, toán chuyển động đều, từ đồng nghĩa & câu ghép, thảo luận tiếng Anh tương lai.',
    mathFocus: 'Cộng trừ nhân chia số thập phân, tỉ số %, chu vi & diện tích hình tròn, thể tích hình hộp, vận tốc v = s : t',
    vietnameseFocus: 'Từ đồng nghĩa, trái nghĩa, đồng âm; Cặp quan hệ từ (Vì... nên, Tuy... nhưng); Luyện viết câu ghép; Mở rộng vốn từ Hòa bình',
    englishFocus: 'Bảo vệ môi trường, công nghệ, tương lai với will & be going to, câu điều kiện, đọc hiểu đoạn văn',
  },
};

// Speed Math Questions By Grade
export interface GradeSpeedMathItem {
  id: string;
  expression: string;
  result: number;
  options: number[];
  gradeLevel: GradeLevel;
  hint: string;
}

export const GRADE_SPEED_MATH: Record<GradeLevel, GradeSpeedMathItem[]> = {
  grade_1: [
    { id: 'm1_1', expression: '6 + 4', result: 10, options: [9, 10, 11, 12], gradeLevel: 'grade_1', hint: 'Bé đếm tiếp từ 6 thêm 4 ngón tay nữa nhé!' },
    { id: 'm1_2', expression: '8 + 5', result: 13, options: [12, 13, 14, 15], gradeLevel: 'grade_1', hint: '8 + 2 = 10, rồi cộng thêm 3.' },
    { id: 'm1_3', expression: '12 - 4', result: 8, options: [7, 8, 9, 10], gradeLevel: 'grade_1', hint: '12 bớt đi 4 còn mấy?' },
    { id: 'm1_4', expression: '9 + 6', result: 15, options: [14, 15, 16, 17], gradeLevel: 'grade_1', hint: 'Tách 6 thành 1 và 5: 9 + 1 = 10, 10 + 5 = 15.' },
    { id: 'm1_5', expression: '15 - 7', result: 8, options: [6, 7, 8, 9], gradeLevel: 'grade_1', hint: '15 - 5 = 10, 10 - 2 = 8.' },
    { id: 'm1_6', expression: '7 + 7', result: 14, options: [13, 14, 15, 16], gradeLevel: 'grade_1', hint: 'Hai số 7 giống nhau cộng lại.' },
    { id: 'm1_7', expression: '16 - 9', result: 7, options: [6, 7, 8, 9], gradeLevel: 'grade_1', hint: '16 bớt đi 9.' },
    { id: 'm1_8', expression: '10 + 8', result: 18, options: [17, 18, 19, 20], gradeLevel: 'grade_1', hint: 'Một chục và tám đơn vị là mười tám.' },
  ],
  grade_2: [
    { id: 'm2_1', expression: '36 + 28', result: 64, options: [54, 62, 64, 74], gradeLevel: 'grade_2', hint: '6 + 8 = 14 (nhớ 1), 3 + 2 + 1 = 6.' },
    { id: 'm2_2', expression: '75 - 38', result: 37, options: [35, 37, 43, 47], gradeLevel: 'grade_2', hint: '15 - 8 = 7, 7 - 3 - 1 = 3.' },
    { id: 'm2_3', expression: '2 × 8', result: 16, options: [14, 16, 18, 20], gradeLevel: 'grade_2', hint: 'Hai nhân tám bằng mười sáu (bảng nhân 2).' },
    { id: 'm2_4', expression: '5 × 7', result: 35, options: [30, 35, 40, 45], gradeLevel: 'grade_2', hint: 'Năm nhân bảy bằng ba mươi lăm.' },
    { id: 'm2_5', expression: '45 : 5', result: 9, options: [7, 8, 9, 10], gradeLevel: 'grade_2', hint: 'Mấy nhân 5 bằng 45?' },
    { id: 'm2_6', expression: '18 : 2', result: 9, options: [8, 9, 10, 12], gradeLevel: 'grade_2', hint: 'Chia đều 18 cho 2 phần.' },
    { id: 'm2_7', expression: '47 + 36', result: 83, options: [73, 81, 83, 85], gradeLevel: 'grade_2', hint: '7 + 6 = 13 (nhớ 1), 4 + 3 + 1 = 8.' },
    { id: 'm2_8', expression: '90 - 45', result: 45, options: [35, 45, 55, 65], gradeLevel: 'grade_2', hint: '90 bớt đi 45 là còn một nửa!' },
  ],
  grade_3: [
    { id: 'm3_1', expression: '7 × 8', result: 56, options: [48, 54, 56, 64], gradeLevel: 'grade_3', hint: 'Bảng nhân 7: 7 nhân 8 bằng 56.' },
    { id: 'm3_2', expression: '63 : 9', result: 7, options: [6, 7, 8, 9], gradeLevel: 'grade_3', hint: '9 × 7 = 63 nên 63 : 9 = 7.' },
    { id: 'm3_3', expression: '9 × 9', result: 81, options: [72, 81, 89, 90], gradeLevel: 'grade_3', hint: 'Chín nhân chín bằng tám mốt.' },
    { id: 'm3_4', expression: '48 : 6', result: 8, options: [6, 7, 8, 9], gradeLevel: 'grade_3', hint: '6 × 8 = 48.' },
    { id: 'm3_5', expression: '250 + 170', result: 420, options: [320, 410, 420, 430], gradeLevel: 'grade_3', hint: '25 chục cộng 17 chục = 42 chục = 420.' },
    { id: 'm3_6', expression: '600 - 240', result: 360, options: [340, 360, 380, 460], gradeLevel: 'grade_3', hint: '60 chục trừ 24 chục = 36 chục = 360.' },
    { id: 'm3_7', expression: '8 × 6 + 12', result: 60, options: [56, 58, 60, 62], gradeLevel: 'grade_3', hint: '8 × 6 = 48, lấy 48 + 12 = 60.' },
    { id: 'm3_8', expression: '72 : 8 × 5', result: 45, options: [35, 40, 45, 50], gradeLevel: 'grade_3', hint: '72 : 8 = 9, sau đó lấy 9 × 5 = 45.' },
  ],
  grade_4: [
    { id: 'm4_1', expression: '125 × 4', result: 500, options: [400, 450, 500, 600], gradeLevel: 'grade_4', hint: '125 × 2 = 250, nhân tiếp 2 là 500.' },
    { id: 'm4_2', expression: '3600 : 9', result: 400, options: [300, 400, 450, 500], gradeLevel: 'grade_4', hint: '36 : 9 = 4, thêm hai chữ số 0 là 400.' },
    { id: 'm4_3', expression: '1500 + 2750', result: 4250, options: [4150, 4250, 4350, 4500], gradeLevel: 'grade_4', hint: 'Cộng hàng nghìn và hàng trăm.' },
    { id: 'm4_4', expression: '5000 - 1350', result: 3650, options: [3550, 3650, 3750, 3850], gradeLevel: 'grade_4', hint: 'Trừ từng hàng từ phải sang trái.' },
    { id: 'm4_5', expression: '24 × 25', result: 600, options: [500, 550, 600, 650], gradeLevel: 'grade_4', hint: 'Mẹo: 24 = 6 × 4, 4 × 25 = 100 => 6 × 100 = 600.' },
    { id: 'm4_6', expression: '4800 : 60', result: 80, options: [60, 70, 80, 90], gradeLevel: 'grade_4', hint: 'Rút gọn số 0: 480 : 6 = 80.' },
    { id: 'm4_7', expression: '3/7 + 2/7 (Tử số bằng mấy?)', result: 5, options: [4, 5, 6, 7], gradeLevel: 'grade_4', hint: 'Cộng hai phân số cùng mẫu: giữ nguyên mẫu số, cộng tử số 3 + 2 = 5.' },
    { id: 'm4_8', expression: '4/5 - 1/5 (Tử số bằng mấy?)', result: 3, options: [2, 3, 4, 5], gradeLevel: 'grade_4', hint: 'Trừ tử số: 4 - 1 = 3.' },
  ],
  grade_5: [
    { id: 'm5_1', expression: '3.5 + 4.8', result: 8.3, options: [7.3, 8.2, 8.3, 8.5], gradeLevel: 'grade_5', hint: 'Đặt dấu phẩy thẳng cột: 5 + 8 = 13 (nhớ 1), 3 + 4 + 1 = 8.' },
    { id: 'm5_2', expression: '9.4 - 3.7', result: 5.7, options: [5.6, 5.7, 5.8, 6.7], gradeLevel: 'grade_5', hint: '14 - 7 = 7, 9 - 3 - 1 = 5.' },
    { id: 'm5_3', expression: '2.5 × 4', result: 10, options: [8, 9, 10, 12], gradeLevel: 'grade_5', hint: '2.5 × 2 = 5, 5 × 2 = 10.' },
    { id: 'm5_4', expression: '18.6 : 3', result: 6.2, options: [5.2, 6.1, 6.2, 6.4], gradeLevel: 'grade_5', hint: '18 : 3 = 6, 6 : 3 = 2 => 6.2.' },
    { id: 'm5_5', expression: '20% của 150', result: 30, options: [25, 30, 35, 40], gradeLevel: 'grade_5', hint: '150 × 20 : 100 = 30.' },
    { id: 'm5_6', expression: '50% của 84', result: 42, options: [38, 40, 42, 44], gradeLevel: 'grade_5', hint: '50% tức là lấy một nửa: 84 : 2 = 42.' },
    { id: 'm5_7', expression: '0.75 × 100', result: 75, options: [7.5, 75, 750, 7500], gradeLevel: 'grade_5', hint: 'Nhân với 100, chuyển dấu phẩy sang phải 2 chữ số.' },
    { id: 'm5_8', expression: '4.2 : 10', result: 0.42, options: [0.042, 0.42, 4.2, 42], gradeLevel: 'grade_5', hint: 'Chia cho 10, chuyển dấu phẩy sang trái 1 chữ số.' },
  ],
};

// Comparison Questions By Grade
export interface GradeComparisonItem {
  id: string;
  leftText: string;
  leftValue: number;
  rightText: string;
  rightValue: number;
  correctSymbol: '>' | '<' | '=';
  gradeLevel: GradeLevel;
  explanation: string;
}

export const GRADE_COMPARISONS: Record<GradeLevel, GradeComparisonItem[]> = {
  grade_1: [
    { id: 'c1_1', leftText: '8', leftValue: 8, rightText: '12', rightValue: 12, correctSymbol: '<', gradeLevel: 'grade_1', explanation: '8 bé hơn 12.' },
    { id: 'c1_2', leftText: '7 + 5', leftValue: 12, rightText: '11', rightValue: 11, correctSymbol: '>', gradeLevel: 'grade_1', explanation: '7 + 5 = 12, mà 12 > 11.' },
    { id: 'c1_3', leftText: '9 + 4', leftValue: 13, rightText: '13', rightValue: 13, correctSymbol: '=', gradeLevel: 'grade_1', explanation: '9 + 4 = 13, hai bên bằng nhau.' },
    { id: 'c1_4', leftText: '15 - 6', leftValue: 9, rightText: '10', rightValue: 10, correctSymbol: '<', gradeLevel: 'grade_1', explanation: '15 - 6 = 9, mà 9 < 10.' },
  ],
  grade_2: [
    { id: 'c2_1', leftText: '35 + 15', leftValue: 50, rightText: '5 × 10', rightValue: 50, correctSymbol: '=', gradeLevel: 'grade_2', explanation: '35 + 15 = 50, và 5 × 10 = 50. Hai vế bằng nhau!' },
    { id: 'c2_2', leftText: '5 × 6', leftValue: 30, rightText: '2 × 14', rightValue: 28, correctSymbol: '>', gradeLevel: 'grade_2', explanation: '5 × 6 = 30, 2 × 14 = 28. Vậy 30 > 28.' },
    { id: 'c2_3', leftText: '84 - 29', leftValue: 55, rightText: '60', rightValue: 60, correctSymbol: '<', gradeLevel: 'grade_2', explanation: '84 - 29 = 55, mà 55 < 60.' },
    { id: 'c2_4', leftText: '2 × 9', leftValue: 18, rightText: '5 × 4 - 2', rightValue: 18, correctSymbol: '=', gradeLevel: 'grade_2', explanation: 'Cả hai vế đều có kết quả là 18!' },
  ],
  grade_3: [
    { id: 'c3_1', leftText: '7 × 8', leftValue: 56, rightText: '9 × 6', rightValue: 54, correctSymbol: '>', gradeLevel: 'grade_3', explanation: '7 × 8 = 56, 9 × 6 = 54. 56 > 54.' },
    { id: 'c3_2', leftText: '63 : 7', leftValue: 9, rightText: '72 : 8', rightValue: 9, correctSymbol: '=', gradeLevel: 'grade_3', explanation: 'Cả hai vế đều bằng 9.' },
    { id: 'c3_3', leftText: '8 × 8', leftValue: 64, rightText: '65', rightValue: 65, correctSymbol: '<', gradeLevel: 'grade_3', explanation: '8 × 8 = 64, mà 64 < 65.' },
    { id: 'c3_4', leftText: '400 + 250', leftValue: 650, rightText: '900 - 240', rightValue: 660, correctSymbol: '<', gradeLevel: 'grade_3', explanation: '650 bé hơn 660.' },
  ],
  grade_4: [
    { id: 'c4_1', leftText: '125 × 8', leftValue: 1000, rightText: '500 × 2', rightValue: 1000, correctSymbol: '=', gradeLevel: 'grade_4', explanation: 'Cả hai vế đều cho kết quả là 1000 tròn đẹp!' },
    { id: 'c4_2', leftText: '3/5', leftValue: 3, rightText: '4/5', rightValue: 4, correctSymbol: '<', gradeLevel: 'grade_4', explanation: 'Cùng mẫu số 5, phân số nào có tử số bé hơn thì bé hơn: 3/5 < 4/5.' },
    { id: 'c4_3', leftText: '45000 + 15000', leftValue: 60000, rightText: '80000 - 25000', rightValue: 55000, correctSymbol: '>', gradeLevel: 'grade_4', explanation: '60,000 lớn hơn 55,000.' },
    { id: 'c4_4', leftText: '7/7', leftValue: 1, rightText: '1', rightValue: 1, correctSymbol: '=', gradeLevel: 'grade_4', explanation: '7/7 chính là 1 đơn vị.' },
  ],
  grade_5: [
    { id: 'c5_1', leftText: '3.75', leftValue: 3.75, rightText: '3.8', rightValue: 3.8, correctSymbol: '<', gradeLevel: 'grade_5', explanation: 'So sánh phần mười: 7 bé hơn 8 nên 3.75 < 3.8 (tức 3.80).' },
    { id: 'c5_2', leftText: '0.5', leftValue: 0.5, rightText: '1/2', rightValue: 0.5, correctSymbol: '=', gradeLevel: 'grade_5', explanation: '1 chia 2 bằng 0.5, hai số hoàn toàn bằng nhau.' },
    { id: 'c5_3', leftText: '25% của 200', leftValue: 50, rightText: '60', rightValue: 60, correctSymbol: '<', gradeLevel: 'grade_5', explanation: '25% của 200 là 50, mà 50 < 60.' },
    { id: 'c5_4', leftText: '4.2 × 10', leftValue: 42, rightText: '420 : 10', rightValue: 42, correctSymbol: '=', gradeLevel: 'grade_5', explanation: '4.2 × 10 = 42, 420 : 10 = 42.' },
  ],
};

// Vietnamese Grade Lessons & Quizzes
export interface GradeVietnameseQuizItem {
  id: string;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  badge: string;
  gradeLevel: GradeLevel;
}

export const GRADE_VIETNAMESE_QUIZ: Record<GradeLevel, GradeVietnameseQuizItem[]> = {
  grade_1: [
    {
      id: 'vn1_1',
      title: 'Phân biệt vần',
      question: 'Từ nào sau đây có tiếng chứa vần "oa"?',
      options: ['Bông hoa 🌸', 'Quả chuối 🍌', 'Con cá 🐟', 'Mặt trời ☀️'],
      correctIndex: 0,
      explanation: 'Tiếng "hoa" trong "bông hoa" có vần "oa".',
      badge: 'Vần OA',
      gradeLevel: 'grade_1',
    },
    {
      id: 'vn1_2',
      title: 'Chính tả C / K',
      question: 'Điền chữ thích hợp: "...on mèo và cây ...em"',
      options: ['c / k', 'k / c', 'c / c', 'k / k'],
      correctIndex: 0,
      explanation: 'Quy tắc chính tả: K đứng trước e, ê, i (cây kem). C đứng trước các âm còn lại (con mèo).',
      badge: 'Chính tả C/K',
      gradeLevel: 'grade_1',
    },
    {
      id: 'vn1_3',
      title: 'Đố vui con vật',
      question: 'Con gì mào đỏ gáy ò ó o, đánh thức mọi người dậy sớm?',
      options: ['Con gà trống 🐓', 'Con mèo 🐱', 'Con vịt 🦆', 'Con lợn 🐷'],
      correctIndex: 0,
      explanation: 'Chú gà trống gáy ò ó o mỗi sớm mai.',
      badge: 'Đố vui',
      gradeLevel: 'grade_1',
    },
  ],
  grade_2: [
    {
      id: 'vn2_1',
      title: 'Từ chỉ sự vật',
      question: 'Trong câu: "Chú chim hót líu lo trên cành cây bàng", từ nào là từ chỉ sự vật?',
      options: ['Chú chim, cành cây bàng', 'Hót', 'Líu lo', 'Trên'],
      correctIndex: 0,
      explanation: '"Chú chim" (con vật) và "cành cây bàng" (cây cối) là các từ chỉ sự vật.',
      badge: 'Từ chỉ sự vật',
      gradeLevel: 'grade_2',
    },
    {
      id: 'vn2_2',
      title: 'Chính tả L / N',
      question: 'Từ nào sau đây viết đúng chính tả?',
      options: ['Lúa nếp', 'Núa nếp', 'Lúa lếp', 'Núa lếp'],
      correctIndex: 0,
      explanation: '"Lúa nếp" (lúa âm L, nếp âm N). "Lúa nếp là lúa nếp làng"!',
      badge: 'Chính tả L/N',
      gradeLevel: 'grade_2',
    },
    {
      id: 'vn2_3',
      title: 'Tục ngữ Việt Nam',
      question: 'Chọn từ điền vào chỗ trống: "Uống nước nhớ ......"',
      options: ['nguồn', 'sông', 'biển', 'suối'],
      correctIndex: 0,
      explanation: 'Câu tục ngữ "Uống nước nhớ nguồn" dạy ta lòng biết ơn cội nguồn, tổ tiên.',
      badge: 'Tục ngữ',
      gradeLevel: 'grade_2',
    },
  ],
  grade_3: [
    {
      id: 'vn3_1',
      title: 'Biện pháp so sánh',
      question: 'Câu nào sau đây có sử dụng hình ảnh so sánh?',
      options: ['Trẻ em như búp trên cành.', 'Mùa xuân ấm áp đã về.', 'Em yêu ngôi trường của em.', 'Bầu trời đêm nay nhiều sao.'],
      correctIndex: 0,
      explanation: 'Hình ảnh: "Trẻ em" được so sánh với "búp trên cành" qua từ so sánh "như".',
      badge: 'So sánh',
      gradeLevel: 'grade_3',
    },
    {
      id: 'vn3_2',
      title: 'Biện pháp nhân hóa',
      question: 'Câu nào sau đây sử dụng biện pháp nhân hóa?',
      options: ['Bác đồng hồ cần mẫn gõ nhịp tích tắc suốt đêm ngày.', 'Chiếc đồng hồ có ba cái kim.', 'Đồng hồ treo trên tường phòng khách.', 'Mặt đồng hồ tròn xoe.'],
      correctIndex: 0,
      explanation: 'Đồng hồ được gọi là "Bác" và có phẩm chất "cần mẫn" như con người.',
      badge: 'Nhân hóa',
      gradeLevel: 'grade_3',
    },
    {
      id: 'vn3_3',
      title: 'Từ loại: Động từ',
      question: 'Tìm động từ trong các từ sau:',
      options: ['Chạy nhảy', 'Bàn ghế', 'Xinh đẹp', 'Hiền lành'],
      correctIndex: 0,
      explanation: '"Chạy nhảy" là từ chỉ hoạt động, hành động nên là Động từ.',
      badge: 'Từ loại',
      gradeLevel: 'grade_3',
    },
  ],
  grade_4: [
    {
      id: 'vn4_1',
      title: 'Danh từ riêng',
      question: 'Từ nào sau đây là Danh từ riêng và phải viết hoa?',
      options: ['Đà Nẵng', 'Dòng sông', 'Ngọn núi', 'Thành phố'],
      correctIndex: 0,
      explanation: '"Đà Nẵng" là tên riêng của một thành phố tươi đẹp của Việt Nam nên phải viết hoa.',
      badge: 'Danh từ riêng',
      gradeLevel: 'grade_4',
    },
    {
      id: 'vn4_2',
      title: 'Kiểu câu kể',
      question: 'Câu: "Bạn Nam là một học sinh chăm chỉ, gương mẫu." thuộc kiểu câu kể nào?',
      options: ['Ai là gì?', 'Ai làm gì?', 'Ai thế nào?', 'Câu cầu khiến'],
      correctIndex: 0,
      explanation: 'Câu dùng từ "là" để giới thiệu và nhận định về bạn Nam, thuộc mẫu câu "Ai là gì?".',
      badge: 'Câu kể Ai là gì',
      gradeLevel: 'grade_4',
    },
    {
      id: 'vn4_3',
      title: 'Thành ngữ chủ điểm',
      question: 'Thành ngữ nào dưới đây ca ngợi tinh thần đoàn kết của nhân dân ta?',
      options: ['Đồng cam cộng khổ', 'Lá lành đùm lá rách', 'Kề vai sát cánh', 'Cả 3 thành ngữ trên'],
      correctIndex: 3,
      explanation: 'Cả 3 thành ngữ trên đều ca ngợi tinh thần đoàn kết, sẻ chia yêu thương của người Việt Nam.',
      badge: 'Thành ngữ',
      gradeLevel: 'grade_4',
    },
  ],
  grade_5: [
    {
      id: 'vn5_1',
      title: 'Từ đồng nghĩa',
      question: 'Nhóm từ nào dưới đây là các từ đồng nghĩa hoàn toàn?',
      options: ['Mẹ, má, bu, u', 'Chăm chỉ, lười biếng', 'Bao la, chật hẹp', 'Cao lớn, nhỏ bé'],
      correctIndex: 0,
      explanation: '"Mẹ, má, bu, u" đều chỉ người mẹ thân yêu theo từng vùng miền khác nhau của Việt Nam.',
      badge: 'Từ đồng nghĩa',
      gradeLevel: 'grade_5',
    },
    {
      id: 'vn5_2',
      title: 'Quan hệ từ & Cặp từ',
      question: 'Cặp từ nào thích hợp điền vào: "... bạn An nỗ lực ôn tập ... bạn đã đạt kết quả xuất sắc."',
      options: ['Vì ... nên ...', 'Tuy ... nhưng ...', 'Dù ... nhưng ...', 'Không những ... mà ...'],
      correctIndex: 0,
      explanation: 'Cặp quan hệ từ "Vì ... nên ..." biểu thị quan hệ Nguyên nhân - Kết quả rất chặt chẽ.',
      badge: 'Cặp từ quan hệ',
      gradeLevel: 'grade_5',
    },
    {
      id: 'vn5_3',
      title: 'Câu ghép',
      question: 'Câu nào dưới đây là một câu ghép gồm 2 vế câu hoàn chỉnh?',
      options: [
        'Mặt trời vừa mọc, chim chóc đã cất tiếng hót líu lo.',
        'Mặt trời mọc trên đỉnh núi xa.',
        'Đàn chim chóc bay lượn trên bầu trời xanh ngát.',
        'Buổi sáng mùa thu tuyệt đẹp.',
      ],
      correctIndex: 0,
      explanation: 'Vế 1: "Mặt trời vừa mọc" (CN1: Mặt trời, VN1: vừa mọc). Vế 2: "chim chóc đã cất tiếng hót" (CN2: chim chóc, VN2: đã cất tiếng hót).',
      badge: 'Câu ghép',
      gradeLevel: 'grade_5',
    },
  ],
};

// English Grade Vocabulary & Questions
export interface GradeEnglishItem {
  id: string;
  word: string;
  meaningVi: string;
  phonetic: string;
  emoji: string;
  exampleEn: string;
  exampleVi: string;
  gradeLevel: GradeLevel;
}

export const GRADE_ENGLISH_VOCAB: Record<GradeLevel, GradeEnglishItem[]> = {
  grade_1: [
    { id: 'en1_1', word: 'Apple', meaningVi: 'Quả táo', phonetic: '/ˈæpl/', emoji: '🍎', exampleEn: 'I eat a red apple.', exampleVi: 'Bé ăn một quả táo đỏ.', gradeLevel: 'grade_1' },
    { id: 'en1_2', word: 'Cat', meaningVi: 'Con mèo', phonetic: '/kæt/', emoji: '🐱', exampleEn: 'The cat is cute.', exampleVi: 'Chú mèo thật dễ thương.', gradeLevel: 'grade_1' },
    { id: 'en1_3', word: 'Sun', meaningVi: 'Mặt trời', phonetic: '/sʌn/', emoji: '☀️', exampleEn: 'The sun is yellow.', exampleVi: 'Mặt trời màu vàng ấm áp.', gradeLevel: 'grade_1' },
    { id: 'en1_4', word: 'Book', meaningVi: 'Cuốn sách', phonetic: '/bʊk/', emoji: '📘', exampleEn: 'Open your book.', exampleVi: 'Hãy mở cuốn sách của bạn ra.', gradeLevel: 'grade_1' },
    { id: 'en1_5', word: 'Dog', meaningVi: 'Chú chó', phonetic: '/dɒɡ/', emoji: '🐶', exampleEn: 'The dog wags its tail.', exampleVi: 'Chú cún vẫy đuôi mừng.', gradeLevel: 'grade_1' },
  ],
  grade_2: [
    { id: 'en2_1', word: 'Pencil', meaningVi: 'Bút chì', phonetic: '/ˈpensl/', emoji: '✏️', exampleEn: 'This is my pencil.', exampleVi: 'Đây là cây bút chì của tớ.', gradeLevel: 'grade_2' },
    { id: 'en2_2', word: 'Family', meaningVi: 'Gia đình', phonetic: '/ˈfæməli/', emoji: '👨‍👩‍👧‍👦', exampleEn: 'I love my happy family.', exampleVi: 'Tớ yêu gia đình hạnh phúc của mình.', gradeLevel: 'grade_2' },
    { id: 'en2_3', word: 'School', meaningVi: 'Trường học', phonetic: '/skuːl/', emoji: '🏫', exampleEn: 'We go to school together.', exampleVi: 'Chúng mình cùng nhau đến trường.', gradeLevel: 'grade_2' },
    { id: 'en2_4', word: 'Teacher', meaningVi: 'Thầy cô giáo', phonetic: '/ˈtiːtʃə(r)/', emoji: '👩‍🏫', exampleEn: 'Our teacher is very kind.', exampleVi: 'Cô giáo của chúng em rất hiền.', gradeLevel: 'grade_2' },
    { id: 'en2_5', word: 'Friend', meaningVi: 'Người bạn', phonetic: '/frend/', emoji: '🤝', exampleEn: 'He is my best friend.', exampleVi: 'Cậu ấy là người bạn thân nhất của tớ.', gradeLevel: 'grade_2' },
  ],
  grade_3: [
    { id: 'en3_1', word: 'Library', meaningVi: 'Thư viện', phonetic: '/ˈlaɪbrəri/', emoji: '📚', exampleEn: 'We read books in the library.', exampleVi: 'Chúng em đọc sách trong thư viện.', gradeLevel: 'grade_3' },
    { id: 'en3_2', word: 'Swimming', meaningVi: 'Bơi lội', phonetic: '/ˈswɪmɪŋ/', emoji: '🏊', exampleEn: 'She goes swimming on Sundays.', exampleVi: 'Bạn ấy đi bơi vào mỗi Chủ Nhật.', gradeLevel: 'grade_3' },
    { id: 'en3_3', word: 'Breakfast', meaningVi: 'Bữa sáng', phonetic: '/ˈbrekfəst/', emoji: '🍳', exampleEn: 'Eat a healthy breakfast.', exampleVi: 'Hãy ăn một bữa sáng bổ dưỡng.', gradeLevel: 'grade_3' },
    { id: 'en3_4', word: 'Scientist', meaningVi: 'Nhà khoa học', phonetic: '/ˈsaɪəntɪst/', emoji: '🔬', exampleEn: 'I want to be a scientist.', exampleVi: 'Tớ muốn trở thành một nhà khoa học.', gradeLevel: 'grade_3' },
    { id: 'en3_5', word: 'Clock', meaningVi: 'Đồng hồ', phonetic: '/klɒk/', emoji: '⏰', exampleEn: 'Look at the clock on the wall.', exampleVi: 'Hãy nhìn chiếc đồng hồ trên tường.', gradeLevel: 'grade_3' },
  ],
  grade_4: [
    { id: 'en4_1', word: 'Dolphin', meaningVi: 'Cá heo thông minh', phonetic: '/ˈdɒlfɪn/', emoji: '🐬', exampleEn: 'Dolphins are smart and friendly.', exampleVi: 'Cá heo rất thông minh và thân thiện.', gradeLevel: 'grade_4' },
    { id: 'en4_2', word: 'Mountain', meaningVi: 'Ngọn núi hùng vĩ', phonetic: '/ˈmaʊntən/', emoji: '⛰️', exampleEn: 'Mount Fansipan is very high.', exampleVi: 'Đỉnh Fansipan rất cao.', gradeLevel: 'grade_4' },
    { id: 'en4_3', word: 'Experiment', meaningVi: 'Thí nghiệm khoa học', phonetic: '/ɪkˈsperɪmənt/', emoji: '🧪', exampleEn: 'We did an exciting science experiment.', exampleVi: 'Chúng em đã làm một thí nghiệm khoa học thú vị.', gradeLevel: 'grade_4' },
    { id: 'en4_4', word: 'Faster', meaningVi: 'Nhanh hơn (So sánh)', phonetic: '/ˈfɑːstə(r)/', emoji: '🐆', exampleEn: 'A cheetah runs faster than a horse.', exampleVi: 'Báo gê-pa chạy nhanh hơn ngựa.', gradeLevel: 'grade_4' },
    { id: 'en4_5', word: 'Yesterday', meaningVi: 'Ngày hôm qua', phonetic: '/ˈjestədeɪ/', emoji: '📅', exampleEn: 'Yesterday, we visited the museum.', exampleVi: 'Hôm qua, chúng tớ đã thăm viện bảo tàng.', gradeLevel: 'grade_4' },
  ],
  grade_5: [
    { id: 'en5_1', word: 'Environment', meaningVi: 'Môi trường sống', phonetic: '/ɪnˈvaɪrənmənt/', emoji: '🌍', exampleEn: 'Protect our clean green environment.', exampleVi: 'Hãy bảo vệ môi trường xanh sạch đẹp.', gradeLevel: 'grade_5' },
    { id: 'en5_2', word: 'Astronaut', meaningVi: 'Phi hành gia vũ trụ', phonetic: '/ˈæstrənɔːt/', emoji: '👨‍🚀', exampleEn: 'Astronauts travel into outer space.', exampleVi: 'Các phi hành gia bay vào không gian.', gradeLevel: 'grade_5' },
    { id: 'en5_3', word: 'Solar energy', meaningVi: 'Năng lượng mặt trời', phonetic: '/ˈsəʊlə ˈenədʒi/', emoji: '☀️⚡', exampleEn: 'Solar energy is renewable and clean.', exampleVi: 'Năng lượng mặt trời có thể tái tạo và rất sạch.', gradeLevel: 'grade_5' },
    { id: 'en5_4', word: 'Recycle', meaningVi: 'Tái chế rác thải', phonetic: '/ˌriːˈsaɪkl/', emoji: '♻️', exampleEn: 'We should recycle paper and plastic.', exampleVi: 'Chúng ta nên tái chế giấy và đồ nhựa.', gradeLevel: 'grade_5' },
    { id: 'en5_5', word: 'Future', meaningVi: 'Tương lai tươi sáng', phonetic: '/ˈfjuːtʃə(r)/', emoji: '✨', exampleEn: 'Studying hard builds a bright future.', exampleVi: 'Chăm chỉ học tập sẽ xây dựng một tương lai tươi sáng.', gradeLevel: 'grade_5' },
  ],
};

// English Grade Quizzes
export interface GradeEnglishQuizItem {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  gradeLevel: GradeLevel;
}

export const GRADE_ENGLISH_QUIZ: Record<GradeLevel, GradeEnglishQuizItem[]> = {
  grade_1: [
    {
      id: 'enq1_1',
      topic: 'Colors & Nature',
      question: 'What color is the sun ☀️?',
      options: ['It is Yellow', 'It is Blue', 'It is Green', 'It is Black'],
      correctIndex: 0,
      explanation: 'The sun is yellow and bright! (Mặt trời có màu vàng tươi sáng!)',
      gradeLevel: 'grade_1',
    },
    {
      id: 'enq1_2',
      topic: 'Animals',
      question: 'Which animal says "Meow meow"? 🐱',
      options: ['A dog', 'A cat', 'A duck', 'A fish'],
      correctIndex: 1,
      explanation: 'A cat says "Meow meow". (Chú mèo kêu meo meo).',
      gradeLevel: 'grade_1',
    },
    {
      id: 'enq1_3',
      topic: 'Greetings',
      question: 'How do you say hello in the morning?',
      options: ['Good night!', 'Good morning!', 'Goodbye!', 'Good evening!'],
      correctIndex: 1,
      explanation: 'Good morning means "Chào buổi sáng!"',
      gradeLevel: 'grade_1',
    },
  ],
  grade_2: [
    {
      id: 'enq2_1',
      topic: 'School Objects',
      question: 'Complete the sentence: "This is a ______ ✏️ to write."',
      options: ['pencil', 'chair', 'apple', 'window'],
      correctIndex: 0,
      explanation: 'Pencil is a tool used for writing. (Cây bút chì dùng để viết chữ).',
      gradeLevel: 'grade_2',
    },
    {
      id: 'enq2_2',
      topic: 'Family Members',
      question: 'My mother and father are my ______ 👨‍👩‍👧‍👦.',
      options: ['friends', 'teachers', 'parents', 'doctors'],
      correctIndex: 2,
      explanation: 'Mother + Father = Parents (Bố và Mẹ là phụ huynh/ba mẹ).',
      gradeLevel: 'grade_2',
    },
    {
      id: 'enq2_3',
      topic: 'Plural Nouns',
      question: 'Look! There are three ______ 🍎🍎🍎 on the desk.',
      options: ['apple', 'apples', 'an apple', 'appling'],
      correctIndex: 1,
      explanation: 'With number 3 (plural), we add -s: three apples.',
      gradeLevel: 'grade_2',
    },
  ],
  grade_3: [
    {
      id: 'enq3_1',
      topic: 'Daily Routines',
      question: 'Peter ______ to school by bicycle every morning.',
      options: ['go', 'goes', 'going', 'went'],
      correctIndex: 1,
      explanation: 'With singular subject "Peter" in the present simple, verb takes -es: goes.',
      gradeLevel: 'grade_3',
    },
    {
      id: 'enq3_2',
      topic: 'Telling Time',
      question: 'Look at the clock: ⏰ 07:30. What time is it?',
      options: ["It's seven thirty", "It's seven o'clock", "It's eight thirty", "It's six forty"],
      correctIndex: 0,
      explanation: '07:30 is "seven thirty" or "half past seven" (7 giờ 30 phút).',
      gradeLevel: 'grade_3',
    },
    {
      id: 'enq3_3',
      topic: 'Prepositions of Place',
      question: 'The school library has many books ______ the shelves.',
      options: ['on', 'under', 'at', 'with'],
      correctIndex: 0,
      explanation: 'We say "on the shelves" (trên kệ/giá sách).',
      gradeLevel: 'grade_3',
    },
  ],
  grade_4: [
    {
      id: 'enq4_1',
      topic: 'Comparative Adjectives',
      question: 'A cheetah 🐆 runs ______ than a turtle 🐢.',
      options: ['faster', 'fast', 'fastest', 'more fast'],
      correctIndex: 0,
      explanation: 'Short adjective comparative: fast + -er = faster (nhanh hơn).',
      gradeLevel: 'grade_4',
    },
    {
      id: 'enq4_2',
      topic: 'Past Simple Tense',
      question: 'Yesterday, our class ______ the science museum.',
      options: ['visit', 'visited', 'visits', 'visiting'],
      correctIndex: 1,
      explanation: 'With "yesterday" (hôm qua), we use the past tense: visited.',
      gradeLevel: 'grade_4',
    },
    {
      id: 'enq4_3',
      topic: 'Professions',
      question: 'A person who flies airplanes ✈️ into the sky is a ______.',
      options: ['pilot', 'farmer', 'cook', 'singer'],
      correctIndex: 0,
      explanation: 'A pilot flies aircraft. (Phi công lái máy bay).',
      gradeLevel: 'grade_4',
    },
  ],
  grade_5: [
    {
      id: 'enq5_1',
      topic: 'Environmental Science',
      question: 'We should ______ ♻️ plastic bottles to protect the Earth.',
      options: ['recycle', 'throw', 'burn', 'waste'],
      correctIndex: 0,
      explanation: 'Recycle means to process materials into new products to protect the environment (Tái chế rác thải).',
      gradeLevel: 'grade_5',
    },
    {
      id: 'enq5_2',
      topic: 'Future Conditional',
      question: 'If you study hard and practice daily, you ______ succeed in the exam.',
      options: ['will', 'was', 'did', 'are'],
      correctIndex: 0,
      explanation: 'First conditional sentence: If + Present Simple, S + will + V_base.',
      gradeLevel: 'grade_5',
    },
    {
      id: 'enq5_3',
      topic: 'Outer Space',
      question: 'Astronauts 👨‍🚀 travel aboard spaceships to explore outer ______.',
      options: ['space', 'ocean', 'forest', 'city'],
      correctIndex: 0,
      explanation: 'Outer space is the expanse that exists beyond Earth and between celestial bodies (Vũ trụ không gian).',
      gradeLevel: 'grade_5',
    },
  ],
};

// Helper to query AI Tutor
export async function askAITutorApi(question: string, gradeLevel: GradeLevel, subject: string, childName?: string): Promise<string> {
  try {
    const res = await fetch('/api/ai/ask-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, gradeLevel, subject, childName }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.answer) {
        return data.answer;
      }
    }
  } catch (e) {
    console.warn('AI Tutor fetch error, using local fallback:', e);
  }

  const info = GRADE_CURRICULUM_INFO[gradeLevel] || GRADE_CURRICULUM_INFO.grade_1;
  return `Chào ${childName || 'bé cưng'}! Thầy/Cô gia sư AI luôn ở bên con. Về câu hỏi "${question}", ở chương trình ${info.titleVi}, con hãy đọc kỹ từng dữ kiện đề bài, giải từng bước một và tự tin nhé! Con là một học sinh rất xuất sắc! ⭐`;
}

// Helper to query dynamic AI question
export interface AIQuestionData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export async function generateAIQuestionApi(subject: 'math' | 'vietnamese' | 'english', gradeLevel: GradeLevel, topic?: string, childName?: string): Promise<AIQuestionData> {
  try {
    const res = await fetch('/api/ai/generate-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, gradeLevel, topic, childName }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.question) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn('AI Question fetch error, using local fallback:', e);
  }

  // Fallback to rich curriculum items
  if (subject === 'math') {
    const questions = GRADE_SPEED_MATH[gradeLevel] || GRADE_SPEED_MATH.grade_1;
    const q = questions[Math.floor(Math.random() * questions.length)];
    return {
      question: `Tính kết quả của phép tính: ${q.expression} = ?`,
      options: q.options.map(String),
      correctIndex: q.options.indexOf(q.result) >= 0 ? q.options.indexOf(q.result) : 0,
      explanation: `Kết quả đúng là ${q.result}. ${q.hint}`,
      hint: q.hint,
    };
  } else if (subject === 'vietnamese') {
    const questions = GRADE_VIETNAMESE_QUIZ[gradeLevel] || GRADE_VIETNAMESE_QUIZ.grade_1;
    const q = questions[Math.floor(Math.random() * questions.length)];
    return {
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      hint: `Gợi ý liên quan đến chủ điểm ${q.badge}`,
    };
  } else {
    const vocabs = GRADE_ENGLISH_VOCAB[gradeLevel] || GRADE_ENGLISH_VOCAB.grade_1;
    const v = vocabs[Math.floor(Math.random() * vocabs.length)];
    const otherWords = vocabs.filter((w) => w.id !== v.id).map((w) => w.meaningVi);
    const options = [v.meaningVi, ...otherWords.slice(0, 3)].sort(() => 0.5 - Math.random());
    return {
      question: `What does the word "${v.word}" ${v.emoji} mean in Vietnamese?`,
      options,
      correctIndex: options.indexOf(v.meaningVi),
      explanation: `"${v.word}" nghĩa là "${v.meaningVi}". Ví dụ: ${v.exampleEn} (${v.exampleVi})`,
      hint: `Phiên âm: ${v.phonetic}`,
    };
  }
}
