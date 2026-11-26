export type ClarityScore = 1 | 2 | 3 | 4 | 5;
export type EmotionScore = 1 | 2 | 3 | 4 | 5;
export type ConfirmationScore = 0 | 1 | 2 | 3 | 4 | 5;
export type EmotionalValence = "positiva" | "neutra" | "desafiadora";
export type CecCategory = "comum" | "observacao" | "espiritual";

export interface DreamEntry {
  id?: number;
  createdAt: string;
  updatedAt: string;

  // Contexto do sono
  dreamDate: string; // YYYY-MM-DD
  approxTime?: string;
  sleepLocation?: string;
  preSleepStates: string[];
  preSleepCustom?: string;

  // Narrativa & Bússola dos 3 Cs
  title: string;
  narrative: string;
  symbols: string[];
  virtueConnection?: string;
  ethicalAction?: string;

  // Marcadores e estado ao despertar
  notableMarkers: string[];
  notableCustom?: string;
  wakeFeelings: string[];
  wakeCustom?: string;
  emotionalValence: EmotionalValence;

  // Escala CEC (Clareza + Emoção + Confirmação)
  clarity: ClarityScore;
  emotion: EmotionScore;
  confirmation: ConfirmationScore;
  cecTotal: number;

  // Reflexão & Revisão posterior (3 a 7 dias)
  dayReverberation?: string;
  personalInterpretation?: string;
  sevenDayReview?: string;
  reviewedAt?: string;
}

export interface CecLevelOption<T extends number> {
  value: T;
  label: string;
  description: string;
}

export interface CecClassification {
  category: CecCategory;
  title: string;
  rangeLabel: string;
  summary: string;
  guidance: string;
}
