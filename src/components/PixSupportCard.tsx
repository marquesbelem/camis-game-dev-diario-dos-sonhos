"use client";

import { useState } from "react";
import { Check, Copy, Heart } from "lucide-react";
import { SITE_CONFIG, isPlaceholderValue } from "@/config/site";
import { playSfx } from "@/lib/sound-effects";

export function PixSupportCard() {
  const [copied, setCopied] = useState(false);
  const isPlaceholder = isPlaceholderValue(SITE_CONFIG.pix.key);

  async function handleCopyPix() {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.pix.key);
      playSfx("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      aria-labelledby="apoio-pix-titulo"
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Heart className="h-3.5 w-3.5" />
            <span>100% Gratuito • Apoio Voluntário</span>
          </div>
          <h2
            id="apoio-pix-titulo"
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            Apoie este projeto com qualquer valor via Pix
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {SITE_CONFIG.pix.message}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Favorecido:{" "}
            <strong className="text-slate-700 dark:text-slate-200">
              {SITE_CONFIG.pix.recipient}
            </strong>
            {isPlaceholder && (
              <span className="ml-2 text-amber-700 dark:text-amber-300">
                (Configure NEXT_PUBLIC_PIX_KEY ou src/config/site.ts)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="break-all rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-sky-300">
            {SITE_CONFIG.pix.key}
          </div>
          <button
            type="button"
            onClick={handleCopyPix}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Chave Pix copiada!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copiar chave Pix</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
