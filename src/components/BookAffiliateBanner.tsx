import { BookMarked, ExternalLink } from "lucide-react";
import { SITE_CONFIG, isPlaceholderValue } from "@/config/site";

export function BookAffiliateBanner() {
  const isPlaceholder = isPlaceholderValue(SITE_CONFIG.book.affiliateUrl);

  return (
    <section
      aria-labelledby="livro-referencia-titulo"
      className="relative overflow-hidden rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-6 shadow-sm dark:border-sky-500/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-sky-500/20 dark:text-sky-300">
            <BookMarked className="h-3.5 w-3.5" />
            <span>Obra Base da Metodologia</span>
          </div>
          <h2
            id="livro-referencia-titulo"
            className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl"
          >
            {SITE_CONFIG.book.title} — {SITE_CONFIG.book.author}
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Este diário digital aplica a estrutura prática da{" "}
            <strong>Escala CEC (Clareza, Emoção e Confirmação)</strong>. Para
            aprofundar os fundamentos teológicos, mediúnicos e éticos sobre os
            sonhos na Umbanda, recomendamos a leitura integral da obra original.
          </p>
          {isPlaceholder && (
            <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
              Nota de configuração: defina{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 dark:bg-amber-950">
                NEXT_PUBLIC_BOOK_AFFILIATE_URL
              </code>{" "}
              ou edite{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 dark:bg-amber-950">
                src/config/site.ts
              </code>{" "}
              com seu link de afiliado real.
            </p>
          )}
        </div>

        <a
          href={SITE_CONFIG.book.affiliateUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          <span>{SITE_CONFIG.book.ctaLabel}</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
