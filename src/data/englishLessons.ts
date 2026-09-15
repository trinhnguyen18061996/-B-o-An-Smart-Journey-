import { GradeLevel } from '../types';

export interface EnglishDialogue {
  id: string;
  characterEmoji: string;
  characterName: string;
  questionEn: string;
  questionVi: string;
  soundPronounceEn: string;
  options: {
    id: string;
    textEn: string;
    textVi: string;
    isCorrect: boolean;
    responseEn: string;
    responseVi: string;
  }[];
  gradeLevel: GradeLevel;
}

export interface EnglishVocabItem {
  id: string;
  wordEn: string;
  meaningVi: string;
  pronouncePhonetic: string;
  category: 'animals' | 'colors' | 'family' | 'fruits' | 'school';
  emoji: string;
  exampleSentenceEn: string;
  exampleSentenceVi: string;
  gradeLevel: GradeLevel;
}

export const ENGLISH_VOCABULARY: EnglishVocabItem[] = [
  // Animals
  { id: 'cat', wordEn: 'Cat', meaningVi: 'Con mèo', pronouncePhonetic: '/kæt/', category: 'animals', emoji: '🐱', exampleSentenceEn: 'I love my cute cat.', exampleSentenceVi: 'Tôi yêu chú mèo dễ thương của mình.', gradeLevel: 'preschool' },
  { id: 'dog', wordEn: 'Dog', meaningVi: 'Chú chó', pronouncePhonetic: '/dɔːɡ/', category: 'animals', emoji: '🐶', exampleSentenceEn: 'The dog is barking happily.', exampleSentenceVi: 'Chú chó đang sủa vui vẻ.', gradeLevel: 'preschool' },
  { id: 'rabbit', wordEn: 'Rabbit', meaningVi: 'Con thỏ', pronouncePhonetic: '/ˈræb.ɪt/', category: 'animals', emoji: '🐰', exampleSentenceEn: 'The white rabbit has long ears.', exampleSentenceVi: 'Chú thỏ trắng có đôi tai dài.', gradeLevel: 'grade_1' },
  { id: 'lion', wordEn: 'Lion', meaningVi: 'Sư tử', pronouncePhonetic: '/ˈlaɪ.ən/', category: 'animals', emoji: '🦁', exampleSentenceEn: 'The lion is the king of the jungle.', exampleSentenceVi: 'Sư tử là chúa sơn lâm.', gradeLevel: 'grade_1' },
  { id: 'dolphin', wordEn: 'Dolphin', meaningVi: 'Cá heo', pronouncePhonetic: '/ˈdɒl.fɪn/', category: 'animals', emoji: '🐬', exampleSentenceEn: 'Dolphins are very friendly animals.', exampleSentenceVi: 'Cá heo là loài động vật rất thân thiện.', gradeLevel: 'grade_2' },
  { id: 'elephant', wordEn: 'Elephant', meaningVi: 'Con voi', pronouncePhonetic: '/ˈel.ɪ.fənt/', category: 'animals', emoji: '🐘', exampleSentenceEn: 'The elephant has a long trunk.', exampleSentenceVi: 'Chú voi có một chiếc vòi dài.', gradeLevel: 'grade_2' },
  { id: 'butterfly', wordEn: 'Butterfly', meaningVi: 'Con bướm', pronouncePhonetic: '/ˈbʌt.ə.flaɪ/', category: 'animals', emoji: '🦋', exampleSentenceEn: 'The colorful butterfly dances around the flowers.', exampleSentenceVi: 'Con bướm rực rỡ khiêu vũ quanh những bông hoa.', gradeLevel: 'grade_3' },

  // Colors
  { id: 'red', wordEn: 'Red', meaningVi: 'Màu đỏ', pronouncePhonetic: '/red/', category: 'colors', emoji: '🔴', exampleSentenceEn: 'The apple is red.', exampleSentenceVi: 'Quả táo màu đỏ.', gradeLevel: 'preschool' },
  { id: 'blue', wordEn: 'Blue', meaningVi: 'Màu xanh da trời', pronouncePhonetic: '/bluː/', category: 'colors', emoji: '🔵', exampleSentenceEn: 'The sky is blue today.', exampleSentenceVi: 'Hôm nay bầu trời trong xanh.', gradeLevel: 'preschool' },
  { id: 'green', wordEn: 'Green', meaningVi: 'Màu xanh lá', pronouncePhonetic: '/ɡriːn/', category: 'colors', emoji: '🟢', exampleSentenceEn: 'Grass is green and fresh.', exampleSentenceVi: 'Bãi cỏ xanh tươi mát.', gradeLevel: 'grade_1' },
  { id: 'yellow', wordEn: 'Yellow', meaningVi: 'Màu vàng', pronouncePhonetic: '/ˈjel.oʊ/', category: 'colors', emoji: '🟡', exampleSentenceEn: 'The sun is bright yellow.', exampleSentenceVi: 'Mặt trời màu vàng rực rỡ.', gradeLevel: 'grade_1' },

  // Fruits
  { id: 'apple', wordEn: 'Apple', meaningVi: 'Quả táo', pronouncePhonetic: '/ˈæp.əl/', category: 'fruits', emoji: '🍎', exampleSentenceEn: 'An apple a day keeps the doctor away.', exampleSentenceVi: 'Mỗi ngày ăn một quả táo rất tốt cho sức khỏe.', gradeLevel: 'preschool' },
  { id: 'banana', wordEn: 'Banana', meaningVi: 'Quả chuối', pronouncePhonetic: '/bəˈnɑː.nə/', category: 'fruits', emoji: '🍌', exampleSentenceEn: 'Monkeys love sweet bananas.', exampleSentenceVi: 'Những chú khỉ thích chuối ngọt.', gradeLevel: 'grade_1' },
  { id: 'watermelon', wordEn: 'Watermelon', meaningVi: 'Quả dưa hấu', pronouncePhonetic: '/ˈwɔː.təˌmel.ən/', category: 'fruits', emoji: '🍉', exampleSentenceEn: 'Cold watermelon is wonderful in summer.', exampleSentenceVi: 'Dưa hấu mát lạnh rất tuyệt vào mùa hè.', gradeLevel: 'grade_2' },

  // School
  { id: 'book', wordEn: 'Book', meaningVi: 'Cuốn sách', pronouncePhonetic: '/bʊk/', category: 'school', emoji: '📖', exampleSentenceEn: 'I read my storybook every night.', exampleSentenceVi: 'Tôi đọc sách truyện mỗi tối.', gradeLevel: 'grade_1' },
  { id: 'pencil', wordEn: 'Pencil', meaningVi: 'Bút chì', pronouncePhonetic: '/ˈpen.səl/', category: 'school', emoji: '✏️', exampleSentenceEn: 'Please draw with your sharp pencil.', exampleSentenceVi: 'Hãy vẽ bằng chiếc bút chì sắc nét nhé.', gradeLevel: 'grade_1' },
  { id: 'backpack', wordEn: 'Backpack', meaningVi: 'Cặp sách', pronouncePhonetic: '/ˈbæk.pæk/', category: 'school', emoji: '🎒', exampleSentenceEn: 'My backpack is full of colorful notebooks.', exampleSentenceVi: 'Cặp sách của tôi đầy ắp những cuốn vở nhiều màu.', gradeLevel: 'grade_2' },
];

