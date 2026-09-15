export interface AlphabetItem {
  letter: string;
  lower: string;
  nameVi: string;
  nameEn: string;
  exampleWordVi: string;
  exampleWordEn: string;
  emoji: string;
  soundPronounceVi: string;
}

export const VIETNAMESE_ALPHABET: AlphabetItem[] = [
  { letter: 'A', lower: 'a', nameVi: 'Chữ A', nameEn: 'Letter A', exampleWordVi: 'Quả táo', exampleWordEn: 'Apple', emoji: '🍎', soundPronounceVi: 'a' },
  { letter: 'Ă', lower: 'ă', nameVi: 'Chữ Ă', nameEn: 'Letter Ă', exampleWordVi: 'Mặt trăng khuyết', exampleWordEn: 'Crescent Moon', emoji: '🌙', soundPronounceVi: 'á' },
  { letter: 'Â', lower: 'â', nameVi: 'Chữ Â', nameEn: 'Letter Â', exampleWordVi: 'Cái nón', exampleWordEn: 'Hat', emoji: '👒', soundPronounceVi: 'ớ' },
  { letter: 'B', lower: 'b', nameVi: 'Chữ B', nameEn: 'Letter B', exampleWordVi: 'Em bé', exampleWordEn: 'Baby', emoji: '👶', soundPronounceVi: 'bờ' },
  { letter: 'C', lower: 'c', nameVi: 'Chữ C', nameEn: 'Letter C', exampleWordVi: 'Con cá', exampleWordEn: 'Fish', emoji: '🐟', soundPronounceVi: 'cờ' },
  { letter: 'D', lower: 'd', nameVi: 'Chữ D', nameEn: 'Letter D', exampleWordVi: 'Quả dưa hấu', exampleWordEn: 'Watermelon', emoji: '🍉', soundPronounceVi: 'dờ' },
  { letter: 'Đ', lower: 'đ', nameVi: 'Chữ Đ', nameEn: 'Letter Đ', exampleWordVi: 'Ngọn đuốc', exampleWordEn: 'Torch', emoji: '🔥', soundPronounceVi: 'đờ' },
  { letter: 'E', lower: 'e', nameVi: 'Chữ E', nameEn: 'Letter E', exampleWordVi: 'Chiếc xe', exampleWordEn: 'Car', emoji: '🚗', soundPronounceVi: 'e' },
  { letter: 'Ê', lower: 'ê', nameVi: 'Chữ Ê', nameEn: 'Letter Ê', exampleWordVi: 'Con ếch', exampleWordEn: 'Frog', emoji: '🐸', soundPronounceVi: 'ê' },
  { letter: 'G', lower: 'g', nameVi: 'Chữ G', nameEn: 'Letter G', exampleWordVi: 'Con gà', exampleWordEn: 'Rooster', emoji: '🐔', soundPronounceVi: 'gờ' },
  { letter: 'H', lower: 'h', nameVi: 'Chữ H', nameEn: 'Letter H', exampleWordVi: 'Bông hoa', exampleWordEn: 'Flower', emoji: '🌸', soundPronounceVi: 'hờ' },
  { letter: 'I', lower: 'i', nameVi: 'Chữ I', nameEn: 'Letter I', exampleWordVi: 'Viên bi', exampleWordEn: 'Marble', emoji: '🔮', soundPronounceVi: 'i' },
  { letter: 'K', lower: 'k', nameVi: 'Chữ K', nameEn: 'Letter K', exampleWordVi: 'Cái kéo', exampleWordEn: 'Scissors', emoji: '✂️', soundPronounceVi: 'ca' },
  { letter: 'L', lower: 'l', nameVi: 'Chữ L', nameEn: 'Letter L', exampleWordVi: 'Quả lê', exampleWordEn: 'Pear', emoji: '🍐', soundPronounceVi: 'lờ' },
  { letter: 'M', lower: 'm', nameVi: 'Chữ M', nameEn: 'Letter M', exampleWordVi: 'Mèo con', exampleWordEn: 'Cat', emoji: '🐱', soundPronounceVi: 'mờ' },
  { letter: 'N', lower: 'n', nameVi: 'Chữ N', nameEn: 'Letter N', exampleWordVi: 'Ngôi nhà', exampleWordEn: 'House', emoji: '🏠', soundPronounceVi: 'nờ' },
  { letter: 'O', lower: 'o', nameVi: 'Chữ O', nameEn: 'Letter O', exampleWordVi: 'Con ong', exampleWordEn: 'Bee', emoji: '🐝', soundPronounceVi: 'o' },
  { letter: 'Ô', lower: 'ô', nameVi: 'Chữ Ô', nameEn: 'Letter Ô', exampleWordVi: 'Cái ô (dù)', exampleWordEn: 'Umbrella', emoji: '☂️', soundPronounceVi: 'ô' },
  { letter: 'Ơ', lower: 'ơ', nameVi: 'Chữ Ơ', nameEn: 'Letter Ơ', exampleWordVi: 'Quả ớt', exampleWordEn: 'Chili', emoji: '🌶️', soundPronounceVi: 'ơ' },
  { letter: 'P', lower: 'p', nameVi: 'Chữ P', nameEn: 'Letter P', exampleWordVi: 'Cây đàn pin', exampleWordEn: 'Piano', emoji: '🎹', soundPronounceVi: 'pờ' },
  { letter: 'Q', lower: 'q', nameVi: 'Chữ Q', nameEn: 'Letter Q', exampleWordVi: 'Quả quýt', exampleWordEn: 'Mandarin', emoji: '🍊', soundPronounceVi: 'quy' },
  { letter: 'R', lower: 'r', nameVi: 'Chữ R', nameEn: 'Letter R', exampleWordVi: 'Con rùa', exampleWordEn: 'Turtle', emoji: '🐢', soundPronounceVi: 'rờ' },
  { letter: 'S', lower: 's', nameVi: 'Chữ S', nameEn: 'Letter S', exampleWordVi: 'Ngôi sao', exampleWordEn: 'Star', emoji: '⭐', soundPronounceVi: 'sờ' },
  { letter: 'T', lower: 't', nameVi: 'Chữ T', nameEn: 'Letter T', exampleWordVi: 'Con thỏ', exampleWordEn: 'Rabbit', emoji: '🐰', soundPronounceVi: 'tờ' },
  { letter: 'U', lower: 'u', nameVi: 'Chữ U', nameEn: 'Letter U', exampleWordVi: 'Cái muỗng', exampleWordEn: 'Spoon', emoji: '🥄', soundPronounceVi: 'u' },
  { letter: 'Ư', lower: 'ư', nameVi: 'Chữ Ư', nameEn: 'Letter Ư', exampleWordVi: 'Hươu sao', exampleWordEn: 'Deer', emoji: '🦌', soundPronounceVi: 'ư' },
  { letter: 'V', lower: 'v', nameVi: 'Chữ V', nameEn: 'Letter V', exampleWordVi: 'Con vịt', exampleWordEn: 'Duck', emoji: '🦆', soundPronounceVi: 'vờ' },
  { letter: 'X', lower: 'x', nameVi: 'Chữ X', nameEn: 'Letter X', exampleWordVi: 'Xe đạp', exampleWordEn: 'Bicycle', emoji: '🚲', soundPronounceVi: 'xờ' },
  { letter: 'Y', lower: 'y', nameVi: 'Chữ Y', nameEn: 'Letter Y', exampleWordVi: 'Bác sĩ y tế', exampleWordEn: 'Nurse', emoji: '🩺', soundPronounceVi: 'i dài' },
];

