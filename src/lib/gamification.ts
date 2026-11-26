import { classifyCecScore } from "./cec-scale";
import type { DreamEntry } from "./types";

export interface GamificationBadge {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  unlocked: boolean;
  progressText: string;
}

export interface SymbolStat {
  symbol: string;
  count: number;
}

export interface FeelingStat {
  feeling: string;
  count: number;
}

export interface GamificationStats {
  totalDreams: number;
  xp: number;
  level: number;
  levelTitle: string;
  levelProgressPct: number;
  nextLevelXp: number;
  currentStreak: number;
  bestStreak: number;
  uniqueSymbolsCount: number;
  reviewedCount: number;
  cecDistribution: {
    comum: number;
    observacao: number;
    espiritual: number;
  };
  topSymbols: SymbolStat[];
  topFeelings: FeelingStat[];
  pendingReviewDreams: DreamEntry[];
  badges: GamificationBadge[];
}

const LEVEL_TITLES = [
  { minXp: 0, level: 1, title: "Despertar do Sonhador" },
  { minXp: 100, level: 2, title: "Observador Matinal" },
  { minXp: 250, level: 3, title: "Tecelão de Símbolos" },
  { minXp: 450, level: 4, title: "Guardião da Clareza" },
  { minXp: 700, level: 5, title: "Cartógrafo Onírico" },
  { minXp: 1000, level: 6, title: "Mestre do Discernimento" },
] as const;