export const ENGLISH_DIALOGUES: EnglishDialogue[] = [
  {
    id: 'dlg_1',
    characterEmoji: '🐰',
    characterName: 'Benny the Bunny',
    questionEn: 'Hello! What is your name?',
    questionVi: 'Xin chào! Tên của bạn là gì thế?',
    soundPronounceEn: 'Hello! What is your name?',
    options: [
      { id: 'opt_1', textEn: 'My name is Alex. Nice to meet you!', textVi: 'Tên mình là Alex. Rất vui được gặp bạn!', isCorrect: true, responseEn: 'Awesome! Nice to meet you, Alex!', responseVi: 'Tuyệt vời! Rất vui được gặp Alex!' },
      { id: 'opt_2', textEn: 'I am eating an apple.', textVi: 'Mình đang ăn quả táo.', isCorrect: false, responseEn: 'That sounds delicious, but what is your name?', responseVi: 'Nghe ngon đấy, nhưng tên bạn là gì cơ mà?' },
      { id: 'opt_3', textEn: 'The cat is blue.', textVi: 'Con mèo màu xanh.', isCorrect: false, responseEn: 'Oops, let us introduce our names first!', responseVi: 'Ôi, chúng mình hãy giới thiệu tên trước nhé!' },
    ],
    gradeLevel: 'grade_1',
  },
  {
    id: 'dlg_2',
    characterEmoji: '🐱',
    characterName: 'Misty the Cat',
    questionEn: 'How are you today?',
    questionVi: 'Hôm nay bạn cảm thấy thế nào?',
    soundPronounceEn: 'How are you today?',
    options: [
      { id: 'opt_1', textEn: "I'm great, thank you! And you?", textVi: 'Mình rất vui và khỏe, cảm ơn bạn! Còn bạn thì sao?', isCorrect: true, responseEn: "I am feeling wonderful today, let's learn together!", responseVi: 'Mình cũng thấy rất tuyệt, cùng học nào!' },
      { id: 'opt_2', textEn: 'It is 8 o clock.', textVi: 'Bây giờ là 8 giờ.', isCorrect: false, responseEn: 'Haha, that is the time, not your feeling!', responseVi: 'Haha, đó là giờ giấc chứ không phải tâm trạng!' },
      { id: 'opt_3', textEn: 'I have two pencils.', textVi: 'Mình có hai chiếc bút chì.', isCorrect: false, responseEn: 'Nice pencils! But how are you feeling?', responseVi: 'Bút chì đẹp đấy! Nhưng bạn cảm thấy thế nào?' },
    ],
    gradeLevel: 'grade_1',
  },
  {
    id: 'dlg_3',
    characterEmoji: '🐶',
    characterName: 'Buddy the Dog',
    questionEn: 'How old are you, my friend?',
    questionVi: 'Bạn bao nhiêu tuổi rồi?',
    soundPronounceEn: 'How old are you, my friend?',
    options: [
      { id: 'opt_1', textEn: 'I am six years old!', textVi: 'Mình sáu tuổi rồi!', isCorrect: true, responseEn: 'Wow, you are a smart first grader!', responseVi: 'Ồ, bạn đúng là một học sinh lớp 1 thông minh!' },
      { id: 'opt_2', textEn: 'I like ice cream.', textVi: 'Mình thích kem.', isCorrect: false, responseEn: 'Ice cream is sweet, but how old are you?', responseVi: 'Kem ngọt đấy, nhưng bạn bao nhiêu tuổi cơ?' },
      { id: 'opt_3', textEn: 'Good night!', textVi: 'Chúc ngủ ngon!', isCorrect: false, responseEn: 'Do not go to sleep yet, let us count your age!', responseVi: 'Đừng đi ngủ vội, hãy cùng đếm số tuổi nào!' },
    ],
    gradeLevel: 'grade_1',
  },
  {
    id: 'dlg_4',
    characterEmoji: '🐼',
    characterName: 'Panda Panpan',
    questionEn: 'What is your favorite animal?',
    questionVi: 'Bạn yêu thích con vật nào nhất?',
    soundPronounceEn: 'What is your favorite animal?',
    options: [
      { id: 'opt_1', textEn: 'I love cute puppies and dolphins!', textVi: 'Mình yêu các chú cún và cá heo dễ thương!', isCorrect: true, responseEn: 'Puppies and dolphins are so friendly!', responseVi: 'Cún con và cá heo rất thân thiện!' },
      { id: 'opt_2', textEn: 'I live in Vietnam.', textVi: 'Mình sống ở Việt Nam.', isCorrect: false, responseEn: 'Vietnam is beautiful, but which animal do you like?', responseVi: 'Việt Nam tươi đẹp, nhưng bạn thích con vật nào?' },
      { id: 'opt_3', textEn: 'Today is Monday.', textVi: 'Hôm nay là Thứ Hai.', isCorrect: false, responseEn: 'Monday is a great day, tell me your favorite animal!', responseVi: 'Thứ Hai tuyệt vời, hãy kể cho mình con vật bạn thích!' },
    ],
    gradeLevel: 'grade_2',
  },
  {
    id: 'dlg_5',
    characterEmoji: '🦁',
    characterName: 'Leo the Lion',
    questionEn: 'What can you do at school?',
    questionVi: 'Bạn có thể làm những gì ở trường học?',
    soundPronounceEn: 'What can you do at school?',
    options: [
      { id: 'opt_1', textEn: 'I can read books and play with friends!', textVi: 'Mình có thể đọc sách và vui chơi cùng bạn bè!', isCorrect: true, responseEn: 'Splendid! Learning with friends is super fun!', responseVi: 'Tuyệt đỉnh! Cùng học với bạn bè siêu vui!' },
      { id: 'opt_2', textEn: 'The table is made of wood.', textVi: 'Cái bàn được làm bằng gỗ.', isCorrect: false, responseEn: 'Tell me what you love doing at school!', responseVi: 'Hãy kể cho mình bạn thích làm gì ở trường nhé!' },
      { id: 'opt_3', textEn: 'Bananas are yellow.', textVi: 'Quả chuối màu vàng.', isCorrect: false, responseEn: 'Tell me about school activities!', responseVi: 'Hãy kể về các hoạt động ở trường nào!' },
    ],
    gradeLevel: 'grade_3',
  },
];
