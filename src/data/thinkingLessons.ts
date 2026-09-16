// Rich Thinking & Logic Lessons for Math, Vietnamese, and English
// Grounded in Olympiad (TIMO, HKIMO, SASMO), Singapore Math, and Logic Puzzles

export interface SubstitutionQuestion {
  id: string;
  category: 'so-sanh-thay-the';
  grade: 'preschool' | 'primary';
  questionVi: string;
  questionEn: string;
  equations: {
    line1: string; // e.g. "🍊 + 2 = 9"
    line2?: string; // e.g. "🍇 = 4"
    line3?: string; // e.g. "🍊 + 🍇 = 🍓"
    targetLine: string; // e.g. "🍓 = ?"
  };
  options: {
    label: 'A' | 'B' | 'C' | 'D';
    value: number;
    textEn: string;
  }[];
  correctAnswer: number;
  hintVi: string;
  hintEn: string;
  explanationVi: string;
  explanationEn: string;
}

export interface BalanceQuestion {
  id: string;
  titleVi: string;
  titleEn: string;
  leftPan: { item: string; count: number; label: string };
  rightPan: { item: string; count: number; label: string; extraItem?: string; extraCount?: number };
  questionVi: string;
  questionEn: string;
  options: { id: string; text: string; value: number }[];
  correctValue: number;
  explanation: string;
}

export interface PatternQuestion {
  id: string;
  titleVi: string;
  titleEn: string;
  sequence: string[]; // e.g. ["🔵", "🔺", "🟢", "🔵", "🔺", "🟢", "🔵", "🔺", "?"]
  options: string[];
  correctAnswer: string;
  ruleVi: string;
  ruleEn: string;
}

export interface GeometryCountQuestion {
  id: string;
  titleVi: string;
  titleEn: string;
  imageIcon: string;
  descriptionVi: string;
  descriptionEn: string;
  options: number[];
  correctAnswer: number;
  explanationVi: string;
}

export interface OlympicMathQuestion {
  id: string;
  competition: 'TIMO' | 'HKIMO' | 'FMO' | 'SASMO';
  year: string;
  questionVi: string;
  questionEn: string;
  diagram?: string;
  options: { label: string; textVi: string; textEn: string; isCorrect: boolean }[];
  explanationVi: string;
  explanationEn: string;
}

export interface VietnameseRiddleQuestion {
  id: string;
  riddleVi: string;
  hintVi: string;
  options: { text: string; emoji: string; isCorrect: boolean }[];
  explanationVi: string;
}

export interface VietnameseSentenceBuilderQuestion {
  id: string;
  targetSentence: string;
  scrambledWords: string[];
  meaningVi: string;
  imageEmoji: string;
}

export interface VietnameseOddOneOutQuestion {
  id: string;
  titleVi: string;
  items: { word: string; emoji: string; category: string }[];
  oddWord: string;
  reasonVi: string;
}

export interface EnglishMathQuestion {
  id: string;
  topic: string;
  questionEn: string;
  questionVi: string;
  formula?: string;
  options: { textEn: string; textVi: string; isCorrect: boolean }[];
  hintEn: string;
  hintVi: string;
  keyVocabulary: { word: string; pronunciation: string; meaning: string }[];
}

export interface EnglishWordScrambleQuestion {
  id: string;
  wordEn: string;
  scrambledLetters: string[];
  meaningVi: string;
  emoji: string;
  phonetic: string;
  exampleSentence: string;
}

