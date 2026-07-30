import React from 'react';
import { Preset, SoundType, AmbientSoundType, BackgroundType } from '../types';
import { Play, Bell, Volume2, VolumeX, Waves, CloudRain, Sparkles, Moon, Sun, Trees, Stars, Activity } from 'lucide-react';

interface QuickPresetsProps {
  presets: Preset[];
  onSelectPreset: (preset: Preset) => void;
  onPreviewSound: (sound: SoundType) => void;
  onPreviewAmbient?: (ambient: AmbientSoundType) => void;
  theme?: 'dark' | 'light';
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({
  presets,
  onSelectPreset,
  onPreviewSound,
  onPreviewAmbient,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const getBgIcon = (type: BackgroundType) => {
    switch (type) {
      case 'oled-black':
        return <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`} />;
      case 'sunrise-gradient':
        return <Sun className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />;
      case 'misty-forest':
        return <Trees className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />;
      case 'night-sky':
        return <Stars className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />;
      case 'breathing-ring':
        return <Activity className={`w-3.5 h-3.5 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />;
    }
  };

  const getSoundLabel = (sound: SoundType) => {
    switch (sound) {
      case 'singing-bowl':
        return 'Tibetan Bowl';
      case 'brass-gong':
        return 'Brass Gong';
      case 'temple-bell':
        return 'Temple Bell';
      case 'gentle-chime':
        return 'Gentle Chime';
      case 'wooden-block':
        return 'Wooden Block';
    }
  };

  const getAmbientIcon = (ambient: AmbientSoundType) => {
    switch (ambient) {
      case 'none':
        return <VolumeX className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />;
      case 'ocean-waves':
        return <Waves className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`} />;
      case 'quiet-rain':
        return <CloudRain className={`w-3.5 h-3.5 ${isDark ? 'text-sky-300' : 'text-sky-600'}`} />;
    }
  };

  const getAmbientLabel = (ambient: AmbientSoundType) => {
    switch (ambient) {
      case 'none':
        return 'No Sound';
      case 'ocean-waves':
        return 'Ocean Waves';
      case 'quiet-rain':
        return 'Quiet Rain';
    }
  };

  return (
    <section id="quick-presets-section" className="w-full max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-xs font-semibold uppercase tracking-[0.2em] flex items-center gap-2 ${
            isDark ? 'text-white/60' : 'text-zinc-600'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
          Quick Sessions
        </h2>
        <span className={`text-xs uppercase tracking-widest font-light ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>
          One-tap start
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((preset) => (
          <div
            key={preset.id}
            id={`preset-card-${preset.id}`}
            className={`group relative rounded-[32px] border backdrop-blur-xl p-6 transition-all flex flex-col justify-between overflow-hidden shadow-xl ${
              isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                : 'bg-white/90 border-zinc-200/80 hover:bg-white hover:border-zinc-300 hover:shadow-2xl'
            }`}
          >
            {/* Ambient accent glow blur */}
            <div
              className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${preset.accentColor} blur-2xl group-hover:scale-150 transition-transform pointer-events-none opacity-60`}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3
                  className={`font-light text-xl transition-colors ${
                    isDark
                      ? 'text-white group-hover:text-amber-200'
                      : 'text-zinc-900 group-hover:text-amber-700 font-normal'
                  }`}
                >
                  {preset.title}
                </h3>
                <span
                  className={`text-xs font-mono font-normal px-3 py-1 rounded-full border ${
                    isDark
                      ? 'bg-white/10 text-amber-300 border-white/10'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {preset.durationMinutes} min
                </span>
              </div>

              <p
                className={`text-xs mb-5 line-clamp-2 leading-relaxed font-light ${
                  isDark ? 'text-white/50' : 'text-zinc-600'
                }`}
              >
                {preset.description}
              </p>

              {/* Badges */}
              <div
                className={`flex flex-wrap items-center gap-2 text-[11px] mb-5 ${
                  isDark ? 'text-white/60' : 'text-zinc-600'
                }`}
              >
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}
                >
                  {getBgIcon(preset.background)}
                  <span className="capitalize">{preset.background.replace('-', ' ')}</span>
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onPreviewAmbient && preset.ambientSound !== 'none') {
                      onPreviewAmbient(preset.ambientSound);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors ${
                    preset.ambientSound !== 'none' && onPreviewAmbient ? 'cursor-pointer hover:bg-white/10' : ''
                  } ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}
                  title={preset.ambientSound !== 'none' ? 'Click to preview background sound' : 'Background Sound'}
                >
                  {getAmbientIcon(preset.ambientSound)}
                  <span>{getAmbientLabel(preset.ambientSound)}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewSound(preset.sound);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-white/5 border-white/10 hover:text-amber-300 hover:bg-white/10'
                      : 'bg-zinc-100 border-zinc-200 hover:text-amber-700 hover:bg-zinc-200/70 text-zinc-700'
                  }`}
                  title="Click to preview end chime"
                >
                  <Volume2 className={`w-3 h-3 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                  <span>{getSoundLabel(preset.sound)}</span>
                </button>

                {preset.intervalMinutes > 0 && (
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-amber-300'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}
                  >
                    <Bell className="w-3 h-3" />
                    <span>Every {preset.intervalMinutes}m</span>
                  </span>
                )}
              </div>
            </div>

            <button
              id={`start-preset-${preset.id}`}
              onClick={() => onSelectPreset(preset)}
              className={`w-full mt-2 py-3 px-4 rounded-[20px] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] cursor-pointer ${
                isDark
                  ? 'bg-white hover:bg-white/90 text-black'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-md'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Begin Session
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
