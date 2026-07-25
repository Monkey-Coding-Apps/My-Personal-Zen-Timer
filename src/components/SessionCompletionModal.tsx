import React, { useState } from 'react';
import { SoundType } from '../types';
import { Check, Flame, Heart } from 'lucide-react';
import { ZTLotusLogo } from './ZTLotusLogo';

interface SessionCompletionModalProps {
  durationSeconds: number;
  soundUsed: SoundType;
  presetTitle?: string;
  currentStreak: number;
  onSave: (notes: string) => void;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const SessionCompletionModal: React.FC<SessionCompletionModalProps> = ({
  durationSeconds,
  soundUsed,
  presetTitle,
  currentStreak,
  onSave,
  onClose,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [notes, setNotes] = useState<string>('');
  const durationMins = Math.round(durationSeconds / 60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(notes);
    onClose();
  };

  return (
    <div id="completion-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-md rounded-[32px] border backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#0a0a0c]/90 border-white/10 text-white'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center relative z-10">
          {/* Badge Icon */}
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-2xl border backdrop-blur-xl flex items-center justify-center shadow-xl p-1.5 ${
              isDark
                ? 'bg-white/10 border-white/15'
                : 'bg-indigo-50 border-indigo-100'
            }`}
          >
            <ZTLotusLogo size={52} theme={theme} />
          </div>

          <h3 className={`text-2xl font-light mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Session Complete</h3>
          <p className={`text-xs mb-6 font-light ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
            Namaste. Take a soft breath before resuming your day.
          </p>

          {/* Stats summary */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
              <span className={`text-[10px] uppercase font-light tracking-[0.2em] block mb-1 ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>
                Duration
              </span>
              <span className={`text-xl font-bold font-mono ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>{durationMins} min</span>
            </div>

            <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
              <span className={`text-[10px] uppercase font-light tracking-[0.2em] block mb-1 flex items-center justify-center gap-1 ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>
                <Flame className={`w-3 h-3 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                Streak
              </span>
              <span className={`text-xl font-bold font-mono ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{currentStreak} days</span>
            </div>
          </div>

          {/* Optional Notes */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className={`text-xs font-light uppercase tracking-[0.2em] block mb-2 flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-zinc-700'}`}>
                <Heart className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                Session Reflection / Note (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How do you feel right now? (e.g., Calm, centered, grounded)..."
                rows={2}
                className={`w-full p-3.5 border rounded-2xl text-xs focus:outline-none resize-none font-light ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400'
                }`}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3 px-4 rounded-2xl border font-light text-xs transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
                    : 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                Skip
              </button>
              <button
                type="submit"
                className={`flex-1 py-3 px-4 rounded-2xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-[0.98] ${
                  isDark
                    ? 'bg-white hover:bg-white/90 text-black'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                }`}
              >
                <Check className="w-4 h-4" />
                Save Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