// 1. SO SÁNH VÀ THAY THẾ (SUBSTITUTION LOGIC) - Phù hợp giao diện Ảnh 1
export const SUBSTITUTION_QUESTIONS: SubstitutionQuestion[] = [
  {
    id: 'sub_1',
    category: 'so-sanh-thay-the',
    grade: 'primary',
    questionVi: 'Tìm số còn thiếu.',
    questionEn: 'Find the missing number.',
    equations: {
      line1: '🍊 + 2 = 9',
      line2: '🍇 = 4',
      line3: '🍊 + 🍇 = 🍓',
      targetLine: '🍓 = ?',
    },
    options: [
      { label: 'A', value: 9, textEn: 'Nine' },
      { label: 'B', value: 11, textEn: 'Eleven' },
      { label: 'C', value: 10, textEn: 'Ten' },
      { label: 'D', value: 13, textEn: 'Thirteen' },
    ],
    correctAnswer: 11,
    hintVi: 'Bước 1: Tính xem quả cam 🍊 bằng mấy trước (9 - 2). Bước 2: Lấy cam cộng nho 🍇 để ra dâu tây 🍓.',
    hintEn: 'Step 1: Calculate orange 🍊 (9 - 2). Step 2: Add orange and grape 🍇 to get strawberry 🍓.',
    explanationVi: 'Ta có 🍊 = 9 - 2 = 7. Biết 🍇 = 4, nên 🍓 = 🍊 + 🍇 = 7 + 4 = 11. Đáp án đúng là 11.',
    explanationEn: 'Orange = 9 - 2 = 7. Grape = 4. Strawberry = 7 + 4 = 11. The correct answer is 11.',
  },
  {
    id: 'sub_2',
    category: 'so-sanh-thay-the',
    grade: 'primary',
    questionVi: 'Tìm giá trị của chú gấu bông.',
    questionEn: 'Find the value of the teddy bear.',
    equations: {
      line1: '🍎 + 🍎 = 10',
      line2: '🍌 + 🍎 = 8',
      line3: '🧸 = 🍌 + 🍎',
      targetLine: '🧸 = ?',
    },
    options: [
      { label: 'A', value: 6, textEn: 'Six' },
      { label: 'B', value: 7, textEn: 'Seven' },
      { label: 'C', value: 8, textEn: 'Eight' },
      { label: 'D', value: 12, textEn: 'Twelve' },
    ],
    correctAnswer: 8,
    hintVi: 'Hai quả táo 🍎 giống nhau cộng lại bằng 10, vậy 1 quả táo bằng mấy?',
    hintEn: 'Two identical apples 🍎 add up to 10. What is one apple?',
    explanationVi: 'Hai quả táo bằng 10 nên 🍎 = 5. Có 🍌 + 5 = 8 nên 🍌 = 3. Gấu bông 🧸 = 3 + 5 = 8.',
    explanationEn: 'Apple = 10 / 2 = 5. Banana = 8 - 5 = 3. Teddy bear = 3 + 5 = 8.',
  },
  {
    id: 'sub_3',
    category: 'so-sanh-thay-the',
    grade: 'primary',
    questionVi: 'Tìm số thích hợp thay cho ngôi sao.',
    questionEn: 'Find the number that replaces the star.',
    equations: {
      line1: '🐱 + 🐱 = 6',
      line2: '🐶 - 🐱 = 4',
      line3: '🐶 + 🐱 = ⭐',
      targetLine: '⭐ = ?',
    },
    options: [
      { label: 'A', value: 7, textEn: 'Seven' },
      { label: 'B', value: 8, textEn: 'Eight' },
      { label: 'C', value: 10, textEn: 'Ten' },
      { label: 'D', value: 12, textEn: 'Twelve' },
    ],
    correctAnswer: 10,
    hintVi: 'Tính chú mèo 🐱: 6 : 2 = 3. Chú cún 🐶 trừ đi 3 bằng 4, vậy cún bằng mấy?',
    hintEn: 'Find cat 🐱: 6 / 2 = 3. Dog 🐶 minus 3 equals 4, so dog = 7.',
    explanationVi: 'Mèo 🐱 = 3. Cún 🐶 = 4 + 3 = 7. Ngôi sao ⭐ = 7 + 3 = 10.',
    explanationEn: 'Cat = 3. Dog = 7. Star = 7 + 3 = 10.',
  },
  {
    id: 'sub_4',
    category: 'so-sanh-thay-the',
    grade: 'primary',
    questionVi: 'Tìm số còn thiếu.',
    questionEn: 'Find the missing number.',
    equations: {
      line1: '🥑 + 5 = 12',
      line2: '🍉 = 🥑 + 3',
      line3: '🍉 + 🥑 = 👑',
      targetLine: '👑 = ?',
    },
    options: [
      { label: 'A', value: 15, textEn: 'Fifteen' },
      { label: 'B', value: 17, textEn: 'Seventeen' },
      { label: 'C', value: 19, textEn: 'Nineteen' },
      { label: 'D', value: 14, textEn: 'Fourteen' },
    ],
    correctAnswer: 17,
    hintVi: 'Bơ 🥑 = 12 - 5 = 7. Dưa hấu 🍉 = 7 + 3 = 10. Vương miện 👑 = 10 + 7.',
    hintEn: 'Avocado = 12 - 5 = 7. Watermelon = 7 + 3 = 10. Crown = 10 + 7.',
    explanationVi: '🥑 = 7. 🍉 = 10. 👑 = 10 + 7 = 17.',
    explanationEn: 'Avocado = 7. Watermelon = 10. Crown = 17.',
  },
  {
    id: 'sub_5',
    category: 'so-sanh-thay-the',
    grade: 'primary',
    questionVi: 'Tìm giá trị chiếc xe ô tô.',
    questionEn: 'Find the value of the car.',
    equations: {
      line1: '🚀 = 12',
      line2: '🚀 - 🚗 = 5',
      line3: '🚗 + 🚗 = 🏆',
      targetLine: '🏆 = ?',
    },
    options: [
      { label: 'A', value: 14, textEn: 'Fourteen' },
      { label: 'B', value: 10, textEn: 'Ten' },
      { label: 'C', value: 12, textEn: 'Twelve' },
      { label: 'D', value: 16, textEn: 'Sixteen' },
    ],
    correctAnswer: 14,
    hintVi: 'Tên lửa 🚀 = 12. 12 - Ô tô = 5, vậy ô tô 🚗 = 7.',
    hintEn: 'Rocket = 12. 12 - Car = 5, so car = 7.',
    explanationVi: '🚗 = 12 - 5 = 7. Cúp 🏆 = 7 + 7 = 14.',
    explanationEn: 'Car = 7. Trophy = 7 + 7 = 14.',
  },
];

