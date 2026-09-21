import React, { useState } from 'react';
import { Topic, PracticeMode, DifficultyLevel } from '../types';
import { 
  X, 
  Play, 
  Sparkles, 
  Zap, 
  Flame, 
  Sprout, 
  Check, 
  Layers, 
  Target, 
  Swords, 
  Timer,
  HeartCrack
} from 'lucide-react';

interface StartPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: Topic[];
  defaultMode?: PracticeMode;
  defaultCount?: number;
  defaultDifficulty?: DifficultyLevel;
  onStart: (topics: Topic[], mode: PracticeMode, count: number, title?: string, difficulty?: DifficultyLevel) => void;
}

export const StartPracticeModal: React.FC<StartPracticeModalProps> = ({
  isOpen,
  onClose,
  topics,
  defaultMode = 'mc',
  defaultCount = 15,
  defaultDifficulty = 'medium',
  onStart
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(defaultDifficulty);
  const [mode, setMode] = useState<PracticeMode>(defaultMode);
  const [count, setCount] = useState<number>(defaultCount);

  if (!isOpen || !topics.length) return null;

  const isSingleTopic = topics.length === 1;
  const primaryTopic = topics[0];

  const handleLaunch = () => {
    const title = isSingleTopic 
      ? `${primaryTopic.title} (${difficulty.toUpperCase()})`
      : `${topics.length} Topics Focus (${difficulty.toUpperCase()})`;
    onStart(topics, mode, count, title, difficulty);
    onClose();
  };

  const difficultyOptions: Array<{
    level: DifficultyLevel;
    title: string;
    badge: string;
    icon: React.ReactNode;
    color: string;
    activeBorder: string;
    activeBg: string;
    description: string;
    details: string;
  }> = [
    {
      level: 'easy',
      title: 'Easy',
      badge: 'Foundational',
      icon: <Sprout className="w-4 h-4 text-[#8bd450]" />,
      color: 'text-[#8bd450]',
      activeBorder: 'border-[#8bd450] ring-1 ring-[#8bd450]',
      activeBg: 'bg-[#8bd450]/10',
      description: 'Foundational recall & simpler numbers',
      details: 'Straightforward arithmetic, standard vocabulary, single-clause grammar, and core concepts with minimal distraction.'
    },
    {
      level: 'medium',
      title: 'Medium',
      badge: 'GL Standard',
      icon: <Zap className="w-4 h-4 text-[#28d4c7]" />,
      color: 'text-[#28d4c7]',
      activeBorder: 'border-[#28d4c7] ring-1 ring-[#28d4c7]',
      activeBg: 'bg-[#28d4c7]/10',
      description: 'Curriculum-accurate Year 7 GL benchmark',
      details: 'Authentic 11+ GL Assessment complexity, multi-step problem solving, dual clauses, and balanced distractors.'
    },
    {
      level: 'hard',
      title: 'Hard',
      badge: 'Advanced Challenge',
      icon: <Flame className="w-4 h-4 text-[#ff6b5f]" />,
      color: 'text-[#ff6b5f]',
      activeBorder: 'border-[#ff6b5f] ring-1 ring-[#ff6b5f]',
      activeBg: 'bg-[#ff6b5f]/10',
      description: 'High-order logic & Tier 3 vocabulary',
      details: 'Multi-operation algebra, higher decimal/fraction arithmetic, subjunctive grammar, subtle nuances, and intricate traps.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#23444a]/80 bg-[#08171a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#28d4c7]/15 border border-[#28d4c7]/30 flex items-center justify-center text-[#28d4c7]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Start Practice Session
              </h3>
              <p className="text-xs text-[#9db4b8]">
                {isSingleTopic ? primaryTopic.title : `${topics.length} Selected Topics`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9db4b8] hover:text-white hover:bg-[#13262b] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Target Topics Info */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#9db4b8] font-medium">Target:</span>
            {isSingleTopic ? (
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                  primaryTopic.subject === 'maths'
                    ? 'bg-[#64a6ff]/10 text-[#64a6ff] border-[#64a6ff]/30'
                    : 'bg-[#ff6b5f]/10 text-[#ff6b5f] border-[#ff6b5f]/30'
                }`}>
                  {primaryTopic.subject}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#102126] text-[#9db4b8] border border-[#23444a]">
                  {primaryTopic.unit}
                </span>
              </div>
            ) : (
              <span className="px-2 py-0.5 rounded bg-[#102126] text-[#28d4c7] border border-[#28d4c7]/30 font-semibold">
                Mixed Syllabus ({topics.length} topics)
              </span>
            )}
          </div>

          {/* ================= DIFFICULTY SELECTOR ================= */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#d8e8ea] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#28d4c7]" />
                Select Difficulty Level
              </label>
              <span className="text-[11px] text-[#9db4b8]">
                Dynamically scales question generation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {difficultyOptions.map(opt => {
                const isSelected = difficulty === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setDifficulty(opt.level)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected 
                        ? `${opt.activeBorder} ${opt.activeBg} shadow-lg` 
                        : 'border-[#23444a] bg-[#08171a]/80 hover:border-[#28d4c7]/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#28d4c7] text-[#031011] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {opt.icon}
                        <span className={`text-sm font-black ${isSelected ? opt.color : 'text-white'}`}>
                          {opt.title}
                        </span>
                      </div>
                      <span className={`text-[10px] uppercase font-extrabold block mb-1.5 ${
                        isSelected ? opt.color : 'text-[#9db4b8]'
                      }`}>
                        {opt.badge}
                      </span>
                      <p className="text-[11px] text-[#9db4b8] leading-snug">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanatory text for selected difficulty */}
            <div className="p-3 rounded-xl bg-[#08171a] border border-[#23444a]/80 text-xs text-[#9db4b8] leading-relaxed">
              <span className="font-semibold text-white">Selected Difficulty Details: </span>
              {difficultyOptions.find(o => o.level === difficulty)?.details}
            </div>
          </div>

          {/* ================= PRACTICE MODE SELECTOR ================= */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#d8e8ea] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#28d4c7]" />
              Practice Mode
            </label>
            <select
              value={mode}
              onChange={e => setMode(e.target.value as PracticeMode)}
              className="w-full bg-[#08171a] border border-[#23444a] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#28d4c7]"
            >
              <option value="mc">Multiple Choice (Standard 4 Options)</option>
              <option value="type">Type Answer (Active Recall)</option>
              <option value="flash">Flashcards (Spaced Repetition)</option>
              <option value="match">Match Terms (Prompt &amp; Definition Pairs)</option>
              <option value="speed">Speed Round (10s Countdown Per Question)</option>
              <option value="elimination">Elimination Mode (3 Lives Only)</option>
              <option value="streak">Streak Master (Multipliers &amp; Combo Flames 🔥)</option>
              <option value="boss">Curriculum Guardian (Boss Battle ⚔️)</option>
              <option value="blitz">60s Rapid Sprint (Blitz ⚡)</option>
            </select>
          </div>

          {/* ================= QUESTION COUNT SELECTOR ================= */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#d8e8ea] flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-[#28d4c7]" />
              Number of Questions
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 25, 40].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    count === n
                      ? 'bg-[#28d4c7]/20 border-[#28d4c7] text-[#28d4c7]'
                      : 'bg-[#08171a] border-[#23444a] text-[#9db4b8] hover:text-white hover:border-[#28d4c7]/40'
                  }`}
                >
                  {n} Questions
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#23444a]/80 bg-[#08171a] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#9db4b8] hover:text-white hover:bg-[#13262b] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLaunch}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#28d4c7] to-[#158d99] text-[#031011] shadow-lg shadow-[#28d4c7]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch ({difficulty.toUpperCase()} &bull; {count} Qs)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
