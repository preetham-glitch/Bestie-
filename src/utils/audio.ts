let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function playChime(freqMultiplier = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Play a gentle sweet double chime (harmony)
    const baseFreqs = [523.25, 659.25, 783.99, 1046.50]; // C Major Chord notes: C5, E5, G5, C6
    const randomFreq = baseFreqs[Math.floor(Math.random() * baseFreqs.length)] * freqMultiplier;

    // Create oscillator
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(randomFreq, now);
    
    // A cute bell-like envelope (fast attack, exponentially decaying release)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  } catch (error) {
    // Fail silently so it doesn't break client experience if audio policies are strict
    console.warn("Audio chime block:", error);
  }
}

export function playSparkle() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const chimeTimes = [0, 0.08, 0.16, 0.24];
    const freqs = [880, 1046.5, 1318.5, 1568]; // A5, C6, E6, G6 (Ascending sparkle)

    chimeTimes.forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freqs[i], now + delay);

      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.08, now + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.35);
    });
  } catch (error) {
    console.warn("Audio sparkle block:", error);
  }
}

export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    
    notes.forEach((freq, idx) => {
      const delay = idx * 0.06;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);

      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.08, now + delay + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.6);
    });
  } catch (err) {
    console.warn("Success sound block:", err);
  }
}
