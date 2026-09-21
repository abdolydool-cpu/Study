import React from 'react';
import { BookOpen, Swords, Volume2, Timer, AlertCircle, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  weakCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, weakCount }) => {
  return (
    <header className="border-b border-[#23444a]/70 bg-[#0d1b1f]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand */}
        <button 
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#28d4c7] via-[#20b2a6] to-[#f2b84b] flex items-center justify-center text-[#031011] font-black text-xl shadow-lg shadow-[#28d4c7]/20 group-hover:scale-105 transition-transform">
            GL
          </div>
          <div className="text-left">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Revision Lab
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#28d4c7]/15 text-[#28d4c7] border border-[#28d4c7]/30">
                Year 7
              </span>
            </h1>
            <p className="text-xs text-[#9db4b8] hidden sm:block">English, Maths &amp; British Spelling</p>
          </div>
        </button>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentTab === 'dashboard'
                ? 'bg-[#13262b] text-[#28d4c7] border border-[#28d4c7]/40 shadow-sm'
                : 'text-[#9db4b8] hover:text-white hover:bg-[#13262b]/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden md:inline">Dashboard</span>
          </button>

          <button
            onClick={() => onSelectTab('comprehension')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentTab === 'comprehension'
                ? 'bg-[#13262b] text-[#28d4c7] border border-[#28d4c7]/40 shadow-sm'
                : 'text-[#9db4b8] hover:text-white hover:bg-[#13262b]/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Comprehension</span>
          </button>

          <button
            onClick={() => onSelectTab('spelling')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentTab === 'spelling'
                ? 'bg-[#13262b] text-[#28d4c7] border border-[#28d4c7]/40 shadow-sm'
                : 'text-[#9db4b8] hover:text-white hover:bg-[#13262b]/60'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden md:inline">Spelling Lab</span>
          </button>

          <button
            onClick={() => onSelectTab('tournament')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'tournament'
                ? 'bg-[#13262b] text-[#28d4c7] border border-[#28d4c7]/40 shadow-sm'
                : 'text-[#9db4b8] hover:text-white hover:bg-[#13262b]/60'
            }`}
          >
            <Swords className="w-4 h-4 text-[#28d4c7]" />
            <span className="hidden md:inline">Multiplayer</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8bd450] animate-pulse hidden sm:inline-block" />
          </button>

          {weakCount > 0 && (
            <button
              onClick={() => onSelectTab('weak')}
              className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 bg-[#ff6b5f]/15 text-[#ff6b5f] border border-[#ff6b5f]/30 hover:bg-[#ff6b5f]/25 transition-all"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Weak ({weakCount})</span>
            </button>
          )}

          <button
            onClick={() => onSelectTab('exam')}
            className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold flex items-center gap-1.5 bg-gradient-to-r from-[#28d4c7] to-[#158d99] text-[#031011] shadow-md shadow-[#28d4c7]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Timer className="w-4 h-4" />
            <span>Exam Simulator</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
