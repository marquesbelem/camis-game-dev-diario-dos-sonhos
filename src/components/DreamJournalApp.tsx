"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowRight, BookOpenCheck, ShieldCheck } from "lucide-react";
import { db, deleteDreamEntry } from "@/lib/db";
import { computeGamificationStats } from "@/lib/gamification";
import { playSfx } from "@/lib/sound-effects";
import type { DreamEntry } from "@/lib/types";
import { useTodayDateString } from "@/lib/use-today";
import { BookAffiliateBanner } from "./BookAffiliateBanner";
import { BottomNav, type AppTab } from "./BottomNav";
import { DreamForm, type SaveCelebration } from "./DreamForm";
import { DreamList } from "./DreamList";
import { ExplorerDashboard } from "./ExplorerDashboard";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PixSupportCard } from "./PixSupportCard";

export function DreamJournalApp() {
  const [activeTab, setActiveTab] = useState<AppTab>("diary");
  const [editingDream, setEditingDream] = useState<DreamEntry | null>(null);
  const [toast, setToast] = useState("");

  const todayStr = useTodayDateString();
  const dreams = useLiveQuery(
    () => db.dreams.orderBy("dreamDate").reverse().toArray(),
    [],
    [] as DreamEntry[]
  );

  const stats = useMemo(
    () => computeGamificationStats(dreams, todayStr),
    [dreams, todayStr]
  );

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 3500);
  }

  function handleSelectTab(tab: AppTab) {
    if (tab !== "new") {
      setEditingDream(null);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEditDream(dream: DreamEntry) {
    setEditingDream(dream);
    setActiveTab("new");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteDream(id: number) {
    await deleteDreamEntry(id);
    playSfx("delete");
    showToast("Registro removido do diário local.");
  }

  function handleSaved(
    _savedId: number,
    isEdit: boolean,
    celebration?: SaveCelebration
  ) {
    setEditingDream(null);
    setActiveTab("diary");

    if (celebration?.leveledUpTo || celebration?.unlockedBadgeTitle) {
      playSfx("achievement");
      if (celebration.leveledUpTo && celebration.unlockedBadgeTitle) {
        showToast(
          `Subiu para o Nível ${celebration.leveledUpTo.level} (${celebration.leveledUpTo.title}) e desbloqueou "${celebration.unlockedBadgeTitle}"!`
        );
      } else if (celebration.leveledUpTo) {
        showToast(
          `Parabéns! Você alcançou o Nível ${celebration.leveledUpTo.level}: ${celebration.leveledUpTo.title}!`
        );
      } else {
        showToast(
          `Conquista desbloqueada: "${celebration.unlockedBadgeTitle}"! Registro salvo.`
        );
      }
    } else {
      playSfx("save");
      showToast(
        isEdit
          ? "Sonho e confirmação atualizados com sucesso!"
          : "Sonho registrado! Você avançou na sua jornada."
      );
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        level={stats.level}
        streak={stats.currentStreak}
        onLogoClick={() => handleSelectTab("diary")}
      />

      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        pendingReviewCount={stats.pendingReviewDreams.length}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-6 sm:px-6">
        {toast && (
          <div
            role="status"
            className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 shadow-sm dark:border-sky-500/30 dark:bg-blue-950/70 dark:text-sky-200"
          >
            {toast}
          </div>
        )}

        {activeTab === "diary" && (
          <div className="space-y-6">
            {/* Hero compacto focado no hábito matinal */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-sky-300">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Banco de Dados Local • 100% Privado e Gratuito
                  </span>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    Registre sonhos com discernimento pela Escala CEC
                  </h1>
                  <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                    Avalie <strong>Clareza</strong>, <strong>Emoção</strong> e{" "}
                    <strong>Confirmação</strong> em poucos segundos ao acordar.
                    Inspirado no livro{" "}
                    <em>Sonhos e Mediunidade na Umbanda</em>, de Rodrigo
                    Queiroz.
                  </p>
                </div>

                <Link
                  href="/guia-escala-cec"
                  className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 sm:self-center"
                >
                  <BookOpenCheck className="h-4 w-4 text-blue-600 dark:text-sky-400" />
                  <span>Como funciona a Escala CEC</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>

            <DreamList
              dreams={dreams}
              onCreateNew={() => handleSelectTab("new")}
              onEditDream={handleEditDream}
              onDeleteDream={handleDeleteDream}
            />
          </div>
        )}

        {activeTab === "new" && (
          <DreamForm
            key={editingDream?.id ?? "new-dream"}
            initialDream={editingDream}
            onSaved={handleSaved}
            onCancel={() => {
              setEditingDream(null);
              setActiveTab("diary");
            }}
          />
        )}

        {activeTab === "patterns" && (
          <ExplorerDashboard stats={stats} onEditDream={handleEditDream} />
        )}

        {activeTab === "guide" && (
          <div className="space-y-6">
            <BookAffiliateBanner />

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Boas práticas de discernimento onírico
              </h2>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <li>
                  • <strong>Consistência matinal:</strong> anote logo ao
                  acordar em 60 a 90 segundos, mesmo quando lembrar apenas de
                  fragmentos ou sensações.
                </li>
                <li>
                  • <strong>Bússola dos 3 Cs:</strong> verifique{" "}
                  <em>Clareza</em> da lembrança, <em>Convergência</em> com
                  outros sinais da sua semana e <em>Consequência</em> prática
                  (trouxe paz e ordem?).
                </li>
                <li>
                  • <strong>Validação coletiva e humildade:</strong> sonhos
                  isolados não devem virar dogmas nem alterar rituais sem
                  diálogo com pessoas experientes ou com o dirigente do
                  terreiro.
                </li>
              </ul>
              <div className="mt-5">
                <Link
                  href="/guia-escala-cec"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/70 dark:text-sky-300"
                >
                  <span>Ler o Guia Completo da Escala CEC</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>

            <PixSupportCard />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
