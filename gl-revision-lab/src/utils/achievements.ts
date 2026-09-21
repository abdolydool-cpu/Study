import { UserStats, Achievement } from '../types';

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'volume' | 'perfection' | 'mastery';
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  target: number;
  progressFn: (stats: UserStats) => number;
  progressLabelFn: (progress: number, target: number) => string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // --- Streaks Badges ---
  {
    id: 'streak_3',
    title: 'Streak Spark',
    description: 'Score 3 consecutive correct answers in any practice mode.',
    icon: '🔥',
    category: 'streak',
    tier: 'bronze',
    target: 3,
    progressFn: (stats) => Math.max(stats.maxStreak || 0, stats.spelling?.streak || 0, stats.spelling?.best || 0),
    progressLabelFn: (prog, target) => `${Math.min(prog, target)} / ${target} streak`
  },
  {
    id: 'streak_5',
    title: 'Streak Master',
    description: 'Maintain a 5-question unbroken correct streak in active recall.',
    icon: '⚡',
    category: 'streak',
    tier: 'silver',
    target: 5,
    progressFn: (stats) => Math.max(stats.maxStreak || 0, stats.spelling?.streak || 0, stats.spelling?.best || 0),
    progressLabelFn: (prog, target) => `${Math.min(prog, target)} / ${target} streak`
  },
  {
    id: 'streak_10',
    title: 'Unstoppable Titan',
    description: 'Conquer a 10-question flawless streak across GL Assessment topics.',
    icon: '🌟',
    category: 'streak',
    tier: 'gold',
    target: 10,
    progressFn: (stats) => Math.max(stats.maxStreak || 0, stats.spelling?.streak || 0, stats.spelling?.best || 0),
    progressLabelFn: (prog, target) => `${Math.min(prog, target)} / ${target} streak`
  },
  {
    id: 'spelling_streak_5',
    title: 'British Spellmaster',
    description: 'Spell 5 vocabulary words correctly in a row in the Speech Lab.',
    icon: '🗣️',
    category: 'streak',
    tier: 'silver',
    target: 5,
    progressFn: (stats) => Math.max(stats.spelling?.streak || 0, stats.spelling?.best || 0),
    progressLabelFn: (prog, target) => `${Math.min(prog, target)} / ${target} words`
  },

  // --- Volume / Question Count Badges ---
  {
    id: 'questions_10',
    title: 'Curriculum Initiate',
    description: 'Complete your first 10 revision questions.',
    icon: '🌱',
    category: 'volume',
    tier: 'bronze',
    target: 10,
    progressFn: (stats) => Object.values(stats.topicStats || {}).reduce((acc, s) => acc + (s.attempts || 0), 0),
    progressLabelFn: (prog, target) => `${Math.min(prog, target)} / ${target} questions`
  },
  {
    id: 'questions_50',
    title: 'Half-Century Scholar',
    description: 'Answer 50 questions across English and Mathematics syllabus.',
    icon: '🎯',
    category: 'volume',
    tier: 'silver',
    target: 50,
    progressFn: (stats) => Object.values(stats.topicStats || {}).reduce((acc, s) => acc + (s.attempts || 0), 0),
    progressLabelFn: (prog, target) => `${Math.min(prog, target)} / ${target} questions`
  },
  {
    id: 'questions_100',
    title: 'Centurion Master',
    description: 'Answer 100 questions to solidify long-term memory retention.',
    icon: '🏛️',
    category: 'volume',
    tier: 'gold',
    target: 100,
    progressFn: (stats) => Object.values(stats.topicStats || {}).reduce((acc, s) => acc + (s.attempts || 0), 0),
    progressLabelFn: (prog, target) => `${Math.min(prog, target)} / ${target} questions`
  },

  // --- 100% Perfection Badges ---
  {
    id: 'perfection_single',
    title: 'Flawless Century (100%)',
    description: 'Achieve 100% accuracy in a complete practice session.',
    icon: '💯',
    category: 'perfection',
    tier: 'gold',
    target: 1,
    progressFn: (stats) => (stats.results || []).filter(r => r.accuracy === 100).length,
    progressLabelFn: (prog, target) => prog >= 1 ? '100% Achieved!' : '0 / 1 session'
  },
  {
    id: 'perfection_triple',
    title: 'Double Perfection',
    description: 'Achieve 100% accuracy in 3 separate revision sessions.',
    icon: '👑',
    category: 'perfection',
    tier: 'diamond',
    target: 3,
    progressFn: (stats) => (stats.results || []).filter(r => r.accuracy === 100).length,
    progressLabelFn: (prog, target) => `${Math.min(prog, target)} / ${target} sessions`
  },

  // --- Mastery & Benchmark Badges ---
  {
    id: 'gl_benchmark_master',
    title: 'GL Benchmark Standard',
    description: 'Complete 5 sessions at or above the 80% GL Assessment benchmark.',
    icon: '🏆',
    category: 'mastery',
    tier: 'gold',
    target: 5,
    progressFn: (stats) => (stats.results || []).filter(r => r.accuracy >= 80).length,
    progressLabelFn: (prog, target) => `${Math.min(prog, target)} / ${target} sessions`
  },
  {
    id: 'multiplayer_veteran',
    title: 'Arena Gladiator',
    description: 'Compete in a 1v1 or multiplayer room challenge.',
    icon: '⚔️',
    category: 'mastery',
    tier: 'silver',
    target: 1,
    progressFn: (stats) => (stats.unlockedBadges && stats.unlockedBadges['multiplayer_veteran']) ? 1 : 0,
    progressLabelFn: (prog, target) => prog >= 1 ? 'Completed' : 'Join Arena'
  }
];