export const VIETNAMESE_TONES = [
  { nameVi: 'Thanh Ngang (Không dấu)', nameEn: 'Flat Tone', mark: '—', example: 'ba, ca, hoa', descVi: 'Giọng đọc đều đều' },
  { nameVi: 'Dấu Huyền', nameEn: 'Grave Accent', mark: '`', example: 'bà, cà, nhà', descVi: 'Giọng trầm xuống nhẹ nhàng' },
  { nameVi: 'Dấu Sắc', nameEn: 'Acute Accent', mark: '´', example: 'bé, cá, lá', descVi: 'Giọng vút lên cao' },
  { nameVi: 'Dấu Hỏi', nameEn: 'Hook Above', mark: '?', example: 'thỏ, hổ, quả', descVi: 'Giọng hơi lượn sóng' },
  { nameVi: 'Dấu Ngã', nameEn: 'Tilde', mark: '~', example: 'mũ, sữa, võ', descVi: 'Giọng gãy nhấp nhô' },
  { nameVi: 'Dấu Nặng', nameEn: 'Dot Below', mark: '.', example: 'mẹ, vịt, cộ', descVi: 'Giọng nén xuống dứt khoát' },
];

export interface RhymePuzzle {
  id: string;
  targetWord: string;
  parts: string[];
  options: string[];
  meaningVi: string;
  meaningEn: string;
  emoji: string;
  hintVi: string;
}

