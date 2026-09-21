import { UserStats, GameResult } from '../types';

export const STORE_KEY = 'gl-revision-lab-v3';

export const DEFAULT_WORDS: string[] = [
  "accommodate", "achieve", "aggressive", "apparent", "argument", "awkward",
  "conscience", "conscious", "definite", "desperate", "develop", "embarrass",
  "environment", "exaggerate", "existence", "foreign", "guarantee", "harass",
  "hindrance", "identity", "immediately", "interrupt", "language", "leisure",
  "lightning", "necessary", "neighbour", "opportunity", "parliament", "persuade",
  "privilege", "pronunciation", "queue", "recognise", "recommend", "restaurant",
  "rhyme", "rhythm", "sincerely", "soldier", "stomach", "sufficient", "symbol",
  "temperature", "thorough", "twelfth", "variety", "vegetable", "yacht"
];

export const INITIAL_SAMPLE_RESULTS: GameResult[] = [
  { date: '10 Sep 09:15', mode: 'mc', score: 8, accuracy: 70, elapsed: 140, title: 'English: Vocabulary Diagnostics' },
  { date: '10 Sep 14:30', mode: 'flash', score: 9, accuracy: 75, elapsed: 120, title: 'Maths: Algebraic Notation' },
  { date: '11 Sep 10:00', mode: 'speed', score: 10, accuracy: 70, elapsed: 95, title: 'English: Sentence Structure' },
  { date: '11 Sep 16:20', mode: 'match', score: 12, accuracy: 80, elapsed: 110, title: 'Maths: Angles & Shapes' },
  { date: '12 Sep 11:10', mode: 'streak', score: 14, accuracy: 85, elapsed: 135, title: 'English: Punctuation Master' },
  { date: '12 Sep 15:45', mode: 'boss', score: 15, accuracy: 80, elapsed: 150, title: 'Maths: Fractions & Percentages' },
  { date: '12 Sep 18:30', mode: 'blitz', score: 18, accuracy: 90, elapsed: 60, title: 'Rapid Sprint Challenge' },
  { date: '13 Sep 08:45', mode: 'mc', score: 18, accuracy: 85, elapsed: 110, title: 'Comprehension: Historical Extract' },
  { date: '13 Sep 11:20', mode: 'type', score: 19, accuracy: 95, elapsed: 130, title: 'Maths: Ratio & Proportion' },
  { date: '13 Sep 12:15', mode: 'streak', score: 20, accuracy: 90, elapsed: 125, title: 'English: Figurative Devices' }
];

export const INITIAL_SAMPLE_TOPIC_STATS = {
  'eng_vocab': { attempts: 12, correct: 10, mistakes: 2 },
  'math_algebra': { attempts: 10, correct: 8, mistakes: 2 },
  'eng_punct': { attempts: 8, correct: 7, mistakes: 1 },
  'math_ratio': { attempts: 7, correct: 6, mistakes: 1 },
  'math_geom': { attempts: 5, correct: 4, mistakes: 1 }
};

const fallbackStats: UserStats = {
  topicStats: INITIAL_SAMPLE_TOPIC_STATS,
  best: {},
  spelling: {
    words: DEFAULT_WORDS,
    best: 4,
    streak: 4,
    voiceURI: ''
  },
  results: INITIAL_SAMPLE_RESULTS,
  maxStreak: 4,
  unlockedBadges: {
    'streak_3': '12 Sep',
    'questions_10': '11 Sep'
  }
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return fallbackStats;
    const parsed = JSON.parse(raw);
    return {
      topicStats: (parsed.topicStats && Object.keys(parsed.topicStats).length > 0) ? parsed.topicStats : INITIAL_SAMPLE_TOPIC_STATS,
      best: parsed.best || {},
      spelling: {
        ...fallbackStats.spelling,
        ...(parsed.spelling || {})
      },
      results: (parsed.results && parsed.results.length > 0) ? parsed.results : INITIAL_SAMPLE_RESULTS,
      maxStreak: typeof parsed.maxStreak === 'number' ? parsed.maxStreak : 4,
      unlockedBadges: parsed.unlockedBadges || fallbackStats.unlockedBadges || {}
    };
  } catch {
    return fallbackStats;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function recordTopicAttempt(topicId: string, correct: boolean): UserStats {
  return recordBatchAttempts([{ topicId, correct }]);
}

/**
 * Persists multiple topic attempts in a single write operation, preventing
 * quadratic JSON serialization overhead during large practice sessions.
 */
export function recordBatchAttempts(attempts: { topicId: string; correct: boolean }[]): UserStats {
  const stats = loadUserStats();
  for (const { topicId, correct } of attempts) {
    const current = stats.topicStats[topicId] || { attempts: 0, correct: 0, mistakes: 0 };
    current.attempts += 1;
    if (correct) {
      current.correct += 1;
    } else {
      current.mistakes += 1;
    }
    stats.topicStats[topicId] = current;
  }
  saveUserStats(stats);
  return stats;
}

export function recordSessionResult(result: GameResult): UserStats {
  const stats = loadUserStats();
  stats.results = [...(stats.results || []), result];
  saveUserStats(stats);
  return stats;
}

export function clearAllStats(): UserStats {
  const stats: UserStats = {
    ...fallbackStats,
    spelling: {
      ...fallbackStats.spelling,
      words: DEFAULT_WORDS
    }
  };
  saveUserStats(stats);
  return stats;
}