// 2. TOÁN CÂN BẰNG CƠ BẢN (BALANCE LOGIC ⚖️)
export const BALANCE_QUESTIONS: BalanceQuestion[] = [
  {
    id: 'bal_1',
    titleVi: 'Cân thăng bằng trái cây',
    titleEn: 'Fruit Balance Scale',
    leftPan: { item: '🍎', count: 2, label: '2 quả táo' },
    rightPan: { item: '🍓', count: 6, label: '6 quả dâu' },
    questionVi: 'Hỏi 1 quả táo 🍎 nặng bằng mấy quả dâu tây 🍓?',
    questionEn: 'How many strawberries 🍓 equal 1 apple 🍎?',
    options: [
      { id: 'b1_1', text: '2 quả dâu', value: 2 },
      { id: 'b1_2', text: '3 quả dâu', value: 3 },
      { id: 'b1_3', text: '4 quả dâu', value: 4 },
    ],
    correctValue: 3,
    explanation: '2 quả táo bằng 6 quả dâu, nên 1 quả táo nặng bằng 6 : 2 = 3 quả dâu!',
  },
  {
    id: 'bal_2',
    titleVi: 'Cân thăng bằng gấu và viên bi',
    titleEn: 'Bear and Marbles Balance',
    leftPan: { item: '🧸', count: 1, label: '1 chú gấu + 2 viên bi' },
    rightPan: { item: '🔵', count: 7, label: '7 viên bi' },
    questionVi: 'Bên đĩa trái có 1 chú gấu 🧸 và 2 viên bi 🔵. Bên đĩa phải có 7 viên bi. Hỏi 1 chú gấu nặng bằng mấy viên bi?',
    questionEn: 'Left pan: 1 bear + 2 marbles. Right pan: 7 marbles. How many marbles equal 1 bear?',
    options: [
      { id: 'b2_1', text: '4 viên bi', value: 4 },
      { id: 'b2_2', text: '5 viên bi', value: 5 },
      { id: 'b2_3', text: '6 viên bi', value: 6 },
    ],
    correctValue: 5,
    explanation: 'Bớt ở cả hai bên 2 viên bi: Đĩa trái còn 1 chú gấu, đĩa phải còn 7 - 2 = 5 viên bi!',
  },
  {
    id: 'bal_3',
    titleVi: 'Cân dưa hấu và cam',
    titleEn: 'Watermelon and Orange Balance',
    leftPan: { item: '🍉', count: 1, label: '1 quả dưa hấu' },
    rightPan: { item: '🍊', count: 4, label: '4 quả cam' },
    questionVi: 'Nếu mẹ có 2 quả dưa hấu 🍉, thì đĩa cân bên kia cần bao nhiêu quả cam 🍊 để thăng bằng?',
    questionEn: 'If there are 2 watermelons, how many oranges are needed to balance?',
    options: [
      { id: 'b3_1', text: '6 quả cam', value: 6 },
      { id: 'b3_2', text: '8 quả cam', value: 8 },
      { id: 'b3_3', text: '10 quả cam', value: 10 },
    ],
    correctValue: 8,
    explanation: '1 quả dưa bằng 4 quả cam, nên 2 quả dưa sẽ bằng 4 + 4 = 8 quả cam!',
  },
];

