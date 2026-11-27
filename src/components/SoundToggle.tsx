"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  getSoundMutedServerSnapshot,
  getSoundMutedSnapshot,
  playSfx,
  setSoundMuted,
  subscribeSoundMuted,
} from "@/lib/sound-effects";

export function SoundToggle() {
  const muted = useSyncExternalStore(
    subscribeSoundMuted,
    getSoundMutedSnapshot,
    getSoundMutedServerSnapshot
  );

  function handleToggle() {
    const nextMuted = !muted;
    setSoundMuted(nextMuted);
    if (!nextMuted) {
      playSfx("unmute");
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={muted ? "Ativar efeitos sonoros" : "Silenciar efeitos sonoros"}
      title={muted ? "Ativar efeitos sonoros" : "Silenciar efeitos sonoros"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-400 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300 dark:hover:border-sky-400"
    >
      {muted ? (
        <VolumeX className="h-4 w-4 text-slate-400 dark:text-slate-500" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </button>
  );
}
