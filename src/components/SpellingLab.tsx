import React, { useState, useEffect, useRef } from 'react';
import { UserStats } from '../types';
import { DEFAULT_WORDS, saveUserStats } from '../utils/storage';
import { evaluateAndUnlockAchievements } from '../utils/achievements';
import { getRankedVoices, isBritishVoice, speakWord, stopSpeech } from '../utils/speech';
import { 
  Volume2, 
  Play, 
  RotateCcw, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  SkipForward, 
  Sparkles,
  Users,
  Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpellingLabProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onBackToDashboard: () => void;
}

export const SpellingLab: React.FC<SpellingLabProps> = ({
  stats,
  onUpdateStats,
  onBackToDashboard
}) => {
  const [words, setWords] = useState<string[]>(stats.spelling.words || DEFAULT_WORDS);
  const [wordInput, setWordInput] = useState<string>((stats.spelling.words || DEFAULT_WORDS).join('\n'));
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(stats.spelling.voiceURI || '');
  const [rate, setRate] = useState<number>(0.75);

  // Play mode: 'idle' | 'practice' | 'solo' | 'two'
  const [activeMode, setActiveMode] = useState<'idle' | 'practice' | 'solo' | 'two'>('idle');
  const [currentWord, setCurrentWord] = useState<string>('');
  const [typedInput, setTypedInput] = useState<string>('');
  const [revealed, setRevealed] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; word: string; typed: string } | null>(null);

  // Game metrics
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [soloSeconds, setSoloSeconds] = useState<number>(60);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [round, setRound] = useState<number>(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const liveScoreRef = useRef<number>(score);
  const liveStreakRef = useRef<number>(streak);

  useEffect(() => {
    liveScoreRef.current = score;
  }, [score]);

  useEffect(() => {
    liveStreakRef.current = streak;
  }, [streak]);

  // Clean up any ongoing speech synthesis when leaving SpellingLab
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Load browser voices
  useEffect(() => {
    const updateVoices = () => {
      const list = getRankedVoices();
      setVoices(list);
      if (!selectedVoiceURI && list.length > 0) {
        const best = list.find(isBritishVoice) || list[0];
        setSelectedVoiceURI(best.voiceURI);
      }
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoiceURI]);

  // Solo countdown timer
  useEffect(() => {
    if (activeMode !== 'solo') return;
    const interval = setInterval(() => {
      setSoloSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          finishSolo();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeMode]);

  // Focus input on new word
  useEffect(() => {
    if (activeMode !== 'idle') {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [activeMode, currentWord]);

  const ukVoiceCount = voices.filter(isBritishVoice).length;

  const handleSaveWords = () => {
    const parsed = wordInput
      .split(/[\n,;]+/)
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length > 0);
    const uniqueWords = Array.from(new Set(parsed));
    const finalWords = uniqueWords.length ? uniqueWords : DEFAULT_WORDS;

    setWords(finalWords);
    const updated = {
      ...stats,
      spelling: {
        ...stats.spelling,
        words: finalWords
      }
    };
    saveUserStats(updated);
    onUpdateStats(updated);
  };

  const handleLoadDefaults = () => {
    setWordInput(DEFAULT_WORDS.join('\n'));
    setWords(DEFAULT_WORDS);
    const updated = {
      ...stats,
      spelling: {
        ...stats.spelling,
        words: DEFAULT_WORDS
      }
    };
    saveUserStats(updated);
    onUpdateStats(updated);
  };

  const pickNextWord = () => {
    if (!words.length) return '';
    const next = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(next);
    setTypedInput('');
    setRevealed(false);
    setFeedback(null);
    speakWord(next, selectedVoiceURI, rate);
    return next;
  };

  const startMode = (mode: 'practice' | 'solo' | 'two') => {
    handleSaveWords();
    setActiveMode(mode);
    setScore(0);
    liveScoreRef.current = 0;
    setStreak(0);
    liveStreakRef.current = 0;
    setP1Score(0);
    setP2Score(0);
    setTurn(1);
    setRound(1);
    setSoloSeconds(60);
    pickNextWord();
  };

  const finishSolo = () => {
    setActiveMode('idle');
    const finalScore = liveScoreRef.current;
    const finalStreak = liveStreakRef.current;
    const newBest = Math.max(stats.spelling.best || 0, finalScore);
    const candidate = {
      ...stats,
      spelling: {
        ...stats.spelling,
        best: newBest,
        streak: Math.max(stats.spelling.streak || 0, finalStreak)
      }
    };
    const { updatedStats } = evaluateAndUnlockAchievements(candidate, finalStreak, 0, finalScore);
    saveUserStats(updatedStats);
    onUpdateStats(updatedStats);
    confetti({ particleCount: 50, spread: 60 });
  };

  const checkAnswer = () => {
    const cleanTyped = typedInput.trim().toLowerCase();
    const isMatch = cleanTyped === currentWord.toLowerCase();

    setFeedback({ correct: isMatch, word: currentWord, typed: cleanTyped });

    if (isMatch) {
      setScore(s => s + 1);
      setStreak(s => {
        const nextStreak = s + 1;
        if (nextStreak > (stats.spelling.streak || 0)) {
          const candidate = {
            ...stats,
            spelling: { ...stats.spelling, streak: nextStreak }
          };
          const { updatedStats } = evaluateAndUnlockAchievements(candidate, nextStreak, 0, 1);
          saveUserStats(updatedStats);
          onUpdateStats(updatedStats);
        }
        return nextStreak;
      });

      if (activeMode === 'two') {
        if (turn === 1) setP1Score(s => s + 1);
        else setP2Score(s => s + 1);
      }

      setTimeout(() => {
        if (activeMode === 'two') {
          if (round >= 20) {
            setActiveMode('idle');
            confetti({ particleCount: 60, spread: 70 });
            return;
          }
          setRound(r => r + 1);
          setTurn(t => t === 1 ? 2 : 1);
        }
        pickNextWord();
      }, 700);
    } else {
      setStreak(0);
      setTimeout(() => {
        if (activeMode === 'two') {
          if (round >= 20) {
            setActiveMode('idle');
            return;
          }
          setRound(r => r + 1);
          setTurn(t => t === 1 ? 2 : 1);
        }
        pickNextWord();
      }, 1400);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f2b84b]/10 text-[#f2b84b] border border-[#f2b84b]/30 text-xs font-bold uppercase tracking-wider">
            <Volume2 className="w-3.5 h-3.5" />
            British Speech Synthesis
          </div>
          <h2 className="text-2xl font-extrabold text-white">Spelling Lab</h2>
          <p className="text-xs sm:text-sm text-[#9db4b8]">
            Paste your word list, listen to accurate British voice articulation, and challenge yourself or friends.
          </p>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#9db4b8] block">High Score</span>
            <span className="text-xl font-black text-[#f2b84b]">{stats.spelling.best || 0}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#9db4b8] block">Best Streak</span>
            <span className="text-xl font-black text-[#28d4c7]">{stats.spelling.streak || 0}</span>
          </div>
          <button
            onClick={onBackToDashboard}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#9db4b8] hover:text-white bg-[#13262b] border border-[#23444a] cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Configuration & Voice Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Word List Editor */}
        <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase font-extrabold text-[#9db4b8] tracking-wider">
              Revision Word List ({words.length} words)
            </label>
            <button
              onClick={handleLoadDefaults}
              className="text-xs text-[#28d4c7] hover:underline cursor-pointer"
            >
              Reset 50 GL Words
            </button>
          </div>
          <textarea
            value={wordInput}
            onChange={e => setWordInput(e.target.value)}
            placeholder="Enter words separated by commas or lines..."
            className="w-full h-32 bg-[#08171a] border border-[#23444a] rounded-xl p-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#28d4c7] resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveWords}
              className="px-4 py-1.5 rounded-xl bg-[#28d4c7] hover:bg-[#20b2a6] text-[#031011] font-bold text-xs cursor-pointer transition-all"
            >
              Save Words
            </button>
          </div>
        </div>

        {/* Voice Selector & Audio Speed */}
        <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-extrabold text-[#9db4b8] tracking-wider">
                Voice Selection
              </label>
              <span className="text-[11px] text-[#8bd450] font-semibold">
                {ukVoiceCount} UK Voice{ukVoiceCount === 1 ? '' : 's'} Found
              </span>
            </div>

            <select
              value={selectedVoiceURI}
              onChange={e => setSelectedVoiceURI(e.target.value)}
              className="w-full bg-[#08171a] border border-[#23444a] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#28d4c7]"
            >
              {voices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {isBritishVoice(v) ? '🇬🇧 ' : '🌐 '}
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>

            {/* Speech Rate Slider */}
            <div>
              <div className="flex justify-between text-xs text-[#9db4b8] mb-1">
                <span>Articulation Speed</span>
                <span className="text-white font-bold">{rate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                className="w-full accent-[#28d4c7] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => speakWord(words[0] || 'accommodate', selectedVoiceURI, rate)}
              className="flex-1 py-2 px-3 rounded-xl bg-[#13262b] text-white hover:border-[#28d4c7] border border-[#23444a] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Test Voice
            </button>
            <button
              onClick={stopSpeech}
              className="py-2 px-3 rounded-xl bg-[#13262b] text-[#ff6b5f] border border-[#23444a] hover:border-[#ff6b5f] text-xs font-bold cursor-pointer"
            >
              Stop
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => startMode('practice')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeMode === 'practice'
              ? 'bg-[#28d4c7]/15 border-[#28d4c7] text-white shadow-lg'
              : 'bg-[#0d1b1f] border-[#23444a] text-[#9db4b8] hover:border-[#28d4c7] hover:text-white'
          }`}
        >
          <div className="font-bold text-white flex items-center gap-2 mb-1 text-sm">
            <Sparkles className="w-4 h-4 text-[#28d4c7]" />
            Practice Mode
          </div>
          <p className="text-xs text-[#9db4b8]">Untimed drill with audio replays &amp; word reveals.</p>
        </button>

        <button
          onClick={() => startMode('solo')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeMode === 'solo'
              ? 'bg-[#f2b84b]/15 border-[#f2b84b] text-white shadow-lg'
              : 'bg-[#0d1b1f] border-[#23444a] text-[#9db4b8] hover:border-[#f2b84b] hover:text-white'
          }`}
        >
          <div className="font-bold text-white flex items-center gap-2 mb-1 text-sm">
            <Timer className="w-4 h-4 text-[#f2b84b]" />
            60s Timed Solo VS
          </div>
          <p className="text-xs text-[#9db4b8]">Race against the clock to build high-score streaks.</p>
        </button>

        <button
          onClick={() => startMode('two')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeMode === 'two'
              ? 'bg-[#64a6ff]/15 border-[#64a6ff] text-white shadow-lg'
              : 'bg-[#0d1b1f] border-[#23444a] text-[#9db4b8] hover:border-[#64a6ff] hover:text-white'
          }`}
        >
          <div className="font-bold text-white flex items-center gap-2 mb-1 text-sm">
            <Users className="w-4 h-4 text-[#64a6ff]" />
            2-Player Local VS
          </div>
          <p className="text-xs text-[#9db4b8]">Pass the device between Player 1 &amp; Player 2.</p>
        </button>
      </div>

      {/* Active Game Arena */}
      {activeMode !== 'idle' && (
        <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Status ribbon */}
          <div className="flex items-center justify-between border-b border-[#23444a]/80 pb-3">
            <div className="flex items-center gap-3">
              {activeMode === 'solo' && (
                <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#f2b84b]">
                  <Timer className="w-4 h-4" />
                  {soloSeconds}s remaining
                </div>
              )}
              {activeMode === 'two' && (
                <div className="flex items-center gap-3 text-sm font-bold">
                  <span className={turn === 1 ? 'text-[#28d4c7] font-black' : 'text-[#9db4b8]'}>
                    Player 1: {p1Score}
                  </span>
                  <span className="text-[#23444a]">|</span>
                  <span className={turn === 2 ? 'text-[#f2b84b] font-black' : 'text-[#9db4b8]'}>
                    Player 2: {p2Score}
                  </span>
                  <span className="text-xs text-[#9db4b8] ml-2">Round {round}/20</span>
                </div>
              )}
              {activeMode === 'practice' && (
                <span className="text-xs font-bold text-[#28d4c7]">Spelling Practice</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#9db4b8] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#f2b84b]" />
                Streak: <strong className="text-white">{streak}</strong>
              </span>
            </div>
          </div>

          {/* Big Speaker Button */}
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <button
              onClick={() => speakWord(currentWord, selectedVoiceURI, rate)}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#28d4c7] to-[#158d99] hover:brightness-110 active:scale-95 text-[#031011] flex items-center justify-center shadow-xl shadow-[#28d4c7]/20 transition-all cursor-pointer group"
            >
              <Volume2 className="w-9 h-9 group-hover:scale-110 transition-transform" />
            </button>
            <p className="text-xs text-[#9db4b8]">
              Listen carefully, then spell the word below. Click speaker to replay.
            </p>
          </div>

          {/* Input field */}
          <div className="space-y-3 max-w-lg mx-auto">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                spellCheck={false}
                value={typedInput}
                onChange={e => setTypedInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkAnswer()}
                placeholder="Type the spoken word..."
                className="flex-1 bg-[#08171a] border border-[#23444a] rounded-xl px-4 py-3 text-white text-base text-center font-bold tracking-wide focus:outline-none focus:border-[#28d4c7]"
              />
              <button
                onClick={checkAnswer}
                disabled={!typedInput.trim()}
                className="px-6 py-3 rounded-xl bg-[#28d4c7] hover:bg-[#20b2a6] text-[#031011] font-extrabold text-sm disabled:opacity-40 cursor-pointer transition-all"
              >
                Submit
              </button>
            </div>

            {/* Extra practice controls */}
            {activeMode === 'practice' && (
              <div className="flex justify-between items-center text-xs pt-1">
                <button
                  onClick={() => setRevealed(true)}
                  className="text-[#9db4b8] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Reveal Hint
                </button>
                <button
                  onClick={pickNextWord}
                  className="text-[#9db4b8] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  Skip Word
                </button>
              </div>
            )}

            {revealed && (
              <div className="text-center text-xs text-[#f2b84b] font-mono bg-[#f2b84b]/10 py-1.5 rounded-lg border border-[#f2b84b]/30">
                Word: <strong>{currentWord}</strong>
              </div>
            )}
          </div>

          {/* Answer Feedback */}
          {feedback && (
            <div className={`p-4 rounded-xl border text-center text-sm font-bold flex items-center justify-center gap-2 ${
              feedback.correct
                ? 'bg-[#8bd450]/15 border-[#8bd450]/40 text-[#dcffc6]'
                : 'bg-[#ff6b5f]/15 border-[#ff6b5f]/40 text-[#ffd6d2]'
            }`}>
              {feedback.correct ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#8bd450]" />
                  <span>Brilliant! &quot;{feedback.word}&quot; spelled correctly.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-[#ff6b5f]" />
                  <span>Incorrect. You typed &quot;{feedback.typed || '(blank)'}&quot;. Correct spelling: <strong className="text-white underline ml-1">{feedback.word}</strong></span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
