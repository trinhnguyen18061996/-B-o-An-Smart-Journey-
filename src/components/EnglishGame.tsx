import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, ChevronRight, MessageCircle, BookOpen, Music, Users, Repeat, Brain, GraduationCap } from 'lucide-react';
import { EnglishGameMode, GradeLevel, ParentSettings } from '../types';
import { ENGLISH_DIALOGUES, ENGLISH_VOCABULARY, EnglishDialogue, EnglishVocabItem } from '../data/englishLessons';
import {
  GRADE_CURRICULUM_INFO,
  GRADE_ENGLISH_QUIZ,
  GradeEnglishQuizItem,
} from '../data/gradeCurriculum';
import { translations } from '../utils/translations';
import { soundFx, speakText } from '../utils/audio';
import { EnglishThinkingGame } from './english/EnglishThinkingGame';
import { AIPracticeCard } from './ai/AIPracticeCard';

interface EnglishGameProps {
  settings: ParentSettings;
  gradeLevel: GradeLevel;
  childName?: string;
  onFinishExercise: (subject: 'english', mode: string, score: number, total: number, stars: number) => void;
}

const PHONICS_ALPHABET = [
  { letter: 'A', word: 'Apple', phonetic: '/ˈæp.əl/', emoji: '🍎', sentence: 'A is for Apple.' },
  { letter: 'B', word: 'Ball', phonetic: '/bɔːl/', emoji: '⚽', sentence: 'B is for Ball.' },
  { letter: 'C', word: 'Cat', phonetic: '/kæt/', emoji: '🐱', sentence: 'C is for Cat.' },
  { letter: 'D', word: 'Dog', phonetic: '/dɒɡ/', emoji: '🐶', sentence: 'D is for Dog.' },
  { letter: 'E', word: 'Elephant', phonetic: '/ˈel.ɪ.fənt/', emoji: '🐘', sentence: 'E is for Elephant.' },
  { letter: 'F', word: 'Fish', phonetic: '/fɪʃ/', emoji: '🐟', sentence: 'F is for Fish.' },
  { letter: 'G', word: 'Giraffe', phonetic: '/dʒɪˈrɑːf/', emoji: '🦒', sentence: 'G is for Giraffe.' },
  { letter: 'H', word: 'Hat', phonetic: '/hæt/', emoji: '👒', sentence: 'H is for Hat.' },
  { letter: 'I', word: 'Ice cream', phonetic: '/ˌaɪs ˈkriːm/', emoji: '🍦', sentence: 'I is for Ice cream.' },
  { letter: 'J', word: 'Jellyfish', phonetic: '/ˈdʒel.i.fɪʃ/', emoji: '🪼', sentence: 'J is for Jellyfish.' },
  { letter: 'K', word: 'Kite', phonetic: '/kaɪt/', emoji: '🪁', sentence: 'K is for Kite.' },
  { letter: 'L', word: 'Lion', phonetic: '/ˈlaɪ.ən/', emoji: '🦁', sentence: 'L is for Lion.' },
  { letter: 'M', word: 'Monkey', phonetic: '/ˈmʌŋ.ki/', emoji: '🐵', sentence: 'M is for Monkey.' },
  { letter: 'N', word: 'Nest', phonetic: '/nest/', emoji: '🪺', sentence: 'N is for Nest.' },
  { letter: 'O', word: 'Orange', phonetic: '/ˈɒr.ɪndʒ/', emoji: '🍊', sentence: 'O is for Orange.' },
  { letter: 'P', word: 'Panda', phonetic: '/ˈpæn.də/', emoji: '🐼', sentence: 'P is for Panda.' },
  { letter: 'Q', word: 'Queen', phonetic: '/kwiːn/', emoji: '👑', sentence: 'Q is for Queen.' },
  { letter: 'R', word: 'Rainbow', phonetic: '/ˈreɪn.bəʊ/', emoji: '🌈', sentence: 'R is for Rainbow.' },
  { letter: 'S', word: 'Sun', phonetic: '/sʌn/', emoji: '☀️', sentence: 'S is for Sun.' },
  { letter: 'T', word: 'Tiger', phonetic: '/ˈtaɪ.ɡər/', emoji: '🐯', sentence: 'T is for Tiger.' },
  { letter: 'U', word: 'Umbrella', phonetic: '/ʌmˈbrel.ə/', emoji: '☂️', sentence: 'U is for Umbrella.' },
  { letter: 'V', word: 'Violin', phonetic: '/ˌvaɪəˈlɪn/', emoji: '🎻', sentence: 'V is for Violin.' },
  { letter: 'W', word: 'Watermelon', phonetic: '/ˈwɔː.təˌmel.ən/', emoji: '🍉', sentence: 'W is for Watermelon.' },
  { letter: 'X', word: 'Xylophone', phonetic: '/ˈzaɪ.lə.fəʊn/', emoji: '🎶', sentence: 'X is for Xylophone.' },
  { letter: 'Y', word: 'Yo-yo', phonetic: '/ˈjəʊ.jəʊ/', emoji: '🪀', sentence: 'Y is for Yo-yo.' },
  { letter: 'Z', word: 'Zebra', phonetic: '/ˈzeb.rə/', emoji: '🦓', sentence: 'Z is for Zebra.' },
];

