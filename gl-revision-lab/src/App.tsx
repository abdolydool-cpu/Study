import React, { useState, useEffect } from 'react';
import { 
  Topic, 
  PracticeMode, 
  DifficultyLevel,
  Question, 
  MissedQuestion, 
  FlashcardItem, 
  MatchTile, 
  UserStats,
  TopicStat,
  GameResult,
  Achievement
} from './types';
import { TOPICS } from './data/topics';
import { COMPREHENSION_BANK } from './data/comprehensionBank';
import { loadUserStats, saveUserStats, recordBatchAttempts, recordSessionResult, clearAllStats } from './utils/storage';
import { evaluateAndUnlockAchievements } from './utils/achievements';
import { 
  generateQuestionPool, 
  buildFlashcards, 
  buildMatchPairs, 
  shuffleArray 
} from './utils/questionBuilder';

import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { GameScreen } from './components/GameScreen';
import { SpellingLab } from './components/SpellingLab';
import { TournamentScreen } from './components/TournamentScreen';
import { ResultScreen } from './components/ResultScreen';
import { AchievementUnlockedModal } from './components/AchievementUnlockedModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [stats, setStats] = useState<UserStats>(loadUserStats);

  // Active Session state
  const [sessionMode, setSessionMode] = useState<PracticeMode>('mc');
  const [sessionDifficulty, setSessionDifficulty] = useState<DifficultyLevel>('medium');
  const [sessionTitle, setSessionTitle] = useState<string>('');
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [sessionFlashcards, setSessionFlashcards] = useState<FlashcardItem[]>([]);
  const [sessionMatchTiles, setSessionMatchTiles] = useState<{ left: MatchTile[]; right: MatchTile[] } | null>(null);

  // Result state
  const [lastScore, setLastScore] = useState<number>(0);
  const [lastAttempts, setLastAttempts] = useState<number>(0);
  const [lastCorrect, setLastCorrect] = useState<number>(0);
  const [lastMisses, setLastMisses] = useState<MissedQuestion[]>([]);
  const [recentUnlockedBadges, setRecentUnlockedBadges] = useState<Achievement[]>([]);

  // Tournament preset
  const [presetTournamentTopic, setPresetTournamentTopic] = useState<string | undefined>(undefined);

  // Sync stats
  useEffect(() => {
    setStats(loadUserStats());
  }, []);

  const weakCount = (Object.values(stats.topicStats) as TopicStat[]).filter(s => s.mistakes > 0).length;

  const startPractice = (
    topics: Topic[], 
    mode: PracticeMode, 
    count: number, 
    title?: string,
    difficulty: DifficultyLevel = 'medium'
  ) => {
    setSessionMode(mode);
    setSessionDifficulty(difficulty);
    setSessionTitle(title || `${mode.toUpperCase()} Session`);

    if (mode === 'flash') {
      const cards = buildFlashcards(topics);
      setSessionFlashcards(cards.slice(0, count));
      setSessionQuestions([]);
      setSessionMatchTiles(null);
    } else if (mode === 'match') {
      const pairs = buildMatchPairs(topics);
      const leftTiles: MatchTile[] = shuffleArray(pairs.map((p, idx) => ({
        id: `l-${idx}`,
        key: idx,
        text: p.left,
        side: 'left' as const,
        matched: false
      })));
      const rightTiles: MatchTile[] = shuffleArray(pairs.map((p, idx) => ({
        id: `r-${idx}`,
        key: idx,
        text: p.right,
        side: 'right' as const,
        matched: false
      })));
      setSessionMatchTiles({ left: leftTiles, right: rightTiles });
      setSessionQuestions([]);
      setSessionFlashcards([]);
    } else {
      const qCount = mode === 'blitz' ? Math.max(count, 35) : mode === 'boss' ? Math.max(count, 15) : count;
      const pool = generateQuestionPool(topics, qCount, difficulty);
      setSessionQuestions(pool);
      setSessionFlashcards([]);
      setSessionMatchTiles(null);
    }

    setCurrentTab('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startComprehension = () => {
    // Pick a random passage from the 38 passages in the comprehension bank
    const passage = COMPREHENSION_BANK[Math.floor(Math.random() * COMPREHENSION_BANK.length)];
    const compQuestions: Question[] = passage.questions.map((q, idx) => ({
      id: `${passage.id}-${idx}`,
      topicId: passage.topicId,
      subject: 'english',
      unit: passage.unit,
      topic: passage.title,
      prompt: q.prompt,
      answer: q.answer,
      accepted: [q.answer, q.typeAnswer].filter((v): v is string => Boolean(v)),
      options: q.options,
      explanation: q.explanation,
      passage: passage.passage,
      passageTitle: passage.title,
      interaction: q.interaction || 'mc',
      skill: q.skill || 'Comprehension',
      marks: q.marks || 1
    }));

    setSessionMode('comprehension');
    setSessionTitle(`Comprehension Lab: ${passage.title}`);
    setSessionQuestions(compQuestions);
    setSessionFlashcards([]);
    setSessionMatchTiles(null);
    setCurrentTab('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startTimedExam = () => {
    // 30 mixed questions across English and Maths
    const pool = generateQuestionPool(TOPICS, 30);
    setSessionMode('exam');
    setSessionTitle('Timed Mixed GL Assessment (30 Questions)');
    setSessionQuestions(pool);
    setSessionFlashcards([]);
    setSessionMatchTiles(null);
    setCurrentTab('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startWeakReplay = () => {
    const weakIds = (Object.entries(stats.topicStats) as [string, TopicStat][])
      .filter(([_, s]) => s.mistakes > 0)
      .sort((a, b) => b[1].mistakes - a[1].mistakes)
      .map(([id]) => id);

    const weakTopics = weakIds
      .map(id => TOPICS.find(t => t.id === id))
      .filter((t): t is Topic => Boolean(t));

    if (!weakTopics.length) return;
    startPractice(weakTopics, 'mc', Math.min(25, Math.max(10, weakTopics.length * 2)), 'Weak Topics Focused Replay');
  };

  const replayMisses = (missedList: MissedQuestion[]) => {
    const questionsToReplay = missedList.map(m => m.question);
    setSessionMode('mc');
    setSessionTitle(`Replay: ${missedList.length} Missed Questions`);
    setSessionQuestions(questionsToReplay);
    setSessionFlashcards([]);
    setSessionMatchTiles(null);
    setCurrentTab('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishSession = (
    score: number, 
    attempts: number, 
    correct: number, 
    misses: MissedQuestion[],
    sessionStreak: number = 0
  ) => {
    // Record attempts in local storage in a single batch write
    let currentStats = stats;
    if (sessionQuestions.length > 0) {
      const missedIds = new Set(misses.map(m => m.question.id));
      const batch = sessionQuestions.map(q => ({
        topicId: q.topicId,
        correct: !missedIds.has(q.id)
      }));
      currentStats = recordBatchAttempts(batch);
    }

    // Record session accuracy in results history
    const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 100;
    const sessionResult: GameResult = {
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + 
            new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      mode: sessionMode,
      score,
      accuracy,
      elapsed: 0,
      title: sessionTitle || 'Practice Session',
      difficulty: sessionDifficulty
    };
    currentStats = recordSessionResult(sessionResult);

    // Evaluate and unlock student achievements
    const effectiveStreak = Math.max(sessionStreak, (attempts > 0 && correct === attempts) ? attempts : 0);
    const { updatedStats, newlyUnlocked } = evaluateAndUnlockAchievements(
      currentStats,
      effectiveStreak,
      accuracy,
      attempts
    );
    currentStats = updatedStats;
    saveUserStats(currentStats);

    if (newlyUnlocked.length > 0) {
      setRecentUnlockedBadges(newlyUnlocked);
    }

    setStats(currentStats);
    setLastScore(score);
    setLastAttempts(attempts);
    setLastCorrect(correct);
    setLastMisses(misses);
    setCurrentTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetStats = () => {
    if (confirm('Reset your saved attempts, accuracy and weak topic records?')) {
      const reset = clearAllStats();
      setStats(reset);
    }
  };

  return (
    <div className="min-h-screen bg-[#071113] text-[#f3fbfb] font-sans antialiased flex flex-col">
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab === 'exam') startTimedExam();
          else if (tab === 'weak') startWeakReplay();
          else if (tab === 'comprehension') startComprehension();
          else setCurrentTab(tab);
        }}
        weakCount={weakCount}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            onStartPractice={startPractice}
            onStartComprehension={startComprehension}
            onOpenSpelling={() => setCurrentTab('spelling')}
            onOpenTournament={topicId => {
              setPresetTournamentTopic(topicId);
              setCurrentTab('tournament');
            }}
            onResetStats={handleResetStats}
          />
        )}

        {currentTab === 'game' && (
          <GameScreen
            mode={sessionMode}
            title={sessionTitle}
            questions={sessionQuestions}
            flashcards={sessionFlashcards}
            matchTiles={sessionMatchTiles || undefined}
            onFinishSession={handleFinishSession}
            onExit={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'spelling' && (
          <SpellingLab
            stats={stats}
            onUpdateStats={setStats}
            onBackToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'tournament' && (
          <TournamentScreen
            presetTopicId={presetTournamentTopic}
            onBackToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'result' && (
          <ResultScreen
            mode={sessionMode}
            title={sessionTitle}
            score={lastScore}
            attempts={lastAttempts}
            correct={lastCorrect}
            misses={lastMisses}
            difficulty={sessionDifficulty}
            onPlayAgain={() => {
              if (sessionMode === 'comprehension') startComprehension();
              else if (sessionMode === 'exam') startTimedExam();
              else if (sessionQuestions.length) {
                setSessionQuestions(shuffleArray(sessionQuestions));
                setCurrentTab('game');
              } else {
                setCurrentTab('dashboard');
              }
            }}
            onReplayMisses={replayMisses}
            onGoToWeakTopics={startWeakReplay}
            onBackToDashboard={() => setCurrentTab('dashboard')}
          />
        )}
      </main>

      {/* Achievement Celebratory Modal for newly unlocked badges */}
      <AchievementUnlockedModal
        badges={recentUnlockedBadges}
        onClose={() => setRecentUnlockedBadges([])}
        onViewDashboard={() => {
          setRecentUnlockedBadges([]);
          setCurrentTab('dashboard');
        }}
      />

      <footer className="border-t border-[#23444a]/50 py-6 text-center text-xs text-[#9db4b8]">
        <p>GL Revision Lab &bull; Year 7 English &amp; Maths curriculum coverage &bull; Offline &amp; LocalStorage ready</p>
      </footer>
    </div>
  );
}