export const RHYME_PUZZLES: RhymePuzzle[] = [
  {
    id: 'rhyme_1',
    targetWord: 'ca',
    parts: ['c', 'a'],
    options: ['c', 'a', 'm', 'e'],
    meaningVi: 'Cái ca uống nước',
    meaningEn: 'A cup / mug',
    emoji: '🥛',
    hintVi: 'Âm [c] ghép với âm [a]',
  },
  {
    id: 'rhyme_2',
    targetWord: 'bà',
    parts: ['b', 'à'],
    options: ['b', 'à', 'd', 'á'],
    meaningVi: 'Bà ngoại hiền từ',
    meaningEn: 'Grandmother',
    emoji: '👵',
    hintVi: 'Âm [b] ghép với âm [à]',
  },
  {
    id: 'rhyme_3',
    targetWord: 'cá',
    parts: ['c', 'á'],
    options: ['c', 'á', 'g', 'ả'],
    meaningVi: 'Con cá bơi lội dưới nước',
    meaningEn: 'Fish swimming',
    emoji: '🐟',
    hintVi: 'Âm [c] ghép với [á] (a mang dấu sắc)',
  },
  {
    id: 'rhyme_4',
    targetWord: 'mẹ',
    parts: ['m', 'ẹ'],
    options: ['m', 'ẹ', 'b', 'è'],
    meaningVi: 'Người mẹ kính yêu',
    meaningEn: 'Mother',
    emoji: '👩‍👧',
    hintVi: 'Âm [m] ghép với [ẹ] (e có dấu nặng)',
  },
  {
    id: 'rhyme_5',
    targetWord: 'gà',
    parts: ['g', 'à'],
    options: ['g', 'à', 'h', 'ô'],
    meaningVi: 'Chú gà trống gáy vang',
    meaningEn: 'Rooster crowing',
    emoji: '🐔',
    hintVi: 'Âm [g] ghép với [à]',
  },
  {
    id: 'rhyme_6',
    targetWord: 'thỏ',
    parts: ['th', 'ỏ'],
    options: ['th', 'ỏ', 'ch', 'ơ'],
    meaningVi: 'Chú thỏ trắng tai dài',
    meaningEn: 'White bunny',
    emoji: '🐰',
    hintVi: 'Âm [th] ghép với [ỏ]',
  },
  {
    id: 'rhyme_7',
    targetWord: 'hoa',
    parts: ['h', 'oa'],
    options: ['h', 'oa', 'n', 'oe'],
    meaningVi: 'Bông hoa tươi rực rỡ',
    meaningEn: 'Beautiful flower',
    emoji: '🌺',
    hintVi: 'Âm [h] ghép với vần [oa]',
  },
  {
    id: 'rhyme_8',
    targetWord: 'nhà',
    parts: ['nh', 'à'],
    options: ['nh', 'à', 'kh', 'a'],
    meaningVi: 'Ngôi nhà xinh xắn của em',
    meaningEn: 'Lovely house',
    emoji: '🏡',
    hintVi: 'Âm [nh] ghép với [à]',
  },
];

