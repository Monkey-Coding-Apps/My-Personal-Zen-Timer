let wakeLockSentinel: WakeLockSentinel | null = null;

export async function requestWakeLock(): Promise<boolean> {
  if ('wakeLock' in navigator) {
    try {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      console.log('Screen Wake Lock acquired');
      return true;
    } catch (err) {
      console.warn('Wake Lock request failed:', err);
      return false;
    }
  } else {
    console.warn('Wake Lock API not supported on this browser');
    return false;
  }
}

export async function releaseWakeLock(): Promise<void> {
  if (wakeLockSentinel) {
    try {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;
      console.log('Screen Wake Lock released');
    } catch (err) {
      console.warn('Wake Lock release error:', err);
    }
  }
}

export function isWakeLockSupported(): boolean {
  return 'wakeLock' in navigator;
}
