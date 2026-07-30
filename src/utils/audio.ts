import { SoundType, AmbientSoundType } from '../types';

let audioCtx: AudioContext | null = null;
let currentAmbientStopFn: (() => void) | null = null;
let cachedNoiseBuffer: AudioBuffer | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: SoundType, volume: number = 0.8) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), now);
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'singing-bowl':
        playSingingBowl(ctx, masterGain, now);
        break;
      case 'brass-gong':
        playBrassGong(ctx, masterGain, now);
        break;
      case 'temple-bell':
        playTempleBell(ctx, masterGain, now);
        break;
      case 'gentle-chime':
        playGentleChime(ctx, masterGain, now);
        break;
      case 'wooden-block':
        playWoodenBlock(ctx, masterGain, now);
        break;
      default:
        playSingingBowl(ctx, masterGain, now);
    }
  } catch (err) {
    console.warn('Web Audio playback error:', err);
  }
}

export function playIntervalChime(volume: number = 0.6) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.4 * volume, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now); // E6 overtone

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(filter);
    filter.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 3.2);
    osc2.stop(now + 3.2);
  } catch (err) {
    console.warn('Interval chime error:', err);
  }
}

export function playPrepTick() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (err) {
    console.warn('Prep tick error:', err);
  }
}

function playSingingBowl(ctx: AudioContext, destination: GainNode, now: number) {
  // Base frequency: 216 Hz (authentic Tibetan resonance)
  const baseFreq = 216;
  const harmonics = [
    { mult: 1.0, vol: 0.6, decay: 7.0 },
    { mult: 2.76, vol: 0.25, decay: 5.5 },
    { mult: 4.02, vol: 0.15, decay: 4.0 },
  ];

  // Acoustic modulation (LFO) for authentic bowl wobble
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(3.2, now); // 3.2 Hz pulsation
  lfoGain.gain.setValueAtTime(2.5, now);
  lfo.start(now);
  lfo.stop(now + 7.5);

  harmonics.forEach(({ mult, vol, decay }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * mult, now);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.25); // Gentle soft attack
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + decay + 0.2);
  });
}

function playBrassGong(ctx: AudioContext, destination: GainNode, now: number) {
  // Deep gong detuned pair
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(110, now); // A2
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(113.8, now); // Slight beating effect

  gain1.gain.setValueAtTime(0.001, now);
  gain1.gain.linearRampToValueAtTime(0.5, now + 0.1);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 6.5);

  gain2.gain.setValueAtTime(0.001, now);
  gain2.gain.linearRampToValueAtTime(0.4, now + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 6.5);

  // High metallic strike burst
  const strikeOsc = ctx.createOscillator();
  const strikeGain = ctx.createGain();
  strikeOsc.type = 'triangle';
  strikeOsc.frequency.setValueAtTime(440, now);
  strikeGain.gain.setValueAtTime(0.3, now);
  strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

  osc1.connect(gain1);
  osc2.connect(gain2);
  strikeOsc.connect(strikeGain);

  gain1.connect(destination);
  gain2.connect(destination);
  strikeGain.connect(destination);

  osc1.start(now);
  osc2.start(now);
  strikeOsc.start(now);

  osc1.stop(now + 6.8);
  osc2.stop(now + 6.8);
  strikeOsc.stop(now + 1.3);
}

function playTempleBell(ctx: AudioContext, destination: GainNode, now: number) {
  const osc = ctx.createOscillator();
  const oscOvertone = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now); // A5
  oscOvertone.type = 'sine';
  oscOvertone.frequency.setValueAtTime(1760, now); // Octave higher

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.7, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

  osc.connect(gain);
  oscOvertone.connect(gain);
  gain.connect(destination);

  osc.start(now);
  oscOvertone.start(now);
  osc.stop(now + 4.8);
  oscOvertone.stop(now + 4.8);
}

function playGentleChime(ctx: AudioContext, destination: GainNode, now: number) {
  // C major arpeggio triad: C5, E5, G5
  const notes = [523.25, 659.25, 783.99];

  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.14;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);

    noteGain.gain.setValueAtTime(0.001, noteTime);
    noteGain.gain.linearRampToValueAtTime(0.5, noteTime + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.5);

    osc.connect(noteGain);
    noteGain.connect(destination);

    osc.start(noteTime);
    osc.stop(noteTime + 3.8);
  });
}

