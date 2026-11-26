import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass, Layers, ShieldAlert, Sparkles } from "lucide-react";
import { BookAffiliateBanner } from "@/components/BookAffiliateBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PixSupportCard } from "@/components/PixSupportCard";
import { SITE_CONFIG } from "@/config/site";
import {
  CLARITY_OPTIONS,
  CONFIRMATION_OPTIONS,
  EMOTION_OPTIONS,
} from "@/lib/cec-scale";

export const metadata: Metadata = {
  title: "Guia da Escala CEC (Clareza, Emoção e Confirmação)",
  description:
    "Entenda como funciona a Escala CEC, a Bússola dos 3 Cs e o registro matinal de sonhos inspirados no livro Sonhos e Mediunidade na Umbanda, de Rodrigo Queiroz.",
  alternates: {
    canonical: "/guia-escala-cec",
  },
};

const FAQ_ITEMS = [
  {
    q: "Para que serve a Escala CEC no Diário dos Sonhos?",
    a: "A Escala CEC (Clareza, Emoção e Confirmação) oferece um critério estruturado de 0 a 15 pontos para ajudar o sonhador a diferenciar sonhos comuns do processamento cotidiano de possíveis vivências ou comunicações espirituais.",
  },
  {
    q: "Um sonho isolado com pontuação alta já confirma uma orientação espiritual?",
    a: "Não necessariamente. A maturidade espiritual recomenda observar recorrências ao longo de 3 a 7 dias e buscar confirmação prática ou orientação junto à liderança do terreiro antes de tomar decisões importantes.",
  },
  {
    q: "Meus registros ficam salvos na internet ou em algum servidor?",
    a: "Não. Todos os seus sonhos são armazenados exclusivamente no seu próprio navegador, com opção de exportar e importar backup em JSON a qualquer momento.",
  },
  {
    q: "A plataforma tem alguma relação comercial com a obra original?",
    a: "Esta é uma ferramenta gratuita, independente e sem fins lucrativos, criada como apoio prático de estudo inspirada no livro Sonhos e Mediunidade na Umbanda, de Rodrigo Queiroz.",
  },
];

export default function GuiaEscalaCecPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-8 sm:px-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao Diário Interativo</span>
          </Link>
        </div>

        <article className="space-y-8">
          <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-sky-300">
              <Sparkles className="h-3.5 w-3.5" />
              Metodologia &amp; Discernimento
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Guia Prático da Escala CEC: Clareza, Emoção e Confirmação
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Inspirada nos ensinamentos do livro{" "}
              <strong>{SITE_CONFIG.book.title}</strong>, de{" "}
              <strong>{SITE_CONFIG.book.author}</strong>, esta metodologia
              propõe transformar lembranças oníricas fugazes em dados
              observáveis, cultivando memória, serenidade e responsabilidade
              mediúnica.
            </p>
          </header>

          {/* Os 3 Pilares */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-bold text-blue-700 dark:text-sky-300">
                1. Clareza (1 a 5)
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Avalia nitidez narrativa e detalhes sensoriais.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {CLARITY_OPTIONS.map((o) => (
                  <li key={o.value}>
                    <strong>{o.value}:</strong> {o.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-bold text-blue-700 dark:text-sky-300">
                2. Emoção (1 a 5)
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Mede a intensidade e persistência afetiva ao acordar.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {EMOTION_OPTIONS.map((o) => (
                  <li key={o.value}>
                    <strong>{o.value}:</strong> {o.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-bold text-blue-700 dark:text-sky-300">
                3. Confirmação (0 a 5)
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Verifica sincronias, repetições e validação posterior.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {CONFIRMATION_OPTIONS.map((o) => (
                  <li key={o.value}>
                    <strong>{o.value}:</strong> {o.label}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Faixas de Interpretação */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600 dark:text-sky-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Como interpretar a soma da Escala CEC (0 a 15)
              </h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <span className="font-display-num text-sm text-slate-700 dark:text-slate-300">
                  0 a 6 pts
                </span>
                <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  Sonho Comum
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Expressão natural da atividade mental e simbologia pessoal do
                  dia a dia.
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50/70 p-4 dark:bg-amber-950/30">
                <span className="font-display-num text-sm text-amber-800 dark:text-amber-300">
                  7 a 10 pts
                </span>
                <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  Em Observação
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Ainda inconclusivo. Acompanhe por 3 a 7 dias para notar se há
                  repetição ou confirmação.
                </p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/50">
                <span className="font-display-num text-sm text-blue-700 dark:text-sky-300">
                  11 a 15 pts
                </span>
                <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  Forte Indicativo Espiritual
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Alta convergência entre clareza, impacto afetivo e sinais de
                  confirmação.
                </p>
              </div>
            </div>
          </section>

          {/* Bússola dos 3 Cs + Ética */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-blue-600 dark:text-sky-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  A Bússola dos 3 Cs
                </h2>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <strong>Clareza:</strong> a lembrança se sustenta de forma
                  nítida?
                </li>
                <li>
                  <strong>Convergência:</strong> outros eventos ou diálogos
                  confirmam o sinal?
                </li>
                <li>
                  <strong>Consequência:</strong> após 7 dias, a leitura gerou
                  paz, ética e organização?
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Ética e Validação Coletiva
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Símbolos oníricos funcionam como bússolas pessoais, não como
                sentenças absolutas. Evite autossugestão, respeite o sigilo de
                terceiros e dialogue com sua mãe/pai de santo ou grupo de
                estudos quando sentir necessidade de confirmação cruzada.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Perguntas Frequentes
            </h2>
            <div className="mt-4 space-y-4">
              {FAQ_ITEMS.map((item) => (
                <div
                  key={item.q}
                  className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 dark:border-slate-800"
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.q}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <BookAffiliateBanner />
          <PixSupportCard />
        </article>
      </main>

      <Footer />
    </div>
  );
}