export interface MissingLetterQuestion {
  id: string;
  wordWithBlank: string;
  missingChar: string;
  fullWordVi: string;
  meaningEn: string;
  emoji: string;
  options: string[];
}

export const MISSING_LETTER_QUESTIONS: MissingLetterQuestion[] = [
  { id: 'ml_1', wordWithBlank: 'C_n thỏ', missingChar: 'o', fullWordVi: 'Con thỏ', meaningEn: 'Rabbit', emoji: '🐰', options: ['o', 'e', 'u', 'i'] },
  { id: 'ml_2', wordWithBlank: 'B_ng hoa', missingChar: 'ô', fullWordVi: 'Bông hoa', meaningEn: 'Flower', emoji: '🌸', options: ['ô', 'o', 'ơ', 'u'] },
  { id: 'ml_3', wordWithBlank: 'Qu_ táo', missingChar: 'ả', fullWordVi: 'Quả táo', meaningEn: 'Apple', emoji: '🍎', options: ['ả', 'á', 'à', 'ạ'] },
  { id: 'ml_4', wordWithBlank: 'Mặt tr_i', missingChar: 'ờ', fullWordVi: 'Mặt trời', meaningEn: 'Sun', emoji: '☀️', options: ['ờ', 'ơ', 'ô', 'a'] },
  { id: 'ml_5', wordWithBlank: 'C_n mèo', missingChar: 'o', fullWordVi: 'Con mèo', meaningEn: 'Cat', emoji: '🐱', options: ['o', 'u', 'i', 'e'] },
  { id: 'ml_6', wordWithBlank: 'Ng_i sao', missingChar: 'ô', fullWordVi: 'Ngôi sao', meaningEn: 'Star', emoji: '⭐', options: ['ô', 'o', 'ơ', 'e'] },
  { id: 'ml_7', wordWithBlank: 'Cây b_t chì', missingChar: 'ú', fullWordVi: 'Cây bút chì', meaningEn: 'Pencil', emoji: '✏️', options: ['ú', 'ù', 'ủ', 'u'] },
  { id: 'ml_8', wordWithBlank: 'Quyển v_', missingChar: 'ở', fullWordVi: 'Quyển vở', meaningEn: 'Notebook', emoji: '📓', options: ['ở', 'ớ', 'ơ', 'ò'] },
];

export interface WordMatchQuestion {
  id: string;
  correctWordVi: string;
  correctWordEn: string;
  emoji: string;
  optionsVi: string[];
  optionsEn: string[];
}

export const WORD_MATCH_QUESTIONS: WordMatchQuestion[] = [
  { id: 'wm_1', correctWordVi: 'Quả dưa hấu', correctWordEn: 'Watermelon', emoji: '🍉', optionsVi: ['Quả dưa hấu', 'Quả chuối', 'Quả xoài'], optionsEn: ['Watermelon', 'Banana', 'Mango'] },
  { id: 'wm_2', correctWordVi: 'Xe đạp', correctWordEn: 'Bicycle', emoji: '🚲', optionsVi: ['Xe đạp', 'Máy bay', 'Tàu hỏa'], optionsEn: ['Bicycle', 'Airplane', 'Train'] },
  { id: 'wm_3', correctWordVi: 'Cầu vồng', correctWordEn: 'Rainbow', emoji: '🌈', optionsVi: ['Cầu vồng', 'Mặt trăng', 'Đám mây'], optionsEn: ['Rainbow', 'Moon', 'Cloud'] },
  { id: 'wm_4', correctWordVi: 'Con ong', correctWordEn: 'Bee', emoji: '🐝', optionsVi: ['Con ong', 'Con kiến', 'Con bướm'], optionsEn: ['Bee', 'Ant', 'Butterfly'] },
  { id: 'wm_5', correctWordVi: 'Đồng hồ', correctWordEn: 'Clock', emoji: '⏰', optionsVi: ['Đồng hồ', 'Cái bàn', 'Cây bút'], optionsEn: ['Clock', 'Table', 'Pen'] },
  { id: 'wm_6', correctWordVi: 'Quyển sách', correctWordEn: 'Book', emoji: '📖', optionsVi: ['Quyển sách', 'Cặp sách', 'Bảng đen'], optionsEn: ['Book', 'Backpack', 'Blackboard'] },
];

