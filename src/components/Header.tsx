"use client";

import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { AppLogo } from "./AppLogo";
import { SoundToggle } from "./SoundToggle";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  level?: number;
  streak?: number;
  onLogoClick?: () => void;
}

export function Header({ level = 1, streak = 0, onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          onClick={onLogoClick}
          className="flex items-center gap-3 rounded-full pr-2 transition hover:opacity-90"
        >
          <AppLogo size={42} className="shrink-0 drop-shadow-sm" />
          <div className="leading-tight">
            <span className="block font-[family-name:var(--font-heading)] text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-lg">
              Diário dos Sonhos
            </span>
            <span className="block text-[11px] font-semibold text-[#00A1E0] dark:text-[#4DC8F0]">
              Escala CEC • Umbanda &amp; Estudo
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <div
            className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200/80 dark:bg-amber-950/50 dark:text-[#FFA300] dark:ring-[#FFA300]/30 sm:inline-flex"
            title="Sequência diária de registros"
          >
            <Flame className="h-3.5 w-3.5 text-[#FFA300]" />
            <span className="font-display-num text-[11px]">{streak}</span>
            <span>{streak === 1 ? "dia" : "dias"}</span>
          </div>

          <div
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/80 dark:bg-blue-950/60 dark:text-sky-300 dark:ring-sky-500/30"
            title="Nível atual de discernimento"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#00A1E0] dark:text-sky-300" />
            <span className="font-display-num text-[11px]">Nv.{level}</span>
          </div>

          <SoundToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
