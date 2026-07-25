import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QuickPresets } from './components/QuickPresets';
import { CustomTimerConfig as ConfigComponent } from './components/CustomTimerConfig';
import { TimerScreen } from './components/TimerScreen';
import { SessionCompletionModal } from './components/SessionCompletionModal';
import { StatsModal } from './components/StatsModal';
import { DEFAULT_PRESETS } from './data/presets';
import { Preset, SoundType, SessionRecord } from './types';
import {
  getSavedSessions,
  saveSession,
  getSavedCustomConfig,
  saveCustomConfig,
  getSavedPrepDelay,
  savePrepDelay,
  getSavedVolume,
  saveVolume,
  calculateStats,
  CustomTimerConfig as ConfigType,
} from './utils/storage';
import { playSound } from './utils/audio';
import { isWakeLockSupported } from './utils/wakeLock';
import { BellOff, Sparkles, HeartHandshake, Sliders } from 'lucide-react';

export default function App() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [customConfig, setCustomConfig] = useState<ConfigType>(getSavedCustomConfig());
  const [prepDelay, setPrepDelay] = useState<number>(getSavedPrepDelay());
  const [volume, setVolume] = useState<number>(getSavedVolume());
  const [mainMode, setMainMode] = useState<'presets' | 'custom'>('presets');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('zentimer_theme') as 'dark' | 'light') || 'dark';
  });

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('zentimer_theme', nextTheme);
  };

  // Active Timer state
  const [activeTimer, setActiveTimer] = useState<{
    durationMinutes: number;
    intervalMinutes: number;
    sound: SoundType;
    background: ConfigType['background'];
    presetTitle?: string;
  } | null>(null);

  // Completion modal state
  const [completedSession, setCompletedSession] = useState<{
    durationSeconds: number;
    soundUsed: SoundType;
    presetTitle?: string;
  } | null>(null);

  // Stats modal state
  const [showStats, setShowStats] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    setSessions(getSavedSessions());
  }, []);

  const { currentStreak } = calculateStats(sessions);

  const handleUpdateCustomConfig = (newConfig: ConfigType) => {
    setCustomConfig(newConfig);
    saveCustomConfig(newConfig);
  };

  const handleUpdatePrepDelay = (seconds: number) => {
    setPrepDelay(seconds);
    savePrepDelay(seconds);
  };

  const handleUpdateVolume = (vol: number) => {
    setVolume(vol);
    saveVolume(vol);
  };

  const handlePreviewSound = (sound: SoundType) => {
    playSound(sound, volume);
  };

  const handleSelectPreset = (preset: Preset) => {
    setActiveTimer({
      durationMinutes: preset.durationMinutes,
      intervalMinutes: preset.intervalMinutes,
      sound: preset.sound,
      background: preset.background,
      presetTitle: preset.title,
    });
  };

  const handleStartCustom = () => {
    setActiveTimer({
      durationMinutes: customConfig.durationMinutes,
      intervalMinutes: customConfig.intervalMinutes,
      sound: customConfig.sound,
      background: customConfig.background,
      presetTitle: 'Custom Meditation',
    });
  };

  const handleTimerFinish = (elapsedSeconds: number) => {
    if (activeTimer) {
      setCompletedSession({
        durationSeconds: elapsedSeconds,
        soundUsed: activeTimer.sound,
        presetTitle: activeTimer.presetTitle,
      });
      setActiveTimer(null);
    }
  };

  const handleSaveCompletedSession = (notes: string) => {
    if (completedSession) {
      const newRecord = saveSession({
        durationSeconds: completedSession.durationSeconds,
        soundUsed: completedSession.soundUsed,
        presetTitle: completedSession.presetTitle,
        notes: notes.trim() ? notes : undefined,
      });
      setSessions((prev) => [newRecord, ...prev]);
      setCompletedSession(null);
    }
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    localStorage.setItem('zentimer_sessions', JSON.stringify(updated));
  };

  const handleClearSessions = () => {
    if (window.confirm('Are you sure you want to clear all meditation history?')) {
      setSessions([]);
      localStorage.removeItem('zentimer_sessions');
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased relative overflow-x-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#050505] text-white selection:bg-white/20 selection:text-white'
          : 'bg-[#f4f5f8] text-zinc-900 selection:bg-amber-500/20 selection:text-zinc-900'
      }`}
    >
      {/* Atmospheric Background Blurs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] transition-colors ${
            isDark ? 'bg-indigo-900/25' : 'bg-amber-200/40'
          }`}
        />
        <div
          className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[160px] transition-colors ${
            isDark ? 'bg-emerald-900/20' : 'bg-indigo-100/50'
          }`}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar Header */}
        <Navbar
          onOpenStats={() => setShowStats(true)}
          volume={volume}
          onVolumeChange={handleUpdateVolume}
          streak={currentStreak}
          wakeLockActive={isWakeLockSupported()}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Main Content Area */}
        <main className="flex-1 pb-16 space-y-6">
          {/* Do Not Disturb & Silent Mode Reminder Banner */}
          <div className="w-full max-w-4xl mx-auto px-4 pt-4">
            <div
              className={`p-3.5 rounded-2xl border backdrop-blur-md text-xs flex items-center justify-between gap-3 shadow-sm transition-colors ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white/80'
                  : 'bg-white/80 border-zinc-200 text-zinc-800 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2">
                <BellOff className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-300/90' : 'text-amber-600'}`} />
                <span>
                  <strong className={`font-medium ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>
                    Pro Tip:
                  </strong>{' '}
                  Enable <i>Do Not Disturb</i> or <i>Silent Mode</i> on your device before starting for zero interruptions.
                </span>
              </div>
              <span
                className={`hidden sm:inline text-[10px] uppercase tracking-[0.15em] font-mono px-2.5 py-1 rounded-full border transition-colors ${
                  isDark ? 'bg-white/5 text-white/60 border-white/10' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                }`}
              >
                Zero Distractions
              </span>
            </div>
          </div>

          {/* Main Mode Selector: Presets vs Custom Session */}
          <div className="w-full max-w-4xl mx-auto px-4 pt-2">
            <div
              className={`grid grid-cols-2 gap-2 p-1.5 rounded-[28px] border backdrop-blur-xl shadow-xl transition-colors ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-zinc-200/80 shadow-md'
              }`}
            >
              <button
                id="mode-presets-button"
                onClick={() => setMainMode('presets')}
                className={`py-3.5 px-4 rounded-[20px] flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer ${
                  mainMode === 'presets'
                    ? isDark
                      ? 'bg-white text-black shadow-xl font-semibold'
                      : 'bg-zinc-900 text-white shadow-lg font-semibold'
                    : isDark
                    ? 'text-white/60 hover:text-white hover:bg-white/5'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${mainMode === 'presets' ? 'text-amber-500' : isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                <span>Preset Choices</span>
              </button>

              <button
                id="mode-custom-button"
                onClick={() => setMainMode('custom')}
                className={`py-3.5 px-4 rounded-[20px] flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer ${
                  mainMode === 'custom'
                    ? isDark
                      ? 'bg-white text-black shadow-xl font-semibold'
                      : 'bg-zinc-900 text-white shadow-lg font-semibold'
                    : isDark
                    ? 'text-white/60 hover:text-white hover:bg-white/5'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Sliders className={`w-4 h-4 ${mainMode === 'custom' ? 'text-amber-500' : isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                <span>Custom Session</span>
              </button>
            </div>
          </div>

          {/* Render Active Choice Screen */}
          {mainMode === 'presets' ? (
            <QuickPresets
              presets={DEFAULT_PRESETS}
              onSelectPreset={handleSelectPreset}
              onPreviewSound={handlePreviewSound}
              theme={theme}
            />
          ) : (
            <ConfigComponent
              config={customConfig}
              prepDelay={prepDelay}
              onChangeConfig={handleUpdateCustomConfig}
              onChangePrepDelay={handleUpdatePrepDelay}
              onPreviewSound={handlePreviewSound}
              onStartCustom={handleStartCustom}
              theme={theme}
            />
          )}

          {/* Philosophy Footer Banner */}
          <footer
            className={`w-full max-w-4xl mx-auto px-4 text-center text-xs pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors ${
              isDark ? 'text-white/40 border-white/10' : 'text-zinc-500 border-zinc-200'
            }`}
          >
            <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/50' : 'text-zinc-600'}`}>
              <HeartHandshake className={`w-4 h-4 ${isDark ? 'text-amber-300/80' : 'text-amber-600'}`} />
              <span>Crafted for OLED battery efficiency & mindful calm</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>
              <span>Offline Web Audio Synthesizer</span>
              <span>•</span>
              <span>Screen Wake Lock Enabled</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Fullscreen Active Meditation Timer Overlay */}
      {activeTimer && (
        <TimerScreen
          durationMinutes={activeTimer.durationMinutes}
          intervalMinutes={activeTimer.intervalMinutes}
          sound={activeTimer.sound}
          background={activeTimer.background}
          prepDelaySeconds={prepDelay}
          volume={volume}
          presetTitle={activeTimer.presetTitle}
          onFinishSession={handleTimerFinish}
          onCancelSession={() => setActiveTimer(null)}
        />
      )}

      {/* Session Completion Modal */}
      {completedSession && (
        <SessionCompletionModal
          durationSeconds={completedSession.durationSeconds}
          soundUsed={completedSession.soundUsed}
          presetTitle={completedSession.presetTitle}
          currentStreak={currentStreak}
          onSave={handleSaveCompletedSession}
          onClose={() => setCompletedSession(null)}
          theme={theme}
        />
      )}

      {/* Stats & History Modal */}
      {showStats && (
        <StatsModal
          sessions={sessions}
          onClearSessions={handleClearSessions}
          onDeleteSession={handleDeleteSession}
          onClose={() => setShowStats(false)}
          theme={theme}
        />
      )}
    </div>
  );
}
