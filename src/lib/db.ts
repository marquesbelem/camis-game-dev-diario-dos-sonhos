import Dexie, { type EntityTable } from "dexie";
import type { DreamEntry } from "./types";
import { calculateCecTotal } from "./cec-scale";

class DiarioDosSonhosDatabase extends Dexie {
  dreams!: EntityTable<DreamEntry, "id">;

  constructor() {
    super("DiarioDosSonhosDB");
    this.version(1).stores({
      dreams: "++id, dreamDate, cecTotal, *symbols, createdAt, reviewedAt",
    });
  }
}

export const db = new DiarioDosSonhosDatabase();

export async function createDreamEntry(
  input: Omit<DreamEntry, "id" | "createdAt" | "updatedAt" | "cecTotal">
): Promise<number> {
  const now = new Date().toISOString();
  const cecTotal = calculateCecTotal(
    input.clarity,
    input.emotion,
    input.confirmation
  );
  const id = await db.dreams.add({
    ...input,
    cecTotal,
    createdAt: now,
    updatedAt: now,
  });
  return Number(id);
}

export async function updateDreamEntry(
  id: number,
  updates: Partial<Omit<DreamEntry, "id" | "createdAt">>
): Promise<void> {
  const existing = await db.dreams.get(id);
  if (!existing) return;

  const clarity = updates.clarity ?? existing.clarity;
  const emotion = updates.emotion ?? existing.emotion;
  const confirmation = updates.confirmation ?? existing.confirmation;

  await db.dreams.update(id, {
    ...updates,
    cecTotal: calculateCecTotal(clarity, emotion, confirmation),
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteDreamEntry(id: number): Promise<void> {
  await db.dreams.delete(id);
}

export async function exportAllDreamsJson(): Promise<string> {
  const dreams = await db.dreams.orderBy("dreamDate").reverse().toArray();
  return JSON.stringify(
    {
      app: "diario-dos-sonhos-escala-cec",
      exportedAt: new Date().toISOString(),
      version: 1,
      entries: dreams,
    },
    null,
    2
  );
}

export async function importDreamsFromJson(rawJson: string): Promise<number> {
  const parsed = JSON.parse(rawJson) as { entries?: DreamEntry[] } | DreamEntry[];
  const list = Array.isArray(parsed) ? parsed : parsed.entries;
  if (!Array.isArray(list)) {
    throw new Error("Formato de backup inválido.");
  }

  const sanitized: Omit<DreamEntry, "id">[] = list
    .filter((item) => item && typeof item.narrative === "string" && typeof item.dreamDate === "string")
    .map((item) => {
      const clarity = ([1, 2, 3, 4, 5].includes(item.clarity) ? item.clarity : 3) as DreamEntry["clarity"];
      const emotion = ([1, 2, 3, 4, 5].includes(item.emotion) ? item.emotion : 3) as DreamEntry["emotion"];
      const confirmation = ([0, 1, 2, 3, 4, 5].includes(item.confirmation)
        ? item.confirmation
        : 0) as DreamEntry["confirmation"];
      const now = new Date().toISOString();

      return {
        createdAt: item.createdAt || now,
        updatedAt: item.updatedAt || now,
        dreamDate: item.dreamDate,
        approxTime: item.approxTime || "",
        sleepLocation: item.sleepLocation || "",
        preSleepStates: Array.isArray(item.preSleepStates) ? item.preSleepStates : [],
        preSleepCustom: item.preSleepCustom || "",
        title: item.title || "Registro importado",
        narrative: item.narrative,
        symbols: Array.isArray(item.symbols) ? item.symbols : [],
        virtueConnection: item.virtueConnection || "",
        ethicalAction: item.ethicalAction || "",
        notableMarkers: Array.isArray(item.notableMarkers) ? item.notableMarkers : [],
        notableCustom: item.notableCustom || "",
        wakeFeelings: Array.isArray(item.wakeFeelings) ? item.wakeFeelings : [],
        wakeCustom: item.wakeCustom || "",
        emotionalValence:
          item.emotionalValence === "positiva" ||
          item.emotionalValence === "desafiadora"
            ? item.emotionalValence
            : "neutra",
        clarity,
        emotion,
        confirmation,
        cecTotal: calculateCecTotal(clarity, emotion, confirmation),
        dayReverberation: item.dayReverberation || "",
        personalInterpretation: item.personalInterpretation || "",
        sevenDayReview: item.sevenDayReview || "",
        reviewedAt: item.reviewedAt || undefined,
      };
    });

  if (sanitized.length === 0) {
    throw new Error("Nenhum registro válido encontrado no arquivo.");
  }

  await db.dreams.bulkAdd(sanitized);
  return sanitized.length;
}
