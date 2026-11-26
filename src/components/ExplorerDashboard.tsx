"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  Compass,
  Download,
  Flame,
  History,
  Sparkles,
  Trophy,
  Upload,
} from "lucide-react";
import { exportAllDreamsJson, importDreamsFromJson } from "@/lib/db";
import type { GamificationStats } from "@/lib/gamification";
import type { DreamEntry } from "@/lib/types";

interface ExplorerDashboardProps {
  stats: GamificationStats;
  onEditDream: (dream: DreamEntry) => void;
}

export function ExplorerDashboard({
  stats,
  onEditDream,
}: ExplorerDashboardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [backupFeedback, setBackupFeedback] = useState("");

  async function handleExport() {
    const json = await exportAllDreamsJson();
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diario-dos-sonhos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setBackupFeedback("Backup JSON exportado com sucesso!");
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await file.text();
      const count = await importDreamsFromJson(content);
      setBackupFeedback(`${count} registro(s) importado(s) para seu diário local.`);
    } catch (err) {
      setBackupFeedback(
        err instanceof Error ? err.message : "Erro ao importar arquivo JSON."
      );
    } finally {
      e.target.value = "";
    }
  }

  const totalDist = Math.max(1, stats.totalDreams);

  return (
    <div className="space-y-5">
      {/* Progresso Achiever: Nível, XP e Streak */}
      <section className="rounded-3xl border border-blue-200/80 bg-gradient-to-br from-[#00A1E0] via-[#007EB0] to-[#0F172A] p-6 text-white shadow-sm dark:border-sky-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-sky-100">
              <Sparkles className="h-3.5 w-3.5 text-[#FFA300]" />
              Jornada do Sonhador (Conquistador)
            </span>
            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              Nível {stats.level}: {stats.levelTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/15 px-4 py-2 text-center backdrop-blur-sm">
              <span className="block text-[11px] text-sky-100">XP Total</span>
              <span className="font-display-num text-lg text-white">
                {stats.xp}
              </span>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-2 text-center backdrop-blur-sm">
              <span className="flex items-center justify-center gap-1 text-[11px] text-[#FFD180]">
                <Flame className="h-3 w-3 text-[#FFA300]" /> Streak
              </span>
              <span className="font-display-num text-lg text-white">
                {stats.currentStreak}d
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs text-sky-100">
            <span>Progresso para o próximo nível</span>
            <span>
              {stats.xp} / {stats.nextLevelXp} XP
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-950/45">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FFA300] to-[#FFD166] transition-all duration-500"
              style={{ width: `${stats.levelProgressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Radar de Revisão (3 a 7 dias) - Explorer */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-600 dark:text-sky-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Radar de Revisão (3 a 7 dias)
          </h3>
        </div>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          O discernimento amadurece quando revisitamos sonhos após alguns dias
          para verificar convergências ou confirmações práticas.
        </p>

        {stats.pendingReviewDreams.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600 dark:bg-slate-950 dark:text-slate-400">
            Nenhum sonho aguardando revisão de 3 a 7 dias no momento.
          </p>
        ) : (
          <div className="mt-4 space-y-2.5">
            {stats.pendingReviewDreams.slice(0, 5).map((dream) => (
              <div
                key={dream.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 dark:border-sky-500/20 dark:bg-slate-950"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {dream.title}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Registrado em {dream.dreamDate} • CEC atual: {dream.cecTotal}
                    /15
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onEditDream(dream)}
                  className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 dark:bg-sky-400 dark:text-slate-950"
                >
                  Revisar confirmação (+25 XP)
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Descobertas Explorer: Símbolos + Distribuição CEC */}
      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-blue-600 dark:text-sky-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Mapa de Símbolos Recorrentes
            </h3>
          </div>
          {stats.topSymbols.length === 0 ? (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Adicione tags de símbolos aos seus sonhos para revelar padrões
              recorrentes.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {stats.topSymbols.map((item) => (
                <span
                  key={item.symbol}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/70 dark:text-sky-300"
                >
                  <span>#{item.symbol}</span>
                  <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white dark:bg-sky-400 dark:text-slate-950">
                    {item.count}
                  </span>
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Distribuição pela Escala CEC
          </h3>
          <div className="mt-4 space-y-3 text-xs">
            {[
              {
                label: "Sonho Comum (0–6)",
                count: stats.cecDistribution.comum,
                color: "bg-slate-400 dark:bg-slate-500",
              },
              {
                label: "Em Observação (7–10)",
                count: stats.cecDistribution.observacao,
                color: "bg-amber-400",
              },
              {
                label: "Forte Indicativo Espiritual (11–15)",
                count: stats.cecDistribution.espiritual,
                color: "bg-blue-600 dark:bg-sky-400",
              },
            ].map((row) => {
              const pct = Math.round((row.count / totalDist) * 100);
              return (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span>{row.label}</span>
                    <span>
                      {row.count} ({stats.totalDreams === 0 ? 0 : pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${row.color}`}
                      style={{
                        width: `${stats.totalDreams === 0 ? 0 : pct}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Vitrine de Conquistas (Badges com símbolos oficiais Camis GameDev) */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Conquistas de Consistência e Exploração
          </h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats.badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-start gap-3 rounded-2xl border p-4 transition ${badge.unlocked
                  ? "border-blue-200 bg-blue-50/50 dark:border-sky-500/30 dark:bg-blue-950/30"
                  : "border-slate-200 bg-slate-50/70 opacity-70 dark:border-slate-800 dark:bg-slate-950/60"
                }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm dark:bg-slate-900 ${badge.unlocked ? "" : "grayscale"
                  }`}
              >
                <Image
                  src={badge.iconSrc}
                  alt={badge.title}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {badge.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                  {badge.description}
                </p>
                <span className="mt-1.5 inline-block rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-sky-300 dark:ring-slate-700">
                  {badge.unlocked ? "Desbloqueado!" : badge.progressText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Backup Local JSON */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Backup dos seus registros locais
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Seus dados ficam apenas no seu navegador. Exporte um
              arquivo JSON periodicamente para guardar ou transferir entre
              aparelhos.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exportar JSON</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-400 dark:text-slate-950"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Importar JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>
        {backupFeedback && (
          <p className="mt-3 text-xs font-semibold text-blue-600 dark:text-sky-400">
            {backupFeedback}
          </p>
        )}
      </section>
    </div>
  );
}
