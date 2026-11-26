import type {
  CecClassification,
  CecLevelOption,
  ClarityScore,
  ConfirmationScore,
  EmotionScore,
} from "./types";

export const CLARITY_OPTIONS: CecLevelOption<ClarityScore>[] = [
  {
    value: 1,
    label: "Fragmentos soltos",
    description: "Lembranças breves ou imagens desconexas ao acordar.",
  },
  {
    value: 2,
    label: "Sequência difusa",
    description: "Possui início, meio e fim, porém com cenários embaralhados.",
  },
  {
    value: 3,
    label: "Nitidez moderada",
    description: "Cenas reconhecíveis e boa retenção dos elementos centrais.",
  },
  {
    value: 4,
    label: "Narrativa definida",
    description: "Fluxo coerente com diálogos, símbolos ou orientações claras.",
  },
  {
    value: 5,
    label: "Vivacidade plena",
    description:
      "Riqueza sensorial (visão, som ou percepção) e sentido compreensível.",
  },
];

export const EMOTION_OPTIONS: CecLevelOption<EmotionScore>[] = [
  {
    value: 1,
    label: "Neutra",
    description: "Despertar tranquilo, sem carga emocional marcante.",
  },
  {
    value: 2,
    label: "Sutil",
    description: "Impressão afetiva leve que logo se dissipa.",
  },
  {
    value: 3,
    label: "Moderada",
    description: "Sensação clara de paz, alegria, alerta ou apreensão.",
  },
  {
    value: 4,
    label: "Intensa",
    description: "Impacto profundo ao acordar, com choro, arrepio ou comoção.",
  },
  {
    value: 5,
    label: "Duradoura",
    description: "Ressoa fortemente no corpo e na mente por várias horas.",
  },
];

export const CONFIRMATION_OPTIONS: CecLevelOption<ConfirmationScore>[] = [
  {
    value: 0,
    label: "Sem confirmação ainda",
    description: "Recém-registrado ou sem convergência observada até agora.",
  },
  {
    value: 1,
    label: "Símbolo significativo",
    description: "Um elemento pessoal marcante voltou a chamar atenção.",
  },
  {
    value: 2,
    label: "Leve convergência",
    description: "Pequena repetição onírica ou sincronia no cotidiano.",
  },
  {
    value: 3,
    label: "Múltiplas pistas",
    description: "Dois ou mais sinais apontando na mesma direção.",
  },
  {
    value: 4,
    label: "Validação em terreiro",
    description:
      "Confirmação objetiva junto à casa, dirigente ou orientação espiritual.",
  },
  {
    value: 5,
    label: "Resultado prático",
    description:
      "Desdobramento concreto que trouxe paz, ordem ou solução real.",
  },
];

export const PRE_SLEEP_SUGGESTIONS = [
  "Sereno(a)",
  "Em prece / firmeza",
  "Preocupado(a)",
  "Ansioso(a)",
  "Agitado(a)",
  "Mente dispersa",
] as const;

export const NOTABLE_MARKER_SUGGESTIONS = [
  "Presença de Guia/Entidade",
  "Presença de Orixá",
  "Mensagem ou conselho",
  "Consciência no sonho (lúcido)",
  "Sensação física ao acordar",
  "Paralisia do sono",
  "Receio ou sobressalto",
  "Tema sensível (requer validação)",
] as const;

export const WAKE_FEELING_SUGGESTIONS = [
  "Paz",
  "Alegria",
  "Alívio",
  "Gratidão",
  "Confusão",
  "Saudade",
  "Receio",
  "Angústia",
  "Emocionado(a)",
] as const;

export function calculateCecTotal(
  clarity: ClarityScore,
  emotion: EmotionScore,
  confirmation: ConfirmationScore
): number {
  return clarity + emotion + confirmation;
}

export function classifyCecScore(total: number): CecClassification {
  if (total <= 6) {
    return {
      category: "comum",
      title: "Sonho Comum",
      rangeLabel: "0 a 6 pontos",
      summary:
        "Tende a refletir processamento psíquico cotidiano, memórias recentes e simbologia pessoal.",
      guidance:
        "Observe sem ansiedade quais sentimentos e símbolos pessoais apareceram. Caso padrões emocionais intensos se repitam, considere dialogar com apoio terapêutico.",
    };
  }

  if (total <= 10) {
    return {
      category: "observacao",
      title: "Em Observação",
      rangeLabel: "7 a 10 pontos",
      summary:
        "Sinal intermediário: ainda não basta para afirmar comunicação espiritual isolada, mas merece acompanhamento.",
      guidance:
        "Releia este registro entre 3 e 7 dias. Se o tema se repetir ou houver convergência na vida prática ou no terreiro, atualize a nota de Confirmação.",
    };
  }

  return {
    category: "espiritual",
    title: "Forte Indicativo Espiritual",
    rangeLabel: "11 a 15 pontos",
    summary:
      "Alta combinação entre nitidez narrativa, ressonância emocional e sinais de confirmação.",
    guidance:
      "Cultive discernimento com humildade: valide impressões em comunidade ou com sua liderança espiritual antes de tomar decisões importantes.",
  };
}
