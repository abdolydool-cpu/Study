import React, { useEffect } from 'react';
import { Achievement } from '../types';
import confetti from 'canvas-confetti';
import { Award, Sparkles, Check, X } from 'lucide-react';

interface AchievementUnlockedModalProps {
  badges: Achievement[];
  onClose: () => void;
  onViewDashboard?: () => void;
}

export const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({
  badges,
  onClose,
  onViewDashboard
}) => {
  useEffect(() => {
    if (badges.length > 0) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [badges]);

  if (badges.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03090b]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#102126] to-[#081316] border border-[#28d4c7]/50 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden text-center">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#28d4c7]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#f2b84b]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9db4b8] hover:text-white p-1 rounded-lg hover:bg-[#13262b] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2b84b]/20 border border-[#f2b84b]/40 text-xs font-black text-[#f2b84b] uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Achievement Unlocked!
        </div>

        {/* Badges List */}
        <div className="space-y-4 my-2">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className="bg-[#0b181b] border border-[#23444a] rounded-xl p-4 flex items-center gap-4 text-left shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1a353c] to-[#0d1b1f] border border-[#28d4c7]/40 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white truncate">
                    {badge.title}
                  </h4>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-[#28d4c7]/15 text-[#28d4c7] border border-[#28d4c7]/30">
                    {badge.tier}
                  </span>
                </div>
                <p className="text-xs text-[#9db4b8] mt-1 line-clamp-2">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#28d4c7] hover:bg-[#20b2a6] text-[#031011] font-bold text-sm active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#28d4c7]/20 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Collect &amp; Continue
          </button>
          {onViewDashboard && (
            <button
              onClick={() => {
                onClose();
                onViewDashboard();
              }}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#13262b] hover:bg-[#1a353c] text-[#9db4b8] hover:text-white border border-[#23444a] font-semibold text-xs active:scale-95 transition-all cursor-pointer"
            >
              View Badges
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
