"use client";

import { BookOpen, Compass, HeartHandshake, PlusCircle } from "lucide-react";
import { playSfx } from "@/lib/sound-effects";

export type AppTab = "diary" | "new" | "patterns" | "guide";

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  pendingReviewCount?: number;
}

const NAV_ITEMS: {
  id: AppTab;
  label: string;
  icon: typeof BookOpen;
}[] = [
  { id: "diary", label: "Diário", icon: BookOpen },
  { id: "new", label: "Registrar", icon: PlusCircle },
  { id: "patterns", label: "Padrões & XP", icon: Compass },
  { id: "guide", label: "Guia & Apoio", icon: HeartHandshake },
];

export function BottomNav({
  activeTab,
  onSelectTab,
  pendingReviewCount = 0,
}: BottomNavProps) {
  return (
    <>
      {/* Navegação em abas para Desktop / Tablet */}
      <nav
        aria-label="Navegação principal"
        className="mx-auto hidden w-full max-w-5xl px-4 pt-5 sm:block sm:px-6"
      >
        <div className="inline-flex w-full items-center justify-between gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (!active) playSfx("tab");
                  onSelectTab(item.id);
                }}
                className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.id === "patterns" && pendingReviewCount > 0 && (
                  <span
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                      active
                        ? "bg-white text-blue-700"
                        : "bg-sky-100 text-blue-700 dark:bg-sky-500/20 dark:text-sky-300"
                    }`}
                  >
                    {pendingReviewCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Barra fixa inferior Mobile-First */}
      <nav
        aria-label="Menu inferior mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 sm:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (!active) playSfx("tab");
                  onSelectTab(item.id);
                }}
                className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition ${
                  active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-sky-300"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    item.id === "new" && !active
                      ? "text-blue-600 dark:text-sky-400"
                      : ""
                  }`}
                />
                <span>{item.label}</span>
                {item.id === "patterns" && pendingReviewCount > 0 && (
                  <span className="absolute right-3 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white dark:bg-sky-400 dark:text-slate-950">
                    {pendingReviewCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
