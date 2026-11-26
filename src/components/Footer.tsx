import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/90 pb-24 pt-8 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-400 sm:pb-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200/80 dark:bg-slate-900/70 dark:ring-slate-800 sm:flex-row sm:items-center">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-sky-400">
              Referência &amp; Direitos Autorais
            </p>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {SITE_CONFIG.book.disclaimer}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/guia-escala-cec"
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-sky-400"
            >
              Guia da Escala CEC
            </Link>
            <a
              href={SITE_CONFIG.book.affiliateUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Conhecer o Livro
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-slate-200/70 pt-6 text-center text-xs dark:border-slate-800/70 sm:flex-row sm:text-left">
          <p className="max-w-md text-slate-500 dark:text-slate-400">
            Seus sonhos permanecem salvos localmente apenas no seu navegador
            (IndexedDB). Nenhum dado pessoal é enviado para servidores externos.
          </p>

          <a
            href={SITE_CONFIG.brand.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 rounded-2xl px-3 py-2 transition hover:bg-slate-50 dark:hover:bg-slate-900 sm:items-end"
          >
            <Image
              src="/brand/logo-camis-claro.png"
              alt="Camis GameDev"
              width={842}
              height={271}
              className="h-10 w-auto object-contain transition-transform group-hover:scale-[1.02] dark:hidden sm:h-12"
            />
            <Image
              src="/brand/logo-camis-escuro.png"
              alt="Camis GameDev"
              width={842}
              height={271}
              className="hidden h-10 w-auto object-contain transition-transform group-hover:scale-[1.02] dark:block sm:h-12"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Desenvolvido por{" "}
              <span className="font-bold text-[#00A1E0] underline decoration-[#00A1E0]/40 underline-offset-4 group-hover:text-[#007EB0] dark:text-[#4DC8F0]">
                {SITE_CONFIG.brand.name}
              </span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