// 3. BÀI TOÁN QUY LUẬT (PATTERNS & SEQUENCES)
export const PATTERN_QUESTIONS: PatternQuestion[] = [
  {
    id: 'pat_1',
    titleVi: 'Quy luật hình học lặp lại',
    titleEn: 'Geometric Repeating Pattern',
    sequence: ['🔵', '🔺', '🟢', '🔵', '🔺', '🟢', '🔵', '🔺', '❓'],
    options: ['🔵', '🔺', '🟢', '⭐'],
    correctAnswer: '🟢',
    ruleVi: 'Quy luật lặp lại theo nhóm 3 hình: Tròn Xanh -> Tam Giác Đỏ -> Tròn Lục.',
    ruleEn: 'Repeating sequence of 3: Blue Circle -> Red Triangle -> Green Circle.',
  },
  {
    id: 'pat_2',
    titleVi: 'Dãy số cách đều cộng 2',
    titleEn: 'Even Step Number Sequence',
    sequence: ['2', '4', '6', '8', '10', '❓'],
    options: ['11', '12', '13', '14'],
    correctAnswer: '12',
    ruleVi: 'Mỗi số đứng sau bằng số đứng trước cộng thêm 2 (dãy số chẵn).',
    ruleEn: 'Add 2 to the previous number.',
  },
  {
    id: 'pat_3',
    titleVi: 'Dãy số cách đều cộng 5',
    titleEn: 'Step by 5 Sequence',
    sequence: ['5', '10', '15', '20', '❓'],
    options: ['22', '24', '25', '30'],
    correctAnswer: '25',
    ruleVi: 'Mỗi số cách nhau 5 đơn vị: 5, 10, 15, 20, tiếp theo là 25!',
    ruleEn: 'Counting by 5: 5, 10, 15, 20, next is 25!',
  },
  {
    id: 'pat_4',
    titleVi: 'Quy luật đối xứng hoa quả',
    titleEn: 'Fruit Symmetry Pattern',
    sequence: ['🍎', '🍌', '🍌', '🍎', '🍎', '🍌', '🍌', '❓'],
    options: ['🍌', '🍎', '🍇', '🍉'],
    correctAnswer: '🍎',
    ruleVi: 'Quy luật 1 Táo -> 2 Chuối -> 2 Táo -> 2 Chuối -> 2 Táo.',
    ruleEn: 'Pattern of alternating counts.',
  },
];

// 4. HÌNH HỌC VÀ ĐẾM HÌNH (GEOMETRY & SPATIAL COUNTING)
export const GEOMETRY_COUNT_QUESTIONS: GeometryCountQuestion[] = [
  {
    id: 'geo_1',
    titleVi: 'Đếm hình tam giác lồng nhau',
    titleEn: 'Counting Nested Triangles',
    imageIcon: '📐',
    descriptionVi: 'Một hình tam giác lớn được chia đôi bằng một đường thẳng từ đỉnh xuống đáy. Hỏi có tất cả bao nhiêu hình tam giác?',
    descriptionEn: 'A big triangle is divided into 2 by a vertical line. How many triangles are there in total?',
    options: [2, 3, 4, 5],
    correctAnswer: 3,
    explanationVi: 'Gồm có 2 hình tam giác nhỏ bên trong và 1 hình tam giác lớn bao quanh. Tổng cộng là 3 hình!',
  },
  {
    id: 'geo_2',
    titleVi: 'Đếm khối lập phương xếp tầng',
    titleEn: 'Counting 3D Cube Blocks',
    imageIcon: '🧱',
    descriptionVi: 'Bé xếp 3 khối hộp ở tầng dưới và 1 khối hộp ở tầng trên. Hỏi bé đã dùng bao nhiêu khối hộp?',
    descriptionEn: '3 blocks on the bottom tier and 1 block on top. How many blocks?',
    options: [3, 4, 5, 6],
    correctAnswer: 4,
    explanationVi: 'Tầng dưới có 3 khối, tầng trên có 1 khối: 3 + 1 = 4 khối lập phương!',
  },
  {
    id: 'geo_3',
    titleVi: 'Đếm đoạn thẳng nối 4 điểm',
    titleEn: 'Connecting Straight Lines',
    imageIcon: '📏',
    descriptionVi: 'Trên một đường thẳng có 3 điểm A, B, C theo thứ tự. Hỏi có bao nhiêu đoạn thẳng?',
    descriptionEn: 'On a line there are 3 points A, B, C. How many line segments are formed?',
    options: [2, 3, 4, 5],
    correctAnswer: 3,
    explanationVi: 'Các đoạn thẳng là: AB, BC và AC. Tổng cộng có 3 đoạn thẳng!',
  },
];

