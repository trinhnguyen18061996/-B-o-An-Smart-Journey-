import React, { useState } from 'react';
import { Volume2, Sparkles, HelpCircle, CheckCircle2, RotateCcw, ChevronRight } from 'lucide-react';
import { Language, ParentSettings, VietnameseGameMode } from '../types';
import {
  VIETNAMESE_ALPHABET,
  VIETNAMESE_TONES,
  RHYME_PUZZLES,
  MISSING_LETTER_QUESTIONS,
  WORD_MATCH_QUESTIONS,
  RhymePuzzle,
  MissingLetterQuestion,
  WordMatchQuestion,
  AlphabetItem,
} from '../data/lessons';
import { translations } from '../utils/translations';
import { soundFx, speakText } from '../utils/audio';

interface VietnameseGameProps {
  settings: ParentSettings;
  onFinishExercise: (subject: 'vietnamese', mode: string, score: number, total: number, stars: number) => void;
}

export const VietnameseGame: React.FC<VietnameseGameProps> = ({
  settings,
  onFinishExercise,
}) => {
  const [mode, setMode] = useState<VietnameseGameMode>('alphabet');
  const t = translations[settings.language];

  // Alphabet quiz state
  const [selectedLetter, setSelectedLetter] = useState<AlphabetItem>(VIETNAMESE_ALPHABET[0]);
  const [letterQuizTarget, setLetterQuizTarget] = useState<AlphabetItem>(VIETNAMESE_ALPHABET[0]);
  const [letterQuizOptions, setLetterQuizOptions] = useState<AlphabetItem[]>([]);
  const [letterQuizStep, setLetterQuizStep] = useState<number>(0);
  const [letterQuizScore, setLetterQuizScore] = useState<number>(0);
  const [showToneTab, setShowToneTab] = useState<boolean>(false);

  // Rhyme state
  const [rhymeIndex, setRhymeIndex] = useState(0);
  const [currentSlots, setCurrentSlots] = useState<string[]>([]);
  const [rhymeScore, setRhymeScore] = useState(0);
  const [rhymeFeedback, setRhymeFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // Missing letter state
  const [missingIndex, setMissingIndex] = useState(0);
  const [missingScore, setMissingScore] = useState(0);
  const [missingFeedback, setMissingFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [selectedMissingChar, setSelectedMissingChar] = useState<string | null>(null);

  // Word match state
  const [matchIndex, setMatchIndex] = useState(0);
  const [matchScore, setMatchScore] = useState(0);
  const [matchFeedback, setMatchFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Initialize a letter quiz round
  const startLetterQuiz = () => {
    const target = VIETNAMESE_ALPHABET[Math.floor(Math.random() * VIETNAMESE_ALPHABET.length)];
    setLetterQuizTarget(target);
    const options = [target];
    while (options.length < 4) {
      const candidate = VIETNAMESE_ALPHABET[Math.floor(Math.random() * VIETNAMESE_ALPHABET.length)];
      if (!options.some((o) => o.letter === candidate.letter)) {
        options.push(candidate);
      }
    }
    setLetterQuizOptions(options.sort(() => Math.random() - 0.5));
    speakText(target.soundPronounceVi, 'vi', settings.speechEnabled);
  };

  const handleLetterOptionClick = (opt: AlphabetItem) => {
    if (opt.letter === letterQuizTarget.letter) {
      soundFx.playSuccess(settings.soundEnabled);
      setLetterQuizScore((prev) => prev + 1);
      if (letterQuizStep + 1 >= 5) {
        onFinishExercise('vietnamese', 'alphabet', letterQuizScore + 1, 5, 3);
        setLetterQuizStep(0);
        setLetterQuizScore(0);
      } else {
        setLetterQuizStep((prev) => prev + 1);
        startLetterQuiz();
      }
    } else {
      soundFx.playError(settings.soundEnabled);
      speakText('Bé hãy nghe lại nhé: ' + letterQuizTarget.soundPronounceVi, 'vi', settings.speechEnabled);
    }
  };

  // Rhyme handlers
  const currentRhyme: RhymePuzzle = RHYME_PUZZLES[rhymeIndex];
  const handleSlotAdd = (char: string) => {
    soundFx.playPop(settings.soundEnabled);
    const newSlots = [...currentSlots, char];
    setCurrentSlots(newSlots);

    if (newSlots.length === currentRhyme.parts.length) {
      const assembled = newSlots.join('');
      if (assembled === currentRhyme.targetWord) {
        soundFx.playSuccess(settings.soundEnabled);
        setRhymeFeedback('correct');
        setRhymeScore((s) => s + 1);
        speakText(currentRhyme.targetWord + ', ' + currentRhyme.meaningVi, 'vi', settings.speechEnabled);
      } else {
        soundFx.playError(settings.soundEnabled);
        setRhymeFeedback('wrong');
      }
    }
  };

  const handleNextRhyme = () => {
    soundFx.playPop(settings.soundEnabled);
    setCurrentSlots([]);
    setRhymeFeedback('none');
    if (rhymeIndex + 1 < RHYME_PUZZLES.length) {
      setRhymeIndex((prev) => prev + 1);
    } else {
      onFinishExercise('vietnamese', 'rhyme_builder', rhymeScore + (rhymeFeedback === 'correct' ? 1 : 0), RHYME_PUZZLES.length, 3);
      setRhymeIndex(0);
      setRhymeScore(0);
    }
  };

  // Missing letter handlers
  const currentMissing: MissingLetterQuestion = MISSING_LETTER_QUESTIONS[missingIndex];
  const handleSelectMissing = (opt: string) => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedMissingChar(opt);
    if (opt === currentMissing.missingChar) {
      soundFx.playSuccess(settings.soundEnabled);
      setMissingFeedback('correct');
      setMissingScore((s) => s + 1);
      speakText(currentMissing.fullWordVi, 'vi', settings.speechEnabled);
    } else {
      soundFx.playError(settings.soundEnabled);
      setMissingFeedback('wrong');
    }
  };

  const handleNextMissing = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedMissingChar(null);
    setMissingFeedback('none');
    if (missingIndex + 1 < MISSING_LETTER_QUESTIONS.length) {
      setMissingIndex((prev) => prev + 1);
    } else {
      onFinishExercise('vietnamese', 'missing_letter', missingScore, MISSING_LETTER_QUESTIONS.length, 3);
      setMissingIndex(0);
      setMissingScore(0);
    }
  };

  // Word match handlers
  const currentMatch: WordMatchQuestion = WORD_MATCH_QUESTIONS[matchIndex];
  const handleSelectMatch = (word: string) => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedWord(word);
    const isCorrect = word === currentMatch.correctWordVi || word === currentMatch.correctWordEn;
    if (isCorrect) {
      soundFx.playSuccess(settings.soundEnabled);
      setMatchFeedback('correct');
      setMatchScore((s) => s + 1);
      speakText(currentMatch.correctWordVi, 'vi', settings.speechEnabled);
    } else {
      soundFx.playError(settings.soundEnabled);
      setMatchFeedback('wrong');
    }
  };

  const handleNextMatch = () => {
    soundFx.playPop(settings.soundEnabled);
    setSelectedWord(null);
    setMatchFeedback('none');
    if (matchIndex + 1 < WORD_MATCH_QUESTIONS.length) {
      setMatchIndex((prev) => prev + 1);
    } else {
      onFinishExercise('vietnamese', 'word_match', matchScore, WORD_MATCH_QUESTIONS.length, 3);
      setMatchIndex(0);
      setMatchScore(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          id="btn-vn-mode-alphabet"
          onClick={() => {
            soundFx.playPop(settings.soundEnabled);
            setMode('alphabet');
          }}
          className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
            mode === 'alphabet'
              ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-rose-50 border-rose-200'
          }`}
        >
          <span className="text-xl">🔤</span>
          <span>{t.vnModeAlphabet}</span>
        </button>

        <button
          id="btn-vn-mode-rhyme"
          onClick={() => {
            soundFx.playPop(settings.soundEnabled);
            setMode('rhyme_builder');
          }}
          className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
            mode === 'rhyme_builder'
              ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-rose-50 border-rose-200'
          }`}
        >
          <span className="text-xl">🧩</span>
          <span>{t.vnModeRhyme}</span>
        </button>

        <button
          id="btn-vn-mode-missing"
          onClick={() => {
            soundFx.playPop(settings.soundEnabled);
            setMode('missing_letter');
          }}
          className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
            mode === 'missing_letter'
              ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-rose-50 border-rose-200'
          }`}
        >
          <span className="text-xl">✏️</span>
          <span>{t.vnModeMissing}</span>
        </button>

        <button
          id="btn-vn-mode-match"
          onClick={() => {
            soundFx.playPop(settings.soundEnabled);
            setMode('word_match');
          }}
          className={`p-2.5 sm:p-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
            mode === 'word_match'
              ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-rose-50 border-rose-200'
          }`}
        >
          <span className="text-xl">🎯</span>
          <span>{t.vnModeMatch}</span>
        </button>
      </div>

      {/* GAME MODE 1: ALPHABET & TONES */}
      {mode === 'alphabet' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-rose-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-100">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                {showToneTab ? 'Dấu Thanh Tiếng Việt (6 Thanh)' : 'Bảng 29 Chữ Cái Tiếng Việt'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">{t.listenPrompt}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-tone-tab"
                onClick={() => {
                  soundFx.playPop(settings.soundEnabled);
                  setShowToneTab(!showToneTab);
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
              >
                {showToneTab ? 'Xem Chữ Cái' : 'Xem Dấu Thanh'}
              </button>
              <button
                id="btn-start-letter-quiz"
                onClick={() => {
                  soundFx.playPop(settings.soundEnabled);
                  setLetterQuizStep(1);
                  startLetterQuiz();
                }}
                className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow hover:from-rose-600 hover:to-pink-600 cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Thử Thách Đố Vui 🎯</span>
              </button>
            </div>
          </div>

          {/* Letter Quiz Mini-Modal or In-place */}
          {letterQuizStep > 0 ? (
            <div className="bg-rose-50/80 rounded-2xl p-5 border-2 border-rose-300 text-center space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                <span>Câu {letterQuizStep}/5</span>
                <span>Điểm: {letterQuizScore} ⭐</span>
              </div>
              <p className="text-sm font-bold text-slate-700">
                {settings.language === 'vi' ? 'Bé hãy lắng nghe và chọn đúng chữ cái nhé:' : 'Listen and choose the matching letter:'}
              </p>
              <div className="flex justify-center">
                <button
                  id="btn-speak-quiz-letter"
                  onClick={() => speakText(letterQuizTarget.soundPronounceVi, 'vi', settings.speechEnabled)}
                  className="px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-lg flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
                >
                  <Volume2 className="w-6 h-6 animate-pulse" />
                  <span>Nghe Phát Âm 🔊</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
                {letterQuizOptions.map((opt) => (
                  <button
                    key={opt.letter}
                    onClick={() => handleLetterOptionClick(opt)}
                    className="p-4 rounded-2xl bg-white hover:bg-rose-100 border-2 border-rose-300 font-black text-2xl text-rose-700 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    {opt.letter} {opt.lower}
                  </button>
                ))}
              </div>

              <button
                id="btn-exit-letter-quiz"
                onClick={() => setLetterQuizStep(0)}
                className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Quay lại bảng chữ cái
              </button>
            </div>
          ) : !showToneTab ? (
            <>
              {/* Selected Letter Spotlight Card */}
              <div className="bg-gradient-to-r from-rose-100 via-pink-50 to-amber-100 rounded-2xl p-4 border-2 border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-2xl border-2 border-rose-400 flex items-center justify-center font-black text-4xl text-rose-600 shadow-sm">
                    {selectedLetter.letter} <span className="text-2xl text-slate-500 ml-1">{selectedLetter.lower}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-slate-800 flex items-center gap-2">
                      <span>{selectedLetter.nameVi}</span>
                      <span className="text-2xl">{selectedLetter.emoji}</span>
                    </h4>
                    <p className="text-sm font-bold text-rose-700 mt-0.5">
                      Ví dụ: {selectedLetter.exampleWordVi} ({selectedLetter.exampleWordEn})
                    </p>
                  </div>
                </div>

                <button
                  id="btn-speak-selected-letter"
                  onClick={() => {
                    speakText(selectedLetter.soundPronounceVi + ', ' + selectedLetter.exampleWordVi, 'vi', settings.speechEnabled);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Phát Âm Chuẩn 🔊</span>
                </button>
              </div>

              {/* Alphabet Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {VIETNAMESE_ALPHABET.map((item) => {
                  const isSelected = selectedLetter.letter === item.letter;
                  return (
                    <button
                      key={item.letter}
                      onClick={() => {
                        soundFx.playPop(settings.soundEnabled);
                        setSelectedLetter(item);
                        speakText(item.soundPronounceVi, 'vi', settings.speechEnabled);
                      }}
                      className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-105'
                          : 'bg-white hover:bg-rose-50 border-rose-200 text-slate-800'
                      }`}
                    >
                      <div className="text-xl font-black">{item.letter}</div>
                      <div className="text-xs opacity-75 font-bold">{item.lower}</div>
                      <div className="text-sm mt-0.5">{item.emoji}</div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Tone marks */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {VIETNAMESE_TONES.map((tone) => (
                <div
                  key={tone.nameVi}
                  className="p-4 bg-rose-50/70 rounded-2xl border-2 border-rose-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-rose-800 text-base">{tone.nameVi}</h4>
                    <span className="text-2xl font-black text-rose-600 bg-white px-2 py-0.5 rounded-lg border border-rose-200">
                      {tone.mark}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600">{tone.descVi}</p>
                  <p className="text-xs font-bold text-rose-600">Ví dụ: {tone.example}</p>
                  <button
                    onClick={() => speakText(tone.nameVi + ': ' + tone.example, 'vi', settings.speechEnabled)}
                    className="w-full mt-2 py-1 bg-white hover:bg-rose-100 text-rose-700 text-xs font-extrabold rounded-xl border border-rose-300 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe ví dụ</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GAME MODE 2: RHYME BUILDER */}
      {mode === 'rhyme_builder' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-rose-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <div>
              <span className="text-xs font-extrabold text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
                Bài {rhymeIndex + 1}/{RHYME_PUZZLES.length}
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 mt-1">{t.spellTogether}</h3>
            </div>
            <span className="font-black text-amber-600 text-sm bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {rhymeScore}
            </span>
          </div>

          {/* Prompt with big mascot/emoji illustration */}
          <div className="text-center py-2">
            <div className="text-6xl sm:text-7xl mb-2 animate-bounce-gentle inline-block">
              {currentRhyme.emoji}
            </div>
            <h4 className="text-lg sm:text-xl font-black text-slate-800">
              {currentRhyme.meaningVi}
            </h4>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {currentRhyme.hintVi}
            </p>
          </div>

          {/* Assembling Letter Slot Boxes */}
          <div className="flex justify-center items-center gap-3">
            {currentRhyme.parts.map((part, i) => {
              const charInSlot = currentSlots[i];
              return (
                <div
                  key={i}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 flex items-center justify-center font-black text-3xl transition-all ${
                    charInSlot
                      ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm'
                      : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
                  }`}
                >
                  {charInSlot || '?'}
                </div>
              );
            })}
          </div>

          {/* Letter choices to pick */}
          <div className="text-center">
            <p className="text-xs font-bold text-slate-600 mb-2">
              {settings.language === 'vi' ? 'Bé hãy chạm vào chữ cái để ghép:' : 'Tap letter to add:'}
            </p>
            <div className="flex justify-center flex-wrap gap-2.5">
              {currentRhyme.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSlotAdd(opt)}
                  disabled={currentSlots.length >= currentRhyme.parts.length}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 disabled:opacity-40 text-white font-black text-2xl shadow-md active:scale-95 cursor-pointer transition-all border border-rose-400 flex items-center justify-center"
                >
                  {opt}
                </button>
              ))}

              <button
                id="btn-reset-rhyme-slots"
                onClick={() => {
                  soundFx.playPop(settings.soundEnabled);
                  setCurrentSlots([]);
                  setRhymeFeedback('none');
                }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold border border-slate-300 flex items-center justify-center cursor-pointer active:scale-95"
                title="Xóa ghép lại"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Feedback banner & Next Button */}
          {rhymeFeedback === 'correct' && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="font-black text-emerald-800 text-base">{t.correct}</span>
              </div>
              <button
                id="btn-next-rhyme"
                onClick={handleNextRhyme}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1"
              >
                <span>{t.nextQuestion}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {rhymeFeedback === 'wrong' && (
            <div className="p-3 bg-rose-100 border-2 border-rose-300 rounded-2xl text-center text-rose-700 font-bold text-sm">
              {t.tryAgain}
            </div>
          )}
        </div>
      )}

      {/* GAME MODE 3: MISSING LETTER */}
      {mode === 'missing_letter' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-rose-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <span className="text-xs font-extrabold text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
              Câu {missingIndex + 1}/{MISSING_LETTER_QUESTIONS.length}
            </span>
            <span className="font-black text-amber-600 text-sm bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {missingScore}
            </span>
          </div>

          <div className="text-center py-2">
            <div className="text-6xl sm:text-7xl mb-2 animate-bounce-gentle inline-block">
              {currentMissing.emoji}
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide">
              {currentMissing.wordWithBlank}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{t.fillInBlankPrompt}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
            {currentMissing.options.map((opt) => {
              const isChosen = selectedMissingChar === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelectMissing(opt)}
                  className={`p-4 rounded-2xl font-black text-2xl border-2 transition-all cursor-pointer active:scale-95 ${
                    isChosen && missingFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                      : isChosen && missingFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-800'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {missingFeedback === 'correct' && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-between">
              <span className="font-black text-emerald-800">{t.correct} ({currentMissing.fullWordVi})</span>
              <button
                id="btn-next-missing"
                onClick={handleNextMissing}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1"
              >
                <span>{t.nextQuestion}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME MODE 4: WORD & PICTURE MATCH */}
      {mode === 'word_match' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-rose-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <span className="text-xs font-extrabold text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
              Câu {matchIndex + 1}/{WORD_MATCH_QUESTIONS.length}
            </span>
            <span className="font-black text-amber-600 text-sm bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              ⭐ {matchScore}
            </span>
          </div>

          <div className="text-center py-3">
            <div className="text-7xl sm:text-8xl mb-2 animate-bounce-gentle inline-block">
              {currentMatch.emoji}
            </div>
            <p className="text-sm font-bold text-slate-600">{t.chooseCorrectWord}</p>
          </div>

          <div className="space-y-2.5 max-w-md mx-auto">
            {currentMatch.optionsVi.map((opt, idx) => {
              const isSelected = selectedWord === opt;
              const isRightWord = opt === currentMatch.correctWordVi;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectMatch(opt)}
                  className={`w-full p-4 rounded-2xl font-black text-base sm:text-lg border-2 text-left transition-all cursor-pointer active:scale-98 flex items-center justify-between ${
                    isSelected && matchFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                      : isSelected && matchFeedback === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white hover:bg-rose-50 border-rose-200 text-slate-800'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && matchFeedback === 'correct' && <CheckCircle2 className="w-6 h-6" />}
                </button>
              );
            })}
          </div>

          {matchFeedback === 'correct' && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-between">
              <span className="font-black text-emerald-800">{t.correct}</span>
              <button
                id="btn-next-match"
                onClick={handleNextMatch}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1"
              >
                <span>{t.nextQuestion}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
