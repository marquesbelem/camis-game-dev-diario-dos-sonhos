"use client";

export type SfxType =
  | "tab"
  | "chip"
  | "tagAdd"
  | "copy"
  | "save"
  | "achievement"
  | "delete"
  | "error"
  | "unmute";

const MUTE_STORAGE_KEY = "diario-sonhos-sound-muted";
const listeners = new Set<() => void>();

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === "suspended") {
    void sharedAudioCtx.resume().catch(() => undefined);
  }
  return sharedAudioCtx;
}

export function subscribeSoundMuted(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    const onStorage = (e: StorageEvent) => {
      if (e.key === MUTE_STORAGE_KEY) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }
  return () => {
    listeners.delete(listener);
  };
}

export function getSoundMutedSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function getSoundMutedServerSnapshot(): boolean {
  return false;
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MUTE_STORAGE_KEY, muted ? "1" : "0");
  } catch {
    // Ignore storage quota errors
  }
  listeners.forEach((fn) => fn());
}

interface ToneOptions {
  freq: number;
  endFreq?: number;
  startOffset?: number;
  duration: number;
  gain?: number;
  type?: OscillatorType;
}

function scheduleTone(ctx: AudioContext, opts: ToneOptions): void {
  const {
    freq,
    endFreq,
    startOffset = 0,
    duration,
    gain = 0.08,
    type = "sine",
  } = opts;

  const start = ctx.currentTime + startOffset;
  const end = start + duration;

  const osc = ctx.createOscillator();
  const amp = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq && endFreq !== freq) {
    osc.frequency.exponentialRampToValueAtTime(endFreq, end);
  }

  // Smooth envelope to avoid clicks
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.linearRampToValueAtTime(gain, start + Math.min(0.012, duration * 0.25));
  amp.gain.exponentialRampToValueAtTime(0.0001, end);

  osc.connect(amp);
  amp.connect(ctx.destination);

  osc.start(start);
  osc.stop(end + 0.01);
}

// Escala pentatônica suave em Dó Maior (0 a 5 da Escala CEC)
const CEC_PENTATONIC_HZ = [
  440.0, // 0 - A4
  523.25, // 1 - C5
  587.33, // 2 - D5
  659.25, // 3 - E5
  783.99, // 4 - G5
  1046.5, // 5 - C6
];

export function playScaleStep(step: number): void {
  if (getSoundMutedSnapshot()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const clamped = Math.max(0, Math.min(5, Math.round(step)));
    const baseFreq = CEC_PENTATONIC_HZ[clamped] ?? 523.25;

    scheduleTone(ctx, {
      freq: baseFreq,
      duration: 0.14,
      gain: 0.075,
      type: "sine",
    });
    // Harmônico sutil de cristal nos níveis mais altos (4 e 5)
    if (clamped >= 4) {
      scheduleTone(ctx, {
        freq: baseFreq * 1.5,
        startOffset: 0.02,
        duration: 0.16,
        gain: 0.03,
        type: "triangle",
      });
    }
  } catch {
    // Ignore audio errors
  }
}

export function playSfx(type: SfxType): void {
  if (type !== "unmute" && getSoundMutedSnapshot()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    switch (type) {
      case "tab": {
        scheduleTone(ctx, {
          freq: 480,
          endFreq: 600,
          duration: 0.065,
          gain: 0.045,
          type: "sine",
        });
        break;
      }

      case "chip": {
        scheduleTone(ctx, {
          freq: 660,
          endFreq: 740,
          duration: 0.07,
          gain: 0.05,
          type: "triangle",
        });
        break;
      }

      case "tagAdd": {
        // Brilho duplo (+15 XP)
        scheduleTone(ctx, {
          freq: 659.25, // E5
          duration: 0.09,
          gain: 0.065,
          type: "sine",
        });
        scheduleTone(ctx, {
          freq: 987.77, // B5
          startOffset: 0.055,
          duration: 0.15,
          gain: 0.07,
          type: "sine",
        });
        break;
      }

      case "copy":
      case "unmute": {
        scheduleTone(ctx, {
          freq: 587.33, // D5
          duration: 0.08,
          gain: 0.06,
          type: "sine",
        });
        scheduleTone(ctx, {
          freq: 880.0, // A5
          startOffset: 0.06,
          duration: 0.14,
          gain: 0.065,
          type: "sine",
        });
        break;
      }

      case "save": {
        // Arpejo sereno de registro matinal (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          scheduleTone(ctx, {
            freq,
            startOffset: idx * 0.065,
            duration: idx === notes.length - 1 ? 0.32 : 0.16,
            gain: 0.075,
            type: "sine",
          });
        });
        break;
      }

      case "achievement": {
        // Fanfarra onírica de conquista / level-up (C5 -> E5 -> G5 -> B5 -> D6 -> G6)
        const fanfare = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
        fanfare.forEach((freq, idx) => {
          scheduleTone(ctx, {
            freq,
            startOffset: idx * 0.06,
            duration: idx === fanfare.length - 1 ? 0.45 : 0.2,
            gain: idx === fanfare.length - 1 ? 0.085 : 0.065,
            type: idx % 2 === 0 ? "sine" : "triangle",
          });
        });
        break;
      }

      case "delete": {
        scheduleTone(ctx, {
          freq: 420,
          endFreq: 260,
          duration: 0.13,
          gain: 0.055,
          type: "sine",
        });
        break;
      }

      case "error": {
        scheduleTone(ctx, {
          freq: 280,
          duration: 0.09,
          gain: 0.06,
          type: "triangle",
        });
        scheduleTone(ctx, {
          freq: 220,
          startOffset: 0.08,
          duration: 0.14,
          gain: 0.06,
          type: "triangle",
        });
        break;
      }
    }
  } catch {
    // Ignore audio errors
  }
}
