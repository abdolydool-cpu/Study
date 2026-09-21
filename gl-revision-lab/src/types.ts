export type Subject = 'all' | 'english' | 'maths';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type PracticeMode = 
  | 'mc' 
  | 'type' 
  | 'comprehension' 
  | 'flash' 
  | 'match' 
  | 'speed' 
  | 'elimination' 
  | 'exam'
  | 'streak'
  | 'boss'
  | 'blitz';

export interface Topic {
  id: string;
  subject: 'english' | 'maths';
  unit: string;
  title: string;
  description: string;
  terms: string[];
}

export interface Question {
  id: string;
  topicId: string;
  subject: 'english' | 'maths';
  unit: string;
  topic: string;
  prompt: string;
  answer: string;
  accepted: string[];
  options: string[];
  explanation: string;
  passage?: string;
  passageTitle?: string;
  interaction?: 'mc' | 'type' | 'multiple-choice-only';
  skill?: string;
  marks?: number;
  difficulty?: DifficultyLevel;
}

export interface ComprehensionQuestion {
  prompt: string;
  answer: string;
  options: string[];
  explanation: string;
  interaction?: 'mc' | 'type';
  skill?: string;
  marks?: number;
  typeAnswer?: string;
}

export interface ComprehensionPassage {
  id: string;
  title: string;
  topicId: string;
  unit: string;
  passage: string;
  questions: ComprehensionQuestion[];
}

export interface FlashcardItem {
  topicId: string;
  subject: 'english' | 'maths';
  unit: string;
  topic: string;
  front: string;
  back: string;
  explanation: string;
}

export interface MatchTile {
  id: string;
  key: number;
  text: string;
  side: 'left' | 'right';
  matched: boolean;
}

export interface MatchPair {
  topicId: string;
  left: string;
  right: string;
  topic: string;
  subject: 'english' | 'maths';
  unit: string;
}

export interface MissedQuestion {
  question: Question;
  selected: string;
}

export interface TopicStat {
  attempts: number;
  correct: number;
  mistakes: number;
}

export interface GameResult {
  date: string;
  mode: PracticeMode;
  score: number;
  accuracy: number;
  elapsed: number;
  title: string;
  difficulty?: DifficultyLevel;
}

export interface SpellingSettings {
  words: string[];
  best: number;
  streak: number;
  voiceURI?: string;
}

export type AchievementCategory = 'streak' | 'volume' | 'perfection' | 'mastery';
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: AchievementTier;
  progress: number;
  maxProgress: number;
  progressLabel: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  topicStats: Record<string, TopicStat>;
  best: Record<string, number>;
  spelling: SpellingSettings;
  results: GameResult[];
  maxStreak?: number;
  unlockedBadges?: Record<string, string>;
}

export interface MultiplayerPlayer {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  currentQIndex: number;
  isReady: boolean;
  isFinished: boolean;
  lastAnswerCorrect?: boolean;
  reaction?: { emoji: string; text: string; timestamp: number };
}

export interface MultiplayerRoom {
  id: string;
  name: string;
  hostId: string;
  status: 'waiting' | 'starting' | 'in_progress' | 'finished';
  subject: 'all' | 'english' | 'maths';
  topicId?: string;
  topicTitle?: string;
  questionCount: number;
  timePerQuestion: number;
  questions: Question[];
  players: Record<string, MultiplayerPlayer>;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
}

export interface PublicRoomInfo {
  id: string;
  name: string;
  hostName: string;
  subject: 'all' | 'english' | 'maths';
  topicTitle: string;
  questionCount: number;
  timePerQuestion: number;
  playerCount: number;
  maxPlayers: number;
}