function parseDateDays(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return 0;
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

export function isPendingSevenDayReview(
  dream: DreamEntry,
  todayStr?: string
): boolean {
  if (dream.reviewedAt || !todayStr) return false;
  const ageDays = parseDateDays(todayStr) - parseDateDays(dream.dreamDate);
  // Destaca sonhos com pelo menos 3 dias ou nota CEC intermediária sem revisão
  const category = classifyCecScore(dream.cecTotal).category;
  return ageDays >= 3 && (dream.confirmation === 0 || category === "observacao");
}

export function computeGamificationStats(
  dreams: DreamEntry[],
  todayStr?: string
): GamificationStats {
  const totalDreams = dreams.length;
  const todayEpoch = todayStr ? parseDateDays(todayStr) : 0;

  // Cálculo de XP (Conquistadores + Exploradores)
  let xp = 0;
  let reviewedCount = 0;
  let hasMaxClarity = false;

  const cecDistribution = { comum: 0, observacao: 0, espiritual: 0 };
  const symbolCounts = new Map<string, number>();
  const feelingCounts = new Map<string, number>();
  const uniqueDates = new Set<number>();

  for (const dream of dreams) {
    xp += 30; // Registro base
    if (dream.symbols.length > 0 || dream.virtueConnection?.trim()) {
      xp += 15; // Mapeamento simbólico (3 Cs)
    }
    if (dream.reviewedAt || dream.confirmation > 0) {
      xp += 25; // Revisão / Confirmação
      reviewedCount += 1;
    }
    if (dream.clarity === 5) {
      hasMaxClarity = true;
    }

    const cls = classifyCecScore(dream.cecTotal);
    cecDistribution[cls.category] += 1;

    for (const rawSym of dream.symbols) {
      const clean = rawSym.trim().toLowerCase();
      if (!clean) continue;
      symbolCounts.set(clean, (symbolCounts.get(clean) || 0) + 1);
    }

    for (const feeling of dream.wakeFeelings) {
      const clean = feeling.trim();
      if (!clean) continue;
      feelingCounts.set(clean, (feelingCounts.get(clean) || 0) + 1);
    }

    const epoch = parseDateDays(dream.dreamDate);
    if (epoch > 0) uniqueDates.add(epoch);
  }

  // Cálculo de Streaks (dias seguidos)
  const sortedDays = Array.from(uniqueDates).sort((a, b) => a - b);
  let bestStreak = 0;
  let run = 0;
  for (let i = 0; i < sortedDays.length; i += 1) {
    if (i === 0 || sortedDays[i] === sortedDays[i - 1] + 1) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > bestStreak) bestStreak = run;
  }

  let currentStreak = 0;
  if (sortedDays.length > 0 && todayEpoch > 0) {
    const lastDay = sortedDays[sortedDays.length - 1];
    if (todayEpoch - lastDay <= 1) {
      currentStreak = 1;
      for (let i = sortedDays.length - 2; i >= 0; i -= 1) {
        if (sortedDays[i + 1] - sortedDays[i] === 1) {
          currentStreak += 1;
        } else {
          break;
        }
      }
    }
  }

  // Nível atual
  let currentLevelInfo: (typeof LEVEL_TITLES)[number] = LEVEL_TITLES[0];
  let nextLevelXp: number = LEVEL_TITLES[1].minXp;
  for (let i = 0; i < LEVEL_TITLES.length; i += 1) {
    if (xp >= LEVEL_TITLES[i].minXp) {
      currentLevelInfo = LEVEL_TITLES[i];
      nextLevelXp =
        i + 1 < LEVEL_TITLES.length
          ? LEVEL_TITLES[i + 1].minXp
          : LEVEL_TITLES[i].minXp + 300;
    }
  }
  const span = Math.max(1, nextLevelXp - currentLevelInfo.minXp);
  const levelProgressPct = Math.min(
    100,
    Math.round(((xp - currentLevelInfo.minXp) / span) * 100)
  );

  const topSymbols: SymbolStat[] = Array.from(symbolCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([symbol, count]) => ({ symbol, count }));

  const topFeelings: FeelingStat[] = Array.from(feelingCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([feeling, count]) => ({ feeling, count }));

  const pendingReviewDreams = dreams.filter((d) =>
    isPendingSevenDayReview(d, todayStr)
  );

  const uniqueSymbolsCount = symbolCounts.size;

  const badges: GamificationBadge[] = [
    {
      id: "primeiro-portal",
      title: "Primeiro Portal",
      description: "Registrou o primeiro sonho no diário.",
      iconSrc: "/brand/simbolo-estrela-azul.png",
      unlocked: totalDreams >= 1,
      progressText: `${Math.min(totalDreams, 1)}/1 registro`,
    },
    {
      id: "chama-manha",
      title: "Chama da Manhã",
      description: "Manteve 3 dias consecutivos de registro matinal.",
      iconSrc: "/brand/simbolo-estrela-amarela.png",
      unlocked: bestStreak >= 3,
      progressText: `${Math.min(bestStreak, 3)}/3 dias`,
    },
    {
      id: "guardiao-semana",
      title: "Guardião da Semana",
      description: "Alcançou 7 dias seguidos cultivando memória onírica.",
      iconSrc: "/brand/simbolo-estrela-amarela.png",
      unlocked: bestStreak >= 7,
      progressText: `${Math.min(bestStreak, 7)}/7 dias`,
    },
    {
      id: "alta-nitidez",
      title: "Alta Nitidez",
      description: "Registrou um sonho com nota máxima de Clareza (5/5).",
      iconSrc: "/brand/simbolo-mais-azul.png",
      unlocked: hasMaxClarity,
      progressText: hasMaxClarity ? "Conquistado" : "Clareza 5 pendente",
    },
    {
      id: "ciclo-confirmacao",
      title: "Ciclo da Confirmação",
      description: "Revisou ou confirmou um sonho dias após o registro.",
      iconSrc: "/brand/simbolo-colchete-azul.png",
      unlocked: reviewedCount >= 1,
      progressText: `${Math.min(reviewedCount, 1)}/1 revisão`,
    },
    {
      id: "cartografo-onirico",
      title: "Cartógrafo Onírico",
      description: "Catalogou 10 símbolos distintos em suas experiências.",
      iconSrc: "/brand/simbolo-x-azul.png",
      unlocked: uniqueSymbolsCount >= 10,
      progressText: `${Math.min(uniqueSymbolsCount, 10)}/10 símbolos`,
    },
  ];

  return {
    totalDreams,
    xp,
    level: currentLevelInfo.level,
    levelTitle: currentLevelInfo.title,
    levelProgressPct,
    nextLevelXp,
    currentStreak,
    bestStreak,
    uniqueSymbolsCount,
    reviewedCount,
    cecDistribution,
    topSymbols,
    topFeelings,
    pendingReviewDreams,
    badges,
  };
}
