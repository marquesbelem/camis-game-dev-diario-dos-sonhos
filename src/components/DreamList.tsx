"use client";

import { useMemo, useState } from "react";
import { BookOpen, PlusCircle, Search } from "lucide-react";
import { classifyCecScore } from "@/lib/cec-scale";
import { isPendingSevenDayReview } from "@/lib/gamification";
import type { CecCategory, DreamEntry } from "@/lib/types";
import { useTodayDateString } from "@/lib/use-today";
import { DreamCard } from "./DreamCard";

interface DreamListProps {
  dreams: DreamEntry[];
  onCreateNew: () => void;
  onEditDream: (dream: DreamEntry) => void;
  onDeleteDream: (id: number) => void;
}

type FilterOption = "all" | CecCategory | "pending";

export function DreamList({
  dreams,
  onCreateNew,
  onEditDream,
  onDeleteDream,
}: DreamListProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");
  const todayStr = useTodayDateString();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dreams.filter((d) => {
      if (filter === "pending" && !isPendingSevenDayReview(d, todayStr)) {
        return false;
      }
      if (
        filter !== "all" &&
        filter !== "pending" &&
        classifyCecScore(d.cecTotal).category !== filter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.narrative.toLowerCase().includes(q) ||
        d.symbols.some((s) => s.toLowerCase().includes(q)) ||
        d.notableMarkers.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [dreams, query, filter, todayStr]);

  if (dreams.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-blue-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-sky-400">
          <BookOpen className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Seu Diário dos Sonhos está pronto
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Transforme suas lembranças matinais em dados claros. Em apenas 60 a 90
          segundos por manhã você registra símbolos, emoções e acompanha a{" "}
          <strong>Escala CEC</strong> ao longo do tempo — tudo salvo com
          privacidade no seu dispositivo.
        </p>
        <button
          type="button"
          onClick={onCreateNew}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Registrar meu primeiro sonho</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de busca e filtros */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por símbolo, palavra ou título..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Novo sonho</span>
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: `Todos (${dreams.length})` },
              { id: "espiritual", label: "Indicativo Espiritual (11–15)" },
              { id: "observacao", label: "Em Observação (7–10)" },
              { id: "comum", label: "Sonho Comum (0–6)" },
              { id: "pending", label: "Revisão 3–7 dias" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === item.id
                  ? "bg-slate-900 text-white dark:bg-sky-400 dark:text-slate-950"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Nenhum registro encontrado com os filtros atuais.
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((dream) => (
            <DreamCard
              key={dream.id}
              dream={dream}
              onEdit={onEditDream}
              onDelete={onDeleteDream}
            />
          ))}
        </div>
      )}
    </div>
  );
}