// 5. TOÁN OLYMPIC QUỐC TẾ (TIMO / HKIMO / SASMO)
export const OLYMPIC_QUESTIONS: OlympicMathQuestion[] = [
  {
    id: 'oly_1',
    competition: 'TIMO',
    year: '2024 Grade 1',
    questionVi: 'Hôm nay là Thứ Tư. Hỏi 3 ngày sau là Thứ mấy?',
    questionEn: 'Today is Wednesday. What day of the week will it be in 3 days?',
    options: [
      { label: 'A', textVi: 'Thứ Năm', textEn: 'Thursday', isCorrect: false },
      { label: 'B', textVi: 'Thứ Sáu', textEn: 'Friday', isCorrect: false },
      { label: 'C', textVi: 'Thứ Bảy', textEn: 'Saturday', isCorrect: true },
      { label: 'D', textVi: 'Chủ Nhật', textEn: 'Sunday', isCorrect: false },
    ],
    explanationVi: 'Thứ Tư + 1 ngày = Thứ Năm; + 2 ngày = Thứ Sáu; + 3 ngày = Thứ Bảy!',
    explanationEn: 'Wednesday + 1 = Thursday, + 2 = Friday, + 3 = Saturday!',
  },
  {
    id: 'oly_2',
    competition: 'HKIMO',
    year: '2023 Grade 1',
    questionVi: 'Lan có 7 cái kẹo. Hùng có 5 cái kẹo. Hỏi Lan cần cho Hùng bao nhiêu cái kẹo để số kẹo của hai bạn bằng nhau?',
    questionEn: 'Lan has 7 candies. Hung has 5 candies. How many candies should Lan give Hung so both have equal candies?',
    options: [
      { label: 'A', textVi: '1 cái kẹo', textEn: '1 candy', isCorrect: true },
      { label: 'B', textVi: '2 cái kẹo', textEn: '2 candies', isCorrect: false },
      { label: 'C', textVi: '3 cái kẹo', textEn: '3 candies', isCorrect: false },
      { label: 'D', textVi: '4 cái kẹo', textEn: '4 candies', isCorrect: false },
    ],
    explanationVi: 'Lan hơn Hùng: 7 - 5 = 2 cái kẹo. Để bằng nhau, Lan chia đôi phần hơn đó: 2 : 2 = 1 cái kẹo! Khi đó cả hai bạn đều có 6 cái.',
    explanationEn: 'Lan has 2 more. Give 1 to Hung, so both have 6 candies each!',
  },
  {
    id: 'oly_3',
    competition: 'SASMO',
    year: '2024 Grade 1',
    questionVi: 'Có 10 bạn nhỏ xếp thành một hàng dọc. Bạn An đứng ở vị trí thứ 4 từ trên xuống. Hỏi có bao nhiêu bạn đứng sau An?',
    questionEn: '10 children stand in a queue. An is 4th from the front. How many children stand behind An?',
    options: [
      { label: 'A', textVi: '5 bạn', textEn: '5 children', isCorrect: false },
      { label: 'B', textVi: '6 bạn', textEn: '6 children', isCorrect: true },
      { label: 'C', textVi: '7 bạn', textEn: '7 children', isCorrect: false },
      { label: 'D', textVi: '4 bạn', textEn: '4 children', isCorrect: false },
    ],
    explanationVi: 'Tổng cộng có 10 bạn. An và các bạn phía trước gồm 4 bạn. Số bạn đứng sau An là: 10 - 4 = 6 bạn!',
    explanationEn: 'Total 10 children. 4 at and before An. Behind An: 10 - 4 = 6 children!',
  },
];