// Grade 1 Math Questions
export interface MathCountingQuestion {
  id: string;
  count: number;
  itemEmoji: string;
  nameVi: string;
  nameEn: string;
  options: number[];
  gradeLevel?: 'preschool' | 'grade_1' | 'grade_2' | 'grade_3';
}

export const COUNTING_QUESTIONS: MathCountingQuestion[] = [
  // Preschool & Grade 1
  { id: 'cnt_p1', count: 3, itemEmoji: '🐤', nameVi: 'chú vịt con', nameEn: 'ducklings', options: [2, 3, 4, 5], gradeLevel: 'preschool' },
  { id: 'cnt_1', count: 4, itemEmoji: '🍎', nameVi: 'quả táo đỏ', nameEn: 'red apples', options: [3, 4, 5, 6], gradeLevel: 'grade_1' },
  { id: 'cnt_2', count: 7, itemEmoji: '🥕', nameVi: 'củ cà rốt', nameEn: 'carrots', options: [6, 7, 8, 9], gradeLevel: 'grade_1' },
  { id: 'cnt_3', count: 5, itemEmoji: '🐸', nameVi: 'chú ếch xanh', nameEn: 'green frogs', options: [4, 5, 6, 7], gradeLevel: 'grade_1' },
  { id: 'cnt_4', count: 9, itemEmoji: '⭐', nameVi: 'ngôi sao vàng', nameEn: 'golden stars', options: [7, 8, 9, 10], gradeLevel: 'grade_1' },
  { id: 'cnt_5', count: 6, itemEmoji: '🐟', nameVi: 'chú cá nhỏ', nameEn: 'little fish', options: [5, 6, 7, 8], gradeLevel: 'grade_1' },
  { id: 'cnt_6', count: 8, itemEmoji: '🍬', nameVi: 'viên kẹo ngọt', nameEn: 'sweet candies', options: [6, 7, 8, 10], gradeLevel: 'grade_1' },
  { id: 'cnt_7', count: 10, itemEmoji: '🎈', nameVi: 'quả bóng bay', nameEn: 'balloons', options: [8, 9, 10, 11], gradeLevel: 'grade_1' },
  { id: 'cnt_8', count: 12, itemEmoji: '🍓', nameVi: 'quả dâu tây', nameEn: 'strawberries', options: [10, 11, 12, 13], gradeLevel: 'grade_1' },
  { id: 'cnt_9', count: 15, itemEmoji: '🌺', nameVi: 'bông hoa đào', nameEn: 'peach blossoms', options: [13, 14, 15, 16], gradeLevel: 'grade_2' },
  { id: 'cnt_10', count: 18, itemEmoji: '💎', nameVi: 'viên kim cương', nameEn: 'diamonds', options: [16, 17, 18, 20], gradeLevel: 'grade_2' },
];

export interface SpeedMathQuestion {
  id: string;
  num1: number;
  num2: number;
  op: '+' | '-' | '×' | ':';
  result: number;
  options: number[];
  gradeLevel?: 'preschool' | 'grade_1' | 'grade_2' | 'grade_3';
}

