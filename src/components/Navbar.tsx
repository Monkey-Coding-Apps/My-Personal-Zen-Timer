import React from 'react';
import { History, Volume2, VolumeX, ShieldCheck, Sun, Moon, ExternalLink } from 'lucide-react';
import { ZTLotusLogo } from './ZTLotusLogo';

interface NavbarProps {
  onOpenStats: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  streak: number;
  wakeLockActive: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenStats,
  volume,
  onVolumeChange,
  streak,
  wakeLockActive,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      id="app-header"
      className={`w-full max-w-4xl mx-auto px-4 py-5 flex flex-col items-center border-b gap-3 text-center transition-colors ${
        isDark ? 'border-white/10 text-white' : 'border-zinc-200 text-zinc-900'
      }`}
    >
      {/* Line 1: Logo & App Title */}
      <div className="flex items-center justify-center gap-3">
        <div
          id="app-logo-badge"
          className={`w-11 h-11 rounded-2xl border backdrop-blur-xl flex items-center justify-center shadow-lg shrink-0 transition-all p-1 ${
            isDark ? 'bg-white/10 border-white/15' : 'bg-indigo-50 border-indigo-100 shadow-indigo-100/50'
          }`}
        >
          <ZTLotusLogo size={36} theme={theme} />
        </div>
        <h1 className="text-xl sm:text-2xl font-light tracking-tight flex items-center gap-1.5">
          <span>My Personal</span>
          <span className={`font-semibold ${isDark ? 'text-amber-200' : 'text-amber-600'}`}>
            Zen Timer
          </span>
        </h1>
      </div>

      {/* Line 2: OLED Minimal & Mindfulness Utility */}
      <div className="flex items-center justify-center gap-2 text-xs flex-wrap">
        <span
          className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border uppercase tracking-[0.15em] transition-colors ${
            isDark
              ? 'bg-white/5 text-white/60 border-white/10'
              : 'bg-zinc-100 text-zinc-600 border-zinc-200'
          }`}
        >
          OLED Minimal
        </span>
        <span className={isDark ? 'text-white/30' : 'text-zinc-300'}>•</span>
        <span
          className={`text-[10px] uppercase tracking-[0.2em] font-light transition-colors ${
            isDark ? 'text-white/50' : 'text-zinc-500'
          }`}
        >
          Mindfulness Utility
        </span>
      </div>

      {/* Line 3: Controls (Streak, Volume, Keep Awake, History, Light/Dark Theme) */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-1">
        {/* Streak Badge */}
        <button
          id="streak-button"
          onClick={onOpenStats}
          title="View Session Stats & History"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border backdrop-blur-xl text-xs transition-all cursor-pointer ${
            isDark
              ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
              : 'bg-zinc-100/80 border-zinc-200 hover:bg-zinc-200/80 text-zinc-800'
          }`}
        >
          <span>🔥</span>
          <span className={`font-medium ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>{streak}</span>
          <span className={`font-light text-[11px] ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>streak</span>
        </button>

        {/* Volume Control */}
        <div className="relative group">
          <button
            id="volume-toggle-button"
            className={`px-3 py-1.5 rounded-2xl border backdrop-blur-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-white'
                : 'bg-zinc-100/80 border-zinc-200 hover:bg-zinc-200/80 text-zinc-700 hover:text-zinc-900'
            }`}
            title="Adjust Master Sound Volume"
          >
            {volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
            )}
            <span className="font-mono text-[11px]">{Math.round(volume * 100)}%</span>
          </button>
          <div
            className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-40 p-3.5 rounded-2xl border shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 ${
              isDark ? 'bg-[#0a0a0c]/95 border-white/15 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <label className={`text-[10px] font-medium uppercase tracking-[0.2em] block mb-2 text-center ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>
              Volume
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className={`w-full h-1.5 rounded-lg cursor-pointer ${
                isDark ? 'accent-amber-400 bg-white/10' : 'accent-amber-500 bg-zinc-200'
              }`}
            />
          </div>
        </div>

        {/* Keep Awake indicator */}
        <div
          title={wakeLockActive ? 'Screen Wake Lock Supported & Active' : 'Wake Lock Ready'}
          className={`px-3 py-1.5 rounded-2xl text-xs flex items-center gap-1.5 border backdrop-blur-xl transition-all ${
            wakeLockActive
              ? isDark
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : isDark
              ? 'bg-white/5 border-white/10 text-white/40'
              : 'bg-zinc-100 border-zinc-200 text-zinc-500'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[11px]">{wakeLockActive ? 'Awake On' : 'Keep Awake'}</span>
        </div>

        {/* Theme Switcher Toggle (Dark vs Light) */}
        <button
          id="theme-toggle-button"
          onClick={onToggleTheme}
          className={`px-3 py-1.5 rounded-2xl border backdrop-blur-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
            isDark
              ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
              : 'bg-zinc-100/80 border-zinc-200 hover:bg-zinc-200/80 text-zinc-800'
          }`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
        >
          {isDark ? (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-[11px] font-medium">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-medium">Light</span>
            </>
          )}
        </button>

        {/* Stats & History button */}
        <button
          id="stats-modal-trigger"
          onClick={onOpenStats}
          className={`px-3 py-1.5 rounded-2xl border backdrop-blur-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
            isDark
              ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
              : 'bg-zinc-100/80 border-zinc-200 hover:bg-zinc-200/80 text-zinc-800'
          }`}
          title="Session History"
        >
          <History className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
          <span className="text-[11px]">History</span>
        </button>

        {/* External About Link */}
        <a
          id="about-external-link"
          href="https://monkeycodingapps.com/zt/"
          target="_blank"
          rel="noopener noreferrer"
          className={`px-3 py-1.5 rounded-2xl border backdrop-blur-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
            isDark
              ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white'
              : 'bg-zinc-100/80 border-zinc-200 hover:bg-zinc-200/80 text-zinc-800 hover:text-zinc-900'
          }`}
          title="About My Personal Zen Timer"
        >
          <ExternalLink className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
          <span className="text-[11px]">About</span>
        </a>
      </div>
    </header>
  );
};