const DAILY_COMMUNICATION_PHRASES = [
  {
    id: 'ph_1',
    phraseEn: 'Hello! Good morning!',
    meaningVi: 'Xin chào! Chúc một buổi sáng tốt lành!',
    situationVi: 'Khi gặp thầy cô, bạn bè vào buổi sáng',
    mascot: '🌞',
    soundText: 'Hello! Good morning!',
  },
  {
    id: 'ph_2',
    phraseEn: "My name is Peter. What's your name?",
    meaningVi: 'Tên mình là Peter. Tên bạn là gì?',
    situationVi: 'Làm quen bạn mới ở trường lớp',
    mascot: '🤝',
    soundText: "My name is Peter. What's your name?",
  },
  {
    id: 'ph_3',
    phraseEn: "I'm very happy to meet you!",
    meaningVi: 'Mình rất vui được gặp bạn!',
    situationVi: 'Bày tỏ sự thân thiện và lịch sự',
    mascot: '🎉',
    soundText: "I'm very happy to meet you!",
  },
  {
    id: 'ph_4',
    phraseEn: 'Can I play with you, please?',
    meaningVi: 'Mình có thể cùng chơi với bạn được không?',
    situationVi: 'Xin phép cùng tham gia trò chơi giờ ra chơi',
    mascot: '⚽',
    soundText: 'Can I play with you, please?',
  },
  {
    id: 'ph_5',
    phraseEn: 'Thank you so much! You are so kind.',
    meaningVi: 'Cảm ơn bạn rất nhiều! Bạn thật tốt bụng.',
    situationVi: 'Khi được người khác giúp đỡ hoặc chia sẻ đồ dùng',
    mascot: '💖',
    soundText: 'Thank you so much! You are so kind.',
  },
  {
    id: 'ph_6',
    phraseEn: 'Goodbye! See you tomorrow!',
    meaningVi: 'Tạm biệt nhé! Hẹn gặp lại bạn vào ngày mai!',
    situationVi: 'Chào tạm biệt khi tan học về nhà',
    mascot: '👋',
    soundText: 'Goodbye! See you tomorrow!',
  },
];

