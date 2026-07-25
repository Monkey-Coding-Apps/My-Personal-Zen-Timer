import React, { useState, useEffect, useRef } from 'react';
import { SoundType, BackgroundType, TimerPhase } from '../types';
import { playSound, playIntervalChime, playPrepTick } from '../utils/audio';
import { requestWakeLock, releaseWakeLock } from '../utils/wakeLock';
import { Play, Pause, X, Eye, EyeOff, ShieldCheck, Bell } from 'lucide-react';

interface TimerScreenProps {
  durationMinutes: number;
  intervalMinutes: number;
  sound: SoundType;
  background: BackgroundType;
  prepDelaySeconds: number;
  volume: number;
  presetTitle?: string;
  onFinishSession: (elapsedSeconds: number) => void;
  onCancelSession: () => void;
}

export const TimerScreen: React.FC<TimerScreenProps> = ({
  durationMinutes,
  intervalMinutes,
  sound,
  background,
  prepDelaySeconds,
  volume,
  presetTitle,
  onFinishSession,
  onCancelSession,
}) => {
  const totalDurationSeconds = durationMinutes * 60;
  const [phase, setPhase] = useState<TimerPhase>(prepDelaySeconds > 0 ? 'prep' : 'running');
  const [prepRemaining, setPrepRemaining] = useState<number>(prepDelaySeconds);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalDurationSeconds);
  const [stealthMode, setStealthMode] = useState<boolean>(false);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const [lastIntervalTriggered, setLastIntervalTriggered] = useState<number>(0);
  const [showIntervalNotice, setShowIntervalNotice] = useState<boolean>(false);

  // Breathing state for breathing-ring background
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');

  const intervalSeconds = intervalMinutes * 60;

  // Screen Wake Lock request on mount
  useEffect(() => {
    let mounted = true;
    requestWakeLock().then((active) => {
      if (mounted) setWakeLockActive(active);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock().then((active) => {
          if (mounted) setWakeLockActive(active);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, []);

  // Preparation countdown timer
  useEffect(() => {
    if (phase !== 'prep') return;

    if (prepRemaining <= 0) {
      setPhase('running');
      return;
    }

    playPrepTick();

    const timer = setInterval(() => {
      setPrepRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, prepRemaining]);

  // Main session countdown timer
  useEffect(() => {
    if (phase !== 'running') return;

    if (secondsRemaining <= 0) {
      setPhase('finished');
      playSound(sound, volume);
      releaseWakeLock();
      onFinishSession(totalDurationSeconds);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = prev - 1;
        const elapsed = totalDurationSeconds - next;

        // Check for interval chime
        if (
          intervalSeconds > 0 &&
          elapsed > 0 &&
          elapsed % intervalSeconds === 0 &&
          elapsed !== totalDurationSeconds &&
          elapsed !== lastIntervalTriggered
        ) {
          playIntervalChime(volume);
          setLastIntervalTriggered(elapsed);
          setShowIntervalNotice(true);
          setTimeout(() => setShowIntervalNotice(false), 3000);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, secondsRemaining, totalDurationSeconds, intervalSeconds, lastIntervalTriggered, sound, volume, onFinishSession]);

  // Breathing pacing loop for breathing-ring background
  useEffect(() => {
    if (background !== 'breathing-ring' || phase !== 'running') return;

    let cycleCount = 0;
    const breathTimer = setInterval(() => {
      cycleCount = (cycleCount + 1) % 14;
      if (cycleCount < 4) setBreathPhase('Inhale');
      else if (cycleCount < 8) setBreathPhase('Hold');
      else if (cycleCount < 12) setBreathPhase('Exhale');
      else setBreathPhase('Pause');
    }, 1000);

    return () => clearInterval(breathTimer);
  }, [background, phase]);

  const handleTogglePause = () => {
    if (phase === 'running') {
      setPhase('paused');
    } else if (phase === 'paused') {
      setPhase('running');
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.max(0, ((totalDurationSeconds - secondsRemaining) / totalDurationSeconds) * 100));

  // Determine background styling
  const getBackgroundStyle = () => {
    switch (background) {
      case 'oled-black':
        return 'bg-black text-zinc-300';
      case 'sunrise-gradient':
        return 'bg-gradient-to-b from-zinc-950 via-purple-950/40 to-amber-950/30 text-zinc-200';
      case 'misty-forest':
        return 'bg-gradient-to-b from-zinc-950 via-emerald-950/40 to-zinc-950 text-emerald-100';
      case 'night-sky':
        return 'bg-gradient-to-b from-zinc-950 via-indigo-950/50 to-slate-950 text-indigo-100';
      case 'breathing-ring':
        return 'bg-zinc-950 text-sky-100';
      default:
        return 'bg-black text-zinc-300';
    }
  };

  return (
    <div
      id="timer-screen-overlay"
      onClick={() => {
        // Tap screen in stealth mode restores controls
        if (stealthMode) setStealthMode(false);
      }}
      className={`fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 select-none transition-colors duration-700 ${getBackgroundStyle()}`}
    >
      {/* Background visual graphics */}
      {background === 'misty-forest' && (
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.15),transparent_70%)] animate-pulse" />
          <svg className="w-full h-full text-emerald-800/30" preserveAspectRatio="none">
            <path d="M0,1000 L100,800 L200,900 L300,750 L400,850 L500,700 L600,900 L700,780 L800,950 L900,820 L1000,1000 Z" fill="currentColor" />
          </svg>
        </div>
      )}

      {background === 'night-sky' && (
        <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.2),transparent_60%)]" />
          <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-white rounded-full animate-ping" />
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-indigo-200 rounded-full animate-pulse" />
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-purple-200 rounded-full animate-pulse" />
        </div>
      )}

      {background === 'sunrise-gradient' && (
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-amber-600/10 via-orange-500/5 to-transparent pointer-events-none" />
      )}

      {/* Top Bar: Title & Stealth Toggle */}
      <div
        className={`w-full max-w-xl mx-auto flex items-center justify-between transition-opacity duration-500 ${
          stealthMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 tracking-wider uppercase">
          {presetTitle ? <span>{presetTitle}</span> : <span>Meditation</span>}
          <span>•</span>
          <span>{durationMinutes} mins</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Wake Lock Badge */}
          {wakeLockActive && (
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-emerald-500/80 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              Screen Awake
            </span>
          )}

          {/* Stealth Mode Toggle Button */}
          <button
            id="stealth-mode-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setStealthMode(!stealthMode);
            }}
            className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Stealth Mode (Hide clock & controls)"
          >
            {stealthMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center Stage: Timer & Preparation Display */}
      <div className="my-auto flex flex-col items-center justify-center text-center relative z-10">
        {phase === 'prep' ? (
          <div className="space-y-4 animate-fade-in">
            <span className="text-xs font-light tracking-[0.2em] text-amber-300 uppercase">
              Settle in & relax
            </span>
            <div className="text-7xl sm:text-9xl font-mono font-extralight tracking-tighter text-white">
              {prepRemaining}
            </div>
            <p className="text-xs text-white/40 font-light">Preparing quiet session space...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            {/* Breathing Ring visual (if selected background is breathing-ring) */}
            {background === 'breathing-ring' && (
              <div className="relative flex items-center justify-center mb-4">
                <div
                  className={`w-40 h-40 sm:w-56 sm:h-56 rounded-full border border-sky-300/40 backdrop-blur-xl flex items-center justify-center transition-all duration-1000 ${
                    breathPhase === 'Inhale'
                      ? 'scale-125 border-sky-300 shadow-2xl shadow-sky-400/20 bg-sky-300/10'
                      : breathPhase === 'Hold'
                      ? 'scale-125 border-amber-300/80 bg-amber-300/10'
                      : 'scale-90 border-sky-500/20 bg-transparent'
                  }`}
                >
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-sky-200">
                    {breathPhase}
                  </span>
                </div>
              </div>
            )}

            {/* Countdown Display */}
            <div
              className={`transition-all duration-700 ${
                stealthMode ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="text-6xl sm:text-8xl md:text-9xl font-mono font-extralight tracking-tight text-white drop-shadow-md">
                {formatTime(secondsRemaining)}
              </div>

              {/* Progress Bar */}
              <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full mx-auto mt-6 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-amber-300/90 transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Interval chime badge notice */}
              {showIntervalNotice && (
                <div className="mt-4 px-4 py-1.5 rounded-full bg-amber-300/20 border border-amber-300/40 text-amber-200 text-xs font-mono flex items-center justify-center gap-1.5 animate-bounce backdrop-blur-md">
                  <Bell className="w-3.5 h-3.5" />
                  Interval Bell
                </div>
              )}

              {/* Status tagline */}
              <p className="text-xs text-white/40 font-mono mt-4 font-light">
                {phase === 'paused' ? 'PAUSED' : stealthMode ? '' : 'Tap anywhere to restore controls'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div
        className={`w-full max-w-sm mx-auto flex items-center justify-center gap-6 transition-opacity duration-500 ${
          stealthMode || phase === 'prep' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Cancel / End Button */}
        <button
          id="cancel-session-button"
          onClick={onCancelSession}
          className="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95"
          title="End Session"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Pause / Resume Button */}
        <button
          id="pause-resume-session-button"
          onClick={handleTogglePause}
          className="w-16 h-16 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-95 transform hover:scale-105"
          title={phase === 'paused' ? 'Resume Timer' : 'Pause Timer'}
        >
          {phase === 'paused' ? <Play className="w-7 h-7 fill-current ml-1" /> : <Pause className="w-7 h-7 fill-current" />}
        </button>
      </div>
    </div>
  );
};