export const SPEED_MATH_QUESTIONS: SpeedMathQuestion[] = [
  // Preschool (within 5)
  { id: 'sm_p1', num1: 2, num2: 1, op: '+', result: 3, options: [2, 3, 4, 5], gradeLevel: 'preschool' },
  { id: 'sm_p2', num1: 4, num2: 2, op: '-', result: 2, options: [1, 2, 3, 4], gradeLevel: 'preschool' },

  // Grade 1 (within 10 and 20)
  { id: 'sm_1', num1: 3, num2: 2, op: '+', result: 5, options: [4, 5, 6, 7], gradeLevel: 'grade_1' },
  { id: 'sm_2', num1: 5, num2: 1, op: '-', result: 4, options: [3, 4, 5, 6], gradeLevel: 'grade_1' },
  { id: 'sm_3', num1: 4, num2: 4, op: '+', result: 8, options: [7, 8, 9, 10], gradeLevel: 'grade_1' },
  { id: 'sm_4', num1: 7, num2: 3, op: '-', result: 4, options: [3, 4, 5, 6], gradeLevel: 'grade_1' },
  { id: 'sm_5', num1: 6, num2: 3, op: '+', result: 9, options: [8, 9, 10, 11], gradeLevel: 'grade_1' },
  { id: 'sm_6', num1: 10, num2: 4, op: '-', result: 6, options: [5, 6, 7, 8], gradeLevel: 'grade_1' },
  { id: 'sm_7', num1: 8, num2: 2, op: '+', result: 10, options: [9, 10, 11, 12], gradeLevel: 'grade_1' },
  { id: 'sm_8', num1: 9, num2: 5, op: '-', result: 4, options: [3, 4, 5, 6], gradeLevel: 'grade_1' },
  { id: 'sm_9', num1: 10, num2: 5, op: '+', result: 15, options: [13, 14, 15, 16], gradeLevel: 'grade_1' },
  { id: 'sm_10', num1: 15, num2: 3, op: '-', result: 12, options: [11, 12, 13, 14], gradeLevel: 'grade_1' },

  // Grade 2 (Within 100 & Multiplication 2, 5)
  { id: 'sm_g2_1', num1: 25, num2: 14, op: '+', result: 39, options: [38, 39, 40, 49], gradeLevel: 'grade_2' },
  { id: 'sm_g2_2', num1: 48, num2: 15, op: '-', result: 33, options: [32, 33, 34, 43], gradeLevel: 'grade_2' },
  { id: 'sm_g2_3', num1: 2, num2: 5, op: '×', result: 10, options: [8, 10, 12, 15], gradeLevel: 'grade_2' },
  { id: 'sm_g2_4', num1: 5, num2: 4, op: '×', result: 20, options: [18, 20, 24, 25], gradeLevel: 'grade_2' },
  { id: 'sm_g2_5', num1: 60, num2: 25, op: '+', result: 85, options: [75, 80, 85, 95], gradeLevel: 'grade_2' },

  // Grade 3 (Multiplication & Division tables)
  { id: 'sm_g3_1', num1: 7, num2: 8, op: '×', result: 56, options: [48, 54, 56, 64], gradeLevel: 'grade_3' },
  { id: 'sm_g3_2', num1: 9, num2: 6, op: '×', result: 54, options: [45, 54, 56, 63], gradeLevel: 'grade_3' },
  { id: 'sm_g3_3', num1: 36, num2: 4, op: ':', result: 9, options: [7, 8, 9, 10], gradeLevel: 'grade_3' },
  { id: 'sm_g3_4', num1: 63, num2: 7, op: ':', result: 9, options: [8, 9, 10, 11], gradeLevel: 'grade_3' },
  { id: 'sm_g3_5', num1: 120, num2: 45, op: '+', result: 165, options: [155, 160, 165, 175], gradeLevel: 'grade_3' },
];

export interface ComparisonQuestion {
  id: string;
  leftText: string;
  leftValue: number;
  rightText: string;
  rightValue: number;
  correctSymbol: '>' | '<' | '=';
  leftEmoji: string;
  rightEmoji: string;
}

