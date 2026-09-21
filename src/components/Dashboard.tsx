import React, { useState, useMemo } from 'react';
import { Topic, Subject, PracticeMode, DifficultyLevel, UserStats, TopicStat } from '../types';
import { TOPICS } from '../data/topics';
import { PerformanceTrendsChart } from './PerformanceTrendsChart';
import { AchievementSystem } from './AchievementSystem';
import { StartPracticeModal } from './StartPracticeModal';
import { calculateAchievements } from '../utils/achievements';
import { 
  Sparkles, 
  BookOpen, 
  Volume2, 
  Trophy, 
  RotateCcw, 
  Play, 
  Layers, 
  Zap, 
  Flame, 
  Shuffle, 
  CheckCircle2, 
  Filter,
  Swords,
  Award,
  Sliders
} from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
  onStartPractice: (topics: Topic[], mode: PracticeMode, count: number, title?: string, difficulty?: DifficultyLevel) => void;
  onStartComprehension: () => void;
  onOpenSpelling: () => void;
  onOpenTournament: (presetTopicId?: string) => void;
  onResetStats: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  onStartPractice,
  onStartComprehension,
  onOpenSpelling,
  onOpenTournament,
  onResetStats
}) => {
  const [subject, setSubject] = useState<Subject>('all');
  const [unit, setUnit] = useState<string>('all');
  const [topicId, setTopicId] = useState<string>('all');
  const [mode, setMode] = useState<PracticeMode>('mc');
  const [count, setCount] = useState<number>(15);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');

  // Start Practice Modal state
  const [modalTopics, setModalTopics] = useState<Topic[] | null>(null);
  const [modalMode, setModalMode] = useState<PracticeMode>('mc');

  const availableUnits = useMemo(() => {
    const list = TOPICS.filter(t => subject === 'all' || t.subject === subject).map(t => t.unit);
    return ['all', ...Array.from(new Set(list))].sort();
  }, [subject]);

  // Topics available in the Topic dropdown based on current Subject and Unit filters
  const selectableTopics = useMemo(() => {
    return TOPICS.filter(t => {
      if (subject !== 'all' && t.subject !== subject) return false;
      if (unit !== 'all' && t.unit !== unit) return false;
      return true;
    });
  }, [subject, unit]);

  // Topics targeted by the focus session or displayed in the topic cards catalog
  const filteredTopics = useMemo(() => {
    return selectableTopics.filter(t => {
      if (topicId !== 'all' && t.id !== topicId) return false;
      return true;
    });
  }, [selectableTopics, topicId]);

  const totalAttempts = useMemo(() => {
    return (Object.values(stats.topicStats) as TopicStat[]).reduce((acc, curr) => acc + curr.attempts, 0);
  }, [stats.topicStats]);

  const weakTopicsCount = useMemo(() => {
    return (Object.values(stats.topicStats) as TopicStat[]).filter(s => s.mistakes > 0).length;
  }, [stats.topicStats]);

  const achievements = useMemo(() => {
    return calculateAchievements(stats);
  }, [stats]);

  const unlockedBadgesCount = useMemo(() => {
    return achievements.filter(a => a.unlocked).length;
  }, [achievements]);

  const handleStartFocused = () => {
    if (!filteredTopics.length) return;
    onStartPractice(
      filteredTopics,
      mode,
      count,
      topicId !== 'all'
        ? `${mode.toUpperCase()} - ${filteredTopics[0].title}`
        : `${filteredTopics.length} Topics Focus Session`,
      difficulty
    );
  };

  const handleSurpriseMe = () => {
    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const modes: PracticeMode[] = ['mc', 'type', 'flash', 'match', 'speed', 'elimination', 'streak', 'boss', 'blitz'];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    onStartPractice([randomTopic], randomMode, 15, `Surprise Challenge: ${randomTopic.title}`, difficulty);
  };

  const handleOpenPracticeModal = (topicsToPractice: Topic[], defaultPracticeMode: PracticeMode = 'mc') => {
    setModalTopics(topicsToPractice);
    setModalMode(defaultPracticeMode);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner & Stat Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 rounded-2xl bg-gradient-to-br from-[#0d1b1f] via-[#102126] to-[#071113] border border-[#23444a] p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-center">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#28d4c7]/10 border border-[#28d4c7]/30 text-xs font-bold text-[#28d4c7] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Year 7 GL Assessment Syllabus
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Master every GL topic with active recall &amp; speech.
            </h2>
            <p className="text-[#9db4b8] text-sm sm:text-base leading-relaxed">
              Explore 37 complete curriculum topics across English and Maths, 38 authentic reading comprehension extracts, and our browser-powered British voice spelling studio.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={onStartComprehension}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#28d4c7] text-[#031011] hover:bg-[#20b2a6] active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#28d4c7]/20"
              >
                <BookOpen className="w-4 h-4" />
                Comprehension Lab
              </button>
              <button
                onClick={onOpenSpelling}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#f2b84b] text-[#190d02] hover:bg-[#dfa637] active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#f2b84b]/20"
              >
                <Volume2 className="w-4 h-4" />
                Spelling Lab
              </button>
              <button
                onClick={() => onOpenTournament()}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#13262b] text-white border border-[#23444a] hover:border-[#28d4c7] active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Swords className="w-4 h-4 text-[#28d4c7]" />
                <span>Multiplayer Arena</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8bd450] animate-pulse" />
              </button>
            </div>
          </div>
          {/* Subtle decorative glow */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#28d4c7]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Quick Stats Grid */}
        <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3.5">
          <div className="bg-[#0d1b1f] border border-[#23444a] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs uppercase font-bold text-[#9db4b8]">Curriculum Topics</span>
            <div className="text-3xl font-black text-[#f2b84b] mt-2">37</div>
            <span className="text-[11px] text-[#9db4b8]/80">English &amp; Maths</span>
          </div>
          <div className="bg-[#0d1b1f] border border-[#23444a] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs uppercase font-bold text-[#9db4b8]">Practice Modes</span>
            <div className="text-3xl font-black text-[#28d4c7] mt-2">11</div>
            <span className="text-[11px] text-[#9db4b8]/80">Streak, Boss, Blitz...</span>
          </div>
          <div className="bg-[#0d1b1f] border border-[#23444a] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs uppercase font-bold text-[#9db4b8]">Total Attempts</span>
            <div className="text-3xl font-black text-white mt-2">{totalAttempts}</div>
            <span className="text-[11px] text-[#9db4b8]/80">Questions logged</span>
          </div>
          <div className="bg-[#0d1b1f] border border-[#23444a] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs uppercase font-bold text-[#9db4b8]">Badges Earned</span>
            <div className="text-3xl font-black text-[#8bd450] mt-2 flex items-center gap-1">
              <span>{unlockedBadgesCount}</span>
              <span className="text-base text-[#9db4b8] font-semibold">/ {achievements.length}</span>
            </div>
            <span className="text-[11px] text-[#8bd450]">Streaks &amp; Milestones</span>
          </div>
        </div>
      </section>

      {/* Performance Trends Visualization (Recharts) */}
      <PerformanceTrendsChart 
        results={stats.results || []} 
        onStartPractice={handleStartFocused}
      />

      {/* Student Achievement & Badge Reward System */}
      <AchievementSystem
        stats={stats}
        onStartFocusPractice={handleStartFocused}
        onOpenSpelling={onOpenSpelling}
        onOpenMultiplayer={onOpenTournament}
      />

      {/* Filter and Session Configuration Bar */}
      <section className="bg-[#0d1b1f]/90 border border-[#23444a] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-[#28d4c7]">
          <Filter className="w-4 h-4" />
          Configure Practice Session
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Subject Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9db4b8] mb-1.5">
              Subject
            </label>
            <select
              value={subject}
              onChange={e => {
                setSubject(e.target.value as Subject);
                setUnit('all');
                setTopicId('all');
              }}
              className="w-full bg-[#08171a] border border-[#23444a] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#28d4c7]"
            >
              <option value="all">All Subjects</option>
              <option value="english">English</option>
              <option value="maths">Mathematics</option>
            </select>
          </div>

          {/* Unit Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9db4b8] mb-1.5">
              Unit
            </label>
            <select
              value={unit}
              onChange={e => {
                setUnit(e.target.value);
                setTopicId('all');
              }}
              className="w-full bg-[#08171a] border border-[#23444a] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#28d4c7]"
            >
              <option value="all">All Units</option>
              {availableUnits.filter(u => u !== 'all').map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Topic Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9db4b8] mb-1.5">
              Topic
            </label>
            <select
              value={topicId}
              onChange={e => setTopicId(e.target.value)}
              className="w-full bg-[#08171a] border border-[#23444a] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#28d4c7]"
            >
              <option value="all">All Matching Topics</option>
              {selectableTopics.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9db4b8] mb-1.5 flex items-center justify-between">
              <span>Difficulty</span>
              <span className={`text-[10px] font-extrabold uppercase ${
                difficulty === 'hard' ? 'text-[#ff6b5f]' : difficulty === 'easy' ? 'text-[#8bd450]' : 'text-[#28d4c7]'
              }`}>
                {difficulty}
              </span>
            </label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full bg-[#08171a] border border-[#23444a] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#28d4c7]"
            >
              <option value="easy">🌱 Easy (Foundational)</option>
              <option value="medium">⚡ Medium (GL Standard)</option>
              <option value="hard">🔥 Hard (Advanced)</option>
            </select>
          </div>

          {/* Mode Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9db4b8] mb-1.5">
              Practice Mode
            </label>
            <select
              value={mode}
              onChange={e => setMode(e.target.value as PracticeMode)}
              className="w-full bg-[#08171a] border border-[#23444a] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#28d4c7]"
            >
              <option value="mc">Multiple Choice</option>
              <option value="type">Type Answer</option>
              <option value="flash">Flashcards</option>
              <option value="match">Match Terms</option>
              <option value="speed">Speed Round (10s)</option>
              <option value="elimination">Elimination (3 Lives)</option>
              <option value="streak">Streak Master (Combo Flames 🔥)</option>
              <option value="boss">Curriculum Guardian (Boss Battle ⚔️)</option>
              <option value="blitz">60s Rapid Sprint (Blitz ⚡)</option>
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9db4b8] mb-1.5">
              Questions
            </label>
            <select
              value={count}
              onChange={e => setCount(Number(e.target.value))}
              className="w-full bg-[#08171a] border border-[#23444a] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#28d4c7]"
            >
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={25}>25 Questions</option>
              <option value={40}>40 Questions</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-[#23444a]/60">
          <div className="text-xs text-[#9db4b8]">
            Showing <strong className="text-white">{filteredTopics.length}</strong> matching topics &bull; Mode: <strong className="text-white">{mode.toUpperCase()}</strong> &bull; Level: <strong className={difficulty === 'hard' ? 'text-[#ff6b5f]' : difficulty === 'easy' ? 'text-[#8bd450]' : 'text-[#28d4c7]'}>{difficulty.toUpperCase()}</strong>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSurpriseMe}
              className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#13262b] border border-[#23444a] hover:border-[#28d4c7] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#28d4c7]" />
              Surprise Me
            </button>
            <button
              onClick={() => handleOpenPracticeModal(filteredTopics, mode)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#13262b] border border-[#28d4c7]/40 hover:border-[#28d4c7] hover:bg-[#183138] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open start practice modal with custom difficulty, mode & count"
            >
              <Sliders className="w-3.5 h-3.5 text-[#28d4c7]" />
              <span>Practice Modal</span>
            </button>
            <button
              onClick={handleStartFocused}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#28d4c7] to-[#158d99] text-[#031011] shadow-lg shadow-[#28d4c7]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Focus Session
            </button>
          </div>
        </div>
      </section>

      {/* Topic Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Topic Catalog</h3>
            <p className="text-xs sm:text-sm text-[#9db4b8]">Click any mode on a topic card to start immediately.</p>
          </div>
          <button
            onClick={onResetStats}
            className="text-xs text-[#9db4b8] hover:text-[#ff6b5f] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Local Stats
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map(t => {
            const stat = stats.topicStats[t.id] || { attempts: 0, correct: 0, mistakes: 0 };
            const accuracy = stat.attempts > 0 ? Math.round((stat.correct / stat.attempts) * 100) : null;

            return (
              <div
                key={t.id}
                className="bg-[#0d1b1f] border border-[#23444a] hover:border-[#28d4c7]/50 rounded-xl p-5 flex flex-col justify-between transition-all group shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-white text-base group-hover:text-[#28d4c7] transition-colors leading-snug">
                      {t.title}
                    </h4>
                    <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                      t.subject === 'maths'
                        ? 'bg-[#64a6ff]/10 text-[#64a6ff] border-[#64a6ff]/30'
                        : 'text-[#ff6b5f] bg-[#ff6b5f]/10 border-[#ff6b5f]/30'
                    }`}>
                      {t.subject}
                    </span>
                  </div>

                  <p className="text-xs text-[#9db4b8] line-clamp-2 leading-relaxed mb-3">
                    {t.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#102126] text-[#9db4b8] border border-[#23444a]">
                      {t.unit}
                    </span>
                    {accuracy !== null ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                        accuracy >= 80
                          ? 'bg-[#8bd450]/15 text-[#8bd450] border-[#8bd450]/30'
                          : 'bg-[#f2b84b]/15 text-[#f2b84b] border-[#f2b84b]/30'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {accuracy}% accuracy
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#102126] text-[#9db4b8] border border-[#23444a]">
                        Not practiced yet
                      </span>
                    )}
                    {stat.mistakes > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ff6b5f]/15 text-[#ff6b5f] border border-[#ff6b5f]/30">
                        {stat.mistakes} misses
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Play Modes */}
                <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-[#23444a]/60">
                  <button
                    onClick={() => handleOpenPracticeModal([t], 'mc')}
                    className="py-1.5 px-2 rounded-lg bg-[#28d4c7]/15 text-[#28d4c7] hover:bg-[#28d4c7] hover:text-[#031011] text-xs font-bold text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="Open practice modal with difficulty options"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Quiz
                  </button>
                  <button
                    onClick={() => onStartPractice([t], 'flash', 10, `${t.title} Flashcards`, difficulty)}
                    className="py-1.5 px-2 rounded-lg bg-[#13262b] text-[#9db4b8] hover:text-white hover:border-[#28d4c7] border border-[#23444a] text-xs font-semibold text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="Flashcard review"
                  >
                    <Layers className="w-3 h-3" />
                    Cards
                  </button>
                  <button
                    onClick={() => handleOpenPracticeModal([t], 'speed')}
                    className="py-1.5 px-2 rounded-lg bg-[#f2b84b]/15 text-[#f2b84b] hover:bg-[#f2b84b] hover:text-[#190d02] text-xs font-bold text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="10s Speed round"
                  >
                    <Zap className="w-3 h-3" />
                    Speed
                  </button>
                  <button
                    onClick={() => onOpenTournament(t.id)}
                    className="py-1.5 px-2 rounded-lg bg-[#ff6b5f]/15 text-[#ff6b5f] hover:bg-[#ff6b5f] hover:text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="Challenge a friend in 1v1 Arena"
                  >
                    <Swords className="w-3 h-3" />
                    1v1
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Start Practice Modal with Difficulty Selector */}
      {modalTopics && (
        <StartPracticeModal
          isOpen={Boolean(modalTopics)}
          onClose={() => setModalTopics(null)}
          topics={modalTopics}
          defaultMode={modalMode}
          defaultCount={count}
          defaultDifficulty={difficulty}
          onStart={onStartPractice}
        />
      )}
    </div>
  );
};