// 6. TIẾNG VIỆT TƯ DUY: ĐỐ VUI DÂN GIAN & TƯ DUY CHỮ
export const VIETNAMESE_RIDDLES: VietnameseRiddleQuestion[] = [
  {
    id: 'vn_rid_1',
    riddleVi: 'Đầu đội nón đỏ, áo lông sặc sỡ, sáng sớm gáy vang "ò ó o" gọi ông mặt trời thức dậy. Là con gì?',
    hintVi: 'Con vật nuôi quen thuộc gáy báo sáng ở làng quê.',
    options: [
      { text: 'Con Gà Trống', emoji: '🐓', isCorrect: true },
      { text: 'Chú Vịt Bầu', emoji: '🦆', isCorrect: false },
      { text: 'Con Chim Sẻ', emoji: '🐦', isCorrect: false },
      { text: 'Chú Chó Vàng', emoji: '🐕', isCorrect: false },
    ],
    explanationVi: 'Gà trống có mào đỏ như nón, áo lông óng mượt và tiếng gáy ò ó o quen thuộc!',
  },
  {
    id: 'vn_rid_2',
    riddleVi: 'Hoa gì luôn hướng về mặt trời, cánh vàng rực rỡ, hạt thơm bùi béo?',
    hintVi: 'Tên bông hoa có chữ "mặt trời" theo nghĩa Hán Việt.',
    options: [
      { text: 'Hoa Hướng Dương', emoji: '🌻', isCorrect: true },
      { text: 'Hoa Hồng Đỏ', emoji: '🌹', isCorrect: false },
      { text: 'Hoa Sen Hồng', emoji: '🪷', isCorrect: false },
      { text: 'Hoa Mai Vàng', emoji: '🌼', isCorrect: false },
    ],
    explanationVi: 'Hoa Hướng Dương luôn quay về hướng mặt trời mọc và cho hạt hướng dương bùi béo!',
  },
  {
    id: 'vn_rid_3',
    riddleVi: 'Cái gì mình tròn vằn xanh, ruột đỏ ngọt lịm, hạt đen nhánh, ăn vào mát rượi ngày hè?',
    hintVi: 'Một loại quả ngọt có vỏ xanh ruột đỏ.',
    options: [
      { text: 'Quả Dưa Hấu', emoji: '🍉', isCorrect: true },
      { text: 'Quả Cam Sành', emoji: '🍊', isCorrect: false },
      { text: 'Quả Chuối Tiêu', emoji: '🍌', isCorrect: false },
      { text: 'Quả Bưởi Da Xanh', emoji: '🍈', isCorrect: false },
    ],
    explanationVi: 'Dưa hấu vỏ sọc xanh, ruột đỏ tươi, nhiều nước và rất ngọt mát!',
  },
  {
    id: 'vn_rid_4',
    riddleVi: 'Thân dài thon thả, ruột bằng chì đen, giúp bé viết chữ, vẽ tranh tươi màu. Là đồ vật gì?',
    hintVi: 'Đồ dùng học tập luôn có trong hộp bút của bé lớp 1.',
    options: [
      { text: 'Bút Chì', emoji: '✏️', isCorrect: true },
      { text: 'Thước Kẻ', emoji: '📏', isCorrect: false },
      { text: 'Cục Tẩy', emoji: '🧼', isCorrect: false },
      { text: 'Kéo Cắt Giấy', emoji: '✂️', isCorrect: false },
    ],
    explanationVi: 'Bút chì thân gỗ ruột chì giúp bé Gạo tập viết và vẽ thật đẹp!',
  },
];

// 7. TIẾNG VIỆT TƯ DUY: XẾP CHỮ THÀNH CÂU (SENTENCE BUILDER)
export const VIETNAMESE_SENTENCE_PUZZLES: VietnameseSentenceBuilderQuestion[] = [
  {
    id: 'vn_sent_1',
    targetSentence: 'Bé Gạo chăm chỉ học bài.',
    scrambledWords: ['học bài', 'chăm chỉ', 'Bé Gạo.'],
    meaningVi: 'Bé Gạo rất siêng năng và tự giác học tập mỗi ngày.',
    imageEmoji: '👧📖',
  },
  {
    id: 'vn_sent_2',
    targetSentence: 'Mỗi ngày đến trường là một niềm vui.',
    scrambledWords: ['là một niềm vui.', 'Mỗi ngày', 'đến trường'],
    meaningVi: 'Đi học cùng thầy cô và bạn bè thật vui vẻ và bổ ích.',
    imageEmoji: '🏫🎒',
  },
  {
    id: 'vn_sent_3',
    targetSentence: 'Mẹ yêu thương bé rất nhiều.',
    scrambledWords: ['bé rất nhiều.', 'Mẹ', 'yêu thương'],
    meaningVi: 'Tình cảm ấm áp của gia đình dành cho bé.',
    imageEmoji: '💖👩‍👧',
  },
  {
    id: 'vn_sent_4',
    targetSentence: 'Mặt trời chiếu sáng rực rỡ.',
    scrambledWords: ['rực rỡ.', 'chiếu sáng', 'Mặt trời'],
    meaningVi: 'Thiên nhiên buổi sáng tươi đẹp.',
    imageEmoji: '☀️🌻',
  },
];

