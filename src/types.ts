export type SoundType = 'singing-bowl' | 'brass-gong' | 'temple-bell' | 'gentle-chime' | 'wooden-block';

export type AmbientSoundType = 'none' | 'ocean-waves' | 'quiet-rain';

export type BackgroundType = 'oled-black' | 'sunrise-gradient' | 'misty-forest' | 'night-sky' | 'breathing-ring';

export interface Preset {
  id: string;
  title: string;
  durationMinutes: number;
  intervalMinutes: number; // 0 for off
  sound: SoundType;
  ambientSound: AmbientSoundType;
  background: BackgroundType;
  description: string;
  accentColor: string;
}

export interface SessionRecord {
  id: string;
  timestamp: number; // Date.now()
  durationSeconds: number;
  presetTitle?: string;
  soundUsed: SoundType;
  notes?: string;
}

export type TimerPhase = 'idle' | 'prep' | 'running' | 'paused' | 'finished';
