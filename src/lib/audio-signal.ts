/**
 * Synthesizes a clean 3-tone signal sound ("bip bip bip") using the browser's Web Audio API.
 * Used prior to transitioning to the next item during listening practice.
 */
let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch (err) {
    console.warn("AudioContext initialization notice:", err);
    return null;
  }
}

export function playBeepSignal(): void {
  if (typeof window === "undefined") return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playShortBeep = (time: number, freq: number, duration = 0.1) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
    };

    const now = ctx.currentTime;
    // Bip 1 (880 Hz - A5)
    playShortBeep(now, 880, 0.1);
    // Bip 2 (880 Hz - A5)
    playShortBeep(now + 0.18, 880, 0.1);
    // Bip 3 (1174.66 Hz - D6 higher tone to signify transition)
    playShortBeep(now + 0.36, 1174.66, 0.15);
  } catch (err) {
    // Ignore audio context autoplay restriction errors gracefully
    console.warn("Audio signal trigger notice:", err);
  }
}

/**
 * Synthesizes a subtle, pleasant mono "ting / pip" sound when moving to the next character card.
 * Uses Web Audio API sine oscillator with exponential decay for instantaneous zero-latency playback.
 */
export function playCardTransitionSound(): void {
  if (typeof window === "undefined") return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // High, soft "ting" sound (C6 - 1046.5 Hz) with gentle exponential decay
    osc.type = "sine";
    osc.frequency.setValueAtTime(1046.5, now);
    // Pitch drop slightly for a warm, soft pop feel
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (err) {
    console.warn("Card transition sound notice:", err);
  }
}
