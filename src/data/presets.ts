import { Preset } from '../types';

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: '5m-quick-reset',
    title: '5m Quick Reset',
    durationMinutes: 5,
    intervalMinutes: 0,
    sound: 'gentle-chime',
    background: 'oled-black',
    description: 'Pure OLED black battery-saver mode for quick grounding.',
    accentColor: 'from-amber-500/20 to-orange-500/10'
  },
  {
    id: '10m-morning-calm',
    title: '10m Morning Calm',
    durationMinutes: 10,
    intervalMinutes: 0,
    sound: 'brass-gong',
    background: 'sunrise-gradient',
    description: 'Warm, soft sunrise horizon glow for starting your day.',
    accentColor: 'from-orange-500/20 to-amber-600/10'
  },
  {
    id: '15m-forest-focus',
    title: '15m Forest Focus',
    durationMinutes: 15,
    intervalMinutes: 5,
    sound: 'temple-bell',
    background: 'misty-forest',
    description: 'Misty dark woodland canopy with 5-minute interval bells.',
    accentColor: 'from-emerald-500/20 to-teal-600/10'
  },
  {
    id: '20m-deep-unwind',
    title: '20m Deep Unwind',
    durationMinutes: 20,
    intervalMinutes: 5,
    sound: 'singing-bowl',
    background: 'night-sky',
    description: 'Starry indigo night sky with resonant Tibetan singing bowl.',
    accentColor: 'from-indigo-500/20 to-purple-600/10'
  },
  {
    id: '30m-breathing-flow',
    title: '30m Mindful Flow',
    durationMinutes: 30,
    intervalMinutes: 10,
    sound: 'singing-bowl',
    background: 'breathing-ring',
    description: 'Rhythmic breath-pacing ring for deep sustained focus.',
    accentColor: 'from-sky-500/20 to-blue-600/10'
  }
];
