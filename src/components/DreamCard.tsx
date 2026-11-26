"use client";

import { useState } from "react";
import {
  Calendar,
  Check,
  Clock,
  Edit3,
  Share2,
  Trash2,
} from "lucide-react";
import { classifyCecScore } from "@/lib/cec-scale";
import { isPendingSevenDayReview } from "@/lib/gamification";
import type { DreamEntry } from "@/lib/types";
import { useTodayDateString } from "@/lib/use-today";

interface DreamCardProps {
  dream: DreamEntry;
  onEdit: (dream: DreamEntry) => void;
  onDelete: (id: number) => void;
}

function formatDateBr(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
}

export function DreamCard({ dream, onEdit, onDelete }: DreamCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const todayStr = useTodayDateString();

  const classification = classifyCecScore(dream.cecTotal);
  const pendingReview = isPendingSevenDayReview(dream, todayStr);

  const badgeColors =
    classification.category === "espiritual"
      ? "bg-blue-600 text-white dark:bg-sky-400 dark:text-slate-950"
      : classification.category === "observacao"
        ? "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300"
        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  async function handleCopyEthicalSummary() {
    const lines = [
      `Registro de Sonho (${formatDateBr(dream.dreamDate)})`,
      `Título: ${dream.title}`,
      `Escala CEC: ${dream.cecTotal}/15 — ${classification.title} (C:${dream.clarity} | E:${dream.emotion} | Conf:${dream.confirmation})`,
      dream.symbols.length > 0 ? `Símbolos: ${dream.symbols.join(", ")}` : null,
      dream.notableMarkers.length > 0
        ? `Pontos marcantes: ${dream.notableMarkers.join(", ")}`
        : null,
      `Relato: ${dream.narrative}`,
      dream.personalInterpretation
        ? `Percepção inicial: ${dream.personalInterpretation}`
        : null,
      "",
      "Nota: Compartilhado para diálogo e validação responsável (Escala CEC).",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(lines);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      setCopiedSummary(false);
    }
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-500/40">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateBr(dream.dreamDate)}
            </span>
            {dream.approxTime && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {dream.approxTime}
              </span>
            )}
            {pendingReview && (
              <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800 dark:bg-sky-500/20 dark:text-sky-300">
                Revisão 3–7 dias pendente
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            {dream.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badgeColors}`}
          >
            <span className="font-display-num text-xs">{dream.cecTotal}</span>
            <span>• {classification.title}</span>
          </span>
        </div>
      </div>

      {/* Sub-notas CEC */}
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
          Clareza {dream.clarity}/5
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
          Emoção {dream.emotion}/5
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
          Confirmação {dream.confirmation}/5
        </span>
      </div>

      <p
        className={`mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {dream.narrative}
      </p>

      {dream.symbols.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dream.symbols.map((sym) => (
            <span
              key={sym}
              className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-sky-300"
            >
              #{sym}
            </span>
          ))}
        </div>
      )}

      {expanded && (
        <div className="mt-4 space-y-2.5 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">
          {dream.wakeFeelings.length > 0 && (
            <p>
              <strong>Ao acordar:</strong> {dream.wakeFeelings.join(", ")}
            </p>
          )}
          {dream.notableMarkers.length > 0 && (
            <p>
              <strong>Pontos marcantes:</strong>{" "}
              {dream.notableMarkers.join(", ")}
            </p>
          )}
          {dream.virtueConnection && (
            <p>
              <strong>Virtude / Valor:</strong> {dream.virtueConnection}
            </p>
          )}
          {dream.ethicalAction && (
            <p>
              <strong>Passo ético:</strong> {dream.ethicalAction}
            </p>
          )}
          {dream.dayReverberation && (
            <p>
              <strong>Reverberação no dia:</strong> {dream.dayReverberation}
            </p>
          )}
          {dream.personalInterpretation && (
            <p>
              <strong>Interpretação pessoal:</strong>{" "}
              {dream.personalInterpretation}
            </p>
          )}
          {dream.sevenDayReview && (
            <p>
              <strong>Revisão posterior:</strong> {dream.sevenDayReview}
            </p>
          )}
        </div>
      )}

      {/* Ações */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-sky-400 dark:hover:bg-slate-800"
        >
          {expanded ? "Recolher detalhes" : "Ver detalhes"}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyEthicalSummary}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300"
            title="Copia um resumo estruturado para diálogo com dirigente ou terapeuta"
          >
            {copiedSummary ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Resumo copiado</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Partilhar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onEdit(dream)}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/70 dark:text-sky-300 dark:hover:bg-blue-900/60"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{pendingReview ? "Revisar CEC" : "Editar"}</span>
          </button>

          {dream.id !== undefined &&
            (confirmDelete ? (
              <button
                type="button"
                onClick={() => onDelete(dream.id!)}
                className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-rose-700"
              >
                Confirmar exclusão
              </button>
            ) : (
              <button
                type="button"
                aria-label="Excluir registro"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            ))}
        </div>
      </div>
    </article>
  );
}