// 8. TIẾNG VIỆT TƯ DUY: TÌM TỪ KHÁC BIỆT (ODD ONE OUT)
export const VIETNAMESE_ODD_ONE_OUT: VietnameseOddOneOutQuestion[] = [
  {
    id: 'vn_odd_1',
    titleVi: 'Tìm từ không cùng nhóm với các từ còn lại:',
    items: [
      { word: 'Quả Cam', emoji: '🍊', category: 'Trái cây' },
      { word: 'Quả Chuối', emoji: '🍌', category: 'Trái cây' },
      { word: 'Quả Táo', emoji: '🍎', category: 'Trái cây' },
      { word: 'Xe Đạp', emoji: '🚲', category: 'Phương tiện giao thông' },
    ],
    oddWord: 'Xe Đạp',
    reasonVi: 'Xe Đạp là phương tiện giao thông, 3 từ còn lại đều là các loại hoa quả thơm ngon!',
  },
  {
    id: 'vn_odd_2',
    titleVi: 'Tìm đồ vật không phải đồ dùng học tập:',
    items: [
      { word: 'Vở bài tập', emoji: '📓', category: 'Đồ dùng học tập' },
      { word: 'Bút mực', emoji: '🖊️', category: 'Đồ dùng học tập' },
      { word: 'Nồi cơm điện', emoji: '🍚', category: 'Đồ gia dụng' },
      { word: 'Thước kẻ', emoji: '📏', category: 'Đồ dùng học tập' },
    ],
    oddWord: 'Nồi cơm điện',
    reasonVi: 'Nồi cơm điện là đồ dùng trong nhà bếp, không dùng để học tập trong lớp!',
  },
  {
    id: 'vn_odd_3',
    titleVi: 'Tìm loài vật không biết bơi dưới nước:',
    items: [
      { word: 'Cá heo', emoji: '🐬', category: 'Động vật bơi lội' },
      { word: 'Rùa biển', emoji: '🐢', category: 'Động vật bơi lội' },
      { word: 'Chim đại bàng', emoji: '🦅', category: 'Động vật bay lượn' },
      { word: 'Tôm sú', emoji: '🦐', category: 'Động vật bơi lội' },
    ],
    oddWord: 'Chim đại bàng',
    reasonVi: 'Chim đại bàng bay trên bầu trời, không sống và bơi dưới đại dương như 3 loài kia!',
  },
];