export function calculateAchievements(stats: UserStats): Achievement[] {
  const unlockedMap = stats.unlockedBadges || {};

  return BADGE_DEFINITIONS.map(def => {
    const rawProgress = def.progressFn(stats);
    const hasStoredUnlock = Boolean(unlockedMap[def.id]);
    const isUnlocked = hasStoredUnlock || rawProgress >= def.target;
    const progress = Math.min(rawProgress, def.target);

    return {
      id: def.id,
      title: def.title,
      description: def.description,
      icon: def.icon,
      category: def.category,
      tier: def.tier,
      progress,
      maxProgress: def.target,
      progressLabel: def.progressLabelFn(rawProgress, def.target),
      unlocked: isUnlocked,
      unlockedAt: unlockedMap[def.id]
    };
  });
}

/**
 * Checks if any new achievements were unlocked during a session update
 */
export function evaluateAndUnlockAchievements(
  stats: UserStats,
  sessionStreak: number = 0,
  sessionAccuracy: number = 0,
  sessionQuestions: number = 0
): { updatedStats: UserStats; newlyUnlocked: Achievement[] } {
  const currentUnlocked = { ...(stats.unlockedBadges || {}) };
  const currentMaxStreak = Math.max(stats.maxStreak || 0, sessionStreak);

  const candidateStats: UserStats = {
    ...stats,
    maxStreak: currentMaxStreak,
    unlockedBadges: currentUnlocked
  };

  const newlyUnlocked: Achievement[] = [];
  const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  BADGE_DEFINITIONS.forEach(def => {
    const alreadyUnlocked = Boolean(currentUnlocked[def.id]);
    if (!alreadyUnlocked) {
      const progress = def.progressFn(candidateStats);
      // Extra condition for single session 100% if session just achieved
      const isPerfection = def.id === 'perfection_single' && sessionAccuracy === 100 && sessionQuestions >= 3;
      const isStreakSpark = def.id === 'streak_3' && sessionStreak >= 3;
      const isStreakMaster = def.id === 'streak_5' && sessionStreak >= 5;
      const isStreakTitan = def.id === 'streak_10' && sessionStreak >= 10;

      if (progress >= def.target || isPerfection || isStreakSpark || isStreakMaster || isStreakTitan) {
        currentUnlocked[def.id] = now;
        newlyUnlocked.push({
          id: def.id,
          title: def.title,
          description: def.description,
          icon: def.icon,
          category: def.category,
          tier: def.tier,
          progress: def.target,
          maxProgress: def.target,
          progressLabel: def.progressLabelFn(def.target, def.target),
          unlocked: true,
          unlockedAt: now
        });
      }
    }
  });

  const updatedStats: UserStats = {
    ...candidateStats,
    maxStreak: currentMaxStreak,
    unlockedBadges: currentUnlocked
  };

  return { updatedStats, newlyUnlocked };
}
