import React from 'react';
import { CustomTimerConfig as ConfigType } from '../utils/storage';
import { SoundType, BackgroundType } from '../types';
import { Clock, Bell, Volume2, Palette, Play, Sliders, Moon, Sun, Trees, Stars, Activity, Info } from 'lucide-react';

interface CustomTimerConfigProps {
  config: ConfigType;
  prepDelay: number;
  onChangeConfig: (newConfig: ConfigType) => void;
  onChangePrepDelay: (delaySeconds: number) => void;
  onPreviewSound: (sound: SoundType) => void;
  onStartCustom: () => void;
  theme?: 'dark' | 'light';
}

export const CustomTimerConfig: React.FC<CustomTimerConfigProps> = ({
  config,
  prepDelay,
  onChangeConfig,
  onChangePrepDelay,
  onPreviewSound,
  onStartCustom,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const quickTimePills = [3, 5, 10, 15, 20, 25, 30, 45, 60];

  const handleDurationChange = (mins: number) => {
    onChangeConfig({
      ...config,
      durationMinutes: Math.max(1, Math.min(180, mins)),
    });
  };

  return (
    <section id="custom-setup-section" className="w-full max-w-4xl mx-auto px-4 py-4">
      <div
        className={`rounded-[40px] border backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors ${
          isDark
            ? 'bg-white/[0.03] border-white/10 text-white'
            : 'bg-white/90 border-zinc-200/80 text-zinc-900 shadow-xl'
        }`}
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className={`flex items-center justify-between mb-8 pb-4 border-b ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl border ${
                isDark ? 'bg-white/5 border-white/10 text-amber-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
              }`}
            >
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-xl font-light tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Session Configuration
              </h2>
              <p className={`text-xs uppercase tracking-[0.15em] font-light ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>
                Custom time, chimes & atmosphere
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Duration & Intervals */}
          <div className="space-y-6">
            {/* Main Duration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={`text-xs font-light uppercase tracking-[0.2em] flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-zinc-700'}`}>
                  <Clock className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                  Duration (Minutes)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={config.durationMinutes}
                    onChange={(e) => handleDurationChange(parseInt(e.target.value, 10) || 1)}
                    className={`w-16 px-2 py-1 border rounded-xl text-right font-mono text-sm focus:outline-none ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-amber-200 focus:border-white/30'
                        : 'bg-zinc-100 border-zinc-200 text-amber-800 focus:border-zinc-400 font-semibold'
                    }`}
                  />
                  <span className={`text-xs font-light ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>min</span>
                </div>
              </div>

              {/* Quick Preset Time Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quickTimePills.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleDurationChange(mins)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      config.durationMinutes === mins
                        ? isDark
                          ? 'bg-white text-black font-semibold shadow-lg'
                          : 'bg-zinc-900 text-white font-semibold shadow-md'
                        : isDark
                        ? 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                        : 'bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min="1"
                max="90"
                value={config.durationMinutes}
                onChange={(e) => handleDurationChange(parseInt(e.target.value, 10))}
                className={`w-full h-2 rounded-lg cursor-pointer ${
                  isDark ? 'accent-amber-300 bg-white/10' : 'accent-amber-500 bg-zinc-200'
                }`}
              />
            </div>

            {/* Interval Chimes */}
            <div>
              <label className={`text-xs font-light uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2.5 ${isDark ? 'text-white/60' : 'text-zinc-700'}`}>
                <Bell className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                Interval Chimes
              </label>
              <select
                id="interval-chime-select"
                value={config.intervalMinutes}
                onChange={(e) => onChangeConfig({ ...config, intervalMinutes: parseInt(e.target.value, 10) })}
                className={`w-full px-4 py-3 border rounded-2xl text-xs focus:outline-none cursor-pointer backdrop-blur-xl ${
                  isDark
                    ? 'bg-[#0a0a0c]/80 border-white/10 text-white/90 focus:border-white/30'
                    : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400 shadow-sm'
                }`}
              >
                <option value={0}>Off (No interval chime)</option>
                <option value={1}>Every 1 minute</option>
                <option value={2}>Every 2 minutes</option>
                <option value={3}>Every 3 minutes</option>
                <option value={5}>Every 5 minutes</option>
                <option value={10}>Every 10 minutes</option>
                <option value={15}>Every 15 minutes</option>
                <option value={20}>Every 20 minutes</option>
              </select>
              <p className={`text-[11px] mt-2 flex items-center gap-1 font-light ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>
                <Info className="w-3 h-3 opacity-60" />
                Gentle chime during session to maintain awareness
              </p>
            </div>
          </div>

          {/* Right Column: Sound & Background & Preparation */}
          <div className="space-y-6">
            {/* Ending Sound */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className={`text-xs font-light uppercase tracking-[0.2em] flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-zinc-700'}`}>
                  <Volume2 className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                  Ending Sound
                </label>
                <button
                  type="button"
                  id="preview-sound-button"
                  onClick={() => onPreviewSound(config.sound)}
                  className={`px-3 py-1 rounded-full border text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 text-amber-300'
                      : 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700 font-medium'
                  }`}
                >
                  <Volume2 className="w-3 h-3" />
                  Listen Preview
                </button>
              </div>
              <select
                id="ending-sound-select"
                value={config.sound}
                onChange={(e) => onChangeConfig({ ...config, sound: e.target.value as SoundType })}
                className={`w-full px-4 py-3 border rounded-2xl text-xs focus:outline-none cursor-pointer backdrop-blur-xl ${
                  isDark
                    ? 'bg-[#0a0a0c]/80 border-white/10 text-white/90 focus:border-white/30'
                    : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400 shadow-sm'
                }`}
              >
                <option value="singing-bowl">Tibetan Singing Bowl (Deep Metal Resonance)</option>
                <option value="brass-gong">Soft Brass Gong (Low Harmonic Resonance)</option>
                <option value="temple-bell">Temple Bell (Clear Crystalline Strike)</option>
                <option value="gentle-chime">Gentle Chime (Soft Triple Arpeggio)</option>
                <option value="wooden-block">Wooden Block (Warm Hollow Wood Pop)</option>
              </select>
            </div>

            {/* Background Visual Theme */}
            <div>
              <label className={`text-xs font-light uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2.5 ${isDark ? 'text-white/60' : 'text-zinc-700'}`}>
                <Palette className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                Visual Atmosphere
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'oled-black',
                    label: 'OLED Pure Black',
                    icon: <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-white/50' : 'text-zinc-600'}`} />,
                    desc: '#000000 Battery Saver',
                  },
                  {
                    id: 'sunrise-gradient',
                    label: 'Sunrise Glow',
                    icon: <Sun className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />,
                    desc: 'Warm Horizon Atmosphere',
                  },
                  {
                    id: 'misty-forest',
                    label: 'Misty Forest',
                    icon: <Trees className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`} />,
                    desc: 'Dark Woodland Canopy',
                  },
                  {
                    id: 'night-sky',
                    label: 'Starry Night',
                    icon: <Stars className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`} />,
                    desc: 'Indigo Sky with Stars',
                  },
                  {
                    id: 'breathing-ring',
                    label: 'Breathing Pulse',
                    icon: <Activity className={`w-3.5 h-3.5 ${isDark ? 'text-sky-300' : 'text-sky-600'}`} />,
                    desc: 'Rhythmic Pacing Circle',
                  },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, background: bg.id as BackgroundType })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      config.background === bg.id
                        ? isDark
                          ? 'bg-white/10 border-white/30 backdrop-blur-xl shadow-lg'
                          : 'bg-amber-500/10 border-amber-500/40 shadow-md'
                        : isDark
                        ? 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                        : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <div className={`flex items-center gap-1.5 mb-1 font-medium text-xs ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                      {bg.icon}
                      <span>{bg.label}</span>
                    </div>
                    <p className={`text-[10px] truncate font-light ${isDark ? 'text-white/40' : 'text-zinc-500'}`}>{bg.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preparation Delay */}
            <div>
              <label className={`text-xs font-light uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2.5 ${isDark ? 'text-white/60' : 'text-zinc-700'}`}>
                <Clock className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                Preparation Delay
              </label>
              <div className="flex items-center gap-2">
                {[0, 5, 10, 15].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => onChangePrepDelay(sec)}
                    className={`flex-1 py-2.5 px-2 rounded-2xl text-xs font-mono transition-all cursor-pointer ${
                      prepDelay === sec
                        ? isDark
                          ? 'bg-white text-black font-semibold shadow-md'
                          : 'bg-zinc-900 text-white font-semibold shadow-md'
                        : isDark
                        ? 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                        : 'bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200'
                    }`}
                  >
                    {sec === 0 ? 'Instant' : `${sec}s delay`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className={`mt-8 pt-6 border-t flex justify-end ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
          <button
            id="start-custom-timer-button"
            onClick={onStartCustom}
            className={`w-full sm:w-auto h-14 px-10 rounded-[24px] font-semibold text-base tracking-tight active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xl ${
              isDark
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            Begin Session ({config.durationMinutes} min)
          </button>
        </div>
      </div>
    </section>
  );
};
