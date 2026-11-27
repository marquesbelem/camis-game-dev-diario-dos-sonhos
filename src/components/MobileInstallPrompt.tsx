"use client";

import { useEffect, useState } from "react";
import { Download, MoreVertical, PlusSquare, Share, ShieldCheck, X } from "lucide-react";
import { AppLogo } from "./AppLogo";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    __deferredPwaPrompt?: BeforeInstallPromptEvent | null;
  }
}

const DISMISS_STORAGE_KEY = "diario-sonhos-install-dismissed-session";

export function MobileInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showManualFallback, setShowManualFallback] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register Service Worker so mobile browsers enable native PWA installation
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => undefined);
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    if (isStandalone) {
      return;
    }

    const ua = window.navigator.userAgent || "";
    const iosDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1);
    const mobileUA =
      iosDevice || /Android|webOS|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
    const mobileViewport = window.innerWidth < 768;
    const isMobileContext = mobileUA || mobileViewport;

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__deferredPwaPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      setIsIOS(false);
      setShowManualFallback(false);

      const alreadyDismissed =
        window.sessionStorage.getItem(DISMISS_STORAGE_KEY) === "1";
      if (!alreadyDismissed && (mobileUA || window.innerWidth < 768)) {
        setVisible(true);
      }
    }

    function handleAppInstalled() {
      window.__deferredPwaPrompt = null;
      setDeferredPrompt(null);
      setVisible(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    const alreadyDismissed =
      window.sessionStorage.getItem(DISMISS_STORAGE_KEY) === "1";

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isMobileContext && !alreadyDismissed) {
      timer = setTimeout(() => {
        setIsIOS(iosDevice);
        if (window.__deferredPwaPrompt) {
          setDeferredPrompt(window.__deferredPwaPrompt);
        }
        setVisible(true);
      }, 650);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (timer) clearTimeout(timer);
    };
  }, []);

  function handleDismiss() {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_STORAGE_KEY, "1");
    }
    setVisible(false);
  }

  async function handleInstallClick() {
    const activePrompt = deferredPrompt || window.__deferredPwaPrompt;
    if (activePrompt) {
      try {
        await activePrompt.prompt();
        const choice = await activePrompt.userChoice;
        if (choice.outcome === "accepted") {
          window.__deferredPwaPrompt = null;
          setDeferredPrompt(null);
          setVisible(false);
        } else {
          handleDismiss();
        }
      } catch {
        setShowManualFallback(true);
      }
      return;
    }

    setShowManualFallback(true);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="pwa-install-title"
      className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-50 px-3 sm:bottom-5 sm:left-auto sm:right-5 sm:max-w-sm sm:px-0"
    >
      <div className="overflow-hidden rounded-3xl border border-blue-200/90 bg-white/98 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.22)] backdrop-blur-md dark:border-sky-500/35 dark:bg-slate-900/98">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <AppLogo size={46} className="shrink-0 drop-shadow-sm" />
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/80 dark:text-sky-300">
                <ShieldCheck className="h-3 w-3 shrink-0" />
                App Gratuito • Offline
              </span>
              <h2
                id="pwa-install-title"
                className="mt-1 truncate text-sm font-extrabold text-slate-900 dark:text-white"
              >
                Instalar Diário dos Sonhos
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Fechar aviso de instalação"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Adicione à sua tela inicial para abrir em 1 toque logo ao acordar,
          funcionar offline e manter seus registros salvos no aparelho.
        </p>

        {isIOS ? (
          <div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <p className="flex items-center gap-2 font-medium">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-sky-300">
                <Share className="h-3.5 w-3.5" />
              </span>
              <span>
                1. Toque em <strong>Compartilhar</strong> na barra do navegador
              </span>
            </p>
            <p className="flex items-center gap-2 font-medium">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-sky-300">
                <PlusSquare className="h-3.5 w-3.5" />
              </span>
              <span>
                2. Escolha <strong>Adicionar à Tela de Início</strong>
              </span>
            </p>
            <button
              type="button"
              onClick={handleDismiss}
              className="mt-1 w-full rounded-full bg-blue-600 py-2 text-xs font-bold text-white transition hover:bg-blue-700 dark:bg-sky-400 dark:text-slate-950"
            >
              Entendi
            </button>
          </div>
        ) : (
          <>
            {showManualFallback && (
              <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-200">
                <MoreVertical className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p>
                  Toque no menu <strong>⋮</strong> do navegador e selecione{" "}
                  <strong>Instalar aplicativo</strong> ou{" "}
                  <strong>Adicionar à tela inicial</strong>.
                </p>
              </div>
            )}

            <div className="mt-3.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-full border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Agora não
              </button>
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300"
              >
                <Download className="h-3.5 w-3.5 shrink-0" />
                <span>Instalar aplicativo</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