export const COMPARISON_QUESTIONS: ComparisonQuestion[] = [
  { id: 'cmp_1', leftText: '5', leftValue: 5, rightText: '8', rightValue: 8, correctSymbol: '<', leftEmoji: '🍎 x 5', rightEmoji: '🍎 x 8' },
  { id: 'cmp_2', leftText: '9', leftValue: 9, rightText: '4', rightValue: 4, correctSymbol: '>', leftEmoji: '⭐ x 9', rightEmoji: '⭐ x 4' },
  { id: 'cmp_3', leftText: '6', leftValue: 6, rightText: '6', rightValue: 6, correctSymbol: '=', leftEmoji: '🥕 x 6', rightEmoji: '🥕 x 6' },
  { id: 'cmp_4', leftText: '3 + 2', leftValue: 5, rightText: '7', rightValue: 7, correctSymbol: '<', leftEmoji: '3 + 2', rightEmoji: '7' },
  { id: 'cmp_5', leftText: '10 - 2', leftValue: 8, rightText: '8', rightValue: 8, correctSymbol: '=', leftEmoji: '10 - 2', rightEmoji: '8' },
  { id: 'cmp_6', leftText: '7 + 3', leftValue: 10, rightText: '9', rightValue: 9, correctSymbol: '>', leftEmoji: '7 + 3', rightEmoji: '9' },
  { id: 'cmp_7', leftText: '14', leftValue: 14, rightText: '16', rightValue: 16, correctSymbol: '<', leftEmoji: '14', rightEmoji: '16' },
];

export interface ShapeQuestion {
  id: string;
  shapeNameVi: string;
  shapeNameEn: string;
  correctItemNameVi: string;
  correctItemNameEn: string;
  emoji: string;
  options: { id: string; nameVi: string; nameEn: string; emoji: string; isCorrect: boolean }[];
}

export const SHAPE_QUESTIONS: ShapeQuestion[] = [
  {
    id: 'shp_1',
    shapeNameVi: 'Hình Tròn',
    shapeNameEn: 'Circle',
    correctItemNameVi: 'Mặt trời tròn xoe',
    correctItemNameEn: 'Round sun',
    emoji: '⭕',
    options: [
      { id: 'o1', nameVi: 'Mặt trời', nameEn: 'Sun', emoji: '☀️', isCorrect: true },
      { id: 'o2', nameVi: 'Hộp quà', nameEn: 'Gift box', emoji: '🎁', isCorrect: false },
      { id: 'o3', nameVi: 'Mái nhà', nameEn: 'Roof', emoji: '⛺', isCorrect: false },
    ],
  },
  {
    id: 'shp_2',
    shapeNameVi: 'Hình Tam Giác',
    shapeNameEn: 'Triangle',
    correctItemNameVi: 'Miếng dưa hấu / biển báo',
    correctItemNameEn: 'Watermelon slice',
    emoji: '🔺',
    options: [
      { id: 'o1', nameVi: 'Quả bóng', nameEn: 'Ball', emoji: '⚽', isCorrect: false },
      { id: 'o2', nameVi: 'Miếng dưa hấu', nameEn: 'Watermelon slice', emoji: '🍉', isCorrect: true },
      { id: 'o3', nameVi: 'Cuốn sách', nameEn: 'Book', emoji: '📘', isCorrect: false },
    ],
  },
  {
    id: 'shp_3',
    shapeNameVi: 'Hình Vuông',
    shapeNameEn: 'Square',
    correctItemNameVi: 'Hộp quà sinh nhật',
    correctItemNameEn: 'Gift Box',
    emoji: '🟩',
    options: [
      { id: 'o1', nameVi: 'Hộp quà', nameEn: 'Gift box', emoji: '🎁', isCorrect: true },
      { id: 'o2', nameVi: 'Bánh xe', nameEn: 'Wheel', emoji: '🛞', isCorrect: false },
      { id: 'o3', nameVi: 'Chiếc nón', nameEn: 'Cone hat', emoji: '👒', isCorrect: false },
    ],
  },
  {
    id: 'shp_4',
    shapeNameVi: 'Hình Chữ Nhật',
    shapeNameEn: 'Rectangle',
    correctItemNameVi: 'Chiếc điện thoại / cánh cửa',
    correctItemNameEn: 'Door / Phone',
    emoji: '🚪',
    options: [
      { id: 'o1', nameVi: 'Cánh cửa', nameEn: 'Door', emoji: '🚪', isCorrect: true },
      { id: 'o2', nameVi: 'Mặt đồng hồ tròn', nameEn: 'Clock', emoji: '⏰', isCorrect: false },
      { id: 'o3', nameVi: 'Kim tự tháp', nameEn: 'Pyramid', emoji: '🔺', isCorrect: false },
    ],
  },
];