function playWoodenBlock(ctx: AudioContext, destination: GainNode, now: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.8, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

  osc.connect(gain);
  gain.connect(destination);

  osc.start(now);
  osc.stop(now + 0.3);
}

function getPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedNoiseBuffer && cachedNoiseBuffer.sampleRate === ctx.sampleRate) {
    return cachedNoiseBuffer;
  }
  const duration = 6;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  cachedNoiseBuffer = buffer;
  return buffer;
}

export function stopAmbientSound() {
  if (currentAmbientStopFn) {
    try {
      currentAmbientStopFn();
    } catch {
      // Ignore cleanup error
    }
    currentAmbientStopFn = null;
  }
}

export function startAmbientSound(type: AmbientSoundType, volume: number = 0.8): () => void {
  stopAmbientSound();

  if (type === 'none') {
    return () => {};
  }

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const noiseBuffer = getPinkNoiseBuffer(ctx);

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const masterGain = ctx.createGain();
    const targetVol = Math.max(0.01, Math.min(1, volume));

    // Smooth fade in
    masterGain.gain.setValueAtTime(0.001, now);

    if (type === 'ocean-waves') {
      // Filter & LFO modulation for rolling ocean waves
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, now); // ~8 sec ocean wave swell
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(280, now); // Frequency wobble

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const lfoVol = ctx.createOscillator();
      lfoVol.frequency.setValueAtTime(0.12, now);
      const lfoVolGain = ctx.createGain();
      lfoVolGain.gain.setValueAtTime(0.18 * targetVol, now);

      masterGain.gain.linearRampToValueAtTime(0.22 * targetVol, now + 1.5);

      source.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      lfo.start(now);
      lfoVol.start(now);
      source.start(now);

      const stopFn = () => {
        try {
          const stopTime = ctx.currentTime;
          masterGain.gain.setValueAtTime(masterGain.gain.value, stopTime);
          masterGain.gain.linearRampToValueAtTime(0.0001, stopTime + 0.4);
          setTimeout(() => {
            try {
              source.stop();
              lfo.stop();
              lfoVol.stop();
              source.disconnect();
              filter.disconnect();
              masterGain.disconnect();
            } catch {
              // Ignore
            }
          }, 450);
        } catch {
          // Ignore
        }
      };

      currentAmbientStopFn = stopFn;
      return stopFn;
    } else if (type === 'quiet-rain') {
      // Filter for soft steady rain + subtle droplet sheen
      const lowFilter = ctx.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.setValueAtTime(900, now);

      const highFilter = ctx.createBiquadFilter();
      highFilter.type = 'highpass';
      highFilter.frequency.setValueAtTime(2500, now);

      const highGain = ctx.createGain();
      highGain.gain.setValueAtTime(0.08, now);

      masterGain.gain.linearRampToValueAtTime(0.2 * targetVol, now + 1.5);

      source.connect(lowFilter);
      lowFilter.connect(masterGain);

      source.connect(highFilter);
      highFilter.connect(highGain);
      highGain.connect(masterGain);

      masterGain.connect(ctx.destination);
      source.start(now);

      const stopFn = () => {
        try {
          const stopTime = ctx.currentTime;
          masterGain.gain.setValueAtTime(masterGain.gain.value, stopTime);
          masterGain.gain.linearRampToValueAtTime(0.0001, stopTime + 0.4);
          setTimeout(() => {
            try {
              source.stop();
              source.disconnect();
              lowFilter.disconnect();
              highFilter.disconnect();
              masterGain.disconnect();
            } catch {
              // Ignore
            }
          }, 450);
        } catch {
          // Ignore
        }
      };

      currentAmbientStopFn = stopFn;
      return stopFn;
    }
  } catch (err) {
    console.warn('Failed to start ambient sound:', err);
  }

  return () => {};
}

export function previewAmbientSound(type: AmbientSoundType, volume: number = 0.8) {
  if (type === 'none') {
    stopAmbientSound();
    return;
  }
  const stopFn = startAmbientSound(type, volume);
  setTimeout(() => {
    stopFn();
  }, 3500);
}
