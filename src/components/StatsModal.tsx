import React from 'react';
import { SessionRecord } from '../types';
import { calculateStats } from '../utils/storage';
import { X, Flame, Clock, Calendar, Trash2, Award } from 'lucide-react';

interface StatsModalProps {
  sessions: SessionRecord[];
  onClearSessions: () => void;
  onDeleteSession: (id: string) => void;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const StatsModal: React.FC<StatsModalProps> = ({
  sessions,
  onClearSessions,
  onDeleteSession,
  onClose,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const { totalMinutes, totalSessions, currentStreak } = calculateStats(sessions);

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div id="stats-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-[32px] border backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col transition-colors ${
          isDark
            ? 'bg-[#0a0a0c]/90 border-white/10 text-white'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b mb-6 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-2.5">
            <Award className={`w-5 h-5 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
            <h3 className={`text-lg font-light tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Practice Log & Stats
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-2xl transition-colors cursor-pointer ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className={`p-3.5 rounded-2xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
            <span className={`text-[10px] uppercase font-light tracking-[0.15em] block mb-1 flex items-center justify-center gap-1 ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>
              <Clock className={`w-3 h-3 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
              Total Time
            </span>
            <span className={`text-lg font-bold font-mono ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>{totalMinutes}m</span>
          </div>

          <div className={`p-3.5 rounded-2xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
            <span className={`text-[10px] uppercase font-light tracking-[0.15em] block mb-1 flex items-center justify-center gap-1 ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>
              <Calendar className={`w-3 h-3 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
              Sessions
            </span>
            <span className={`text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>{totalSessions}</span>
          </div>

          <div className={`p-3.5 rounded-2xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
            <span className={`text-[10px] uppercase font-light tracking-[0.15em] block mb-1 flex items-center justify-center gap-1 ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>
              <Flame className={`w-3 h-3 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              Streak
            </span>
            <span className={`text-lg font-bold font-mono ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{currentStreak}d</span>
          </div>
        </div>

        {/* Log List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-6 custom-scrollbar">
          <div className={`flex items-center justify-between text-xs font-light mb-2 ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
            <span>Recent Sessions ({sessions.length})</span>
            {sessions.length > 0 && (
              <button
                onClick={onClearSessions}
                className="text-[11px] text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>

          {sessions.length === 0 ? (
            <div className={`text-center py-10 text-xs rounded-2xl border font-light ${
              isDark ? 'text-white/40 bg-white/5 border-white/10' : 'text-zinc-400 bg-zinc-50 border-zinc-200'
            }`}>
              No sessions logged yet. Complete your first meditation to track your streak!
            </div>
          ) : (
            sessions.map((record) => (
              <div
                key={record.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className={`flex items-center gap-2 font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    <span className={`font-mono ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>
                      {Math.round(record.durationSeconds / 60)} min
                    </span>
                    {record.presetTitle && (
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-light ${
                        isDark ? 'bg-white/10 text-white/60 border-white/10' : 'bg-zinc-200/70 text-zinc-700 border-zinc-300'
                      }`}>
                        {record.presetTitle}
                      </span>
                    )}
                  </div>
                  {record.notes && (
                    <p className={`text-[11px] mt-1 italic truncate font-light ${isDark ? 'text-white/60' : 'text-zinc-600'}`}>
                      "{record.notes}"
                    </p>
                  )}
                  <p className={`text-[10px] mt-1 font-mono ${isDark ? 'text-white/30' : 'text-zinc-400'}`}>
                    {formatDate(record.timestamp)}
                  </p>
                </div>

                <button
                  onClick={() => onDeleteSession(record.id)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark
                      ? 'text-white/40 hover:text-rose-300 hover:bg-white/10'
                      : 'text-zinc-400 hover:text-rose-600 hover:bg-zinc-200'
                  }`}
                  title="Delete log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className={`w-full py-3 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-[0.98] ${
            isDark
              ? 'bg-white hover:bg-white/90 text-black'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
        >
          Close Log
        </button>
      </div>
    </div>
  );
};
