"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import {
  CLARITY_OPTIONS,
  CONFIRMATION_OPTIONS,
  EMOTION_OPTIONS,
  NOTABLE_MARKER_SUGGESTIONS,
  PRE_SLEEP_SUGGESTIONS,
  WAKE_FEELING_SUGGESTIONS,
  calculateCecTotal,
  classifyCecScore,
} from "@/lib/cec-scale";
import { createDreamEntry, updateDreamEntry } from "@/lib/db";
import type {
  ClarityScore,
  ConfirmationScore,
  DreamEntry,
  EmotionScore,
  EmotionalValence,
} from "@/lib/types";
import { useTodayDateString } from "@/lib/use-today";

interface DreamFormProps {
  initialDream?: DreamEntry | null;
  onSaved: (savedId: number, isEdit: boolean) => void;
  onCancel?: () => void;
}

export function DreamForm({
  initialDream,
  onSaved,
  onCancel,
}: DreamFormProps) {
  const isEdit = Boolean(initialDream?.id);
  const todayStr = useTodayDateString();

  const [dreamDate, setDreamDate] = useState(
    initialDream?.dreamDate || todayStr
  );
  const [approxTime, setApproxTime] = useState(initialDream?.approxTime || "");
  const [sleepLocation, setSleepLocation] = useState(
    initialDream?.sleepLocation || ""
  );
  const [preSleepStates, setPreSleepStates] = useState<string[]>(
    initialDream?.preSleepStates || []
  );
  const [preSleepCustom, setPreSleepCustom] = useState(
    initialDream?.preSleepCustom || ""
  );

  const [title, setTitle] = useState(initialDream?.title || "");
  const [narrative, setNarrative] = useState(initialDream?.narrative || "");
  const [symbols, setSymbols] = useState<string[]>(initialDream?.symbols || []);
  const [symbolInput, setSymbolInput] = useState("");
  const [virtueConnection, setVirtueConnection] = useState(
    initialDream?.virtueConnection || ""
  );
  const [ethicalAction, setEthicalAction] = useState(
    initialDream?.ethicalAction || ""
  );

  const [notableMarkers, setNotableMarkers] = useState<string[]>(
    initialDream?.notableMarkers || []
  );
  const [notableCustom, setNotableCustom] = useState(
    initialDream?.notableCustom || ""
  );
  const [wakeFeelings, setWakeFeelings] = useState<string[]>(
    initialDream?.wakeFeelings || []
  );
  const [wakeCustom, setWakeCustom] = useState(initialDream?.wakeCustom || "");
  const [emotionalValence, setEmotionalValence] = useState<EmotionalValence>(
    initialDream?.emotionalValence || "neutra"
  );

  const [clarity, setClarity] = useState<ClarityScore>(
    initialDream?.clarity || 3
  );
  const [emotion, setEmotion] = useState<EmotionScore>(
    initialDream?.emotion || 3
  );
  const [confirmation, setConfirmation] = useState<ConfirmationScore>(
    initialDream?.confirmation ?? 0
  );

  const [dayReverberation, setDayReverberation] = useState(
    initialDream?.dayReverberation || ""
  );
  const [personalInterpretation, setPersonalInterpretation] = useState(
    initialDream?.personalInterpretation || ""
  );
  const [sevenDayReview, setSevenDayReview] = useState(
    initialDream?.sevenDayReview || ""
  );

  const [showExtraContext, setShowExtraContext] = useState(isEdit);
  const [showCompass, setShowCompass] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const cecTotal = calculateCecTotal(clarity, emotion, confirmation);
  const cecClass = classifyCecScore(cecTotal);
  const hasSensitiveMarker = notableMarkers.some((m) =>
    m.toLowerCase().includes("sensível")
  );

  function toggleChip(list: string[], value: string, setter: (v: string[]) => void) {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  }

  function addSymbolTag() {
    const cleaned = symbolInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (cleaned.length === 0) return;

    const merged = [...symbols];
    for (const item of cleaned) {
      if (!merged.some((existing) => existing.toLowerCase() === item.toLowerCase())) {
        merged.push(item);
      }
    }
    setSymbols(merged);
    setSymbolInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!narrative.trim()) {
      setErrorMsg(
        "Descreva pelo menos alguns flashes, sensações ou cenas do sonho antes de salvar."
      );
      return;
    }

    setErrorMsg("");
    setSaving(true);

    try {
      const autoTitle =
        title.trim() ||
        narrative.trim().split(/\s+/).slice(0, 6).join(" ") + "...";

      const markReviewed =
        Boolean(sevenDayReview.trim()) ||
        (isEdit && confirmation !== initialDream?.confirmation && confirmation > 0);

      const payload = {
        dreamDate,
        approxTime: approxTime.trim(),
        sleepLocation: sleepLocation.trim(),
        preSleepStates,
        preSleepCustom: preSleepCustom.trim(),
        title: autoTitle,
        narrative: narrative.trim(),
        symbols,
        virtueConnection: virtueConnection.trim(),
        ethicalAction: ethicalAction.trim(),
        notableMarkers,
        notableCustom: notableCustom.trim(),
        wakeFeelings,
        wakeCustom: wakeCustom.trim(),
        emotionalValence,
        clarity,
        emotion,
        confirmation,
        dayReverberation: dayReverberation.trim(),
        personalInterpretation: personalInterpretation.trim(),
        sevenDayReview: sevenDayReview.trim(),
        reviewedAt: markReviewed
          ? initialDream?.reviewedAt || new Date().toISOString()
          : initialDream?.reviewedAt,
      };

      if (isEdit && initialDream?.id) {
        await updateDreamEntry(initialDream.id, payload);
        onSaved(initialDream.id, true);
      } else {
        const newId = await createDreamEntry(payload);
        onSaved(newId, false);
      }
    } catch {
      setErrorMsg("Não foi possível salvar no banco local. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Cabeçalho do formulário */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-sky-300">
              <Sparkles className="h-3.5 w-3.5" />
              {isEdit ? "Editar / Revisar Registro" : "Registro Matinal (60–90s)"}
            </span>
            <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {isEdit ? "Atualizar sonho e confirmação" : "Registrar novo sonho"}
            </h1>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
          )}
        </div>

        {/* Data + Título curto */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="dream-date"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Data do sonho
            </label>
            <input
              id="dream-date"
              type="date"
              value={dreamDate}
              onChange={(e) => setDreamDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="dream-title"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Título breve (opcional)
            </label>
            <input
              id="dream-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Cachoeira clara e recado de serenidade"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>

        {/* Narrativa livre */}
        <div className="mt-4">
          <label
            htmlFor="dream-narrative"
            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            O que você lembra do sonho? *
          </label>
          <textarea
            id="dream-narrative"
            rows={5}
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Anote imagens, falas, cores, lugares, sensações ou fragmentos antes que a memória apague..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            required
          />
        </div>

        {/* Tags de símbolos */}
        <div className="mt-4">
          <label
            htmlFor="symbol-input"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <Tag className="h-3.5 w-3.5 text-blue-600 dark:text-sky-400" />
            <span>Símbolos e elementos-chave (opcional, +15 XP)</span>
          </label>
          <div className="flex gap-2">
            <input
              id="symbol-input"
              type="text"
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSymbolTag();
                }
              }}
              placeholder="Ex.: água, vela, mata, escada (Enter para adicionar)"
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <button
              type="button"
              onClick={addSymbolTag}
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Adicionar</span>
            </button>
          </div>
          {symbols.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {symbols.map((sym) => (
                <span
                  key={sym}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/70 dark:text-sky-300"
                >
                  #{sym}
                  <button
                    type="button"
                    aria-label={`Remover símbolo ${sym}`}
                    onClick={() =>
                      setSymbols(symbols.filter((item) => item !== sym))
                    }
                    className="rounded-full p-0.5 hover:bg-blue-200/70 dark:hover:bg-sky-500/30"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Escala CEC Interativa */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Escala CEC (Clareza • Emoção • Confirmação)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Avalie os três pilares para diferenciar sonho comum de possível
              comunicação espiritual.
            </p>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl bg-blue-50 px-4 py-2 ring-1 ring-blue-200/80 dark:bg-blue-950/60 dark:ring-sky-500/30">
            <span className="font-display-num text-xl text-blue-600 dark:text-sky-400">
              {cecTotal}
            </span>
            <div className="text-left leading-tight">
              <span className="block text-[11px] font-bold uppercase tracking-wide text-blue-700 dark:text-sky-300">
                {cecClass.title}
              </span>
              <span className="block text-[11px] text-slate-600 dark:text-slate-400">
                de 15 pontos
              </span>
            </div>
          </div>
        </div>

        {/* 1. Clareza */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              1. Clareza ({clarity}/5)
            </span>
            <span className="text-xs font-medium text-blue-600 dark:text-sky-400">
              {CLARITY_OPTIONS.find((o) => o.value === clarity)?.label}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {CLARITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setClarity(opt.value)}
                className={`rounded-full py-2 text-sm font-bold transition ${
                  clarity === opt.value
                    ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {opt.value}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {CLARITY_OPTIONS.find((o) => o.value === clarity)?.description}
          </p>
        </div>

        {/* 2. Emoção */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              2. Emoção ({emotion}/5)
            </span>
            <span className="text-xs font-medium text-blue-600 dark:text-sky-400">
              {EMOTION_OPTIONS.find((o) => o.value === emotion)?.label}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {EMOTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setEmotion(opt.value)}
                className={`rounded-full py-2 text-sm font-bold transition ${
                  emotion === opt.value
                    ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {opt.value}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {EMOTION_OPTIONS.find((o) => o.value === emotion)?.description}
            </p>
            <div className="inline-flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
              {(
                [
                  { id: "positiva", label: "Positiva" },
                  { id: "neutra", label: "Neutra" },
                  { id: "desafiadora", label: "Desafiadora" },
                ] as const
              ).map((val) => (
                <button
                  key={val.id}
                  type="button"
                  onClick={() => setEmotionalValence(val.id)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                    emotionalValence === val.id
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-sky-300"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Confirmação */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              3. Confirmação ({confirmation}/5)
            </span>
            <span className="text-xs font-medium text-blue-600 dark:text-sky-400">
              {CONFIRMATION_OPTIONS.find((o) => o.value === confirmation)?.label}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {CONFIRMATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setConfirmation(opt.value)}
                className={`rounded-full py-2 text-sm font-bold transition ${
                  confirmation === opt.value
                    ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {opt.value}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {
              CONFIRMATION_OPTIONS.find((o) => o.value === confirmation)
                ?.description
            }
          </p>
        </div>

        {/* Leitura da faixa atual */}
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-xs leading-relaxed text-slate-700 dark:border-sky-500/20 dark:bg-slate-950/80 dark:text-slate-300">
          <p className="font-bold text-blue-800 dark:text-sky-300">
            Leitura ({cecClass.rangeLabel}): {cecClass.title}
          </p>
          <p className="mt-1">{cecClass.summary}</p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {cecClass.guidance}
          </p>
        </div>
      </div>

      {/* Sentimentos ao acordar e pontos marcantes */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="space-y-4">
          <div>
            <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Como você acordou?
            </span>
            <div className="flex flex-wrap gap-2">
              {WAKE_FEELING_SUGGESTIONS.map((item) => {
                const selected = wakeFeelings.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      toggleChip(wakeFeelings, item, setWakeFeelings)
                    }
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? "bg-blue-600 text-white dark:bg-blue-500"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pontos marcantes
            </span>
            <div className="flex flex-wrap gap-2">
              {NOTABLE_MARKER_SUGGESTIONS.map((item) => {
                const selected = notableMarkers.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      toggleChip(notableMarkers, item, setNotableMarkers)
                    }
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? "bg-sky-600 text-white dark:bg-sky-400 dark:text-slate-950"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {hasSensitiveMarker && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p>
                <strong>Lembrete de ética e sigilo:</strong> sonhos com temas
                sensíveis (saúde, rupturas ou segredos) jamais devem gerar
                decisões precipitadas ou exposição de terceiros. Busque
                confirmação cruzada e orientação madura antes de agir.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Acordeão 1: Contexto pré-sono & Local */}
      <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setShowExtraContext((prev) => !prev)}
          className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-slate-900 dark:text-white sm:px-6"
        >
          <span>Contexto do sono (como dormiu, horário e local)</span>
          {showExtraContext ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {showExtraContext && (
          <div className="space-y-4 border-t border-slate-100 px-5 pb-5 pt-4 dark:border-slate-800 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="approx-time"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Horário aproximado (se souber)
                </label>
                <input
                  id="approx-time"
                  type="text"
                  value={approxTime}
                  onChange={(e) => setApproxTime(e.target.value)}
                  placeholder="Ex.: Por volta das 04h30"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="sleep-location"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Local onde dormiu
                </label>
                <input
                  id="sleep-location"
                  type="text"
                  value={sleepLocation}
                  onChange={(e) => setSleepLocation(e.target.value)}
                  placeholder="Ex.: Casa, viagem, casa de familiar"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div>
              <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Estado antes de dormir
              </span>
              <div className="flex flex-wrap gap-2">
                {PRE_SLEEP_SUGGESTIONS.map((item) => {
                  const selected = preSleepStates.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggleChip(preSleepStates, item, setPreSleepStates)
                      }
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        selected
                          ? "bg-blue-600 text-white dark:bg-blue-500"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="pre-sleep-custom"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Outro estado pré-sono
                </label>
                <input
                  id="pre-sleep-custom"
                  type="text"
                  value={preSleepCustom}
                  onChange={(e) => setPreSleepCustom(e.target.value)}
                  placeholder="Opcional"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="notable-custom"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Outro ponto marcante
                </label>
                <input
                  id="notable-custom"
                  type="text"
                  value={notableCustom}
                  onChange={(e) => setNotableCustom(e.target.value)}
                  placeholder="Opcional"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="wake-custom"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Outro sentimento ao acordar
                </label>
                <input
                  id="wake-custom"
                  type="text"
                  value={wakeCustom}
                  onChange={(e) => setWakeCustom(e.target.value)}
                  placeholder="Opcional"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Acordeão 2: Bússola dos 3 Cs e Revisão de 7 dias */}
      <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setShowCompass((prev) => !prev)}
          className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-slate-900 dark:text-white sm:px-6"
        >
          <span>Reflexão, Bússola dos 3 Cs e Revisão posterior</span>
          {showCompass ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {showCompass && (
          <div className="space-y-4 border-t border-slate-100 px-5 pb-5 pt-4 dark:border-slate-800 sm:px-6">
            <div>
              <label
                htmlFor="virtue-connection"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Qual virtude ou valor os símbolos lembram? (Coragem, justiça,
                serenidade, foco...)
              </label>
              <input
                id="virtue-connection"
                type="text"
                value={virtueConnection}
                onChange={(e) => setVirtueConnection(e.target.value)}
                placeholder="Ex.: Paciência e organização emocional"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="ethical-action"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Pequeno passo prático e ético para hoje
              </label>
              <input
                id="ethical-action"
                type="text"
                value={ethicalAction}
                onChange={(e) => setEthicalAction(e.target.value)}
                placeholder="Ex.: Banho de descanso, conversa franca ou arrumar meu espaço"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="day-reverberation"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                O sonho reverberou durante o dia?
              </label>
              <textarea
                id="day-reverberation"
                rows={2}
                value={dayReverberation}
                onChange={(e) => setDayReverberation(e.target.value)}
                placeholder="Sincronias, lembranças repentinas ou sensações ao longo do dia..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="personal-interpretation"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Interpretação pessoal e relação com seu momento atual
              </label>
              <textarea
                id="personal-interpretation"
                rows={2}
                value={personalInterpretation}
                onChange={(e) => setPersonalInterpretation(e.target.value)}
                placeholder="O que você percebe que esta vivência procura iluminar?"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="seven-day-review"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Revisão após 3 a 7 dias (Consequência &amp; Confirmação)
              </label>
              <textarea
                id="seven-day-review"
                rows={2}
                value={sevenDayReview}
                onChange={(e) => setSevenDayReview(e.target.value)}
                placeholder="Trouxe paz e ordem? Houve confirmação no terreiro ou na prática?"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          {errorMsg}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Voltar
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>
            {saving
              ? "Salvando..."
              : isEdit
                ? "Atualizar registro"
                : "Salvar sonho no diário"}
          </span>
        </button>
      </div>
    </form>
  );
}
