import React from 'react';
import { PracticeMode, MissedQuestion, DifficultyLevel } from '../types';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  AlertCircle,
  LayoutGrid,
  Sparkles
} from 'lucide-react';

interface ResultScreenProps {
  mode: PracticeMode;
  title: string;
  score: number;
  attempts: number;
  correct: number;
  misses: MissedQuestion[];
  difficulty?: DifficultyLevel;
  onPlayAgain: () => void;
  onReplayMisses: (missedQuestions: MissedQuestion[]) => void;
  onGoToWeakTopics: () => void;
  onBackToDashboard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  mode,
  title,
  score,
  attempts,
  correct,
  misses,
  difficulty,
  onPlayAgain,
  onReplayMisses,
  onGoToWeakTopics,
  onBackToDashboard
}) => {
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Overview Card */}
      <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-xl">
        <div className="w-16 h-16 rounded-full bg-[#28d4c7]/20 text-[#28d4c7] flex items-center justify-center mx-auto shadow-lg shadow-[#28d4c7]/10">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Session Complete!
            </h2>
            {difficulty && (
              <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border ${
                difficulty === 'hard'
                  ? 'bg-[#ff6b5f]/15 text-[#ff6b5f] border-[#ff6b5f]/30'
                  : difficulty === 'easy'
                    ? 'bg-[#8bd450]/15 text-[#8bd450] border-[#8bd450]/30'
                    : 'bg-[#28d4c7]/15 text-[#28d4c7] border-[#28d4c7]/30'
              }`}>
                {difficulty === 'hard' ? '🔥 Hard' : difficulty === 'easy' ? '🌱 Easy' : '⚡ Medium'}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#9db4b8]">
            {title} finished with strong active recall practice.
          </p>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-[#08171a] border border-[#23444a] rounded-xl p-3.5">
            <span className="text-[10px] uppercase font-bold text-[#9db4b8] block">Score</span>
            <span className="text-2xl font-black text-[#28d4c7]">{score}</span>
          </div>
          <div className="bg-[#08171a] border border-[#23444a] rounded-xl p-3.5">
            <span className="text-[10px] uppercase font-bold text-[#9db4b8] block">Accuracy</span>
            <span className={`text-2xl font-black ${accuracy >= 80 ? 'text-[#8bd450]' : accuracy >= 50 ? 'text-[#f2b84b]' : 'text-[#ff6b5f]'}`}>
              {accuracy}%
            </span>
          </div>
          <div className="bg-[#08171a] border border-[#23444a] rounded-xl p-3.5">
            <span className="text-[10px] uppercase font-bold text-[#9db4b8] block">Answered</span>
            <span className="text-2xl font-black text-white">{attempts}</span>
          </div>
          <div className="bg-[#08171a] border border-[#23444a] rounded-xl p-3.5">
            <span className="text-[10px] uppercase font-bold text-[#9db4b8] block">Misses</span>
            <span className="text-2xl font-black text-[#ff6b5f]">{misses.length}</span>
          </div>
        </div>

        {/* 100% Perfection & Achievement Recognition Banner */}
        {accuracy === 100 && attempts >= 3 && (
          <div className="bg-gradient-to-r from-[#1c1402] via-[#2a1e05] to-[#1c1402] border border-[#f2b84b]/60 rounded-xl p-3 text-center flex items-center justify-center gap-2 text-xs font-bold text-[#f2b84b] shadow-lg shadow-[#f2b84b]/10 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-[#f2b84b]" />
            <span>Flawless 100% Session! Progress logged to your Dashboard Achievement Badges.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-2.5 pt-2">
          <button
            onClick={onPlayAgain}
            className="px-5 py-2.5 rounded-xl bg-[#28d4c7] hover:bg-[#20b2a6] text-[#031011] font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-[#28d4c7]/20 flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>

          {misses.length > 0 && (
            <button
              onClick={() => onReplayMisses(misses)}
              className="px-5 py-2.5 rounded-xl bg-[#ff6b5f]/15 text-[#ff6b5f] hover:bg-[#ff6b5f] hover:text-white border border-[#ff6b5f]/40 font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" />
              Replay {misses.length} Misses
            </button>
          )}

          <button
            onClick={onGoToWeakTopics}
            className="px-5 py-2.5 rounded-xl bg-[#f2b84b]/15 text-[#f2b84b] hover:bg-[#f2b84b] hover:text-[#190d02] border border-[#f2b84b]/40 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            Weak Topics Review
          </button>

          <button
            onClick={onBackToDashboard}
            className="px-5 py-2.5 rounded-xl bg-[#13262b] text-white border border-[#23444a] hover:border-[#28d4c7] font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LayoutGrid className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>

      {/* Missed Questions Breakdown */}
      {misses.length > 0 && (
        <div className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#23444a]/80 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#ff6b5f]" />
              Detailed Error Analysis &amp; Explanations
            </h3>
            <span className="text-xs text-[#ff6b5f] font-bold">
              {misses.length} to review
            </span>
          </div>

          <div className="space-y-3.5">
            {misses.map((m, idx) => (
              <div
                key={idx}
                className="bg-[#08171a] border border-[#23444a] rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-[#9db4b8]">
                  <span className="font-bold text-[#28d4c7]">{m.question.topic} ({m.question.subject})</span>
                  <span>{m.question.unit}</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  {m.question.prompt}
                </p>
                <div className="text-xs space-y-1 pt-1">
                  <div className="text-[#ff6b5f]">
                    <strong>Your answer:</strong> {m.selected}
                  </div>
                  <div className="text-[#8bd450]">
                    <strong>Correct answer:</strong> {m.question.answer}
                  </div>
                  <div className="text-[#9db4b8] pt-1">
                    <strong>Why:</strong> {m.question.explanation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