// 9. TIẾNG ANH TƯ DUY: TOÁN TIẾNG ANH (MATH IN ENGLISH)
export const ENGLISH_MATH_QUESTIONS: EnglishMathQuestion[] = [
  {
    id: 'en_math_1',
    topic: 'Addition & Total (Phép cộng)',
    questionEn: 'Tom has 4 red apples. Mary gives him 3 green apples. How many apples does Tom have in total?',
    questionVi: 'Tom có 4 quả táo đỏ. Mary cho bạn ấy thêm 3 quả táo xanh. Hỏi Tom có tất cả bao nhiêu quả táo?',
    formula: '4 + 3 = ?',
    options: [
      { textEn: '7 apples', textVi: '7 quả táo', isCorrect: true },
      { textEn: '8 apples', textVi: '8 quả táo', isCorrect: false },
      { textEn: '6 apples', textVi: '6 quả táo', isCorrect: false },
      { textEn: '5 apples', textVi: '5 quả táo', isCorrect: false },
    ],
    hintEn: 'Add the two numbers together: 4 plus 3 equals 7.',
    hintVi: 'Lấy 4 quả táo cộng thêm 3 quả táo: 4 + 3 = 7.',
    keyVocabulary: [
      { word: 'in total', pronunciation: '/ɪn ˈtəʊtl/', meaning: 'tổng cộng, tất cả' },
      { word: 'plus', pronunciation: '/plʌs/', meaning: 'dấu cộng (+)' },
      { word: 'gives', pronunciation: '/ɡɪvz/', meaning: 'cho, tặng' },
    ],
  },
  {
    id: 'en_math_2',
    topic: 'Subtraction & Remaining (Phép trừ)',
    questionEn: 'There are 9 birds on a tree branch. 4 birds fly away. How many birds are left?',
    questionVi: 'Có 9 chú chim trên cành cây. 4 chú chim bay đi. Hỏi còn lại bao nhiêu chú chim trên cành?',
    formula: '9 - 4 = ?',
    options: [
      { textEn: '5 birds', textVi: '5 chú chim', isCorrect: true },
      { textEn: '4 birds', textVi: '4 chú chim', isCorrect: false },
      { textEn: '6 birds', textVi: '6 chú chim', isCorrect: false },
      { textEn: '3 birds', textVi: '3 chú chim', isCorrect: false },
    ],
    hintEn: 'Subtract the birds that flew away: 9 minus 4 equals 5.',
    hintVi: 'Lấy 9 trừ đi 4 chú chim đã bay: 9 - 4 = 5.',
    keyVocabulary: [
      { word: 'fly away', pronunciation: '/flaɪ əˈweɪ/', meaning: 'bay đi' },
      { word: 'left', pronunciation: '/left/', meaning: 'còn lại' },
      { word: 'minus', pronunciation: '/ˈmaɪnəs/', meaning: 'dấu trừ (-)' },
    ],
  },
  {
    id: 'en_math_3',
    topic: 'Geometric Shapes (Hình học tiếng Anh)',
    questionEn: 'Which shape has 3 sides and 3 corners?',
    questionVi: 'Hình nào có 3 cạnh và 3 góc?',
    formula: 'Sides = 3, Corners = 3',
    options: [
      { textEn: 'Triangle', textVi: 'Hình tam giác', isCorrect: true },
      { textEn: 'Square', textVi: 'Hình vuông', isCorrect: false },
      { textEn: 'Circle', textVi: 'Hình tròn', isCorrect: false },
      { textEn: 'Rectangle', textVi: 'Hình chữ nhật', isCorrect: false },
    ],
    hintEn: 'Think of a slice of pizza or a roof triangle.',
    hintVi: 'Hãy nhớ đến miếng bánh pizza hoặc mái nhà hình tam giác.',
    keyVocabulary: [
      { word: 'sides', pronunciation: '/saɪdz/', meaning: 'các cạnh' },
      { word: 'corners', pronunciation: '/ˈkɔːnərz/', meaning: 'các góc' },
      { word: 'Triangle', pronunciation: '/ˈtraɪæŋɡl/', meaning: 'hình tam giác' },
    ],
  },
];

// 10. TIẾNG ANH TƯ DUY: XẾP CHỮ TƯ DUY (WORD SCRAMBLE)
export const ENGLISH_WORD_SCRAMBLE: EnglishWordScrambleQuestion[] = [
  {
    id: 'scramble_1',
    wordEn: 'CAT',
    scrambledLetters: ['T', 'A', 'C'],
    meaningVi: 'Con mèo',
    emoji: '🐱',
    phonetic: '/kæt/',
    exampleSentence: 'The cat says meow meow.',
  },
  {
    id: 'scramble_2',
    wordEn: 'BOOK',
    scrambledLetters: ['O', 'B', 'K', 'O'],
    meaningVi: 'Quyển sách',
    emoji: '📖',
    phonetic: '/bʊk/',
    exampleSentence: 'I read a good book.',
  },
  {
    id: 'scramble_3',
    wordEn: 'STAR',
    scrambledLetters: ['A', 'S', 'R', 'T'],
    meaningVi: 'Ngôi sao lấp lánh',
    emoji: '⭐',
    phonetic: '/stɑːr/',
    exampleSentence: 'Look at the bright star in the sky.',
  },
  {
    id: 'scramble_4',
    wordEn: 'WATER',
    scrambledLetters: ['T', 'W', 'A', 'E', 'R'],
    meaningVi: 'Nước uống',
    emoji: '💧',
    phonetic: '/ˈwɔːtər/',
    exampleSentence: 'Drink fresh water every day.',
  },
];
