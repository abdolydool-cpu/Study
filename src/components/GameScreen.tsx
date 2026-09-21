import React, { useState, useEffect, useRef } from 'react';
import { Question, PracticeMode, MissedQuestion, FlashcardItem, MatchTile } from '../types';
import { normalizeStr } from '../utils/questionBuilder';
import { 
  CheckCircle2, 
  XCircle, 
  Timer, 
  Heart, 
  ArrowRight, 
  Layers, 
  RotateCw, 
  AlertCircle,
  Award,
  BookOpen,
  Flame,
  Shield,
  Swords,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameScreenProps {
  mode: PracticeMode;
  title: string;
  questions: Question[];
  flashcards?: FlashcardItem[];
  matchTiles?: { left: MatchTile[]; right: MatchTile[] };
  onFinishSession: (score: number, attempts: number, correct: number, misses: MissedQuestion[], maxStreak?: number) => void;
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  title,
  questions,
  flashcards,
  matchTiles: initialMatchTiles,
  onFinishSession,
  onExit
}) => {
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [misses, setMisses] = useState<MissedQuestion[]>([]);
  
  // Per-question state
  const [answered, setAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Comprehension Sheet State
  const [compAnswers, setCompAnswers] = useState<Record<number, string>>({});
  const [compSubmitted, setCompSubmitted] = useState<boolean>(false);

  // Elimination mode lives
  const [lives, setLives] = useState<number>(3);

  // Speed Mode Timer (10s per question)
  const [speedSeconds, setSpeedSeconds] = useState<number>(10);

  // Exam Mode Timer (20 min countdown)
  const [examSeconds, setExamSeconds] = useState<number>(20 * 60);

  // Streak Mode State
  const [streakCount, setStreakCount] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  // Boss Battle Mode State
  const bossMaxHp = 500;
  const [bossHp, setBossHp] = useState<number>(500);
  const [bossShield, setBossShield] = useState<number>(3);
  const [lastDamage, setLastDamage] = useState<{ amount: number; isCrit: boolean } | null>(null);

  // Blitz Mode State (60s continuous sprint)
  const [blitzSeconds, setBlitzSeconds] = useState<number>(60);
  const [blitzCombo, setBlitzCombo] = useState<number>(0);

  // Flashcard flipped state
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Matching board state
  const [tiles, setTiles] = useState<{ left: MatchTile[]; right: MatchTile[] } | null>(initialMatchTiles || null);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [isEvaluatingMatch, setIsEvaluatingMatch] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Keep a live ref of stats so long-running countdowns don't reset on every answer or read stale closures
  const liveStatsRef = useRef({ score, attempts, correctCount, misses, bestStreak });
  useEffect(() => {
    liveStatsRef.current = { score, attempts, correctCount, misses, bestStreak };
  }, [score, attempts, correctCount, misses, bestStreak]);

  const triggerFinish = (
    finalScore: number, 
    finalAttempts: number, 
    finalCorrect: number, 
    finalMisses: MissedQuestion[]
  ) => {
    const currentMaxStreak = Math.max(streakCount, bestStreak);
    onFinishSession(finalScore, finalAttempts, finalCorrect, finalMisses, currentMaxStreak);
  };

  // Exam timer: decoupled from answering state so countdown remains smooth and continuous
  useEffect(() => {
    if (mode !== 'exam') return;
    const interval = setInterval(() => {
      setExamSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          const { score: s, attempts: a, correctCount: c, misses: m, bestStreak: b } = liveStatsRef.current;
          onFinishSession(s, a, c, m, Math.max(b || 0, streakCount));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, onFinishSession, streakCount]);

  // Blitz timer: 60s sprint countdown
  useEffect(() => {
    if (mode !== 'blitz') return;
    const interval = setInterval(() => {
      setBlitzSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          const { score: s, attempts: a, correctCount: c, misses: m, bestStreak: b } = liveStatsRef.current;
          onFinishSession(s, a, c, m, Math.max(b || 0, streakCount));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, onFinishSession, streakCount]);

  // Speed timer (10s per question)
  useEffect(() => {
    if (mode !== 'speed' || answered) return;
    setSpeedSeconds(10);
    const interval = setInterval(() => {
      setSpeedSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, index, answered]);

  // Focus input on type mode
  useEffect(() => {
    if ((mode === 'type' || (mode === 'exam' && index % 4 === 3)) && !answered) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [mode, index, answered]);

  const currentQ = questions[index];

  const handleTimeout = () => {
    if (answered || !currentQ) return;
    setAnswered(true);
    setIsCorrect(false);
    setAttempts(a => a + 1);
    setMisses(prev => [...prev, { question: currentQ, selected: '(Time expired)' }]);
  };

  const submitAnswer = (chosen: string) => {
    if (answered || !currentQ) return;
    setAnswered(true);
    setSelectedOption(chosen);

    const isMatch = (currentQ.accepted || [currentQ.answer]).some(
      valid => normalizeStr(valid) === normalizeStr(chosen)
    );

    setIsCorrect(isMatch);
    setAttempts(a => a + 1);

    if (isMatch) {
      setCorrectCount(c => c + 1);
      const nextStreak = streakCount + 1;
      setStreakCount(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
      
      if (mode === 'speed') {
        const points = speedSeconds > 6 ? 3 : 2;
        setScore(s => s + points);
        if (speedSeconds > 6) {
          confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
        }
      } else if (mode === 'streak') {
        const mult = nextStreak >= 10 ? 3 : nextStreak >= 5 ? 2 : 1;
        setScore(s => s + mult);
        if (nextStreak % 5 === 0) {
          confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
        }
      } else if (mode === 'boss') {
        const isCrit = (index % 3 === 0);
        const damage = isCrit ? 95 : 60;
        const nextHp = Math.max(0, bossHp - damage);
        setBossHp(nextHp);
        setLastDamage({ amount: damage, isCrit });
        setScore(s => s + (isCrit ? 15 : 10));
        confetti({ particleCount: isCrit ? 40 : 20, spread: 50 });
        if (nextHp <= 0) {
          confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
          setTimeout(() => {
            triggerFinish(score + 100, attempts + 1, correctCount + 1, misses);
          }, 1200);
        }
      } else if (mode === 'blitz') {
        setScore(s => s + 1);
        setBlitzCombo(c => {
          const next = c + 1;
          if (next % 3 === 0) {
            setBlitzSeconds(sec => sec + 2); // +2s bonus time!
            confetti({ particleCount: 15, spread: 35 });
          }
          return next;
        });
        setTimeout(() => {
          handleNext();
        }, 450);
      } else {
        setScore(s => s + 1);
      }
    } else {
      const newMiss: MissedQuestion = { question: currentQ, selected: chosen || '(blank)' };
      setMisses(prev => [...prev, newMiss]);
      setStreakCount(0);
      
      if (mode === 'boss') {
        setBossShield(prev => Math.max(0, prev - 1));
        setLastDamage(null);
      } else if (mode === 'blitz') {
        setBlitzCombo(0);
        setTimeout(() => {
          handleNext();
        }, 650);
      } else if (mode === 'elimination') {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          const finalAttempts = attempts + 1;
          const finalMisses = [...misses, newMiss];
          setTimeout(() => {
            triggerFinish(score, finalAttempts, correctCount, finalMisses);
          }, 900);
        }
      }
    }
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      if (mode === 'blitz') {
        // Continuous cycle for blitz until 60s expires
        setIndex(0);
        setAnswered(false);
        setSelectedOption(null);
        setTypedAnswer('');
        setIsCorrect(false);
      } else {
        triggerFinish(score, attempts, correctCount, misses);
      }
    } else {
      setIndex(prev => prev + 1);
      setAnswered(false);
      setSelectedOption(null);
      setTypedAnswer('');
      setIsCorrect(false);
    }
  };

  // Flashcard next
  const handleRateFlashcard = (understood: boolean) => {
    setAttempts(a => a + 1);
    if (understood) {
      setScore(s => s + 1);
      setCorrectCount(c => c + 1);
    }
    setIsFlipped(false);
    if (index + 1 >= (flashcards?.length || 0)) {
      triggerFinish(score + (understood ? 1 : 0), attempts + 1, correctCount + (understood ? 1 : 0), misses);
    } else {
      setIndex(prev => prev + 1);
    }
  };

  // Comprehension Sheet submission
  const handleSubmitComprehension = () => {
    if (compSubmitted) {
      triggerFinish(score, attempts, correctCount, misses);
      return;
    }
    setCompSubmitted(true);
    let totalScore = 0;
    const newMisses: MissedQuestion[] = [];

    questions.forEach((q, qIdx) => {
      const selected = compAnswers[qIdx] || '';
      const correct = (q.accepted || [q.answer]).some(
        val => normalizeStr(val) === normalizeStr(selected)
      );
      if (correct) {
        totalScore += 1;
      } else {
        newMisses.push({ question: q, selected: selected || '(no answer)' });
      }
    });

    setScore(totalScore);
    setAttempts(questions.length);
    setCorrectCount(totalScore);
    setMisses(newMisses);

    if (totalScore === questions.length) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  // Match Terms Tile Click
  const handleMatchSelect = (tile: MatchTile) => {
    if (tile.matched || isEvaluatingMatch) return;

    if (tile.side === 'left') {
      if (selectedLeft === tile.id) {
        setSelectedLeft(null);
        return;
      }
      setSelectedLeft(tile.id);
      if (selectedRight && tiles) {
        evaluateMatch(tile.id, selectedRight);
      }
    } else {
      if (selectedRight === tile.id) {
        setSelectedRight(null);
        return;
      }
      setSelectedRight(tile.id);
      if (selectedLeft && tiles) {
        evaluateMatch(selectedLeft, tile.id);
      }
    }
  };

  const evaluateMatch = (leftId: string, rightId: string) => {
    if (!tiles || isEvaluatingMatch) return;
    const leftTile = tiles.left.find(t => t.id === leftId);
    const rightTile = tiles.right.find(t => t.id === rightId);
    if (!leftTile || !rightTile) return;

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const isPair = leftTile.key === rightTile.key;

    if (isPair) {
      // Immutable update of matched tiles
      setTiles(prev => {
        if (!prev) return null;
        return {
          left: prev.left.map(t => t.id === leftId ? { ...t, matched: true } : t),
          right: prev.right.map(t => t.id === rightId ? { ...t, matched: true } : t)
        };
      });

      const nextMatched = matchedCount + 1;
      const nextScore = score + 1;
      const nextCorrect = correctCount + 1;
      setMatchedCount(nextMatched);
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (nextMatched >= tiles.left.length) {
        confetti({ particleCount: 50, spread: 70 });
        setTimeout(() => triggerFinish(nextScore, nextAttempts, nextCorrect, misses), 800);
      }
    } else {
      setIsEvaluatingMatch(true);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setIsEvaluatingMatch(false);
      }, 500);
    }
  };

  // Progress percentage
  const progressPercent = mode === 'match'
    ? tiles ? (matchedCount / tiles.left.length) * 100 : 0
    : mode === 'flash'
      ? ((index) / (flashcards?.length || 1)) * 100
      : mode === 'comprehension'
        ? (Object.keys(compAnswers).length / questions.length) * 100
        : ((index) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Session Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-4 sm:p-5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {title}
          </h2>
          <p className="text-xs text-[#9db4b8] mt-0.5">
            {mode === 'exam' && 'Timed 20-minute multi-discipline assessment'}
            {mode === 'speed' && 'Speed round: 10s per question with speed bonus'}
            {mode === 'elimination' && '3 lives: one mistake costs a heart'}
            {mode === 'streak' && 'Streak Master: chain correct answers for up to 3x score multipliers'}
            {mode === 'boss' && 'Curriculum Guardian: deal 500 HP of damage with correct knowledge'}
            {mode === 'blitz' && '60-Second Rapid Sprint: answer as many questions as you can before time expires'}
            {mode === 'comprehension' && 'Full extract passage with question sheet'}
            {mode === 'flash' && 'Active recall flashcards'}
            {mode === 'match' && 'Match the term to its correct definition'}
            {mode === 'mc' && 'Read carefully and select the best answer'}
            {mode === 'type' && 'Type the exact answer with units'}
          </p>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#9db4b8] block">Score</span>
            <span className="text-2xl font-black text-[#28d4c7]">{score}</span>
          </div>

          {mode === 'streak' && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
              streakCount >= 10 
                ? 'bg-[#ff6b5f]/20 border-[#ff6b5f] text-[#ff6b5f]' 
                : streakCount >= 5 
                  ? 'bg-[#f2b84b]/20 border-[#f2b84b] text-[#f2b84b]' 
                  : 'bg-[#13262b] border-[#23444a] text-[#9db4b8]'
            }`}>
              <Flame className={`w-5 h-5 ${streakCount >= 5 ? 'text-[#f2b84b] fill-current animate-bounce' : 'text-[#9db4b8]'}`} />
              <div>
                <span className="text-sm font-black block leading-none">{streakCount} Streak</span>
                <span className="text-[10px] uppercase font-bold">
                  {streakCount >= 10 ? '3x Multiplier!' : streakCount >= 5 ? '2x Multiplier' : '1x Base'}
                </span>
              </div>
            </div>
          )}

          {mode === 'blitz' && (
            <div className="flex items-center gap-2 bg-[#f2b84b]/15 px-3.5 py-1.5 rounded-xl border border-[#f2b84b]/40">
              <Zap className="w-5 h-5 text-[#f2b84b] animate-bounce" />
              <div>
                <span className="text-[10px] uppercase font-extrabold text-[#f2b84b] block leading-none">Sprint Clock</span>
                <span className={`text-xl font-black font-mono ${blitzSeconds <= 10 ? 'text-[#ff6b5f] animate-pulse' : 'text-[#f2b84b]'}`}>
                  {blitzSeconds}s
                </span>
              </div>
            </div>
          )}

          {mode === 'elimination' && (
            <div className="flex items-center gap-1 bg-[#ff6b5f]/15 px-3 py-1.5 rounded-xl border border-[#ff6b5f]/30">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${i < lives ? 'text-[#ff6b5f] fill-current' : 'text-[#ff6b5f]/30'}`}
                />
              ))}
            </div>
          )}

          {mode === 'speed' && (
            <div className="flex items-center gap-2 bg-[#f2b84b]/15 px-3 py-1.5 rounded-xl border border-[#f2b84b]/30">
              <Timer className="w-5 h-5 text-[#f2b84b] animate-pulse" />
              <span className={`text-xl font-black ${speedSeconds <= 3 ? 'text-[#ff6b5f]' : 'text-[#f2b84b]'}`}>
                {speedSeconds}s
              </span>
            </div>
          )}

          {mode === 'exam' && (
            <div className="flex items-center gap-2 bg-[#28d4c7]/15 px-3.5 py-1.5 rounded-xl border border-[#28d4c7]/30">
              <Timer className="w-5 h-5 text-[#28d4c7]" />
              <span className="text-xl font-black text-[#28d4c7] font-mono">
                {Math.floor(examSeconds / 60)}:{String(examSeconds % 60).padStart(2, '0')}
              </span>
            </div>
          )}

          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#9db4b8] hover:text-white bg-[#13262b] border border-[#23444a] cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#0d1b1f] border border-[#23444a] h-2.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#28d4c7] via-[#20b2a6] to-[#f2b84b] transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

      {/* ================= COMPREHENSION LAB MODE ================= */}
      {mode === 'comprehension' && (
        <div className="space-y-6">
          {/* Passage card */}
          {questions[0]?.passage && (
            <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#23444a]/80 pb-3">
                <span className="text-xs uppercase font-extrabold text-[#f2b84b] tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Reading Passage: {questions[0].passageTitle || 'Extract'}
                </span>
                <span className="text-xs text-[#9db4b8]">{questions.length} Questions</span>
              </div>
              <div className="text-sm sm:text-base leading-relaxed text-[#d8e8ea] whitespace-pre-line font-serif">
                {questions[0].passage}
              </div>
            </div>
          )}

          {/* Question checklist */}
          <div className="space-y-4">
            {questions.map((q, qIdx) => {
              const selected = compAnswers[qIdx] || '';
              const isQCorrect = compSubmitted && normalizeStr(selected) === normalizeStr(q.answer);
              const isQWrong = compSubmitted && selected && !isQCorrect;

              return (
                <div
                  key={q.id}
                  className={`bg-[#0d1b1f] border rounded-2xl p-5 space-y-3 transition-all ${
                    compSubmitted
                      ? isQCorrect
                        ? 'border-[#8bd450]/60 bg-[#8bd450]/5'
                        : 'border-[#ff6b5f]/60 bg-[#ff6b5f]/5'
                      : 'border-[#23444a]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#28d4c7]">Question {qIdx + 1}</span>
                    {q.skill && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#28d4c7]/10 text-[#28d4c7] border border-[#28d4c7]/20">
                        {q.skill}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {q.prompt}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map(opt => {
                      const isChosen = selected === opt;
                      const isAnswer = compSubmitted && normalizeStr(opt) === normalizeStr(q.answer);

                      return (
                        <button
                          key={opt}
                          disabled={compSubmitted}
                          onClick={() => setCompAnswers(prev => ({ ...prev, [qIdx]: opt }))}
                          className={`p-3 rounded-xl text-xs sm:text-sm font-medium text-left transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                            isAnswer
                              ? 'bg-[#8bd450]/20 border-[#8bd450] text-[#dcffc6]'
                              : isChosen && isQWrong
                                ? 'bg-[#ff6b5f]/20 border-[#ff6b5f] text-[#ffd6d2]'
                                : isChosen
                                  ? 'bg-[#f2b84b]/20 border-[#f2b84b] text-white'
                                  : 'bg-[#102126] border-[#23444a] text-[#d8e8ea] hover:border-[#28d4c7]/50'
                          }`}
                        >
                          <span>{opt}</span>
                          {isAnswer && <CheckCircle2 className="w-4 h-4 text-[#8bd450] shrink-0" />}
                          {isChosen && isQWrong && <XCircle className="w-4 h-4 text-[#ff6b5f] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {compSubmitted && (
                    <div className="text-xs text-[#9db4b8] pt-2 border-t border-[#23444a]/40">
                      <strong className="text-white">Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit / Finish Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmitComprehension}
              disabled={!compSubmitted && Object.keys(compAnswers).length < questions.length}
              className={`px-8 py-3.5 rounded-xl font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-xl transition-all ${
                compSubmitted
                  ? 'bg-gradient-to-r from-[#28d4c7] to-[#158d99] text-[#031011]'
                  : Object.keys(compAnswers).length === questions.length
                    ? 'bg-[#28d4c7] text-[#031011] hover:brightness-110'
                    : 'bg-[#13262b] text-[#9db4b8] opacity-50 cursor-not-allowed'
              }`}
            >
              {compSubmitted ? (
                <>Finish &amp; View Report <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Submit Answers ({Object.keys(compAnswers).length}/{questions.length})</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= FLASHCARD MODE ================= */}
      {mode === 'flash' && flashcards && flashcards[index] && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#9db4b8]">
            <span>Card {index + 1} of {flashcards.length}</span>
            <span className="text-[#28d4c7] font-semibold">{flashcards[index].unit} &bull; {flashcards[index].topic}</span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[300px] bg-gradient-to-br from-[#0d1b1f] via-[#102126] to-[#071113] border border-[#23444a] hover:border-[#28d4c7]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl relative select-none transition-all group"
          >
            <div className="text-xs uppercase font-extrabold text-[#28d4c7] tracking-wider mb-4 flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              {isFlipped ? 'Definition / Answer' : 'Prompt / Concept'}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white max-w-lg leading-relaxed">
              {isFlipped ? flashcards[index].back : flashcards[index].front}
            </div>
            <p className="text-xs text-[#9db4b8] mt-6">
              {isFlipped ? flashcards[index].explanation : 'Click anywhere on the card to flip'}
            </p>
          </div>

          {/* Self-Rating Controls */}
          <div className="grid grid-cols-4 gap-2.5">
            <button
              onClick={() => handleRateFlashcard(false)}
              className="py-3 rounded-xl bg-[#ff6b5f]/15 hover:bg-[#ff6b5f] text-[#ff6b5f] hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Again (0)
            </button>
            <button
              onClick={() => handleRateFlashcard(false)}
              className="py-3 rounded-xl bg-[#f2b84b]/15 hover:bg-[#f2b84b] text-[#f2b84b] hover:text-[#190d02] font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Hard (1)
            </button>
            <button
              onClick={() => handleRateFlashcard(true)}
              className="py-3 rounded-xl bg-[#28d4c7]/15 hover:bg-[#28d4c7] text-[#28d4c7] hover:text-[#031011] font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Good (2)
            </button>
            <button
              onClick={() => handleRateFlashcard(true)}
              className="py-3 rounded-xl bg-[#8bd450]/15 hover:bg-[#8bd450] text-[#8bd450] hover:text-[#031011] font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Easy (3)
            </button>
          </div>
        </div>
      )}

      {/* ================= MATCH TERMS MODE ================= */}
      {mode === 'match' && tiles && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#9db4b8]">
            <span>Select a prompt on the left, then click its matching definition on the right.</span>
            <span className="text-[#28d4c7] font-bold">{matchedCount} / {tiles.left.length} Pairs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column (Prompts) */}
            <div className="space-y-2.5">
              <h4 className="text-xs uppercase font-extrabold text-[#9db4b8] tracking-wider mb-2">Prompts</h4>
              {tiles.left.map(tile => (
                <button
                  key={tile.id}
                  disabled={tile.matched}
                  onClick={() => handleMatchSelect(tile)}
                  className={`w-full p-4 rounded-xl text-left text-sm font-semibold border transition-all cursor-pointer ${
                    tile.matched
                      ? 'bg-[#8bd450]/15 border-[#8bd450]/40 text-[#dcffc6] opacity-50 cursor-default'
                      : selectedLeft === tile.id
                        ? 'bg-[#f2b84b]/20 border-[#f2b84b] text-white scale-[1.01]'
                        : 'bg-[#0d1b1f] border-[#23444a] text-white hover:border-[#28d4c7]'
                  }`}
                >
                  {tile.text}
                </button>
              ))}
            </div>

            {/* Right Column (Definitions) */}
            <div className="space-y-2.5">
              <h4 className="text-xs uppercase font-extrabold text-[#9db4b8] tracking-wider mb-2">Definitions</h4>
              {tiles.right.map(tile => (
                <button
                  key={tile.id}
                  disabled={tile.matched}
                  onClick={() => handleMatchSelect(tile)}
                  className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium border transition-all cursor-pointer leading-relaxed ${
                    tile.matched
                      ? 'bg-[#8bd450]/15 border-[#8bd450]/40 text-[#dcffc6] opacity-50 cursor-default'
                      : selectedRight === tile.id
                        ? 'bg-[#f2b84b]/20 border-[#f2b84b] text-white scale-[1.01]'
                        : 'bg-[#0d1b1f] border-[#23444a] text-[#d8e8ea] hover:border-[#28d4c7]'
                  }`}
                >
                  {tile.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= STANDARD QUIZ / TYPE / SPEED / ELIMINATION / STREAK / BOSS / BLITZ MODE ================= */}
      {mode !== 'comprehension' && mode !== 'flash' && mode !== 'match' && currentQ && (
        <div className="space-y-4">
          {/* Boss Encounter Header */}
          {mode === 'boss' && (
            <div className="bg-gradient-to-r from-[#1c1214] via-[#241318] to-[#121c1f] border border-[#ff6b5f]/40 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#ff6b5f]/20 border border-[#ff6b5f]/40 flex items-center justify-center text-[#ff6b5f] shadow-inner shrink-0">
                    <Swords className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-white tracking-wide">
                        {currentQ.subject === 'maths' ? 'Titan of Theorems' : 'The Lexicon Overlord'}
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#ff6b5f]/20 text-[#ff6b5f] border border-[#ff6b5f]/30">
                        Boss
                      </span>
                    </div>
                    <span className="text-xs text-[#9db4b8]">
                      Curriculum Guardian &bull; Answer correctly to deal damage!
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#ff6b5f]">
                    {bossHp} / {bossMaxHp} HP
                  </span>
                  {lastDamage && (
                    <div className={`text-xs font-extrabold animate-bounce ${lastDamage.isCrit ? 'text-[#f2b84b]' : 'text-[#8bd450]'}`}>
                      {lastDamage.isCrit ? '⚡ CRITICAL HIT! -' : '⚔️ -'}{lastDamage.amount} HP
                    </div>
                  )}
                </div>
              </div>

              {/* Boss HP Bar */}
              <div className="w-full bg-[#08171a] h-3.5 rounded-full overflow-hidden border border-[#ff6b5f]/30 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-[#ff6b5f] via-[#f2b84b] to-[#8bd450] rounded-full transition-all duration-500"
                  style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
                />
              </div>

              {/* Player Shields */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#ff6b5f]/20 text-xs">
                <span className="text-[#9db4b8] font-medium flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#28d4c7]" />
                  Resilience Shields:
                </span>
                <div className="flex items-center gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <Shield
                      key={i}
                      className={`w-4 h-4 ${i < bossShield ? 'text-[#28d4c7] fill-current' : 'text-[#23444a]'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#23444a]/80 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border ${
                currentQ.subject === 'maths'
                  ? 'bg-[#64a6ff]/10 text-[#64a6ff] border-[#64a6ff]/30'
                  : 'bg-[#ff6b5f]/10 text-[#ff6b5f] border-[#ff6b5f]/30'
              }`}>
                {currentQ.subject}
              </span>
              {currentQ.difficulty && (
                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                  currentQ.difficulty === 'hard'
                    ? 'bg-[#ff6b5f]/15 text-[#ff6b5f] border-[#ff6b5f]/30'
                    : currentQ.difficulty === 'easy'
                      ? 'bg-[#8bd450]/15 text-[#8bd450] border-[#8bd450]/30'
                      : 'bg-[#28d4c7]/15 text-[#28d4c7] border-[#28d4c7]/30'
                }`}>
                  {currentQ.difficulty === 'hard' ? '🔥 Hard' : currentQ.difficulty === 'easy' ? '🌱 Easy' : '⚡ Medium'}
                </span>
              )}
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#102126] text-[#9db4b8] border border-[#23444a]">
                {currentQ.unit} &bull; {currentQ.topic}
              </span>
              {currentQ.skill && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#28d4c7]/10 text-[#28d4c7] border border-[#28d4c7]/20">
                  {currentQ.skill}
                </span>
              )}
            </div>
            <span className="text-xs text-[#9db4b8] font-bold">
              Question {index + 1} of {questions.length}
            </span>
          </div>

          {/* Reading Extract if question belongs to a passage */}
          {currentQ.passage && (
            <div className="bg-[#08171a] border border-[#23444a] rounded-xl p-4 text-xs sm:text-sm text-[#d8e8ea] leading-relaxed font-serif italic whitespace-pre-line">
              {currentQ.passageTitle && <div className="font-bold font-sans not-italic text-[#f2b84b] mb-1">{currentQ.passageTitle}</div>}
              {currentQ.passage}
            </div>
          )}

          {/* Main Question Prompt */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
              {currentQ.prompt}
            </h3>
          </div>

          {/* Interactive Input Formats: Multiple Choice vs Type Answer */}
          {mode === 'type' || (mode === 'exam' && index % 4 === 3) ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={typedAnswer}
                  disabled={answered}
                  onChange={e => setTypedAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !answered && submitAnswer(typedAnswer)}
                  placeholder="Type your exact answer here..."
                  className="flex-1 bg-[#08171a] border border-[#23444a] rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#28d4c7]"
                />
                <button
                  disabled={answered || !typedAnswer.trim()}
                  onClick={() => submitAnswer(typedAnswer)}
                  className="px-6 py-3 rounded-xl bg-[#28d4c7] hover:bg-[#20b2a6] text-[#031011] font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  Check
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map(opt => {
                const isSelected = selectedOption === opt;
                const isTheAnswer = answered && (currentQ.accepted || [currentQ.answer]).some(
                  val => normalizeStr(val) === normalizeStr(opt)
                );
                const isWrongSelection = answered && isSelected && !isTheAnswer;

                return (
                  <button
                    key={opt}
                    disabled={answered}
                    onClick={() => submitAnswer(opt)}
                    className={`p-4 rounded-xl text-left text-sm font-semibold transition-all border flex items-center justify-between gap-3 cursor-pointer ${
                      isTheAnswer
                        ? 'bg-[#8bd450]/20 border-[#8bd450] text-[#dcffc6]'
                        : isWrongSelection
                          ? 'bg-[#ff6b5f]/20 border-[#ff6b5f] text-[#ffd6d2]'
                          : answered
                            ? 'bg-[#102126] border-[#23444a] text-[#9db4b8] opacity-60'
                            : 'bg-[#102126] border-[#23444a] text-white hover:border-[#28d4c7] hover:bg-[#13262b]'
                    }`}
                  >
                    <span>{opt}</span>
                    {isTheAnswer && <CheckCircle2 className="w-5 h-5 text-[#8bd450] shrink-0" />}
                    {isWrongSelection && <XCircle className="w-5 h-5 text-[#ff6b5f] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Feedback & Explanation Card */}
          {answered && (
            <div className={`p-4 rounded-xl border space-y-3 animate-in fade-in duration-200 ${
              isCorrect
                ? 'bg-[#8bd450]/10 border-[#8bd450]/40 text-[#dcffc6]'
                : 'bg-[#ff6b5f]/10 border-[#ff6b5f]/40 text-[#ffd6d2]'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#8bd450]" />
                    <span>Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-[#ff6b5f]" />
                    <span>Not quite. Correct answer: <strong className="text-white underline ml-1">{currentQ.answer}</strong></span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#d8e8ea] leading-relaxed">
                {currentQ.explanation}
              </p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="px-6 py-2 rounded-xl bg-white text-[#031011] font-extrabold text-xs sm:text-sm hover:bg-[#28d4c7] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {index + 1 >= questions.length ? 'View Results' : 'Next Question'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
