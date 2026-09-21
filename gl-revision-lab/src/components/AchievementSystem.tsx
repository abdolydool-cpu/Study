import React, { useState, useMemo } from 'react';
import { UserStats, Achievement, AchievementCategory, AchievementTier } from '../types';
import { calculateAchievements } from '../utils/achievements';
import { 
  Award, 
  Flame, 
  Target, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  Zap, 
  Trophy, 
  ArrowUpRight 
} from 'lucide-react';

interface AchievementSystemProps {
  stats: UserStats;
  onStartFocusPractice?: () => void;
  onOpenSpelling?: () => void;
  onOpenMultiplayer?: () => void;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  stats,
  onStartFocusPractice,
  onOpenSpelling,
  onOpenMultiplayer
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | AchievementCategory>('all');
  const [filterUnlockedOnly, setFilterUnlockedOnly] = useState<boolean>(false);

  const achievements = useMemo(() => {
    return calculateAchievements(stats);
  }, [stats]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Filtered achievements list
  const filteredAchievements = useMemo(() => {
    return achievements.filter(a => {
      const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
      const matchesUnlocked = !filterUnlockedOnly || a.unlocked;
      return matchesCategory && matchesUnlocked;
    });
  }, [achievements, activeCategory, filterUnlockedOnly]);

  // Find next closest locked achievement
  const nextTarget = useMemo(() => {
    const locked = achievements.filter(a => !a.unlocked);
    if (locked.length === 0) return null;
    return locked.sort((a, b) => {
      const pctA = a.progress / a.maxProgress;
      const pctB = b.progress / b.maxProgress;
      return pctB - pctA;
    })[0];
  }, [achievements]);

  const getTierStyles = (tier: AchievementTier, unlocked: boolean) => {
    if (!unlocked) {
      return {
        badgeBg: 'bg-[#102126]',
        border: 'border-[#23444a]/80',
        text: 'text-[#9db4b8]',
        glow: '',
        pill: 'bg-[#13262b] text-[#527880] border-[#23444a]',
        accent: '#527880'
      };
    }

    switch (tier) {
      case 'diamond':
        return {
          badgeBg: 'bg-gradient-to-br from-[#083238] to-[#041d21]',
          border: 'border-[#28d4c7]/60',
          text: 'text-[#28d4c7]',
          glow: 'shadow-lg shadow-[#28d4c7]/15',
          pill: 'bg-[#28d4c7]/15 text-[#28d4c7] border-[#28d4c7]/40',
          accent: '#28d4c7'
        };
      case 'gold':
        return {
          badgeBg: 'bg-gradient-to-br from-[#3b2b08] to-[#1c1402]',
          border: 'border-[#f2b84b]/60',
          text: 'text-[#f2b84b]',
          glow: 'shadow-lg shadow-[#f2b84b]/15',
          pill: 'bg-[#f2b84b]/15 text-[#f2b84b] border-[#f2b84b]/40',
          accent: '#f2b84b'
        };
      case 'silver':
        return {
          badgeBg: 'bg-gradient-to-br from-[#1a2e33] to-[#0d1b1f]',
          border: 'border-[#b0bec5]/50',
          text: 'text-[#d0e0e3]',
          glow: 'shadow-md shadow-[#b0bec5]/10',
          pill: 'bg-[#b0bec5]/15 text-[#d0e0e3] border-[#b0bec5]/30',
          accent: '#b0bec5'
        };
      case 'bronze':
      default:
        return {
          badgeBg: 'bg-gradient-to-br from-[#331c0f] to-[#170a04]',
          border: 'border-[#df7a37]/50',
          text: 'text-[#df7a37]',
          glow: 'shadow-md shadow-[#df7a37]/10',
          pill: 'bg-[#df7a37]/15 text-[#df7a37] border-[#df7a37]/30',
          accent: '#df7a37'
        };
    }
  };

  const handleActionForBadge = (badgeId: string) => {
    if (badgeId.includes('spelling') && onOpenSpelling) {
      onOpenSpelling();
    } else if (badgeId.includes('multiplayer') && onOpenMultiplayer) {
      onOpenMultiplayer();
    } else if (onStartFocusPractice) {
      onStartFocusPractice();
    }
  };

  return (
    <section 
      id="student-achievements-system" 
      className="bg-[#0d1b1f] border border-[#23444a] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden"
    >
      {/* Top Section: Title & Overall Progress Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#23444a]/70 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#f2b84b]/15 text-[#f2b84b] border border-[#f2b84b]/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Curriculum Achievements &amp; Badges
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#28d4c7]/15 text-[#28d4c7] border border-[#28d4c7]/30">
                  {unlockedCount} / {totalCount} Earned
                </span>
              </h3>
              <p className="text-xs text-[#9db4b8] mt-0.5">
                Earn badges for consecutive streaks, completing 50 questions, and scoring 100% in GL revision sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar Bar */}
        <div className="bg-[#102126] border border-[#23444a] rounded-xl p-3 sm:min-w-[280px]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-[#9db4b8]">Mastery Progress</span>
            <span className="text-[#28d4c7]">{completionPercentage}% Completed</span>
          </div>
          <div className="w-full bg-[#08171a] h-2.5 rounded-full overflow-hidden border border-[#23444a]/60">
            <div 
              className="h-full bg-gradient-to-r from-[#28d4c7] via-[#8bd450] to-[#f2b84b] rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#527880] mt-1.5">
            <span>Initiate</span>
            <span>Centurion</span>
            <span>Grand Master</span>
          </div>
        </div>
      </div>

      {/* Recommended Next Milestone Banner (if available) */}
      {nextTarget && (
        <div className="mb-6 rounded-xl bg-gradient-to-r from-[#102126] via-[#13262b] to-[#0e191d] border border-[#28d4c7]/30 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="text-2xl p-2 rounded-xl bg-[#08171a] border border-[#23444a] shadow-inner">
              {nextTarget.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#f2b84b] uppercase tracking-wider">
                  Next Milestone:
                </span>
                <span className="text-xs font-bold text-white">
                  {nextTarget.title}
                </span>
              </div>
              <p className="text-xs text-[#9db4b8] mt-0.5">
                {nextTarget.description} • Current: <strong className="text-[#28d4c7]">{nextTarget.progressLabel}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => handleActionForBadge(nextTarget.id)}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#28d4c7] hover:bg-[#20b2a6] text-[#031011] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Practice Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Quick Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#102126] p-1 rounded-xl border border-[#23444a]">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#28d4c7] text-[#031011] font-bold shadow-sm'
                : 'text-[#9db4b8] hover:text-white'
            }`}
          >
            All Badges ({totalCount})
          </button>
          <button
            onClick={() => setActiveCategory('streak')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activeCategory === 'streak'
                ? 'bg-[#28d4c7] text-[#031011] font-bold shadow-sm'
                : 'text-[#9db4b8] hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3 text-[#ff6b5f]" />
            Streaks
          </button>
          <button
            onClick={() => setActiveCategory('volume')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activeCategory === 'volume'
                ? 'bg-[#28d4c7] text-[#031011] font-bold shadow-sm'
                : 'text-[#9db4b8] hover:text-white'
            }`}
          >
            <Target className="w-3 h-3 text-[#28d4c7]" />
            Questions (50+)
          </button>
          <button
            onClick={() => setActiveCategory('perfection')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activeCategory === 'perfection'
                ? 'bg-[#28d4c7] text-[#031011] font-bold shadow-sm'
                : 'text-[#9db4b8] hover:text-white'
            }`}
          >
            <Crown className="w-3 h-3 text-[#f2b84b]" />
            100% Flawless
          </button>
          <button
            onClick={() => setActiveCategory('mastery')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activeCategory === 'mastery'
                ? 'bg-[#28d4c7] text-[#031011] font-bold shadow-sm'
                : 'text-[#9db4b8] hover:text-white'
            }`}
          >
            <Trophy className="w-3 h-3 text-[#8bd450]" />
            Mastery
          </button>
        </div>

        {/* Unlocked Only Toggle */}
        <label className="flex items-center gap-2 text-xs font-semibold text-[#9db4b8] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterUnlockedOnly}
            onChange={(e) => setFilterUnlockedOnly(e.target.checked)}
            className="w-4 h-4 rounded bg-[#102126] border-[#23444a] text-[#28d4c7] focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span>Show Unlocked Only ({unlockedCount})</span>
        </label>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredAchievements.map((badge) => {
          const style = getTierStyles(badge.tier, badge.unlocked);
          const progressPercent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

          return (
            <div
              key={badge.id}
              id={`achievement-card-${badge.id}`}
              className={`rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between relative ${style.badgeBg} ${style.border} ${style.glow}`}
            >
              {/* Card Header: Icon + Tier Pill */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                    badge.unlocked 
                      ? 'bg-[#08171a]/70 border-white/10' 
                      : 'bg-[#08171a]/90 border-[#23444a]/40 grayscale opacity-70'
                  }`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold leading-tight ${
                      badge.unlocked ? 'text-white' : 'text-[#9db4b8]'
                    }`}>
                      {badge.title}
                    </h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#527880]">
                      {badge.category.toUpperCase()} • {badge.tier.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Status Pill */}
                {badge.unlocked ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border ${style.pill}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    Unlocked
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0a1518] text-[#527880] border border-[#23444a] flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-[#9db4b8] leading-relaxed mb-3">
                {badge.description}
              </p>

              {/* Progress Bar & Label */}
              <div className="space-y-1.5 pt-2 border-t border-[#23444a]/40">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className={badge.unlocked ? 'text-[#8bd450]' : 'text-[#9db4b8]'}>
                    {badge.unlocked ? (badge.unlockedAt ? `Earned ${badge.unlockedAt}` : 'Badge Achieved') : badge.progressLabel}
                  </span>
                  <span className="text-white font-bold">
                    {progressPercent}%
                  </span>
                </div>

                <div className="w-full bg-[#08171a] h-1.5 rounded-full overflow-hidden border border-[#23444a]/50">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      badge.unlocked 
                        ? 'bg-gradient-to-r from-[#8bd450] to-[#28d4c7]' 
                        : 'bg-[#28d4c7]/70'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Quick Action Button for In-Progress Badges */}
              {!badge.unlocked && (
                <div className="mt-3 pt-2">
                  <button
                    onClick={() => handleActionForBadge(badge.id)}
                    className="w-full py-1.5 px-2 rounded-lg bg-[#13262b] hover:bg-[#1a353c] border border-[#23444a] hover:border-[#28d4c7] text-[11px] font-bold text-[#28d4c7] flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Earn This Badge</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