export const EnglishGame: React.FC<EnglishGameProps> = ({
  settings,
  gradeLevel,
  childName = 'bé',
  onFinishExercise,
}) => {
  const currentGradeInfo = GRADE_CURRICULUM_INFO[gradeLevel] || GRADE_CURRICULUM_INFO.grade_1;
  const gradeQuizList = GRADE_ENGLISH_QUIZ[gradeLevel] || GRADE_ENGLISH_QUIZ.grade_1;

  const [category, setCategory] = useState<'grade_curriculum' | 'ai' | 'thinking' | 'foundation'>('grade_curriculum');
  const [mode, setMode] = useState<EnglishGameMode>('grade_quiz');
  const t = translations[settings.language];

  // Grade Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // 1. Phonics state
  const [selectedPhonics, setSelectedPhonics] = useState(PHONICS_ALPHABET[0]);
  const [phonicsQuizIndex, setPhonicsQuizIndex] = useState(0);

  // 2. Daily communication phrases state
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

  // 3. Vocab state
  const [vocabCategory, setVocabCategory] = useState<'all' | 'animals' | 'colors' | 'fruits' | 'school'>('all');
  const [activeVocabId, setActiveVocabId] = useState<string>(ENGLISH_VOCABULARY[0].id);

  // 4. Interactive Dialogue state
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [dialogueScore, setDialogueScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [dialogueFeedback, setDialogueFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const filteredVocab = ENGLISH_VOCABULARY.filter(
    (item) => vocabCategory === 'all' || item.category === vocabCategory
  );

  const currentDialogue: EnglishDialogue = ENGLISH_DIALOGUES[dialogueIndex];

  // Grade Quiz handlers
  const currentQuiz = gradeQuizList[quizIndex % gradeQuizList.length];
  const handleSelectQuizOption = (idx: number) => {
    if (quizAnswered) return;
    setSelectedQuizOption(idx);
    setQuizAnswered(true);

    if (idx === currentQuiz.correctIndex) {
      soundFx.playCorrect(settings.soundEnabled);
      soundFx.playStar(settings.soundEnabled);
      setQuizScore((prev) => prev + 1);
    } else {
      soundFx.playWrong(settings.soundEnabled);
    }
  };

  const handleNextQuiz = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedQuizOption(null);
    setQuizAnswered(false);

    if (quizIndex + 1 < gradeQuizList.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      onFinishExercise('english', 'grade_quiz', quizScore + (selectedQuizOption === currentQuiz.correctIndex ? 1 : 0), gradeQuizList.length, 3);
      setQuizIndex(0);
      setQuizScore(0);
    }
  };

  // Dialogue selection
  const handleSelectOption = (opt: EnglishDialogue['options'][0]) => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedOptionId(opt.id);

    if (opt.isCorrect) {
      soundFx.playSuccess(settings.soundEnabled);
      setDialogueFeedback('correct');
      setDialogueScore((s) => s + 1);
      speakText(opt.responseEn, 'en', settings.speechEnabled);
    } else {
      soundFx.playError(settings.soundEnabled);
      setDialogueFeedback('wrong');
      speakText(opt.responseEn, 'en', settings.speechEnabled);
    }
  };

  const handleNextDialogue = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedOptionId(null);
    setDialogueFeedback('none');

    if (dialogueIndex + 1 < ENGLISH_DIALOGUES.length) {
      setDialogueIndex((prev) => prev + 1);
      const nextDlg = ENGLISH_DIALOGUES[dialogueIndex + 1];
      speakText(nextDlg.soundPronounceEn, 'en', settings.speechEnabled);
    } else {
      onFinishExercise('english', 'dialogue', dialogueScore, ENGLISH_DIALOGUES.length, 3);
      setDialogueIndex(0);
      setDialogueScore(0);
    }
  };

  const handlePlayDialogueQuestion = () => {
    soundFx.playPop(settings.soundEnabled);
    speakText(currentDialogue.soundPronounceEn, 'en', true);
  };

  return (
    <div className="space-y-4">
      {/* Grade Synchronized Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-2xl border border-white/20 shadow-xs">
            🇬🇧
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-300 text-slate-900 font-black text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                {currentGradeInfo.titleVi} ({currentGradeInfo.ageRange})
              </span>
              <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white/30">
                ⚡ Chuẩn Cambridge Primary & Bộ GD&ĐT
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-1">Tiếng Anh Tiểu Học Hội Nhập</h2>
            <p className="text-xs text-blue-100 font-medium">{currentGradeInfo.englishFocus}</p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-2xl p-2.5 border border-indigo-200 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setCategory('grade_curriculum');
              setMode('grade_quiz');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              category === 'grade_curriculum'
                ? 'bg-blue-600 text-white shadow-xs scale-102 ring-2 ring-blue-300'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>Chương Trình {currentGradeInfo.titleVi}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setCategory('ai');
              setMode('ai_challenge');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              category === 'ai'
                ? 'bg-purple-600 text-white shadow-xs scale-102 ring-2 ring-purple-300'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>✨ Thử Thách AI Cấp Lớp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setCategory('thinking');
              setMode('english_math');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              category === 'thinking'
                ? 'bg-indigo-600 text-white shadow-xs scale-102'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Tiếng Anh Tư Duy (Toán & Xếp chữ)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setCategory('foundation');
              setMode('dialogue');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              category === 'foundation'
                ? 'bg-emerald-600 text-white shadow-xs scale-102'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Giao Tiếp & Phonics</span>
          </button>
        </div>
      </div>

      {/* Sub-Mode Navigation Tabs */}
      {category === 'thinking' && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('english_math');
            }}
            className={`p-2.5 rounded-2xl font-black text-xs border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'english_math'
                ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-blue-50 border-blue-200'
            }`}
          >
            <span className="text-base">🔤</span>
            <span>Math in English (Toán Tiếng Anh)</span>
          </button>

          <button
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('word_scramble');
            }}
            className={`p-2.5 rounded-2xl font-black text-xs border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'word_scramble'
                ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-blue-50 border-blue-200'
            }`}
          >
            <span className="text-base">🐝</span>
            <span>Word Scramble (Xếp Chữ)</span>
          </button>
        </div>
      )}

      {category === 'foundation' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            id="btn-english-mode-dialogue"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('dialogue');
              speakText(currentDialogue.soundPronounceEn, 'en', settings.speechEnabled);
            }}
            className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              mode === 'dialogue'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border-emerald-200'
            }`}
          >
            <span className="text-xl">💬</span>
            <span>{t.enModeDialogue}</span>
          </button>

          <button
            id="btn-english-mode-comm"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('communication');
            }}
            className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              mode === 'communication'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border-emerald-200'
            }`}
          >
            <span className="text-xl">🗣️</span>
            <span>{t.enModeCommunication}</span>
          </button>

          <button
            id="btn-english-mode-phonics"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('phonics');
            }}
            className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              mode === 'phonics'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border-emerald-200'
            }`}
          >
            <span className="text-xl">🔤</span>
            <span>{t.enModePhonics}</span>
          </button>

          <button
            id="btn-english-mode-vocab"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setMode('vocab');
            }}
            className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              mode === 'vocab'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border-emerald-200'
            }`}
          >
            <span className="text-xl">📚</span>
            <span>{t.enModeVocab}</span>
          </button>
        </div>
      )}

      {/* AI THỬ THÁCH THÍCH ỨNG THEO LỚP */}
      {category === 'ai' && (
        <AIPracticeCard
          subject="english"
          gradeLevel={gradeLevel}
          childName={childName}
          settings={settings}
          onAnswerCorrect={(stars) => {
            onFinishExercise('english', 'ai_challenge', 1, 1, stars);
          }}
        />
      )}

      {/* CHƯƠNG TRÌNH TIẾNG ANH THEO CẤP LỚP */}
      {category === 'grade_curriculum' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-blue-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-blue-100">
            <div>
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Question {(quizIndex % gradeQuizList.length) + 1}/{gradeQuizList.length} • {currentQuiz.topic} ({currentGradeInfo.titleVi})
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-2">
                {currentQuiz.question}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => speakText(currentQuiz.question, 'en', settings.speechEnabled)}
                className="p-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                title="Listen to question"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <span className="font-black text-amber-600 text-sm bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                ⭐ {quizScore}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedQuizOption === idx;
              const isCorrect = idx === currentQuiz.correctIndex;
              let btnStyle = 'bg-white hover:bg-blue-50 border-blue-200 text-slate-800';

              if (quizAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600';
                } else {
                  btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizOption(idx)}
                  disabled={quizAnswered}
                  className={`p-4 rounded-2xl font-bold text-left border-2 transition-all cursor-pointer flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-7 h-7 rounded-xl bg-black/10 flex items-center justify-center text-sm font-black shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>

          {quizAnswered && (
            <div className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              selectedQuizOption === currentQuiz.correctIndex
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <div className="text-sm font-medium">
                <span className="font-black block text-base mb-1">
                  {selectedQuizOption === currentQuiz.correctIndex ? '🎉 Awesome!' : '💡 Explanation & Meaning:'}
                </span>
                {currentQuiz.explanation}
              </div>
              <button
                onClick={handleNextQuiz}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow cursor-pointer flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* THINKING MODES */}
      {category === 'thinking' && (mode === 'english_math' || mode === 'word_scramble') && (
        <EnglishThinkingGame
          settings={settings}
          mode={mode}
          onFinishExercise={onFinishExercise}
        />
      )}

      {/* MODE 1: INTERACTIVE DIALOGUE (HỘI THOẠI PHẢN XẠ) */}
      {category === 'foundation' && mode === 'dialogue' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                Hội thoại {dialogueIndex + 1}/{ENGLISH_DIALOGUES.length}
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 mt-1">{t.enDialoguePrompt}</h3>
            </div>
            <span className="font-black text-amber-600 text-sm bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {dialogueScore}
            </span>
          </div>

          {/* Animated Mascot Speech Bubble */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50/70 p-5 sm:p-6 rounded-3xl border-2 border-emerald-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="text-6xl sm:text-7xl shrink-0 p-3 bg-white rounded-3xl shadow-sm border border-emerald-100 animate-bounce-gentle">
              {currentDialogue.characterEmoji}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-extrabold text-sm text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-full">
                  {currentDialogue.characterName}
                </span>
                <button
                  id="btn-speak-dialogue-prompt"
                  onClick={handlePlayDialogueQuestion}
                  className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all cursor-pointer shadow active:scale-95"
                  title="Nghe câu hỏi"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-2xl sm:text-3xl font-black text-emerald-950">
                "{currentDialogue.questionEn}"
              </p>
              <p className="text-sm font-semibold text-emerald-700">
                ({currentDialogue.questionVi})
              </p>
            </div>
          </div>

          {/* Dialogue Choice Options */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 text-center">
              💡 Bé hãy lắng nghe và chọn câu trả lời tự tin, đúng ngữ cảnh nhất:
            </p>

            <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto">
              {currentDialogue.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer active:scale-98 flex items-center justify-between gap-3 ${
                      isSelected && dialogueFeedback === 'correct'
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                        : isSelected && dialogueFeedback === 'wrong'
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-emerald-50/40 hover:bg-emerald-100/70 border-emerald-200 text-slate-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-black text-base sm:text-lg">
                        {opt.textEn}
                      </div>
                      <div className={`text-xs font-medium ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                        {opt.textVi}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(opt.textEn, 'en', true);
                      }}
                      className="p-2 rounded-xl bg-white/80 text-emerald-700 hover:bg-white shrink-0 border border-emerald-300"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Correct / Feedback Display */}
          {dialogueFeedback === 'correct' && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-between">
              <span className="font-black text-emerald-900 text-sm sm:text-base">
                🎉 Bé giỏi lắm! Giao tiếp rất chuẩn xác và tự tin!
              </span>
              <button
                id="btn-next-dialogue"
                onClick={handleNextDialogue}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>{t.nextQuestion}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: DAILY COMMUNICATION PHRASES (TỰ TIN GIAO TIẾP HẰNG NGÀY) */}
      {category === 'foundation' && mode === 'communication' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                Mẫu câu {activePhraseIndex + 1}/{DAILY_COMMUNICATION_PHRASES.length}
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 mt-1">Cùng Nói To Tiếng Anh Tự Tin Nhé!</h3>
            </div>
            <button
              onClick={() => {
                const next = (activePhraseIndex + 1) % DAILY_COMMUNICATION_PHRASES.length;
                setActivePhraseIndex(next);
                speakText(DAILY_COMMUNICATION_PHRASES[next].soundText, 'en', settings.speechEnabled);
              }}
              className="p-2 bg-emerald-100 text-emerald-800 rounded-xl hover:bg-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Mẫu câu tiếp theo</span>
            </button>
          </div>

          {/* Active Phrase Big Card */}
          {(() => {
            const cur = DAILY_COMMUNICATION_PHRASES[activePhraseIndex];
            return (
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 sm:p-8 rounded-3xl shadow-lg text-center space-y-4 relative overflow-hidden">
                <div className="text-6xl sm:text-7xl animate-bounce-gentle inline-block">
                  {cur.mascot}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-100">
                    Ngữ cảnh: {cur.situationVi}
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-black text-amber-200 leading-tight">
                    "{cur.phraseEn}"
                  </h2>
                  <p className="text-lg font-bold text-white/95">
                    {cur.meaningVi}
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => speakText(cur.soundText, 'en', true)}
                    className="px-5 py-3 bg-white text-emerald-900 rounded-2xl font-black text-sm shadow-md hover:bg-amber-100 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Volume2 className="w-5 h-5 text-emerald-600" />
                    <span>Nghe giọng bản xứ chuẩn 🗣️</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playSuccess(settings.soundEnabled);
                      onFinishExercise('english', 'communication', 1, 1, 1);
                    }}
                    className="px-4 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-2xl font-black text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-900" />
                    <span>Con đã nói theo xong! ⭐</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Mini carousel of all phrases */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {DAILY_COMMUNICATION_PHRASES.map((ph, idx) => (
              <button
                key={ph.id}
                onClick={() => {
                  soundFx.playPop(settings.soundEnabled);
                  setActivePhraseIndex(idx);
                  speakText(ph.soundText, 'en', settings.speechEnabled);
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  activePhraseIndex === idx
                    ? 'bg-emerald-100 border-emerald-500 font-bold'
                    : 'bg-white border-slate-200 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{ph.mascot}</span>
                  <span className="text-xs font-extrabold text-slate-800 line-clamp-1">{ph.phraseEn}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: PHONICS & ALPHABET (NGỮ ÂM & BẢNG CHỮ CÁI TIẾNG ANH) */}
      {category === 'foundation' && mode === 'phonics' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Bảng Chữ Cái & Ngữ Âm Phonics Tiếng Anh</h3>
              <p className="text-xs text-slate-500">Chạm vào từng chữ cái để nghe phát âm và câu ví dụ sinh động</p>
            </div>
            <button
              onClick={() => speakText(selectedPhonics.sentence, 'en', true)}
              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Phát âm câu</span>
            </button>
          </div>

          {/* Active Phonics Highlight Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-3xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white text-emerald-800 rounded-2xl flex items-center justify-center font-black text-4xl sm:text-5xl shadow-inner">
                {selectedPhonics.letter}
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-100">Phonics Word:</span>
                <h4 className="text-2xl sm:text-3xl font-black text-amber-200 flex items-center gap-2">
                  <span>{selectedPhonics.word}</span>
                  <span className="text-3xl">{selectedPhonics.emoji}</span>
                </h4>
                <p className="text-xs font-mono text-white/80">{selectedPhonics.phonetic}</p>
              </div>
            </div>

            <button
              onClick={() => speakText(`${selectedPhonics.letter}, ${selectedPhonics.word}, ${selectedPhonics.sentence}`, 'en', true)}
              className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl cursor-pointer"
              title="Nghe phát âm"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          {/* 26 Letters Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
            {PHONICS_ALPHABET.map((item) => {
              const isSelected = selectedPhonics.letter === item.letter;
              return (
                <button
                  key={item.letter}
                  onClick={() => {
                    soundFx.playPop(settings.soundEnabled);
                    setSelectedPhonics(item);
                    speakText(`${item.letter}, ${item.word}`, 'en', settings.speechEnabled);
                  }}
                  className={`p-2 sm:p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer active:scale-95 flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                      : 'bg-emerald-50/40 hover:bg-emerald-100 border-emerald-200 text-slate-800'
                  }`}
                >
                  <span className="text-xl sm:text-2xl font-black">{item.letter}</span>
                  <span className="text-base sm:text-lg">{item.emoji}</span>
                  <span className="text-[10px] font-bold truncate max-w-full">{item.word}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 4: THEMATIC VOCABULARY (TỪ VỰNG THEO CHỦ ĐỀ) */}
      {category === 'foundation' && mode === 'vocab' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">{t.enModeVocab}</h3>
              <p className="text-xs text-slate-500">Học từ vựng qua hình ảnh và câu ví dụ bản xứ</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'animals', label: '🐱 Động vật' },
                { id: 'colors', label: '🎨 Màu sắc' },
                { id: 'fruits', label: '🍎 Trái cây' },
                { id: 'school', label: '🎒 Trường học' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setVocabCategory(cat.id as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    vocabCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vocab Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredVocab.map((item) => {
              const isActive = activeVocabId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    soundFx.playPop(settings.soundEnabled);
                    setActiveVocabId(item.id);
                    speakText(item.wordEn, 'en', settings.speechEnabled);
                  }}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'bg-emerald-50 border-emerald-500 shadow-md scale-102'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{item.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-black text-slate-900">{item.wordEn}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(item.wordEn, 'en', true);
                          }}
                          className="p-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 font-mono">{item.pronouncePhonetic}</p>
                      <p className="text-sm font-bold text-emerald-800">{item.meaningVi}</p>
                    </div>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-2xl border border-emerald-100 space-y-0.5 text-xs">
                    <p className="font-bold text-slate-800">"{item.exampleSentenceEn}"</p>
                    <p className="text-slate-500">{item.exampleSentenceVi}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
