import { SessionRecord, SoundType, AmbientSoundType, BackgroundType } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'zentimer_sessions',
  CUSTOM_CONFIG: 'zentimer_custom_config',
  PREP_DELAY: 'zentimer_prep_delay',
  VOLUME: 'zentimer_volume',
};

export interface CustomTimerConfig {
  durationMinutes: number;
  intervalMinutes: number;
  sound: SoundType;
  ambientSound: AmbientSoundType;
  background: BackgroundType;
}

export function getSavedSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to parse saved sessions:', err);
    return [];
  }
}

export function saveSession(record: Omit<SessionRecord, 'id' | 'timestamp'>): SessionRecord {
  const sessions = getSavedSessions();
  const newRecord: SessionRecord = {
    ...record,
    id: 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now(),
  };

  const updated = [newRecord, ...sessions];
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save session:', err);
  }
  return newRecord;
}

export function getSavedCustomConfig(): CustomTimerConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        durationMinutes: 10,
        intervalMinutes: 0,
        sound: 'singing-bowl',
        ambientSound: 'none',
        background: 'oled-black',
        ...parsed,
      };
    }
  } catch (err) {
    console.warn('Failed to parse custom config:', err);
  }
  return {
    durationMinutes: 10,
    intervalMinutes: 0,
    sound: 'singing-bowl',
    ambientSound: 'none',
    background: 'oled-black',
  };
}

export function saveCustomConfig(config: CustomTimerConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.warn('Failed to save custom config:', err);
  }
}

export function getSavedPrepDelay(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.PREP_DELAY);
    return val !== null ? parseInt(val, 10) : 5; // Default 5 seconds
  } catch {
    return 5;
  }
}

export function savePrepDelay(seconds: number): void {
  localStorage.setItem(STORAGE_KEYS.PREP_DELAY, seconds.toString());
}

export function getSavedVolume(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.VOLUME);
    return val !== null ? parseFloat(val) : 0.8;
  } catch {
    return 0.8;
  }
}

export function saveVolume(vol: number): void {
  localStorage.setItem(STORAGE_KEYS.VOLUME, vol.toString());
}

export function calculateStats(sessions: SessionRecord[]) {
  const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  // Calculate day streak
  if (sessions.length === 0) {
    return { totalMinutes, totalSessions: 0, currentStreak: 0 };
  }

  const daysSet = new Set<string>();
  sessions.forEach((s) => {
    const d = new Date(s.timestamp);
    daysSet.add(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
  });

  // Check today or yesterday
  const today = new Date();
  let streak = 0;
  const checkDate = new Date(today);

  // If meditated today or yesterday, streak continues
  const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

  if (daysSet.has(todayKey) || daysSet.has(yesterdayKey)) {
    if (!daysSet.has(todayKey)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (true) {
      const key = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
      if (daysSet.has(key)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return {
    totalMinutes,
    totalSessions: sessions.length,
    currentStreak: streak,
  };
}
